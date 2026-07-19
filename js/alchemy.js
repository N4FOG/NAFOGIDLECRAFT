        // ============================================
        // FUNÇÕES DE ALQUIMIA
        // ============================================
        function craftPotion(potionId) {
            const potion = potions.find(p => p.id === potionId);
            if (!potion) return;

            const timerId = `alchemy_${potionId}`;
            if (gameState.craftingTimers[timerId]) {
                showNotification('❌ Ocupado!', 'Já está fabricando esta poção.', 'error');
                return;
            }

            for (let ing of potion.ingredients) {
                if ((gameState.inventory[ing.type] || 0) < ing.qty) {
                    showNotification('❌ Ingredientes!', `Faltam ${ing.qty}x ${getItemName(ing.type)}.`, 'error');
                    return;
                }
            }
            if (!hasInventorySpace() && !gameState.alchemy.inventory[potionId]) {
                showNotification('❌ Inventário cheio!', 'Libere espaço.', 'error');
                return;
            }
            for (let ing of potion.ingredients) gameState.inventory[ing.type] -= ing.qty;

            const craftTime = potion.craftTime;
            gameState.craftingTimers[timerId] = {
                startTime: Date.now(),
                craftTime: craftTime,
                skill: 'alchemy',
                recipe: { id: potionId }
            };

            showNotification('🧪 Alquimia!', `Preparando ${potion.name}...`, 'success', potion.icon);
            updateAlchemyPage();
            updateUI();

            setTimeout(() => {
                const doubleChance = applyTechBonus('doublePotion') / 100;
                let qty = 1;
                if (Math.random() < doubleChance) qty = 4;

                const cyborgChance = getCharacterClassPassive('doubleCraft');
                if (cyborgChance > 0 && Math.random() * 100 < cyborgChance) {
                    qty *= 2;
                }

                gameState.alchemy.inventory[potionId] = (gameState.alchemy.inventory[potionId] || 0) + qty;
                delete gameState.craftingTimers[timerId];

                showNotification('✅ Poção criada!', `+${qty} ${potion.name}`, 'success', potion.icon);
                updateAlchemyPage();
                updateUI();
            }, craftTime * 1000);
        }

        function usePotion(potionId) {
            const potion = potions.find(p => p.id === potionId);
            if (!potion || (gameState.alchemy.inventory[potionId] || 0) <= 0) return;

            // Tech: potionPower — aumenta o valor do efeito
            const powerBonus = applyTechBonus('potionPower');
            const boostedValue = Math.floor(potion.effectValue * (1 + powerBonus / 100));

            if (potion.effectType === 'heal') {
                const heal = Math.floor(gameState.combat.maxPlayerHealth * (boostedValue / 100));
                gameState.combat.playerHealth = Math.min(gameState.combat.playerHealth + heal, gameState.combat.maxPlayerHealth);
                showNotification('❤️ Curado!', `+${heal} de vida!${powerBonus > 0 ? ' (Potência +' + powerBonus + '%)' : ''}`, 'success');
            } else {
                let durationBonus = 1 + (applyTechBonus('potionDuration') / 100);
                const alienBonus = getCharacterClassPassive('potionDuration');
                if (alienBonus > 0) durationBonus += alienBonus / 100;
                const finalDuration = potion.duration * durationBonus;
                gameState.alchemy.activePotions[potionId] = {
                    remaining: finalDuration,
                    startedAt: Date.now(),
                    duration: finalDuration,
                    effectType: potion.effectType,
                    effectValue: boostedValue
                };
                const mins = Math.floor(finalDuration / 60);
                const secs = Math.floor(finalDuration % 60);
                const timeStr = mins > 0 ? (mins + 'min' + (secs > 0 ? ' ' + secs + 's' : '')) : (secs + 's');
                showNotification('🧪 Poção ativada!', `${potion.name} por ${timeStr}!${powerBonus > 0 ? ' (Potência +' + powerBonus + '%)' : ''}`, 'success', potion.icon);
            }
            gameState.alchemy.inventory[potionId]--;
            updateUI();
            updateAlchemyPage();
        }

        function applyPotionEffects(type, value) {
            // Retorna o valor do efeito da poção ativa do tipo solicitado (em %)
            // Se não houver poção ativa desse tipo, retorna 0
            for (let id in gameState.alchemy.activePotions) {
                const p = gameState.alchemy.activePotions[id];
                if ((Date.now() - p.startedAt) / 1000 >= p.duration) { delete gameState.alchemy.activePotions[id]; continue; }
                if (p.effectType === type) {
                    const powerBonus = applyTechBonus('potionPower');
                    return p.effectValue * (1 + powerBonus / 100);
                }
            }
            return 0;
        }


        function updateAlchemyPage() {
            const craftGrid = document.getElementById('potionsCraftGrid');
            if (craftGrid) {
                craftGrid.innerHTML = '';
                potions.forEach(p => {
                    let ingredientsHtml = '';
                    p.ingredients.forEach(ing => {
                        const has = (gameState.inventory[ing.type] || 0) >= ing.qty;
                        ingredientsHtml += `<div style="color: ${has ? '#4aff4a' : '#ff4444'}">${ing.qty}x ${getItemName(ing.type)}</div>`;
                    });

                    const timerId = `alchemy_${p.id}`;
                    const isCrafting = gameState.craftingTimers[timerId] ? true : false;
                    
                    let progressWidth = '0%';
                    if (isCrafting) {
                        const timer = gameState.craftingTimers[timerId];
                        if (timer) {
                            const elapsed = Date.now() - timer.startTime;
                            progressWidth = Math.min((elapsed / (timer.craftTime * 1000)) * 100, 100) + '%';
                        }
                    }

                    const card = document.createElement('div');
                    card.className = `potion-card ${isCrafting ? 'crafting' : ''}`;
                    card.innerHTML = `
                        <div class="potion-icon">${p.icon}</div>
                        <div class="potion-name">${p.name}</div>
                        <div class="potion-desc">${p.description}</div>
                        <div class="potion-duration">⏱️ ${Math.floor(p.duration / 60)}min</div>
                        <div class="potion-ingredients"><strong>📦 Ingredientes:</strong>${ingredientsHtml}</div>
                        <div class="craft-progress">
                            <div class="craft-progress-bar" id="progress_alchemy_${p.id}" style="width: ${progressWidth}"></div>
                        </div>
                        <button class="potion-btn ${isCrafting ? 'crafting' : ''}" onclick="craftPotion('${p.id}')" ${isCrafting ? 'disabled' : ''}>
                            ${isCrafting ? '⏳ Preparando...' : '🧪 Craftar'}
                        </button>
                    `;
                    craftGrid.appendChild(card);
                });
            }
            const invGrid = document.getElementById('potionsInventoryGrid');
            if (invGrid) {
                invGrid.innerHTML = '';
                for (let [id, qty] of Object.entries(gameState.alchemy.inventory)) {
                    if (qty > 0) {
                        const p = potions.find(p => p.id === id);
                        if (p) {
                            const div = document.createElement('div');
                            div.className = 'inventory-potion';
                            div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:#2a3a4a;padding:10px;border-radius:8px;margin-bottom:8px;';
                            div.innerHTML = `<span>${p.icon} ${p.name}</span><span style="color:#ffd700;">x${qty}</span><button class="potion-btn use" onclick="usePotion('${id}')">✨ Usar</button>`;
                            invGrid.appendChild(div);
                        }
                    }
                }
                if (invGrid.children.length === 0) invGrid.innerHTML = '<div style="text-align:center;color:#aaa;padding:20px;">Nenhuma poção</div>';
            }
            const activeGrid = document.getElementById('activePotionsGrid');
            if (activeGrid) {
                activeGrid.innerHTML = '';
                for (let [id, data] of Object.entries(gameState.alchemy.activePotions)) {
                    const elapsed = (Date.now() - data.startedAt) / 1000;
                    if (elapsed >= data.duration) { delete gameState.alchemy.activePotions[id]; continue; }
                    const remaining = data.duration - elapsed;
                    const p = potions.find(p => p.id === id);
                    if (p) {
                        const mins = Math.floor(remaining / 60);
                        const secs = Math.floor(remaining % 60);
                        const div = document.createElement('div');
                        div.className = 'active-potion';
                        div.style.cssText = 'background:#1e2a36;border-radius:10px;padding:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;';
                        div.innerHTML = `<div><span style="color:#ffd700;">${p.icon} ${p.name}</span><div style="font-size:0.8em;color:#aaa;">${p.effect}</div></div><div style="color:#4aff4a;font-family:monospace;">${mins}:${secs.toString().padStart(2, '0')}</div>`;
                        activeGrid.appendChild(div);
                    }
                }
                if (activeGrid.children.length === 0) activeGrid.innerHTML = '<div style="text-align:center;color:#aaa;padding:20px;">Nenhuma poção ativa</div>';
            }
            document.getElementById('activePotionsCount').textContent = Object.keys(gameState.alchemy.activePotions).length;
        }

        function showAlchemyTab(tab) {
            gameState.currentAlchemyTab = tab;
            document.querySelectorAll('#alchemyPage .shop-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#alchemyPage .shop-section').forEach(s => s.classList.remove('active'));
            if (tab === 'craft') { document.querySelectorAll('#alchemyPage .shop-tab')[0].classList.add('active'); document.getElementById('alchemyCraftSection').classList.add('active'); }
            else if (tab === 'inventory') { document.querySelectorAll('#alchemyPage .shop-tab')[1].classList.add('active'); document.getElementById('alchemyInventorySection').classList.add('active'); updateAlchemyPage(); }
            else { document.querySelectorAll('#alchemyPage .shop-tab')[2].classList.add('active'); document.getElementById('alchemyActiveSection').classList.add('active'); updateAlchemyPage(); }
        }
