        // ============================================
        // FUNÇÕES DE COLETA E CRAFT (MODIFICADAS COM BÔNUS)
        // ============================================
        function farmResource(skill, resourceId, event) {
            const resource = resources[skill]?.find(r => r.id === resourceId);
            if (!resource) return false;
            if (gameState.skills[skill].level < resource.levelReq) { showNotification('❌ Nível!', `Nível ${resource.levelReq} necessário.`, 'error'); return false; }
            if (!hasInventorySpace() && !gameState.inventory[resourceId]) { showNotification('❌ Inventário cheio!', 'Venda itens.', 'error'); return false; }

            let amount = 1;
            
            // EVENTO GLOBAL: Bênção de Gaia
            if (window.activeGlobalEvent === 'gaia_blessing' && (skill === 'woodcutting' || skill === 'herbalism')) {
                amount *= 2;
            }

            // Chance de duplicar: pet doubleChance + tech doubleChance + Mimic doubleHarvest + passiva Mar Negro
            const petDouble = applyPetBonus(skill, 'double');
            const techDouble = applyTechBonus('doubleChance', skill);
            const mimicChance = getCharacterClassPassive('doubleHarvest');
            const classDouble = (skill === 'fishing' || skill === 'mining') ? getClassPassive('doubleDropChance') : 0;
            
            if (mimicChance > 0 && Math.random() * 100 < mimicChance) {
                amount *= 2;
            } else if (Math.random() < (petDouble + techDouble + classDouble / 100)) {
                amount++;
            }

            if (skill === 'mining') {
                const gemChance = getCharacterClassPassive('gemChance');
                if (gemChance > 0 && Math.random() * 100 < gemChance) {
                    const gems = ['💎 Diamante', '🔴 Rubi', '💚 Esmeralda', '🔷 Safira'];
                    const chosenGem = gems[Math.floor(Math.random() * gems.length)];
                    const goldBonus = 50;
                    gameState.gold = (gameState.gold || 0) + goldBonus;
                    showNotification('💎 Gema Rara!', `Minerador Ancião encontrou um ${chosenGem} (+50 ouro)!`, 'success', '💎');
                    if (typeof triggerRareDropEffect === 'function') {
                        triggerRareDropEffect('💎', chosenGem);
                    }
                }
                
                // EVENTO GLOBAL: Chuva de Estrelas
                if (window.activeGlobalEvent === 'star_shower') {
                    if (Math.random() < 0.20) { // +20% chance de minérios raros passivos (ou dobra o atual)
                        amount *= 2;
                        showNotification('🌠 Chuva de Estrelas!', `A magia estelar dobrou seu minério!`, 'success', '🌠');
                        if (typeof spawnConfetti === 'function') {
                            spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 20, ['#4a9aff', '#aaccff', '#ffffff', '#ffd700']);
                        }
                    }
                }
            }

            // Peixe Dourado: rareChance — pesca tem chance de pegar peixe de tier superior
            if (skill === 'fishing') {
                const activePet = pets.find(p => p.id === gameState.pets.active);
                if (activePet && activePet.effectType === 'rareChance') {
                    const petState = getPetState('golden_fish');
                    const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                    const rareChance = activePet.effectValue * levelMultiplier;
                    if (Math.random() * 100 < rareChance) {
                        const fishList = resources.fishing;
                        const higherFish = fishList.filter(f => f.levelReq > resource.levelReq && gameState.skills.fishing.level >= f.levelReq);
                        if (higherFish.length > 0) {
                            const bonus = higherFish[Math.floor(Math.random() * higherFish.length)];
                            gameState.inventory[bonus.id] = (gameState.inventory[bonus.id] || 0) + 1;
                            showNotification('🐠 Peixe Raro!', `Peixe Dourado trouxe 1 ${bonus.name}!`, 'success', '🐠');
                            if (typeof triggerRareDropEffect === 'function') {
                                triggerRareDropEffect('🐠', bonus.name);
                            }
                        }
                    }
                }
            }

            gameState.inventory[resourceId] = (gameState.inventory[resourceId] || 0) + amount;

            // Incrementa contador de itens coletados para estatísticas
            if (['woodcutting', 'mining', 'fishing', 'herbalism'].includes(skill)) {
                incrementItemsGathered(amount);
            }

            // SERRARIA (Woodcutting) - Durabilidade, Especializações e Âmbar
            if (skill === 'woodcutting') {
                if (gameState.property.sawmill.bladeId && gameState.property.sawmill.bladeDurability > 0) {
                    // SwiftSaw spec: -50% consumo de durabilidade
                    const bladeDrain = gameState.property.sawmill.spec === 'swiftSaw' ? 0.5 : 1;
                    if (Math.random() < bladeDrain) {
                        gameState.property.sawmill.bladeDurability--;
                    }
                    // Brute spec: 10% chance de dobrar madeira com a lâmina
                    if (gameState.property.sawmill.spec === 'brute' && Math.random() < 0.1) amount *= 2;
                    // Collector spec: 5% chance de +1 madeira extra na coleta manual
                    if (gameState.property.sawmill.spec === 'collector' && Math.random() < 0.05) {
                        amount += 1;
                    }
                    if (gameState.property.sawmill.bladeDurability <= 0) {
                        gameState.property.sawmill.bladeId = null;
                        showNotification('⚙️ Lâmina Quebrada!', 'Sua lâmina de serra quebrou.', 'error');
                    }
                }
                // Drop de Âmbar Ancestral (1% base, dobra com AmberMiner)
                const amberChance = gameState.property.sawmill.spec === 'amberMiner' ? 0.02 : 0.01;
                if (Math.random() < amberChance) {
                    gameState.inventory['amber'] = (gameState.inventory['amber'] || 0) + 1;
                    showNotification('💎 Relíquia Encontrada!', `Você encontrou Âmbar Ancestral!`, 'success', '💎');
                    if (typeof triggerRareDropEffect === 'function') {
                        triggerRareDropEffect('💎', 'Âmbar Ancestral');
                    }
            }
            }

            // Tracking de stats para conquistas
            initAchievements();
            if (skill === 'woodcutting') gameState.stats.totalWood = (gameState.stats.totalWood || 0) + amount;
            if (skill === 'mining')      gameState.stats.totalOre  = (gameState.stats.totalOre  || 0) + amount;
            if (skill === 'fishing')     gameState.stats.totalFish = (gameState.stats.totalFish || 0) + amount;
            checkAchievements();

            // XP: base * pet xpBoost * tech xpBoost * potion xpBoost + passiva de classe + ferramenta
            const baseXP   = resource.xpGain * amount;
            const petXP    = applyPetBonus(skill, 'xpBoost');
            const techXP   = applyTechBonus('xpBoost', skill);
            const potXP    = applyPotionEffects('xpBoost');
            const classXPG = getClassPassive('xpBoost_gather');
            const classXPA = getClassPassive('xpBoost_all');
            const toolXP   = getToolBonus(skill); // % extra da ferramenta
            let xpGain = Math.floor(baseXP * petXP * (1 + (techXP + potXP + classXPG + classXPA + toolXP) / 100));
            addXP(skill, xpGain);

            // Ouro bônus da poção do mercador + passiva Lannister (ao coletar)
            const goldBonus = applyPotionEffects('goldBoost') + getClassPassive('goldBoost');
            let goldExtra = 0;
            if (goldBonus > 0) {
                goldExtra = Math.floor(resource.price * amount * goldBonus / 100);
                if (goldExtra > 0) gameState.gold += goldExtra;
            }

            // --- Notificação discriminada por fonte ---
            const xpBase     = resource.xpGain * amount;
            const xpFromPet  = petXP > 1              ? Math.floor(xpBase * (petXP - 1))          : 0;
            const xpFromTech = techXP > 0             ? Math.floor(xpBase * techXP / 100)         : 0;
            const xpFromPot  = potXP > 0              ? Math.floor(xpBase * potXP / 100)          : 0;
            const xpFromCls  = (classXPG + classXPA) > 0
                               ? Math.floor(xpBase * (classXPG + classXPA) / 100)                 : 0;
            const xpFromTool = toolXP > 0             ? Math.floor(xpBase * toolXP / 100)         : 0;

            // Ícones
            const activeCls  = gameState.player?.classId
                ? gameClasses.find(c => c.id === gameState.player.classId) : null;
            const clsIcon    = activeCls ? activeCls.icon : '';
            const activeTool = toolsData.find(t => t.skill === skill);
            const toolTier   = activeTool && gameState.tools ? (gameState.tools[activeTool.id] || 0) : 0;
            const toolIcon   = toolTier > 0 ? activeTool.buffIcon : '';

            // Montar string de XP discriminado
            let xpStr = `${xpBase}XP`;
            const xpParts = [];
            if (amount > 1)     xpParts.push(`✌️ ×${amount}`);
            if (xpFromPet  > 0) xpParts.push(`+${xpFromPet}XP🐾`);
            if (xpFromTech > 0) xpParts.push(`+${xpFromTech}XP🔬`);
            if (xpFromPot  > 0) xpParts.push(`+${xpFromPot}XP🧪`);
            if (xpFromCls  > 0) xpParts.push(`+${xpFromCls}XP${clsIcon}`);
            if (xpFromTool > 0) xpParts.push(`+${xpFromTool}XP${toolIcon}`);
            if (xpParts.length > 0) xpStr += ` (${xpParts.join(' ')})`;

            // Ouro extra
            const goldStr = goldExtra > 0
                ? `  💰+${goldExtra}${activeCls?.id === 'leao_ouro' ? '🦁👑' : ''}` : '';

            showNotification('🌾 Coleta!', `+${amount} ${resource.name} · ${xpStr}${goldStr}`, 'success', resource.icon);
            
            // Efeitos visuais de coleta (números flutuantes) — apenas em clique manual
            const isAuto = !event?.clientX;
            if (typeof spawnFloatingText === 'function' && !isAuto) {
                // Floating perto do clique do mouse
                spawnFloatingText(event.clientX, event.clientY - 20, `+${amount} ${resource.icon}`, { type: 'item', duration: 0.9 });
                if (xpGain > 0) {
                    spawnFloatingText(event.clientX - 10, event.clientY - 45, `+${xpGain} XP`, { type: 'xp', duration: 0.8 });
                }
                if (goldExtra > 0) {
                    spawnFloatingText(event.clientX + 15, event.clientY - 35, `+${goldExtra}💰`, { type: 'gold', duration: 0.9 });
                }
            } else if (typeof spawnFloatingText === 'function' && isAuto && Math.random() < 0.1) {
                // Autofarm: mostrar apenas ~10% das vezes pra não poluir
                const rx = typeof getGameRightX === 'function' ? getGameRightX() : window.innerWidth - 120;
                const ry = 80 + Math.random() * 40;
                spawnFloatingText(rx, ry, `+${amount} ${resource.icon}`, { type: 'item', duration: 0.8 });
            }
            
            updateUI();
            return true;
        }

        function toggleAutoFarm(skill, resourceId) {
            const skillData = gameState.skills[skill];
            const resource = resources[skill]?.find(r => r.id === resourceId);
            if (!skillData.auto) skillData.auto = {};
            if (skillData.level < resource.levelReq) { showNotification('❌ Nível!', `Nível ${resource.levelReq} necessário.`, 'error'); return; }
            skillData.auto[resourceId] = !skillData.auto[resourceId];
            const intervalId = `${skill}_${resourceId}`;
            if (skillData.auto[resourceId]) {
                if (gameState.autoIntervals[intervalId]) clearInterval(gameState.autoIntervals[intervalId]);
                const speedBonus = getEquipmentBonuses().speedBonus || 0;
                const potionSpeed = applyPotionEffects('speed');
                const techSpeed = applyTechBonus('autoSpeed') * 1000;
                const classSpeed = getClassPassive('speedBonus'); // Stark
                let interval = Math.max(1000, 5000 - Math.floor(5000 * (speedBonus + potionSpeed + classSpeed) / 100) - techSpeed);
                
                // SISTEMA DE LÂMINA
                let bladePenaltyMsg = '';
                if (skill === 'woodcutting') {
                    if (!gameState.property.sawmill.bladeId || gameState.property.sawmill.bladeDurability <= 0) {
                        interval = interval * 1.5; // Lento sem lâmina
                        bladePenaltyMsg = ' ⚠️ Lento sem Lâmina';
                    }
                }

                // Aplicar multiplicador de tempo dinâmico
                interval = Math.max(100, Math.floor(interval * (window.balancingConfig?.timeMultiplier || 1.0)));

                gameState.autoIntervals[intervalId] = setInterval(() => {
                    if (hasInventorySpace()) farmResource(skill, resourceId, null);
                    else showNotification('⚠️ Inventário cheio!', 'Autofarm pausado.', 'error');
                }, interval);
                const totalBonus = speedBonus + potionSpeed + (applyTechBonus('autoSpeed') * 20);
                
                showNotification('🤖 Autofarm ON!', `Coletando ${resource.name}${totalBonus > 0 ? ' (' + Math.round(totalBonus) + '% mais rápido)' : ''}${bladePenaltyMsg}.`, 'success');
            } else {
                if (gameState.autoIntervals[intervalId]) { clearInterval(gameState.autoIntervals[intervalId]); delete gameState.autoIntervals[intervalId]; }
                showNotification('⏹️ Autofarm OFF!', `Parou de coletar ${resource.name}.`, 'info');
            }
            updateResourcesPage(skill);
            updateUI();
        }

        function startCrafting(skill, recipeId, qtyOpt = 1) {
            let recipe;
            if (skill === 'cooking') recipe = cookingRecipes.find(r => r.id === recipeId);
            else if (skill === 'crafting') recipe = craftingRecipes.find(r => r.id === recipeId);
            else if (skill === 'smithing') recipe = smithingRecipes.find(r => r.id === recipeId);
            else if (skill === 'enchanting') recipe = enchantingRecipes.find(r => r.id === recipeId);
            if (!recipe) return;

            const timerId = `${skill}_${recipe.id}`;
            if (gameState.craftingTimers[timerId]) { showNotification('⏳ Ocupado!', 'Este item já está sendo fabricado.', 'error'); return; }

            // Calcular quantidade máxima
            const available = gameState.inventory[recipe.input.type] || 0;
            let qty = 1;
            if (qtyOpt === 'all') {
                qty = Math.floor(available / recipe.input.qty);
            } else {
                qty = parseInt(qtyOpt) || 1;
            }

            if (qty <= 0) { showNotification('❌ Ingredientes!', 'Materiais insuficientes.', 'error'); return; }
            if ((gameState.inventory[recipe.input.type] || 0) < recipe.input.qty * qty) { showNotification('❌ Ingredientes!', 'Materiais insuficientes.', 'error'); return; }
            if (!hasInventorySpace() && !gameState.inventory[recipe.output.type]) { showNotification('❌ Inventário cheio!', 'Libere espaço.', 'error'); return; }

            // SISTEMA DE CALOR DA FORJA
            if (skill === 'smithing') {
                if (gameState.property.forge.heat <= 0) {
                    showNotification('🥶 Fornalha Fria!', 'Adicione lenha para gerar calor.', 'error');
                    if (typeof addForgeLog === 'function') addForgeLog('🥶 Fornalha Fria! Craft bloqueado por falta de calor.', 'error');
                    return;
                }
                gameState.property.forge.heat -= qty;
                if (gameState.property.forge.heat < 0) gameState.property.forge.heat = 0;
                
                // Artisan Spec (Nível 10+) = Menos gasto de calor
                if (gameState.property.forge.spec === 'artisan' && Math.random() < 0.3) {
                    gameState.property.forge.heat += 1;
                    if (typeof addForgeLog === 'function') addForgeLog('🔧 Especialização Artesão economizou 1 Calor!', 'artisan');
                }
            }

            // A dedução de materiais foi movida para dentro do setTimeout
            // (item por item, para não consumir se queimar)

            // Tech: craftSpeed + poções + runas
            const techSpeed = applyTechBonus('craftSpeed') || 0;
            const potionSpeed = applyPotionEffects('craftSpeed_pot') || 0;
            const runeSpeed = getEquipmentBonuses().craftSpeedBonus || 0;
            const speedReduction = Math.min(0.90, (techSpeed + potionSpeed + runeSpeed) / 100);
            
            // Lógica das Zonas de Calor (Forja)
            let forgeMultiplier = 1;
            let forgeBurnChance = 0;
            let forgeDoubleChance = 0;
            if (skill === 'smithing') {
                const currentHeat = gameState.property.forge.heat + qty; // usa o calor antes de deduzir
                if (currentHeat > 80) {
                    forgeMultiplier = 3;
                    forgeBurnChance = 0.20; // 20% de chance de queimar
                } else if (currentHeat >= 50 && currentHeat <= 80) {
                    forgeDoubleChance = 0.15; // 15% de chance do dobro
                }
            }

            let singleTime = Math.max(0.1, recipe.time * (1 - speedReduction) / forgeMultiplier);
            
            // Dragãozinho: -20% tempo de fundição de minérios (Smithing) (escalado por nível)
            if (skill === 'smithing' && gameState.pets && gameState.pets.active === 'dragaozinho') {
                const petState = getPetState('dragaozinho');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'dragaozinho') : null;
                const baseMelt = petData ? (petData.effectValue || 20) : 20;
                const petReduction = (baseMelt * levelMultiplier) / 100;
                singleTime = Math.max(0.1, singleTime * (1 - petReduction));
            }
            
            // EVENTO GLOBAL: Forja Frenética
            if (window.activeGlobalEvent === 'frenzy_forge' && (skill === 'smithing' || skill === 'crafting' || skill === 'alchemy')) {
                singleTime = Math.max(0.1, singleTime * 0.5); // 50% de redução
            }

            const craftTime = singleTime * qty * (window.balancingConfig?.timeMultiplier || 1.0);

            gameState.craftingTimers[timerId] = { startTime: Date.now(), recipe, skill, craftTime, quantity: qty, forgeBurnChance, forgeDoubleChance };

            
            showNotification('🔨 Craft iniciado!', `Criando ${qty}x ${recipe.output.name}...`, 'success', recipe.icon);
            if (skill === 'cooking') updateCookingPage();
            else if (skill === 'crafting') updateCraftingPage();
            else if (skill === 'smithing') updateSmithingPage();
            else if (skill === 'enchanting') updateEnchantingPage();

            setTimeout(() => {
                // Tech: valueBoost - chance de craftar 2x
                const valueBoostChance = applyTechBonus('valueBoost') / 100;
                let totalOutput = 0;
                const timerObj = gameState.craftingTimers[timerId];
                const qty = timerObj ? (timerObj.quantity || 1) : 1;
                const forgeBurnChance = timerObj ? (timerObj.forgeBurnChance || 0) : 0;
                const forgeDoubleChance = timerObj ? (timerObj.forgeDoubleChance || 0) : 0;

                const costRedChance = applyTechBonus('costReduction') / 100;
                let totalCostDeducted = 0;

                for (let i = 0; i < qty; i++) {
                    if (skill === 'smithing' && forgeBurnChance > 0 && Math.random() < forgeBurnChance) {
                        showNotification('🔥 Queimou!', 'A forja estava muito quente e o material foi perdido!', 'error');
                        if (typeof addForgeLog === 'function') addForgeLog('🔥 Zona Vermelha: 1x ' + recipe.output.name + ' perdido! (calor consumido)', 'zone');
                        continue;
                    }

                    // Só deduz material se não queimou (costReduction pode evitar a dedução)
                    if (Math.random() >= costRedChance) {
                        totalCostDeducted += recipe.input.qty;
                    }

                    let baseQty = recipe.output.qty * (Math.random() < valueBoostChance ? 2 : 1);
                    if (skill === 'smithing') {
                        const cyborgChance = getCharacterClassPassive('doubleCraft');
                        if (cyborgChance > 0 && Math.random() * 100 < cyborgChance) {
                            baseQty *= 2;
                        }
                        if (forgeDoubleChance > 0 && Math.random() < forgeDoubleChance) {
                            const beforeDouble = baseQty;
                            baseQty *= 2;
                            showNotification('🌟 Temperatura Ideal!', 'Você forjou o dobro de barras na temperatura verde!', 'success');
                            if (typeof addForgeLog === 'function') addForgeLog('🟢 Zona Verde: ×2 → ' + baseQty + ' ' + getItemName(recipe.output.type) + ' (+' + (baseQty - beforeDouble) + ')', 'zone');
                        }
                        // Drop de Escória Brilhante (2% base, +8% com Fundidor)
                        const slagChance = gameState.property.forge.spec === 'founder' ? 0.10 : 0.02;
                        if (Math.random() < slagChance) {
                            gameState.inventory['slag'] = (gameState.inventory['slag'] || 0) + 1;
                            showNotification('✨ Escória!', 'Uma Escória Brilhante caiu das chamas!', 'success');
                            if (typeof addForgeLog === 'function') addForgeLog('✨ +1 Escória Brilhante! (craft)', 'zone');
                        }
                    }
                    // Spark spec: 10% chance de produzir +1 barra extra
                    if (skill === 'smithing' && gameState.property.forge.spec === 'spark' && Math.random() < 0.10) {
                        baseQty += 1;
                        if (typeof addForgeLog === 'function') addForgeLog('⚡ Centelha Poderosa: +1 ' + getItemName(recipe.output.type) + ' extra! (total: ' + baseQty + ')', 'craft');
                    }
                    totalOutput += baseQty;
                }

                // Deduz materiais apenas dos itens que não queimaram
                if (totalCostDeducted > 0) {
                    gameState.inventory[recipe.input.type] -= totalCostDeducted;
                } else if (totalOutput > 0 && qty > 0) {
                    // Só mostra Eficiência se realmente produziu algo
                    showNotification('♻️ Eficiência!', 'Materiais preservados pela tecnologia!', 'success');
                }

                let isEquipment = typeof equipmentData[recipe.output.type] !== 'undefined';
                let hasSlots = false;

                if (isEquipment) {
                    for (let k = 0; k < totalOutput; k++) {
                        const finalId = addNewEquipmentToInventory(recipe.output.type);
                        if (finalId && finalId.startsWith('inst_')) hasSlots = true;
                    }
                } else {
                    gameState.inventory[recipe.output.type] = (gameState.inventory[recipe.output.type] || 0) + totalOutput;
                }
                
                // Incrementa contador de itens criados para estatísticas
                if (['cooking', 'crafting', 'smithing', 'enchanting'].includes(skill)) {
                    incrementItemsCrafted(totalOutput);
                }
                
                const totalXPBase = recipe.xpGain * qty;
                addXP(skill, totalXPBase);
                delete gameState.craftingTimers[timerId];

                // XP discriminado por fonte
                const xpBase     = totalXPBase;
                const equipXP    = getEquipmentBonuses().xpBonus || 0;
                const classXPA   = getClassPassive('xpBoost_all');
                const classXPC   = getClassPassive('xpBoost_craft');
                const xpFromEquip= equipXP  > 0 ? Math.floor(xpBase * equipXP  / 100) : 0;
                const xpFromCls  = (classXPA + classXPC) > 0
                                   ? Math.floor(xpBase * (classXPA + classXPC) / 100) : 0;
                const activeCls  = gameState.player?.classId
                                   ? gameClasses.find(c => c.id === gameState.player.classId) : null;
                const clsIcon    = activeCls ? activeCls.icon : '';

                let xpStr = `${xpBase}XP`;
                const xpParts = [];
                if (xpFromEquip > 0) xpParts.push(`+${xpFromEquip}XP⚔️`);
                if (xpFromCls   > 0) xpParts.push(`+${xpFromCls}XP${clsIcon}`);
                if (xpParts.length > 0) xpStr += ` (${xpParts.join(' ')})`;

                const bonusMsg = totalOutput > recipe.output.qty * qty ? ' 🔨×2!' : '';
                const speedMsg = speedReduction > 0 ? ` ⚡−${Math.round(speedReduction*100)}%t` : '';
                const slotMsg = hasSlots ? ' (2 Slots)' : '';
                
                showNotification('✅ Craft!', `+${totalOutput} ${recipe.output.name}${slotMsg} · ${xpStr}${bonusMsg}${speedMsg}`, 'success', recipe.icon);

                // Tracking de crafts para conquistas
                initAchievements();
                if (skill === 'cooking')  gameState.stats.totalCook  = (gameState.stats.totalCook  || 0) + qty;
                if (skill === 'crafting') gameState.stats.totalCrafts = (gameState.stats.totalCrafts || 0) + qty;
                if (skill === 'smithing') gameState.stats.totalSmith  = (gameState.stats.totalSmith  || 0) + qty;
                if (skill === 'enchanting') gameState.stats.totalEnchants = (gameState.stats.totalEnchants || 0) + qty;
                checkAchievements();

                if (skill === 'cooking') updateCookingPage();
                else if (skill === 'crafting') updateCraftingPage();
                else if (skill === 'smithing') updateSmithingPage();
                else if (skill === 'enchanting') updateEnchantingPage();
                updateUI();
            }, craftTime * 1000);
            updateUI();
        }

