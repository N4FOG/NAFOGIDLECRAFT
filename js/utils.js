        // ============================================
        // FUNÇÕES UTILITÁRIAS
        // ============================================
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('gameSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('active');
        }

        // ============================================
        // SISTEMA DE ÍCONES: EMOJIS → IMAGENS / SPRITESHEET
        // ============================================

        // --------------------------------------------------
        // 1. MAPEAMENTO DE EMOJI PARA SPRITESHEET (iconestodos.png)
        //    Grid: 32x32 pixels por ícone, 43 colunas, 36 linhas
        //    Preencha com {col, row} baseado na posição visual.
        //    Use a ferramenta img/iconestodos-visual.html para descobrir as coordenadas.
        //    Ex: { col: 0, row: 0 } = primeiro ícone no canto superior esquerdo
        // --------------------------------------------------
        const SP_TILE = 32; // 32px por tile
        const emojiSpritePositions = {
            // 🌳 Árvore — Col 22, Row 19 (1 tile)
            '🌳': { col: 22, row: 19 },
            '🌲': { col: 22, row: 19 },
            // 🔱 Agora usa imagem individual (img/tridente.png)
            // Adicione mais abaixo!
            // Ex (1 tile):  '🌾': { col: X, row: Y },
            // Ex (vários):  '🏰': { col: X, row: Y, w: 3, h: 2 },
        };

        function getSpriteHtml(emoji, sprite) {
            const x = sprite.col * SP_TILE;
            const y = sprite.row * SP_TILE;
            const w = (sprite.w || 1) * SP_TILE;
            const h = (sprite.h || 1) * SP_TILE;
            return `<div class="emoji-icon-sprite" style="width:${w}px;height:${h}px;background-position:-${x}px -${y}px;" title="${emoji}"></div>`;
        }

        // --------------------------------------------------
        // 2. MAPEAMENTO DE EMOJI PARA ARQUIVO DE IMAGEM INDIVIDUAL
        //    (fallback / compatibilidade com imagens antigas)
        // --------------------------------------------------
        const emojiToImagePath = {
            '🌳': 'img/tree.png',
            '🌲': 'img/tree.png',
            '🔱': 'img/tridente.png',
        };

        // Cache de imagens pré-carregadas
        const _imageCache = new Set();
        function preloadIconImages() {
            // Pré-carregar spritesheet
            if (!_imageCache.has('img/iconestodos.png')) {
                _imageCache.add('img/iconestodos.png');
                const img = new Image();
                img.src = 'img/iconestodos.png';
            }
            // Pré-carregar imagens individuais
            for (const path of Object.values(emojiToImagePath)) {
                if (!_imageCache.has(path)) {
                    _imageCache.add(path);
                    const img = new Image();
                    img.src = path;
                }
            }
        }
        // Pré-carregar assim que o script executar
        setTimeout(preloadIconImages, 100);

        /**
         * resolveIcon(emoji)
         * Retorna HTML substituindo o emoji por uma imagem:
         * 1º — sprite da spritesheet (se mapeado em emojiSpritePositions)
         * 2º — imagem individual (se mapeado em emojiToImagePath)
         * 3º — próprio emoji (fallback)
         *
         * Ex: resolveIcon('🌳') → '<div class="emoji-icon-sprite" style="background-position: 0px 0px;"></div>'
         */
        function resolveIcon(emoji) {
            // 1ª opção: sprite da spritesheet
            const sprite = emojiSpritePositions[emoji];
            if (sprite) {
                return getSpriteHtml(emoji, sprite);
            }
            // 2ª opção: imagem individual
            const imgPath = emojiToImagePath[emoji];
            if (imgPath) {
                return `<img src="${imgPath}" class="emoji-icon-img" alt="${emoji}" loading="lazy">`;
            }
            // 3ª opção: fallback para emoji
            return emoji;
        }

        function getItemName(key) { const item = inventoryItems.find(i => i.key === key); return item ? item.name : key; }
        function getItemIcon(key) { const item = inventoryItems.find(i => i.key === key); return item ? item.icon : '📦'; }
        
        /**
         * getItemIconHtml(key)
         * Retorna o ícone do item como HTML (<img> se houver imagem mapeada, senão emoji).
         * Use esta função em contextos de innerHTML.
         */
        function getItemIconHtml(key) {
            const emoji = getItemIcon(key);
            return resolveIcon(emoji);
        }
        function getItemPrice(key) {
            let price = 5;
            let found = false;
            for (let cat in resources) { 
                const r = resources[cat].find(r => r.id === key); 
                if (r) { 
                    price = r.price; 
                    found = true; 
                    break; 
                } 
            }
            if (!found) {
                const all = [...cookingRecipes, ...craftingRecipes, ...smithingRecipes];
                const recipe = all.find(r => r.output.type === key);
                price = recipe ? (recipe.price || 10) : 5;
            }
            return Math.max(1, Math.floor(price * (window.balancingConfig?.sellMultiplier || 1.0)));
        }
        function getItemHeal(key) { const recipe = cookingRecipes.find(r => r.output.type === key); return recipe ? recipe.healAmount : 10; }
        function hasInventorySpace() { return Object.values(gameState.inventory).filter(q => q > 0).length < gameState.bankSlots; }

        function formatNumber(num) {
            if (num === undefined || num === null) return '0';
            const format = gameState.settings?.numberFormat || 'standard';
            if (format === 'short') {
                if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
                if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                return num.toString();
            }
            return num.toLocaleString('pt-BR');
        }

        // ============================================
        // SISTEMA DE MICRO-ANIMAÇÕES E EFEITOS VISUAIS
        // ============================================

        // Container global de efeitos (criado uma vez)
        let _effectContainer = null;
        function getEffectContainer() {
            if (!_effectContainer) {
                _effectContainer = document.createElement('div');
                _effectContainer.className = 'effect-container';
                _effectContainer.id = 'effectContainer';
                document.body.appendChild(_effectContainer);
            }
            return _effectContainer;
        }

        /**
         * spawnConfetti(x, y, count = 20, colors = ['#ffd700','#ff6644','#4aff4a','#4a9aff','#c96ac9','#ff9944'])
         * Cria uma explosão de confetes na posição (x, y).
         * Se x/y forem null, centraliza na tela.
         */
        function spawnConfetti(x, y, count = 20, colors) {
            if (!colors) colors = ['#ffd700', '#ff6644', '#4aff4a', '#4a9aff', '#c96ac9', '#ff9944', '#ffffff'];
            const container = getEffectContainer();
            const cx = x !== null ? x : getGameCenterX();
            const cy = y !== null ? y : getGameCenterY();
            
            const shapes = ['circle', 'square', 'triangle'];
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const size = 6 + Math.random() * 8;
                
                el.className = 'effect-confetti ' + shape;
                el.style.position = 'absolute';
                el.style.left = (cx + (Math.random() - 0.5) * 60) + 'px';
                el.style.top = (cy + (Math.random() - 0.5) * 40) + 'px';
                el.style.width = size + 'px';
                el.style.height = size + 'px';
                el.style.background = color;
                el.style.borderBottomColor = color;
                el.style.setProperty('--confetti-color', color);
                el.style.borderRadius = shape === 'circle' ? '50%' : '2px';
                
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 180;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist - 80;
                
                el.style.setProperty('--dx', dx + 'px');
                el.style.setProperty('--dy', dy + 'px');
                el.style.animation = `particleBurst ${0.6 + Math.random() * 0.6}s ease-out forwards`;
                el.style.animationDelay = (Math.random() * 0.15) + 's';
                
                container.appendChild(el);
                setTimeout(() => { if (el.parentElement) el.remove(); }, 2000);
            }
        }

        /**
         * spawnFloatingText(x, y, text, options)
         * Cria um texto flutuante na posição (x, y).
         * options: { color, size, type ('xp'|'gold'|'damage'|'heal'|'item'|'special'), duration }
         */
        function spawnFloatingText(x, y, text, options = {}) {
            const container = getEffectContainer();
            const cx = x !== null ? x : window.innerWidth / 2;
            const cy = y !== null ? y : window.innerHeight / 2 + 20;
            
            const el = document.createElement('div');
            const typeClass = options.type || '';
            el.className = 'effect-float-text ' + typeClass;
            el.textContent = text;
            
            if (options.color) el.style.color = options.color;
            if (options.size) el.style.fontSize = options.size;
            
            el.style.left = (cx - 50 + Math.random() * 100) + 'px';
            el.style.top = cy + 'px';
            
            const duration = options.duration || 1.2;
            el.style.animationDuration = duration + 's';
            
            container.appendChild(el);
            setTimeout(() => { if (el.parentElement) el.remove(); }, (duration + 0.5) * 1000);
        }

        /**
         * triggerScreenShake(intensity = 4, duration = 400)
         * Aplica um tremor de tela no game container.
         */
        function triggerScreenShake(intensity = 4, duration = 400) {
            const container = document.querySelector('.game-container');
            if (!container) return;
            
            container.classList.add('effect-screen-shake');
            container.style.setProperty('--shake-intensity', intensity + 'px');
            
            setTimeout(() => {
                container.classList.remove('effect-screen-shake');
            }, duration);
        }

        /**
         * flashElement(element, color = '#ffd700', bgColor = 'rgba(255,215,0,0.15)', duration = 1000)
         * Faz um elemento piscar com uma cor de destaque.
         */
        function flashElement(element, color = '#ffd700', bgColor = 'rgba(255,215,0,0.15)', duration = 1000) {
            if (!element) return;
            element.style.setProperty('--flash-color', color);
            element.style.setProperty('--flash-bg', bgColor);
            element.classList.add('effect-flash');
            setTimeout(() => {
                element.classList.remove('effect-flash');
                element.style.removeProperty('--flash-color');
                element.style.removeProperty('--flash-bg');
            }, duration);
        }

        /**
         * triggerLevelUpEffect(element)
         * Aplica o efeito de level up em um elemento (ex: card da skill).
         */
        function triggerLevelUpEffect(element) {
            if (element) {
                element.classList.add('effect-level-up-glow');
                setTimeout(() => element.classList.remove('effect-level-up-glow'), 1200);
            }
            // Partículas douradas
            const cx = getGameCenterX();
            const cy = getGameCenterY();
            spawnConfetti(cx, cy, 25, ['#ffd700', '#ffaa00', '#fff4a0', '#ffdd44']);
            spawnFloatingText(cx, cy - 30, '⬆ LEVEL UP! ⬆', { type: 'special', duration: 1.6 });
        }

        /**
         * triggerRareDropEffect(icon, name, x, y)
         * Efeito especial para drops raros.
         */
        function triggerRareDropEffect(icon, name, x, y) {
            const cx = x || getGameCenterX();
            const cy = y || getGameCenterY();
            spawnConfetti(cx, cy, 30, ['#c96ac9', '#dca8ff', '#ffd700', '#ff9944']);
            spawnFloatingText(cx, cy - 40, `${icon} ${name}!`, { type: 'special', duration: 1.8 });
        }

        /**
         * triggerCombatVictoryEffect()
         * Efeito de vitória em combate.
         */
        function triggerCombatVictoryEffect() {
            const cx = getGameCenterX();
            const cy = getGameCenterY();
            spawnConfetti(cx, cy, 30, ['#ffd700', '#ff6644', '#ff9944', '#ffffff']);
            spawnFloatingText(cx, cy - 50, '🏆 VITÓRIA!', { type: 'special', duration: 1.5 });
        }

        /**
         * getGameCenterX() / getGameCenterY()
         * Retorna coordenadas relativas ao centro do game-container.
         */
        function getGameCenterX() {
            const container = document.querySelector('.game-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                return rect.left + rect.width / 2;
            }
            return window.innerWidth / 2;
        }

        function getGameCenterY() {
            const container = document.querySelector('.game-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                return rect.top + rect.height / 3;
            }
            return window.innerHeight / 3;
        }

        function getGameRightX() {
            const container = document.querySelector('.game-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                return rect.right - 20;
            }
            return window.innerWidth - 100;
        }

        function getNotificationCategory(title, icon) {
            const t = title.toLowerCase();
            const ic = icon;
            if (t.includes('trabalhador') || t.includes('worker') || ic === '👷') return 'workers';
            if (t.includes('lenha') || t.includes('madeira') || ic === '🌳' || ic === '🪓' || ic === '🪵') return 'woodcutting';
            if (t.includes('miner') || t.includes('minério') || ic === '⛏️' || ic === '🥉' || ic === '⚙️') return 'mining';
            if (t.includes('pesca') || t.includes('peixe') || ic === '🎣' || ic === '🐟' || ic === '🐠') return 'fishing';
            if (t.includes('herbo') || t.includes('erva') || ic === '🌿' || ic === '🌹' || ic === '🍃') return 'herbalism';
            if (t.includes('cria') || t.includes('arte') || ic === '🔨' || ic === '🏹' || ic === '🥾') return 'crafting';
            if (t.includes('ferra') || t.includes('forja') || ic === '⚒️' || ic === '🥇' || ic === '🥈') return 'smithing';
            if (t.includes('cozi') || t.includes('culi') || ic === '🍳' || ic === '🍲' || ic === '🍺') return 'cooking';
            if (t.includes('encan') || ic === '🔮' || ic === '✨' || ic === '🌟') return 'enchanting';
            if (t.includes('comb') || t.includes('arena') || t.includes('chefe') || ic === '⚔️' || ic === '💀') return 'combat';
            if (t.includes('masm') || t.includes('dungeon') || ic === '🏰') return 'dungeon';
            if (t.includes('fazenda') || t.includes('propriedade') || t.includes('camp') || ic === '🌾' || ic === '🌱' || ic === '🏡' || ic === '🏕️') return 'camp';
            return 'other';
        }

        function showNotification(title, message, type = 'success', icon = '📦') {
            if (gameState.settings) {
                const cat = getNotificationCategory(title, icon);
                if (gameState.settings.hiddenNotificationCategories?.[cat]) {
                    return;
                }
            }

            const area = document.getElementById('notificationArea');
            if (!area) return;

            const maxNotifications = gameState.settings?.maxNotifications || 5;
            while (area.children.length >= maxNotifications) {
                area.children[0].remove();
            }

            const style = gameState.notificationStyle || 'style3';
            const toast = document.createElement('div');
            toast.className = `notification-toast ${type} notif-${style}`;
            
            let closeBtnHTML = `<button class="notification-close" onclick="this.parentElement.remove()">×</button>`;
            let progressHTML = '';
            
            if (style === 'style1') {
                closeBtnHTML = ''; // Sem fechar manual no neon
            } else if (style === 'style2') {
                closeBtnHTML = '';
                progressHTML = `<div class="notification-progress-bar"></div>`;
            } else if (style === 'style3') {
                closeBtnHTML = '';
            }
            
            toast.innerHTML = `
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                ${closeBtnHTML}
                ${progressHTML}
            `;
            
            area.appendChild(toast);
            
            // Auto remover após 3 segundos
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        if (toast.parentElement) toast.remove();
                    }, 300);
                }
            }, 3000);
        }


        // ============================================
        // BUFFS ATIVOS NA SIDEBAR
        // ============================================
        function updateSidebarBuffs() {
            // 1. Buffs Temporários (Poções, Mascote, Chefe) no rodapé global
            const globalContainer = document.getElementById('globalActiveBuffs');
            if (globalContainer) {
                const now = Date.now();
                const globalTags = [];
                
                // Poções Ativas
                for (let id in gameState.alchemy.activePotions) {
                    const p = gameState.alchemy.activePotions[id];
                    const elapsed = (now - p.startedAt) / 1000;
                    if (elapsed >= p.duration) { delete gameState.alchemy.activePotions[id]; continue; }
                    const remaining = p.duration - elapsed;
                    const mins = Math.floor(remaining / 60);
                    const secs = Math.floor(remaining % 60);
                    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
                    const potion = potions.find(pt => pt.id === id);
                    if (!potion) continue;
                    
                    const effectLabel = {
                        speed:     `+${p.effectValue}% vel.`,
                        luck:      `+${p.effectValue}% crít.`,
                        strength:  `+${p.effectValue} for.`,
                        xpBoost:   `+${p.effectValue}% XP`,
                        goldBoost: `+${p.effectValue}% ouro`,
                    }[p.effectType] || `+${p.effectValue}%`;
                    
                    globalTags.push(`
                        <div class="buff-tag potion" style="display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:12px; background:rgba(20,26,35,0.92); border:1px solid #c96ac9; font-size:0.82em; font-family:'Outfit'; font-weight: bold; pointer-events: auto;">
                            <span style="font-size:1.15em;">${potion.icon}</span>
                            <span style="color:#dca8ff;">${potion.name}:</span>
                            <span style="color:#eee; font-weight:normal;">${effectLabel}</span>
                            <span class="buff-timer" style="background:rgba(0,0,0,0.4); padding:1px 6px; border-radius:10px; font-size:0.9em; font-weight:bold; color:#ff9944; font-family:monospace;">${timeStr}</span>
                        </div>
                    `);
                }

                // Mascote Ativo
                if (gameState.pets && gameState.pets.active) {
                    const pet = pets.find(p => p.id === gameState.pets.active);
                    if (pet) {
                        const petLvl = gameState.pets.levels?.[pet.id]?.level || 1;
                        const levelMult = 1 + (petLvl - 1) * 0.15;
                        const val = Math.round(pet.effectValue * levelMult * 10) / 10;
                        
                        const effectLabel = {
                            xpBoost:      `+${val}% XP`,
                            doubleChance: `+${val}% duplo`,
                            rareChance:   `+${val}% raro`,
                            combatBoost:  `+${val}% dano`,
                            allBoost:     `+${val}% tudo`,
                        }[pet.effectType] || `+${val}%`;
                        
                        globalTags.push(`
                            <div class="buff-tag pet" style="display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:12px; background:rgba(20,26,35,0.92); border:1px solid #4aff4a; font-size:0.82em; font-family:'Outfit'; font-weight: bold; pointer-events: auto;">
                                <span style="font-size:1.15em;">${pet.icon}</span>
                                <span style="color:#a8ffa8;">${pet.name} (Nv. ${petLvl}):</span>
                                <span style="color:#eee; font-weight:normal;">${effectLabel}</span>
                            </div>
                        `);
                    }
                }

                // Buff do Chefe Global (Bênção do Titã)
                if (gameState.worldBossBuff && gameState.worldBossBuff.expiresAt) {
                    if (now < gameState.worldBossBuff.expiresAt) {
                        const remaining = gameState.worldBossBuff.expiresAt - now;
                        const hours = Math.floor(remaining / 3600000);
                        const mins = Math.floor((remaining % 3600000) / 60000);
                        const secs = Math.floor((remaining % 60000) / 1000);
                        let timeStr = "";
                        if (hours > 0) {
                            timeStr = `${hours}h ${mins}m`;
                        } else {
                            timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
                        }
                        
                        globalTags.push(`
                            <div class="buff-tag worldboss" style="display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:12px; background:rgba(20,26,35,0.92); border:1px solid #9b59b6; font-size:0.82em; font-family:'Outfit'; font-weight: bold; pointer-events: auto;">
                                <span style="font-size:1.15em;">👑</span>
                                <span style="color:#d896ff;">Bênção do Titã:</span>
                                <span style="color:#eee; font-weight:normal;">+${gameState.worldBossBuff.value}% tudo</span>
                                <span class="buff-timer" style="background:rgba(0,0,0,0.4); padding:1px 6px; border-radius:10px; font-size:0.9em; font-weight:bold; color:#ff9944; font-family:monospace;">${timeStr}</span>
                            </div>
                        `);
                    }
                }
                
                globalContainer.innerHTML = globalTags.join('');
            }
            
            // Auto-refresh dos timers dos buffs na UI a cada 1s
            if (!window._buffRefreshInterval) {
                window._buffRefreshInterval = setInterval(() => {
                    if (typeof gameState !== 'undefined' && gameState.player) {
                        if (typeof checkAutoPotter === 'function') checkAutoPotter();
                        updateSidebarBuffs();
                    }
                }, 1000);
            }
            
            // 2. Buffs Gerais Passivos na aba Personagem (sob o doll)
            const charContainer = document.getElementById('characterBuffsList');
            if (charContainer) {
                const charTags = [];
                
                // Passiva de Classe
                if (gameState.player?.classId) {
                    const cls = gameClasses.find(c => c.id === gameState.player.classId);
                    if (cls) {
                        cls.perks.forEach(perk => {
                            if (['startGold','startWeapon','bankSlots','autoSlots'].includes(perk.type)) return;
                            charTags.push(`
                                <div class="buff-tag passive" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid ${cls.color || '#ffd700'};">
                                    <span style="font-size:1.3em;">${cls.icon}</span>
                                    <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                        <div style="font-weight:bold; color:${cls.color || '#ffd700'}; font-size:0.85em;">${cls.house} (Passiva)</div>
                                        <div style="font-size:0.78em; color:#aaa;">${perk.label}</div>
                                    </div>
                                </div>
                            `);
                        });
                    }
                }
                
                // Ferramentas
                toolsData.forEach(tool => {
                    const tier = gameState.tools ? (gameState.tools[tool.id] || 0) : 0;
                    if (tier === 0) return;
                    const tierData = tool.tiers[tier - 1];
                    charTags.push(`
                        <div class="buff-tag tool" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid #c9a44a;">
                            <span style="font-size:1.3em;">${tierData.icon}</span>
                            <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                <div style="font-weight:bold; color:#c9a44a; font-size:0.85em;">${tierData.name}</div>
                                <div style="font-size:0.78em; color:#aaa;">+${tierData.xpBonus}% XP em ${tool.skillLabel}</div>
                            </div>
                        </div>
                    `);
                });
                
                // Mascote
                if (gameState.pets.active) {
                    const pet = pets.find(p => p.id === gameState.pets.active);
                    if (pet) {
                        const petLvl = gameState.pets.levels?.[pet.id]?.level || 1;
                        const levelMult = 1 + (petLvl - 1) * 0.15;
                        const val = Math.round(pet.effectValue * levelMult * 10) / 10;
                        
                        const effectLabel = {
                            xpBoost:      `+${val}% XP (${pet.effect})`,
                            doubleChance: `+${val}% duplicar coleta`,
                            rareChance:   `+${val}% peixe raro`,
                            combatBoost:  `+${val}% dano`,
                            allBoost:     `+${val}% tudo`,
                        }[pet.effectType] || `+${val}%`;
                        
                        charTags.push(`
                            <div class="buff-tag pet" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid #4aff4a;">
                                <span style="font-size:1.3em;">${pet.icon}</span>
                                <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                    <div style="font-weight:bold; color:#4aff4a; font-size:0.85em;">${pet.name} (Nv. ${petLvl})</div>
                                    <div style="font-size:0.78em; color:#aaa;">${effectLabel}</div>
                                </div>
                            </div>
                        `);
                    }
                }
                
                // Tecnologias
                const techLabels = {
                    xpBoost:       (v, l) => `+${v*l}% XP coleta`,
                    doubleChance:  (v, l) => `+${v*l}% duplicar`,
                    autoSpeed:     (v, l) => `−${v*l}s autofarm`,
                    criticalChance:(v, l) => `+${v*l}% crítico`,
                    lifesteal:     (v, l) => `+${v*l}% vampirismo`,
                    healthBoost:   (v, l) => `+${v*l}% vida`,
                    costReduction: (v, l) => `+${v*l}% preservar mat.`,
                    craftSpeed:    (v, l) => `−${v*l}% tempo craft`,
                    valueBoost:    (v, l) => `+${v*l}% craftar 2x`,
                    potionDuration:(v, l) => `+${v*l}% duração poção`,
                    potionPower:   (v, l) => `+${v*l}% potência poção`,
                    doublePotion:  (v, l) => `+${v*l}% poção 4x`,
                };
                for (let catId in gameState.techTree) {
                    for (let up of gameState.techTree[catId].upgrades) {
                        if (up.currentLevel === 0) continue;
                        const labelFn = techLabels[up.effectType];
                        const label = labelFn ? labelFn(up.effectValue, up.currentLevel) : `Nv.${up.currentLevel}`;
                        charTags.push(`
                            <div class="buff-tag tech" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid #4a9aff;">
                                <span style="font-size:1.3em;">🔬</span>
                                <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                    <div style="font-weight:bold; color:#4a9aff; font-size:0.85em;">${up.name} (Nv. ${up.currentLevel})</div>
                                    <div style="font-size:0.78em; color:#aaa;">${label}</div>
                                </div>
                            </div>
                        `);
                    }
                }
                
                // Equipamentos
                const equipBonuses = getEquipmentBonuses();
                const equipSummary = [];
                if (equipBonuses.strength)  equipSummary.push(`+${equipBonuses.strength} Força`);
                if (equipBonuses.defense)   equipSummary.push(`+${equipBonuses.defense} Defesa`);
                if (equipBonuses.maxHealth) equipSummary.push(`+${equipBonuses.maxHealth} Vida`);
                if (equipBonuses.speedBonus)equipSummary.push(`+${equipBonuses.speedBonus}% Vel.`);
                if (equipBonuses.critChance)equipSummary.push(`+${equipBonuses.critChance}% Crit.`);
                if (equipBonuses.xpBonus)   equipSummary.push(`+${equipBonuses.xpBonus}% XP`);
                if (equipSummary.length > 0) {
                    charTags.push(`
                        <div class="buff-tag equip" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid #ff9944;">
                            <span style="font-size:1.3em;">⚔️</span>
                            <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                <div style="font-weight:bold; color:#ff9944; font-size:0.85em;">Equipamentos</div>
                                <div style="font-size:0.78em; color:#aaa;">${equipSummary.join(' · ')}</div>
                            </div>
                        </div>
                    `);
                }
                
                // Runas
                const runeTags = [];
                for (let slot in gameState.equipment.equipped) {
                    const id = gameState.equipment.equipped[slot];
                    if (!id || !id.startsWith('inst_')) continue;
                    const inst = gameState.equipment.instances?.[id];
                    if (inst && inst.runas) {
                        inst.runas.forEach(runeId => {
                            if (runeId && typeof runasData !== 'undefined' && runasData[runeId]) {
                                const rune = runasData[runeId];
                                runeTags.push(`
                                    <div class="buff-tag" style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:3px solid #dca8ff;">
                                        <span style="font-size:1.3em;">${rune.icon}</span>
                                        <div style="display:flex; flex-direction:column; gap:2px; font-family:'Outfit'; text-align:left;">
                                            <div style="font-weight:bold; color:#dca8ff; font-size:0.85em;">${rune.name}</div>
                                            <div style="font-size:0.78em; color:#aaa;">${rune.desc}</div>
                                        </div>
                                    </div>
                                `);
                            }
                        });
                    }
                }
                if (runeTags.length > 0) {
                    runeTags.forEach(tag => charTags.push(tag));
                }
                
                charContainer.innerHTML = charTags.length > 0
                    ? charTags.join('')
                    : '<div style="color:#888; font-size:0.85em; text-align:center; padding:10px;">Nenhum efeito ativo</div>';
            }
        }

        function updateResourcesPage(skill) {
            const container = document.getElementById(skill + 'Resources');
            if (!container) return;

            container.innerHTML = '';
            const skillData = gameState.skills[skill];
            const resourceList = resources[skill];

            resourceList.forEach(resource => {
                const isUnlocked = skillData.level >= resource.levelReq;
                const card = document.createElement('div');
                card.className = `resource-card ${isUnlocked ? 'unlocked' : 'locked'}`;

                if (!isUnlocked) {
                    card.innerHTML = `
                        <div class="resource-lock">🔒</div>
                        <div class="resource-name">
                            ${resolveIcon(resource.icon)} ${resource.name}
                            <span class="resource-level-req">Nível ${resource.levelReq}</span>
                        </div>
                        <div class="resource-desc">${resource.desc}</div>
                        <div class="resource-stats">
                            <span>🎯 ${resource.xpGain} XP</span>
                            <span>💰 ${resource.price} ouro</span>
                        </div>
                        <div class="resource-buttons">
                            <button class="farm-btn" disabled>🔒 FARM</button>
                        </div>
                    `;
                } else {
                    const workerCount   = gameState.workers?.allocated?.[resource.id] || 0;
                    const workerTotal   = getWorkerTotal();
                    const workerHtml    = workerTotal > 0 ? `
                        <div class="worker-control">
                            <button class="worker-btn" onclick="allocateWorker('${resource.id}', -1)" ${workerCount <= 0 ? 'disabled' : ''}>−</button>
                            <span class="worker-count">👷 ${workerCount}</span>
                            <button class="worker-btn" onclick="allocateWorker('${resource.id}', 1)" ${getWorkerFree() <= 0 ? 'disabled' : ''}>+</button>
                            <span class="worker-prod">${workerCount > 0 ? '→ ' + workerCount + '/ciclo' : ''}</span>
                            <button class="worker-btn" style="background:none;border:none;cursor:pointer;font-size:1.1em;padding:0;margin-left:5px;box-shadow:none;transition:transform 0.2s;" onclick="toggleWorkerNotification('${resource.id}')" title="Alternar notificações">${(gameState.notificationFilters?.workers?.[resource.id]) ? '🔕' : '🔔'}</button>
                        </div>` : '';
                    card.innerHTML = `
                        <div class="resource-name">
                            ${resolveIcon(resource.icon)} ${resource.name}
                        </div>
                        <div class="resource-desc">${resource.desc}</div>
                        <div class="resource-stats">
                            <span>🎯 ${resource.xpGain} XP</span>
                            <span>💰 ${resource.price} ouro</span>
                        </div>
                        ${workerHtml}
                        <div class="resource-buttons">
                            <button class="farm-btn" onclick="farmResource('${skill}', '${resource.id}', event)">
                                🌾 FARM
                            </button>
                        </div>
                    `;
                }

                container.appendChild(card);
            });
        }

