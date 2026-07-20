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
                try {
                    const doubleChance = applyTechBonus('doublePotion') / 100;
                    let qty = 1;
                    if (Math.random() < doubleChance) qty = 4;

                    const cyborgChance = getCharacterClassPassive('doubleCraft');
                    if (cyborgChance > 0 && Math.random() * 100 < cyborgChance) {
                        qty *= 2;
                    }

                    gameState.alchemy.inventory[potionId] = (gameState.alchemy.inventory[potionId] || 0) + qty;

                    // XP de herbalismo (skill base da alquimia)
                    if (potion.xpGain) {
                        addXP('herbalism', potion.xpGain * qty);
                    }

                    // Grande Observatório
                    if (typeof incrementPotionMade === 'function') {
                        incrementPotionMade();
                    }

                    showNotification('✅ Poção criada!', `+${qty} ${potion.name}`, 'success', potion.icon);
                } catch(e) {
                    console.error('Erro ao fabricar poção:', e);
                } finally {
                    delete gameState.craftingTimers[timerId];
                    updateAlchemyPage();
                    updateUI();
                }
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

                    const workerCount = gameState.workers?.allocated?.[p.id] || 0;
                    const workerTotal = typeof getWorkerTotal === 'function' ? getWorkerTotal() : 0;
                    const herbLvl = gameState.skills?.herbalism?.level || 1;
                    const meetsLevel = herbLvl >= p.levelReq;
                    const workerHtml = workerTotal > 0 ? `
                        <div class="worker-control" style="margin-top: 10px; display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <button class="worker-btn" onclick="allocateWorker('${p.id}', -1)" ${workerCount <= 0 ? 'disabled' : ''}>-</button>
                            <span class="worker-count" style="font-size: 0.9em; font-family:'Outfit', sans-serif;">👷 ${workerCount}</span>
                            <button class="worker-btn" onclick="allocateWorker('${p.id}', 1)" ${getWorkerFree() <= 0 ? 'disabled' : ''}>+</button>
                            <button class="worker-btn" style="background:none;border:none;cursor:pointer;font-size:1.1em;padding:0;margin-left:5px;box-shadow:none;transition:transform 0.2s;" onclick="toggleWorkerNotification('${p.id}')" title="Alternar notificações">${(gameState.notificationFilters?.workers?.[p.id]) ? '🔕' : '🔔'}</button>
                        </div>
                        ${!meetsLevel ? `<div style="color:#ff8844;font-size:0.78em;text-align:center;margin-top:4px;font-family:'Outfit',sans-serif;">⚠️ Herbalismo ${p.levelReq} necessário (seu nível: ${herbLvl})</div>` : ''}
                    ` : '';

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
                        ${workerHtml}
                    `;
                    craftGrid.appendChild(card);
                });
            }
            const workerTotal = typeof getWorkerTotal === 'function' ? getWorkerTotal() : 0;
            const autoPotPanel = document.getElementById('autoPotterAllocationPanel');
            if (autoPotPanel) {
                if (workerTotal > 0) {
                    autoPotPanel.style.display = 'block';
                    const allocated = gameState.workers?.allocated?.['auto_potter'] || 0;
                    document.getElementById('autoPotterWorkerDisplay').textContent = `${allocated} / 7`;
                    document.getElementById('btnDecAutoPotter').disabled = allocated <= 0;
                    document.getElementById('btnIncAutoPotter').disabled = allocated >= 7 || (typeof getWorkerFree === 'function' && getWorkerFree() <= 0);

                    // Montar lista de poções com auto ativado (excluindo instant_heal)
                    const autoList = Object.entries(gameState.alchemy?.autoUseSettings || {})
                        .filter(([id, on]) => on && id !== 'instant_heal')
                        .map(([id]) => id);

                    const now = Date.now();
                    const slotsEl = document.getElementById('autoPotterWorkerSlots');
                    if (slotsEl) {
                        slotsEl.innerHTML = '';
                        for (let i = 0; i < allocated; i++) {
                            const assignedId = autoList[i] || null;
                            const potion = assignedId ? potions.find(p => p.id === assignedId) : null;
                            const activeData = assignedId ? gameState.alchemy?.activePotions?.[assignedId] : null;
                            const isActive = activeData && activeData.startedAt && (now - activeData.startedAt) / 1000 < activeData.duration;

                            let statusHtml, borderColor, bgColor;

                            if (!potion) {
                                // Trabalhador alocado mas sem poção atribuída
                                statusHtml = `
                                    <div style="font-size:1.6em; margin-bottom:4px;">👷</div>
                                    <div style="font-size:0.75em; color:#888; font-weight:bold;">Aguardando</div>
                                    <div style="font-size:0.7em; color:#666; margin-top:2px;">Nenhuma poção<br>marcada para ele</div>
                                `;
                                borderColor = 'rgba(255,255,255,0.08)';
                                bgColor = 'rgba(0,0,0,0.2)';
                            } else if (isActive) {
                                // Poção ativa — trabalhador "de plantão"
                                const remaining = activeData.duration - (now - activeData.startedAt) / 1000;
                                const mins = Math.floor(remaining / 60);
                                const secs = Math.floor(remaining % 60);
                                const pct = Math.max(0, Math.min(100, (remaining / activeData.duration) * 100));
                                statusHtml = `
                                    <div style="font-size:1.4em; margin-bottom:3px;">${potion.icon}</div>
                                    <div style="font-size:0.72em; color:#4aff4a; font-weight:bold; white-space:nowrap;">${potion.name}</div>
                                    <div style="font-size:0.68em; color:#aaa; margin-top:2px;">⏳ expira em ${mins}:${String(secs).padStart(2,'0')}</div>
                                    <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; margin-top:5px; overflow:hidden;">
                                        <div style="height:100%; width:${pct}%; background:#4aff4a; border-radius:2px; transition:width 1s linear;"></div>
                                    </div>
                                    <div style="font-size:0.65em; color:#4a9aff; margin-top:3px;">👷 De plantão</div>
                                `;
                                borderColor = '#4aff4a55';
                                bgColor = 'rgba(74,255,74,0.05)';
                            } else {
                                // Poção expirou — trabalhador vai reativar
                                const hasStock = (gameState.alchemy?.inventory?.[assignedId] || 0) > 0;
                                statusHtml = `
                                    <div style="font-size:1.4em; margin-bottom:3px; filter:grayscale(1); opacity:0.7;">${potion.icon}</div>
                                    <div style="font-size:0.72em; color:#ffd700; font-weight:bold; white-space:nowrap;">${potion.name}</div>
                                    ${hasStock
                                        ? `<div style="font-size:0.68em; color:#4a9aff; margin-top:2px;">🔄 Reativando...</div>`
                                        : `<div style="font-size:0.68em; color:#ff6644; margin-top:2px;">⚠️ Sem estoque</div>`
                                    }
                                    <div style="font-size:0.65em; color:#aaa; margin-top:3px;">👷 Esperando</div>
                                `;
                                borderColor = hasStock ? '#4a9aff55' : '#ff664455';
                                bgColor = hasStock ? 'rgba(74,154,255,0.05)' : 'rgba(255,102,68,0.05)';
                            }

                            const slot = document.createElement('div');
                            slot.style.cssText = `
                                flex: 0 0 calc(14.2% - 8px);
                                min-width: 90px;
                                max-width: 120px;
                                background: ${bgColor};
                                border: 1px solid ${borderColor};
                                border-radius: 10px;
                                padding: 8px 6px;
                                text-align: center;
                                font-family: 'Outfit', sans-serif;
                                transition: border-color 0.3s, background 0.3s;
                            `;
                            slot.innerHTML = statusHtml;
                            slotsEl.appendChild(slot);
                        }

                        if (allocated === 0) {
                            slotsEl.innerHTML = '<div style="font-size:0.8em;color:#666;font-style:italic;">Nenhum trabalhador alocado.</div>';
                        }
                    }
                } else {
                    autoPotPanel.style.display = 'none';
                }
            }

            const invGrid = document.getElementById('potionsInventoryGrid');
            if (invGrid) {
                invGrid.innerHTML = '';
                for (let [id, qty] of Object.entries(gameState.alchemy.inventory)) {
                    if (qty > 0) {
                        const p = potions.find(p => p.id === id);
                        if (p) {
                            const autoUseChecked = gameState.alchemy.autoUseSettings?.[id] ? true : false;
                            const isInstantHeal = id === 'instant_heal';
                            const autoUseHtml = !isInstantHeal && workerTotal > 0 ? `
                                <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.85em; font-family:'Outfit', sans-serif; background:rgba(0,0,0,0.2); padding:4px 8px; border-radius:6px; margin-right:10px; border:1px solid ${autoUseChecked ? '#4a9aff' : 'rgba(255,255,255,0.05)'};">
                                    <input type="checkbox" ${autoUseChecked ? 'checked' : ''} onchange="toggleAutoUsePotion('${id}')" style="accent-color:#4a9aff; cursor:pointer; width:14px; height:14px; margin:0;">
                                    <span style="color: ${autoUseChecked ? '#4a9aff' : '#aaa'}; font-weight:${autoUseChecked ? 'bold' : 'normal'};">Auto</span>
                                </label>
                            ` : '';

                            const div = document.createElement('div');
                            div.className = 'inventory-potion';
                            div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:#2a3a4a;padding:10px;border-radius:8px;margin-bottom:8px;';
                            div.innerHTML = `
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="font-size:1.2em;">${p.icon}</span>
                                    <div style="text-align:left;">
                                        <div style="font-weight:bold; color:#fff; font-size:0.9em; font-family:'Outfit', sans-serif;">${p.name}</div>
                                        <div style="font-size:0.8em; color:#ffd700; font-family:'Outfit', sans-serif;">Quantidade: x${qty}</div>
                                    </div>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    ${autoUseHtml}
                                    <button class="potion-btn use" onclick="usePotion('${id}')" style="padding: 6px 12px; font-size: 0.85em; font-weight: bold; border-radius: 6px;">✨ Usar</button>
                                </div>
                            `;
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

        window.allocateAutoPotterWorker = function(delta) {
            if (!gameState.workers) gameState.workers = { allocated: {} };
            const current = gameState.workers.allocated['auto_potter'] || 0;
            const next = current + delta;
            if (next < 0 || next > 7) return;
            if (delta > 0 && typeof getWorkerFree === 'function' && getWorkerFree() <= 0) {
                showNotification('👷 Sem trabalhadores!', 'Todos estão ocupados.', 'error', '🏕️');
                return;
            }
            gameState.workers.allocated['auto_potter'] = next;
            if (next === 0) delete gameState.workers.allocated['auto_potter'];
            
            updateAlchemyPage();
            if (typeof updateWorkerSummary === 'function') updateWorkerSummary();
            updateUI();
        };

        window.toggleAutoUsePotion = function(potionId) {
            if (!gameState.alchemy.autoUseSettings) gameState.alchemy.autoUseSettings = {};
            gameState.alchemy.autoUseSettings[potionId] = !gameState.alchemy.autoUseSettings[potionId];
            updateAlchemyPage();
        };

        window.checkAutoPotter = function() {
            if (!gameState) return;
            if (!gameState.workers) gameState.workers = { allocated: {} };
            if (!gameState.workers.allocated) gameState.workers.allocated = {};
            
            const N = gameState.workers.allocated['auto_potter'] || 0;
            if (N <= 0) return;

            if (!gameState.alchemy) gameState.alchemy = { inventory: {}, activePotions: {}, craftingTimers: {}, autoUseSettings: {} };
            if (!gameState.alchemy.autoUseSettings) gameState.alchemy.autoUseSettings = {};
            if (!gameState.alchemy.activePotions) gameState.alchemy.activePotions = {};
            if (!gameState.alchemy.inventory) gameState.alchemy.inventory = {};

            const now = Date.now();

            // Lista de poções marcadas para auto (excluindo instant_heal), na ordem
            const autoList = Object.entries(gameState.alchemy.autoUseSettings)
                .filter(([id, on]) => on && id !== 'instant_heal')
                .map(([id]) => id);

            // Cada trabalhador (slot 0..N-1) é responsável pela poção autoList[i]
            // Se não há poção para aquele slot, ele fica ocioso
            for (let i = 0; i < N; i++) {
                const potionId = autoList[i];
                if (!potionId) continue;

                // Verifica se a poção deste trabalhador está ativa
                const active = gameState.alchemy.activePotions[potionId];
                const isActive = active && active.startedAt && (now - active.startedAt) / 1000 < active.duration;

                if (!isActive && (gameState.alchemy.inventory[potionId] || 0) > 0) {
                    usePotion(potionId);
                }
            }
        };

