        // ============================================
        // FUNÇÕES DE UI
        // ============================================
        function updateUI() {
            const sidebarGoldEl = document.getElementById('sidebarGold');
            if (sidebarGoldEl) sidebarGoldEl.textContent = gameState.gold;
            const goldBarEl = document.getElementById('sidebarGoldBar');
            if (goldBarEl) goldBarEl.textContent = '💰 ' + formatNumber(gameState.gold || 0);
            const mobileGoldEl = document.getElementById('mobileGoldDisplay');
            if (mobileGoldEl) mobileGoldEl.textContent = '💰 ' + formatNumber(gameState.gold || 0);
            const sidebarPetEl = document.getElementById('sidebarPet');
            if (sidebarPetEl) {
                sidebarPetEl.textContent = gameState.pets.active ? getPetName(gameState.pets.active) : 'Nenhum';
            }
            const used = Object.values(gameState.inventory).filter(q => q > 0).length;
            document.getElementById('sidebarBank').textContent = `${used}/${gameState.bankSlots}`;
            document.getElementById('bankValue').textContent = gameState.bankSlots;
            document.getElementById('maxSlots').textContent = gameState.bankSlots;
            document.getElementById('usedSlots').textContent = used;
            updateWorkerSummary();
            
            // FORGE SPEC DISPLAY
            if (typeof updateForgeSpecDisplay === 'function') updateForgeSpecDisplay();
            if (typeof updateSawmillSpecDisplay === 'function') updateSawmillSpecDisplay();
            
            // FORGE HEAT UI
            const heatBar = document.getElementById('forgeHeatBar');
            const heatText = document.getElementById('forgeHeatText');
            const topHeatBar = document.getElementById('topForgeHeatBar');
            const topHeatText = document.getElementById('topForgeHeatText');
            
            if (gameState.property && gameState.property.forge) {
                const heat = gameState.property.forge.heat || 0;
                
                const updateHeatVisuals = (bar, text) => {
                    if (!bar || !text) return;
                    bar.style.width = heat + '%';
                    
                    if (heat <= 0) {
                        text.textContent = 'Frio (0%)';
                        text.style.color = '#888';
                        bar.style.background = '#888';
                        bar.style.boxShadow = 'none';
                    } else if (heat < 50) {
                        text.textContent = `Aquecendo (${heat}%)`;
                        text.style.color = '#ffaa00';
                        bar.style.background = '#ffaa00';
                        bar.style.boxShadow = '0 0 10px #ffaa00, inset 0 0 5px rgba(255,170,0,0.5)';
                    } else if (heat <= 80) {
                        text.textContent = `Ideal (${heat}%)`;
                        text.style.color = '#00ff44';
                        bar.style.background = '#00ff44';
                        bar.style.boxShadow = '0 0 15px #00ff44, inset 0 0 10px rgba(0,255,68,0.8)';
                    } else {
                        text.textContent = `Fervendo (${heat}%)`;
                        text.style.color = '#ff4444';
                        bar.style.background = '#ff4444';
                        bar.style.boxShadow = '0 0 20px #ff4444, inset 0 0 10px rgba(255,68,68,0.8)';
                    }
                };

                updateHeatVisuals(heatBar, heatText);
                updateHeatVisuals(topHeatBar, topHeatText);
                
                // ZONAS DA FORJA — info fixa ao lado da especialização
                const zoneInfo = document.getElementById('forgeZoneInfo');
                if (zoneInfo) {
                    if (heat <= 0) {
                        zoneInfo.innerHTML = '<span style="color:#888;">❄️ Fornalha Fria — sem produção</span>';
                    } else if (heat < 50) {
                        zoneInfo.innerHTML = '<span style="color:#ffaa00;">🔥 Aquecendo — produção normal (×1)</span>';
                    } else if (heat >= 50 && heat <= 80) {
                        zoneInfo.innerHTML = '<span style="color:#00ff44;">🟢 Zona Verde — ×1 velocidade · 15% dobrar</span>';
                    } else {
                        zoneInfo.innerHTML = '<span style="color:#ff4444;">🔴 Zona Vermelha — ×3 velocidade · 40% queima</span>';
                    }
                }
            }
            
            // SAWMILL DURABILITY UI
            const durBar = document.getElementById('sawmillDurabilityBar');
            const durText = document.getElementById('sawmillDurabilityText');
            const bladeSlot = document.getElementById('sawmillBladeSlot');
            if (durBar && durText && bladeSlot && gameState.property && gameState.property.sawmill) {
                const dur = gameState.property.sawmill.bladeDurability || 0;
                let maxDur = 100;
                const bladeId = gameState.property.sawmill.bladeId;
                if (bladeId === 'blade1') maxDur = 50;
                if (bladeId === 'blade2') maxDur = 150;
                if (bladeId === 'blade3') maxDur = 500;
                
                const pct = bladeId ? Math.min(100, Math.floor((dur / maxDur) * 100)) : 0;
                durBar.style.width = pct + '%';
                durText.textContent = pct + '%';
                if (!bladeId) {
                    durText.textContent = 'Sem lâmina';
                    bladeSlot.innerHTML = '❌';
                } else {
                    const eqData = getEquipmentItemData(bladeId) || inventoryItems.find(i => i.key === bladeId);
                    bladeSlot.innerHTML = eqData ? eqData.icon : '⚙️';
                }
            }
            let totalLevel = 0;
            for (let s in gameState.skills) totalLevel += gameState.skills[s].level;
            const maxTotal = 5000;
            document.getElementById('sidebarLevel').textContent = `${totalLevel}/${maxTotal}`;
            document.getElementById('totalLevelText').textContent = `Nível ${totalLevel}/${maxTotal}`;
            document.getElementById('totalLevelProgress').style.width = (totalLevel / maxTotal * 100) + '%';
            document.getElementById('totalLevelPercent').textContent = (totalLevel / maxTotal * 100).toFixed(1) + '%';
            
            // Call Firebase
            if (window.FirebaseService && gameState.player && gameState.player.name) {
                const cls = typeof gameClasses !== 'undefined' ? gameClasses.find(c => c.id === gameState.player.classId) : null;
                const avatar = gameState.player.avatar || '??';
                const className = cls ? cls.name : 'Sem classe';
                const houseName = cls ? cls.house : 'Sem Casa';
                
                try {
                    let totalGS = 0;
                    if (typeof calculateGearScore === 'function' && typeof getEquipmentItemData === 'function' && gameState.equipment && gameState.equipment.equipped) {
                        for (let slot in gameState.equipment.equipped) {
                            if (gameState.equipment.equipped[slot]) {
                                const eq = getEquipmentItemData(gameState.equipment.equipped[slot]);
                                if (eq) totalGS += calculateGearScore(eq);
                            }
                        }
                    }
                    
                    // Get additional stats
                    const gold = gameState.gold || 0;
                    let workers = 0;
                    if (gameState.property && gameState.property.workerCamp && typeof propertyDefs !== 'undefined') {
                        workers = propertyDefs.workerCamp.workersByLevel[gameState.property.workerCamp.level] || 0;
                    }
                    
                    let achievementsCount = 0;
                    if (gameState.achievements) achievementsCount = Object.values(gameState.achievements).filter(v => v === true).length;
                    const achievementsTotal = typeof achievementsList !== 'undefined' ? achievementsList.length : 56;
                    
                    const gatherLvl = (gameState.skills.woodcutting?.level || 0) + (gameState.skills.mining?.level || 0) + (gameState.skills.fishing?.level || 0) + (gameState.skills.herbalism?.level || 0);
                    const craftLvl = (gameState.skills.crafting?.level || 0) + (gameState.skills.smithing?.level || 0) + (gameState.skills.alchemy?.level || 0) + (gameState.skills.cooking?.level || 0) + (gameState.skills.enchanting?.level || 0);
                    
                    const gatherDetails = `🌲 Lenhador: ${gameState.skills.woodcutting?.level || 0}\n⛏️ Mineração: ${gameState.skills.mining?.level || 0}\n🎣 Pesca: ${gameState.skills.fishing?.level || 0}\n🌿 Herbolismo: ${gameState.skills.herbalism?.level || 0}`;
                    const craftDetails = `🧵 Criação: ${gameState.skills.crafting?.level || 0}\n⚔️ Ferraria: ${gameState.skills.smithing?.level || 0}\n🧪 Alquimia: ${gameState.skills.alchemy?.level || 0}\n🍳 Culinária: ${gameState.skills.cooking?.level || 0}\n✨ Encantamento: ${gameState.skills.enchanting?.level || 0}`;

                    window.FirebaseService.updateScore({
                        playerName: gameState.player.name, 
                        totalLevel, 
                        avatarClass: avatar, 
                        className, 
                        houseName, 
                        totalGS,
                        gold,
                        workers,
                        achievementsCount,
                        achievementsTotal,
                        gatherLvl,
                        craftLvl,
                        gatherDetails,
                        craftDetails,
                        // Snapshot do personagem para inspecao
                        charSnapshot: {
                            equipped: JSON.parse(JSON.stringify(gameState.equipment?.equipped || {})),
                            instances: JSON.parse(JSON.stringify(gameState.equipment?.instances || {})),
                            enchantments: JSON.parse(JSON.stringify(gameState.player?.enchantments || {})),
                            petActive: gameState.pets?.active || null,
                            classId: gameState.player?.classId || null,
                            upgrades: {
                                healthBonus: gameState.upgrades?.healthBonus || 0,
                                strengthBonus: gameState.upgrades?.strengthBonus || 0
                            },
                            skills: Object.fromEntries(
                                Object.entries(gameState.skills || {}).map(([k, v]) => [k, { level: v.level || 0 }])
                            ),
                            bestiary: JSON.parse(JSON.stringify(gameState.bestiary || {})),
                            achievements: JSON.parse(JSON.stringify(gameState.achievements || {})),
                            petLevels: JSON.parse(JSON.stringify(gameState.pets?.levels || {}))
                        }
                    });
                } catch (err) {
                    console.error("Erro ao preparar dados pro ranking:", err);
                }
            }
            let autoCount = 0;
            for (let s in gameState.skills) { let a = gameState.skills[s].auto; if (a && typeof a === 'object') autoCount += Object.values(a).filter(v => v === true).length; }
            const sidebarAutoEl = document.getElementById('sidebarAuto');
            if (sidebarAutoEl) sidebarAutoEl.textContent = autoCount;
            
            const sidebarWorkersEl = document.getElementById('sidebarWorkers');
            if (sidebarWorkersEl) {
                const total = typeof getWorkerTotal === 'function' ? getWorkerTotal() : 0;
                const allocated = typeof getWorkerAllocated === 'function' ? getWorkerAllocated() : 0;
                sidebarWorkersEl.textContent = `${allocated}/${total}`;
            }
            // Perícias de Combate (Weapon Skills)
            const weaponSkillsMap = {
                melee: 'sidebarWeaponMelee',
                distance: 'sidebarWeaponDistance',
                magic: 'sidebarWeaponMagic',
                shielding: 'sidebarWeaponShielding'
            };
            if (gameState.weaponSkills) {
                for (const [key, elId] of Object.entries(weaponSkillsMap)) {
                    const el = document.getElementById(elId);
                    if (el) {
                        const skill = gameState.weaponSkills[key] || { level: 1 };
                        el.textContent = skill.level;
                    }
                }
            }
            for (let s in gameState.skills) {
                let d = gameState.skills[s];
                let lvl = document.getElementById(s + 'LevelLarge');
                let xp = document.getElementById(s + 'XPLarge');
                let prog = document.getElementById(s + 'ProgressLarge');
                if (lvl) lvl.textContent = `Nível ${d.level}/500`;
                if (xp) xp.textContent = d.xp + '/' + xpRequired[d.level] + ' XP';
                if (prog) prog.style.width = Math.min((d.xp / xpRequired[d.level]) * 100, 100) + '%';

                // Atualizar sidebar
                let sideLvl = document.getElementById('sidebar-lvl-' + s);
                let sideProg = document.getElementById('sidebar-prog-' + s);
                if (sideLvl) sideLvl.textContent = d.level;
                if (sideProg) sideProg.style.width = Math.min((d.xp / xpRequired[d.level]) * 100, 100) + '%';
            }
            const equipBonuses = getEquipmentBonuses();
            const maxHealthBase = 50 + gameState.upgrades.healthBonus + (equipBonuses.maxHealth || 0) + getAchievementBonus('healthBonus');
            const colossoPct = equipBonuses.maxHealthPct || 0;
            
            // Elefante de Guerra: +20% HP Máximo (escalado por nível)
            let petHealthMult = 1.0;
            if (gameState.pets && gameState.pets.active === 'war_elephant') {
                const petState = getPetState('war_elephant');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                petHealthMult += (20 * levelMultiplier) / 100;
            }

            const maxHealth = Math.floor(maxHealthBase * (1 + colossoPct / 100) * petHealthMult);
            
            // Lobo de Guerra: Bônus de Dano
            let petStrMult = 1.0;
            if (gameState.pets && gameState.pets.active === 'war_wolf') {
                const petState = getPetState('war_wolf');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                petStrMult += (10 * levelMultiplier) / 100; // assumindo 10% base
            }
            
            const strengthBase = 5 + gameState.upgrades.strengthBonus + (equipBonuses.strength || 0) + getAchievementBonus('strengthBonus');
            const strength = Math.floor(strengthBase * petStrMult);
            
            gameState.combat.maxPlayerHealth = maxHealth;
            gameState.combat.playerStrength = strength;

            if (gameState.combat.playerHealth > maxHealth) gameState.combat.playerHealth = maxHealth;
            const phBar = document.getElementById('playerHealthBar');
            const phTxt = document.getElementById('playerHealthText');
            const ehBar = document.getElementById('enemyHealthBar');
            const ehTxt = document.getElementById('enemyHealthText');
            const pStat = document.getElementById('playerStats');
            if (phBar) phBar.style.width = (gameState.combat.playerHealth / maxHealth * 100) + '%';
            if (phTxt) phTxt.textContent = `${Math.max(0, gameState.combat.playerHealth)}/${maxHealth}`;
            if (ehBar) ehBar.style.width = (gameState.combat.enemyHealth / gameState.combat.maxEnemyHealth * 100) + '%';
            if (ehTxt) ehTxt.textContent = `${Math.max(0, gameState.combat.enemyHealth)}/${gameState.combat.maxEnemyHealth}`;
            if (pStat) pStat.textContent = `Força: ${strength} | Defesa: ${equipBonuses.defense || 0}`;

            const combatStatusElement = document.getElementById('combatStatus');
            if (combatStatusElement) {
                if (gameState.combat.inCombat) {
                    combatStatusElement.textContent = '⚔️ Em combate!';
                    combatStatusElement.style.background = '#ff4444';
                } else if (gameState.combat.playerHealth <= 0) {
                    combatStatusElement.textContent = '💀 Derrotado!';
                    combatStatusElement.style.background = '#666';
                } else {
                    combatStatusElement.textContent = '😴 Em paz';
                    combatStatusElement.style.background = '#ff4444';
                }
            }


            let totalFood = 0;
            ['cookedFish1', 'cookedFish2', 'cookedFish3', 'cookedFish4', 'cookedFish5'].forEach(k => totalFood += gameState.inventory[k] || 0);
            const fcEl = document.getElementById('foodCount');
            const faEl = document.getElementById('foodAvailable');
            if (fcEl) fcEl.textContent = totalFood;
            if (faEl) faEl.textContent = totalFood;
            document.getElementById('strengthValue').textContent = strength;
            document.getElementById('healthValue').textContent = maxHealth;
            document.getElementById('strengthCost').textContent = gameState.upgrades.strengthUpgradeCost + '💰';
            document.getElementById('healthCost').textContent = gameState.upgrades.healthUpgradeCost + '💰';
            document.getElementById('bankUpgradeCost').textContent = gameState.upgrades.bankUpgradeCost + '💰';
            updateInventory();
            if (gameState.currentPage === 'woodcutting' || gameState.currentPage === 'mining' || gameState.currentPage === 'fishing' || gameState.currentPage === 'herbalism') updateResourcesPage(gameState.currentPage);
            else if (gameState.currentPage === 'cooking') updateCookingPage();
            else if (gameState.currentPage === 'crafting') updateCraftingPage();
            else if (gameState.currentPage === 'smithing') updateSmithingPage();
            else if (gameState.currentPage === 'enchanting') updateEnchantingPage();
            else if (gameState.currentPage === 'character') updateCharacterPage();
            updateSidebarBuffs();
            updatePlayerInfoBar();

            // Atualizar Top Stats Bar (específico do index2.html)
            const topBar = document.getElementById('topStatsBar');
            if (topBar) {
                const elAvatar = document.getElementById('topHeroAvatar');
                const elName = document.getElementById('topHeroName');
                const elClass = document.getElementById('topHeroClass');
                const elWorkers = document.getElementById('topWorkers');
                const elGold = document.getElementById('topGold');
                const elPet = document.getElementById('topActivePet');
                const elInv = document.getElementById('topInventory');
                
                if (elAvatar && gameState.player) elAvatar.textContent = gameState.player.avatar || '🧙‍♂️';
                if (elName && gameState.player) elName.textContent = gameState.player.name || 'Herói';
                
                if (elClass && gameState.player) {
                    const charClass = getPlayerClassName(gameState.player.avatar, gameState.player.gender);
                    elClass.textContent = `[${charClass}]`;
                }
                
                if (elWorkers) {
                    if (typeof getWorkerAllocated === 'function' && typeof getWorkerTotal === 'function') {
                        elWorkers.textContent = `${getWorkerAllocated()}/${getWorkerTotal()}`;
                    } else {
                        elWorkers.textContent = '0/0';
                    }
                }
                
                if (elGold) elGold.textContent = formatNumber(gameState.gold || 0);
                
                if (elPet) {
                    if (gameState.pets.active) {
                        const activeId = gameState.pets.active;
                        const petObj = (typeof pets !== 'undefined') ? pets.find(p => p.id === activeId) : null;
                        const emoji = petObj ? petObj.icon : '🐾';
                        elPet.textContent = `${emoji} ${getPetName(activeId)}`;
                    } else {
                        elPet.textContent = '🐾 Nenhum';
                    }
                }
                
                if (elInv) {
                    const used = Object.values(gameState.inventory).filter(q => q > 0).length;
                    elInv.textContent = `${used}/${gameState.bankSlots}`;
                }
                
                // Atualizar quantidades rápidas de recursos e suas tooltips
                const resWood = document.getElementById('topResWood');
                const resOre = document.getElementById('topResOre');
                const resFish = document.getElementById('topResFish');
                const resHerbs = document.getElementById('topResHerbs');
                
                if (resWood) {
                    let totalWood = 0;
                    for (let i = 1; i <= 5; i++) totalWood += (gameState.inventory[`wood${i}`] || 0);
                    resWood.textContent = formatNumber(totalWood);
                }
                if (resOre) {
                    let totalOre = 0;
                    for (let i = 1; i <= 5; i++) totalOre += (gameState.inventory[`ore${i}`] || 0);
                    resOre.textContent = formatNumber(totalOre);
                }
                if (resFish) {
                    let totalFish = 0;
                    for (let i = 1; i <= 5; i++) totalFish += (gameState.inventory[`fish${i}`] || 0);
                    resFish.textContent = formatNumber(totalFish);
                }
                if (resHerbs) {
                    let totalHerbs = 0;
                    for (let i = 1; i <= 5; i++) totalHerbs += (gameState.inventory[`herb${i}`] || 0);
                    resHerbs.textContent = formatNumber(totalHerbs);
                }

                // Barras (smithing)
                const resBars = document.getElementById('topResBars');
                if (resBars) {
                    let totalBars = 0;
                    for (let i = 1; i <= 5; i++) totalBars += (gameState.inventory[`bar${i}`] || 0);
                    resBars.textContent = formatNumber(totalBars);
                }

                // Comidas (cooking)
                const resFood = document.getElementById('topResFood');
                if (resFood) {
                    let totalFood = 0;
                    for (let i = 1; i <= 5; i++) totalFood += (gameState.inventory[`cookedFish${i}`] || 0);
                    resFood.textContent = formatNumber(totalFood);
                }

                // Popular tooltips com detalhes individuais
                const resourcesMap = {
                    Wood: ['wood1', 'wood2', 'wood3', 'wood4', 'wood5'],
                    Ore: ['ore1', 'ore2', 'ore3', 'ore4', 'ore5'],
                    Fish: ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'],
                    Herbs: ['herb1', 'herb2', 'herb3', 'herb4', 'herb5'],
                    Bars: ['bar1', 'bar2', 'bar3', 'bar4', 'bar5'],
                    Food: ['cookedFish1', 'cookedFish2', 'cookedFish3', 'cookedFish4', 'cookedFish5']
                };

                for (let category in resourcesMap) {
                    const keysList = resourcesMap[category];
                    const tooltipListEl = document.getElementById(`tooltip${category}List`);
                    if (tooltipListEl) {
                        let html = '';
                        keysList.forEach(key => {
                            const name = getItemName(key);
                            const icon = getItemIconHtml(key);
                            const qty = gameState.inventory[key] || 0;
                            html += `
                                <div class="tooltip-row">
                                    <span class="tooltip-row-name">${icon} ${name}</span>
                                    <span class="tooltip-row-qty">${formatNumber(qty)}</span>
                                </div>
                            `;
                        });
                        tooltipListEl.innerHTML = html;
                    }
                }
            }
        }


        function showPage(page) {
            if (typeof window.hideEquipmentComparison === 'function') {
                window.hideEquipmentComparison();
            }
            gameState.currentPage = page;
            
            // Fechar sidebar no mobile se estiver aberta
            const sidebar = document.getElementById('gameSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (overlay) overlay.classList.remove('active');
            }

            document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = Array.from(document.querySelectorAll('.menu-btn')).find(btn => btn.classList.contains(page));
            if (activeBtn) activeBtn.classList.add('active');
            document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
            document.getElementById(page + 'Page').classList.add('active');
            if (page === 'pets') updatePetsPage();
            else if (page === 'tech') updateTechTreePage();
            else if (page === 'worldboss') { if(typeof initWorldBoss === 'function') initWorldBoss(); }
            else if (page === 'alchemy') updateAlchemyPage();
            else if (page === 'character') updateCharacterPage();
            else if (page === 'dungeon') updateDungeonPage();
            else if (page === 'property') updatePropertyPage();
            else if (page === 'runeforge') updateRuneforgePage();
            else if (page === 'runar') updateRunarPage();
            else if (page === 'combat') renderArenaPage();
            else if (page === 'woodcutting' || page === 'mining' || page === 'fishing' || page === 'herbalism') updateResourcesPage(page);
            else if (page === 'cooking') updateCookingPage();
            else if (page === 'crafting') updateCraftingPage();
            else if (page === 'smithing') updateSmithingPage();
            else if (page === 'enchanting') updateEnchantingPage();
            else if (page === 'adminPanel') { setTimeout(() => { if(typeof admRefreshWBStatus === 'function') admRefreshWBStatus(); }, 300); }
            updateUI();
        }

        function showShopTab(tab) {
            gameState.currentShopTab = tab;
            document.querySelectorAll('#mercadoPage .shop-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#mercadoPage .shop-section').forEach(s => s.classList.remove('active'));
            if (tab === 'mercado') {
                document.querySelectorAll('#mercadoPage .shop-tab')[0].classList.add('active');
                document.getElementById('mercadoSection').classList.add('active');
            } else if (tab === 'academia') {
                document.querySelectorAll('#mercadoPage .shop-tab')[1].classList.add('active');
                document.getElementById('academiaSection').classList.add('active');
            } else if (tab === 'ferramentas') {
                document.querySelectorAll('#mercadoPage .shop-tab')[2].classList.add('active');
                document.getElementById('ferramentasSection').classList.add('active');
                updateToolsPage();
            }
        }


        // ============================================
        // INFORMAÇÃO ITEM
        // ============================================


        function showItemInfo(itemKey) {
            const item = inventoryItems.find(i => i.key === itemKey);
            if (!item) return;

            // Gerar informações sobre o item
            let description = "";
            let uses = [];

            // Verificar se é um recurso de coleta
            for (let category in resources) {
                const resource = resources[category].find(r => r.id === itemKey);
                if (resource) {
                    description = resource.desc;
                    uses.push(`💰 Pode ser vendido por ${resource.price} ouro`);
                    uses.push(`🎯 Dá ${resource.xpGain} XP ao coletar`);
                    if (resource.healAmount) {
                        uses.push(`❤️ Cura ${resource.healAmount} de vida quando cozido`);
                    }
                    break;
                }
            }

            // Verificar se é usado em alguma receita de craft
            const allRecipes = [...cookingRecipes, ...craftingRecipes, ...smithingRecipes, ...enchantingRecipes];
            const usedInRecipes = allRecipes.filter(recipe => recipe.input.type === itemKey);

            if (usedInRecipes.length > 0) {
                uses.push(`🔨 Pode ser usado para craftar:`);
                usedInRecipes.forEach(recipe => {
                    uses.push(`   → ${recipe.name} (Nível ${recipe.levelReq})`);
                });
            }

            // Verificar se é um item craftado
            const craftedFrom = allRecipes.find(recipe => recipe.output.type === itemKey);
            if (craftedFrom) {
                uses.push(`📦 Pode ser craftado usando: ${craftedFrom.input.qty}x ${getItemName(craftedFrom.input.type)}`);
                uses.push(`🎯 Dá ${craftedFrom.xpGain} XP ao craftar`);
                if (craftedFrom.price) {
                    uses.push(`💰 Pode ser vendido por ${craftedFrom.price} ouro`);
                }
                if (craftedFrom.healAmount) {
                    uses.push(`❤️ Cura ${craftedFrom.healAmount} de vida quando consumido`);
                }
            }

            // Se não encontrou descrição específica
            if (!description) {
                // Se for um pergaminho de encantamento
                if (itemKey.startsWith('enchant_')) {
                    const rec = enchantingRecipes.find(r => r.id === itemKey);
                    description = rec ? rec.desc : `Item de encantamento: ${item.name}.`;
                } else {
                    description = `Item comum do jogo: ${item.name}.`;
                }
            }

            // Criar modal
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.onclick = closeItemInfo;

            let actionBtnHtml = "";
            if (itemKey.startsWith('enchant_') && (gameState.inventory[itemKey] || 0) > 0) {
                const targetName = itemKey.startsWith('enchant_atk_') ? 'Arma ⚔️' : 'Armadura 🛡️';
                actionBtnHtml = `
                    <div style="margin-top:15px; text-align:center;">
                        <button onclick="applyEnchantmentFromInventory('${itemKey}')" style="background:var(--accent-color, #ff9944); color:#000; font-family:'Outfit',sans-serif; border:none; padding:10px 20px; border-radius:8px; font-weight:700; font-size:0.9em; cursor:pointer; box-shadow:0 0 10px rgba(255,153,68,0.3); transition:all 0.2s;">
                            🔮 Encantar ${targetName}
                        </button>
                    </div>
                `;
            }

            const modal = document.createElement('div');
            modal.className = 'item-info-modal';
            modal.innerHTML = `
                <div class="modal-header">
                    <h3>ℹ️ Informações do Item</h3>
                    <button class="close-modal" onclick="closeItemInfo()">×</button>
                </div>
                <div class="modal-icon">${item.icon}</div>
                <div class="modal-description">
                    <strong>${item.name}</strong><br>
                    ${description}
                </div>
                <div class="modal-uses">
                    <h4>📋 Utilidades:</h4>
                    <ul>
                        ${uses.map(u => `<li>${u}</li>`).join('')}
                    </ul>
                </div>
                ${actionBtnHtml}
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        function closeItemInfo() {
            const modal = document.querySelector('.item-info-modal');
            const overlay = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            if (overlay) overlay.remove();
        }

        function applyEnchantmentFromInventory(itemKey) {
            if ((gameState.inventory[itemKey] || 0) <= 0) return;
            
            if (!gameState.player) gameState.player = {};
            if (!gameState.player.enchantments) {
                gameState.player.enchantments = { weapon: null, armor: null };
            }
            
            gameState.inventory[itemKey]--;
            
            if (itemKey.startsWith('enchant_atk_')) {
                gameState.player.enchantments.weapon = itemKey;
                showNotification('🔮 Encantamento!', `Sua Arma foi encantada com sucesso!`, 'success', '🔮');
            } else if (itemKey.startsWith('enchant_def_')) {
                gameState.player.enchantments.armor = itemKey;
                showNotification('🔮 Encantamento!', `Sua Armadura foi encantada com sucesso!`, 'success', '🔮');
            }
            
            closeItemInfo();
            updateUI();
        }

        function saveGame() {
            const t0 = performance.now();
            gameState.lastSave = Date.now();
            localStorage.setItem('idleCraftSave', JSON.stringify(gameState));
            const t1 = performance.now();
            if (typeof devSaveLatency !== 'undefined') {
                devSaveLatency = t1 - t0;
            }
            showNotification('💾 Salvo!', 'Progresso salvo.', 'success');
        }

        function loadGame() {
            const saved = localStorage.getItem('idleCraftSave');
            if (saved) {
                for (let i in gameState.autoIntervals) clearInterval(gameState.autoIntervals[i]);
                if (gameState.combat.combatInterval) clearInterval(gameState.combat.combatInterval);
                if (gameState.pets.autoCollectInterval) clearInterval(gameState.pets.autoCollectInterval);
                const loaded = JSON.parse(saved);
                // Garantir que equipment existe no save antigo
                if (!loaded.equipment) loaded.equipment = { equipped: { helmet: null, amulet: null, weapon: null, armor: null, shield: null, ring: null, pants: null, boots: null }, inventory: {} };
                if (!loaded.equipment.instances) loaded.equipment.instances = {};
                if (!loaded.runes) loaded.runes = {};
                if (!loaded.pets) loaded.pets = { owned: [], active: null, autoCollectInterval: null };
                if (!loaded.pets.levels) loaded.pets.levels = {};
                if (!loaded.tools) loaded.tools = {};
                if (!loaded.dungeons) loaded.dungeons = {};
                if (!loaded.property) loaded.property = {
                    farm:    { level: 0, slots: [], lastTick: 0 },
                    sawmill: { level: 0, queue: null, progress: 0, lastTick: 0 },
                    forge:   { level: 0, queue: null, progress: 0, lastTick: 0 },
                    stable:  { level: 0, lastTick: 0 },
                    library: { level: 0, studySkill: 'woodcutting', xpAccum: 0, lastTick: 0 },
                    tavern:  { level: 0, goldAccum: 0, lastTick: 0 }
                };
                gameState = loaded;
                
                // Migração de configurações do jogador
                if (!gameState.settings) {
                    gameState.settings = {
                        autoEquip: false,
                        devMode: false,
                        keybindings: true,
                        maxNotifications: 5,
                        hiddenNotificationCategories: {},
                        fontSize: '100%',
                        numberFormat: 'standard'
                    };
                } else {
                    if (gameState.settings.autoEquip === undefined) gameState.settings.autoEquip = false;
                    if (gameState.settings.devMode === undefined) gameState.settings.devMode = false;
                    if (gameState.settings.keybindings === undefined) gameState.settings.keybindings = true;
                    if (gameState.settings.maxNotifications === undefined) gameState.settings.maxNotifications = 5;
                    if (gameState.settings.hiddenNotificationCategories === undefined) gameState.settings.hiddenNotificationCategories = {};
                    if (gameState.settings.fontSize === undefined) gameState.settings.fontSize = '100%';
                    if (gameState.settings.numberFormat === undefined) gameState.settings.numberFormat = 'standard';
                }
                if (typeof applyFontSize === 'function') {
                    applyFontSize(gameState.settings.fontSize);
                }

                // Migração de equipamentos não-instanciados antigos no inventário e equipados
                if (gameState.equipment) {
                    if (!gameState.equipment.instances) gameState.equipment.instances = {};
                    if (!gameState.equipment.inventory) gameState.equipment.inventory = {};
                    if (!gameState.equipment.equipped) gameState.equipment.equipped = {};

                    // 1. Migrar inventário
                    for (let [id, qty] of Object.entries(gameState.equipment.inventory)) {
                        if (qty > 0 && !id.startsWith('inst_')) {
                            const base = equipmentData[id];
                            if (base) {
                                delete gameState.equipment.inventory[id];
                                for (let k = 0; k < qty; k++) {
                                    const instId = 'inst_' + Date.now() + '_' + Math.floor(Math.random() * 100000) + '_' + k;
                                    const initialQuality = base.rarity || 'common';
                                    
                                    const qualityRanges = {
                                        common: { min: 0.85, max: 1.10 },
                                        uncommon: { min: 0.90, max: 1.15 },
                                        rare: { min: 0.95, max: 1.20 },
                                        epic: { min: 1.00, max: 1.30 },
                                        legendary: { min: 1.05, max: 1.40 },
                                        ancient: { min: 1.10, max: 1.50 }
                                    };
                                    const range = qualityRanges[initialQuality] || qualityRanges.common;
                                    const statRolls = {};
                                    if (base.stats) {
                                        for (let stat in base.stats) {
                                            statRolls[stat] = parseFloat((range.min + Math.random() * (range.max - range.min)).toFixed(2));
                                        }
                                    }

                                    gameState.equipment.instances[instId] = {
                                        id: id,
                                        slots: 2,
                                        runas: [null, null],
                                        quality: initialQuality,
                                        statRolls: statRolls,
                                        element: null,
                                        elementValue: 0
                                    };
                                    gameState.equipment.inventory[instId] = 1;
                                }
                            }
                        }
                    }

                    // 2. Migrar equipados
                    for (let slot in gameState.equipment.equipped) {
                        const id = gameState.equipment.equipped[slot];
                        if (id && !id.startsWith('inst_')) {
                            const base = equipmentData[id];
                            if (base) {
                                const instId = 'inst_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
                                const initialQuality = base.rarity || 'common';
                                
                                const qualityRanges = {
                                    common: { min: 0.85, max: 1.10 },
                                    uncommon: { min: 0.90, max: 1.15 },
                                    rare: { min: 0.95, max: 1.20 },
                                    epic: { min: 1.00, max: 1.30 },
                                    legendary: { min: 1.05, max: 1.40 },
                                    ancient: { min: 1.10, max: 1.50 }
                                };
                                const range = qualityRanges[initialQuality] || qualityRanges.common;
                                const statRolls = {};
                                if (base.stats) {
                                    for (let stat in base.stats) {
                                        statRolls[stat] = parseFloat((range.min + Math.random() * (range.max - range.min)).toFixed(2));
                                    }
                                }

                                gameState.equipment.instances[instId] = {
                                    id: id,
                                    slots: 2,
                                    runas: [null, null],
                                    quality: initialQuality,
                                    statRolls: statRolls,
                                    element: null,
                                    elementValue: 0
                                };
                                gameState.equipment.equipped[slot] = instId;
                            }
                        }
                    }
                }

                if (!gameState.notificationStyle) gameState.notificationStyle = 'style3';
                if (!gameState.customThemeColors) {
                    gameState.customThemeColors = {
                        bgPrimary: '#101a24',
                        bgPrimary2: '#050a0f',
                        bgSecondary: '#1a2a3a',
                        accentColor: '#ff9944',
                        textColor: '#e0e6ed',
                        gameContainerBg: null,
                        sidebarBg: null,
                        contentAreaBg: null
                    };
                } else {
                    // Migração: adicionar chaves novas se ausentes em saves antigos
                    if (!('gameContainerBg' in gameState.customThemeColors)) gameState.customThemeColors.gameContainerBg = null;
                    if (!('sidebarBg' in gameState.customThemeColors)) gameState.customThemeColors.sidebarBg = null;
                    if (!('contentAreaBg' in gameState.customThemeColors)) gameState.customThemeColors.contentAreaBg = null;
                }
                if (!gameState.customFont) gameState.customFont = 'default';
                // Migração: Limpar autofarm legado
                ['woodcutting', 'mining', 'fishing', 'herbalism'].forEach(s => {
                    if (gameState.skills && gameState.skills[s]) {
                        gameState.skills[s].auto = {};
                    }
                });
                if (!gameState.skills.herbalism) {
                    gameState.skills.herbalism = { level: 1, xp: 0, auto: {} };
                }
                if (!gameState.skills.enchanting) {
                    gameState.skills.enchanting = { level: 1, xp: 0, auto: false };
                }
                if (gameState.player && !gameState.player.enchantments) {
                    gameState.player.enchantments = { weapon: null, armor: null };
                }
                // Migração: arena
                if (!gameState.arena) {
                    gameState.arena = { wave:1, wins:0, streak:0, bestStreak:0, stamina:5, maxStamina:5, lastStaminaRegen:0, arenaCoins:0, weeklyPoints:0, shopPurchased:{}, battleLog:[], inBattle:false, autoMode:false, currentEnemy:null, playerHP:0, enemyHP:0, defenseMode:false, cooldowns:{}, pendingRage:false, lastAction:null, autoInterval:null, arenaTab:'battle' };
                } else {
                    if (gameState.arena.maxStamina === undefined) gameState.arena.maxStamina = 5;
                    if (gameState.arena.weeklyPoints === undefined) gameState.arena.weeklyPoints = 0;
                    if (gameState.arena.bestStreak === undefined) gameState.arena.bestStreak = 0;
                    gameState.arena.inBattle = false;
                    gameState.arena.autoInterval = null;
                }
                applyCustomTheme();
                startPetAutoCollect();
                updateUI();
                showPage(gameState.currentPage || 'property');
                showNotification('📂 Carregado!', 'Progresso restaurado.', 'success');
            } else showNotification('❌ Erro!', 'Nenhum save encontrado.', 'error');
        }

        function resetGame() {
            if (confirm('Tem certeza de que deseja deletar permanentemente seu save e reiniciar?')) {
                localStorage.removeItem('idleCraftSave');
                location.reload();
            }
        }


        // ============================================
        // SISTEMA DE TROCA MANUAL DE TEMAS
        // ============================================
        function changeTheme(themeId) {
            if (!gameState.player) return;
            gameState.selectedTheme = themeId;
            
            // Limpar customizações de cores ao redefinir para um tema oficial de Casa
            gameState.customThemeColors = null;
            
            // Limpar CSS vars customizadas do body
            const props = ['--bg-gradient', '--card-bg', '--sidebar-bg', '--accent-color', '--primary-color', '--text-color-main'];
            props.forEach(p => document.body.style.removeProperty(p));
            
            // Limpar estilos inline dos elementos de layout
            const gameContainer = document.querySelector('.game-container');
            const sidebar = document.querySelector('.sidebar');
            const contentArea = document.querySelector('.content-area');
            if (gameContainer) gameContainer.style.removeProperty('background');
            if (sidebar) sidebar.style.removeProperty('background');
            if (contentArea) contentArea.style.removeProperty('background');
            
            updatePlayerInfoBar();
            updateColorPickerInputs();
            showNotification('🎨 Tema Alterado!', `Tema da Casa ${themeId.toUpperCase()} ativado!`, 'success');
            saveGame();
        }

        function updateActiveThemeButtons() {
            const currentTheme = gameState.selectedTheme || gameState.player?.classId;
            document.querySelectorAll('.theme-btn').forEach(btn => {
                const isCurrent = btn.getAttribute('data-theme') === currentTheme;
                btn.classList.toggle('active-theme', isCurrent);
            });
        }

        // Função de navegação dinâmica para o acampamento de trabalhadores
        window.navigateToWorkerCamp = function() {
            showPage('property');
            setTimeout(() => {
                const card = document.getElementById('prop-card-workerCamp');
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.borderColor = '#ff9944';
                    card.style.boxShadow = '0 0 20px rgba(255, 153, 68, 0.4)';
                    setTimeout(() => {
                        card.style.borderColor = '';
                        card.style.boxShadow = '';
                    }, 1500);
                }
            }, 100);
        };
// =========================================
// WISHING WELL & GLOBAL BUFFS UI
// =========================================

window.activeGlobalEvent = null; // Cache local do evento ativo

function initWishingWell() {
    if(window.FirebaseService && window.FirebaseService.listenToWishingWell) {
        window.FirebaseService.listenToWishingWell((data) => {
            if(!data) return;
            
            // Atualizar UI do Poço
            const wellProgressText = document.getElementById('wellProgressText');
            const wellProgressBar = document.getElementById('wellProgressBar');
            if(wellProgressText && wellProgressBar) {
                const percentage = Math.min(100, (data.currentGold / data.targetGold) * 100);
                wellProgressText.innerText = `${typeof formatNumber === 'function' ? formatNumber(data.currentGold) : data.currentGold} / ${typeof formatNumber === 'function' ? formatNumber(data.targetGold) : data.targetGold} Ouro`;
                wellProgressBar.style.width = `${percentage}%`;
            }

            // Atualizar Buffs Ativos
            if(data.activeEvent && data.eventEndTime > Date.now()) {
                window.activeGlobalEvent = data.activeEvent;
                window._globalEventEndTime = data.eventEndTime;
                updateGlobalBuffUI(data.activeEvent, data.eventEndTime);
                const statusDiv = document.getElementById('wellActiveEventStatus');
                if(statusDiv) statusDiv.style.display = 'block';
                const nameSpan = document.getElementById('wellEventName');
                if(nameSpan) nameSpan.innerText = getEventName(data.activeEvent);
            } else {
                window.activeGlobalEvent = null;
                clearGlobalBuffUI();
                const statusDiv = document.getElementById('wellActiveEventStatus');
                if(statusDiv) statusDiv.style.display = 'none';
            }
        });
    }
}

function getEventName(id) {
    const map = {
        'star_shower': '🌠 Chuva de Estrelas (+20% Minérios Raros)',
        'gaia_blessing': '🍃 Bênção de Gaia (Coleta Dupla 🌲🌿)',
        'frenzy_forge': '🔥 Forja Frenética (Crafting e Smithing 2x)',
        'arena_fury': '👺 Fúria da Arena (Monstros Fortes, 2x Ouro/Loot)'
    };
    return map[id] || 'Evento Místico';
}

function updateGlobalBuffUI(eventId, endTime) {
    const container = document.getElementById('globalActiveBuffs');
    if(!container) return;
    
    let icon = '✨';
    if(eventId === 'star_shower') icon = '🌠';
    if(eventId === 'gaia_blessing') icon = '🍃';
    if(eventId === 'frenzy_forge') icon = '🔥';
    if(eventId === 'arena_fury') icon = '👺';

    container.innerHTML = `<div class="active-buff-icon" data-tooltip="${getEventName(eventId)}">${icon}</div>`;
}

function clearGlobalBuffUI() {
    const container = document.getElementById('globalActiveBuffs');
    if(container) container.innerHTML = '';
}

window.donateToWell = async function() {
    const input = document.getElementById('wellDonateAmount');
    const amount = parseInt(input.value);
    
    if(isNaN(amount) || amount <= 0) {
        showNotification('Atenção', 'Insira uma quantia válida de Ouro.', 'error');
        return;
    }
    
    if(gameState.gold < amount) {
        showNotification('Sem Ouro', 'Você não tem ouro suficiente.', 'error');
        return;
    }
    
    gameState.gold -= amount;
    updateUI();
    input.value = '';
    
    showNotification('🪙 Poço dos Desejos', `Você jogou ${typeof formatNumber === 'function' ? formatNumber(amount) : amount} Ouro no poço.`, 'success');
    
    const playerName = gameState.name || 'Herói Anônimo';
    const triggeredEvent = await window.FirebaseService.donateToWishingWell(amount, playerName);
    
    if(triggeredEvent) {
        showNotification('🌋 ERUPÇÃO MÍSTICA!', `A meta foi atingida! Evento Global Iniciado: ${getEventName(triggeredEvent)}`, 'success');
    }
}

// Inicializar após carregamento
setTimeout(initWishingWell, 3000);
// =========================================