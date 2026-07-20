        // ============================================
        // FUNÇÕES DE MASCOTES
        // ============================================
        function buyPet(petId) {
            const pet = pets.find(p => p.id === petId);
            if (!pet) return;
            if (gameState.pets.owned.includes(petId)) { showNotification('❌ Já possui!', `Você já tem ${pet.name}.`, 'error'); return; }
            if (gameState.gold < pet.price) { showNotification('❌ Ouro insuficiente!', `Precisa de ${pet.price} ouro.`, 'error'); return; }
            gameState.gold -= pet.price;
            gameState.pets.owned.push(petId);
            if (!gameState.pets.active) gameState.pets.active = petId;
            
            // Grande Observatório
            incrementPetAdopted();
            
            showNotification('✨ Novo Mascote!', `${pet.name} agora é seu companheiro!`, 'success', pet.icon);
            updateUI();
            updatePetsPage();
        }

        function activatePet(petId) {
            if (!gameState.pets.owned.includes(petId)) return;
            gameState.pets.active = petId;
            showNotification('🐉 Mascote ativado!', `${getPetName(petId)} está te acompanhando!`, 'success', getPetIcon(petId));
            
            // Pequeno efeito visual ao ativar mascote
            if (typeof spawnFloatingText === 'function') {
                spawnFloatingText(window.innerWidth / 2, window.innerHeight * 0.4, `🐾 ${getPetIcon(petId)} Ativado!`, { type: 'special', duration: 1.2 });
            }
            updateUI();
            updatePetsPage();
        }

        function getPetState(petId) {
            if (!gameState.pets.levels) gameState.pets.levels = {};
            if (!gameState.pets.levels[petId]) {
                gameState.pets.levels[petId] = { level: 1, xp: 0 };
            }
            return gameState.pets.levels[petId];
        }

        function addPetXP(petId, amount) {
            const state = getPetState(petId);
            if (state.level >= 10) return;
            
            state.xp += amount;
            const req = 200 * state.level;
            
            let leveledUp = false;
            while (state.xp >= req && state.level < 10) {
                state.xp -= req;
                state.level++;
                leveledUp = true;
            }
            
            if (leveledUp) {
                showNotification(
                    '🐉 LEVEL UP DO MASCOTE!', 
                    `Seu companheiro ${getPetName(petId)} subiu para o Nível ${state.level}! Bônus aumentados!`, 
                    'success', 
                    getPetIcon(petId)
                );
                
                // Auto-consagrar se atingiu o nível máximo (10) e ainda não foi consagrado
                if (state.level >= 10 && !gameState?.pets?.enshrined?.[petId]) {
                    enshrinePet(petId);
                }
            }
            updatePetsPage();
        }

        function feedPet(petId, foodKey, xpGained) {
            const qty = gameState.inventory[foodKey] || 0;
            if (qty <= 0) { showNotification('❌ Comida!', 'Você não possui esse alimento.', 'error'); return; }
            
            gameState.inventory[foodKey]--;
            addPetXP(petId, xpGained);
            updatePetsPage();
            updateUI();
        }

        function getPetName(petId) { const pet = pets.find(p => p.id === petId); return pet ? pet.name : 'Nenhum'; }
        function getPetIcon(petId) { const pet = pets.find(p => p.id === petId); return pet ? pet.icon : '🐉'; }

        // ============================================
        // SISTEMA DE MESTRIA DOS MASCOTES (LIVRO DE CONQUISTAS)
        // ============================================
        function enshrinePet(petId) {
            const pet = pets.find(p => p.id === petId);
            if (!pet) return;
            const state = getPetState(petId);
            if (state.level < 10) {
                showNotification('❌ Nível Máximo!', `${pet.name} precisa estar no nível máximo (10) para ser consagrado!`, 'error');
                return;
            }
            if (gameState.pets.enshrined[petId]) {
                showNotification('❌ Já Consagrado!', `${pet.name} já está no Livro de Conquistas!`, 'error');
                return;
            }
            if (!gameState.pets.enshrined) gameState.pets.enshrined = {};
            gameState.pets.enshrined[petId] = true;
            showNotification('📖 MESTRE DOS MASCOTES!', `${pet.icon} ${pet.name} foi consagrado no Livro de Conquistas! Bônus permanente ativado!`, 'success', '📖');
            
            // Efeito visual de consagração
            if (typeof spawnConfetti === 'function') {
                spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 40, ['#ffd700', '#ffaa00', '#c96ac9', '#ffffff']);
                if (typeof spawnFloatingText === 'function') {
                    spawnFloatingText(window.innerWidth / 2, window.innerHeight * 0.35, `👑 ${pet.icon} ${pet.name} CONSAGRADO!`, { type: 'special', duration: 2.0 });
                }
            }
            updatePetsPage();
            checkAchievements();
        }

        function getPetMasteryBonus(type) {
            if (!gameState.pets?.enshrined) return 0;
            let total = 0;
            for (const petId in gameState.pets.enshrined) {
                if (!gameState.pets.enshrined[petId]) continue;
                const pet = pets.find(p => p.id === petId);
                if (pet && pet.masteryBonus && pet.masteryBonus.type === type) {
                    total += pet.masteryBonus.value;
                }
            }
            return total;
        }

        function getEnshrinedCount() {
            if (!gameState.pets?.enshrined) return 0;
            return Object.values(gameState.pets.enshrined).filter(v => v).length;
        }

        function getMasteryBonusLabel(type) {
            const labels = {
                xpBoost_all: '⚡ XP Global',
                xpBoost_gather: '🌾 XP Coleta',
                xpBoost_craft: '🔨 XP Craft',
                goldBonus: '💰 Ouro',
                strengthBonus: '⚔️ Força',
                healthBonus: '❤️ Vida',
                critChance: '🎯 Crítico'
            };
            return labels[type] || type;
        }

        function applyPetBonus(skill, action) {
            if (!gameState.pets.active) return action === 'double' ? 0 : 1.0;
            const activePet = pets.find(p => p.id === gameState.pets.active);
            if (!activePet) return action === 'double' ? 0 : 1.0;

            const petState = getPetState(activePet.id);
            const levelMultiplier = 1 + (petState.level - 1) * 0.15;
            const scaledValue = activePet.effectValue * levelMultiplier;

            // Dragão de Cristal: bônus global em tudo
            if (activePet.effect === 'global' && activePet.effectType === 'allBoost') {
                if (action === 'double') return scaledValue / 200;
                return 1 + (scaledValue / 100);
            }

            // Bônus específico da skill
            if (activePet.effect === skill) {
                if (activePet.effectType === 'xpBoost' && action === 'xpBoost') return 1 + (scaledValue / 100);
                if (activePet.effectType === 'doubleChance' && action === 'double') return scaledValue / 100;
                if (activePet.effectType === 'rareChance' && action === 'rare') return 1 + (scaledValue / 100);
            }

            // Lobo de Guerra: bônus de combate
            if (activePet.effect === 'combat' && skill === 'combat' && activePet.effectType === 'combatBoost') {
                return 1 + (scaledValue / 100);
            }

            return action === 'double' ? 0 : 1.0;
        }

        function startPetAutoCollect() {
            if (gameState.pets.autoCollectInterval) clearInterval(gameState.pets.autoCollectInterval);
            gameState.pets.autoCollectInterval = setInterval(() => {
                if (!gameState.pets.active) return;
                const activePet = pets.find(p => p.id === gameState.pets.active);
                if (!activePet || !activePet.autoCollect) return;
                if (Math.random() * 100 < activePet.autoCollectChance && hasInventorySpace()) {
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
                    
                    showNotification('🐾 Coleta do Mascote!', `${activePet.name} trouxe um ${getItemName(activePet.autoCollect)}!`, 'success', activePet.icon);
                    updateUI();
                }
            }, 30000);
        }

        let pomboInterval = null;
        function startPomboTimer() {
            if (pomboInterval) clearInterval(pomboInterval);
            pomboInterval = setInterval(() => {
                if (gameState && gameState.pets && gameState.pets.active === 'pombo_correio') {
                    triggerPomboDelivery();
                }
            }, 600000); // 10 minutos (600000 ms)
        }

        function triggerPomboDelivery() {
            const activePet = pets.find(p => p.id === 'pombo_correio');
            const petState = getPetState('pombo_correio');
            const levelMultiplier = 1 + (petState.level - 1) * 0.15;
            const petFactor = activePet ? (activePet.effectValue || 1) : 1;
            
            const rewardChance = Math.random();
            let rewardMsg = '';
            let rewardIcon = '🕊️';
            
            if (rewardChance < 0.40) {
                // Ouro (100 a 500 ouro, multiplicado pelo nível e fator do pet)
                const goldAmount = Math.floor((100 + Math.random() * 400) * levelMultiplier * petFactor);
                gameState.gold = (gameState.gold || 0) + goldAmount;
                rewardMsg = `trazendo um Pacote Misterioso com <strong>${goldAmount} Ouro</strong>!`;
                rewardIcon = '🪙';
            } else if (rewardChance < 0.80) {
                // Madeira (1 a 5 madeiras de tiers aleatórios, multiplicadas pelo nível e fator)
                const woodTiers = ['wood1', 'wood2', 'wood3', 'wood4', 'wood5'];
                const randTier = woodTiers[Math.floor(Math.random() * woodTiers.length)];
                const woodQty = Math.floor((1 + Math.random() * 4) * levelMultiplier * petFactor);
                gameState.inventory[randTier] = (gameState.inventory[randTier] || 0) + woodQty;
                
                // Incrementa contador para Grande Observatório
                if (typeof incrementItemsGathered === 'function') {
                    incrementItemsGathered(woodQty);
                }
                if (typeof incrementTreeCut === 'function') {
                    incrementTreeCut(woodQty);
                }
                
                rewardMsg = `trazendo um Pacote Misterioso com <strong>${woodQty}x ${getItemName(randTier)}</strong>!`;
                rewardIcon = '🪵';
            } else {
                // Gema preciosa (convertida em recompensa alta de Ouro, ex: 300 a 800)
                const gems = ['💎 Diamante', '🔴 Rubi', '💚 Esmeralda', '🔷 Safira'];
                const chosenGem = gems[Math.floor(Math.random() * gems.length)];
                const goldBonus = Math.floor((300 + Math.random() * 500) * levelMultiplier * petFactor);
                gameState.gold = (gameState.gold || 0) + goldBonus;
                rewardMsg = `trazendo um Pacote Misterioso contendo uma gema preciosa: <strong>${chosenGem}</strong>! Ela foi vendida por <strong>+${goldBonus} Ouro</strong>!`;
                rewardIcon = '💎';
            }
            
            showNotification('🕊️ Pombo Correio Chegou!', `Seu Pombo Correio voltou ${rewardMsg}`, 'success', rewardIcon);
            updateUI();
        }