// Alternar notificações para um recurso/receita de trabalhador específico
window.toggleWorkerNotification = function(resourceId) {
    if (!gameState.notificationFilters) gameState.notificationFilters = {};
    if (!gameState.notificationFilters.workers) gameState.notificationFilters.workers = {};
    
    gameState.notificationFilters.workers[resourceId] = !gameState.notificationFilters.workers[resourceId];
    
    const isMuted = gameState.notificationFilters.workers[resourceId];
    showNotification('Notificações', `Notificações do trabalhador ${isMuted ? 'ocultadas 🔕' : 'ativadas 🔔'}.`, 'info');
    
    if (gameState.currentPage) {
        if (gameState.currentPage === 'cooking' && typeof updateCookingPage === 'function') updateCookingPage();
        else if (gameState.currentPage === 'crafting' && typeof updateCraftingPage === 'function') updateCraftingPage();
        else if (gameState.currentPage === 'smithing' && typeof updateSmithingPage === 'function') updateSmithingPage();
        else if (gameState.currentPage === 'enchanting' && typeof updateEnchantingPage === 'function') updateEnchantingPage();
        else if (['woodcutting', 'mining', 'fishing', 'herbalism'].includes(gameState.currentPage) && typeof updateResourcesPage === 'function') updateResourcesPage(gameState.currentPage);
    }
}
