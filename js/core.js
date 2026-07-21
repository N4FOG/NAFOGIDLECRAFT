        let gameState = {
            gold: 1000,
            bankSlots: 4,
            lastSave: Date.now(),
            currentPage: 'property',
            currentShopTab: 'mercado',
            currentAlchemyTab: 'craft',
            notificationStyle: 'style3',
            customThemeColors: {
                bgPrimary: '#101a24',
                bgPrimary2: '#050a0f',
                bgSecondary: '#1a2a3a',
                accentColor: '#ff9944',
                textColor: '#e0e6ed',
                gameContainerBg: null,
                sidebarBg: null,
                contentAreaBg: null
            },
            customFont: 'default',
            settings: {
                autoEquip: false,
                devMode: false,
                keybindings: true,
                maxNotifications: 5,
                hiddenNotificationCategories: {},
                fontSize: '100%',
                numberFormat: 'standard'
            },
            player: null,
            upgrades: {
                bankUpgradeCost: 200,
                strengthUpgradeCost: 200,
                healthUpgradeCost: 150,
                strengthBonus: 0,
                healthBonus: 0
            },
            skills: {
                woodcutting: { level: 1, xp: 0, auto: {} },
                mining: { level: 1, xp: 0, auto: {} },
                fishing: { level: 1, xp: 0, auto: {} },
                herbalism: { level: 1, xp: 0, auto: {} },
                cooking: { level: 1, xp: 0, auto: false },
                crafting: { level: 1, xp: 0, auto: false },
                smithing: { level: 1, xp: 0, auto: false },
                enchanting: { level: 1, xp: 0, auto: false }
            },
            weaponSkills: {
                melee: { level: 1, attacks: 0 },
                distance: { level: 1, attacks: 0 },
                magic: { level: 1, attacks: 0 },
                shielding: { level: 1, attacks: 0 }
            },
            bestiary: {},
            inventory: {},
            combat: {
                playerHealth: 50,
                maxPlayerHealth: 50,
                playerStrength: 5,
                enemyHealth: 30,
                maxEnemyHealth: 30,
                enemyDamage: 3,
                enemyName: "Goblin",
                enemyType: "goblin",
                inCombat: false,
                combatInterval: null
            },
            autoIntervals: {},
            craftingTimers: {},
            pets: { owned: [], active: null, autoCollectInterval: null, levels: {}, enshrined: {} },
            techTree: {
                gathering: { upgrades: [{ id: 'efficiency1', name: 'Eficiência I', currentLevel: 0, maxLevel: 3, cost: 500, effectValue: 10, effectType: 'xpBoost', required: null }, { id: 'double1', name: 'Dobro I', currentLevel: 0, maxLevel: 5, cost: 800, effectValue: 5, effectType: 'doubleChance', required: 'efficiency1' }, { id: 'autospeed1', name: 'Automação Rápida', currentLevel: 0, maxLevel: 3, cost: 1200, effectValue: 1, effectType: 'autoSpeed', required: 'double1' }] },
                combat: { upgrades: [{ id: 'critical1', name: 'Crítico I', currentLevel: 0, maxLevel: 3, cost: 600, effectValue: 15, effectType: 'criticalChance', required: null }, { id: 'vampirism', name: 'Vampirismo', currentLevel: 0, maxLevel: 3, cost: 1000, effectValue: 5, effectType: 'lifesteal', required: 'critical1' }, { id: 'durability', name: 'Durabilidade', currentLevel: 0, maxLevel: 3, cost: 1500, effectValue: 25, effectType: 'healthBoost', required: 'vampirism' }] },
                crafting: { upgrades: [{ id: 'materialEfficiency', name: 'Eficiência de Materiais', currentLevel: 0, maxLevel: 3, cost: 700, effectValue: 10, effectType: 'costReduction', required: null }, { id: 'craftSpeed', name: 'Craft Rápido', currentLevel: 0, maxLevel: 3, cost: 1100, effectValue: 20, effectType: 'craftSpeed', required: 'materialEfficiency' }, { id: 'masterCraft', name: 'Mestre Artesão', currentLevel: 0, maxLevel: 3, cost: 2000, effectValue: 25, effectType: 'valueBoost', required: 'craftSpeed' }] },
                alchemy: { upgrades: [{ id: 'potionMaster1', name: 'Mestre Poções I', currentLevel: 0, maxLevel: 3, cost: 800, effectValue: 20, effectType: 'potionDuration', required: null }, { id: 'potionPower1', name: 'Potência I', currentLevel: 0, maxLevel: 3, cost: 1200, effectValue: 15, effectType: 'potionPower', required: 'potionMaster1' }, { id: 'doublePotion', name: 'Poção Dupla', currentLevel: 0, maxLevel: 3, cost: 2000, effectValue: 25, effectType: 'doublePotion', required: 'potionPower1' }] }
            },
            alchemy: { inventory: {}, activePotions: {}, craftingTimers: {} },
            equipment: {
                equipped: { helmet: null, amulet: null, weapon: null, armor: null, shield: null, ring: null, pants: null, boots: null },
                inventory: {},
                instances: {}
            },
            runes: {},
            currentRunarTab: 'equip',
            tools: {},
            dungeons: {},
            arena: {
                wave: 1,
                wins: 0,
                streak: 0,
                bestStreak: 0,
                stamina: 5,
                maxStamina: 5,
                lastStaminaRegen: 0,
                arenaCoins: 0,
                weeklyPoints: 0,
                shopPurchased: {},
                battleLog: [],
                inBattle: false,
                autoMode: false,
                currentEnemy: null,
                playerHP: 0,
                enemyHP: 0,
                defenseMode: false,
                cooldowns: {},
                pendingRage: false,
                lastAction: null,
                autoInterval: null,
                arenaTab: 'battle'
            },
            property: {
                farm:        { level: 0, slots: [], lastTick: 0 },
                sawmill:     { level: 0, queue: null, progress: 0, lastTick: 0, bladeId: null, bladeDurability: 0, spec: null },
                forge:       { level: 0, queue: null, progress: 0, lastTick: 0, heat: 0, fuelId: null, fuelQty: 0, spec: null },
                stable:      { level: 0, lastTick: 0 },
                library:     { level: 0, studySkill: 'woodcutting', xpAccum: 0, lastTick: 0 },
                tavern:      { level: 0, goldAccum: 0, lastTick: 0 },
                workerCamp:  { level: 0 }
            },
            workers: {
                allocated: {}   // { 'wood1': 2, 'ore1': 1, ... }
            }
        };
        


        // ============================================
        // AUTOSAVE E LOOP DE UI
        // ============================================
        let autosaveInterval = null;
        let propertyTickInterval = null;
        let uiProgressInterval = null;

        function startAutosave() {
            if (autosaveInterval) clearInterval(autosaveInterval);
            autosaveInterval = setInterval(() => {
                gameState.lastSave = Date.now();
                localStorage.setItem('idleCraftSave', JSON.stringify(gameState));
                const area = document.getElementById('notificationArea');
                if (!area) return;
                const toast = document.createElement('div');
                toast.className = 'notification-toast';
                toast.style.cssText = 'border-left-color:#3a5a4a;opacity:0.7;font-size:0.85em;';
                toast.innerHTML = `<div>💾</div><div>Autosave</div>`;
                area.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }, 60000);

            // Iniciar o timer do Pombo Correio
            if (typeof startPomboTimer === 'function') startPomboTimer();


            // Tick da propriedade a cada 10s
            if (propertyTickInterval) clearInterval(propertyTickInterval);
            propertyTickInterval = setInterval(propertyTick, 10000);

            // Tick de stamina da arena a cada 5s (internamente verifica 10s)
            setInterval(tickArenaStamina, 5000);

            // Iniciar loop rápido de progresso das barras
            startUIProgressLoop();
        }

        function startUIProgressLoop() {
            if (uiProgressInterval) clearInterval(uiProgressInterval);
            uiProgressInterval = setInterval(updateAllProgressBars, 50);
        }

        function updateAllProgressBars() {
            // Modo debug / telemetria
            if (typeof devTickCount !== 'undefined') {
                devTickCount++;
                const now = performance.now();
                if (now - devLastTickTime >= 1000) {
                    devFps = Math.round((devTickCount * 1000) / (now - devLastTickTime));
                    devTickCount = 0;
                    devLastTickTime = now;
                    if (typeof updateDevTelemetry === 'function') {
                        updateDevTelemetry();
                    }
                }
            }

            if (!gameState || !gameState.craftingTimers) return;
            for (let timerId in gameState.craftingTimers) {
                const timer = gameState.craftingTimers[timerId];
                if (!timer) continue;
                
                const elapsed = Date.now() - timer.startTime;
                const totalMs = timer.craftTime * 1000;
                const percent = Math.min((elapsed / totalMs) * 100, 100);
                
                const barId = `progress_${timer.skill}_${timer.recipe.id}`;
                const barEl = document.getElementById(barId);
                if (barEl) {
                    barEl.style.width = percent + '%';
                }
            }
        }

        // ============================================
        // FUNÇÃO CENTRAL DE XP (movida de gathering.js)
        // ============================================
        function addXP(skill, amount) {
            const equipXP  = getEquipmentBonuses().xpBonus || 0;
            const classXPA = getClassPassive('xpBoost_all');
            const classXPC = (skill === 'smithing' || skill === 'crafting' || skill === 'cooking' || skill === 'enchanting')
                             ? getClassPassive('xpBoost_craft') : 0;
            const classXPF = (skill === 'fishing') ? getClassPassive('xpBoost_fishing') : 0;
            const classXPHAC = (skill === 'herbalism' || skill === 'cooking' || skill === 'alchemy')
                             ? getClassPassive('xpBoost_herbs_alchemy_cooking') : 0;
            const achXPA   = getAchievementBonus('xpBoost_all');
            const achXPC   = (skill === 'smithing' || skill === 'crafting' || skill === 'cooking' || skill === 'enchanting') ? getAchievementBonus('xpBoost_craft') : 0;
            const achXPG   = (skill === 'woodcutting' || skill === 'mining' || skill === 'fishing' || skill === 'herbalism') ? getAchievementBonus('xpBoost_gather') : 0;
            const meistreXP = applyPotionEffects('xpBoost_all_pot') || 0;
            
            // Novas passivas de classes textuais: Sage (+20% XP all)
            const sageBonus = getCharacterClassPassive('xpBoost_all');
            
            const xpMult = 1 + (equipXP + classXPA + classXPC + classXPF + classXPHAC + achXPA + achXPC + achXPG + meistreXP + sageBonus) / 100;
            const skillData = gameState.skills[skill];
            
            let finalXP = Math.floor(amount * xpMult);
            
            // World Boss Buff (Bênção do Titã)
            if (window.getWorldBossBuffBonus) {
                finalXP = Math.floor(finalXP * (1 + window.getWorldBossBuffBonus()));
            }
            
            // Aprendiz: Dobra o XP ganho em skills nível < 30
            const apprenticeBonus = getCharacterClassPassive('lowLevelXPDouble');
            if (apprenticeBonus > 0 && skillData.level < 30) {
                finalXP *= 2;
            }
            
            skillData.xp += finalXP;
            
            // Pets 2.0: pet ativo ganha XP com as ações do jogador
            if (gameState.pets.active) {
                const petXPGain = Math.max(1, Math.floor(amount / 5));
                addPetXP(gameState.pets.active, petXPGain);
            }

            while (skillData.xp >= xpRequired[skillData.level] && skillData.level < 500) {
                skillData.xp -= xpRequired[skillData.level];
                skillData.level++;
                showNotification('🎉 Subiu de nível!', `${skill} nível ${skillData.level}!`, 'success');
                if (skill === 'fishing' && skillData.level % 5 === 0) { gameState.combat.maxPlayerHealth += 10; gameState.combat.playerHealth = gameState.combat.maxPlayerHealth; }
                if (skill === 'mining' && skillData.level % 5 === 0) { gameState.combat.playerStrength += 2; }
                // Efeito visual de level up
                if (typeof triggerLevelUpEffect === 'function') {
                    triggerLevelUpEffect(document.querySelector('.skill-detail'));
                }
                checkAchievements();
            }
        }

        // ============================================
        // SISTEMA DE PERSONALIZAÇÃO DE TEMA (CORES E FONTES)
        // ============================================
        function applyCustomTheme() {
            const colors = gameState.customThemeColors;
            const props = ['--bg-gradient', '--card-bg', '--sidebar-bg', '--accent-color', '--primary-color', '--text-color-main'];
            
            // Referências aos elementos de layout
            const gameContainer = document.querySelector('.game-container');
            const sidebar = document.querySelector('.sidebar');
            const contentArea = document.querySelector('.content-area');
            
            if (!colors) {
                props.forEach(p => document.body.style.removeProperty(p));
                // Também limpar estilos inline dos elementos de layout
                if (gameContainer) gameContainer.style.removeProperty('background');
                if (sidebar) sidebar.style.removeProperty('background');
                if (contentArea) contentArea.style.removeProperty('background');
                
                const font = gameState.customFont || 'default';
                let fontStack = "'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                if (font === 'retro') {
                    fontStack = "'Courier New', Courier, monospace";
                } else if (font === 'medieval') {
                    fontStack = "'Cinzel', 'Georgia', serif";
                }
                document.documentElement.style.setProperty('--font-family-main', fontStack);
                return;
            }
            
            const color1 = colors.bgPrimary || '#101a24';
            const color2 = colors.bgPrimary2 || '#050a0f';
            document.body.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);
            
            if (colors.bgSecondary) {
                document.body.style.setProperty('--card-bg', `${colors.bgSecondary}cc`);
                document.body.style.setProperty('--sidebar-bg', colors.bgSecondary);
            }
            if (colors.accentColor) {
                document.body.style.setProperty('--accent-color', colors.accentColor);
                document.body.style.setProperty('--primary-color', colors.accentColor);
            }
            if (colors.textColor) {
                document.body.style.setProperty('--text-color-main', colors.textColor);
            }
            
            // Aplicar cores diretamente nos elementos de layout (inline style para máxima especificidade)
            if (gameContainer) {
                if (colors.gameContainerBg) {
                    gameContainer.style.setProperty('background', colors.gameContainerBg, 'important');
                } else {
                    gameContainer.style.removeProperty('background');
                }
            }
            if (sidebar) {
                if (colors.sidebarBg) {
                    sidebar.style.setProperty('background', colors.sidebarBg, 'important');
                } else {
                    sidebar.style.removeProperty('background');
                }
            }
            if (contentArea) {
                if (colors.contentAreaBg) {
                    contentArea.style.setProperty('background', colors.contentAreaBg, 'important');
                } else {
                    contentArea.style.removeProperty('background');
                }
            }
            
            const font = gameState.customFont || 'default';
            let fontStack = "'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
            if (font === 'retro') {
                fontStack = "'Courier New', Courier, monospace";
            } else if (font === 'medieval') {
                fontStack = "'Cinzel', 'Georgia', serif";
            }
            document.documentElement.style.setProperty('--font-family-main', fontStack);
        }

        function previewThemeColor(key, value) {
            if (!tempThemeColors) {
                if (gameState.customThemeColors) {
                    tempThemeColors = { ...gameState.customThemeColors };
                } else {
                    const theme = gameState.selectedTheme || gameState.player?.classId || 'default';
                    const defaults = {
                        guardiao_norte: { bgPrimary: '#0f1c2a', bgPrimary2: '#050b10', bgSecondary: '#142337', accentColor: '#5da4ff', textColor: '#e0e6ed' },
                        leao_ouro:      { bgPrimary: '#181205', bgPrimary2: '#080501', bgSecondary: '#20190c', accentColor: '#ffd700', textColor: '#e0e6ed' },
                        senhor_fogo:    { bgPrimary: '#1f0a0a', bgPrimary2: '#080202', bgSecondary: '#250f0f', accentColor: '#ff3333', textColor: '#e0e6ed' },
                        mar_negro:      { bgPrimary: '#05141a', bgPrimary2: '#010508', bgSecondary: '#0a232d', accentColor: '#00ffd2', textColor: '#e0e6ed' },
                        jardim_eterno:  { bgPrimary: '#051805', bgPrimary2: '#010801', bgSecondary: '#0c260c', accentColor: '#4aff4a', textColor: '#e0e6ed' },
                        ultima_guarda:  { bgPrimary: '#1a160d', bgPrimary2: '#0a0905', bgSecondary: '#262013', accentColor: '#d4a373', textColor: '#e0e6ed' },
                        default:        { bgPrimary: '#101a24', bgPrimary2: '#050a0f', bgSecondary: '#1a2a3a', accentColor: '#ff9944', textColor: '#e0e6ed' }
                    };
                    tempThemeColors = { ...(defaults[theme] || defaults['default']) };
                }
            }
            if (!gameState.customThemeColors) {
                gameState.customThemeColors = { ...tempThemeColors };
            }
            gameState.customThemeColors[key] = value;
            applyCustomTheme();
        }

        function previewThemeFont(value) {
            if (!tempFont) {
                tempFont = gameState.customFont || 'default';
            }
            gameState.customFont = value;
            applyCustomTheme();
        }

        function saveCustomTheme() {
            tempThemeColors = null;
            tempFont = null;
            saveGame();
            showNotification('🎨 Paleta Salva!', 'Suas configurações visuais personalizadas foram salvas!', 'success', '🎨');
        }

        function restoreThemeBackup() {
            if (tempThemeColors) {
                gameState.customThemeColors = { ...tempThemeColors };
                tempThemeColors = null;
            }
            if (tempFont) {
                gameState.customFont = tempFont;
                tempFont = null;
            }
            applyCustomTheme();
            updateColorPickerInputs();
        }

        function selectThemePreset(presetId) {
            if (!tempThemeColors) {
                if (gameState.customThemeColors) {
                    tempThemeColors = { ...gameState.customThemeColors };
                } else {
                    const theme = gameState.selectedTheme || gameState.player?.classId || 'default';
                    const defaults = {
                        guardiao_norte: { bgPrimary: '#0f1c2a', bgPrimary2: '#050b10', bgSecondary: '#142337', accentColor: '#5da4ff', textColor: '#e0e6ed' },
                        leao_ouro:      { bgPrimary: '#181205', bgPrimary2: '#080501', bgSecondary: '#20190c', accentColor: '#ffd700', textColor: '#e0e6ed' },
                        senhor_fogo:    { bgPrimary: '#1f0a0a', bgPrimary2: '#080202', bgSecondary: '#250f0f', accentColor: '#ff3333', textColor: '#e0e6ed' },
                        mar_negro:      { bgPrimary: '#05141a', bgPrimary2: '#010508', bgSecondary: '#0a232d', accentColor: '#00ffd2', textColor: '#e0e6ed' },
                        jardim_eterno:  { bgPrimary: '#051805', bgPrimary2: '#010801', bgSecondary: '#0c260c', accentColor: '#4aff4a', textColor: '#e0e6ed' },
                        ultima_guarda:  { bgPrimary: '#1a160d', bgPrimary2: '#0a0905', bgSecondary: '#262013', accentColor: '#d4a373', textColor: '#e0e6ed' },
                        default:        { bgPrimary: '#101a24', bgPrimary2: '#050a0f', bgSecondary: '#1a2a3a', accentColor: '#ff9944', textColor: '#e0e6ed' }
                    };
                    tempThemeColors = { ...(defaults[theme] || defaults['default']) };
                }
            }
            if (!tempFont) {
                tempFont = gameState.customFont || 'default';
            }
            
            const presets = {
                cyberpunk: { bgPrimary: '#08010f', bgPrimary2: '#020005', bgSecondary: '#120224', accentColor: '#ff00ff', textColor: '#00ffff' },
                forest: { bgPrimary: '#051405', bgPrimary2: '#010501', bgSecondary: '#0a240c', accentColor: '#4aff4a', textColor: '#ffd700' },
                void: { bgPrimary: '#03050a', bgPrimary2: '#010204', bgSecondary: '#0b101a', accentColor: '#c96ac9', textColor: '#4a9aff' },
                volcanic: { bgPrimary: '#140303', bgPrimary2: '#050101', bgSecondary: '#240808', accentColor: '#ff4444', textColor: '#ff9944' }
            };
            
            const p = presets[presetId];
            if (p) {
                gameState.customThemeColors = { ...p };
                applyCustomTheme();
                updateColorPickerInputs();
            }
        }

        function updateColorPickerInputs() {
            let colors = gameState.customThemeColors;
            if (!colors) {
                const theme = gameState.selectedTheme || gameState.player?.classId || 'default';
                const defaults = {
                    guardiao_norte: { bgPrimary: '#0f1c2a', bgPrimary2: '#050b10', bgSecondary: '#142337', accentColor: '#5da4ff', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    leao_ouro:      { bgPrimary: '#181205', bgPrimary2: '#080501', bgSecondary: '#20190c', accentColor: '#ffd700', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    senhor_fogo:    { bgPrimary: '#1f0a0a', bgPrimary2: '#080202', bgSecondary: '#250f0f', accentColor: '#ff3333', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    mar_negro:      { bgPrimary: '#05141a', bgPrimary2: '#010508', bgSecondary: '#0a232d', accentColor: '#00ffd2', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    jardim_eterno:  { bgPrimary: '#051805', bgPrimary2: '#010801', bgSecondary: '#0c260c', accentColor: '#4aff4a', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    ultima_guarda:  { bgPrimary: '#1a160d', bgPrimary2: '#0a0905', bgSecondary: '#262013', accentColor: '#d4a373', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null },
                    default:        { bgPrimary: '#101a24', bgPrimary2: '#050a0f', bgSecondary: '#1a2a3a', accentColor: '#ff9944', textColor: '#e0e6ed', gameContainerBg: null, sidebarBg: null, contentAreaBg: null }
                };
                colors = defaults[theme] || defaults['default'];
            }
            
            const bgPicker = document.getElementById('themeBgPicker');
            const bgPicker2 = document.getElementById('themeBgPicker2');
            const containerPicker = document.getElementById('themeContainerPicker');
            const sidebarPicker = document.getElementById('themeSidebarPicker');
            const contentAreaPicker = document.getElementById('themeContentAreaPicker');
            const cardPicker = document.getElementById('themeCardPicker');
            const accentPicker = document.getElementById('themeAccentPicker');
            const textPicker = document.getElementById('themeTextPicker');
            const fontSelect = document.getElementById('themeFontSelect');
            
            if (bgPicker) bgPicker.value = colors.bgPrimary || '#101a24';
            if (bgPicker2) bgPicker2.value = colors.bgPrimary2 || '#050a0f';
            if (containerPicker) containerPicker.value = colors.gameContainerBg || '#101a24';
            if (sidebarPicker) sidebarPicker.value = colors.sidebarBg || '#1a2a3a';
            if (contentAreaPicker) contentAreaPicker.value = colors.contentAreaBg || '#0d1a27';
            if (cardPicker) cardPicker.value = colors.bgSecondary || '#1a2a3a';
            if (accentPicker) accentPicker.value = colors.accentColor || '#ff9944';
            if (textPicker) textPicker.value = colors.textColor || '#e0e6ed';
            if (fontSelect) fontSelect.value = gameState.customFont || 'default';
        }

        window.onload = function () {
            // Inicializar gameState.player se não existir
            if (!gameState.player) gameState.player = null;
            menuInit();
            // Não inicia o jogo direto — espera o menu

            // Carrega configurações de balanceamento salvas localmente
            const savedConfig = localStorage.getItem('balancingConfig');
            if (savedConfig) {
                try {
                    const parsed = JSON.parse(savedConfig);
                    applyBalancingConfig(parsed);
                } catch (e) {
                    console.error("Erro ao carregar balancingConfig local:", e);
                }
            }

            // Inicia escuta em tempo real do Firebase Firestore
            if (window.FirebaseService && typeof window.FirebaseService.listenToBalancingConfig === 'function') {
                window.FirebaseService.listenToBalancingConfig((cloudConfig) => {
                    if (cloudConfig) {
                        applyBalancingConfig(cloudConfig);
                        showNotification('☁️ Sincronizado!', 'Configurações de balanceamento atualizadas ao vivo!', 'info');
                        // Se o admin estiver com a sessão ativa, atualiza os inputs na tela
                        if (sessionStorage.getItem('isAdmin') === 'true') {
                            fillAdminInputsFromCurrentConfig();
                        }
                    }
                });
            }

            // Verifica sessão admin existente
            checkAdminSession();
        };

        window.onbeforeunload = () => {
            if (gameState.player) {
                gameState.lastSave = Date.now();
                localStorage.setItem('idleCraftSave', JSON.stringify(gameState));
            }
        };

        // =========================================================================
        // SISTEMA DE ADMINISTRAÇÃO & BALANCEAMENTO DINÂMICO
        // =========================================================================

        window.balancingConfig = {
            xpBase: 100,
            xpMult: 1.14,
            timeMultiplier: 1.0,
            xpMultiplier: 1.0,
            sellMultiplier: 1.0,
            // 1. Arena & Combate
            arenaWaveScaling: 1.0,
            arenaGoldMult: 1.0,
            arenaCoinMult: 1.0,
            arenaEquipDropRate: 15,
            elementalWeaknessBonus: 20,
            // 2. Alquimia & Poções
            alchemyTimeMult: 1.0,
            alchemyEffectMult: 1.0,
            alchemyDurationMult: 1.0,
            alchemyCostMult: 1.0,
            // 3. Acampamento & Produção Passiva
            campProdMult: 1.0,
            campUpgradeCostMult: 1.0,
            campMaxOfflineHours: 8,
            structureCosts: {
                workerCamp: [250, 700, 1600, 4000, 10000, 25000, 60000, 150000, 350000, 800000],
                farm: [300, 800, 2000, 5000, 12000],
                sawmill: [400, 1000, 2500, 6000, 14000],
                forge: [400, 1000, 2500, 6000, 14000],
                stable: [500, 1200, 3000, 7000, 15000],
                library: [350, 900, 2200, 5500, 13000],
                tavern: [300, 750, 1800, 4500, 11000]
            },
            // 4. Encantamento, Ferraria & Refino
            refineSuccessBonus: 0,
            refineCostMult: 1.0,
            refineSafetyMode: false,
            refineRatesByLevel: {
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
            },
            // 5. Masmorras Secundárias
            dungeonTimeMult: 1.0,
            dungeonChestDropMult: 1.0,
            dungeonRewardMult: 1.0,
            // 6. Mercado & Academia
            shopPriceMult: 1.0,
            techCostMult: 1.0,
            bankUpgradeBaseCost: 200,
            strengthUpgradeBaseCost: 200,
            healthUpgradeBaseCost: 150,
            toolCosts: {
                axe: [300, 1500, 5000, 15000, 50000],
                pickaxe: [300, 1500, 5000, 15000, 50000],
                rod: [300, 1500, 5000, 15000, 50000]
            },
            // Coleta Tiers Req
            woodcuttingTiers: [1, 15, 35, 60, 85],
            miningTiers: [1, 15, 35, 60, 85],
            fishingTiers: [1, 15, 35, 60, 85],
            herbalismTiers: [1, 15, 35, 60, 85],
            // Craft Tiers Req
            cookingTiers: [1, 15, 35, 60, 85],
            craftingTiers: [1, 20, 40, 65, 90],
            smithingTiers: [1, 15, 35, 60, 85],
            enchantingTiers: [5, 25, 50, 75, 95],
            // Default XP gains per tier
            woodcuttingXp: [10, 30, 80, 180, 400],
            miningXp: [12, 35, 90, 200, 450],
            fishingXp: [15, 40, 100, 220, 500],
            herbalismXp: [10, 30, 80, 180, 400],
            cookingXp: [25, 75, 180, 400, 900],
            craftingXp: [20, 60, 150, 350, 800],
            smithingXp: [30, 90, 220, 500, 1100],
            enchantingXp: [40, 120, 300, 700, 1500],
            // Default price/gold values
            woodcuttingGold: [5, 15, 40, 90, 200],
            miningGold: [6, 18, 45, 100, 220],
            fishingGold: [8, 22, 50, 110, 250],
            herbalismGold: [5, 15, 40, 90, 200],
            cookingGold: [15, 45, 110, 250, 550],
            craftingGold: [12, 35, 90, 200, 450],
            smithingGold: [20, 60, 140, 300, 650],
            enchantingGold: [25, 75, 180, 400, 900],
            // Dungeons
            dungeons: {
                caverna: 10,
                mina: 50,
                floresta: 120,
                castelo: 250,
                vulcao: 450
            },
            // Pets
            pets: {
                woodpecker: 10,
                lava_salamander: 15,
                golden_fish: 20,
                battle_wolf: 20,
                crystal_dragon: 15,
                cobra_peconhenta: 20,
                war_elephant: 20,
                pinguim_glacial: 50,
                crocodilo_casca_grossa: 15,
                porco_capitalista: 40,
                abelha_rainha: 10,
                pombo_correio: 1,
                gato_preto: 10,
                pavao_exibido: 15,
                dragaozinho: 20
            }
        };

        function rebuildXpCurve() {
            if (typeof xpRequired !== 'undefined') {
                xpRequired.length = 0;
                xpRequired.push(0);
                for (let i = 1; i <= 500; i++) {
                    xpRequired.push(Math.floor(xpBase * Math.pow(xpMult, i - 1)));
                }
            }
        }

        window.changeAdminSkillTab = function() {
            const selected = document.getElementById('admSkillSelect').value;
            document.querySelectorAll('.adm-skill-pane').forEach(el => {
                el.style.display = el.id === 'pane_' + selected ? 'block' : 'none';
            });
        };

        window.changeAdminCampStructureTab = function() {
            const sel = document.getElementById('admCampStructureSelect');
            if (!sel) return;
            const val = sel.value;
            const structs = ['workerCamp', 'farm', 'sawmill', 'forge', 'stable', 'library', 'tavern'];
            structs.forEach(s => {
                const div = document.getElementById('admCampStructBlock_' + s);
                if (div) div.style.display = (s === val) ? 'block' : 'none';
            });
        };

        window.switchAdminTab = function(tabId, btn) {
            document.querySelectorAll('.adm-section-tab').forEach(el => {
                el.style.display = 'none';
            });
            const target = document.getElementById('admTab_' + tabId);
            if (target) target.style.display = 'block';

            document.querySelectorAll('.adm-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        };

        function applyBalancingConfig(config) {
            if (!config) return;
            window.balancingConfig = config;
            
            // 1. XP Curve
            if (config.xpBase !== undefined) xpBase = config.xpBase;
            if (config.xpMult !== undefined) xpMult = config.xpMult;
            rebuildXpCurve();

            // 2. Coleta Requirements, XP e Ouro
            if (typeof resources !== 'undefined') {
                const skills = ['woodcutting', 'mining', 'fishing', 'herbalism'];
                skills.forEach(s => {
                    const keyTiers = s === 'herbalism' ? 'herbalismTiers' : s + 'Tiers';
                    const keyXp = s === 'herbalism' ? 'herbalismXp' : s + 'Xp';
                    const keyGold = s === 'herbalism' ? 'herbalismGold' : s + 'Gold';

                    const listTiers = config[keyTiers];
                    const listXp = config[keyXp];
                    const listGold = config[keyGold];

                    resources[s].forEach((r, idx) => {
                        if (idx < 5) {
                            if (listTiers && listTiers[idx] !== undefined) r.levelReq = listTiers[idx];
                            if (listXp && listXp[idx] !== undefined) r.xpGain = listXp[idx];
                            if (listGold && listGold[idx] !== undefined) r.price = listGold[idx];
                        }
                    });
                });
            }

            // 3. Craft Requirements, XP e Ouro/Preço
            if (typeof cookingRecipes !== 'undefined') {
                cookingRecipes.forEach((r, idx) => {
                    if (idx < 5) {
                        if (config.cookingTiers && config.cookingTiers[idx] !== undefined) r.levelReq = config.cookingTiers[idx];
                        if (config.cookingXp && config.cookingXp[idx] !== undefined) r.xpGain = config.cookingXp[idx];
                        if (config.cookingGold && config.cookingGold[idx] !== undefined) r.price = config.cookingGold[idx];
                    }
                });
            }
            if (typeof craftingRecipes !== 'undefined') {
                craftingRecipes.forEach((r, idx) => {
                    if (idx < 5) {
                        if (config.craftingTiers && config.craftingTiers[idx] !== undefined) r.levelReq = config.craftingTiers[idx];
                        if (config.craftingXp && config.craftingXp[idx] !== undefined) r.xpGain = config.craftingXp[idx];
                        if (config.craftingGold && config.craftingGold[idx] !== undefined) r.price = config.craftingGold[idx];
                    }
                });
            }
            if (typeof smithingRecipes !== 'undefined') {
                smithingRecipes.forEach((r) => {
                    let tierIdx = -1;
                    if (r.id === 'bar1') tierIdx = 0;
                    else if (r.id === 'bar2') tierIdx = 1;
                    else if (r.id === 'bar3') tierIdx = 2;
                    else if (r.id === 'bar4') tierIdx = 3;
                    else if (r.id === 'bar5') tierIdx = 4;
                    
                    if (tierIdx !== -1) {
                        if (config.smithingTiers && config.smithingTiers[tierIdx] !== undefined) r.levelReq = config.smithingTiers[tierIdx];
                        if (config.smithingXp && config.smithingXp[tierIdx] !== undefined) r.xpGain = config.smithingXp[tierIdx];
                        if (config.smithingGold && config.smithingGold[tierIdx] !== undefined) r.price = config.smithingGold[tierIdx];
                    }
                });
            }
            if (typeof enchantingRecipes !== 'undefined') {
                enchantingRecipes.forEach((r) => {
                    let tierIdx = -1;
                    if (r.id.includes('fire')) tierIdx = 0;
                    else if (r.id.includes('ice')) tierIdx = 1;
                    else if (r.id.includes('lightning')) tierIdx = 2;
                    else if (r.id.includes('nature')) tierIdx = 3;
                    else if (r.id.includes('holy') || r.id.includes('dark') || r.id.includes('blacksmith')) {
                        tierIdx = 4;
                    }
                    
                    if (tierIdx !== -1) {
                        if (config.enchantingTiers && config.enchantingTiers[tierIdx] !== undefined) r.levelReq = config.enchantingTiers[tierIdx];
                        if (config.enchantingXp && config.enchantingXp[tierIdx] !== undefined) r.xpGain = config.enchantingXp[tierIdx];
                        if (config.enchantingGold && config.enchantingGold[tierIdx] !== undefined) r.price = config.enchantingGold[tierIdx];
                    }
                });
            }

            // 4. Dungeon Levels
            if (typeof dungeonsData !== 'undefined' && config.dungeons) {
                dungeonsData.forEach(d => {
                    if (config.dungeons[d.id] !== undefined) {
                        d.reqLevel = config.dungeons[d.id];
                    }
                });
            }

            // 5. Pets Base Buffs (15 Mascotes)
            if (typeof pets !== 'undefined' && config.pets) {
                pets.forEach(p => {
                    if (config.pets[p.id] !== undefined) {
                        p.effectValue = config.pets[p.id];
                        // Atualizar descrições baseadas nos novos valores
                        if (p.id === 'woodpecker') {
                            p.description = `Um pássaro amigo que concede +${config.pets[p.id]}% XP no Corte de Lenha`;
                        } else if (p.id === 'lava_salamander') {
                            p.description = `Criatura que concede +${config.pets[p.id]}% de chance de mineração dupla`;
                        } else if (p.id === 'golden_fish') {
                            p.description = `Peixe místico que atrai peixes raros (base +${config.pets[p.id]}%)`;
                        } else if (p.id === 'battle_wolf') {
                            p.description = `Companheiro que concede +${config.pets[p.id]}% de dano na Arena`;
                        } else if (p.id === 'crystal_dragon') {
                            p.description = `Dragão lendário que concede +${config.pets[p.id]}% de XP Global`;
                        } else if (p.id === 'cobra_peconhenta') {
                            p.description = `Cobra que tem ${config.pets[p.id]}% chance de envenenar inimigos na Arena`;
                        } else if (p.id === 'war_elephant') {
                            p.description = `Aumenta Vida Máxima em +${config.pets[p.id]}% e Defesa Base em +${Math.floor(config.pets[p.id] * 0.75)}%`;
                        } else if (p.id === 'pinguim_glacial') {
                            p.description = `Ataca a cada 4 turnos com ${config.pets[p.id]}% de chance de congelar o inimigo`;
                        } else if (p.id === 'crocodilo_casca_grossa') {
                            p.description = `Reflete ${config.pets[p.id]}% de todo o dano físico recebido na Arena`;
                        } else if (p.id === 'porco_capitalista') {
                            p.description = `Multiplica todo o ouro ganho na Arena em +${config.pets[p.id]}%`;
                        } else if (p.id === 'abelha_rainha') {
                            p.description = `Aumenta a velocidade dos trabalhadores passivos em +${config.pets[p.id]}%`;
                        } else if (p.id === 'pombo_correio') {
                            p.description = `Traz pacotes misteriosos a cada 10 minutos (multiplicador de loot: x${config.pets[p.id]})`;
                        } else if (p.id === 'gato_preto') {
                            p.description = `Aumenta Chance de Crítico em +${config.pets[p.id]}% e Dano do Crítico em +${Math.floor(config.pets[p.id] * 2.5)}%`;
                        } else if (p.id === 'pavao_exibido') {
                            p.description = `Reduz a precisão (chance de acerto) dos inimigos na Arena em ${config.pets[p.id]}%`;
                        } else if (p.id === 'dragaozinho') {
                            p.description = `Causa queimaduras na Arena e reduz tempo de fundição em ${config.pets[p.id]}%`;
                        }
                    }
                });
            }
            
            // Forçar atualização da interface se o jogo já estiver ativo
            if (typeof updateUI === 'function') {
                updateUI();
            }
        }

        function submitAdminLogin() {
            const user = document.getElementById('adminUsername').value;
            const pass = document.getElementById('adminPassword').value;
            if (user === 'nfoggames' && pass === 'Senha1Senha@') {
                sessionStorage.setItem('isAdmin', 'true');
                showNotification('🔓 Acesso Concedido!', 'Painel administrativo liberado.', 'success');
                document.getElementById('adminLoginModal').style.display = 'none';
                checkAdminSession();
                
                // Limpar campos
                document.getElementById('adminUsername').value = '';
                document.getElementById('adminPassword').value = '';
            } else {
                showNotification('❌ Erro de Login', 'Usuário ou senha incorretos.', 'error');
            }
        }

        function checkAdminSession() {
            if (sessionStorage.getItem('isAdmin') === 'true') {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'block';
                });
                fillAdminInputsFromCurrentConfig();
            }
        }

        function fillAdminInputsFromCurrentConfig() {
            const config = window.balancingConfig;
            if (!config) return;
            
            const xpBaseInput = document.getElementById('admXpBase');
            const xpMultInput = document.getElementById('admXpMult');
            const timeMultInput = document.getElementById('admTimeMultiplier');
            const xpMultiplierInput = document.getElementById('admXpMultiplier');
            const sellMultiplierInput = document.getElementById('admSellMultiplier');
            
            if (xpBaseInput) xpBaseInput.value = config.xpBase;
            if (xpMultInput) xpMultInput.value = config.xpMult;
            if (timeMultInput) timeMultInput.value = config.timeMultiplier || 1.0;
            if (xpMultiplierInput) xpMultiplierInput.value = config.xpMultiplier || 1.0;
            if (sellMultiplierInput) sellMultiplierInput.value = config.sellMultiplier || 1.0;
            
            // Novas variáveis - 1. Arena & Combate
            const arenaScaling = document.getElementById('admArenaWaveScaling');
            const arenaGold = document.getElementById('admArenaGoldMult');
            const arenaCoin = document.getElementById('admArenaCoinMult');
            const arenaEquip = document.getElementById('admArenaEquipDropRate');
            const elemBonus = document.getElementById('admElementalWeaknessBonus');

            if (arenaScaling) arenaScaling.value = config.arenaWaveScaling || 1.0;
            if (arenaGold) arenaGold.value = config.arenaGoldMult || 1.0;
            if (arenaCoin) arenaCoin.value = config.arenaCoinMult || 1.0;
            if (arenaEquip) arenaEquip.value = config.arenaEquipDropRate || 15;
            if (elemBonus) elemBonus.value = config.elementalWeaknessBonus || 20;

            // 2. Alquimia & Poções
            const alchTime = document.getElementById('admAlchemyTimeMult');
            const alchEff = document.getElementById('admAlchemyEffectMult');
            const alchDur = document.getElementById('admAlchemyDurationMult');
            const alchCost = document.getElementById('admAlchemyCostMult');

            if (alchTime) alchTime.value = config.alchemyTimeMult || 1.0;
            if (alchEff) alchEff.value = config.alchemyEffectMult || 1.0;
            if (alchDur) alchDur.value = config.alchemyDurationMult || 1.0;
            if (alchCost) alchCost.value = config.alchemyCostMult || 1.0;

            // 3. Acampamento & Produção Passiva
            const campProd = document.getElementById('admCampProdMult');
            const campCost = document.getElementById('admCampUpgradeCostMult');
            const campOff = document.getElementById('admCampMaxOfflineHours');

            if (campProd) campProd.value = config.campProdMult || 1.0;
            if (campCost) campCost.value = config.campUpgradeCostMult || 1.0;
            if (campOff) campOff.value = config.campMaxOfflineHours || 8;

            const structDefaults = {
                workerCamp: [250, 700, 1600, 4000, 10000, 25000, 60000, 150000, 350000, 800000],
                farm: [300, 800, 2000, 5000, 12000],
                sawmill: [400, 1000, 2500, 6000, 14000],
                forge: [400, 1000, 2500, 6000, 14000],
                stable: [500, 1200, 3000, 7000, 15000],
                library: [350, 900, 2200, 5500, 13000],
                tavern: [300, 750, 1800, 4500, 11000]
            };
            const structCosts = config.structureCosts || structDefaults;
            ['workerCamp', 'farm', 'sawmill', 'forge', 'stable', 'library', 'tavern'].forEach(sKey => {
                const defaults = structDefaults[sKey] || [];
                const list = structCosts[sKey] || defaults;
                const count = sKey === 'workerCamp' ? 10 : 5;
                for (let i = 0; i < count; i++) {
                    const el = document.getElementById(`admCampCost_${sKey}_${i+1}`);
                    if (el) el.value = list[i] !== undefined ? list[i] : (defaults[i] || 0);
                }
            });

            // 4. Encantamento, Ferraria & Refino
            const refBonus = document.getElementById('admRefineSuccessBonus');
            const refCost = document.getElementById('admRefineCostMult');
            const refSafe = document.getElementById('admRefineSafetyMode');

            if (refBonus) refBonus.value = config.refineSuccessBonus || 0;
            if (refCost) refCost.value = config.refineCostMult || 1.0;
            if (refSafe) refSafe.checked = !!config.refineSafetyMode;

            const defaultRefineRates = {
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
            const refineRates = config.refineRatesByLevel || defaultRefineRates;
            for (let lvl = 0; lvl <= 9; lvl++) {
                const rEl = document.getElementById(`admRefineRate_${lvl}`);
                const bEl = document.getElementById(`admRefineBreak_${lvl}`);
                const info = refineRates[lvl] || defaultRefineRates[lvl];
                if (rEl) rEl.value = info.rate !== undefined ? info.rate : defaultRefineRates[lvl].rate;
                if (bEl) bEl.value = info.breakChance !== undefined ? info.breakChance : defaultRefineRates[lvl].breakChance;
            }

            // 5. Masmorras Secundárias
            const dungTime = document.getElementById('admDungeonTimeMult');
            const dungDrop = document.getElementById('admDungeonChestDropMult');
            const dungRew = document.getElementById('admDungeonRewardMult');

            if (dungTime) dungTime.value = config.dungeonTimeMult || 1.0;
            if (dungDrop) dungDrop.value = config.dungeonChestDropMult || 1.0;
            if (dungRew) dungRew.value = config.dungeonRewardMult || 1.0;

            // 6. Mercado & Academia
            const shopPrice = document.getElementById('admShopPriceMult');
            const techCost = document.getElementById('admTechCostMult');
            const bankCost = document.getElementById('admBankUpgradeBaseCost');
            const strCost = document.getElementById('admStrengthUpgradeBaseCost');
            const hpCost = document.getElementById('admHealthUpgradeBaseCost');

            if (shopPrice) shopPrice.value = config.shopPriceMult || 1.0;
            if (techCost) techCost.value = config.techCostMult || 1.0;
            if (bankCost) bankCost.value = config.bankUpgradeBaseCost || 200;
            if (strCost) strCost.value = config.strengthUpgradeBaseCost || 200;
            if (hpCost) hpCost.value = config.healthUpgradeBaseCost || 150;

            const toolCosts = config.toolCosts || {
                axe: [300, 1500, 5000, 15000, 50000],
                pickaxe: [300, 1500, 5000, 15000, 50000],
                rod: [300, 1500, 5000, 15000, 50000]
            };
            ['axe', 'pickaxe', 'rod'].forEach(toolId => {
                const list = toolCosts[toolId] || [300, 1500, 5000, 15000, 50000];
                const prefix = toolId === 'axe' ? 'Axe' : (toolId === 'pickaxe' ? 'Pickaxe' : 'Rod');
                for (let i = 0; i < 5; i++) {
                    const el = document.getElementById(`admTool${prefix}${i+1}`);
                    if (el) el.value = list[i] !== undefined ? list[i] : [300, 1500, 5000, 15000, 50000][i];
                }
            });

            // Tiers de Coleta e Craft (Nível, XP, Ouro)
            const tierMapping = {
                woodcuttingTiers: 'Wood',
                miningTiers: 'Mine',
                fishingTiers: 'Fish',
                herbalismTiers: 'Herb',
                cookingTiers: 'Cook',
                craftingTiers: 'Craft',
                smithingTiers: 'Smith',
                enchantingTiers: 'Ench'
            };
            Object.keys(tierMapping).forEach(key => {
                const c = tierMapping[key];
                const list = config[key];
                if (list && list.length === 5) {
                    for (let i = 0; i < 5; i++) {
                        const input = document.getElementById(`admLvl${c}${i+1}`);
                        if (input) input.value = list[i];
                    }
                }
            });

            const xpMapping = {
                woodcuttingXp: 'Wood',
                miningXp: 'Mine',
                fishingXp: 'Fish',
                herbalismXp: 'Herb',
                cookingXp: 'Cook',
                craftingXp: 'Craft',
                smithingXp: 'Smith',
                enchantingXp: 'Ench'
            };
            Object.keys(xpMapping).forEach(key => {
                const c = xpMapping[key];
                const list = config[key];
                if (list && list.length === 5) {
                    for (let i = 0; i < 5; i++) {
                        const input = document.getElementById(`admXp${c}${i+1}`);
                        if (input) input.value = list[i];
                    }
                }
            });

            const goldMapping = {
                woodcuttingGold: 'Wood',
                miningGold: 'Mine',
                fishingGold: 'Fish',
                herbalismGold: 'Herb',
                cookingGold: 'Cook',
                craftingGold: 'Craft',
                smithingGold: 'Smith',
                enchantingGold: 'Ench'
            };
            Object.keys(goldMapping).forEach(key => {
                const c = goldMapping[key];
                const list = config[key];
                if (list && list.length === 5) {
                    for (let i = 0; i < 5; i++) {
                        const input = document.getElementById(`admGold${c}${i+1}`);
                        if (input) input.value = list[i];
                    }
                }
            });

            // Dungeons
            if (config.dungeons) {
                const keys = ['caverna', 'mina', 'floresta', 'castelo', 'vulcao'];
                keys.forEach(k => {
                    const input = document.getElementById(`admDungeon${k.charAt(0).toUpperCase() + k.slice(1)}`);
                    if (input) input.value = config.dungeons[k];
                });
            }

            // Pets (15 Mascotes)
            if (config.pets) {
                const petInputMap = {
                    woodpecker: 'admPetWoodpecker',
                    lava_salamander: 'admPetLavaSalamander',
                    golden_fish: 'admPetGoldenFish',
                    battle_wolf: 'admPetBattleWolf',
                    crystal_dragon: 'admPetCrystalDragon',
                    cobra_peconhenta: 'admPetCobra',
                    war_elephant: 'admPetWarElephant',
                    pinguim_glacial: 'admPetPinguim',
                    crocodilo_casca_grossa: 'admPetCrocodilo',
                    porco_capitalista: 'admPetPorco',
                    abelha_rainha: 'admPetAbelha',
                    pombo_correio: 'admPetPombo',
                    gato_preto: 'admPetGatoPreto',
                    pavao_exibido: 'admPetPavao',
                    dragaozinho: 'admPetDragaozinho'
                };
                for (let petId in petInputMap) {
                    const input = document.getElementById(petInputMap[petId]);
                    if (input && config.pets[petId] !== undefined) {
                        input.value = config.pets[petId];
                    }
                }
            }
        }

        async function saveAdminBalancingConfig(syncToCloud) {
            const getVal = (id, def) => {
                const el = document.getElementById(id);
                return el ? (parseFloat(el.value) || def) : def;
            };

            const config = {
                xpBase: parseInt(document.getElementById('admXpBase').value) || 100,
                xpMult: parseFloat(document.getElementById('admXpMult').value) || 1.14,
                timeMultiplier: parseFloat(document.getElementById('admTimeMultiplier').value) || 1.0,
                xpMultiplier: parseFloat(document.getElementById('admXpMultiplier').value) || 1.0,
                sellMultiplier: parseFloat(document.getElementById('admSellMultiplier').value) || 1.0,

                // 1. Arena & Combate
                arenaWaveScaling: getVal('admArenaWaveScaling', 1.0),
                arenaGoldMult: getVal('admArenaGoldMult', 1.0),
                arenaCoinMult: getVal('admArenaCoinMult', 1.0),
                arenaEquipDropRate: getVal('admArenaEquipDropRate', 15),
                elementalWeaknessBonus: getVal('admElementalWeaknessBonus', 20),

                // 2. Alquimia & Poções
                alchemyTimeMult: getVal('admAlchemyTimeMult', 1.0),
                alchemyEffectMult: getVal('admAlchemyEffectMult', 1.0),
                alchemyDurationMult: getVal('admAlchemyDurationMult', 1.0),
                alchemyCostMult: getVal('admAlchemyCostMult', 1.0),

                // 3. Acampamento & Produção Passiva
                campProdMult: getVal('admCampProdMult', 1.0),
                campUpgradeCostMult: getVal('admCampUpgradeCostMult', 1.0),
                campMaxOfflineHours: getVal('admCampMaxOfflineHours', 8),
                structureCosts: (() => {
                    const res = {};
                    const defaults = {
                        workerCamp: [250, 700, 1600, 4000, 10000, 25000, 60000, 150000, 350000, 800000],
                        farm: [300, 800, 2000, 5000, 12000],
                        sawmill: [400, 1000, 2500, 6000, 14000],
                        forge: [400, 1000, 2500, 6000, 14000],
                        stable: [500, 1200, 3000, 7000, 15000],
                        library: [350, 900, 2200, 5500, 13000],
                        tavern: [300, 750, 1800, 4500, 11000]
                    };
                    ['workerCamp', 'farm', 'sawmill', 'forge', 'stable', 'library', 'tavern'].forEach(sKey => {
                        const count = sKey === 'workerCamp' ? 10 : 5;
                        const arr = [];
                        for (let i = 0; i < count; i++) {
                            const el = document.getElementById(`admCampCost_${sKey}_${i+1}`);
                            arr.push(el ? getNum(el.value, defaults[sKey][i]) : defaults[sKey][i]);
                        }
                        res[sKey] = arr;
                    });
                    return res;
                })(),

                // 4. Encantamento, Ferraria & Refino
                refineSuccessBonus: getVal('admRefineSuccessBonus', 0),
                refineCostMult: getVal('admRefineCostMult', 1.0),
                refineSafetyMode: document.getElementById('admRefineSafetyMode') ? document.getElementById('admRefineSafetyMode').checked : false,
                refineRatesByLevel: (() => {
                    const defaultRefineRates = {
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
                    const res = {};
                    for (let lvl = 0; lvl <= 9; lvl++) {
                        const rEl = document.getElementById(`admRefineRate_${lvl}`);
                        const bEl = document.getElementById(`admRefineBreak_${lvl}`);
                        res[lvl] = {
                            rate: rEl ? getNum(rEl.value, defaultRefineRates[lvl].rate) : defaultRefineRates[lvl].rate,
                            breakChance: bEl ? getNum(bEl.value, defaultRefineRates[lvl].breakChance) : defaultRefineRates[lvl].breakChance
                        };
                    }
                    return res;
                })(),

                // 5. Masmorras Secundárias
                dungeonTimeMult: getVal('admDungeonTimeMult', 1.0),
                dungeonChestDropMult: getVal('admDungeonChestDropMult', 1.0),
                dungeonRewardMult: getVal('admDungeonRewardMult', 1.0),

                // 6. Mercado & Academia
                shopPriceMult: getVal('admShopPriceMult', 1.0),
                techCostMult: getVal('admTechCostMult', 1.0),
                bankUpgradeBaseCost: getVal('admBankUpgradeBaseCost', 200),
                strengthUpgradeBaseCost: getVal('admStrengthUpgradeBaseCost', 200),
                healthUpgradeBaseCost: getVal('admHealthUpgradeBaseCost', 150),
                toolCosts: {
                    axe: [
                        getVal('admToolAxe1', 300),
                        getVal('admToolAxe2', 1500),
                        getVal('admToolAxe3', 5000),
                        getVal('admToolAxe4', 15000),
                        getVal('admToolAxe5', 50000)
                    ],
                    pickaxe: [
                        getVal('admToolPickaxe1', 300),
                        getVal('admToolPickaxe2', 1500),
                        getVal('admToolPickaxe3', 5000),
                        getVal('admToolPickaxe4', 15000),
                        getVal('admToolPickaxe5', 50000)
                    ],
                    rod: [
                        getVal('admToolRod1', 300),
                        getVal('admToolRod2', 1500),
                        getVal('admToolRod3', 5000),
                        getVal('admToolRod4', 15000),
                        getVal('admToolRod5', 50000)
                    ]
                },
                
                // Coleta & Craft Tiers Req
                woodcuttingTiers: [
                    parseInt(document.getElementById('admLvlWood1').value) || 1,
                    parseInt(document.getElementById('admLvlWood2').value) || 15,
                    parseInt(document.getElementById('admLvlWood3').value) || 35,
                    parseInt(document.getElementById('admLvlWood4').value) || 60,
                    parseInt(document.getElementById('admLvlWood5').value) || 85
                ],
                miningTiers: [
                    parseInt(document.getElementById('admLvlMine1').value) || 1,
                    parseInt(document.getElementById('admLvlMine2').value) || 15,
                    parseInt(document.getElementById('admLvlMine3').value) || 35,
                    parseInt(document.getElementById('admLvlMine4').value) || 60,
                    parseInt(document.getElementById('admLvlMine5').value) || 85
                ],
                fishingTiers: [
                    parseInt(document.getElementById('admLvlFish1').value) || 1,
                    parseInt(document.getElementById('admLvlFish2').value) || 15,
                    parseInt(document.getElementById('admLvlFish3').value) || 35,
                    parseInt(document.getElementById('admLvlFish4').value) || 60,
                    parseInt(document.getElementById('admLvlFish5').value) || 85
                ],
                herbalismTiers: [
                    parseInt(document.getElementById('admLvlHerb1').value) || 1,
                    parseInt(document.getElementById('admLvlHerb2').value) || 15,
                    parseInt(document.getElementById('admLvlHerb3').value) || 35,
                    parseInt(document.getElementById('admLvlHerb4').value) || 60,
                    parseInt(document.getElementById('admLvlHerb5').value) || 85
                ],
                cookingTiers: [
                    parseInt(document.getElementById('admLvlCook1').value) || 1,
                    parseInt(document.getElementById('admLvlCook2').value) || 15,
                    parseInt(document.getElementById('admLvlCook3').value) || 35,
                    parseInt(document.getElementById('admLvlCook4').value) || 60,
                    parseInt(document.getElementById('admLvlCook5').value) || 85
                ],
                craftingTiers: [
                    parseInt(document.getElementById('admLvlCraft1').value) || 1,
                    parseInt(document.getElementById('admLvlCraft2').value) || 20,
                    parseInt(document.getElementById('admLvlCraft3').value) || 40,
                    parseInt(document.getElementById('admLvlCraft4').value) || 65,
                    parseInt(document.getElementById('admLvlCraft5').value) || 90
                ],
                smithingTiers: [
                    parseInt(document.getElementById('admLvlSmith1').value) || 1,
                    parseInt(document.getElementById('admLvlSmith2').value) || 15,
                    parseInt(document.getElementById('admLvlSmith3').value) || 35,
                    parseInt(document.getElementById('admLvlSmith4').value) || 60,
                    parseInt(document.getElementById('admLvlSmith5').value) || 85
                ],
                enchantingTiers: [
                    parseInt(document.getElementById('admLvlEnch1').value) || 5,
                    parseInt(document.getElementById('admLvlEnch2').value) || 25,
                    parseInt(document.getElementById('admLvlEnch3').value) || 50,
                    parseInt(document.getElementById('admLvlEnch4').value) || 75,
                    parseInt(document.getElementById('admLvlEnch5').value) || 95
                ],

                // XP Concedido
                woodcuttingXp: [
                    parseInt(document.getElementById('admXpWood1').value) || 10,
                    parseInt(document.getElementById('admXpWood2').value) || 30,
                    parseInt(document.getElementById('admXpWood3').value) || 80,
                    parseInt(document.getElementById('admXpWood4').value) || 180,
                    parseInt(document.getElementById('admXpWood5').value) || 400
                ],
                miningXp: [
                    parseInt(document.getElementById('admXpMine1').value) || 12,
                    parseInt(document.getElementById('admXpMine2').value) || 35,
                    parseInt(document.getElementById('admXpMine3').value) || 90,
                    parseInt(document.getElementById('admXpMine4').value) || 200,
                    parseInt(document.getElementById('admXpMine5').value) || 450
                ],
                fishingXp: [
                    parseInt(document.getElementById('admXpFish1').value) || 15,
                    parseInt(document.getElementById('admXpFish2').value) || 40,
                    parseInt(document.getElementById('admXpFish3').value) || 100,
                    parseInt(document.getElementById('admXpFish4').value) || 220,
                    parseInt(document.getElementById('admXpFish5').value) || 500
                ],
                herbalismXp: [
                    parseInt(document.getElementById('admXpHerb1').value) || 10,
                    parseInt(document.getElementById('admXpHerb2').value) || 30,
                    parseInt(document.getElementById('admXpHerb3').value) || 80,
                    parseInt(document.getElementById('admXpHerb4').value) || 180,
                    parseInt(document.getElementById('admXpHerb5').value) || 400
                ],
                cookingXp: [
                    parseInt(document.getElementById('admXpCook1').value) || 25,
                    parseInt(document.getElementById('admXpCook2').value) || 75,
                    parseInt(document.getElementById('admXpCook3').value) || 180,
                    parseInt(document.getElementById('admXpCook4').value) || 400,
                    parseInt(document.getElementById('admXpCook5').value) || 900
                ],
                craftingXp: [
                    parseInt(document.getElementById('admXpCraft1').value) || 20,
                    parseInt(document.getElementById('admXpCraft2').value) || 60,
                    parseInt(document.getElementById('admXpCraft3').value) || 150,
                    parseInt(document.getElementById('admXpCraft4').value) || 350,
                    parseInt(document.getElementById('admXpCraft5').value) || 800
                ],
                smithingXp: [
                    parseInt(document.getElementById('admXpSmith1').value) || 30,
                    parseInt(document.getElementById('admXpSmith2').value) || 90,
                    parseInt(document.getElementById('admXpSmith3').value) || 220,
                    parseInt(document.getElementById('admXpSmith4').value) || 500,
                    parseInt(document.getElementById('admXpSmith5').value) || 1100
                ],
                enchantingXp: [
                    parseInt(document.getElementById('admXpEnch1').value) || 40,
                    parseInt(document.getElementById('admXpEnch2').value) || 120,
                    parseInt(document.getElementById('admXpEnch3').value) || 300,
                    parseInt(document.getElementById('admXpEnch4').value) || 700,
                    parseInt(document.getElementById('admXpEnch5').value) || 1500
                ],

                // Ouro/Preço Concedido
                woodcuttingGold: [
                    parseInt(document.getElementById('admGoldWood1').value) || 5,
                    parseInt(document.getElementById('admGoldWood2').value) || 15,
                    parseInt(document.getElementById('admGoldWood3').value) || 40,
                    parseInt(document.getElementById('admGoldWood4').value) || 90,
                    parseInt(document.getElementById('admGoldWood5').value) || 200
                ],
                miningGold: [
                    parseInt(document.getElementById('admGoldMine1').value) || 6,
                    parseInt(document.getElementById('admGoldMine2').value) || 18,
                    parseInt(document.getElementById('admGoldMine3').value) || 45,
                    parseInt(document.getElementById('admGoldMine4').value) || 100,
                    parseInt(document.getElementById('admGoldMine5').value) || 220
                ],
                fishingGold: [
                    parseInt(document.getElementById('admGoldFish1').value) || 8,
                    parseInt(document.getElementById('admGoldFish2').value) || 22,
                    parseInt(document.getElementById('admGoldFish3').value) || 50,
                    parseInt(document.getElementById('admGoldFish4').value) || 110,
                    parseInt(document.getElementById('admGoldFish5').value) || 250
                ],
                herbalismGold: [
                    parseInt(document.getElementById('admGoldHerb1').value) || 5,
                    parseInt(document.getElementById('admGoldHerb2').value) || 15,
                    parseInt(document.getElementById('admGoldHerb3').value) || 40,
                    parseInt(document.getElementById('admGoldHerb4').value) || 90,
                    parseInt(document.getElementById('admGoldHerb5').value) || 200
                ],
                cookingGold: [
                    parseInt(document.getElementById('admGoldCook1').value) || 15,
                    parseInt(document.getElementById('admGoldCook2').value) || 45,
                    parseInt(document.getElementById('admGoldCook3').value) || 110,
                    parseInt(document.getElementById('admGoldCook4').value) || 250,
                    parseInt(document.getElementById('admGoldCook5').value) || 550
                ],
                craftingGold: [
                    parseInt(document.getElementById('admGoldCraft1').value) || 12,
                    parseInt(document.getElementById('admGoldCraft2').value) || 35,
                    parseInt(document.getElementById('admGoldCraft3').value) || 90,
                    parseInt(document.getElementById('admGoldCraft4').value) || 200,
                    parseInt(document.getElementById('admGoldCraft5').value) || 450
                ],
                smithingGold: [
                    parseInt(document.getElementById('admGoldSmith1').value) || 20,
                    parseInt(document.getElementById('admGoldSmith2').value) || 60,
                    parseInt(document.getElementById('admGoldSmith3').value) || 140,
                    parseInt(document.getElementById('admGoldSmith4').value) || 300,
                    parseInt(document.getElementById('admGoldSmith5').value) || 650
                ],
                enchantingGold: [
                    parseInt(document.getElementById('admGoldEnch1').value) || 25,
                    parseInt(document.getElementById('admGoldEnch2').value) || 75,
                    parseInt(document.getElementById('admGoldEnch3').value) || 180,
                    parseInt(document.getElementById('admGoldEnch4').value) || 400,
                    parseInt(document.getElementById('admGoldEnch5').value) || 900
                ],

                // Dungeons
                dungeons: {
                    caverna: parseInt(document.getElementById('admDungeonCaverna').value) || 10,
                    mina: parseInt(document.getElementById('admDungeonMina').value) || 50,
                    floresta: parseInt(document.getElementById('admDungeonFloresta').value) || 120,
                    castelo: parseInt(document.getElementById('admDungeonCastelo').value) || 250,
                    vulcao: parseInt(document.getElementById('admDungeonVulcao').value) || 450
                },
                
                // Pets (15 Mascotes)
                pets: {
                    woodpecker: parseInt(document.getElementById('admPetWoodpecker').value) || 10,
                    lava_salamander: parseInt(document.getElementById('admPetLavaSalamander').value) || 15,
                    golden_fish: parseInt(document.getElementById('admPetGoldenFish').value) || 20,
                    battle_wolf: parseInt(document.getElementById('admPetBattleWolf').value) || 20,
                    crystal_dragon: parseInt(document.getElementById('admPetCrystalDragon').value) || 15,
                    cobra_peconhenta: parseInt(document.getElementById('admPetCobra').value) || 20,
                    war_elephant: parseInt(document.getElementById('admPetWarElephant').value) || 20,
                    pinguim_glacial: parseInt(document.getElementById('admPetPinguim').value) || 50,
                    crocodilo_casca_grossa: parseInt(document.getElementById('admPetCrocodilo').value) || 15,
                    porco_capitalista: parseInt(document.getElementById('admPetPorco').value) || 40,
                    abelha_rainha: parseInt(document.getElementById('admPetAbelha').value) || 10,
                    pombo_correio: parseInt(document.getElementById('admPetPombo').value) || 1,
                    gato_preto: parseInt(document.getElementById('admPetGatoPreto').value) || 10,
                    pavao_exibido: parseInt(document.getElementById('admPetPavao').value) || 15,
                    dragaozinho: parseInt(document.getElementById('admPetDragaozinho').value) || 20
                }
            };
            
            applyBalancingConfig(config);
            localStorage.setItem('balancingConfig', JSON.stringify(config));
            
            if (syncToCloud) {
                if (window.FirebaseService && typeof window.FirebaseService.saveBalancingConfig === 'function') {
                    const ok = await window.FirebaseService.saveBalancingConfig(config);
                    if (ok) {
                        showNotification('☁️ Nuvem Atualizada!', 'As novas regras foram publicadas globalmente.', 'success');
                    } else {
                        showNotification('❌ Erro no Firebase', 'Não foi possível salvar na nuvem.', 'error');
                    }
                } else {
                    showNotification('⚠️ Sem Conexão', 'Serviço Firebase não disponível.', 'warning');
                }
            } else {
                showNotification('💾 Salvo Localmente!', 'Regras aplicadas nesta sessão.', 'success');
            }
        }

        function resetAdminBalancingConfig() {
            const defaultConfig = {
                xpBase: 100,
                xpMult: 1.14,
                timeMultiplier: 1.0,
                xpMultiplier: 1.0,
                sellMultiplier: 1.0,
                arenaWaveScaling: 1.0,
                arenaGoldMult: 1.0,
                arenaCoinMult: 1.0,
                arenaEquipDropRate: 15,
                elementalWeaknessBonus: 20,
                alchemyTimeMult: 1.0,
                alchemyEffectMult: 1.0,
                alchemyDurationMult: 1.0,
                alchemyCostMult: 1.0,
                campProdMult: 1.0,
                campUpgradeCostMult: 1.0,
                campMaxOfflineHours: 8,
                refineSuccessBonus: 0,
                refineCostMult: 1.0,
                refineSafetyMode: false,
                dungeonTimeMult: 1.0,
                dungeonChestDropMult: 1.0,
                dungeonRewardMult: 1.0,
                shopPriceMult: 1.0,
                techCostMult: 1.0,
                woodcuttingTiers: [1, 15, 35, 60, 85],
                miningTiers: [1, 15, 35, 60, 85],
                fishingTiers: [1, 15, 35, 60, 85],
                herbalismTiers: [1, 15, 35, 60, 85],
                cookingTiers: [1, 15, 35, 60, 85],
                craftingTiers: [1, 20, 40, 65, 90],
                smithingTiers: [1, 15, 35, 60, 85],
                enchantingTiers: [5, 25, 50, 75, 95],
                woodcuttingXp: [10, 30, 80, 180, 400],
                miningXp: [12, 35, 90, 200, 450],
                fishingXp: [15, 40, 100, 220, 500],
                herbalismXp: [10, 30, 80, 180, 400],
                cookingXp: [25, 75, 180, 400, 900],
                craftingXp: [20, 60, 150, 350, 800],
                smithingXp: [30, 90, 220, 500, 1100],
                enchantingXp: [40, 120, 300, 700, 1500],
                woodcuttingGold: [5, 15, 40, 90, 200],
                miningGold: [6, 18, 45, 100, 220],
                fishingGold: [8, 22, 50, 110, 250],
                herbalismGold: [5, 15, 40, 90, 200],
                cookingGold: [15, 45, 110, 250, 550],
                craftingGold: [12, 35, 90, 200, 450],
                smithingGold: [20, 60, 140, 300, 650],
                enchantingGold: [25, 75, 180, 400, 900],
                dungeons: { caverna: 10, mina: 50, floresta: 120, castelo: 250, vulcao: 450 },
                pets: { 
                    woodpecker: 10,
                    lava_salamander: 15,
                    golden_fish: 20,
                    battle_wolf: 20,
                    crystal_dragon: 15,
                    cobra_peconhenta: 20,
                    war_elephant: 20,
                    pinguim_glacial: 50,
                    crocodilo_casca_grossa: 15,
                    porco_capitalista: 40,
                    abelha_rainha: 10,
                    pombo_correio: 1,
                    gato_preto: 10,
                    pavao_exibido: 15,
                    dragaozinho: 20
                }
            };
            applyBalancingConfig(defaultConfig);
            localStorage.setItem('balancingConfig', JSON.stringify(defaultConfig));
            fillAdminInputsFromCurrentConfig();
            showNotification('🔄 Configurações Resetadas', 'Os parâmetros padrão do jogo foram restaurados.', 'info');
        }

        // =========================================================================
        // FERRAMENTAS DE CHEAT & DEBUG PARA DESENVOLVEDOR (ADMIN TOOLS)
        // =========================================================================
        window.admInjectCurrency = function(type, amountInputId) {
            const qty = parseInt(document.getElementById(amountInputId)?.value) || 1000;
            if (type === 'gold') {
                gameState.gold = (gameState.gold || 0) + qty;
                showNotification('💰 Cheat Aplicado!', `+${qty.toLocaleString()} Ouro adicionado.`, 'success');
            } else if (type === 'arenaCoins') {
                if (!gameState.arena) gameState.arena = {};
                gameState.arena.arenaCoins = (gameState.arena.arenaCoins || 0) + qty;
                showNotification('⚔️ Cheat Aplicado!', `+${qty.toLocaleString()} Moedas da Arena adicionadas.`, 'success');
            } else if (type === 'wellPoints') {
                gameState.wishingWellPoints = (gameState.wishingWellPoints || 0) + qty;
                showNotification('🪙 Cheat Aplicado!', `+${qty.toLocaleString()} Pontos do Poço adicionados.`, 'success');
            }
            if (typeof updateUI === 'function') updateUI();
        };

        window.admInjectItem = function() {
            const itemId = document.getElementById('admCheatItemSelect')?.value || 'log1';
            const qty = parseInt(document.getElementById('admCheatItemQty')?.value) || 50;
            if (typeof addItemToInventory === 'function') {
                addItemToInventory(itemId, qty);
                showNotification('🎁 Cheat Aplicado!', `Adicionado x${qty} de ${itemId} ao inventário.`, 'success');
            } else {
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) + qty;
                showNotification('🎁 Cheat Aplicado!', `Adicionado x${qty} de ${itemId}.`, 'success');
            }
            if (typeof updateUI === 'function') updateUI();
        };

        window.admSetSkillLevel = function() {
            const skill = document.getElementById('admCheatSkillSelect')?.value || 'woodcutting';
            const targetLevel = Math.min(500, Math.max(1, parseInt(document.getElementById('admCheatSkillLevel')?.value) || 50));
            if (gameState.skills && gameState.skills[skill]) {
                gameState.skills[skill].level = targetLevel;
                if (typeof xpRequired !== 'undefined' && xpRequired[targetLevel - 1] !== undefined) {
                    gameState.skills[skill].xp = xpRequired[targetLevel - 1];
                }
                showNotification('📈 Nível Alterado!', `Habilidade ${skill} definida para o nível ${targetLevel}.`, 'success');
                if (typeof updateUI === 'function') updateUI();
            }
        };

        window.admResetPlayerSave = function() {
            if (confirm("⚠️ Tem certeza que deseja RESETAR TODO O SEU SALVAMENTO DE TESTE? Isso recarregará o jogo do zero.")) {
                localStorage.removeItem('idleCraftSave');
                location.reload();
            }
        };

        window.getWorldBossBuffBonus = function() {
            if (window.gameState && window.gameState.worldBossBuff && window.gameState.worldBossBuff.expiresAt) {
                if (Date.now() < window.gameState.worldBossBuff.expiresAt) {
                    return (window.gameState.worldBossBuff.value || 0) / 100;
                }
            }
            return 0;
        };
