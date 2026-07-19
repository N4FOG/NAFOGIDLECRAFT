        function updateEnchantingPage() {
            const container = document.getElementById('enchantingRecipes');
            if (!container) return;

            container.innerHTML = '';
            const skillData = gameState.skills.enchanting;

            enchantingRecipes.forEach(recipe => {
                const maxQty = Math.floor((gameState.inventory[recipe.input.type] || 0) / recipe.input.qty);
                const isUnlocked = skillData.level >= recipe.levelReq;
                const workerCount = gameState.workers?.allocated?.[recipe.id] || 0;
                const workerTotal = getWorkerTotal();
                const workerHtml = workerTotal > 0 ? `
                    <div class="worker-control" style="margin-top: 10px; display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <button class="worker-btn" onclick="allocateWorker('${recipe.id}', -1)" ${workerCount <= 0 ? 'disabled' : ''}>-</button>
                        <span class="worker-count" style="font-size: 0.9em; font-family:'Outfit', sans-serif;">👷 ${workerCount}</span>
                        <button class="worker-btn" onclick="allocateWorker('${recipe.id}', 1)" ${getWorkerFree() <= 0 ? 'disabled' : ''}>+</button>
                        <span class="worker-prod" style="font-size: 0.75em; color: #aaa; font-family:'Outfit', sans-serif;">
                            ${workerCount > 0 ? `Gasta: ${workerCount * recipe.input.qty}x/3s` : ''}
                        </span>
                        <button class="worker-btn" style="background:none;border:none;cursor:pointer;font-size:1.1em;padding:0;margin-left:5px;box-shadow:none;transition:transform 0.2s;" onclick="toggleWorkerNotification('${recipe.id}')" title="Alternar notificações">${(gameState.notificationFilters?.workers?.[recipe.id]) ? '🔕' : '🔔'}</button>
                    </div>
                ` : '';

                const card = document.createElement('div');
                card.className = `recipe-card ${isUnlocked ? 'unlocked' : 'locked'}`;

                const isCrafting = gameState.craftingTimers[`enchanting_${recipe.id}`] ? true : false;
                if (isCrafting) card.classList.add('crafting');

                const hasIngredients = gameState.inventory[recipe.input.type] >= recipe.input.qty;
                const totalItems = Object.values(gameState.inventory).filter(q => q > 0).length;
                const hasSpace = totalItems < gameState.bankSlots ||
                    (gameState.inventory[recipe.output.type] > 0 && totalItems <= gameState.bankSlots);

                const canCraft = isUnlocked && hasIngredients && hasSpace && !isCrafting;

                let progressWidth = '0%';
                if (isCrafting) {
                    const timer = gameState.craftingTimers[`enchanting_${recipe.id}`];
                    if (timer) {
                        const elapsed = Date.now() - timer.startTime;
                        const percent = Math.min((elapsed / (timer.craftTime * 1000)) * 100, 100);
                        progressWidth = percent + '%';
                    }
                }

                if (!isUnlocked) {
                    card.innerHTML = `
                        <div class="resource-lock">🔒</div>
                        <div class="recipe-name">
                            ${recipe.icon} ${recipe.name}
                            <span class="recipe-level-req">Nível ${recipe.levelReq}</span>
                        </div>
                        <div class="recipe-desc">${recipe.desc}</div>
                        <div class="recipe-ingredients">
                            <div class="ingredient-row">
                                <span class="ingredient-name">Requer:</span>
                                <span class="ingredient-qty">${recipe.input.qty}x ${getItemName(recipe.input.type)}</span>
                            </div>
                        </div>
                        <div class="recipe-result">
                            <span class="result-name">→ ${recipe.output.name}</span>
                            <span class="result-qty">+${recipe.output.qty}</span>
                        </div>
                        <div class="recipe-stats">
                            <span>🎯 ${recipe.xpGain} XP</span>
                        </div>
                        <button class="craft-btn" disabled>🔒 Bloqueado</button>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="recipe-name">
                            ${recipe.icon} ${recipe.name}
                        </div>
                        <div class="recipe-desc">${recipe.desc}</div>
                        <div class="recipe-ingredients">
                            <div class="ingredient-row">
                                <span class="ingredient-name">Requer:</span>
                                <span class="ingredient-qty">${recipe.input.qty}x ${getItemName(recipe.input.type)}</span>
                            </div>
                        </div>
                        <div class="recipe-result">
                            <span class="result-name">→ ${recipe.output.name}</span>
                            <span class="result-qty">+${recipe.output.qty}</span>
                        </div>
                        <div class="recipe-stats">
                            <span>🎯 ${recipe.xpGain} XP</span>
                        </div>
                        ${workerHtml}
                        <div class="craft-progress">
                            <div class="craft-progress-bar" id="progress_enchanting_${recipe.id}" style="width: ${progressWidth}"></div>
                        </div>
                        <div class="craft-buttons-row" style="display: flex; gap: 8px; width: 100%; margin-top: 10px;">
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('enchanting', '${recipe.id}', 1)"
                                    ${!canCraft ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Encantando...' : '🔮 Encantar (1)'}
                            </button>
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('enchanting', '${recipe.id}', 'all')"
                                    ${!canCraft || maxQty <= 1 ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Encantando...' : `🔮 Todos (${maxQty})`}
                            </button>
                        </div>
                    `;
                }

                container.appendChild(card);
            });
        }





        function updatePetsPage() {
            const grid = document.getElementById('petsGrid');
            if (!grid) return;
            grid.innerHTML = '';
            
            // Seção do Livro de Conquistas (se houver pets consagrados)
            const enshrinedCount = getEnshrinedCount();
            const hasMasteryBonus = enshrinedCount > 0;
            
            if (hasMasteryBonus) {
                // Coletar todos os tipos de bônus de mestria ativos
                const masteries = [];
                for (const petId in gameState.pets.enshrined) {
                    if (!gameState.pets.enshrined[petId]) continue;
                    const pet = pets.find(p => p.id === petId);
                    if (pet && pet.masteryBonus) {
                        const unit = (pet.masteryBonus.type === 'strengthBonus' || pet.masteryBonus.type === 'healthBonus') ? '' : '%';
                        masteries.push({
                            icon: pet.icon,
                            name: pet.name,
                            label: getMasteryBonusLabel(pet.masteryBonus.type),
                            value: pet.masteryBonus.value,
                            unit: unit
                        });
                    }
                }

                const masterySection = document.createElement('div');
                masterySection.style.cssText = 'grid-column:1/-1; margin-bottom:16px; padding:16px; background:linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.04)); border:1px solid rgba(255,215,0,0.3); border-radius:12px;';
                masterySection.innerHTML = `
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="font-size:2em;">📖</div>
                        <div>
                            <div style="font-size:1.1em; font-weight:bold; color:#ffd700; font-family:'Cinzel',serif;">LIVRO DE CONQUISTAS</div>
                            <div style="font-size:0.8em; color:#d4a574;">${enshrinedCount} Mestre${enshrinedCount > 1 ? 's' : ''} Consagrado${enshrinedCount > 1 ? 's' : ''} — Bônus permanentes ativos mesmo com outro mascote equipado</div>
                        </div>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        ${masteries.map(m => `
                            <div style="display:flex; align-items:center; gap:6px; padding:6px 12px; background:rgba(255,215,0,0.1); border-radius:20px; font-size:0.85em;">
                                <span>${m.icon}</span>
                                <span style="color:#e0d0a0;">${m.name}:</span>
                                <span style="color:#ffd700; font-weight:bold;">${m.label} +${m.value}${m.unit}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                grid.appendChild(masterySection);
            }

            // Migração: consagrar pets que já estavam no nível máximo em saves antigos
            // (Feito inline para evitar recursão — enshrinePet chama updatePetsPage)
            if (!gameState.pets.enshrined) gameState.pets.enshrined = {};
            let migratedAny = false;
            pets.forEach(pet => {
                if (gameState.pets.owned.includes(pet.id)) {
                    const state = getPetState(pet.id);
                    if (state.level >= 10 && !gameState.pets.enshrined[pet.id]) {
                        gameState.pets.enshrined[pet.id] = true;
                        migratedAny = true;
                    }
                }
            });
            if (migratedAny) {
                checkAchievements();
                saveGame();
            }

            pets.forEach(pet => {
                const owned = gameState.pets.owned.includes(pet.id);
                const active = gameState.pets.active === pet.id;
                const isEnshrined = gameState.pets.enshrined?.[pet.id];
                
                let feedHtml = '';
                let xpBarHtml = '';
                let levelBadgeHtml = '';
                let consecrationHtml = '';

                if (owned) {
                    const state = getPetState(pet.id);
                    levelBadgeHtml = `<div class="pet-level-badge">Nv. ${state.level}</div>`;
                    
                    const req = 200 * state.level;
                    const pct = state.level >= 10 ? 100 : (state.xp / req) * 100;
                    
                    xpBarHtml = `
                        <div class="pet-xp-container">
                            <div style="display:flex; justify-content:space-between; font-size:0.75em; color:#bbb; font-family:'Outfit', sans-serif;">
                                <span>XP: ${state.level >= 10 ? 'MÁXIMO' : `${state.xp}/${req}`}</span>
                                <span>${state.level >= 10 ? '100%' : `${Math.floor(pct)}%`}</span>
                            </div>
                            <div class="pet-xp-bar-bg">
                                <div class="pet-xp-bar-fill" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;

                    // Seção de consagração (level max) vs alimentação (level < 10 e ativo)
                    if (state.level >= 10) {
                        const unit = (pet.masteryBonus?.type === 'strengthBonus' || pet.masteryBonus?.type === 'healthBonus') ? '' : '%';
                        // A migração (acima) já consagra automaticamente pets nível 10;
                        // o else com botão foi removido — a consagração é 100% automática agora
                        consecrationHtml = `
                            <div style="margin-top:8px; padding:8px; background:linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.08)); border:1px solid rgba(255,215,0,0.4); border-radius:8px; text-align:center;">
                                <div style="font-size:0.85em; font-weight:bold; color:#ffd700; font-family:'Cinzel',serif;">📖 MESTRE CONSAGRADO ✨</div>
                                <div style="font-size:0.75em; color:#d4a574; margin-top:4px;">${getMasteryBonusLabel(pet.masteryBonus.type)} +${pet.masteryBonus.value}${unit} (permanente)</div>
                            </div>`;
                    } else if (active && state.level < 10) {
                        const foodItems = [
                            { key: 'cookedFish1', name: '🐟 Pequeno Assado', xp: 20 },
                            { key: 'cookedFish2', name: '🐠 Salmão Assado', xp: 50 },
                            { key: 'cookedFish3', name: '🍣 Atum Assado', xp: 120 },
                            { key: 'cookedFish4', name: '🥩 Peixe-espada Grelhado', xp: 250 },
                            { key: 'cookedFish5', name: '✨ Peixe Mágico Assado', xp: 600 }
                        ];

                        const availableFoods = foodItems.map(food => {
                            const qty = gameState.inventory[food.key] || 0;
                            return `
                                <div class="feed-food-item">
                                    <span style="font-family:'Outfit', sans-serif;">${food.name} (x${qty})</span>
                                    <button class="feed-food-item-btn" onclick="feedPet('${pet.id}', '${food.key}', ${food.xp})" ${qty <= 0 ? 'disabled' : ''}>+${food.xp} XP</button>
                                </div>
                            `;
                        }).join('');

                        feedHtml = `
                            <div class="pet-feed-section">
                                <div style="font-size:0.8em; font-weight:bold; color:#00ffcc; font-family:'Outfit', sans-serif; text-align:center;">🍖 Alimentar Companheiro:</div>
                                <div class="feed-food-selector">
                                    ${availableFoods || '<div style="font-size:0.75em;color:#888;text-align:center;">Nenhuma comida cozinhada no inventário!</div>'}
                                </div>
                            </div>
                        `;
                    }
                }

                const card = document.createElement('div');
                card.className = `pet-card ${owned ? 'owned' : ''} ${active ? 'active' : ''}`;
                if (isEnshrined) card.classList.add('enshrined');
                
                const petState = owned ? getPetState(pet.id) : { level: 1 };
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const val = Math.round(pet.effectValue * levelMultiplier);

                const petEffectLabel =
                    pet.effectType === 'xpBoost'     ? '+' + val + '% XP em ' + pet.effect :
                    pet.effectType === 'doubleChance' ? '+' + val + '% chance duplicar coleta' :
                    pet.effectType === 'rareChance'   ? '+' + val + '% chance peixe de tier superior' :
                    pet.effectType === 'combatBoost'  ? '+' + val + '% dano em combate' :
                    pet.effectType === 'allBoost'     ? '+' + val + '% em tudo (global)' :
                    '+' + val + '%';

                card.innerHTML = `${levelBadgeHtml}<div class="pet-icon">${pet.icon}</div><div class="pet-name">${pet.name}</div><div class="pet-desc">${pet.description}</div>
                <div class="pet-effect">✨ Efeito atual: ${petEffectLabel}<br>🎁 Coleta automática: ${pet.autoCollectChance}% chance a cada 30s</div>
                <div class="pet-price">💰 ${pet.price} ouro</div>
                ${xpBarHtml}
                ${feedHtml}
                ${consecrationHtml}`;

                const btn = document.createElement('button');
                if (!owned) { btn.className = 'pet-btn buy'; btn.textContent = '🐉 Adquirir'; btn.onclick = () => buyPet(pet.id); }
                else if (active) { btn.className = 'pet-btn active'; btn.textContent = '✅ Ativo'; btn.disabled = true; }
                else { btn.className = 'pet-btn activate'; btn.textContent = '✨ Ativar'; btn.onclick = () => activatePet(pet.id); }
                card.appendChild(btn);
                grid.appendChild(card);
            });
            document.getElementById('activePetName').textContent = gameState.pets.active ? getPetName(gameState.pets.active) : 'Nenhum';
        }

        function updateTechTreePage() {
            const container = document.getElementById('techTreeGrid');
            if (!container) return;
            container.innerHTML = '';
            const cats = { gathering: { name: '🌾 Coleta', icon: '🌾' }, combat: { name: '⚔️ Combate', icon: '⚔️' }, crafting: { name: '🔨 Artesanato', icon: '🔨' }, alchemy: { name: '🧪 Alquimia', icon: '🧪' } };
            for (let [catId, cat] of Object.entries(cats)) {
                const category = gameState.techTree[catId];
                if (!category) continue;
                const catDiv = document.createElement('div');
                catDiv.className = 'tech-category';
                catDiv.innerHTML = `<div class="tech-header"><div class="tech-header-icon">${cat.icon}</div><h3>${cat.name}</h3></div><div class="tech-upgrades" id="tech-${catId}"></div>`;
                container.appendChild(catDiv);
                const upgradesDiv = document.getElementById(`tech-${catId}`);
                category.upgrades.forEach(up => {
                    const reqMet = !up.required || category.upgrades.find(u => u.id === up.required)?.currentLevel > 0;
                    const div = document.createElement('div');
                    div.className = 'tech-upgrade';
                    const effectDesc = {
                        xpBoost:      `+${up.effectValue * up.currentLevel || up.effectValue}% XP por nível`,
                        doubleChance: `+${up.effectValue}% chance duplicar por nível`,
                        autoSpeed:    `−${up.effectValue}s intervalo por nível`,
                        criticalChance:`+${up.effectValue}% chance crítico por nível`,
                        lifesteal:    `+${up.effectValue}% roubo de vida por nível`,
                        healthBoost:  `+${up.effectValue}% vida máxima por nível`,
                        costReduction:`+${up.effectValue}% chance preservar material por nível`,
                        craftSpeed:   `−${up.effectValue}% tempo de craft por nível`,
                        valueBoost:   `+${up.effectValue}% chance craftar 2x por nível`,
                        potionDuration:`+${up.effectValue}% duração de poção por nível`,
                        potionPower:  `+${up.effectValue}% potência de poção por nível`,
                        doublePotion: `+${up.effectValue}% chance craftar 4x por nível`,
                    }[up.effectType] || `+${up.effectValue}% por nível`;
                    const currentEffect = up.currentLevel > 0 ? ` (atual: ${up.effectValue * up.currentLevel}%)` : '';
                    div.innerHTML = `<div class="tech-name">${up.name}</div><div class="tech-level">Nível ${up.currentLevel}/${up.maxLevel}</div>
                    <div class="tech-effect">📈 ${effectDesc}${currentEffect}</div>
                    <div class="tech-cost">💰 ${up.currentLevel >= up.maxLevel ? 'Máximo' : up.cost * (up.currentLevel + 1)}</div>
                    <button class="tech-btn" onclick="buyTechUpgrade('${catId}', '${up.id}')" ${up.currentLevel >= up.maxLevel || !reqMet ? 'disabled' : ''}>${up.currentLevel >= up.maxLevel ? '✓ Máximo' : !reqMet ? '🔒 Bloqueado' : '🔬 Melhorar'}</button>`;
                    upgradesDiv.appendChild(div);
                });
            }
        }
