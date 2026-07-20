        // ============================================

        // ============================================
        // FUNÇÕES DE UPGRADES
        // ============================================
        function buyBankUpgrade() {
            if (gameState.gold >= gameState.upgrades.bankUpgradeCost) {
                gameState.gold -= gameState.upgrades.bankUpgradeCost;
                gameState.bankSlots += 2;
                gameState.upgrades.bankUpgradeCost = Math.floor(gameState.upgrades.bankUpgradeCost * 2);
                showNotification('📦 Banco expandido!', `+2 espaços (agora ${gameState.bankSlots})`, 'success');
                updateUI();
            }
        }
        function buyStrengthUpgrade() {
            if (gameState.gold >= gameState.upgrades.strengthUpgradeCost) {
                gameState.gold -= gameState.upgrades.strengthUpgradeCost;
                gameState.upgrades.strengthBonus += 5;
                gameState.upgrades.strengthUpgradeCost = Math.floor(gameState.upgrades.strengthUpgradeCost * 1.8);
                showNotification('⚔️ Força!', 'Força permanente +5!', 'success');
                updateUI();
            }
        }
        function buyHealthUpgrade() {
            if (gameState.gold >= gameState.upgrades.healthUpgradeCost) {
                gameState.gold -= gameState.upgrades.healthUpgradeCost;
                gameState.upgrades.healthBonus += 20;
                gameState.combat.maxPlayerHealth += 20;
                gameState.combat.playerHealth += 20;
                gameState.upgrades.healthUpgradeCost = Math.floor(gameState.upgrades.healthUpgradeCost * 1.6);
                showNotification('❤️ Vida!', 'Vida máxima +20!', 'success');
                updateUI();
            }
        }

        // ============================================
        // FUNÇÕES DE INVENTÁRIO
        // ============================================
        function getEquipmentPrice(id) {
            const eq = getEquipmentItemData(id);
            if (!eq) return 10;
            const rarityPrices = { common: 15, uncommon: 40, rare: 100, epic: 250, legendary: 600 };
            return rarityPrices[eq.rarity] || 15;
        }

        function sellEquipment(instOrBaseId) {
            if (typeof window.hideEquipmentComparison === 'function') {
                window.hideEquipmentComparison();
            }
            const qty = gameState.equipment.inventory[instOrBaseId] || 0;
            if (qty <= 0) return;
            
            const eq = getEquipmentItemData(instOrBaseId);
            if (!eq) return;
            
            const basePrice = getEquipmentPrice(instOrBaseId);
            const achGold = getAchievementBonus('goldBonus') || 0;
            const goldMult = 1 + (getClassPassive('goldBoost') + achGold) / 100;
            const price = Math.floor(basePrice * goldMult);
            
            if (instOrBaseId.startsWith('inst_')) {
                const inst = gameState.equipment.instances?.[instOrBaseId];
                if (inst) {
                    inst.runas.forEach(runeId => {
                        if (runeId) {
                            gameState.runes[runeId] = (gameState.runes[runeId] || 0) + 1;
                        }
                    });
                    delete gameState.equipment.instances[instOrBaseId];
                }
            }
            
            gameState.equipment.inventory[instOrBaseId]--;
            if (gameState.equipment.inventory[instOrBaseId] <= 0) {
                delete gameState.equipment.inventory[instOrBaseId];
            }
            
            gameState.gold += price;
            
            showNotification('💰 Equipamento Vendido!', `Vendido ${eq.name} por ${price} ouro. (Runas inseridas foram devolvidas)`, 'success', eq.icon);
            
            updateInventory();
            updateUI();
        }

        function sellAllEquipment() {
            if (typeof window.hideEquipmentComparison === 'function') {
                window.hideEquipmentComparison();
            }
            let totalGold = 0;
            let countSold = 0;
            
            const items = Object.keys(gameState.equipment.inventory);
            
            items.forEach(instOrBaseId => {
                const qty = gameState.equipment.inventory[instOrBaseId] || 0;
                if (qty <= 0) return;
                
                const basePrice = getEquipmentPrice(instOrBaseId);
                const achGold = getAchievementBonus('goldBonus') || 0;
                const goldMult = 1 + (getClassPassive('goldBoost') + achGold) / 100;
                const price = Math.floor(basePrice * goldMult);
                
                for (let i = 0; i < qty; i++) {
                    if (instOrBaseId.startsWith('inst_')) {
                        const inst = gameState.equipment.instances?.[instOrBaseId];
                        if (inst) {
                            inst.runas.forEach(runeId => {
                                if (runeId) {
                                    gameState.runes[runeId] = (gameState.runes[runeId] || 0) + 1;
                                }
                            });
                            delete gameState.equipment.instances[instOrBaseId];
                        }
                    }
                    totalGold += price;
                    countSold++;
                }
                
                delete gameState.equipment.inventory[instOrBaseId];
            });
            
            if (countSold > 0) {
                gameState.gold += totalGold;
                showNotification('💰 Venda de Equipamentos!', `Vendidos ${countSold} equipamentos por ${totalGold} ouro. (Runas foram devolvidas)`, 'success');
            } else {
                showNotification('❌ Nada!', 'Nenhum equipamento guardado no inventário para vender.', 'error');
            }
            
            updateInventory();
            updateUI();
        }

        function updateInventory() {
            if (typeof window.hideEquipmentComparison === 'function') {
                window.hideEquipmentComparison();
            }
            const grid = document.getElementById('inventoryGrid');
            if (grid) {
                grid.innerHTML = '';

                // Coletar itens com quantidade > 0
                const itemsWithAmount = inventoryItems
                    .map(item => ({
                        ...item,
                        amount: gameState.inventory[item.key] || 0
                    }))
                    .filter(item => item.amount > 0);

                // Criar slots baseado no número de espaços do banco
                for (let i = 0; i < gameState.bankSlots; i++) {
                    const slot = document.createElement('div');
                    slot.className = 'inventory-slot';
                    slot.innerHTML = `<div class="slot-number">${i + 1}</div>`;

                    if (i < itemsWithAmount.length) {
                        const item = itemsWithAmount[i];
                        slot.classList.add('filled');
                        slot.innerHTML += `
                            <div class="inventory-item">
                                <div class="item-icon">${item.icon}</div>
                                <div class="item-name">${item.name}</div>
                                <div class="item-amount">${item.amount}</div>
                            </div>
                            <button class="info-item-btn" onclick="showItemInfo('${item.key}')" title="Informações">ℹ️</button>
                            <button class="sell-item-btn" onclick="sellItem('${item.key}', 1)" title="Vender 1">💰</button>
                            <button class="sell-all-stack-btn" onclick="sellItem('${item.key}', gameState.inventory['${item.key}'] || 0)" title="Vender Tudo (${item.amount})">✕ALL</button>
                        `;
                    } else {
                        slot.innerHTML += '<div class="empty-slot">Vazio</div>';
                    }

                    grid.appendChild(slot);
                }
            }

            const eqGrid = document.getElementById('equipmentInventoryGrid');
            if (eqGrid) {
                eqGrid.innerHTML = '';
                
                // Inicializar filtros se não existirem
                if (!window.eqFilters) {
                    window.eqFilters = {
                        category: 'all',
                        rarity: 'all',
                        stat: 'all',
                        sortBy: 'gs_desc'
                    };
                }

                const available = [];
                for (let [id, qty] of Object.entries(gameState.equipment.inventory)) {
                    if (qty <= 0) continue;
                    
                    const eq = getEquipmentItemData(id);
                    if (!eq) continue;
                    
                    if (id.startsWith('inst_')) {
                        available.push({ key: id, id: id, isInstance: true });
                    } else {
                        for (let i = 0; i < qty; i++) {
                            available.push({ key: `${id}_temp_${i}`, id: id, isInstance: false });
                        }
                    }
                }
                
                // Aplicar Filtros
                let filtered = available.filter(item => {
                    const eq = getEquipmentItemData(item.id);
                    if (!eq) return false;

                    // 1. Categoria (Tipo de Item)
                    if (window.eqFilters.category !== 'all') {
                        const slot = eq.slot;
                        if (window.eqFilters.category === 'weapon') {
                            if (slot !== 'weapon') return false;
                        } else if (window.eqFilters.category === 'armor') {
                            if (!['armor', 'helmet', 'shield', 'pants', 'boots'].includes(slot)) return false;
                        } else if (window.eqFilters.category === 'accessory') {
                            if (!['ring', 'amulet'].includes(slot)) return false;
                        }
                    }

                    // 2. Raridade
                    if (window.eqFilters.rarity !== 'all') {
                        if (eq.rarity !== window.eqFilters.rarity) return false;
                    }

                    // 4. Atributos (Status)
                    if (window.eqFilters.stat !== 'all') {
                        if (!eq.stats || eq.stats[window.eqFilters.stat] === undefined || eq.stats[window.eqFilters.stat] === 0) {
                            return false;
                        }
                    }

                    return true;
                });

                // 3. Ordenação
                const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, ancient: 6 };
                filtered.sort((a, b) => {
                    const eqA = getEquipmentItemData(a.id);
                    const eqB = getEquipmentItemData(b.id);
                    if (!eqA || !eqB) return 0;

                    if (window.eqFilters.sortBy === 'rarity_desc') {
                        const orderA = rarityOrder[eqA.rarity] || 0;
                        const orderB = rarityOrder[eqB.rarity] || 0;
                        if (orderB !== orderA) return orderB - orderA;
                        return eqA.name.localeCompare(eqB.name);
                    } else if (window.eqFilters.sortBy === 'rarity_asc') {
                        const orderA = rarityOrder[eqA.rarity] || 0;
                        const orderB = rarityOrder[eqB.rarity] || 0;
                        if (orderB !== orderA) return orderA - orderB;
                        return eqA.name.localeCompare(eqB.name);
                    } else if (window.eqFilters.sortBy === 'name_asc') {
                        return eqA.name.localeCompare(eqB.name);
                    } else if (window.eqFilters.sortBy === 'name_desc') {
                        return eqB.name.localeCompare(eqA.name);
                    } else if (window.eqFilters.sortBy === 'price_desc') {
                        const priceA = getEquipmentPrice(a.id);
                        const priceB = getEquipmentPrice(b.id);
                        return priceB - priceA;
                    } else if (window.eqFilters.sortBy === 'price_asc') {
                        const priceA = getEquipmentPrice(a.id);
                        const priceB = getEquipmentPrice(b.id);
                        return priceA - priceB;
                    } else if (window.eqFilters.sortBy === 'upgrade_desc') {
                        return (eqB.upgrade || 0) - (eqA.upgrade || 0);
                    } else if (window.eqFilters.sortBy === 'gs_desc') {
                        return calculateGearScore(eqB) - calculateGearScore(eqA);
                    } else if (window.eqFilters.sortBy === 'gs_asc') {
                        return calculateGearScore(eqA) - calculateGearScore(eqB);
                    }
                    return 0;
                });

                if (available.length === 0) {
                    eqGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#aaa; padding:20px; font-family:'Outfit', sans-serif;">Nenhum equipamento guardado no seu inventário.</div>`;
                } else if (filtered.length === 0) {
                    eqGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#aaa; padding:20px; font-family:'Outfit', sans-serif;">Nenhum equipamento corresponde aos filtros selecionados.</div>`;
                } else {
                    filtered.forEach(item => {
                        const eq = getEquipmentItemData(item.id);
                        if (!eq) return;
                        
                        const runesHtml = getEquipmentRunesHtml(item.id);
                        const price = getEquipmentPrice(item.id);
                        
                        const card = document.createElement('div');
                        const rarityClass = getEquipmentRarityClass(item.id);
                        card.className = `inventory-slot filled ${rarityClass}`;
                        card.style.height = 'auto';
                        card.style.padding = '12px';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.style.gap = '8px';
                        card.style.position = 'relative';
                        card.style.minWidth = '140px';
                        
                        card.setAttribute('onmouseenter', `showEquipmentComparison('${item.id}', event)`);
                        card.setAttribute('onmousemove', `moveEquipmentComparison(event)`);
                        card.setAttribute('onmouseleave', `hideEquipmentComparison()`);
                        
                        card.innerHTML = `
                            <div class="inventory-item" style="margin-bottom: 5px;">
                                <div class="item-icon" style="font-size: 1.8em; margin-bottom: 4px;">${eq.icon}</div>
                                <div class="item-name" style="color:${rarityColors[eq.rarity]}; font-weight:bold; font-family:'Outfit', sans-serif; font-size:0.9em; min-height: 28px; line-height: 1.2;">${eq.name}</div>
                                <div style="font-size: 0.75em; color: #aaa; margin-top: 4px; font-family:'Outfit', sans-serif;">${formatStats(eq)}</div>
                            </div>
                            <div style="margin-top:auto; width:100%; display:flex; flex-direction:column; gap:6px;">
                                ${runesHtml}
                                <div style="display:flex; gap:4px; width:100%;">
                                    <button class="runar-action-btn" onclick="equipItem('${item.id}')" style="flex:1; padding: 4px 6px; font-size: 0.75em; margin: 0; background: #4aff4a; color:#000;">Equipar</button>
                                    <button class="runar-action-btn" onclick="sellEquipment('${item.id}')" style="padding: 4px 6px; font-size: 0.75em; margin: 0; background: #ff4444; color:#fff;" title="Vender por ${price}💰">💰</button>
                                </div>
                            </div>
                        `;
                        eqGrid.appendChild(card);
                    });
                }
            }
        }

        // Funções Globais de Controle de Filtros
        window.setEqFilterCategory = function(cat) {
            if (!window.eqFilters) window.eqFilters = {};
            window.eqFilters.category = cat;
            
            // Atualizar estado visual das abas
            const tabs = ['all', 'weapon', 'armor', 'accessory'];
            tabs.forEach(t => {
                document.querySelectorAll(`#eq-tab-${t}`).forEach(el => {
                    if (t === cat) el.classList.add('active');
                    else el.classList.remove('active');
                });
            });
            updateInventory();
        };

        window.setEqFilterRarity = function(rarity) {
            if (!window.eqFilters) window.eqFilters = {};
            window.eqFilters.rarity = rarity;
            document.querySelectorAll('#eqFilterRarity').forEach(el => el.value = rarity);
            updateInventory();
        };

        window.setEqFilterStat = function(stat) {
            if (!window.eqFilters) window.eqFilters = {};
            window.eqFilters.stat = stat;
            document.querySelectorAll('#eqFilterStat').forEach(el => el.value = stat);
            updateInventory();
        };

        window.setEqSortBy = function(sortBy) {
            if (!window.eqFilters) window.eqFilters = {};
            window.eqFilters.sortBy = sortBy;
            document.querySelectorAll('#eqSortBy').forEach(el => el.value = sortBy);
            updateInventory();
        };

        window.toggleEqAdvancedFilters = function() {
            const panels = document.querySelectorAll('#eqAdvFiltersPanel');
            const btns = document.querySelectorAll('.eq-adv-toggle-btn');
            
            panels.forEach(panel => {
                if (panel.style.display === 'none' || panel.style.display === '') {
                    panel.style.display = 'grid';
                    btns.forEach(btn => btn.classList.add('active'));
                } else {
                    panel.style.display = 'none';
                    btns.forEach(btn => btn.classList.remove('active'));
                }
            });
        };

        function sellItem(key, amount) {
            if (!gameState.inventory[key] || gameState.inventory[key] < amount) return;
            const basePrice = getItemPrice(key) * amount;
            const achGold   = getAchievementBonus('goldBonus');
            const goldMult = 1 + (getClassPassive('goldBoost') + achGold) / 100;
            const price = Math.floor(basePrice * goldMult);
            gameState.inventory[key] -= amount;
            gameState.gold += price;
            initAchievements();
            gameState.stats.totalSells = (gameState.stats.totalSells || 0) + amount;
            gameState.stats.totalGoldSpent = (gameState.stats.totalGoldSpent || 0); // track separately if needed
            const bonusMsg = goldMult > 1 ? ` [🦁 +${Math.round((goldMult-1)*100)}% ouro]` : '';
            showNotification('💰 Venda!', `Vendido ${amount}x ${getItemName(key)} por ${price} ouro.${bonusMsg}`, 'success');
            checkAchievements();
            updateUI();
        }

        function sellAllItems() {
            let total = 0, items = 0;
            for (let [key, qty] of Object.entries(gameState.inventory)) {
                if (qty > 0) { total += qty * getItemPrice(key); items += qty; gameState.inventory[key] = 0; }
            }
            if (items > 0) { gameState.gold += total; showNotification('💰 Venda em massa!', `Vendidos ${items} itens por ${total} ouro.`, 'success'); }
            else showNotification('❌ Nada!', 'Inventário vazio.', 'error');
            updateUI();
        }

        // ============================================
        // SISTEMA DE EQUIPAMENTOS
        // ============================================
        // rarityColors, rarityNames e slotNames definidos em data-equipamentos.js

        const runasData = {
            runa_sabio: {
                id: 'runa_sabio',
                name: 'Runa do Sábio',
                icon: '📚',
                rarity: 'common',
                desc: 'Concede +10% de XP ganho',
                stats: { xpBonus: 10 },
                ingredients: [{ type: 'wood3', qty: 5 }, { type: 'bar2', qty: 2 }]
            },
            runa_guerreiro: {
                id: 'runa_guerreiro',
                name: 'Runa do Guerreiro',
                icon: '⚔️',
                rarity: 'common',
                desc: 'Concede +5% de Dano Crítico',
                stats: { critDamage: 5 },
                ingredients: [{ type: 'wood3', qty: 5 }, { type: 'bar2', qty: 2 }]
            },
            runa_veloz: {
                id: 'runa_veloz',
                name: 'Runa do Veloz',
                icon: '⚡',
                rarity: 'common',
                desc: 'Concede +8% de Velocidade de Ataque',
                stats: { speedBonus: 8 },
                ingredients: [{ type: 'wood3', qty: 5 }, { type: 'bar2', qty: 2 }]
            },
            runa_colosso: {
                id: 'runa_colosso',
                name: 'Runa do Colosso',
                icon: '🧱',
                rarity: 'uncommon',
                desc: 'Concede +15% de Vida Máxima',
                stats: { maxHealthPct: 15 },
                ingredients: [{ type: 'wood4', qty: 8 }, { type: 'bar3', qty: 3 }]
            },
            runa_vampiro: {
                id: 'runa_vampiro',
                name: 'Runa do Vampiro',
                icon: '🦇',
                rarity: 'uncommon',
                desc: 'Concede +3% de Roubo de Vida',
                stats: { lifesteal: 3 },
                ingredients: [{ type: 'wood4', qty: 8 }, { type: 'bar3', qty: 3 }]
            },
            runa_trovao: {
                id: 'runa_trovao',
                name: 'Runa do Trovão',
                icon: '⚡',
                rarity: 'rare',
                desc: '10% de chance de causar 50% de dano elétrico extra',
                stats: { thunderChance: 10 },
                ingredients: [{ type: 'wood5', qty: 10 }, { type: 'bar4', qty: 4 }]
            },
            runa_tempo: {
                id: 'runa_tempo',
                name: 'Runa do Tempo',
                icon: '⏳',
                rarity: 'rare',
                desc: 'Reduz o tempo de craft em 15%',
                stats: { craftSpeedBonus: 15 },
                ingredients: [{ type: 'wood5', qty: 10 }, { type: 'bar4', qty: 4 }]
            },
            runa_fenix: {
                id: 'runa_fenix',
                name: 'Runa do Fênix',
                icon: '🔥',
                rarity: 'epic',
                desc: 'Ao morrer, revive com 20% de vida (1 vez por combate)',
                stats: { phoenix: 1 },
                ingredients: [{ type: 'wood5', qty: 15 }, { type: 'bar5', qty: 5 }]
            }
        };

        function getEquipmentItemData(id) {
            if (!id) return null;
            if (typeof id === 'string' && id.startsWith('inst_')) {
                const inst = gameState.equipment.instances?.[id];
                if (inst) {
                    const base = equipmentData[inst.id];
                    if (!base) return null;
                    
                    const quality = inst.quality || 'common';
                    const copy = JSON.parse(JSON.stringify(base));
                    
                    // Mesclar atributos bônus dinâmicos da instância no item cópia
                    if (!copy.stats) copy.stats = {};
                    if (inst.bonusStats) {
                        for (let stat in inst.bonusStats) {
                            if (copy.stats[stat] === undefined) {
                                copy.stats[stat] = 0;
                            }
                            copy.stats[stat] += inst.bonusStats[stat];
                        }
                    }
                    const qualityNames = {
                        uncommon: '[Incomum]',
                        rare: '[Raro]',
                        epic: '[Épico]',
                        legendary: '✨ [Lendário]',
                        ancient: '🔥 [Ancestral]'
                    };
                    if (quality !== 'common') {
                        copy.name = `${copy.name} ${qualityNames[quality]}`;
                    }

                    // Se rolar perfeito/obra-prima (todas as rolagens na instância acima de 110%)
                    let isPerfect = false;
                    if (inst.statRolls) {
                        const rolls = Object.values(inst.statRolls);
                        if (rolls.length > 0 && rolls.every(r => r >= 1.10)) {
                            isPerfect = true;
                        }
                    }
                    const upgrade = inst.upgrade || 0;
                    if (upgrade > 0) {
                        copy.name = `${copy.name} +${upgrade}`;
                    }
                    if (isPerfect) {
                        copy.name = `${copy.name} ⭐`;
                    }
                    
                    const qualityMults = {
                        common: 1.0,
                        uncommon: 1.15,
                        rare: 1.30,
                        epic: 1.50,
                        legendary: 1.75,
                        ancient: 2.00
                    };
                    const mult = qualityMults[quality] || 1.0;
                    const upgradeMult = 1 + (upgrade * 0.08); // +8% de status por nível de aprimoramento
                    
                    // Aplicar multiplicador de qualidade + rolagem individual de atributos + aprimoramento
                    for (let stat in copy.stats) {
                        const statRoll = inst.statRolls?.[stat] || 1.0;
                        copy.stats[stat] = Math.round(copy.stats[stat] * mult * statRoll * upgradeMult);
                    }
                    
                    copy.rarity = quality;
                    copy.element = inst.element;
                    copy.elementValue = inst.elementValue;
                    copy.statRolls = inst.statRolls;
                    copy.isPerfect = isPerfect;
                    copy.instanceId = id;
                    copy.upgrade = upgrade;
                    return copy;
                }
            }
            return equipmentData[id];
        }

        function getEquipmentRarityClass(id) {
            if (typeof id === 'string' && id.startsWith('inst_')) {
                const inst = gameState.equipment.instances?.[id];
                if (inst) {
                    const quality = inst.quality || 'common';
                    return `rarity-${quality}-card`;
                }
            }
            const eq = getEquipmentItemData(id);
            if (!eq) return 'rarity-common-card';
            return `rarity-${eq.rarity}-card`;
        }

        function addNewEquipmentToInventory(equipId, forcedQuality) {
            if (!gameState.equipment.instances) gameState.equipment.instances = {};
            
            // Rolar qualidade individual baseada em chances de loot ou forçar uma qualidade
            let quality = 'common';
            if (forcedQuality) {
                quality = forcedQuality;
            } else {
                const rand = Math.random();
                if (rand < 0.0025) quality = 'ancient';      // 0.25% chance
                else if (rand < 0.02) quality = 'legendary'; // 1.75% chance
                else if (rand < 0.07) quality = 'epic';      // 5% chance
                else if (rand < 0.19) quality = 'rare';      // 12% chance
                else if (rand < 0.40) quality = 'uncommon';  // 21% chance
            }
            
            const hasRunesRoll = Math.random() < 0.50;
            const needsRunes = quality === 'epic' || quality === 'legendary' || quality === 'ancient' || hasRunesRoll;
            
            const prefix = quality === 'ancient' ? 'inst_anc_' : 'inst_';
            const instId = prefix + Date.now() + '_' + Math.floor(Math.random() * 10000);

            // Gerar rolagens de status
            const qualityRanges = {
                common: { min: 0.85, max: 1.10 },
                uncommon: { min: 0.90, max: 1.15 },
                rare: { min: 0.95, max: 1.20 },
                epic: { min: 1.00, max: 1.30 },
                legendary: { min: 1.05, max: 1.40 },
                ancient: { min: 1.10, max: 1.50 }
            };
            const range = qualityRanges[quality] || qualityRanges.common;
            const statRolls = {};
            const bonusStats = {};
            const baseItem = equipmentData[equipId];
            if (baseItem) {
                if (baseItem.stats) {
                    for (let stat in baseItem.stats) {
                        statRolls[stat] = parseFloat((range.min + Math.random() * (range.max - range.min)).toFixed(2));
                    }
                }

                // Gerar atributos adicionais aleatórios (sub-stats) baseados na qualidade do item
                let numBonuses = 0;
                if (quality === 'uncommon') {
                    if (Math.random() < 0.30) numBonuses = 1;
                } else if (quality === 'rare') {
                    numBonuses = Math.random() < 0.25 ? 2 : 1;
                } else if (quality === 'epic') {
                    numBonuses = Math.random() < 0.50 ? 2 : 1;
                } else if (quality === 'legendary') {
                    numBonuses = Math.random() < 0.30 ? 3 : 2;
                } else if (quality === 'ancient') {
                    numBonuses = Math.random() < 0.50 ? 3 : 2;
                }

                if (numBonuses > 0) {
                    let pool = [];
                    if (baseItem.slot === 'weapon') {
                        pool = ['strength', 'critChance', 'speedBonus', 'xpBonus', 'armorPenetration', 'trueDamage', 'lootLuck'];
                    } else if (['armor', 'pants', 'helmet', 'shield'].includes(baseItem.slot)) {
                        pool = ['defense', 'maxHealth', 'speedBonus', 'xpBonus', 'tenacity'];
                    } else {
                        pool = ['strength', 'defense', 'maxHealth', 'critChance', 'speedBonus', 'xpBonus'];
                    }

                    // Evitar duplicar status que já vêm como base no item
                    const baseStatsList = baseItem.stats ? Object.keys(baseItem.stats) : [];
                    let availablePool = pool.filter(s => !baseStatsList.includes(s));
                    if (availablePool.length === 0) availablePool = [...pool];

                    for (let k = 0; k < numBonuses; k++) {
                        if (availablePool.length === 0) break;
                        const idx = Math.floor(Math.random() * availablePool.length);
                        const rolledStat = availablePool.splice(idx, 1)[0];

                        let baseVal = 0;
                        if (rolledStat === 'strength') baseVal = Math.floor(1 + Math.random() * 3);
                        else if (rolledStat === 'defense') baseVal = Math.floor(1 + Math.random() * 3);
                        else if (rolledStat === 'maxHealth') baseVal = Math.floor(5 + Math.random() * 11);
                        else if (rolledStat === 'critChance') baseVal = Math.floor(1 + Math.random() * 3);
                        else if (rolledStat === 'speedBonus') baseVal = Math.floor(2 + Math.random() * 4);
                        else if (rolledStat === 'xpBonus') baseVal = Math.floor(2 + Math.random() * 4);
                        else if (rolledStat === 'armorPenetration') baseVal = Math.floor(2 + Math.random() * 8); // 2 to 9%
                        else if (rolledStat === 'trueDamage') baseVal = Math.floor(1 + Math.random() * 5); // 1 to 5
                        else if (rolledStat === 'lootLuck') baseVal = Math.floor(1 + Math.random() * 5); // 1 to 5%
                        else if (rolledStat === 'tenacity') baseVal = Math.floor(3 + Math.random() * 8); // 3 to 10%

                        if (baseVal > 0) {
                            bonusStats[rolledStat] = baseVal;
                            // Adiciona rolagem individual para o novo status
                            statRolls[rolledStat] = parseFloat((range.min + Math.random() * (range.max - range.min)).toFixed(2));
                        }
                    }
                }
            }

            // Gerar elemento nativo (15% chance se quality !== 'common', 5% se for common)
            const elementChance = quality !== 'common' ? 0.15 : 0.05;
            let el = null;
            let elVal = 0;
            if (baseItem && Math.random() < elementChance) {
                const elements = ['fire', 'ice', 'water', 'wind', 'earth', 'dark', 'holy', 'lightning'];
                el = elements[Math.floor(Math.random() * elements.length)];
                if (baseItem.slot === 'weapon') {
                    // Armas ganham dano elemental: 10 a 25
                    elVal = Math.floor(10 + Math.random() * 16);
                } else {
                    // Armaduras ganham resistência elemental: 5% a 20%
                    elVal = Math.floor(5 + Math.random() * 16);
                }
            }
            
            gameState.equipment.instances[instId] = {
                id: equipId,
                slots: 2,
                runas: [null, null],
                quality: quality,
                statRolls: statRolls,
                bonusStats: bonusStats,
                element: el,
                elementValue: elVal
            };
            gameState.equipment.inventory[instId] = 1;

            // Auto-equipar se ativo nas configurações
            if (gameState.settings?.autoEquip) {
                setTimeout(() => {
                    autoEquipIfSuperior(instId);
                }, 100);
            }

            return instId;
        }

        function autoEquipIfSuperior(instId) {
            if (!gameState.equipment.instances) return;
            const newEq = getEquipmentItemData(instId);
            if (!newEq) return;
            
            const slot = newEq.slot;
            const currentInstId = gameState.equipment.equipped[slot];
            
            // Se não houver nada equipado nesse slot, equipa na hora!
            if (!currentInstId) {
                equipItem(instId);
                return;
            }
            
            const curEq = getEquipmentItemData(currentInstId);
            if (!curEq) {
                equipItem(instId);
                return;
            }
            
            // Comparação de poder: somamos todos os atributos úteis
            function getPowerValue(eq) {
                let p = 0;
                if (eq.stats) {
                    p += (eq.stats.strength || 0) * 1.5;
                    p += (eq.stats.defense || 0) * 1.5;
                    p += (eq.stats.maxHealth || 0) * 0.5;
                    p += (eq.stats.critChance || 0) * 1.2;
                    p += (eq.stats.speedBonus || 0) * 1.0;
                    p += (eq.stats.xpBonus || 0) * 0.5;
                }
                if (eq.elementValue) {
                    p += eq.elementValue * (eq.slot === 'weapon' ? 1.0 : 0.8);
                }
                return p;
            }
            
            const newPower = getPowerValue(newEq);
            const curPower = getPowerValue(curEq);
            
            if (newPower > curPower) {
                equipItem(instId);
            }
        }

        function getEquipmentRunesHtml(id) {
            if (!id || typeof id !== 'string' || !id.startsWith('inst_')) return '';
            const inst = gameState.equipment.instances?.[id];
            if (!inst || !inst.slots) return '';
            
            const parts = [];
            for (let i = 0; i < inst.slots; i++) {
                const runeId = inst.runas[i];
                if (runeId) {
                    const rune = runasData[runeId];
                    if (rune) {
                        parts.push(`<span class="rune-slot-indicator filled">🟣 ${rune.name}</span>`);
                    } else {
                        parts.push(`<span class="rune-slot-indicator empty">🟢 Slot Vazio</span>`);
                    }
                } else {
                    parts.push(`<span class="rune-slot-indicator empty">🟢 Slot Vazio</span>`);
                }
            }
            return `<div class="rune-slots-display">${parts.join('')}</div>`;
        }

        function getEquipmentBonuses() {
            const bonuses = { strength: 0, defense: 0, maxHealth: 0, speedBonus: 0, critChance: 0, xpBonus: 0,
                maxHealthPct: 0, critDamage: 0, lifesteal: 0, thunderChance: 0, craftSpeedBonus: 0, phoenix: 0,
                armorPenetration: 0, trueDamage: 0, lootLuck: 0, tenacity: 0 };
            for (let slot in gameState.equipment.equipped) {
                const id = gameState.equipment.equipped[slot];
                if (!id) continue;
                const eq = getEquipmentItemData(id);   // resolve instâncias e qualidades
                if (!eq) continue;
                for (let stat in eq.stats) bonuses[stat] = (bonuses[stat] || 0) + eq.stats[stat];
                // Adicionar bônus das runas equipadas
                if (id.startsWith('inst_')) {
                    const inst = gameState.equipment.instances?.[id];
                    if (inst && inst.runas) {
                        inst.runas.forEach(runeId => {
                            if (runeId && runasData[runeId]) {
                                const runeStats = runasData[runeId].stats;
                                for (let stat in runeStats) {
                                    bonuses[stat] = (bonuses[stat] || 0) + runeStats[stat];
                                }
                            }
                        });
                    }
                }
            }

            // Elefante de Guerra: +15% Defesa Base (escalado por nível)
            if (gameState && gameState.pets && gameState.pets.active === 'war_elephant') {
                const petState = getPetState('war_elephant');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'war_elephant') : null;
                const baseElephant = petData ? (petData.effectValue || 20) : 20;
                const bonusDefensePct = (baseElephant * 0.75) * levelMultiplier; // 15% é 75% de 20
                bonuses.defense = Math.floor(bonuses.defense * (1 + bonusDefensePct / 100));
            }

            return bonuses;
        }


        function equipItem(equipId) {
            if (typeof window.hideEquipmentComparison === 'function') window.hideEquipmentComparison();
            const eq = getEquipmentItemData(equipId);
            if (!eq) return;
            const inv = gameState.equipment.inventory;
            if (!inv[equipId] || inv[equipId] <= 0) { showNotification('❌ Sem item!', 'Você não possui este equipamento.', 'error'); return; }
            // Desequipa o atual no slot
            const current = gameState.equipment.equipped[eq.slot];
            if (current) {
                inv[current] = (inv[current] || 0) + 1;
            }
            inv[equipId]--;
            if (inv[equipId] <= 0) delete inv[equipId];
            gameState.equipment.equipped[eq.slot] = equipId;
            showNotification('⚔️ Equipado!', `${eq.name} equipado no slot ${slotNames[eq.slot]}!`, 'success', eq.icon);
            updateUI();
            updateCharacterPage();
            closeEquipModal();
        }

        function unequipItem(slot) {
            const id = gameState.equipment.equipped[slot];
            if (!id) return;
            gameState.equipment.inventory[id] = (gameState.equipment.inventory[id] || 0) + 1;
            gameState.equipment.equipped[slot] = null;
            const eq = getEquipmentItemData(id);
            showNotification('📦 Desequipado!', `${eq ? eq.name : 'Item'} removido.`, 'info');
            updateUI();
            updateCharacterPage();
        }

        function craftEquipment(equipId) {
            const eq = equipmentData[equipId];
            if (!eq) return;
            const skill = eq.craftSkill;
            if (gameState.skills[skill].level < eq.craftReq) {
                showNotification('❌ Nível!', `Precisa de nível ${eq.craftReq} em ${skill === 'smithing' ? 'Ferraria' : 'Criação'}.`, 'error');
                return;
            }
            for (let ing of eq.ingredients) {
                if ((gameState.inventory[ing.type] || 0) < ing.qty) {
                    showNotification('❌ Materiais!', `Faltam ${ing.qty}x ${getItemName(ing.type)}.`, 'error');
                    return;
                }
            }
            for (let ing of eq.ingredients) gameState.inventory[ing.type] -= ing.qty;
            const xpGain = eq.craftReq * 5 + 20;
            setTimeout(() => {
                const finalId = addNewEquipmentToInventory(equipId);
                const hasSlots = finalId.startsWith('inst_');
                
                // Incrementa contador de itens criados
                if (typeof incrementItemsCrafted === 'function') {
                    incrementItemsCrafted(1);
                }
                
                // Grande Observatório
                incrementEquipmentForged();
                
                addXP(skill, xpGain);
                showNotification('✅ Equipamento criado!', `${eq.icon} ${eq.name}${hasSlots ? ' (2 Slots)' : ''} forjado!`, 'success', eq.icon);
                if (skill === 'smithing') updateSmithingPage();
                else updateCraftingPage();
                updateCharacterPage();
                updateUI();
            }, 3000);
            showNotification('🔨 Forjando...', `Criando ${eq.name}...`, 'info', eq.icon);
            if (skill === 'smithing') updateSmithingPage();
            else updateCraftingPage();
        }

        function openEquipModal(slot) {
            closeEquipModal();
            
            // Listar itens individualmente
            const available = [];
            for (let [id, qty] of Object.entries(gameState.equipment.inventory)) {
                if (qty <= 0) continue;
                
                const eq = getEquipmentItemData(id);
                if (!eq || eq.slot !== slot) continue;
                
                if (id.startsWith('inst_')) {
                    available.push({ key: id, id: id, isInstance: true });
                } else {
                    for (let i = 0; i < qty; i++) {
                        available.push({ key: `${id}_temp_${i}`, id: id, isInstance: false });
                    }
                }
            }

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = 'equipModalOverlay';
            overlay.onclick = closeEquipModal;

            const modal = document.createElement('div');
            modal.className = 'equip-modal';
            modal.id = 'equipModal';

            const currentId = gameState.equipment.equipped[slot];
            let html = `<div class="equip-modal-header"><h3>⚔️ Equipar ${slotNames[slot]}</h3><button class="close-modal" onclick="closeEquipModal()">×</button></div>`;

            if (currentId) {
                const cur = getEquipmentItemData(currentId);
                if (cur) {
                    const rarityClass = getEquipmentRarityClass(currentId);
                    html += `<div class="${rarityClass}" style="margin-bottom:12px;padding:10px;border-radius:8px;border:2px solid;">
                        <div style="color:#4aff4a;font-size:0.85em;margin-bottom:5px;">✅ Equipado atualmente:</div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>${cur.icon} <span style="color:${rarityColors[cur.rarity]}">${cur.name}</span></span>
                            <button class="unequip-btn" onclick="unequipItem('${slot}');closeEquipModal();">Remover</button>
                        </div>
                        <div style="color:#aaa;font-size:0.8em;">${formatStats(cur)}</div>
                        ${runesHtml}
                    </div>`;
                }
            }

            if (available.length === 0) {
                html += `<div style="text-align:center;color:#aaa;padding:20px;">Nenhum equipamento disponível para este slot.<br><span style="font-size:0.85em;">Forje equipamentos na Ferraria ou Criação!</span></div>`;
            } else {
                html += `<div style="color:#aaa;font-size:0.85em;margin-bottom:10px;">Selecione para equipar:</div>`;
                available.forEach(item => {
                    const eq = getEquipmentItemData(item.id);
                    if (!eq) return;
                    
                    const isCurrent = currentId === item.id;
                    const runesHtml = getEquipmentRunesHtml(item.id);
                    
                    const rarityClass = getEquipmentRarityClass(item.id);
                    html += `<div class="equip-option ${isCurrent ? 'equipped-current' : ''} ${rarityClass}">
                        <div class="equip-option-left">
                            <span class="equip-option-icon">${eq.icon}</span>
                            <div>
                                <div class="equip-option-name" style="color:${rarityColors[eq.rarity]}">${eq.name} <span style="color:#888;font-size:0.8em;">[${rarityNames[eq.rarity]}]</span></div>
                                <div class="equip-option-stats">${formatStats(eq)}</div>
                                ${runesHtml}
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <button class="equip-btn-confirm" onclick="equipItem('${item.id}')">Equipar</button>
                        </div>
                    </div>`;
                });
            }

            modal.innerHTML = html;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        function closeEquipModal() {
            const m = document.getElementById('equipModal');
            const o = document.getElementById('equipModalOverlay');
            if (m) m.remove();
            if (o) o.remove();
        }

        function calculateGearScore(eq) {
            if (!eq) return 0;
            const stats = eq.stats || eq;
            let gs = 0;
            if (stats.strength) gs += stats.strength * 2;
            if (stats.defense) gs += stats.defense * 2;
            if (stats.maxHealth) gs += stats.maxHealth * 0.5;
            if (stats.speedBonus) gs += stats.speedBonus * 3;
            if (stats.critChance) gs += stats.critChance * 4;
            if (stats.xpBonus) gs += stats.xpBonus * 1;
            if (stats.armorPenetration) gs += stats.armorPenetration * 4;
            if (stats.trueDamage) gs += stats.trueDamage * 5;
            if (stats.lootLuck) gs += stats.lootLuck * 2;
            if (stats.tenacity) gs += stats.tenacity * 2;
            return Math.round(gs);
        }

        function formatStats(eq) {
            if (!eq) return '';
            // Se passar apenas o objeto stats antigo
            const stats = eq.stats || eq;
            const rolls = eq.statRolls || {};
            const parts = [];
            
            const gs = calculateGearScore(eq);
            if (gs > 0) {
                parts.push(`<div class="gear-score">⭐ Gear Score: ${gs}</div>`);
            }
            
            // Atributos Básicos
            if (stats.strength) {
                const rollPct = rolls.strength ? ` (${Math.round(rolls.strength * 100)}%)` : '';
                parts.push(`⚔️ Força: +${stats.strength}${rollPct}`);
            }
            if (stats.defense) {
                const rollPct = rolls.defense ? ` (${Math.round(rolls.defense * 100)}%)` : '';
                parts.push(`🛡️ Defesa: +${stats.defense}${rollPct}`);
            }
            if (stats.maxHealth) {
                const rollPct = rolls.maxHealth ? ` (${Math.round(rolls.maxHealth * 100)}%)` : '';
                parts.push(`❤️ Vida: +${stats.maxHealth}${rollPct}`);
            }
            if (stats.speedBonus) {
                const rollPct = rolls.speedBonus ? ` (${Math.round(rolls.speedBonus * 100)}%)` : '';
                parts.push(`⚡ Velocidade: +${stats.speedBonus}%${rollPct}`);
            }
            if (stats.critChance) {
                const rollPct = rolls.critChance ? ` (${Math.round(rolls.critChance * 100)}%)` : '';
                parts.push(`🍀 Crítico: +${stats.critChance}%${rollPct}`);
            }
            if (stats.xpBonus) {
                const rollPct = rolls.xpBonus ? ` (${Math.round(rolls.xpBonus * 100)}%)` : '';
                parts.push(`📚 XP: +${stats.xpBonus}%${rollPct}`);
            }
            if (stats.armorPenetration) {
                const rollPct = rolls.armorPenetration ? ` (${Math.round(rolls.armorPenetration * 100)}%)` : '';
                parts.push(`🎯 Pen. Armadura: +${stats.armorPenetration}%${rollPct}`);
            }
            if (stats.trueDamage) {
                const rollPct = rolls.trueDamage ? ` (${Math.round(rolls.trueDamage * 100)}%)` : '';
                parts.push(`🩸 Dano Puro: +${stats.trueDamage}${rollPct}`);
            }
            if (stats.lootLuck) {
                const rollPct = rolls.lootLuck ? ` (${Math.round(rolls.lootLuck * 100)}%)` : '';
                parts.push(`🍀 Sorte Saqueador: +${stats.lootLuck}%${rollPct}`);
            }
            if (stats.tenacity) {
                const rollPct = rolls.tenacity ? ` (${Math.round(rolls.tenacity * 100)}%)` : '';
                parts.push(`🛡️ Tenacidade: +${stats.tenacity}%${rollPct}`);
            }

            let text = parts.join(' | ');

            // Se tiver nível de aprimoramento
            if (eq.upgrade > 0) {
                text += `<br><span style="color:#ff9944; font-weight:bold; font-size:0.95em;">⚡ Aprimoramento: +${eq.upgrade} (+${Math.round(eq.upgrade * 8)}% Atributos)</span>`;
            }

            // Se tiver elemento nativo
            if (eq.element && eq.elementValue) {
                const elementEmojis = { fire: '🔥', ice: '❄️', lightning: '⚡', nature: '🌿', holy: '✨', dark: '💀', water: '💧', wind: '🌪️', earth: '🪨' };
                const elementLabels = { fire: 'Fogo', ice: 'Gelo', lightning: 'Raio', nature: 'Natureza', holy: 'Luz', dark: 'Trevas', water: 'Água', wind: 'Vento', earth: 'Terra' };
                const emoji = elementEmojis[eq.element] || '🔮';
                const label = elementLabels[eq.element] || eq.element;
                
                if (eq.slot === 'weapon') {
                    text += `<br><span style="color:#ffd700; font-weight:bold; font-size:0.95em;">${emoji} Elemento Nativo: ${label} (+${eq.elementValue} Dano)</span>`;
                } else {
                    text += `<br><span style="color:#4aff4a; font-weight:bold; font-size:0.95em;">${emoji} Resistência Nativa: ${label} (+${eq.elementValue}%)</span>`;
                }
            }
            return text;
        }

        function updateCharacterPage() {
            const bonuses = getEquipmentBonuses();
            
            const achHP = getAchievementBonus('healthBonus') || 0;
            const equipHP = bonuses.maxHealth || 0;
            const totalHPBase = 50 + gameState.upgrades.healthBonus + achHP + equipHP;
            const colossoPct = bonuses.maxHealthPct || 0;
            
            // Elefante de Guerra: +20% HP Máximo (escalado por nível)
            let petHealthMult = 1.0;
            if (gameState.pets && gameState.pets.active === 'war_elephant') {
                const petState = getPetState('war_elephant');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'war_elephant') : null;
                const baseElephant = petData ? (petData.effectValue || 20) : 20;
                petHealthMult += (baseElephant * levelMultiplier) / 100;
            }
            const totalHP = Math.floor(totalHPBase * (1 + colossoPct / 100) * petHealthMult);
            
            const achSTR = getAchievementBonus('strengthBonus') || 0;
            const equipSTR = bonuses.strength || 0;
            const strengthBase = 5 + gameState.upgrades.strengthBonus + achSTR + equipSTR;
            
            // Lobo de Guerra: Bônus de Dano
            let petStrMult = 1.0;
            if (gameState.pets && gameState.pets.active === 'war_wolf') {
                const petState = getPetState('war_wolf');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                petStrMult += (10 * levelMultiplier) / 100; // assumindo 10% base
            }
            const totalSTR = Math.floor(strengthBase * petStrMult);
            
            let rawDefense = bonuses.defense || 0;
            const golemBonus = getCharacterClassPassive('golemPerk');
            if (golemBonus > 0) {
                rawDefense = Math.floor(rawDefense * (1 + golemBonus / 100));
            }
            const turtleBonus = getCharacterClassPassive('turtleDefense');
            if (turtleBonus > 0) {
                const extraDef = Math.floor((gameState.arena?.wins || 0) / 50);
                rawDefense += extraDef;
            }
            const guardBonus = getClassPassive('defenseBoost');
            if (guardBonus > 0) {
                rawDefense = Math.floor(rawDefense * (1 + guardBonus / 100));
            }
            const totalDEF = rawDefense;
            
            // Calcular bônus de runas separadamente (para exibição no breakdown)
            let runeXP = 0, runeSPD = 0;
            for (let slot in gameState.equipment.equipped) {
                const id = gameState.equipment.equipped[slot];
                if (!id || !id.startsWith('inst_')) continue;
                const inst = gameState.equipment.instances?.[id];
                if (inst && inst.runas) {
                    inst.runas.forEach(runeId => {
                        if (runeId && runasData[runeId]) {
                            const s = runasData[runeId].stats;
                            if (s.xpBonus) runeXP += s.xpBonus;
                            if (s.speedBonus) runeSPD += s.speedBonus;
                        }
                    });
                }
            }
            
            const classSPD = getClassPassive('speedBonus') || 0;
            const equipSPD = (bonuses.speedBonus || 0) - runeSPD;
            const totalSPD = classSPD + equipSPD + runeSPD;
            
            const techCrit = applyTechBonus('criticalChance') || 0;
            const equipCrit = bonuses.critChance || 0;
            const potionCrit = applyPotionEffects('luck') || 0;
            const classCrit = getClassPassive('critChance') || 0;
            const achCrit = getAchievementBonus('critChance') || 0;
            
            // Gato Preto: +10% Crit Chance (escalado por nível)
            let petCrit = 0;
            if (gameState.pets && gameState.pets.active === 'gato_preto') {
                const petState = getPetState('gato_preto');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'gato_preto') : null;
                const baseCrit = petData ? (petData.effectValue || 10) : 10;
                petCrit = baseCrit * levelMultiplier;
            }
            const totalCRIT = techCrit + equipCrit + potionCrit + classCrit + achCrit + petCrit;
            
            const techXP = applyTechBonus('xpBoost') || 0;
            const equipXP = (bonuses.xpBonus || 0) - runeXP;
            const classXP = getClassPassive('xpBoost_all') || 0;
            const achXP = getAchievementBonus('xpBoost_all') || 0;
            const meistreXPChar = applyPotionEffects('xpBoost_all_pot') || 0;
            
            // Dragão de Cristal: +15% XP global (escalado por nível)
            let petXP = 0;
            if (gameState.pets && gameState.pets.active === 'crystal_dragon') {
                const petState = getPetState('crystal_dragon');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                petXP = 15 * levelMultiplier;
            }
            const totalXP = techXP + equipXP + runeXP + classXP + achXP + meistreXPChar + petXP;

            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            set('charStatHP',   totalHP);
            set('charStatSTR',  totalSTR);
            set('charStatDEF',  totalDEF);
            set('charStatSPD',  totalSPD + '%');
            set('charStatCRIT', totalCRIT + '%');
            set('charStatXP',   totalXP + '%');
            
            // Novos Atributos
            const totalPen = bonuses.armorPenetration || 0;
            const totalTrue = bonuses.trueDamage || 0;
            const totalTenacity = bonuses.tenacity || 0;
            const totalLuck = bonuses.lootLuck || 0;
            
            set('charStatPen', totalPen + '%');
            set('charStatTrue', totalTrue);
            set('charStatTenacity', totalTenacity + '%');
            set('charStatLuck', totalLuck + '%');

            const wpnEnchantId = gameState.player?.enchantments?.weapon;
            const armEnchantId = gameState.player?.enchantments?.armor;
            set('charStatWpnEnchant', wpnEnchantId ? getItemName(wpnEnchantId) : 'Nenhum');
            set('charStatArmEnchant', armEnchantId ? getItemName(armEnchantId) : 'Nenhum');

            const hpParts = [];
            const upgradeHP = gameState.upgrades.healthBonus || 0;
            if (upgradeHP > 0) hpParts.push(`+${upgradeHP} academia`);
            if (equipHP > 0) hpParts.push(`+${equipHP} equip`);
            if (achHP > 0) hpParts.push(`+${achHP} conquista`);
            if (colossoPct > 0) hpParts.push(`+${colossoPct}% colosso`);
            if (gameState.pets && gameState.pets.active === 'war_elephant') {
                const petState = getPetState('war_elephant');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const bonusVal = Math.round(20 * levelMultiplier);
                hpParts.push(`+${bonusVal}% mascote`);
            }
            set('charBonusHP', hpParts.length > 0 ? `(${hpParts.join(', ')})` : '');

            const strParts = [];
            const upgradeSTR = gameState.upgrades.strengthBonus || 0;
            if (upgradeSTR > 0) strParts.push(`+${upgradeSTR} academia`);
            if (equipSTR > 0) strParts.push(`+${equipSTR} equip`);
            if (achSTR > 0) strParts.push(`+${achSTR} conquista`);
            set('charBonusSTR', strParts.length > 0 ? `(${strParts.join(', ')})` : '');

            set('charBonusDEF', totalDEF > 0 ? `(+${totalDEF} equip)` : '');

            const spdParts = [];
            if (equipSPD > 0) spdParts.push(`+${equipSPD}% equip`);
            if (runeSPD > 0) spdParts.push(`+${runeSPD}% runa`);
            if (classSPD > 0) spdParts.push(`+${classSPD}% classe`);
            set('charBonusSPD', spdParts.length > 0 ? `(${spdParts.join(', ')})` : '');

            const critParts = [];
            if (techCrit > 0) critParts.push(`+${techCrit}% tech`);
            if (equipCrit > 0) critParts.push(`+${equipCrit}% equip`);
            if (potionCrit > 0) critParts.push(`+${potionCrit}% poção`);
            if (classCrit > 0) critParts.push(`+${classCrit}% classe`);
            if (achCrit > 0) critParts.push(`+${achCrit}% conquista`);
            if (petCrit > 0) critParts.push(`+${Math.round(petCrit)}% mascote`);
            set('charBonusCRIT', critParts.length > 0 ? `(${critParts.join(', ')})` : '');

            const xpParts = [];
            if (techXP > 0) xpParts.push(`+${techXP}% tech`);
            if (equipXP > 0) xpParts.push(`+${equipXP}% equip`);
            if (runeXP > 0) xpParts.push(`+${runeXP}% runa`);
            if (classXP > 0) xpParts.push(`+${classXP}% classe`);
            if (achXP > 0) xpParts.push(`+${achXP}% conquista`);
            if (meistreXPChar > 0) xpParts.push(`+${meistreXPChar}% elixir`);
            if (petXP > 0) xpParts.push(`+${Math.round(petXP)}% mascote`);
            set('charBonusXP', xpParts.length > 0 ? `(${xpParts.join(', ')})` : '');

            // Atualizar slots visuais
            for (let slot in gameState.equipment.equipped) {
                const slotEl = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
                if (!slotEl) continue;
                const id = gameState.equipment.equipped[slot];
                const eq = getEquipmentItemData(id);
                if (id && eq) {
                    slotEl.classList.add('filled');
                    const hasRunes = id.startsWith('inst_') && gameState.equipment.instances?.[id]?.runas?.some(r => r !== null);
                    const runeIndicator = hasRunes ? '<span style="position:absolute;top:2px;right:2px;font-size:0.7em;text-shadow:0 0 4px #dca8ff;">🟣</span>' : '';
                    slotEl.innerHTML = `${runeIndicator}<span class="slot-icon">${eq.icon}</span><span class="slot-label" style="color:${rarityColors[eq.rarity]};font-size:0.7em;">${eq.name.split(' ')[0]}</span>`;
                } else {
                    slotEl.classList.remove('filled');
                    const icons = { helmet:'🪖', amulet:'📿', weapon:'⚔️', armor:'🛡️', shield:'🔰', ring:'💍', pants:'👖', boots:'👢' };
                    slotEl.innerHTML = `<span class="slot-icon">${icons[slot]}</span><span class="slot-label">${slotNames[slot]}</span>`;
                }
            }

            // Lista de equipados
            const list = document.getElementById('equippedItemsList');
            if (!list) return;
            list.innerHTML = '';
            let hasAny = false;
            for (let slot in gameState.equipment.equipped) {
                const id = gameState.equipment.equipped[slot];
                if (!id) continue;
                hasAny = true;
                const eq = getEquipmentItemData(id);
                if (!eq) continue;
                hasAny = true;
                const row = document.createElement('div');
                const rarityClass = getEquipmentRarityClass(id);
                row.className = `equipped-item-row ${rarityClass}`;
                const runesHtml = getEquipmentRunesHtml(id);
                row.innerHTML = `<div class="equipped-item-info">
                    <span class="equipped-item-icon">${eq.icon}</span>
                    <div>
                        <div class="equipped-item-name" style="color:${rarityColors[eq.rarity]}">${eq.name}</div>
                        <div class="equipped-item-stats">${formatStats(eq)}</div>
                        ${runesHtml}
                    </div>
                </div>
                <button class="unequip-btn" onclick="unequipItem('${slot}')">Remover</button>`;
                list.appendChild(row);
            }
            if (!hasAny) list.innerHTML = '<div style="color:#aaa;text-align:center;padding:15px;">Nenhum equipamento ativo</div>';
        }


        function updateSmithingPage() {
            const container = document.getElementById('smithingRecipes');
            if (!container) return;

            if (!gameState.currentSmithingTab) gameState.currentSmithingTab = 'forge';
            const tab = gameState.currentSmithingTab;

            container.innerHTML = '';
            const skillData = gameState.skills.smithing;

            // Injetar abas no topo da página
            const tabsDiv = document.createElement('div');
            tabsDiv.className = 'arena-tabs';
            tabsDiv.style.cssText = 'grid-column: 1 / -1; margin-bottom: 20px; width: 100%; display: flex; gap: 10px;';
            tabsDiv.innerHTML = `
                <button class="arena-tab-btn ${tab === 'forge' ? 'active' : ''}" onclick="switchSmithingTab('forge')" style="flex: 1; padding: 10px; font-weight: bold; border-radius: 8px;">⚒️ Forja</button>
                <button class="arena-tab-btn ${tab === 'upgrade' ? 'active' : ''}" onclick="switchSmithingTab('upgrade')" style="flex: 1; padding: 10px; font-weight: bold; border-radius: 8px;">⚡ Aprimoramento</button>
            `;
            container.appendChild(tabsDiv);

            if (tab === 'forge') {
                // Receitas normais de barras
                smithingRecipes.forEach(recipe => {
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

                    const isCrafting = gameState.craftingTimers[`smithing_${recipe.id}`] ? true : false;
                    if (isCrafting) card.classList.add('crafting');

                    const hasIngredients = gameState.inventory[recipe.input.type] >= recipe.input.qty;
                    const totalItems = Object.values(gameState.inventory).filter(q => q > 0).length;
                    const hasSpace = totalItems < gameState.bankSlots ||
                        (gameState.inventory[recipe.output.type] > 0 && totalItems <= gameState.bankSlots);

                    const canCraft = isUnlocked && hasIngredients && hasSpace && !isCrafting;

                    let progressWidth = '0%';
                    if (isCrafting) {
                        const timer = gameState.craftingTimers[`smithing_${recipe.id}`];
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
                                        <span>💰 ${recipe.price} ouro</span>
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
                                        <span>💰 ${recipe.price} ouro</span>
                                    </div>
                                    ${workerHtml}
                                    <div class="craft-progress">
                                        <div class="craft-progress-bar" id="progress_smithing_${recipe.id}" style="width: ${progressWidth}"></div>
                                    </div>
                                    <div class="craft-buttons-row" style="display: flex; gap: 8px; width: 100%; margin-top: 10px;">
                                        <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                                onclick="startCrafting('smithing', '${recipe.id}', 1)"
                                                ${!canCraft ? 'disabled' : ''}>
                                            ${isCrafting ? '⏳ Fundindo...' : '⚒️ Fundir (1)'}
                                        </button>
                                        <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                                onclick="startCrafting('smithing', '${recipe.id}', 'all')"
                                                ${!canCraft || maxQty <= 1 ? 'disabled' : ''}>
                                            ${isCrafting ? '⏳ Fundindo...' : `⚒️ Todos (${maxQty})`}
                                        </button>
                                    </div>
                                `;
                    }

                    container.appendChild(card);
                });

                // Seção de equipamentos forjáveis
                const equipSection = document.createElement('div');
                equipSection.style.cssText = 'grid-column:1/-1;margin-top:20px;';
                equipSection.innerHTML = `<div style="color:#ffd700;font-size:1.2em;font-weight:bold;margin-bottom:15px;border-bottom:1px solid #ffd700;padding-bottom:8px;">⚔️ Forjar Equipamentos</div>`;
                const equipGrid = document.createElement('div');
                equipGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:15px;';

                smithingEquipRecipes.forEach(eq => {
                    const isUnlocked = skillData.level >= eq.craftReq;
                    const hasAll = eq.ingredients.every(ing => (gameState.inventory[ing.type] || 0) >= ing.qty);
                    const inInv = gameState.equipment.inventory[eq.id] || 0;
                    const card = document.createElement('div');
                    card.className = `recipe-card ${isUnlocked ? 'unlocked' : ''}`;
                    card.style.cssText = 'border-color:#4a5a6a;';
                    const ingHtml = eq.ingredients.map(ing => {
                        const has = (gameState.inventory[ing.type] || 0) >= ing.qty;
                        return `<div style="color:${has ? '#4aff4a' : '#ff4444'}">${ing.qty}x ${getItemName(ing.type)}</div>`;
                    }).join('');
                    card.innerHTML = `
                        ${!isUnlocked ? '<div class="resource-lock">🔒</div>' : ''}
                        <div class="recipe-name" style="color:#fff;">${eq.icon} ${eq.name} <span class="recipe-level-req">Nv.${eq.craftReq}</span></div>
                        <div style="color:#888;font-size:0.8em;margin-bottom:8px;">[Básico] • ${slotNames[eq.slot]}</div>
                        <div class="recipe-desc">${eq.desc}</div>
                        <div style="color:#4aff4a;font-size:0.85em;margin:8px 0;">${formatStats(eq.stats)}</div>
                        <div class="recipe-ingredients">${ingHtml}</div>
                        <div style="color:#aaa;font-size:0.85em;margin-bottom:8px;">No inventário: <span style="color:#ffd700">${inInv}</span></div>
                        <button class="craft-btn" onclick="craftEquipment('${eq.id}')" ${!isUnlocked || !hasAll ? 'disabled' : ''}>
                            ${!isUnlocked ? '🔒 Bloqueado' : '⚒️ Forjar'}
                        </button>`;
                    equipGrid.appendChild(card);
                });

                equipSection.appendChild(equipGrid);
                container.appendChild(equipSection);
            } else if (tab === 'upgrade') {
                renderSmithingUpgrade(container);
            }
        }

        // Mudar aba da Ferraria
        function switchSmithingTab(tab) {
            gameState.currentSmithingTab = tab;
            updateSmithingPage();
        }

        // Mudar ativação da poção anti-quebra
        function toggleAntiBreakActive() {
            gameState.useAntiBreakActive = document.getElementById('antiBreakCheckbox')?.checked ? true : false;
            updateSmithingPage();
        }

        // Selecionar item para aprimorar
        function selectUpgradeItem(instId) {
            gameState.selectedUpgradeItem = instId;
            updateSmithingPage();
        }

        // Buscar custos de aprimoramento do item
        function getUpgradeCosts(eq) {
            const currentLevel = eq.upgrade || 0;
            const costMult = currentLevel + 1; // 1 a 10
            let materialType = 'bar1';
            let materialLabel = 'Barra de Cobre';
            
            if (eq.id.includes('iron') || eq.id.includes('craftedItem2') || eq.id.includes('pants_iron')) { 
                materialType = 'bar2'; 
                materialLabel = 'Barra de Ferro'; 
            }
            else if (eq.id.includes('silver') || eq.id.includes('craftedItem3') || eq.id.includes('ring_ebony') || eq.id.includes('amulet_rune')) { 
                materialType = 'bar3'; 
                materialLabel = 'Barra de Prata'; 
            }
            else if (eq.id.includes('gold') || eq.id.includes('craftedItem4')) { 
                materialType = 'bar4'; 
                materialLabel = 'Barra de Ouro'; 
            }
            else if (eq.id.includes('mithril') || eq.id.includes('magic') || eq.id.includes('dragon') || eq.id.includes('craftedItem5') || eq.id.includes('amulet_dragon')) { 
                materialType = 'bar5'; 
                materialLabel = 'Barra de Mitril'; 
            }
            else if (eq.id.includes('wood')) { 
                materialType = 'wood1'; 
                materialLabel = 'Madeira Comum'; 
            }
            else if (eq.id.includes('oak')) { 
                materialType = 'wood2'; 
                materialLabel = 'Madeira de Carvalho'; 
            }
            
            const materialQty = costMult * 2;
            const rarityMult = { common: 1, uncommon: 1.5, rare: 2, epic: 3, legendary: 5, ancient: 8 };
            const goldCost = costMult * 150 * (rarityMult[eq.rarity] || 1);
            
            return { materialType, materialLabel, materialQty, gold: Math.floor(goldCost) };
        }

        // Renderizar a interface de Aprimoramento
        function renderSmithingUpgrade(container) {
            // Injetar estilos de animação temporários se não existirem
            if (!document.getElementById('upgradeStyles')) {
                const style = document.createElement('style');
                style.id = 'upgradeStyles';
                style.innerHTML = `
                    @keyframes upgradeSuccessGlow {
                        0% { box-shadow: 0 0 5px #fff; border-color: #fff; }
                        50% { box-shadow: 0 0 35px #fff, 0 0 15px var(--primary-color); border-color: #fff; }
                        100% { box-shadow: none; border-color: rgba(255,255,255,0.08); }
                    }
                    @keyframes upgradeFailGlow {
                        0% { box-shadow: 0 0 5px #ff4444; border-color: #ff4444; }
                        50% { box-shadow: 0 0 35px #ff4444, 0 0 15px #ff0000; border-color: #ff4444; }
                        100% { box-shadow: none; border-color: rgba(255,255,255,0.08); }
                    }
                    .upgrade-success-flash {
                        animation: upgradeSuccessGlow 1.2s ease-out;
                    }
                    .upgrade-fail-flash {
                        animation: upgradeFailGlow 1.2s ease-out;
                    }
                `;
                document.head.appendChild(style);
            }

            const upgradeDiv = document.createElement('div');
            upgradeDiv.style.cssText = 'grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; text-align: left; width: 100%;';
            
            const available = [];
            
            // 1. Equipados
            for (let slot in gameState.equipment.equipped) {
                const instId = gameState.equipment.equipped[slot];
                if (instId && instId.startsWith('inst_')) {
                    available.push({ id: instId, location: `Equipado (${slotNames[slot]})`, isEquipped: true, slot });
                }
            }
            
            // 2. Inventário
            for (let [instId, qty] of Object.entries(gameState.equipment.inventory)) {
                if (qty > 0 && instId.startsWith('inst_')) {
                    available.push({ id: instId, location: 'Inventário', isEquipped: false });
                }
            }
            
            const selectedId = gameState.selectedUpgradeItem;
            const selectedExists = available.some(x => x.id === selectedId);
            if (!selectedExists) {
                gameState.selectedUpgradeItem = null;
            }
            
            let listHtml = '';
            if (available.length === 0) {
                listHtml = `<div style="color:#aaa; text-align:center; padding: 20px;">Nenhum equipamento disponível para aprimoramento.</div>`;
            } else {
                listHtml = available.map(item => {
                    const eq = getEquipmentItemData(item.id);
                    if (!eq) return '';
                    const isSelected = item.id === gameState.selectedUpgradeItem;
                    const upgradeLevel = eq.upgrade || 0;
                    const upgradeBadge = upgradeLevel > 0 ? ` <span style="color:#ff9944; font-weight:bold;">+${upgradeLevel}</span>` : '';
                    const borderStyle = isSelected ? `border: 2.5px solid var(--primary-color); box-shadow: 0 0 10px rgba(255,153,68,0.3);` : `border: 1.5px solid rgba(255,255,255,0.08);`;
                    
                    return `
                        <div onclick="selectUpgradeItem('${item.id}')" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.02); cursor:pointer; ${borderStyle} transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)';" onmouseout="this.style.background='rgba(255,255,255,0.02)';">
                            <div style="display:flex; align-items:center; gap: 10px;">
                                <span style="font-size: 1.6em;">${eq.icon}</span>
                                <div>
                                    <div style="font-weight:bold; font-size:0.9em; color:${rarityColors[eq.rarity]}">${eq.name}${upgradeBadge}</div>
                                    <div style="font-size:0.75em; color:#888;">${slotNames[eq.slot]} · ${item.location}</div>
                                </div>
                            </div>
                            <span style="font-size: 0.85em; color: #ff9944;">${upgradeLevel >= 10 ? 'MÁX 🌟' : 'Selecionar'}</span>
                        </div>
                    `;
                }).join('');
            }
            
            let detailHtml = '';
            if (!gameState.selectedUpgradeItem) {
                detailHtml = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; border: 1.5px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 30px; text-align:center; color:#aaa;">
                        <span style="font-size: 3em; margin-bottom: 10px;">⚒️</span>
                        <h3>Selecione um Equipamento</h3>
                        <p style="font-size:0.85em;">Selecione um item da lista à esquerda para começar a aprimorá-lo.</p>
                    </div>
                `;
            } else {
                const eq = getEquipmentItemData(gameState.selectedUpgradeItem);
                const currentLevel = eq.upgrade || 0;
                const nextLevel = currentLevel + 1;
                
                if (currentLevel >= 10) {
                    detailHtml = `
                        <div style="border: 1.5px solid #ffd700; background: rgba(255,215,0,0.02); border-radius: 12px; padding: 20px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                            <span style="font-size: 3.5em; text-shadow: 0 0 10px #ffd700;">🌟</span>
                            <h2 style="color:#ffd700; margin-top:10px; font-family:'Cinzel';">Aprimoramento Máximo!</h2>
                            <p style="color:#fff; font-weight:bold; margin-top:5px;">${eq.icon} ${eq.name}</p>
                            <p style="font-size:0.85em; color:#aaa; margin-top:10px;">Este equipamento já atingiu o nível máximo de aprimoramento (+10) e não pode ser aprimorado além disso.</p>
                        </div>
                    `;
                } else {
                    const costs = getUpgradeCosts(eq);
                    const hasGold = gameState.gold >= costs.gold;
                    const hasMaterial = (gameState.inventory[costs.materialType] || 0) >= costs.materialQty;
                    
                    const successRates = {
                        0: { rate: 90, breakChance: 0 },
                        1: { rate: 85, breakChance: 0 },
                        2: { rate: 80, breakChance: 0 },
                        3: { rate: 75, breakChance: 0 },
                        4: { rate: 70, breakChance: 5 },
                        5: { rate: 60, breakChance: 8 },
                        6: { rate: 45, breakChance: 15 },
                        7: { rate: 30, breakChance: 25 },
                        8: { rate: 18, breakChance: 35 },
                        9: { rate: 10, breakChance: 50 }
                    };
                    const rateInfo = successRates[currentLevel] || { rate: 100, breakChance: 0 };
                    
                    const antiBreakCount = gameState.inventory.potion_blacksmith || 0;
                    const useAntiBreak = gameState.useAntiBreakActive && antiBreakCount > 0;
                    
                    const finalRate = useAntiBreak ? 100 : rateInfo.rate;
                    const finalBreak = useAntiBreak ? 0 : rateInfo.breakChance;
                    
                    const currentMult = 1 + (currentLevel * 0.08);
                    const nextMult = 1 + (nextLevel * 0.08);
                    
                    const baseItem = equipmentData[eq.id];
                    const inst = gameState.equipment.instances[gameState.selectedUpgradeItem];
                    const qualityMults = { common: 1.0, uncommon: 1.15, rare: 1.30, epic: 1.50, legendary: 1.75, ancient: 2.00 };
                    const qMult = qualityMults[eq.rarity] || 1.0;
                    
                    let statComparisonHtml = '';
                    if (baseItem && baseItem.stats) {
                        statComparisonHtml = Object.keys(baseItem.stats).map(stat => {
                            const statRoll = inst.statRolls?.[stat] || 1.0;
                            const curVal = Math.round(baseItem.stats[stat] * qMult * statRoll * currentMult);
                            const nextVal = Math.round(baseItem.stats[stat] * qMult * statRoll * nextMult);
                            const statLabel = { strength: 'Força', defense: 'Defesa', maxHealth: 'Vida', speedBonus: 'Velocidade %', critChance: 'Crítico %', xpBonus: 'XP %' }[stat] || stat;
                            return `
                                <div style="display:flex; justify-content:space-between; font-size:0.85em; margin-bottom:6px;">
                                    <span style="color:#aaa;">${statLabel}:</span>
                                    <span style="font-weight:bold;">${curVal} ➔ <span style="color:#4aff4a;">${nextVal}</span></span>
                                </div>
                            `;
                        }).join('');
                    }
                    
                    const canUpgrade = hasGold && hasMaterial;
                    
                    const antiBreakCheckbox = antiBreakCount > 0 ? `
                        <div style="margin-top:15px; padding:10px; background:rgba(255,215,0,0.05); border: 1.5px solid rgba(255,215,0,0.2); border-radius:8px; display:flex; align-items:center; justify-content:space-between;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:1.5em;">🧪</span>
                                <div>
                                    <div style="font-size:0.82em; font-weight:bold; color:#ffd700;">Usar Elixir do Ferreiro (x${antiBreakCount})</div>
                                    <div style="font-size:0.7em; color:#aaa;">Protege o item e garante 100% de Sucesso!</div>
                                </div>
                            </div>
                            <input type="checkbox" id="antiBreakCheckbox" ${useAntiBreak ? 'checked' : ''} onchange="toggleAntiBreakActive()" style="width:18px; height:18px; cursor:pointer;">
                        </div>
                    ` : `
                        <div style="margin-top:15px; padding:10px; background:rgba(255,255,255,0.01); border: 1.5px dashed rgba(255,255,255,0.05); border-radius:8px; text-align:center; font-size:0.75em; color:#777;">
                            🧪 Você não possui Elixir do Ferreiro no inventário.<br>Crie-o em Alquimia (Encantamento) Nv.40!
                        </div>
                    `;

                    detailHtml = `
                        <div id="upgradePanelCard" style="border:1.5px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.25); border-radius:12px; padding:20px; transition: all 0.3s; position:relative; overflow:hidden;">
                            <div style="text-align:center; margin-bottom:15px;">
                                <span style="font-size: 3em; display:inline-block; margin-bottom:5px;">⚒️</span>
                                <h3 style="font-family:'Outfit', sans-serif; margin:0; color:#ffd700;">Aprimoramento +${nextLevel}</h3>
                                <div style="font-size:0.85em; color:#fff; font-weight:bold; margin-top:5px;">${eq.icon} ${eq.name}</div>
                            </div>
                            
                            <div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:12px; margin-bottom:15px;">
                                <div style="font-size:0.85em; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:4px; margin-bottom:8px; color:#ffd700;">📈 Alteração de Atributos</div>
                                ${statComparisonHtml}
                            </div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                                <div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:8px 12px; text-align:center;">
                                    <div style="font-size:0.7em; color:#aaa;">Taxa de Sucesso</div>
                                    <div style="font-size:1.15em; font-weight:bold; color:${finalRate === 100 ? '#4aff4a' : '#ffd700'}">${finalRate}%</div>
                                </div>
                                <div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:8px 12px; text-align:center;">
                                    <div style="font-size:0.7em; color:#aaa;">Chance de Quebrar</div>
                                    <div style="font-size:1.15em; font-weight:bold; color:${finalBreak > 0 ? '#ff4444' : '#888'}">${finalBreak}%</div>
                                </div>
                            </div>
                            
                            <div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:12px; margin-bottom:15px;">
                                <div style="font-size:0.85em; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:4px; margin-bottom:8px; color:#ffd700;">🪙 Custo Requerido</div>
                                <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-bottom:4px;">
                                    <span style="color:#aaa;">Ouro:</span>
                                    <span style="font-weight:bold; color:${hasGold ? '#fff' : '#ff4444'}">${costs.gold} / ${gameState.gold}💰</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.82em;">
                                    <span style="color:#aaa;">${costs.materialLabel}:</span>
                                    <span style="font-weight:bold; color:${hasMaterial ? '#fff' : '#ff4444'}">${costs.materialQty} / ${gameState.inventory[costs.materialType] || 0}x</span>
                                </div>
                            </div>
                            
                            ${antiBreakCheckbox}
                            
                            <button onclick="upgradeEquipment()" style="width:100%; margin-top:15px; padding:12px; font-weight:bold; font-size:1em; border-radius:8px; border:none; background:${canUpgrade ? 'var(--primary-color)' : '#555'}; color:${canUpgrade ? '#000' : '#888'}; cursor:${canUpgrade ? 'pointer' : 'not-allowed'}; box-shadow: ${canUpgrade ? '0 0 15px rgba(255,153,68,0.25)' : 'none'}; transition: all 0.2s;" ${!canUpgrade ? 'disabled' : ''}>
                                🔨 Aprimorar
                            </button>
                        </div>
                    `;
                }
            }
            
            upgradeDiv.innerHTML = `
                <div>
                    <div style="font-family:'Cinzel'; color:#ffd700; font-size:1.1em; border-bottom:1px solid rgba(255,215,0,0.15); padding-bottom:5px; margin-bottom:12px;">📋 Seus Equipamentos</div>
                    <div style="max-height: 480px; overflow-y: auto; padding-right:5px;">
                        ${listHtml}
                    </div>
                </div>
                <div>
                    <div style="font-family:'Cinzel'; color:#ffd700; font-size:1.1em; border-bottom:1px solid rgba(255,215,0,0.15); padding-bottom:5px; margin-bottom:12px;">🔨 Painel de Upgrade</div>
                    ${detailHtml}
                </div>
            `;
            
            container.appendChild(upgradeDiv);
        }

        // Executar Aprimoramento de Equipamento
        function upgradeEquipment() {
            const instId = gameState.selectedUpgradeItem;
            if (!instId) return;
            const inst = gameState.equipment.instances?.[instId];
            if (!inst) return;
            
            const eq = getEquipmentItemData(instId);
            if (!eq) return;
            
            const currentLevel = inst.upgrade || 0;
            if (currentLevel >= 10) return;
            
            const costs = getUpgradeCosts(eq);
            
            // Validar recursos
            if (gameState.gold < costs.gold) {
                showNotification('❌ Ouro Insuficiente!', 'Você precisa de mais ouro para aprimorar.', 'error');
                return;
            }
            if ((gameState.inventory[costs.materialType] || 0) < costs.materialQty) {
                showNotification('❌ Materiais Insuficientes!', `Você precisa de ${costs.materialQty}x ${costs.materialLabel}.`, 'error');
                return;
            }
            
            // Cobrar custo
            gameState.gold -= costs.gold;
            gameState.inventory[costs.materialType] -= costs.materialQty;
            
            const successRates = {
                0: { rate: 90, breakChance: 0 },
                1: { rate: 85, breakChance: 0 },
                2: { rate: 80, breakChance: 0 },
                3: { rate: 75, breakChance: 0 },
                4: { rate: 70, breakChance: 5 },
                5: { rate: 60, breakChance: 8 },
                6: { rate: 45, breakChance: 15 },
                7: { rate: 30, breakChance: 25 },
                8: { rate: 18, breakChance: 35 },
                9: { rate: 10, breakChance: 50 }
            };
            const rateInfo = successRates[currentLevel] || { rate: 100, breakChance: 0 };
            
            const useAntiBreak = gameState.useAntiBreakActive && (gameState.inventory.potion_blacksmith || 0) > 0;
            if (useAntiBreak) {
                gameState.inventory.potion_blacksmith--;
                if (gameState.inventory.potion_blacksmith <= 0) delete gameState.inventory.potion_blacksmith;
            }
            
            const roll = Math.random() * 100;
            const success = useAntiBreak ? true : (roll < rateInfo.rate);
            
            if (success) {
                inst.upgrade = currentLevel + 1;
                showNotification('⚡ Aprimorado!', `${eq.icon} ${eq.name} foi aprimorado para +${inst.upgrade}!`, 'success', eq.icon);
                
                // Forçar flash de sucesso
                setTimeout(() => {
                    const cardEl = document.getElementById('upgradePanelCard');
                    if (cardEl) {
                        cardEl.classList.remove('upgrade-success-flash', 'upgrade-fail-flash');
                        void cardEl.offsetWidth; // Trigger reflow
                        cardEl.classList.add('upgrade-success-flash');
                    }
                }, 50);
            } else {
                // Falha
                const breakRoll = Math.random() * 100;
                const itemBrokes = breakRoll < rateInfo.breakChance;
                
                if (itemBrokes) {
                    // Destruir item
                    delete gameState.equipment.instances[instId];
                    if (gameState.equipment.inventory[instId]) {
                        delete gameState.equipment.inventory[instId];
                    }
                    
                    // Se equipado, desequipa
                    for (let slot in gameState.equipment.equipped) {
                        if (gameState.equipment.equipped[slot] === instId) {
                            gameState.equipment.equipped[slot] = null;
                            break;
                        }
                    }
                    
                    gameState.selectedUpgradeItem = null;
                    showNotification('💀 DESTRUÍDO!', `Tragédia! Sua ${eq.name} quebrou e virou pó!`, 'error', '💀');
                } else {
                    // Reduzir nível
                    const oldLvl = inst.upgrade || 0;
                    inst.upgrade = Math.max(0, oldLvl - 1);
                    showNotification('❌ Falha!', `O aprimoramento falhou! O item desceu para +${inst.upgrade}.`, 'error');
                    
                    setTimeout(() => {
                        const cardEl = document.getElementById('upgradePanelCard');
                        if (cardEl) {
                            cardEl.classList.remove('upgrade-success-flash', 'upgrade-fail-flash');
                            void cardEl.offsetWidth; // Trigger reflow
                            cardEl.classList.add('upgrade-fail-flash');
                        }
                    }, 50);
                }
            }
            
            // XP de ferraria por tentativa
            addXP('smithing', (currentLevel + 1) * 15 + 10);
            
            updateSmithingPage();
            updateCharacterPage();
            updateUI();
        }


        function updateRuneforgePage() {
            if (!gameState.runes) gameState.runes = {};
            const grid = document.getElementById('runesCraftGrid');
            if (!grid) return;
            grid.innerHTML = '';
            
            for (let [runeId, rune] of Object.entries(runasData)) {
                const levelReq = runeId.endsWith('fenix') ? 40 : (rune.rarity === 'rare' ? 25 : (rune.rarity === 'uncommon' ? 15 : 5));
                const woodLvl = gameState.skills.woodcutting.level;
                const smithLvl = gameState.skills.smithing.level;
                const isUnlocked = woodLvl >= levelReq && smithLvl >= levelReq;
                
                const card = document.createElement('div');
                card.className = `rune-recipe-card ${rune.rarity}`;
                
                const ingsHtml = rune.ingredients.map(ing => {
                    const available = gameState.inventory[ing.type] || 0;
                    const hasEnough = available >= ing.qty;
                    return `
                        <div class="ingredient-row">
                            <span class="ingredient-name" style="font-family:'Outfit', sans-serif;">${getItemName(ing.type)}</span>
                            <span class="ingredient-qty" style="${hasEnough ? 'color:#88ff88;' : 'color:#ff8888;'} font-family:'Outfit', sans-serif;">${available}/${ing.qty}</span>
                        </div>
                    `;
                }).join('');
                
                let actionHtml = '';
                if (!isUnlocked) {
                    actionHtml = `<div style="color:#ff6666;font-size:0.85em;text-align:center;margin-top:10px;font-family:'Outfit', sans-serif;font-weight:bold;">🔒 Requer Nível ${levelReq} em Lenhador e Ferraria</div>`;
                } else {
                    actionHtml = `
                        <button class="runar-action-btn" onclick="craftRune('${runeId}')" style="margin-top:12px;width:100%;">🌀 Forjar Runa</button>
                    `;
                }
                
                card.innerHTML = `
                    <span class="rune-rarity-badge ${rune.rarity}">${rarityNames[rune.rarity] || rune.rarity}</span>
                    <div style="font-size:1.8em;text-align:center;margin-bottom:5px;">${rune.icon}</div>
                    <div style="font-weight:bold;text-align:center;font-size:1.05em;font-family:'Outfit', sans-serif;margin-bottom:8px;">${rune.name}</div>
                    <div style="font-size:0.85em;color:#bbb;text-align:center;margin-bottom:12px;min-height:32px;font-family:'Outfit', sans-serif;">${rune.desc}</div>
                    <div class="recipe-ingredients" style="margin-top:auto;">
                        ${ingsHtml}
                    </div>
                    ${actionHtml}
                `;
                
                grid.appendChild(card);
            }
        }

        function craftRune(runeId) {
            if (!gameState.runes) gameState.runes = {};
            const rune = runasData[runeId];
            if (!rune) return;
            
            for (let ing of rune.ingredients) {
                if ((gameState.inventory[ing.type] || 0) < ing.qty) {
                    showNotification('❌ Materiais!', `Faltam materiais para forjar ${rune.name}.`, 'error');
                    return;
                }
            }
            
            for (let ing of rune.ingredients) {
                gameState.inventory[ing.type] -= ing.qty;
            }
            
            gameState.runes[runeId] = (gameState.runes[runeId] || 0) + 1;
            
            const levelReq = runeId.endsWith('fenix') ? 40 : (rune.rarity === 'rare' ? 25 : (rune.rarity === 'uncommon' ? 15 : 5));
            const xpGain = levelReq * 10 + 30;
            
            addXP('woodcutting', Math.floor(xpGain / 2));
            addXP('smithing', Math.floor(xpGain / 2));
            
            showNotification('🌀 Runa Forjada!', `${rune.icon} ${rune.name} adicionada ao seu inventário de runas!`, 'success', rune.icon);
            
            updateRuneforgePage();
            updateUI();
        }

        function showRunarTab(tab) {
            gameState.currentRunarTab = tab;
            document.querySelectorAll('#runarPage .shop-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#runarPage .shop-section').forEach(s => s.classList.remove('active'));
            if (tab === 'equip') {
                document.getElementById('runarTabEquip').classList.add('active');
                document.getElementById('runarEquipSection').classList.add('active');
                updateRunarPage();
            } else {
                document.getElementById('runarTabRemove').classList.add('active');
                document.getElementById('runarRemoveSection').classList.add('active');
                updateRunarPage();
            }
        }

        function updateRunarPage() {
            if (!gameState.equipment.instances) gameState.equipment.instances = {};
            if (!gameState.runes) gameState.runes = {};
            const tab = gameState.currentRunarTab;
            const equipGrid = document.getElementById('runarEquipGrid');
            const removeGrid = document.getElementById('runarRemoveGrid');
            
            if (tab === 'equip') {
                if (!equipGrid) return;
                equipGrid.innerHTML = '';
                
                let hasAny = false;
                for (let [instId, qty] of Object.entries(gameState.equipment.inventory)) {
                    if (qty <= 0) continue;
                    if (!instId.startsWith('inst_')) continue;
                    
                    const inst = gameState.equipment.instances?.[instId];
                    if (!inst) continue;
                    
                    if (inst.runas.some(r => r === null)) {
                        hasAny = true;
                        const eq = getEquipmentItemData(instId);
                        if (!eq) continue;
                        
                        const card = document.createElement('div');
                        const rarityClass = getEquipmentRarityClass(instId);
                        card.className = `runar-option-card ${rarityClass}`;
                        
                        const slotsHtml = inst.runas.map((runeId, i) => {
                            if (runeId) {
                                const rune = runasData[runeId];
                                return `<div class="rune-slot-indicator filled">🟣 Slot ${i+1}: ${rune.name}</div>`;
                            } else {
                                return `
                                    <div class="rune-slot-indicator empty" style="display:flex;justify-content:space-between;align-items:center;">
                                        <span>🟢 Slot ${i+1}: Vazio</span>
                                        <button class="feed-food-item-btn" onclick="openRuneSelectModal('${instId}', ${i})" style="padding: 2px 6px; font-size:0.75em;">Encaixar</button>
                                    </div>
                                `;
                            }
                        }).join('');
                        
                        card.innerHTML = `
                            <div class="runar-option-header">
                                <span class="runar-option-icon">${eq.icon}</span>
                                <div>
                                    <div class="runar-option-name" style="color:${rarityColors[eq.rarity]}">${eq.name}</div>
                                    <div style="font-size:0.75em;color:#aaa;">${formatStats(eq)}</div>
                                </div>
                            </div>
                            <div class="runar-option-slots">
                                ${slotsHtml}
                            </div>
                        `;
                        
                        equipGrid.appendChild(card);
                    }
                }
                
                if (!hasAny) {
                    equipGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#aaa;padding:20px;font-family:'Outfit', sans-serif;">Nenhum equipamento com slots vazios no seu inventário.<br><span style="font-size:0.85em;">Equipamentos dropados/craftados têm 50% de chance de vir com slots.</span></div>`;
                }
            } else {
                if (!removeGrid) return;
                removeGrid.innerHTML = '';
                
                let hasAny = false;
                const candidateIds = [];
                
                for (let [instId, qty] of Object.entries(gameState.equipment.inventory)) {
                    if (qty <= 0) continue;
                    if (instId.startsWith('inst_')) candidateIds.push({ id: instId, location: 'inventário' });
                }
                
                for (let [slot, instId] of Object.entries(gameState.equipment.equipped)) {
                    if (instId && instId.startsWith('inst_')) candidateIds.push({ id: instId, location: 'equipado (' + slotNames[slot] + ')' });
                }
                
                candidateIds.forEach(cand => {
                    const inst = gameState.equipment.instances?.[cand.id];
                    if (!inst) return;
                    
                    if (inst.runas.some(r => r !== null)) {
                        hasAny = true;
                        const eq = getEquipmentItemData(cand.id);
                        if (!eq) return;
                        
                        const card = document.createElement('div');
                        const rarityClass = getEquipmentRarityClass(cand.id);
                        card.className = `runar-option-card ${rarityClass}`;
                        
                        const slotsHtml = inst.runas.map((runeId, i) => {
                            if (runeId) {
                                const rune = runasData[runeId];
                                return `
                                    <div class="rune-slot-indicator filled" style="display:flex;justify-content:space-between;align-items:center;">
                                        <span>🟣 Slot ${i+1}: ${rune.name}</span>
                                        <button class="feed-food-item-btn runar-remove-btn" onclick="removeRuneFromItem('${cand.id}', ${i})" style="padding: 2px 6px; font-size:0.75em;">Retirar</button>
                                    </div>
                                `;
                            } else {
                                return `<div class="rune-slot-indicator empty">🟢 Slot ${i+1}: Vazio</div>`;
                            }
                        }).join('');
                        
                        card.innerHTML = `
                            <div class="runar-option-header">
                                <span class="runar-option-icon">${eq.icon}</span>
                                <div>
                                    <div class="runar-option-name" style="color:${rarityColors[eq.rarity]}">${eq.name} <span style="color:#ffd700;font-size:0.8em;">[${cand.location}]</span></div>
                                    <div style="font-size:0.75em;color:#aaa;">${formatStats(eq)}</div>
                                </div>
                            </div>
                            <div class="runar-option-slots">
                                ${slotsHtml}
                            </div>
                        `;
                        
                        removeGrid.appendChild(card);
                    }
                });
                
                if (!hasAny) {
                    removeGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#aaa;padding:20px;font-family:'Outfit', sans-serif;">Nenhum equipamento runado encontrado (no inventário ou equipado).</div>`;
                }
            }
        }

        function openRuneSelectModal(instId, slotIndex) {
            if (!gameState.equipment.instances) gameState.equipment.instances = {};
            if (!gameState.runes) gameState.runes = {};
            closeRuneSelectModal();
            
            const runesAvailable = Object.entries(gameState.runes || {})
                .filter(([runeId, qty]) => qty > 0 && runasData[runeId]);
                
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = 'runeModalOverlay';
            overlay.onclick = closeRuneSelectModal;
            
            const modal = document.createElement('div');
            modal.className = 'equip-modal';
            modal.id = 'runeModal';
            
            let html = `<div class="equip-modal-header"><h3>🌀 Selecionar Runa</h3><button class="close-modal" onclick="closeRuneSelectModal()">×</button></div>`;
            
            if (runesAvailable.length === 0) {
                html += `<div style="text-align:center;color:#aaa;padding:20px;font-family:'Outfit', sans-serif;">Você não possui runas em seu inventário.<br><span style="font-size:0.85em;">Forje runas na Forja de Runas!</span></div>`;
            } else {
                html += `<div style="color:#aaa;font-size:0.85em;margin-bottom:10px;font-family:'Outfit', sans-serif;">Escolha uma runa para encaixar:</div>`;
                runesAvailable.forEach(([runeId, qty]) => {
                    const rune = runasData[runeId];
                    html += `
                        <div class="equip-option" style="border-color: rgba(220,168,255,0.2);margin-bottom:8px;">
                            <div class="equip-option-left">
                                <span class="equip-option-icon">${rune.icon}</span>
                                <div>
                                    <div class="equip-option-name" style="color:#dca8ff;font-family:'Outfit', sans-serif;font-weight:bold;">${rune.name} <span style="color:#888;font-size:0.8em;">(x${qty})</span></div>
                                    <div class="equip-option-stats" style="font-size:0.8em;color:#aaa;">${rune.desc}</div>
                                </div>
                            </div>
                            <button class="equip-btn-confirm" onclick="applyRuneToItem('${instId}', ${slotIndex}, '${runeId}')" style="background:#dca8ff;color:#000;">Aplicar</button>
                        </div>
                    `;
                });
            }
            
            modal.innerHTML = html;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        function closeRuneSelectModal() {
            const overlay = document.getElementById('runeModalOverlay');
            const modal = document.getElementById('runeModal');
            if (overlay) overlay.remove();
            if (modal) modal.remove();
        }

        function applyRuneToItem(instId, slotIndex, runeId) {
            if (!gameState.equipment.instances) gameState.equipment.instances = {};
            if (!gameState.runes) gameState.runes = {};
            const inst = gameState.equipment.instances?.[instId];
            if (!inst) return;
            if ((gameState.runes[runeId] || 0) <= 0) { showNotification('❌ Runa!', 'Você não possui esta runa.', 'error'); return; }
            
            gameState.runes[runeId]--;
            inst.runas[slotIndex] = runeId;
            
            showNotification('🟣 Runa Encaixada!', `Runa aplicada com sucesso ao seu equipamento!`, 'success', runasData[runeId].icon);
            
            closeRuneSelectModal();
            updateRunarPage();
            updateCharacterPage();
            updateUI();
        }

        function removeRuneFromItem(instId, slotIndex) {
            if (!gameState.equipment.instances) gameState.equipment.instances = {};
            if (!gameState.runes) gameState.runes = {};
            const inst = gameState.equipment.instances?.[instId];
            if (!inst) return;
            const runeId = inst.runas[slotIndex];
            if (!runeId) return;
            
            inst.runas[slotIndex] = null;
            gameState.runes[runeId] = (gameState.runes[runeId] || 0) + 1;
            
            showNotification('🟢 Runa Removida!', `Runa retirada e devolvida ao seu inventário.`, 'success', runasData[runeId].icon);
            
            updateRunarPage();
            updateCharacterPage();
            updateUI();
        }
        
        // ============================================
        // SISTEMA DE CALOR DA FORJA E LÂMINAS
        // ============================================
        window.addForgeFuel = function() {
            if ((gameState.inventory['wood1'] || 0) > 0) {
                gameState.inventory['wood1']--;
                gameState.property.forge.heat += 5;
                if (gameState.property.forge.heat > 100) gameState.property.forge.heat = 100;
                if (typeof showNotification === 'function') showNotification('🔥 Fornalha!', '1 Madeira Comum consumida (+5 Calor)', 'success');
                if (typeof updateUI === 'function') updateUI();
            } else {
                if (typeof showNotification === 'function') showNotification('❌ Sem Combustível', 'Você precisa de Madeira Comum!', 'error');
                if (typeof addForgeLog === 'function') addForgeLog('❌ Sem Madeira Comum para queimar!', 'error');
            }
        };

        window.openBladeSelector = function() {
            const blades = ['blade1', 'blade2', 'blade3'];
            const available = blades.filter(b => (gameState.inventory[b] || 0) > 0);
            
            if (available.length === 0) {
                if (typeof showNotification === 'function') showNotification('❌ Sem Lâminas', 'Você não tem lâminas no inventário! Forje-as na Ferraria.', 'error');
                return;
            }
            
            // Pega a melhor lâmina disponível automaticamente para simplificar a UI
            const bestBlade = available.pop(); 
            window.equipBlade(bestBlade);
        };

        window.equipBlade = function(bladeId) {
            if ((gameState.inventory[bladeId] || 0) > 0) {
                gameState.inventory[bladeId]--;
                gameState.property.sawmill.bladeId = bladeId;
                
                if (bladeId === 'blade1') gameState.property.sawmill.bladeDurability = 50;
                else if (bladeId === 'blade2') gameState.property.sawmill.bladeDurability = 150;
                else if (bladeId === 'blade3') gameState.property.sawmill.bladeDurability = 500;
                
                if (typeof showNotification === 'function') showNotification('⚙️ Lâmina Equipada', 'Sua serraria agora está operando com força total!', 'success');
                if (typeof updateUI === 'function') updateUI();
            }
        };

        // ============================================
        // COMPARADOR DE EQUIPAMENTOS DO INVENTÁRIO
        // ============================================
        window.showEquipmentComparison = function(equipId, event) {
            const newEq = getEquipmentItemData(equipId);
            if (!newEq) return;

            let tooltip = document.getElementById('equipmentComparisonTooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'equipmentComparisonTooltip';
                tooltip.style.cssText = `
                    position: fixed;
                    z-index: 10000;
                    pointer-events: none;
                    background: linear-gradient(135deg, rgba(15,25,40,0.98), rgba(5,10,20,0.98));
                    border: 1.5px solid rgba(255,255,255,0.15);
                    border-radius: 12px;
                    padding: 14px;
                    width: 320px;
                    font-family: 'Outfit', sans-serif;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    line-height: 1.4;
                    opacity: 0;
                    transition: opacity 0.15s ease;
                `;
                document.body.appendChild(tooltip);
            }

            const slot = newEq.slot;
            const currentInstId = gameState.equipment.equipped[slot];
            const curEq = currentInstId ? getEquipmentItemData(currentInstId) : null;

            const borderColors = {
                common: 'rgba(255,255,255,0.15)',
                uncommon: 'rgba(74,255,74,0.3)',
                rare: 'rgba(74,154,255,0.4)',
                epic: 'rgba(180,90,255,0.5)',
                legendary: 'rgba(255,215,0,0.6)',
                ancient: 'rgba(255,80,80,0.7)'
            };
            tooltip.style.borderColor = borderColors[newEq.rarity] || borderColors.common;

            const slotNamesPt = {
                helmet: 'Elmo',
                amulet: 'Amuleto',
                weapon: 'Arma',
                armor: 'Armadura',
                shield: 'Escudo',
                ring: 'Anel',
                pants: 'Calças',
                boots: 'Botas'
            };

            let equippedHtml = '';
            if (curEq) {
                equippedHtml = `
                    <div style="flex:1; border-right:1px solid rgba(255,255,255,0.08); padding-right:10px;">
                        <div style="font-size:0.7em; color:#888; font-weight:700;">👉 EQUIPADO</div>
                        <div style="font-size:0.85em; font-weight:bold; color:${rarityColors[curEq.rarity]}; margin:4px 0;">${curEq.icon} ${curEq.name.split(' [')[0]}</div>
                        <div style="font-size:0.72em; color:#aaa;">${formatStatsTextOnly(curEq)}</div>
                    </div>
                `;
            } else {
                equippedHtml = `
                    <div style="flex:1; border-right:1px solid rgba(255,255,255,0.08); padding-right:10px; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60px;">
                        <div style="font-size:0.7em; color:#888; font-weight:700;">👉 EQUIPADO</div>
                        <div style="font-size:0.8em; color:#666; font-style:italic; margin-top:6px;">Nenhum item</div>
                    </div>
                `;
            }

            const newHtml = `
                <div style="flex:1; padding-left:10px;">
                    <div style="font-size:0.7em; color:#ffd700; font-weight:700;">✨ COMPARANDO</div>
                    <div style="font-size:0.85em; font-weight:bold; color:${rarityColors[newEq.rarity]}; margin:4px 0;">${newEq.icon} ${newEq.name.split(' [')[0]}</div>
                    <div style="font-size:0.72em; color:#aaa;">${formatStatsTextOnly(newEq)}</div>
                </div>
            `;

            const allStats = ['strength', 'defense', 'maxHealth', 'speedBonus', 'critChance', 'xpBonus', 'armorPenetration', 'trueDamage', 'lootLuck', 'tenacity'];
            const statLabels = {
                strength: 'Força ⚔️',
                defense: 'Defesa 🛡️',
                maxHealth: 'Vida ❤️',
                speedBonus: 'Velocidade ⚡',
                critChance: 'Crítico 🍀',
                xpBonus: 'XP 📚',
                armorPenetration: 'Pen. Armadura 🎯',
                trueDamage: 'Dano Puro 🩸',
                lootLuck: 'Sorte Saq. 🍀',
                tenacity: 'Tenacidade 🛡️'
            };

            let diffsHtml = '';
            let hasAnyDiff = false;

            allStats.forEach(stat => {
                const newVal = newEq.stats?.[stat] || 0;
                const curVal = curEq ? (curEq.stats?.[stat] || 0) : 0;
                
                if (newVal > 0 || curVal > 0) {
                    const diff = newVal - curVal;
                    let diffBadge = '';
                    if (diff > 0) {
                        diffBadge = `<span style="color:#4aff4a; font-weight:bold;">+${diff}${stat.includes('Bonus') || stat.includes('Chance') || stat.includes('xp') ? '%' : ''}</span>`;
                        hasAnyDiff = true;
                    } else if (diff < 0) {
                        diffBadge = `<span style="color:#ff4444; font-weight:bold;">${diff}${stat.includes('Bonus') || stat.includes('Chance') || stat.includes('xp') ? '%' : ''}</span>`;
                        hasAnyDiff = true;
                    } else {
                        diffBadge = `<span style="color:#888;">=</span>`;
                    }
                    diffsHtml += `
                        <div style="display:flex; justify-content:space-between; font-size:0.78em; padding:3px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
                            <span style="color:#bbb;">${statLabels[stat]}</span>
                            <span>${diffBadge}</span>
                        </div>
                    `;
                }
            });

            if (!hasAnyDiff && diffsHtml === '') {
                diffsHtml = `<div style="text-align:center; font-size:0.78em; color:#777; font-style:italic; padding:6px 0;">Sem diferença de atributos</div>`;
            }

            tooltip.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px; margin-bottom:4px;">
                    <span style="font-size:0.85em; font-weight:bold; font-family:'Cinzel'; color:#eee;">Comparador · Slot ${slotNamesPt[slot] || slot}</span>
                    <span style="font-size:0.7em; color:#888; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">Hover</span>
                </div>
                <div style="display:flex; margin-bottom:8px;">
                    ${equippedHtml}
                    ${newHtml}
                </div>
                <div style="background:rgba(0,0,0,0.25); border-radius:8px; padding:8px 12px; border:1px solid rgba(255,255,255,0.04);">
                    <div style="font-size:0.7em; color:#ffd700; font-weight:700; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.02em;">📊 Mudança de Status</div>
                    ${diffsHtml}
                </div>
            `;

            tooltip.style.display = 'flex';
            tooltip.style.opacity = '1';
            window.moveEquipmentComparison(event);
        };

        window.moveEquipmentComparison = function(event) {
            const tooltip = document.getElementById('equipmentComparisonTooltip');
            if (!tooltip) return;

            let x = event.clientX + 15;
            let y = event.clientY + 15;

            // Ajustar se passar do limite da tela
            if (x + tooltip.offsetWidth > window.innerWidth) {
                x = event.clientX - tooltip.offsetWidth - 15;
            }
            if (y + tooltip.offsetHeight > window.innerHeight) {
                y = window.innerHeight - tooltip.offsetHeight - 15;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        };

        window.hideEquipmentComparison = function() {
            const tooltip = document.getElementById('equipmentComparisonTooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.display = 'none';
            }
        };

        function formatStatsTextOnly(eq) {
            if (!eq) return '';
            const stats = eq.stats || eq;
            const parts = [];
            
            const gs = calculateGearScore(eq);
            if (gs > 0) parts.push(`⭐ GS: ${gs}`);
            if (stats.strength) parts.push(`+${stats.strength} Força`);
            if (stats.defense) parts.push(`+${stats.defense} Defesa`);
            if (stats.maxHealth) parts.push(`+${stats.maxHealth} Vida`);
            if (stats.speedBonus) parts.push(`+${stats.speedBonus}% Vel`);
            if (stats.critChance) parts.push(`+${stats.critChance}% Crit`);
            if (stats.xpBonus) parts.push(`+${stats.xpBonus}% XP`);
            if (stats.armorPenetration) parts.push(`+${stats.armorPenetration}% Pen Arm`);
            if (stats.trueDamage) parts.push(`+${stats.trueDamage} Dano Puro`);
            if (stats.lootLuck) parts.push(`+${stats.lootLuck}% Sorte Saq`);
            if (stats.tenacity) parts.push(`+${stats.tenacity}% Tenacidade`);
            return parts.join('<br>');
        }
