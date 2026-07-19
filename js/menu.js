        // ============================================
        // ngState definido em data-profissoes.js

        // ============================================
        // LÓGICA DO MENU INICIAL
        // ============================================
        function menuInit() {
            const saved = localStorage.getItem('idleCraftSave');
            const btn = document.getElementById('menuContinueBtn');
            const info = document.getElementById('menuSaveInfo');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    const date = data.lastSave ? new Date(data.lastSave) : null;
                    const dateStr = date ? date.toLocaleString('pt-BR') : 'data desconhecida';
                    const name = data.player?.name || 'Herói';
                    const cls = gameClasses.find(c => c.id === data.player?.classId);
                    const clsName = cls ? cls.name : '';
                    btn.disabled = false;
                    info.textContent = `${name}${clsName ? ' · ' + clsName : ''} · Salvo em ${dateStr}`;
                    info.style.color = '#4a8a6a';
                } catch(e) {
                    btn.disabled = true;
                    info.textContent = 'Save corrompido';
                    info.style.color = '#ff4444';
                }
            } else {
                btn.disabled = true;
                info.textContent = 'Nenhum save encontrado';
                info.style.color = '#4a5a6a';
            }
        }

        function menuContinue() {
            const saved = localStorage.getItem('idleCraftSave');
            if (!saved) return;
            for (let i in gameState.autoIntervals) clearInterval(gameState.autoIntervals[i]);
            if (gameState.combat.combatInterval) clearInterval(gameState.combat.combatInterval);
            if (gameState.pets.autoCollectInterval) clearInterval(gameState.pets.autoCollectInterval);
            const loaded = JSON.parse(saved);

            // Capturar timestamp ANTES de sobrescrever o gameState
            const lastSaveTimestamp = loaded.lastSave || null;

            if (!loaded.equipment) loaded.equipment = { equipped: { helmet: null, amulet: null, weapon: null, armor: null, shield: null, ring: null, pants: null, boots: null }, inventory: {} };
            if (!loaded.equipment.instances) loaded.equipment.instances = {};
            if (!loaded.runes) loaded.runes = {};
            if (!loaded.pets) loaded.pets = { owned: [], active: null, autoCollectInterval: null };
            if (!loaded.pets.levels) loaded.pets.levels = {};
            if (!loaded.pets.enshrined) loaded.pets.enshrined = {};
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
            if (!loaded.player) loaded.player = { name: 'Herói', gender: 'M', avatar: '🧙‍♂️', classId: null };
            gameState = loaded;
            if (!gameState.notificationStyle) gameState.notificationStyle = 'style3';
            
            // Migrar configurações
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
            applyCustomTheme();
            hideMenuScreens();
            startPetAutoCollect();
            startWorkerCycle();
            startAutosave();
            applyClassPassives();
            updatePlayerInfoBar();
            updateUI();
            showPage(gameState.currentPage || 'property');
            showNotification('📂 Bem-vindo de volta!', `${gameState.player.name} retornou à aventura.`, 'success', gameState.player.avatar);

            // Calcular e exibir produção offline dos trabalhadores
            if (typeof applyOfflineWorkerProduction === 'function') {
                setTimeout(() => applyOfflineWorkerProduction(lastSaveTimestamp), 800);
            }

            // Calcular dano offline ao Chefe Global
            if (typeof applyOfflineWorldBossDamage === 'function') {
                setTimeout(() => applyOfflineWorldBossDamage(), 1000);
            }
        }

        function menuNewGame() {
            document.getElementById('mainMenuScreen').style.display = 'none';
            document.getElementById('newGameScreen').style.display = 'flex';
            ngBuildAvatars();
            ngBuildClasses();
            ngUpdateSummary();
        }

        function hideMenuScreens() {
            document.getElementById('mainMenuScreen').style.display = 'none';
            document.getElementById('newGameScreen').style.display = 'none';
        }

        // ============================================
        // LÓGICA DO NOVO JOGO
        // ============================================
        function ngBuildAvatars() {
            const grid = document.getElementById('ngAvatarsGrid');
            if (!grid) return;
            grid.innerHTML = '';
            const gender = ngState.gender || 'M';
            const currentFilter = ngState.selectedClassFilter || 'humans';
            
            const filtered = characterClasses.filter(c => c.raceGroup === currentFilter);
            filtered.forEach(cls => {
                const name = gender === 'N'
                    ? (cls.nameM === cls.nameF ? cls.nameM : cls.nameM + ' / ' + cls.nameF)
                    : (gender === 'M' ? cls.nameM : cls.nameF);
                const emoji = gender === 'F' ? cls.emojiF : cls.emojiM;
                
                const btn = document.createElement('button');
                btn.className = 'ng-avatar-btn custom-tooltip-trigger' + (ngState.avatar === emoji ? ' selected' : '');
                
                btn.innerHTML = `
                    <div style="font-size:1.5em; line-height:1.2;">${typeof resolveIcon === 'function' ? resolveIcon(emoji) : emoji}</div>
                    <div class="ng-avatar-label" style="font-weight:700; font-size:0.8em; margin:2px 0;">${name}</div>
                    <div style="font-size:0.6em; color:#aab; line-height:1.2; word-break:break-word; max-width:100%;">${cls.desc.split(':')[0]}</div>
                    <div class="custom-tooltip-box">
                        <strong>${name}</strong><br>
                        ${cls.desc}
                    </div>
                `;
                btn.onclick = () => ngSelectAvatar(emoji);
                grid.appendChild(btn);
            });
        }

        function ngSelectClassFilter(filterId) {
            ngState.selectedClassFilter = filterId;
            document.querySelectorAll('.ng-filter-btn').forEach(btn => {
                if (btn.id === `filter_${filterId}`) {
                    btn.style.background = 'var(--accent-color, #ff9944)';
                    btn.style.color = '#000';
                    btn.style.fontWeight = '700';
                } else {
                    btn.style.background = 'rgba(255,255,255,0.05)';
                    btn.style.color = '#ccc';
                    btn.style.fontWeight = 'normal';
                }
            });
            ngBuildAvatars();
            ngUpdateSummary();
        }

        function ngBuildClasses() {
            const grid = document.getElementById('ngClassesGrid');
            grid.innerHTML = '';
            gameClasses.forEach(cls => {
                const card = document.createElement('div');
                card.className = 'ng-class-card' + (ngState.classId === cls.id ? ' selected' : '');
                card.style.borderColor = ngState.classId === cls.id ? cls.color : '';
                const perksHtml = cls.perks.map(p => `<div class="ng-class-perk">✦ ${p.label}</div>`).join('');
                card.innerHTML = `
                    <div class="ng-class-icon">${cls.icon}</div>
                    <div class="ng-class-name" style="color:${cls.color}">${cls.name}</div>
                    <div class="ng-class-house">${cls.house}</div>
                    <div class="ng-class-desc">${cls.desc}</div>
                    <div class="ng-class-perks">${perksHtml}</div>`;
                card.onclick = () => ngSelectClass(cls.id);
                grid.appendChild(card);
            });
        }

        function ngSelectGender(g) {
            ngState.gender = g;
            ngState.avatar = null;
            document.getElementById('genderM').classList.toggle('selected', g === 'M');
            document.getElementById('genderF').classList.toggle('selected', g === 'F');
            document.getElementById('genderN').classList.toggle('selected', g === 'N');
            ngBuildAvatars();
            ngUpdateSummary();
            ngValidate();
        }

        function ngSelectAvatar(emoji) {
            ngState.avatar = emoji;
            document.querySelectorAll('.ng-avatar-btn').forEach(b => b.classList.remove('selected'));
            event.currentTarget.classList.add('selected');
            ngUpdateSummary();
            ngValidate();
        }

        function ngSelectClass(id) {
            ngState.classId = id;
            ngBuildClasses();
            ngValidate();
        }

        function ngUpdateSummary() {
            const summaryBox = document.getElementById('ngSelectionSummary');
            const raceEl = document.getElementById('ngRaceSummary');
            const avatarEl = document.getElementById('ngAvatarSummary');
            if (!summaryBox || !raceEl || !avatarEl) return;

            const filterId = ngState.selectedClassFilter || 'humans';
            const raceNames = {
                humans: '👨 Raça Humana: Focados em adaptabilidade rápida, combate tático, comércio e amplificação de XP.',
                fantastic: '🧝 Raças Fantásticas: Especialistas em agilidade física, duplicação de recursos e ampliação de defesas naturais.',
                darkness: '🌙 Criaturas das Trevas: Mestres do roubo de vida, venenos corrosivos, esquiva furtiva e mitigação de dano bruto.',
                celestials: '✨ Seres Celestiais: Focados em buffs de Arena, Toque de Midas (ouro por dano), qualidade na forja e auto-ressurreição.',
                differents: '🤖 Seres Diferentões: Especialistas em otimização de trabalhadores, extensão de poções e chances de duplicação de itens.'
            };

            raceEl.textContent = raceNames[filterId] || '';
            summaryBox.style.display = 'block';

            if (ngState.avatar) {
                const gender = ngState.gender || 'M';
                const currentAvatar = characterClasses.find(c => {
                    const emoji = gender === 'F' ? c.emojiF : c.emojiM;
                    return emoji === ngState.avatar;
                });
                if (currentAvatar) {
                    const avatarName = gender === 'N'
                        ? (currentAvatar.nameM === currentAvatar.nameF ? currentAvatar.nameM : currentAvatar.nameM + ' / ' + currentAvatar.nameF)
                        : (gender === 'M' ? currentAvatar.nameM : currentAvatar.nameF);
                    avatarEl.innerHTML = `<strong style="color: var(--accent-color, #ff9944);">${avatarName}:</strong> ${currentAvatar.desc}`;
                } else {
                    avatarEl.textContent = '';
                }
            } else {
                avatarEl.textContent = '⚠️ Escolha um Avatar abaixo para ver seus buffs específicos.';
            }
        }

        function ngValidate() {
            const name = document.getElementById('ngNameInput').value.trim();
            ngState.name = name;
            const ok = name.length >= 2 && ngState.gender && ngState.avatar && ngState.classId;
            document.getElementById('ngStartBtn').disabled = !ok;
        }

        function ngBack() {
            document.getElementById('newGameScreen').style.display = 'none';
            document.getElementById('mainMenuScreen').style.display = 'flex';
        }

        function ngStartGame() {
            if (!ngState.name || !ngState.gender || !ngState.avatar || !ngState.classId) return;

            // Limpar save antigo
            localStorage.removeItem('idleCraftSave');

            // Configurar player no gameState
            gameState.player = {
                name: ngState.name,
                gender: ngState.gender,
                avatar: ngState.avatar,
                classId: ngState.classId
            };

            // Aplicar bônus de classe
            const cls = gameClasses.find(c => c.id === ngState.classId);
            if (cls) {
                cls.perks.forEach(perk => {
                    if (perk.type === 'maxHealth')   { gameState.combat.maxPlayerHealth += perk.value; gameState.combat.playerHealth = gameState.combat.maxPlayerHealth; gameState.upgrades.healthBonus += perk.value; }
                    if (perk.type === 'startGold')   { gameState.gold += perk.value; }
                    if (perk.type === 'bankSlots')   { gameState.bankSlots += perk.value; }
                    if (perk.type === 'startWeapon') { gameState.equipment.inventory[perk.value] = (gameState.equipment.inventory[perk.value] || 0) + 1; }
                    if (perk.type === 'startShield') { gameState.equipment.inventory[perk.value] = (gameState.equipment.inventory[perk.value] || 0) + 1; }
                    if (perk.type === 'startTool')   { gameState.tools[perk.value] = 1; }
                    if (perk.type === 'startPotions') { gameState.inventory['instant_heal'] = (gameState.inventory['instant_heal'] || 0) + perk.value; }
                });
            }

            hideMenuScreens();
            startPetAutoCollect();
            startWorkerCycle();
            startAutosave();
            applyClassPassives();
            updatePlayerInfoBar();
            updateUI();
            showPage('property');
            showNotification(`⚔️ Bem-vindo, ${ngState.name}!`, `${cls?.icon} ${cls?.name} — que sua aventura comece!`, 'success', ngState.avatar);
        }

        // ============================================
        // PASSIVAS DE CLASSE
        // ============================================
        function applyClassPassives() {
            // As passivas são aplicadas dinamicamente nas funções de jogo
            // Esta função apenas garante que o estado está correto
            if (!gameState.player?.classId) return;
        }

        function getClassPassive(type) {
            if (!gameState.player?.classId) return 0;
            const cls = gameClasses.find(c => c.id === gameState.player.classId);
            if (!cls) return 0;
            const perk = cls.perks.find(p => p.type === type);
            return perk ? perk.value : 0;
        }

        function getPlayerClassName(avatarEmoji, gender) {
            if (typeof characterClasses === 'undefined') return 'Aventureiro';
            const cls = characterClasses.find(c => c.emojiM === avatarEmoji || c.emojiF === avatarEmoji);
            if (!cls) return 'Aventureiro';
            if (gender === 'N') return cls.nameM === cls.nameF ? cls.nameM : cls.nameM + ' / ' + cls.nameF;
            return (gender || 'M') === 'F' ? cls.nameF : cls.nameM;
        }

        function getCharacterClassPassive(perkType) {
            if (!gameState.player?.avatar) return 0;
            const cls = characterClasses.find(c => c.emojiM === gameState.player.avatar || c.emojiF === gameState.player.avatar);
            if (!cls) return 0;
            if (cls.perkType === perkType) {
                return cls.perkValue;
            }
            return 0;
        }

        function updatePlayerInfoBar() {
            if (!gameState.player) return;
            const bar = document.getElementById('playerInfoBar');
            if (bar) bar.style.display = 'flex';
            const quickLinks = document.getElementById('sidebarQuickLinks');
            if (quickLinks) quickLinks.style.display = 'grid';
            const avatarEl = document.getElementById('sidebarAvatar');
            const nameEl   = document.getElementById('sidebarPlayerName');
            const classEl  = document.getElementById('sidebarPlayerClass');
            if (avatarEl) avatarEl.textContent = gameState.player.avatar || '⚔️';
            if (nameEl)   nameEl.textContent   = gameState.player.name   || 'Herói';
            
            const charClassName = getPlayerClassName(gameState.player.avatar, gameState.player.gender);
            const cls = gameClasses.find(c => c.id === gameState.player.classId);
            const houseName = cls ? cls.house : 'Sem Casa';
            if (classEl)  classEl.textContent  = `${charClassName} · ${houseName}`;
            
            const goldBarEl = document.getElementById('sidebarGoldBar');
            if (goldBarEl) goldBarEl.textContent = '💰 ' + formatNumber(gameState.gold || 0);

            // Calcula e atualiza Gear Score Total
            let totalGS = 0;
            if (typeof calculateGearScore === 'function' && typeof getEquipmentItemData === 'function' && gameState.equipment) {
                for (let slot in gameState.equipment.equipped) {
                    const eqId = gameState.equipment.equipped[slot];
                    if (eqId) {
                        const eq = getEquipmentItemData(eqId);
                        if (eq) totalGS += calculateGearScore(eq);
                    }
                }
            }
            const gsText = document.getElementById('sidebarGearScore');
            if(gsText) gsText.innerText = `⭐ GS: ${totalGS}`;

            // Aplicar o tema da Casa no body
            const themeToApply = gameState.selectedTheme || gameState.player.classId;
            if (themeToApply) {
                document.body.className = 'class-' + themeToApply;
            } else {
                document.body.className = '';
            }
            updateActiveThemeButtons();
        }
