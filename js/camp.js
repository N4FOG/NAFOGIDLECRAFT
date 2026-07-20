        // ============================================
        // SISTEMA DE PROPRIEDADE
        // ============================================

        // --- Dados de configuração ---
        const propertyDefs = {
            farm: {
                name: 'Fazenda', icon: '🌾',
                desc: 'Plante culturas que crescem com o tempo e geram recursos automaticamente.',
                maxLevel: 5,
                upgradeCosts: [300, 800, 2000, 5000, 12000],
                slotsByLevel: [2, 3, 4, 5, 6, 8],
                crops: [
                    { id: 'wood1',  name: 'Madeira',  icon: '🪵', growTime: 60,  qty: 3,  reqLevel: 1 },
                    { id: 'ore1',   name: 'Cobre',    icon: '🥉', growTime: 90,  qty: 2,  reqLevel: 1 },
                    { id: 'fish1',  name: 'Peixe',    icon: '🐟', growTime: 120, qty: 2,  reqLevel: 2 },
                    { id: 'wood2',  name: 'Carvalho', icon: '🌳', growTime: 180, qty: 2,  reqLevel: 2 },
                    { id: 'ore2',   name: 'Ferro',    icon: '⚙️', growTime: 240, qty: 2,  reqLevel: 3 },
                    { id: 'fish2',  name: 'Salmão',   icon: '🐠', growTime: 300, qty: 1,  reqLevel: 3 },
                    { id: 'wood3',  name: 'Teixo',    icon: '🌲', growTime: 420, qty: 1,  reqLevel: 4 },
                    { id: 'ore3',   name: 'Prata',    icon: '🥈', growTime: 600, qty: 1,  reqLevel: 4 },
                    { id: 'wood5',  name: 'Mágica',   icon: '✨', growTime: 900, qty: 1,  reqLevel: 5 },
                    { id: 'ore5',   name: 'Mitril',   icon: '💫', growTime: 1200,qty: 1,  reqLevel: 5 },
                ]
            },
            sawmill: {
                name: 'Serraria', icon: '🪚',
                desc: 'Converte madeira bruta em madeira refinada automaticamente.',
                maxLevel: 5,
                upgradeCosts: [400, 1000, 2500, 6000, 14000],
                recipes: [
                    { input: 'wood1', output: 'wood2', qty: 3, time: 30,  reqLevel: 1 },
                    { input: 'wood2', output: 'wood3', qty: 3, time: 60,  reqLevel: 2 },
                    { input: 'wood3', output: 'wood4', qty: 3, time: 120, reqLevel: 3 },
                    { input: 'wood4', output: 'wood5', qty: 3, time: 240, reqLevel: 4 },
                ]
            },
            forge: {
                name: 'Forja Pessoal', icon: '⚒️',
                desc: 'Funde minérios em barras passivamente sem precisar ir à Ferraria.',
                maxLevel: 5,
                upgradeCosts: [400, 1000, 2500, 6000, 14000],
                recipes: [
                    { input: 'ore1', output: 'bar1', qty: 3, time: 30,  reqLevel: 1 },
                    { input: 'ore2', output: 'bar2', qty: 3, time: 60,  reqLevel: 2 },
                    { input: 'ore3', output: 'bar3', qty: 3, time: 120, reqLevel: 3 },
                    { input: 'ore4', output: 'bar4', qty: 3, time: 240, reqLevel: 4 },
                    { input: 'ore5', output: 'bar5', qty: 3, time: 480, reqLevel: 5 },
                ]
            },
            stable: {
                name: 'Estábulo', icon: '🐴',
                desc: 'Treina seus mascotes, aumentando a frequência de coleta automática.',
                maxLevel: 5,
                upgradeCosts: [500, 1200, 3000, 7000, 15000],
                bonusByLevel: [0, 40, 55, 65, 75, 85], // % chance de coleta (base 30%)
                intervalByLevel: [30000, 25000, 20000, 15000, 12000, 10000] // ms
            },
            library: {
                name: 'Biblioteca', icon: '📚',
                desc: 'Gera XP passivamente para a skill que você escolher estudar.',
                maxLevel: 5,
                upgradeCosts: [350, 900, 2200, 5500, 13000],
                xpPerMinByLevel: [0, 5, 12, 25, 45, 80]
            },
            tavern: {
                name: 'Taverna', icon: '🍺',
                desc: 'Gera ouro passivamente ao longo do tempo.',
                maxLevel: 5,
                upgradeCosts: [300, 750, 1800, 4500, 11000],
                goldPerMinByLevel: [0, 3, 8, 18, 35, 65]
            },
            workerCamp: {
                name: 'Acampamento', icon: '🏕️',
                desc: 'Contrate trabalhadores para coletar recursos automaticamente a cada ciclo.',
                maxLevel: 10,
                upgradeCosts: [250, 700, 1600, 4000, 10000, 25000, 60000, 150000, 350000, 800000],
                // total de trabalhadores disponíveis por nível
                workersByLevel: [0, 2, 4, 7, 11, 16, 22, 29, 37, 46, 56]
            }
        };

        // --- Upgrade ---
        function upgradeProperty(id) {
            const def  = propertyDefs[id];
            const prop = gameState.property[id];
            if (!def || !prop) return;
            if (prop.level >= def.maxLevel) return;
            const cost = def.upgradeCosts[prop.level];
            if (gameState.gold < cost) { showNotification('❌ Ouro!', `Precisa de ${cost} 💰.`, 'error'); return; }
            gameState.gold -= cost;
            prop.level++;
            // Inicializar slots da fazenda
            if (id === 'farm') {
                const slots = propertyDefs.farm.slotsByLevel[prop.level];
                while (prop.slots.length < slots) prop.slots.push(null);
            }
            showNotification(`${def.icon} Melhorado!`, `${def.name} nível ${prop.level}!`, 'success', def.icon);
            updateUI();
            updatePropertyPage();
        }

        // ============================================
        // SISTEMA DE TRABALHADORES
        // ============================================

        function getWorkerTotal() {
            const lvl = gameState.property.workerCamp?.level || 0;
            return propertyDefs.workerCamp.workersByLevel[lvl];
        }

        function getWorkerAllocated() {
            return Object.values(gameState.workers?.allocated || {}).reduce((s, v) => s + v, 0);
        }

        function getWorkerFree() {
            return getWorkerTotal() - getWorkerAllocated();
        }

        function allocateWorker(resourceId, delta) {
            if (!gameState.workers) gameState.workers = { allocated: {} };
            const current = gameState.workers.allocated[resourceId] || 0;
            const next = current + delta;
            if (next < 0) return;
            if (delta > 0 && getWorkerFree() <= 0) {
                showNotification('👷 Sem trabalhadores!', 'Todos estão ocupados. Melhore o Acampamento para contratar mais.', 'error', '🏕️');
                return;
            }
            gameState.workers.allocated[resourceId] = next;
            if (next === 0) delete gameState.workers.allocated[resourceId];
            const page = gameState.currentPage;
            if (page === 'woodcutting' || page === 'mining' || page === 'fishing' || page === 'herbalism') updateResourcesPage(page);
            else if (page === 'cooking') updateCookingPage();
            else if (page === 'crafting') updateCraftingPage();
            else if (page === 'smithing') updateSmithingPage();
            else if (page === 'enchanting') updateEnchantingPage();
            updateWorkerSummary();
            updateUI();
        }

        function getResourceTier(resourceId) {
            const match = resourceId.match(/\d+$/);
            return match ? parseInt(match[0]) : 1;
        }

        let workerCycleInterval = null;

        function startWorkerCycle() {
            if (workerCycleInterval) clearInterval(workerCycleInterval);
            workerCycleInterval = setInterval(() => {
                if (!gameState.workers?.allocated) return;
                if (getWorkerTotal() === 0) return;

                let anyWork = false;
                for (const resourceId in gameState.workers.allocated) {
                    const count = gameState.workers.allocated[resourceId];
                    if (count <= 0) continue;
                    
                    let skill = '';
                    for (const s of ['woodcutting', 'mining', 'fishing', 'herbalism']) {
                        if (resources[s]?.find(r => r.id === resourceId)) { skill = s; break; }
                    }
                    
                    let recipe = null;
                    let craftSkill = null;
                    if (!skill) {
                        // É uma receita de craft?
                        recipe = cookingRecipes.find(r => r.id === resourceId);
                        if (recipe) craftSkill = 'cooking';
                        else {
                            recipe = craftingRecipes.find(r => r.id === resourceId);
                            if (recipe) craftSkill = 'crafting';
                            else {
                                recipe = smithingRecipes.find(r => r.id === resourceId);
                                if (recipe) craftSkill = 'smithing';
                                else {
                                    recipe = enchantingRecipes.find(r => r.id === resourceId);
                                    if (recipe) craftSkill = 'enchanting';
                                }
                            }
                        }
                    }
                    
                    const finalCategory = skill || craftSkill;
                    const isMuted = gameState.notificationFilters?.workers?.[resourceId] || gameState.notificationFilters?.categories?.[finalCategory];

                    if (recipe && craftSkill) {
                            if (gameState.skills[craftSkill].level < recipe.levelReq) continue;
                            
                            const available = gameState.inventory[recipe.input.type] || 0;
                            const maxQtyPossible = Math.floor(available / recipe.input.qty);
                            let realQtyToProduce = Math.min(count, maxQtyPossible);
                            
                            // FORJA: Limitar pela quantidade de calor e Zonas
                            let workerForgeBurnChance = 0;
                            let workerForgeDoubleChance = 0;
                            let totalProducedWorkers = 0;
                            let finalInputConsumed = 0;

                            if (craftSkill === 'smithing') {
                                const currentHeat = gameState.property.forge.heat;
                                let speedMult = 1;

                                if (currentHeat > 80) {
                                    speedMult = 3;
                                    workerForgeBurnChance = 0.20;
                                } else if (currentHeat >= 50 && currentHeat <= 80) {
                                    workerForgeDoubleChance = 0.15;
                                }
                                
                                realQtyToProduce = Math.min(count * speedMult, maxQtyPossible);
                            }
                            
                            if (realQtyToProduce > 0) {
                                let heatConsumed = 0;
                                let heatIdle = 0;
                                for(let w = 0; w < realQtyToProduce; w++) {
                                    // Consome 1 calor por item (apenas para smithing)
                                    if (craftSkill === 'smithing') {
                                        if (gameState.property.forge.heat <= 0) {
                                            heatIdle++;
                                            continue;
                                        }
                                        gameState.property.forge.heat--;
                                        heatConsumed++;
                                        // Artesão: 30% de chance de economizar 1 calor
                                        if (gameState.property.forge.spec === 'artisan' && Math.random() < 0.30) {
                                            gameState.property.forge.heat++;
                                            if (typeof addForgeLog === 'function') addForgeLog('🔧 Artesão economizou 1 Calor!', 'artisan');
                                        }
                                        // Mestre das Chamas: 15% de chance de economizar 1 calor
                                        if (gameState.property.forge.spec === 'flameMaster' && Math.random() < 0.15) {
                                            gameState.property.forge.heat++;
                                            if (typeof addForgeLog === 'function') addForgeLog('🛡️ Mestre das Chamas economizou 1 Calor!', 'artisan');
                                        }
                                    }
                                    
                                    if (craftSkill === 'smithing' && workerForgeBurnChance > 0 && Math.random() < workerForgeBurnChance) {
                                        if (typeof addForgeLog === 'function') addForgeLog('🔥 Trab. Zona Vermelha: 1x ' + recipe.output.name + ' perdido! (calor consumido)', 'zone');
                                        continue;
                                    }
                                    finalInputConsumed += recipe.input.qty;
                                    let outputQty = recipe.output.qty;
                                    if (craftSkill === 'smithing' && workerForgeDoubleChance > 0 && Math.random() < workerForgeDoubleChance) {
                                        outputQty *= 2;
                                        if (typeof addForgeLog === 'function') addForgeLog('🟢 Trab. Zona Verde: ×2 → ' + outputQty + ' ' + getItemName(recipe.output.type) + ' (+' + (outputQty / 2) + ')', 'zone');
                                    }
                                    // Drop de Escória Brilhante (2% base, 10% com Fundidor)
                                    const slagChanceWorkers = gameState.property.forge.spec === 'founder' ? 0.10 : 0.02;
                                    if (craftSkill === 'smithing' && Math.random() < slagChanceWorkers) {
                                        gameState.inventory['slag'] = (gameState.inventory['slag'] || 0) + 1;
                                        // Conta como craft no Grande Observatório
                                        if (typeof incrementItemsCrafted === 'function') incrementItemsCrafted(1);
                                        if (typeof addForgeLog === 'function') addForgeLog('✨ Trab. +1 Escória Brilhante!', 'zone');
                                    }
                                    // Centelha Poderosa: 10% de chance de +1 barra extra
                                    if (craftSkill === 'smithing' && gameState.property.forge.spec === 'spark' && Math.random() < 0.10) {
                                        outputQty += 1;
                                        if (typeof addForgeLog === 'function') addForgeLog('⚡ Trab. Centelha Poderosa: +1 ' + getItemName(recipe.output.type) + ' extra! (total: ' + outputQty + ')', 'craft');
                                    }
                                    totalProducedWorkers += outputQty;
                                }
                                if (heatIdle > 0 && heatConsumed === 0 && typeof addForgeLog === 'function') {
                                    addForgeLog('🥶 Trab. pararam — Fornalha sem calor!', 'error');
                                    if (typeof showNotification === 'function') showNotification('🥶 Fornalha Fria!', 'Trabalhadores pararam por falta de calor.', 'error');
                                }
                                
                                gameState.inventory[recipe.input.type] -= finalInputConsumed;
                                const actualAttempts = craftSkill === 'smithing' ? Math.floor(finalInputConsumed / recipe.input.qty) : realQtyToProduce;
                                const petWorkerXP = applyPetBonus(craftSkill, 'xpBoost');
                                const xpGained = Math.floor(recipe.xpGain * actualAttempts * petWorkerXP);
                                addXP(craftSkill, xpGained);
                                
                                if (totalProducedWorkers > 0) {
                                    // Incrementa contador de itens criados para estatísticas
                                    if (['cooking', 'crafting', 'smithing', 'enchanting'].includes(craftSkill)) {
                                        if (typeof incrementItemsCrafted === 'function') {
                                            incrementItemsCrafted(totalProducedWorkers);
                                        }
                                    }
                                    
                                    if (!isMuted) {
                                        if (equipmentData[recipe.output.type]) {
                                            let hasSlots = false;
                                            for (let k = 0; k < totalProducedWorkers; k++) {
                                                const finalId = addNewEquipmentToInventory(recipe.output.type);
                                                if (finalId && finalId.startsWith('inst_')) hasSlots = true;
                                            }
                                            const slotMsg = hasSlots ? ' (com slots de runa!)' : '';
                                            showNotification(
                                                `👷 Trabalhadores (${craftSkill === 'smithing' ? '⚒️' : '🔨'})`,
                                                `${count} trabalhador${count > 1 ? 'es' : ''} produziu ${totalProducedWorkers}x ${recipe.output.name}${slotMsg} (+${xpGained}XP)`,
                                                'success', '🏕️'
                                            );
                                        } else {
                                            gameState.inventory[recipe.output.type] = (gameState.inventory[recipe.output.type] || 0) + totalProducedWorkers;
                                            showNotification(
                                                `👷 Trabalhadores (${craftSkill === 'cooking' ? '🍳' : craftSkill === 'crafting' ? '🔨' : craftSkill === 'smithing' ? '⚒️' : '🔮'})`,
                                                `${count} trabalhador${count > 1 ? 'es' : ''} produziu ${totalProducedWorkers}x ${recipe.output.name} (+${xpGained}XP)`,
                                                'success', '🏕️'
                                            );
                                        }
                                    } else {
                                        if (!equipmentData[recipe.output.type]) {
                                            gameState.inventory[recipe.output.type] = (gameState.inventory[recipe.output.type] || 0) + totalProducedWorkers;
                                        } else {
                                            for (let k = 0; k < totalProducedWorkers; k++) {
                                                addNewEquipmentToInventory(recipe.output.type);
                                            }
                                        }
                                    }
                                } else if (craftSkill === 'smithing' && workerForgeBurnChance > 0 && !isMuted) {
                                    showNotification('🔥 Tudo Queimou!', 'Os trabalhadores queimaram todo o material devido ao superaquecimento!', 'error');
                                }
                                
                                if (gameState.currentPage === craftSkill) {
                                    if (craftSkill === 'cooking') updateCookingPage();
                                    else if (craftSkill === 'crafting') updateCraftingPage();
                                    else if (craftSkill === 'smithing') updateSmithingPage();
                                    else if (gameState.currentPage === 'enchanting') updateEnchantingPage();
                                }
                                anyWork = true;
                            }
                            continue;
                        }

                    const resource = resources[skill].find(r => r.id === resourceId);
                    if (!resource) continue;
                    if (gameState.skills[skill].level < resource.levelReq) continue;

                    const tier = getResourceTier(resourceId);
                    let qty  = count;

                    // SERRARIA: Lâmina e Durabilidade
                    let bladePenalty = false;
                    if (skill === 'woodcutting') {
                        if (gameState.property.sawmill.bladeId && gameState.property.sawmill.bladeDurability > 0) {
                            gameState.property.sawmill.bladeDurability -= count;
                            if (gameState.property.sawmill.bladeDurability <= 0) {
                                gameState.property.sawmill.bladeDurability = 0;
                                gameState.property.sawmill.bladeId = null;
                                showNotification('⚙️ Lâmina Quebrada!', 'A lâmina da serraria dos trabalhadores quebrou!', 'error');
                            }
                            if (Math.random() < 0.05) { // 5% chance para âmbar
                                gameState.inventory['amber'] = (gameState.inventory['amber'] || 0) + 1;
                                // Conta como coleta no Grande Observatório
                                if (typeof incrementItemsGathered === 'function') incrementItemsGathered(1);
                            }
                        } else {
                            bladePenalty = true;
                        }
                    }

                    if (bladePenalty) {
                        qty = Math.floor(qty * 0.5) || 1; // Produz menos sem lâmina
                    }

                    // Automato workerEfficiency: +15% de eficácia para todos os trabalhadores ativos
                    const automatonBonus = getCharacterClassPassive('workerEfficiency');
                    if (automatonBonus > 0) {
                        qty = Math.floor(qty * (1 + automatonBonus / 100)) || qty;
                        if (Math.random() * 100 < automatonBonus) qty += 1;
                    }

                    // Bardo workerSpeed: +10% de velocidade/produção para trabalhadores passivos
                    const bardBonus = getCharacterClassPassive('workerSpeed');
                    if (bardBonus > 0) {
                        if (Math.random() * 100 < bardBonus) qty += 1;
                    }

                    // Abelha Rainha: +10% de chance de coletar recursos extras (escalado por nível)
                    if (gameState && gameState.pets && gameState.pets.active === 'abelha_rainha') {
                        const petState = getPetState('abelha_rainha');
                        const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                        const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'abelha_rainha') : null;
                        const baseAbelha = petData ? (petData.effectValue || 10) : 10;
                        const abelhaBonus = baseAbelha * levelMultiplier;
                        if (Math.random() * 100 < abelhaBonus) qty += 1;
                    }

                    // Pet doubleChance (ex: Salamandra de Lava para mineração)
                    const petDouble = applyPetBonus(skill, 'double');
                    if (Math.random() < petDouble) qty += 1;

                    if (!hasInventorySpace() && !gameState.inventory[resourceId]) continue;


                    gameState.inventory[resourceId] = (gameState.inventory[resourceId] || 0) + qty;
                    
                    // Incrementa contador de itens coletados para estatísticas
                    if (['woodcutting', 'mining', 'fishing', 'herbalism'].includes(skill)) {
                        if (typeof incrementItemsGathered === 'function') {
                            incrementItemsGathered(qty);
                        }
                    }
                    
                    const petWorkerXP = applyPetBonus(skill, 'xpBoost');
                    const xpGain = Math.floor(resource.xpGain * count * petWorkerXP);
                    addXP(skill, xpGain);

                    if (!isMuted) {
                        showNotification(
                            `👷 Trabalhadores`,
                            `${count} trabalhador${count > 1 ? 'es' : ''} coletou ${qty}x ${resource.icon} ${resource.name} (+${xpGain}XP)`,
                            'success', '🏕️'
                        );
                    }
                    anyWork = true;
                }
                if (anyWork) updateUI();
            }, 3000);
        }

        // ============================================
        // PRODUÇÃO OFFLINE DE TRABALHADORES
        // ============================================
        const MAX_OFFLINE_SECONDS = 8 * 3600; // Limite: 8 horas
        const WORKER_INTERVAL_SECS = 3;       // Ciclo real: 3 segundos

        function applyOfflineWorkerProduction(lastSaveTimestamp) {
            if (!gameState.workers?.allocated) return;
            if (getWorkerTotal() === 0) return;

            const offlineMs  = Date.now() - (lastSaveTimestamp || Date.now());
            const offlineSecs = Math.min(offlineMs / 1000, MAX_OFFLINE_SECONDS);

            // Só exibir popup se ficou offline mais de 60 segundos
            if (offlineSecs < 60) return;

            const cycles = Math.floor(offlineSecs / WORKER_INTERVAL_SECS);
            if (cycles <= 0) return;

            const collected = {}; // { resourceId: qty }

            for (const resourceId in gameState.workers.allocated) {
                const count = gameState.workers.allocated[resourceId];
                if (count <= 0) continue;

                // Apenas workers de coleta bruta (woodcutting, mining, fishing, herbalism)
                let skill = '';
                for (const s of ['woodcutting', 'mining', 'fishing', 'herbalism']) {
                    if (resources[s]?.find(r => r.id === resourceId)) { skill = s; break; }
                }
                if (!skill) continue; // Craft/smithing/cooking não processam offline

                const resource = resources[skill].find(r => r.id === resourceId);
                if (!resource) continue;
                if (gameState.skills[skill].level < resource.levelReq) continue;

                const tier = getResourceTier(resourceId);
                let qtyPerCycle = count;

                // Sem lâmina: penalty de 50% para woodcutting
                if (skill === 'woodcutting') {
                    const hasBlade = gameState.property.sawmill?.bladeId &&
                                     (gameState.property.sawmill?.bladeDurability || 0) > 0;
                    if (!hasBlade) qtyPerCycle = Math.floor(qtyPerCycle * 0.5) || 1;
                    // Lâmina NÃO consome durabilidade offline (simplificação)
                }

                // Bônus de classe (automato / bardo)
                const automatonBonus = getCharacterClassPassive('workerEfficiency');
                if (automatonBonus > 0) {
                    qtyPerCycle = Math.floor(qtyPerCycle * (1 + automatonBonus / 100)) || qtyPerCycle;
                }

                const totalQty = qtyPerCycle * cycles;
                gameState.inventory[resourceId] = (gameState.inventory[resourceId] || 0) + totalQty;
                collected[resourceId] = (collected[resourceId] || 0) + totalQty;

                // Incrementa contador para Grande Observatório
                if (typeof incrementItemsGathered === 'function') {
                    incrementItemsGathered(totalQty);
                }
                // Conta por tipo de recurso
                if (skill === 'woodcutting' && typeof incrementTreeCut === 'function') {
                    incrementTreeCut(totalQty);
                } else if (skill === 'mining' && typeof incrementResourcesMined === 'function') {
                    incrementResourcesMined(totalQty);
                } else if (skill === 'fishing' && typeof incrementFishCaught === 'function') {
                    incrementFishCaught(totalQty);
                } else if (skill === 'herbalism' && typeof incrementHerbsGathered === 'function') {
                    incrementHerbsGathered(totalQty);
                }

                // XP offline com bônus do mascote ativo
                const petWorkerXP = applyPetBonus(skill, 'xpBoost');
                const offlineXpGain = Math.floor(resource.xpGain * count * cycles * petWorkerXP);
                addXP(skill, offlineXpGain);
            }

            const itemsCollected = Object.keys(collected).length;
            if (itemsCollected === 0) return;

            // Exibir popup de retorno offline
            showOfflineProductionPopup(offlineSecs, collected);
        }

        function showOfflineProductionPopup(secs, collected) {
            const modal = document.getElementById('offlineProductionModal');
            if (!modal) return;

            // Formatar tempo offline
            const h = Math.floor(secs / 3600);
            const m = Math.floor((secs % 3600) / 60);
            const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;

            const timeEl = document.getElementById('offlineTimeDisplay');
            if (timeEl) timeEl.textContent = timeStr;

            const listEl = document.getElementById('offlineCollectedList');
            if (listEl) {
                listEl.innerHTML = '';
                for (const [resourceId, qty] of Object.entries(collected)) {
                    const item = inventoryItems.find(i => i.key === resourceId);
                    const icon = item ? item.icon : '📦';
                    const name = item ? item.name : resourceId;
                    const row = document.createElement('div');
                    row.style.cssText = 'display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);';
                    row.innerHTML = `
                        <span style="font-size:1.3em;">${icon}</span>
                        <span style="flex:1; font-family:'Outfit'; font-size:0.9em; color:#ddd;">${name}</span>
                        <span style="font-family:'Cinzel'; font-size:0.95em; color:#ffd700; font-weight:700;">+${formatNumber(qty)}</span>
                    `;
                    listEl.appendChild(row);
                }
            }

            modal.style.display = 'flex';
        }

        function updateWorkerSummary() {
            const el = document.getElementById('workerSummaryBar');
            if (!el) return;
            const total = getWorkerTotal();
            const used  = getWorkerAllocated();
            const free  = total - used;
            if (total === 0) {
                el.textContent = '👷 Sem acampamento — construa em Minha Propriedade';
                el.style.color = '#4a5a6a';
            } else {
                el.textContent = `👷 Trabalhadores: ${used}/${total} ocupados · ${free} livre${free !== 1 ? 's' : ''}`;
                el.style.color = free > 0 ? '#4aff4a' : '#ffd700';
            }
        }

        function plantCrop(slotIdx, cropId) {
            const prop = gameState.property.farm;
            if (prop.level === 0) return;
            if (prop.slots[slotIdx] !== null) return; // já plantado
            const crop = propertyDefs.farm.crops.find(c => c.id === cropId);
            if (!crop || crop.reqLevel > prop.level) return;
            prop.slots[slotIdx] = { cropId, plantedAt: Date.now(), growTime: crop.growTime };
            updatePropertyPage();
        }

        function harvestCrop(slotIdx) {
            const prop = gameState.property.farm;
            const slot = prop.slots[slotIdx];
            if (!slot) return;
            const elapsed = (Date.now() - slot.plantedAt) / 1000;
            if (elapsed < slot.growTime) return;
            const crop = propertyDefs.farm.crops.find(c => c.id === slot.cropId);
            if (!crop) return;
            if (hasInventorySpace() || gameState.inventory[crop.id]) {
                gameState.inventory[crop.id] = (gameState.inventory[crop.id] || 0) + crop.qty;
                
                // Incrementa contador para Grande Observatório
                if (typeof incrementItemsGathered === 'function') {
                    incrementItemsGathered(crop.qty);
                }
                // Conta árvores se for madeira
                if (crop.id && crop.id.startsWith('wood') && typeof incrementTreeCut === 'function') {
                    incrementTreeCut(crop.qty);
                }
                // Conta minérios
                if (crop.id && crop.id.startsWith('ore') && typeof incrementResourcesMined === 'function') {
                    incrementResourcesMined(crop.qty);
                }
                // Conta peixes
                if (crop.id && crop.id.startsWith('fish') && typeof incrementFishCaught === 'function') {
                    incrementFishCaught(crop.qty);
                }
                
                showNotification(`${crop.icon} Colheita!`, `+${crop.qty} ${crop.name} da fazenda!`, 'success', crop.icon);
            }
            prop.slots[slotIdx] = null;
            updateUI();
            updatePropertyPage();
        }

        function harvestAll() {
            const prop = gameState.property.farm;
            let count = 0;
            prop.slots.forEach((slot, i) => {
                if (!slot) return;
                const elapsed = (Date.now() - slot.plantedAt) / 1000;
                if (elapsed >= slot.growTime) { harvestCrop(i); count++; }
            });
            if (count === 0) showNotification('⏳ Aguarde!', 'Nenhuma cultura pronta ainda.', 'info');
        }

        // --- Serraria / Forja ---
        function startPropertyCraft(id, recipeIdx) {
            const def  = propertyDefs[id];
            const prop = gameState.property[id];
            if (!def || !prop || prop.level === 0) return;
            if (prop.queue !== null) { showNotification('⏳ Ocupado!', `${def.name} já está processando.`, 'info'); return; }
            const recipe = def.recipes[recipeIdx];
            if (!recipe || recipe.reqLevel > prop.level) return;
            if ((gameState.inventory[recipe.input] || 0) < recipe.qty) {
                showNotification('❌ Materiais!', `Precisa de ${recipe.qty}x ${getItemName(recipe.input)}.`, 'error'); return;
            }
            gameState.inventory[recipe.input] -= recipe.qty;
            prop.queue = { recipeIdx, startedAt: Date.now(), time: recipe.time };
            prop.progress = 0;
            showNotification(`${def.icon} Processando!`, `${getItemName(recipe.input)} → ${getItemName(recipe.output)}`, 'success', def.icon);
            updatePropertyPage();
        }

        function collectPropertyCraft(id) {
            const def  = propertyDefs[id];
            const prop = gameState.property[id];
            if (!prop.queue) return;
            const recipe = def.recipes[prop.queue.recipeIdx];
            const elapsed = (Date.now() - prop.queue.startedAt) / 1000;
            if (elapsed < recipe.time) { showNotification('⏳ Aguarde!', 'Ainda processando...', 'info'); return; }
            gameState.inventory[recipe.output] = (gameState.inventory[recipe.output] || 0) + 1;
            
            // Incrementa contador para Grande Observatório
            if (id === 'sawmill') {
                // Serraria processa madeira
                if (typeof incrementItemsCrafted === 'function') {
                    incrementItemsCrafted(1);
                }
            } else if (id === 'forge') {
                // Forja processa minério em barras
                if (typeof incrementItemsCrafted === 'function') {
                    incrementItemsCrafted(1);
                }
            }
            
            showNotification(`${def.icon} Pronto!`, `+1 ${getItemName(recipe.output)}`, 'success', def.icon);
            prop.queue = null;
            prop.progress = 0;
            updateUI();
            updatePropertyPage();
        }

        // --- Biblioteca ---
        function setStudySkill(skill) {
            gameState.property.library.studySkill = skill;
            updatePropertyPage();
        }

        // --- Tick passivo (chamado a cada 10s) ---
        function propertyTick() {
            const now = Date.now();
            const prop = gameState.property;

            // Biblioteca — XP passivo
            if (prop.library.level > 0) {
                let xpPerMin = propertyDefs.library.xpPerMinByLevel[prop.library.level];
                const brainBonus = getCharacterClassPassive('librarySpeed');
                if (brainBonus > 0) xpPerMin = Math.floor(xpPerMin * (1 + brainBonus / 100));

                const elapsed  = (now - (prop.library.lastTick || now)) / 60000;
                const xpGained = Math.floor(xpPerMin * elapsed);
                if (xpGained > 0 && prop.library.studySkill) {
                    addXP(prop.library.studySkill, xpGained);
                    prop.library.xpAccum = (prop.library.xpAccum || 0) + xpGained;
                }
                prop.library.lastTick = now;
            }

            // Taverna — ouro passivo
            if (prop.tavern.level > 0) {
                const goldPerMin = propertyDefs.tavern.goldPerMinByLevel[prop.tavern.level];
                const elapsed    = (now - (prop.tavern.lastTick || now)) / 60000;
                let goldMult     = 1 + getClassPassive('goldBoost') / 100;
                
                const merchBonus = getCharacterClassPassive('goldAndDiscount');
                if (merchBonus > 0) goldMult += merchBonus / 100;

                const goldGained = Math.floor(goldPerMin * elapsed * goldMult);
                if (goldGained > 0) {
                    gameState.gold += goldGained;
                    prop.tavern.goldAccum = (prop.tavern.goldAccum || 0) + goldGained;
                }
                prop.tavern.lastTick = now;
            }

            // Estábulo — melhora mascote
            if (prop.stable.level > 0 && gameState.pets.active) {
                // Reinicia o intervalo de coleta do mascote com o novo intervalo
                const newInterval = propertyDefs.stable.intervalByLevel[prop.stable.level];
                if (!prop.stable._currentInterval || prop.stable._currentInterval !== newInterval) {
                    prop.stable._currentInterval = newInterval;
                    if (gameState.pets.autoCollectInterval) clearInterval(gameState.pets.autoCollectInterval);
                    gameState.pets.autoCollectInterval = setInterval(() => {
                        if (!gameState.pets.active) return;
                        const activePet = pets.find(p => p.id === gameState.pets.active);
                        if (!activePet || !activePet.autoCollect) return;
                        const chance = propertyDefs.stable.bonusByLevel[prop.stable.level];
                        if (Math.random() * 100 < chance && hasInventorySpace()) {
                            gameState.inventory[activePet.autoCollect] = (gameState.inventory[activePet.autoCollect] || 0) + 1;
                            
                            // Incrementa contadores para Grande Observatório (sem verificar currentPage)
                            if (typeof incrementItemsGathered === 'function') {
                                incrementItemsGathered(1);
                            }
                            const ac = activePet.autoCollect;
                            if (ac.startsWith('wood') && typeof incrementTreeCut === 'function') {
                                incrementTreeCut(1);
                            } else if (ac.startsWith('ore') && typeof incrementResourcesMined === 'function') {
                                incrementResourcesMined(1);
                            } else if (ac.startsWith('fish') && typeof incrementFishCaught === 'function') {
                                incrementFishCaught(1);
                            } else if (ac.startsWith('herb') && typeof incrementHerbsGathered === 'function') {
                                incrementHerbsGathered(1);
                            }
                            
                            showNotification('🐾 Mascote!', `${activePet.name} trouxe ${getItemName(activePet.autoCollect)}!`, 'success', activePet.icon);
                            updateUI();
                        }
                    }, newInterval);
                }
            }

            // Serraria e Forja — verificar conclusão automática
            ['sawmill', 'forge'].forEach(id => {
                const p = prop[id];
                if (!p || !p.queue) return;
                const def    = propertyDefs[id];
                const recipe = def.recipes[p.queue.recipeIdx];
                const elapsed = (Date.now() - p.queue.startedAt) / 1000;
                p.progress = Math.min(100, (elapsed / recipe.time) * 100);
            });

            if (gameState.currentPage === 'property') updatePropertyPage();
            updateUI();
        }

        // --- Render da página ---
        function renderCampVisualMap() {
            const mapContainer = document.getElementById('campVisualMap');
            if (!mapContainer) return;
            mapContainer.innerHTML = '';

            const keys = ['farm', 'sawmill', 'forge', 'stable', 'library', 'tavern', 'workerCamp'];
            keys.forEach(key => {
                const def = propertyDefs[key];
                const prop = gameState.property[key];
                if (!def || !prop) return;

                const tile = document.createElement('div');
                tile.className = `camp-tile ${prop.level === 0 ? 'locked' : ''}`;

                let statusText = '';
                let extraClass = '';
                let icon = def.icon;

                if (prop.level === 0) {
                    statusText = 'Bloqueado';
                    icon = '🔒';
                } else {
                    statusText = `Nível ${prop.level}`;
                    
                    if (key === 'farm') {
                        const hasReady = prop.slots.some(slot => {
                            if (!slot) return false;
                            const elapsed = (Date.now() - slot.plantedAt) / 1000;
                            return elapsed >= slot.growTime;
                        });
                        if (hasReady) {
                            statusText = '🌾 Pronto!';
                            tile.classList.add('ready');
                        } else {
                            const isGrowing = prop.slots.some(slot => slot !== null);
                            statusText = isGrowing ? '🌱 Crescendo' : 'Livre';
                        }
                    } else if (key === 'sawmill' || key === 'forge') {
                        if (prop.queue !== null) {
                            const recipe = def.recipes[prop.queue.recipeIdx];
                            const elapsed = (Date.now() - prop.queue.startedAt) / 1000;
                            const done = elapsed >= recipe.time;
                            if (done) {
                                statusText = '📦 Pronto!';
                                tile.classList.add('ready');
                            } else {
                                statusText = key === 'sawmill' ? '🪚 Cortando' : '🔥 Fundindo';
                                extraClass = 'animation-working';
                            }
                        } else {
                            statusText = 'Parado';
                        }
                    } else if (key === 'stable') {
                        if (gameState.pets.active) {
                            statusText = `🐴 Ativo (${getPetName(gameState.pets.active)})`;
                        } else {
                            statusText = 'Livre';
                        }
                    } else if (key === 'library') {
                        statusText = `📚 Estudando`;
                    } else if (key === 'tavern') {
                        statusText = '💰 Lucrando';
                    } else if (key === 'workerCamp') {
                        const total = getWorkerTotal();
                        const used = getWorkerAllocated();
                        statusText = `🏕️ ${used}/${total} Trab.`;
                    }
                }

                tile.innerHTML = `
                    <span class="camp-tile-icon ${extraClass}">${icon}</span>
                    <span class="camp-tile-name">${def.name}</span>
                    <span class="camp-tile-level">${prop.level > 0 ? 'Nível ' + prop.level : 'Trancado'}</span>
                    <span class="camp-tile-status">${statusText}</span>
                `;

                tile.onclick = () => {
                    const card = document.getElementById(`prop-card-${key}`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.style.borderColor = '#ff9944';
                        card.style.boxShadow = '0 0 20px rgba(255, 153, 68, 0.4)';
                        setTimeout(() => {
                            card.style.borderColor = '';
                            card.style.boxShadow = '';
                        }, 1500);
                    }
                };

                mapContainer.appendChild(tile);
            });
        }

        function updatePropertyPage() {
            renderCampVisualMap();

            const grid = document.getElementById('propertyGrid');
            if (!grid) return;
            grid.innerHTML = '';

            // FAZENDA
            renderFarmCard(grid);
            // SERRARIA
            renderCraftPropertyCard(grid, 'sawmill');
            // FORJA
            renderCraftPropertyCard(grid, 'forge');
            // ESTÁBULO
            renderStableCard(grid);
            // BIBLIOTECA
            renderLibraryCard(grid);
            // TAVERNA
            renderTavernCard(grid);
            // ACAMPAMENTO DE TRABALHADORES
            renderWorkerCampCard(grid);
        }

        function propUpgradeBtn(id) {
            const def  = propertyDefs[id];
            const prop = gameState.property[id];
            if (prop.level >= def.maxLevel) return `<button class="prop-btn maxed" disabled>✅ Máximo</button>`;
            const cost = def.upgradeCosts[prop.level];
            const can  = gameState.gold >= cost;
            return `<button class="prop-btn upgrade" onclick="upgradeProperty('${id}')" ${!can ? 'disabled' : ''}>
                ⬆️ Melhorar — ${formatNumber(cost)} 💰</button>`;
        }

        function renderFarmCard(grid) {
            const def  = propertyDefs.farm;
            const prop = gameState.property.farm;
            const card = document.createElement('div');
            card.id = 'prop-card-farm';
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;

            const slots = prop.level > 0 ? propertyDefs.farm.slotsByLevel[prop.level] : 0;
            let slotsHtml = '';
            for (let i = 0; i < slots; i++) {
                const slot = prop.slots[i];
                if (!slot) {
                    slotsHtml += `<div class="prop-slot" onclick="openFarmModal(${i})">
                        <span class="prop-slot-icon">🌱</span>
                        <span class="prop-slot-label">Plantar</span>
                    </div>`;
                } else {
                    const elapsed = (Date.now() - slot.plantedAt) / 1000;
                    const crop    = def.crops.find(c => c.id === slot.cropId);
                    const ready   = elapsed >= slot.growTime;
                    const pct     = Math.min(100, (elapsed / slot.growTime) * 100);
                    const remain  = ready ? 0 : Math.ceil(slot.growTime - elapsed);
                    slotsHtml += `<div class="prop-slot ${ready ? 'ready' : 'planted'}" onclick="${ready ? 'harvestCrop(' + i + ')' : ''}">
                        <span class="prop-slot-icon">${crop?.icon || '🌱'}</span>
                        <span class="prop-slot-label">${crop?.name || ''}</span>
                        <span class="prop-slot-timer">${ready ? '✅ Pronto!' : formatTime(remain)}</span>
                    </div>`;
                }
            }

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level === 0 ? '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>' : `
                <div class="prop-slots-grid">${slotsHtml}</div>
                <button class="prop-btn collect" onclick="harvestAll()">🌾 Colher Tudo</button>`}
                ${propUpgradeBtn('farm')}`;
            grid.appendChild(card);
        }

        function renderCraftPropertyCard(grid, id) {
            const def  = propertyDefs[id];
            const prop = gameState.property[id];
            const card = document.createElement('div');
            card.id = 'prop-card-' + id;
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;

            let recipesHtml = '';
            if (prop.level > 0) {
                def.recipes.forEach((r, i) => {
                    if (r.reqLevel > prop.level) return;
                    const hasInput = (gameState.inventory[r.input] || 0) >= r.qty;
                    const busy = prop.queue !== null;
                    recipesHtml += `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.2);border-radius:6px;padding:6px 10px;margin-bottom:6px;font-size:0.82em;">                            <span style="color:#aaa;">${r.qty}x ${getItemIconHtml(r.input)} → ${getItemIconHtml(r.output)} ${getItemName(r.output)}</span>
                        <button style="background:${hasInput && !busy ? '#4a9a4a' : '#2a3a4a'};color:#fff;border:none;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:0.85em;"
                            onclick="startPropertyCraft('${id}', ${i})" ${!hasInput || busy ? 'disabled' : ''}>
                            ${busy ? '⏳' : '▶'}
                        </button>
                    </div>`;
                });
            }

            let progressHtml = '';
            if (prop.queue !== null) {
                const recipe  = def.recipes[prop.queue.recipeIdx];
                const elapsed = (Date.now() - prop.queue.startedAt) / 1000;
                const pct     = Math.min(100, (elapsed / recipe.time) * 100);
                const done    = elapsed >= recipe.time;
                progressHtml = `
                    <div class="prop-progress-bar"><div class="prop-progress-fill" style="width:${pct}%"></div></div>
                    <div style="color:#aaa;font-size:0.78em;margin-bottom:8px;">${done ? '✅ Pronto para coletar!' : (getItemName(recipe.input) + ' → ' + getItemName(recipe.output) + ' (' + formatTime(Math.ceil(recipe.time - elapsed)) + ')')}</div>
                    ${done ? '<button class="prop-btn collect" onclick="collectPropertyCraft(\'' + id + '\')">📦 Coletar</button>' : ''}`;
            }

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level === 0 ? '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>' : recipesHtml + progressHtml}
                ${propUpgradeBtn(id)}`;
            grid.appendChild(card);
        }

        function renderStableCard(grid) {
            const def  = propertyDefs.stable;
            const prop = gameState.property.stable;
            const card = document.createElement('div');
            card.id = 'prop-card-stable';
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;
            const petName = gameState.pets.active ? getPetName(gameState.pets.active) : 'Nenhum';
            const chance  = prop.level > 0 ? def.bonusByLevel[prop.level] : 30;
            const interval= prop.level > 0 ? def.intervalByLevel[prop.level] / 1000 : 30;

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level > 0 ? `
                <div class="prop-production">
                    <div class="prop-prod-row">Mascote ativo: <span>${petName}</span></div>
                    <div class="prop-prod-row">Chance de coleta: <span>${chance}%</span></div>
                    <div class="prop-prod-row">Intervalo: <span>a cada ${interval}s</span></div>
                </div>` : '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>'}
                ${propUpgradeBtn('stable')}`;
            grid.appendChild(card);
        }

        function renderLibraryCard(grid) {
            const def  = propertyDefs.library;
            const prop = gameState.property.library;
            const card = document.createElement('div');
            card.id = 'prop-card-library';
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;
            const xpPerMin = prop.level > 0 ? def.xpPerMinByLevel[prop.level] : 0;
            const skillOptions = Object.keys(gameState.skills).map(s =>
                `<option value="${s}" ${prop.studySkill === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
            ).join('');

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level > 0 ? `
                <div class="prop-production">
                    <div class="prop-prod-row">XP por minuto: <span>${xpPerMin}</span></div>
                    <div class="prop-prod-row">XP total gerado: <span>${prop.xpAccum || 0}</span></div>
                </div>
                <div class="prop-study-row">
                    <select class="prop-study-select" onchange="setStudySkill(this.value)">${skillOptions}</select>
                </div>` : '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>'}
                ${propUpgradeBtn('library')}`;
            grid.appendChild(card);
        }

        function renderTavernCard(grid) {
            const def  = propertyDefs.tavern;
            const prop = gameState.property.tavern;
            const card = document.createElement('div');
            card.id = 'prop-card-tavern';
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;
            const goldPerMin = prop.level > 0 ? def.goldPerMinByLevel[prop.level] : 0;
            const goldMult   = 1 + getClassPassive('goldBoost') / 100;

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level > 0 ? `
                <div class="prop-production">
                    <div class="prop-prod-row">Ouro por minuto: <span>${Math.floor(goldPerMin * goldMult)}${goldMult > 1 ? ` 🦁` : ''}</span></div>
                    <div class="prop-prod-row">Ouro total gerado: <span>${prop.goldAccum || 0}</span></div>
                </div>` : '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>'}
                ${propUpgradeBtn('tavern')}`;
            grid.appendChild(card);
        }

        function renderWorkerCampCard(grid) {
            const def  = propertyDefs.workerCamp;
            const prop = gameState.property.workerCamp;
            const card = document.createElement('div');
            card.id = 'prop-card-workerCamp';
            card.className = `prop-card ${prop.level === 0 ? 'locked' : ''}`;

            const total  = getWorkerTotal();
            const used   = getWorkerAllocated();
            const free   = total - used;

            // Montar tabela de alocações
            let allocHtml = '';
            if (prop.level > 0 && total > 0) {
                const alloc = gameState.workers?.allocated || {};
                const hasAny = Object.values(alloc).some(v => v > 0);
                if (hasAny) {
                    allocHtml += `<div style="margin-top:8px;font-size:0.8em;color:#aaa;">Alocações atuais:</div>`;
                    for (const [rid, cnt] of Object.entries(alloc)) {
                        if (!cnt) continue;
                        allocHtml += `<div style="display:flex;justify-content:space-between;font-size:0.78em;color:#fff;padding:2px 0;">
                            <span>${getItemIconHtml(rid)} ${getItemName(rid)}</span>
                            <span style="color:#ffd700;">${cnt} 🧑 ${cnt}/ciclo</span>
                        </div>`;
                    }
                }
            }

            card.innerHTML = `
                <div class="prop-header">
                    <span class="prop-icon">${def.icon}</span>
                    <div>
                        <div class="prop-name">${def.name}</div>
                        <div class="prop-level">Nível ${prop.level}/${def.maxLevel}</div>
                    </div>
                </div>
                <div class="prop-desc">${def.desc}</div>
                ${prop.level === 0
                    ? '<div style="color:#aaa;font-size:0.82em;text-align:center;margin-bottom:10px;">Compre o primeiro upgrade para desbloquear</div>'
                    : `<div class="prop-production">
                        <div class="prop-prod-row">Total de trabalhadores: <span>${total}</span></div>
                        <div class="prop-prod-row">Ocupados: <span>${used}</span></div>
                        <div class="prop-prod-row" style="color:${free > 0 ? '#4aff4a' : '#ffd700'}">Livres: <span>${free}</span></div>
                        <div style="font-size:0.78em;color:#aaa;margin-top:4px;">Ciclo: a cada 3s · Produção = trabalhadores × tier do recurso</div>
                    </div>
                    ${allocHtml}`
                }
                ${propUpgradeBtn('workerCamp')}`;
            grid.appendChild(card);
        }

        // --- Modal de plantio ---
        function openFarmModal(slotIdx) {
            const prop = gameState.property.farm;
            if (prop.slots[slotIdx] !== null) return;
            closeItemInfo();

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = 'farmModalOverlay';
            overlay.onclick = () => { overlay.remove(); modal.remove(); };

            const modal = document.createElement('div');
            modal.className = 'item-info-modal';
            modal.id = 'farmModal';

            const crops = propertyDefs.farm.crops.filter(c => c.reqLevel <= prop.level);
            let html = `<div class="modal-header"><h3>🌱 Escolher Cultura</h3><button class="close-modal" onclick="document.getElementById('farmModalOverlay').remove();document.getElementById('farmModal').remove();">×</button></div>`;
            crops.forEach(crop => {
                html += `<div class="equip-option" onclick="plantCrop(${slotIdx},'${crop.id}');document.getElementById('farmModalOverlay').remove();document.getElementById('farmModal').remove();">
                    <div class="equip-option-left">
                        <span style="font-size:1.8em;">${crop.icon}</span>
                        <div>
                            <div style="color:#fff;">${crop.name}</div>
                            <div style="color:#aaa;font-size:0.8em;">Cresce em ${formatTime(crop.growTime)} · +${crop.qty} unidades</div>
                        </div>
                    </div>
                </div>`;
            });
            modal.innerHTML = html;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        function formatTime(secs) {
            if (secs < 60) return `${secs}s`;
            if (secs < 3600) return `${Math.floor(secs/60)}m ${secs%60}s`;
            return `${Math.floor(secs/3600)}h ${Math.floor((secs%3600)/60)}m`;
        }

