            const monsterConfigs = [
            // --- ESTÁGIO 1: GELO/NEVE (Waves 1-10) ---
            { name: 'Golem de Gelo', icon: '🧊', element: 'ice' , image: 'img/Arena de combate/Golem de Gelo.png'},
            { name: 'Esqueleto Glacial', icon: '💀❄️', element: 'ice' , image: 'img/Arena de combate/Esqueleto Glacial.png'},
            { name: 'Lobo Invernal', icon: '🐺❄️', element: 'ice' , image: 'img/Arena de combate/Lobo Invernal.png'},
            { name: 'Aranha de Gelo', icon: '❄️🕷️', element: 'ice' , image: 'img/Arena de combate/Aranha de Gelo.png'},
            { name: 'Aparição Congelada', icon: '❄️👻', element: 'ice' , image: 'img/Arena de combate/Aparição Congelada.png'},
            { name: 'Fada da Neve', icon: '🧚❄️', element: 'ice' , image: 'img/Arena de combate/Fada da Neve.png'},
            { name: 'Yeti', icon: '🐻❄️', element: 'ice' , image: 'img/Arena de combate/Yeti.png'},
            { name: 'Cavaleiro de Gelo', icon: '❄️🛡️', element: 'ice' , image: 'img/Arena de combate/Cavaleiro de Gelo.png'},
            { name: 'Rei de Gelo', icon: '❄️👑', element: 'ice' , image: 'img/Arena de combate/Rei de Gelo.png'},
            { name: 'Dragão Branco', icon: '🐉❄️', element: 'ice' , image: 'img/Arena de combate/Dragão Branco.png'},

            // --- ESTÁGIO 2: FOGO (Waves 11-20) ---
            { name: 'Elemental de Fogo', icon: '🔥', element: 'fire' },
            { name: 'Salamandra', icon: '🦎🔥', element: 'fire' },
            { name: 'Cão do Inferno', icon: '🔥🐕', element: 'fire' },
            { name: 'Caveira Flamejante', icon: '🔥💀', element: 'fire' },
            { name: 'Minotauro de Fogo', icon: '🔥🐂', element: 'fire' },
            { name: 'Águia de Cinzas', icon: '🔥🦅', element: 'fire' },
            { name: 'Fênix Jovem', icon: '🦅🔥', element: 'fire' },
            { name: 'Golem de Magma', icon: '🗿🔥', element: 'fire' },
            { name: 'Lorde do Magma', icon: '🔥👑', element: 'fire' },
            { name: 'Dragão Vermelho', icon: '🐉🔥', element: 'fire' },

            // --- ESTÁGIO 3: ÁGUA (Waves 21-30) ---
            { name: 'Elemental de Água', icon: '💧', element: 'water' },
            { name: 'Tritão Guerreiro', icon: '🧜‍♂️', element: 'water' },
            { name: 'Crocodilo do Pântano', icon: '💧🦎', element: 'water' },
            { name: 'Caranguejo Gigante', icon: '💧🦀', element: 'water' },
            { name: 'Fantasma das Marés', icon: '💧👻', element: 'water' },
            { name: 'Sereia', icon: '🧜‍♀️', element: 'water' },
            { name: 'Mago da Água', icon: '💧🧙‍♂️', element: 'water' },
            { name: 'Serpente Marinha', icon: '💧🐍', element: 'water' },
            { name: 'Hidra', icon: '🐍💧', element: 'water' },
            { name: 'Kraken', icon: '🐙', element: 'water' },

            // --- ESTÁGIO 4: AR/VENTO (Waves 31-40) ---
            { name: 'Elemental de Ar', icon: '🌪️', element: 'wind' },
            { name: 'Harpia', icon: '🦅', element: 'wind' },
            { name: 'Falcão da Tempestade', icon: '🌪️🦅', element: 'wind' },
            { name: 'Tigre da Nevasca', icon: '🌪️🐯', element: 'wind' },
            { name: 'Arqueiro do Vento', icon: '🌪️🏹', element: 'wind' },
            { name: 'Fada do Vento', icon: '🧚🌪️', element: 'wind' },
            { name: 'Pégaso Sombrio', icon: '🌪️🐎', element: 'wind' },
            { name: 'Espectro do Vento', icon: '🌪️👻', element: 'wind' },
            { name: 'Grifo', icon: '🦁', element: 'wind' },
            { name: 'Dragão Azul', icon: '🐉🌪️', element: 'wind' },

            // --- ESTÁGIO 5: TERRA (Waves 41-50) ---
            { name: 'Elemental de Terra', icon: '🪨', element: 'earth' },
            { name: 'Mandrágora', icon: '🌱', element: 'earth' },
            { name: 'Aranha de Terra', icon: '🪨🕷️', element: 'earth' },
            { name: 'Escorpião de Pedra', icon: '🪨🦂', element: 'earth' },
            { name: 'Touro de Bronze', icon: '🪨🐂', element: 'earth' },
            { name: 'Basilisco', icon: '🦎', element: 'earth' },
            { name: 'Guardião das Ruínas', icon: '🪨🛡️', element: 'earth' },
            { name: 'Treant', icon: '🌳', element: 'earth' },
            { name: 'Rei da Montanha', icon: '🪨👑', element: 'earth' },
            { name: 'Golem de Pedra', icon: '🗿', element: 'earth' },

            // --- ESTÁGIO 6: SOMBRA/TREVAS (Waves 51-60) ---
            { name: 'Caveira Amaldiçoada', icon: '💀🌑', element: 'dark' },
            { name: 'Sombra Espreitadora', icon: '🌑👻', element: 'dark' },
            { name: 'Lobo das Sombras', icon: '🌑🐺', element: 'dark' },
            { name: 'Aranha Viúva Negra', icon: '🌑🕷️', element: 'dark' },
            { name: 'Espectro', icon: '👻', element: 'dark' },
            { name: 'Cavaleiro Sem Cabeça', icon: '🌑🛡️', element: 'dark' },
            { name: 'Demônio', icon: '😈', element: 'dark' },
            { name: 'Vampiro', icon: '🧛', element: 'dark' },
            { name: 'Ceifador de Almas', icon: '🌑👑', element: 'dark' },
            { name: 'Lich', icon: '💀', element: 'dark' },

            // --- ESTÁGIO 7: LUZ/SAGRADO (Waves 61-70) ---
            { name: 'Espírito de Luz', icon: '✨', element: 'holy' },
            { name: 'Unicórnio de Luz', icon: '☀️🦄', element: 'holy' },
            { name: 'Cervo Sagrado', icon: '☀️🦌', element: 'holy' },
            { name: 'Juiz da Luz', icon: '☀️⚖️', element: 'holy' },
            { name: 'Cavaleiro Sagrado', icon: '⚔️☀️', element: 'holy' },
            { name: 'Arcanjo da Justiça', icon: '☀️👑', element: 'holy' },
            { name: 'Anjo Caído', icon: '👼🌑', element: 'holy' },
            { name: 'Valquíria Celestial', icon: '☀️🦅', element: 'holy' },
            { name: 'Guardião Celestial', icon: '⭐', element: 'holy' },
            { name: 'Serafim', icon: '🪽', element: 'holy' },

            // --- ESTÁGIO 8: RAIO/ELÉTRICO (Waves 71-80) ---
            { name: 'Elemental de Raio', icon: '⚡', element: 'lightning' },
            { name: 'Leopardo de Relâmpago', icon: '⚡🐆', element: 'lightning' },
            { name: 'Víbora Elétrica', icon: '⚡🐍', element: 'lightning' },
            { name: 'Arqueiro do Trovão', icon: '⚡🏹', element: 'lightning' },
            { name: 'Gladiador do Raio', icon: '⚡⚔️', element: 'lightning' },
            { name: 'Espírito Trovejante', icon: '🌩️', element: 'lightning' },
            { name: 'Golem Elétrico', icon: '🗿⚡', element: 'lightning' },
            { name: 'Fênix de Raio', icon: '🦅⚡', element: 'lightning' },
            { name: 'Lorde do Trovão', icon: '⚡👑', element: 'lightning' },
            { name: 'Dragão do Trovão', icon: '🐉⚡', element: 'lightning' },

            // --- ESTÁGIO 9: LENDÁRIOS (Waves 81-90) ---
            { name: 'Quimera Multielemental', icon: '👑🦁', element: 'legendary' },
            { name: 'Arquimago Elemental', icon: '👑🧙‍♂️', element: 'legendary' },
            { name: 'Guardião da Eternidade', icon: '👑🛡️', element: 'legendary' },
            { name: 'Behemoth do Caos', icon: '👑👹', element: 'legendary' },
            { name: 'Ouroboros do Tempo', icon: '👑🐉', element: 'legendary' },
            { name: 'Titã da Montanha', icon: '🗿🌋', element: 'legendary' },
            { name: 'Leviatã', icon: '🐉💧', element: 'legendary' },
            { name: 'Fênix Imortal', icon: '🦅✨', element: 'legendary' },
            { name: 'Senhor das Trevas', icon: '👿🌑', element: 'legendary' },
            { name: 'Dragão Ancestral', icon: '🐉👑', element: 'legendary' }
        ];

        const arenaEnemies = monsterConfigs.map((config, index) => {
            const w = index + 1;
            const isBoss = w % 10 === 0;

            // Fórmulas de estatísticas balanceadas
            let hp = 50 + w * 28 + Math.floor(Math.pow(w, 1.8) * 0.55);
            let atk = 6 + Math.floor(w * 1.4) + Math.floor(Math.pow(w, 1.25) * 0.08);
            let def = 1 + Math.floor(w * 0.75) + Math.floor(Math.pow(w, 1.15) * 0.04);
            let gold = 10 + w * 12 + Math.floor(Math.pow(w, 1.4) * 0.4);
            let coins = Math.max(1, Math.floor(w * 1.2 + Math.pow(w, 1.1) * 0.08));
            let xp = 20 + w * 20 + Math.floor(Math.pow(w, 1.4) * 0.4);

            if (isBoss) {
                hp = Math.floor(hp * 1.45);
                atk = Math.floor(atk * 1.18);
                def = Math.floor(def * 1.18);
                gold = gold * 2;
                coins = coins * 2;
                xp = xp * 2;
            }

            let weakness = null;
            let res = {};
            let elementEmoji = '';
            
            const elementMaps = {
                ice: { emoji: '❄️', weak: 'fire', res: { ice: 15, water: 5, fire: -20 }, skillName: 'Sopro Glacial', skillMsg: 'congelou o ar e atacou!' },
                fire: { emoji: '🔥', weak: 'ice', res: { fire: 15, earth: 5, ice: -20 }, skillName: 'Explosão Flamejante', skillMsg: 'soprou magma ardente!' },
                water: { emoji: '💧', weak: 'lightning', res: { water: 15, ice: 5, lightning: -20 }, skillName: 'Muralha de Água', skillMsg: 'desencadeou um maremoto!' },
                wind: { emoji: '🌪️', weak: 'earth', res: { wind: 15, lightning: 5, earth: -20 }, skillName: 'Vórtex de Ar', skillMsg: 'invocou um tornado!' },
                earth: { emoji: '🪨', weak: 'wind', res: { earth: 15, nature: 5, wind: -20 }, skillName: 'Tiro de Rocha', skillMsg: 'provocou um terremoto!' },
                dark: { emoji: '💀', weak: 'holy', res: { dark: 15, wind: 5, holy: -20 }, skillName: 'Dreno de Trevas', skillMsg: 'sugou sua energia vital!' },
                holy: { emoji: '✨', weak: 'dark', res: { holy: 15, fire: 5, dark: -20 }, skillName: 'Julgamento Celestial', skillMsg: 'invocou fogo sagrado!' },
                lightning: { emoji: '⚡', weak: 'earth', res: { lightning: 15, wind: 5, nature: -20 }, skillName: 'Relâmpago Fatal', skillMsg: 'disparou alta voltagem!' },
                legendary: { emoji: '👑', weak: 'holy', res: { fire: 20, ice: 20, dark: 20, holy: -30 }, skillName: 'Calamidade Cósmica', skillMsg: 'reuniu os elementos do caos!' }
            };

            const map = elementMaps[config.element];
            if (map) {
                elementEmoji = map.emoji;
                weakness = map.weak === 'fire' ? '🔥' : map.weak === 'ice' ? '❄️' : map.weak === 'lightning' ? '⚡' : map.weak === 'earth' ? '🪨' : map.weak === 'wind' ? '🌪️' : map.weak === 'holy' ? '✨' : map.weak === 'dark' ? '💀' : '🌿';
                res = map.res;
            }

            const skill = {
                name: map ? map.skillName : 'Ataque Especial',
                trigger: 0.40,
                dmgMult: 2.2,
                msg: map ? map.skillMsg : 'desferiu golpe pesado!'
            };

            let passiveSkill = null;
            if (config.element === 'ice') {
                passiveSkill = { name: 'Toque Glacial', desc: 'Ataques aplicam congelamento' };
            } else if (config.element === 'fire') {
                passiveSkill = { name: 'Manto de Magma', desc: 'Devolve 10% do dano físico recebido' };
            } else if (config.element === 'water') {
                passiveSkill = { name: 'Regeneração das Marés', desc: 'Cura 3% do HP máximo a cada turno' };
            } else if (config.element === 'wind') {
                passiveSkill = { name: 'Esquiva Aérea', desc: '10% de chance de esquivar totalmente' };
            } else if (config.element === 'earth') {
                passiveSkill = { name: 'Pele de Pedra', desc: 'Bloqueia flat 5 dano físico por ataque' };
            } else if (config.element === 'dark') {
                passiveSkill = { name: 'Lifesteal Sombrio', desc: 'Recupera 10% do dano causado como HP' };
            } else if (config.element === 'holy') {
                passiveSkill = { name: 'Resplendor Celeste', desc: 'Reduz todo dano recebido em 12%' };
            } else if (config.element === 'lightning') {
                passiveSkill = { name: 'Estática Eletrizante', desc: '15% de chance de paralisar o jogador' };
            } else if (config.element === 'legendary') {
                passiveSkill = { name: 'Imunidade Universal', desc: 'Reduz dano elemental sofrido em 25%' };
            }

            return {
                id: `w${w}`,
                name: config.name,
                icon: config.icon,
                element: elementEmoji,
                weakness: weakness,
                hp: hp,
                atk: atk,
                def: def,
                gold: gold,
                coins: coins,
                xp: xp,
                isBoss: isBoss,
                res: res,
                skill: skill,
                passiveSkill: passiveSkill
            };
        });

        const arenaShopItems = [
            { id: 'elixir',      name: 'Elixir de Arena',      icon: '💊', cost: 3,  desc: 'Restaura 50% do HP durante a batalha.',  type: 'consumable' },
            { id: 'rune_atk1',  name: 'Runa de Combate I',    icon: '🔶', cost: 15, desc: '+10% dano permanente na arena.',          type: 'passive',   effect: { key: 'arenaDmg', value: 10 } },
            { id: 'rune_atk2',  name: 'Runa de Combate II',   icon: '🔷', cost: 40, desc: '+25% dano permanente na arena.',          type: 'passive',   effect: { key: 'arenaDmg', value: 25 }, requires: 'rune_atk1' },
            { id: 'shield_perk',name: 'Escudo Ancestral',      icon: '🛡️', cost: 25, desc: '-15% dano recebido na arena.',            type: 'passive',   effect: { key: 'arenaDefPct', value: 15 } },
            { id: 'stamina2',   name: 'Stamina Extra',         icon: '⚡', cost: 5,  desc: '+2 de stamina imediatamente.',            type: 'consumable' },
            { id: 'title_glad', name: 'Título: Gladiador',     icon: '🏅', cost: 10, desc: 'Cosmético: título no perfil.',            type: 'title' },
            { id: 'title_champ',name: 'Título: Campeão',       icon: '🏆', cost: 50, desc: 'Cosmético: título dourado.',              type: 'title', requires: 'title_glad' }
        ];

        // Elemento do jogador por classe
        function getPlayerElement() {
            const classId = gameState.player?.classId;
            const map = { warrior: '⚙️', mage: '⚡', rogue: '💀', paladin: '✨', archer: '🌿', default: '⚙️' };
            return map[classId] || map.default;
        }

        // Habilidade de classe na arena
        function getArenaClassSkill() {
            const classId = gameState.player?.classId;
            const skills = {
                warrior: { name: '🔴 Fúria',        cooldown: 4, desc: 'Próximo ataque 3× dano (sem defesa)' },
                mage:    { name: '⚡ Relâmpago',     cooldown: 3, desc: 'Ignora DEF do inimigo' },
                rogue:   { name: '🗡️ Furtivo',      cooldown: 3, desc: 'Crítico garantido (se último turno foi Defender)' },
                paladin: { name: '✨ Escudo Sagrado', cooldown: 5, desc: 'Bloqueia próximo ataque + cura 20% HP' },
                archer:  { name: '🏹 Chuva',         cooldown: 4, desc: '3 ataques com 60% dano cada' }
            };
            return skills[classId] || { name: '⚡ Golpe', cooldown: 3, desc: 'Ataque +50% dano' };
        }

        // Bônus permanentes comprados na loja da arena
        function getArenaShopBonus(key) {
            const purchased = gameState.arena?.shopPurchased || {};
            let total = 0;
            arenaShopItems.forEach(item => {
                if (item.type === 'passive' && purchased[item.id] && item.effect?.key === key) {
                    total += item.effect.value;
                }
            });
            return total;
        }

        // Calcula dano base do jogador na arena
        function calcArenaPlayerDmg(ignoreDef = false, multiplier = 1.0) {
            const a = gameState.arena;
            const enemy = a.currentEnemy;
            const equipBonuses = getEquipmentBonuses();
            let dmg = Math.floor(Math.random() * gameState.combat.playerStrength) + gameState.combat.playerStrength;

            // Bônus de poções
            const combatMult = 1 + applyPotionEffects('combatMult') / 100;
            dmg = Math.floor(dmg * combatMult);

            // Perícia de Arma (Weapon Skill)
            const classId = gameState.player?.classId;
            let weaponType = 'melee';
            if (classId === 'mage') weaponType = 'magic';
            else if (classId === 'archer') weaponType = 'distance';
            
            const wSkillLevel = gameState.weaponSkills?.[weaponType]?.level || 1;
            // +0.5% damage per level above 1
            const wSkillMult = 1 + ((wSkillLevel - 1) * 0.005);
            dmg = Math.floor(dmg * wSkillMult);

            // Pet
            dmg = Math.floor(dmg * applyPetBonus('combat', 'combatBoost'));

            // World Boss Buff (Bênção do Titã)
            if (window.getWorldBossBuffBonus) {
                dmg = Math.floor(dmg * (1 + window.getWorldBossBuffBonus()));
            }

            // Classe (House Targaryen)
            const classDmg = getClassPassive('combatBoost');
            if (classDmg > 0) dmg = Math.floor(dmg * (1 + classDmg / 100));

            // Runa da loja
            const shopDmgBonus = getArenaShopBonus('arenaDmg');
            if (shopDmgBonus > 0) dmg = Math.floor(dmg * (1 + shopDmgBonus / 100));

            // Multiplicador (fúria, chuva, etc)
            dmg = Math.floor(dmg * multiplier);

            // Berserker lowHPDamage: dano aumenta conforme vida perdida (até +50%)
            const berserkerBonus = getCharacterClassPassive('lowHPDamage');
            if (berserkerBonus > 0 && a.playerHP !== undefined) {
                const hpLostPct = 1 - (a.playerHP / gameState.combat.maxPlayerHealth);
                dmg = Math.floor(dmg * (1 + (hpLostPct * berserkerBonus) / 100));
            }

            // Cavaleiro das Trevas: +30% de dano se HP do inimigo < 30%
            if (enemy && enemy.hp && (a.enemyHP / enemy.hp) < 0.30) {
                const execBonus = getCharacterClassPassive('executeBoost');
                if (execBonus > 0) dmg = Math.floor(dmg * (1 + execBonus / 100));
            }

            // Gladiador: +2% de dano por wave ganha na sequência atual (streak)
            const streakBonus = getCharacterClassPassive('streakDamage');
            if (streakBonus > 0) {
                const streakMult = Math.min(40, (a.streak || 0) * streakBonus);
                dmg = Math.floor(dmg * (1 + streakMult / 100));
            }

            // Fraqueza elemental (classe básica)
            const playerEl = getPlayerElement();
            if (enemy && enemy.weakness && enemy.weakness === playerEl) {
                const elemBonus = (window.balancingConfig?.elementalWeaknessBonus !== undefined ? window.balancingConfig.elementalWeaknessBonus : 20) / 100;
                dmg = Math.floor(dmg * (1 + elemBonus));
            }

            // Crítico
            // Atirador de Elite: +25% chance de crítico
            const sharpshooterCrit = getCharacterClassPassive('sharpshooter') ? 25 : 0;
            
            // Gato Preto: +10% Crit Chance, +25% Crit Damage (doc de pets)
            let pBlackCatCrit = 0;
            let pBlackCatCritDmg = 1.0;
            if (gameState.pets.active === 'gato_preto') {
                const petState = getPetState('gato_preto');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'gato_preto') : null;
                const baseCrit = petData ? (petData.effectValue || 10) : 10;
                const baseCritDmg = baseCrit * 2.5; // 25% é 2.5x o base de 10%
                pBlackCatCrit = baseCrit * levelMultiplier;
                pBlackCatCritDmg = 1 + (baseCritDmg * levelMultiplier) / 100;
            }

            const critChance = applyTechBonus('criticalChance') + (equipBonuses.critChance || 0) + getClassPassive('critChance') + sharpshooterCrit + pBlackCatCrit;
            
            // Assassino Sombrio: primeiro hit é crítico garantido
            const firstHitCrit = getCharacterClassPassive('firstHitCrit');
            let isCrit = false;
            if (firstHitCrit > 0 && (a.turnCount || 0) <= 1) {
                isCrit = true;
            } else {
                isCrit = Math.random() * 100 < critChance;
            }

            if (isCrit) {
                const critDamageBonus = equipBonuses.critDamage || 0;
                dmg = Math.floor(dmg * (2 + critDamageBonus / 100) * pBlackCatCritDmg);
            }


            // Subtrai defesa do inimigo (se não ignorar)
            if (!ignoreDef && enemy) {
                let enemyDef = enemy.def;
                
                // Penetração de Armadura
                const penArmor = equipBonuses.armorPenetration || 0;
                if (penArmor > 0) {
                    enemyDef = Math.floor(enemyDef * (1 - (penArmor / 100)));
                }
                // Atirador de Elite: acertos críticos ignoram 30% da defesa
                if (isCrit && getCharacterClassPassive('sharpshooter') > 0) {
                    enemyDef = Math.floor(enemyDef * 0.70);
                }
                dmg = Math.max(1, dmg - Math.floor(enemyDef / 2));
            }

            // Passiva do Inimigo: Pele de Pedra (Bloqueia flat 5 dano físico)
            if (enemy && enemy.passiveSkill?.name === 'Pele de Pedra') {
                dmg = Math.max(1, dmg - 5);
            }

            // Dano Elemental da Arma (Encantamento)
            let elemDmg = 0;
            let elemEmoji = '';
            const weaponEnchant = gameState.player?.enchantments?.weapon;
            if (weaponEnchant && weaponEnchant.startsWith('enchant_atk_')) {
                const elementKey = weaponEnchant.replace('enchant_atk_', '');
                const elementEmojis = { fire: '🔥', ice: '❄️', lightning: '⚡', nature: '🌿', holy: '✨', dark: '💀' };
                elemEmoji = elementEmojis[elementKey] || '🔮';
                
                const enemyRes = enemy ? (enemy.res?.[elementKey] || 0) : 0;
                elemDmg = Math.max(0, Math.floor(15 * (1 - enemyRes / 100)));

                // Passiva do Inimigo: Imunidade Universal (Reduz dano elemental em 25%)
                if (enemy && enemy.passiveSkill?.name === 'Imunidade Universal') {
                    elemDmg = Math.floor(elemDmg * 0.75);
                }
            }

            // Dano Elemental Nativo da Arma equipada
            let nativeElemDmg = 0;
            let nativeElemEmoji = '';
            const weaponId = gameState.equipment.equipped?.weapon;
            if (weaponId) {
                const weaponData = getEquipmentItemData(weaponId);
                if (weaponData && weaponData.element && weaponData.elementValue) {
                    const elKey = weaponData.element;
                    const elementEmojis = { fire: '🔥', ice: '❄️', lightning: '⚡', nature: '🌿', holy: '✨', dark: '💀', water: '💧', wind: '🌪️', earth: '🪨' };
                    nativeElemEmoji = elementEmojis[elKey] || '🔮';
                    
                    const enemyRes = enemy ? (enemy.res?.[elKey] || 0) : 0;
                    let calculatedNative = Math.max(0, Math.floor(weaponData.elementValue * (1 - enemyRes / 100)));
                    
                    // Passiva do Inimigo: Imunidade Universal (Reduz dano elemental em 25%)
                    if (enemy && enemy.passiveSkill?.name === 'Imunidade Universal') {
                        calculatedNative = Math.floor(calculatedNative * 0.75);
                    }
                    
                    nativeElemDmg = calculatedNative;
                }
            }

            const totalElemDmg = elemDmg + nativeElemDmg;
            const trueDmg = equipBonuses.trueDamage || 0;
            let totalDmg = dmg + totalElemDmg + trueDmg;

            // Passiva do Inimigo: Resplendor Celeste (Reduz todo dano recebido em 12%)
            if (enemy && enemy.passiveSkill?.name === 'Resplendor Celeste') {
                totalDmg = Math.floor(totalDmg * 0.88);
            }

            const finalElemEmoji = elemEmoji || nativeElemEmoji;

            return { dmg: Math.max(1, totalDmg), isCrit, physDmg: dmg, elemDmg: totalElemDmg, elemEmoji: finalElemEmoji };
        }

        // Dano do inimigo
        function calcArenaEnemyDmg() {
            const a = gameState.arena;
            const enemy = a.currentEnemy;
            if (!enemy) return 1;
            const equipBonuses = getEquipmentBonuses();
            let dmg = Math.floor(Math.random() * enemy.atk) + Math.floor(enemy.atk * 0.5);

            // Chance de crítico do inimigo
            let critChance = 8; // Padrão
            if (enemy.element === 'wind') critChance = 15;
            else if (enemy.element === 'lightning') critChance = 18;
            else if (enemy.element === 'legendary') critChance = 15;

            const isCrit = Math.random() * 100 < critChance;
            if (isCrit) {
                dmg = Math.floor(dmg * 1.5);
                a.enemyLastHitCrit = true;
            } else {
                a.enemyLastHitCrit = false;
            }

            // Golem de Pedra golemPerk: +50% de defesa dos equipamentos
            let defense = (equipBonuses.defense || 0);

            // Perícia de Escudo (Shielding)
            if (gameState.equipment?.equipped?.shield) {
                const sSkillLevel = gameState.weaponSkills?.shielding?.level || 1;
                // +0.5% block per level above 1
                const sSkillMult = 1 + ((sSkillLevel - 1) * 0.005);
                defense = Math.floor(defense * sSkillMult);
            }

            const golemBonus = getCharacterClassPassive('golemPerk');
            if (golemBonus > 0) {
                defense = Math.floor(defense * (1 + golemBonus / 100));
            }

            // Cavaleiro Tartaruga turtleDefense: Ganha +1 Defesa permanente a cada 50 vitórias na Arena
            const turtleBonus = getCharacterClassPassive('turtleDefense');
            if (turtleBonus > 0) {
                const extraDef = Math.floor((a.wins || 0) / 50);
                defense += extraDef;
            }

            // Passiva Última Guarda: +25% de defesa
            const guardBonus = getClassPassive('defenseBoost');
            if (guardBonus > 0) {
                defense = Math.floor(defense * (1 + guardBonus / 100));
            }

            // Defesa do jogador
            dmg = Math.max(1, dmg - Math.floor(defense / 3));

            // Bônus de defesa da loja
            const defPct = getArenaShopBonus('arenaDefPct');
            if (defPct > 0) dmg = Math.max(1, Math.floor(dmg * (1 - defPct / 100)));

            // Escudeiro Real damageReduction / Última Guarda: Reduz todo dano recebido na Arena
            const squireBonus = getCharacterClassPassive('damageReduction') + getClassPassive('damageReduction');
            if (squireBonus > 0) {
                dmg = Math.max(1, Math.floor(dmg * (1 - squireBonus / 100)));
            }

            // Zumbi flatDamageBlock: Ignora 5 de dano de qualquer ataque físico inimigo
            const zombieBonus = getCharacterClassPassive('flatDamageBlock');
            if (zombieBonus > 0) {
                dmg = Math.max(1, dmg - zombieBonus);
            }

            // Encantamento da Armadura: Redução de 20% se o elemento bater
            const armorEnchant = gameState.player?.enchantments?.armor;
            if (armorEnchant && armorEnchant.startsWith('enchant_def_')) {
                const elementKey = armorEnchant.replace('enchant_def_', '');
                const elementEmojis = { fire: '🔥', ice: '❄️', lightning: '⚡', nature: '🌿', holy: '✨', dark: '💀' };
                const armorElEmoji = elementEmojis[elementKey] || '';
                
                if (armorElEmoji && enemy.element === armorElEmoji) {
                    dmg = Math.max(1, Math.floor(dmg * 0.80)); // Reduz em 20%
                }
            }

            // Reduzir dano pelas resistências nativas das armaduras equipadas
            let totalNativeRes = 0;
            for (let slot in gameState.equipment.equipped) {
                if (slot === 'weapon') continue;
                const id = gameState.equipment.equipped[slot];
                if (!id) continue;
                const eq = getEquipmentItemData(id);
                if (eq && eq.element === enemy.element && eq.elementValue) {
                    totalNativeRes += eq.elementValue;
                }
            }
            totalNativeRes = Math.min(75, totalNativeRes); // Limita resistência nativa em 75%
            if (totalNativeRes > 0) {
                dmg = Math.max(1, Math.floor(dmg * (1 - totalNativeRes / 100)));
            }

            return Math.max(1, dmg);
        }

        // Log de batalha
        function arenaLog(msg, type = 'info') {
            const a = gameState.arena;
            a.battleLog.unshift({ msg, type, time: Date.now() });
            if (a.battleLog.length > 12) a.battleLog.pop();
            renderArenaBattleLog();
        }

        function renderArenaBattleLog() {
            const el = document.getElementById('arenaBattleLog');
            if (!el) return;
            el.innerHTML = gameState.arena.battleLog.map(entry => {
                const cls = entry.type === 'player' ? 'arena-log-player' : entry.type === 'enemy' ? 'arena-log-enemy' : entry.type === 'system' ? 'arena-log-system' : 'arena-log-info';
                return `<div class="arena-log-entry ${cls}">${entry.msg}</div>`;
            }).join('');
        }

        // Inicia batalha de uma wave
        function initArenaBattle() {
            const a = gameState.arena;
            if (a.inBattle) return;
            if (a.stamina <= 0) {
                showNotification('⚡ Sem Stamina!', 'Aguarde a regeneração de stamina.', 'error', '⚡');
                return;
            }

            const waveIndex = Math.min((a.wave - 1), arenaEnemies.length - 1);
            const enemy = { ...arenaEnemies[waveIndex] };
            
            const arenaScaling = window.balancingConfig?.arenaWaveScaling || 1.0;
            if (arenaScaling !== 1.0) {
                enemy.maxHp = Math.max(1, Math.floor((enemy.maxHp || 50) * arenaScaling));
                enemy.hp = enemy.maxHp;
                if (enemy.atk) enemy.atk = Math.max(1, Math.floor(enemy.atk * arenaScaling));
                if (enemy.def) enemy.def = Math.max(0, Math.floor(enemy.def * arenaScaling));
            }

            // EVENTO GLOBAL: Fúria da Arena (+20% HP para inimigos da Arena)
            if (window.activeGlobalEvent === 'arena_fury') {
                enemy.maxHp = Math.floor(enemy.maxHp * 1.2);
                enemy.hp = enemy.maxHp;
            }

            a.currentEnemy = enemy;
            a.playerHP = gameState.combat.maxPlayerHealth;
            a.enemyHP = enemy.hp;
            a.inBattle = true;
            a.defenseMode = false;
            a.cooldowns = {};
            a.pendingRage = false;
            a.lastAction = null;
            a.battleLog = [];
            // a.stamina = Math.max(0, a.stamina - 1); (Sem gasto de stamina para testes)

            arenaLog(`⚔️ Batalha iniciada! Wave ${a.wave} — ${enemy.icon} ${enemy.name} (${enemy.element})`, 'system');
            if (enemy.weakness) arenaLog(`💡 Fraqueza elemental: ${enemy.weakness}`, 'system');
            if (enemy.isBoss) arenaLog(`🔴 BOSS DETECTADO! Prepare-se para o ataque especial!`, 'system');

            renderArenaPage();

            if (a.autoMode) {
                if (a.autoInterval) clearInterval(a.autoInterval);
                a.autoInterval = setInterval(() => {
                    if (!gameState.arena.inBattle) { clearInterval(gameState.arena.autoInterval); return; }
                    arenaPlayerAction('attack');
                }, 1200);
            }
        }

        // Ação do turno do jogador
        function arenaPlayerAction(action) {
            const a = gameState.arena;
            if (!a.inBattle) return;

            // Passiva Jardins Eternos: Regenera +5 de Vida por turno
            const regen = getClassPassive('regenHealth');
            if (regen > 0 && a.playerHP > 0) {
                const maxHP = gameState.combat.maxPlayerHealth || 100;
                a.playerHP = Math.min(maxHP, a.playerHP + regen);
                arenaLog(`🌹 Jardins Eternos: Regenerou +${regen}❤️!`, 'player');
            }

            if (a.playerFrozen) {
                a.playerFrozen = false;
                arenaLog(`❄️ Você está congelado e perdeu o turno!`, 'system');
                setTimeout(() => arenaEnemyTurn(), 1000);
                return;
            }
            if (a.playerParalyzed) {
                a.playerParalyzed = false;
                arenaLog(`⚡ Você está paralisado e perdeu o turno!`, 'system');
                setTimeout(() => arenaEnemyTurn(), 1000);
                return;
            }

            if (!a.turnCount) a.turnCount = 0;
            a.turnCount++;

            const classSkill = getArenaClassSkill();
            const cooldownKey = 'skill';
            if (a.cooldowns[cooldownKey] > 0) a.cooldowns[cooldownKey]--;

            // Passiva do Inimigo: Esquiva Aérea (10% de chance de esquivar de ataques/skills)
            const canEvade = action === 'attack' || action === 'skill';
            if (canEvade && a.currentEnemy?.passiveSkill?.name === 'Esquiva Aérea' && Math.random() < 0.10) {
                arenaLog(`🌪️ Esquiva Aérea: ${a.currentEnemy.name} esquivou totalmente do seu ataque!`, 'enemy');
                if (action === 'attack') {
                    a.defenseMode = false;
                    a.pendingRage = false;
                } else if (action === 'skill') {
                    let cd = classSkill.cooldown;
                    const cdRed = getCharacterClassPassive('cooldownReduction');
                    if (cdRed > 0) cd = Math.max(1, cd - cdRed);
                    a.cooldowns[cooldownKey] = cd;
                    a.defenseMode = false;
                }
                a.lastAction = action;
                renderArenaHPBars();
                setTimeout(() => arenaEnemyTurn(), 1000);
                return;
            }

            let playerDmg = 0;
            let logMsg = '';

            if (action === 'attack') {
                a.defenseMode = false;
                let mult = 1.0;
                if (a.pendingRage) { mult = 3.0; a.pendingRage = false; }
                const { dmg, isCrit, physDmg, elemDmg, elemEmoji } = calcArenaPlayerDmg(false, mult);
                playerDmg = dmg;
                a.enemyHP -= playerDmg;
                triggerHitSparkle();
                spawnArenaFloatingDmg('arenaEnemyFighter', playerDmg, 'damage', '#ff4444');
                if (isCrit) spawnArenaFloatingDmg('arenaEnemyFighter', '⚡CRÍTICO!', 'special', '#ffdd00');

                // --- Habilidades Especiais de Mascotes em Ataque ---
                if (a.currentEnemy) {
                    // Pinguim Glacial: ataca a cada 4 turnos com 50% de chance de congelar
                    if (gameState.pets.active === 'pinguim_glacial') {
                        if (a.turnCount > 0 && a.turnCount % 4 === 0) {
                            arenaLog(`🐧 Pinguim Glacial atacou!`, 'player');
                            const petState = getPetState('pinguim_glacial');
                            const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                            const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'pinguim_glacial') : null;
                            const baseChance = petData ? (petData.effectValue || 50) : 50;
                            const freezeChance = baseChance * levelMultiplier;
                            if (Math.random() * 100 < freezeChance) {
                                a.enemyFrozen = true;
                                arenaLog(`❄️ O Pinguim Glacial CONGELOU ${a.currentEnemy.name}! Ele perderá o próximo turno!`, 'player');
                            }
                        }
                    }

                    // Cobra Peçonhenta: 20% de chance base de envenenar, escalando com nível
                    if (gameState.pets.active === 'cobra_peconhenta') {
                        const petState = getPetState('cobra_peconhenta');
                        const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                        const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'cobra_peconhenta') : null;
                        const baseChance = petData ? (petData.effectValue || 20) : 20;
                        const poisonChance = baseChance * levelMultiplier;
                        if (Math.random() * 100 < poisonChance) {
                            const weaponId = gameState.equipment.equipped?.weapon;
                            let weaponBaseDmg = 5;
                            if (weaponId) {
                                const weaponData = getEquipmentItemData(weaponId);
                                if (weaponData && weaponData.stats && weaponData.stats.strength) {
                                    weaponBaseDmg = weaponData.stats.strength;
                                }
                            }
                            const poisonDmg = Math.max(1, Math.floor(weaponBaseDmg * 0.05 * levelMultiplier));
                            a.enemyPoisoned = true;
                            a.enemyPoisonTurns = 4;
                            a.enemyPoisonDmg = poisonDmg;
                            arenaLog(`🐍 Envenenado! A Cobra Peçonhenta envenenou ${a.currentEnemy.name} por 4 turnos (${poisonDmg} dano/turno)!`, 'player');
                        }
                    }

                    // Dragãozinho: 30% de chance de queimar
                    const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'dragaozinho') : null;
                    const baseMelt = petData ? (petData.effectValue || 20) : 20;
                    const burnChance = baseMelt * 1.5; // 30% é 1.5x o base de 20%
                    if (gameState.pets.active === 'dragaozinho' && Math.random() * 100 < burnChance) {
                        const petState = getPetState('dragaozinho');
                        const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                        const burnDmg = Math.max(2, Math.floor(10 * levelMultiplier));
                        a.enemyBurned = true;
                        a.enemyBurnTurns = 3;
                        a.enemyBurnDmg = burnDmg;
                        arenaLog(`🐉 Queimadura! Dragãozinho cuspiu fogo em ${a.currentEnemy.name} por 3 turnos (${burnDmg} dano/turno)!`, 'player');
                    }
                }
                
                logMsg = `${isCrit ? '💥 CRÍTICO! ' : '⚔️ '}Você causou <strong>${physDmg}</strong> dano físico`;

                if (elemDmg > 0) {
                    logMsg += ` + <strong>${elemDmg}</strong> dano elemental (${elemEmoji})`;
                }
                logMsg += mult > 1 ? ` (×${mult} FÚRIA!)` : '';
                logMsg += a.currentEnemy?.weakness === getPlayerElement() ? ' ⚡ FRAQUEZA!' : '';
                arenaLog(logMsg, 'player');

                // Lifesteal (Tech + Equip + Vampiro passive)
                const vampireLifesteal = getCharacterClassPassive('lifesteal'); // +5%
                const lifestealPct = applyTechBonus('lifesteal') + (getEquipmentBonuses().lifesteal || 0) + vampireLifesteal;
                if (lifestealPct > 0) {
                    const heal = Math.max(1, Math.floor(playerDmg * lifestealPct / 100));
                    a.playerHP = Math.min(a.playerHP + heal, gameState.combat.maxPlayerHealth);
                    arenaLog(`🩸 Vampirismo: +${heal}❤️`, 'player');
                }

                // Alquimista Dourado damageToGold perk
                const midasPct = getCharacterClassPassive('damageToGold');
                if (midasPct > 0) {
                    const goldGained = Math.max(1, Math.floor(playerDmg * (midasPct / 100)));
                    gameState.gold = (gameState.gold || 0) + goldGained;
                    arenaLog(`🪙 Midas: Convertido dano em +${goldGained} ouro!`, 'system');
                }

            } else if (action === 'defend') {
                a.defenseMode = true;
                a.lastAction = 'defend';
                arenaLog(`🛡️ Você assumiu postura defensiva!`, 'player');

            } else if (action === 'skill') {
                if ((a.cooldowns[cooldownKey] || 0) > 0) {
                    arenaLog(`⏳ Habilidade em cooldown! (${a.cooldowns[cooldownKey]} turnos)`, 'info');
                    return;
                }
                
                let cd = classSkill.cooldown;
                const cdRed = getCharacterClassPassive('cooldownReduction');
                if (cdRed > 0) cd = Math.max(1, cd - cdRed);
                a.cooldowns[cooldownKey] = cd;
                a.defenseMode = false;

                const skillBoost = getCharacterClassPassive('skillBoost');
                const skillMult = 1 + (skillBoost / 100);

                const classId = gameState.player?.classId;
                if (classId === 'warrior') {
                    a.pendingRage = true;
                    arenaLog(`🔴 FÚRIA ATIVADA! Próximo ataque causa 3× dano!`, 'player');
                } else if (classId === 'mage') {
                    const { dmg } = calcArenaPlayerDmg(true, 1.5 * skillMult); // ignora DEF
                    playerDmg = dmg;
                    a.enemyHP -= playerDmg;
                    triggerHitSparkle();
                    spawnArenaFloatingDmg('arenaEnemyFighter', playerDmg, 'damage', '#aa44ff');
                    // Efeito heartbeat ao usar skill
                    const _skillPF = document.getElementById('arenaPlayerFighter');
                    if (_skillPF) { _skillPF.classList.add('heartbeat'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('heartbeat'); }, 600); }
                    arenaLog(`⚡ RELÂMPAGO! ${playerDmg} dano ignorando defesa!`, 'player');
                } else if (classId === 'rogue') {
                    const wasDefending = a.lastAction === 'defend';
                    const { dmg } = calcArenaPlayerDmg(false, (wasDefending ? 2.5 : 1.5) * skillMult);
                    playerDmg = dmg;
                    a.enemyHP -= playerDmg;
                    triggerHitSparkle();
                    spawnArenaFloatingDmg('arenaEnemyFighter', playerDmg, 'damage', '#ff8844');
                    // Efeito heartbeat ao usar skill
                    const _roguePF = document.getElementById('arenaPlayerFighter');
                    if (_roguePF) { _roguePF.classList.add('heartbeat'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('heartbeat'); }, 600); }
                    arenaLog(`🗡️ GOLPE FURTIVO! ${playerDmg} dano${wasDefending ? ' (bônus de defesa!)' : ''}!`, 'player');
                } else if (classId === 'paladin') {
                    a.defenseMode = true; // bloqueará próximo ataque
                    // Efeito glowPulse no jogador ao ativar escudo
                    const _glowPF = document.getElementById('arenaPlayerFighter');
                    if (_glowPF) _glowPF.classList.add('glowPulse');
                    const heal = Math.floor(gameState.combat.maxPlayerHealth * 0.20 * skillMult);
                    a.playerHP = Math.min(a.playerHP + heal, gameState.combat.maxPlayerHealth);
                    spawnArenaFloatingDmg('arenaPlayerFighter', heal, 'heal', '#44ff44');
                    arenaLog(`✨ ESCUDO SAGRADO! Bloqueará próximo ataque + curou ${heal}❤️!`, 'player');
                } else if (classId === 'archer') {
                    let totalArcher = 0;
                    for (let i = 0; i < 3; i++) {
                        const { dmg } = calcArenaPlayerDmg(false, 0.6 * skillMult);
                        totalArcher += dmg;
                        a.enemyHP -= dmg;
                        triggerHitSparkle();
                        spawnArenaFloatingDmg('arenaEnemyFighter', dmg, 'damage', '#66cc44');
                    }
                    playerDmg = totalArcher;
                    // Efeito heartbeat ao usar skill
                    const _archerPF = document.getElementById('arenaPlayerFighter');
                    if (_archerPF) { _archerPF.classList.add('heartbeat'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('heartbeat'); }, 600); }
                    arenaLog(`🏹 CHUVA DE FLECHAS! 3 ataques = ${totalArcher} dano total!`, 'player');
                } else {
                    const { dmg } = calcArenaPlayerDmg(false, 1.5 * skillMult);
                    playerDmg = dmg;
                    a.enemyHP -= playerDmg;
                    triggerHitSparkle();
                    spawnArenaFloatingDmg('arenaEnemyFighter', playerDmg, 'damage', '#ff4444');
                    // Efeito heartbeat ao usar skill
                    const _defSkillPF = document.getElementById('arenaPlayerFighter');
                    if (_defSkillPF) { _defSkillPF.classList.add('heartbeat'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('heartbeat'); }, 600); }
                    arenaLog(`⚡ GOLPE ESPECIAL! ${playerDmg} dano!`, 'player');
                }

                // Alquimista Dourado damageToGold perk para skills
                if (playerDmg > 0) {
                    const midasPct = getCharacterClassPassive('damageToGold');
                    if (midasPct > 0) {
                        const goldGained = Math.max(1, Math.floor(playerDmg * (midasPct / 100)));
                        gameState.gold = (gameState.gold || 0) + goldGained;
                        arenaLog(`🪙 Midas: Convertido dano em +${goldGained} ouro!`, 'system');
                    }
                }

            } else if (action === 'heal') {
                // Curar com peixe cozido ou elixir de arena
                const hasElixir = a.shopPurchased?.elixir_stock > 0;
                const cookedFish = ['cookedFish1', 'cookedFish2', 'cookedFish3', 'cookedFish4', 'cookedFish5'];
                let healed = false;
                for (let f of cookedFish) {
                    if ((gameState.inventory[f] || 0) > 0) {
                        const heal = getItemHeal(f);
                        gameState.inventory[f]--;
                        a.playerHP = Math.min(a.playerHP + heal, gameState.combat.maxPlayerHealth);
                        arenaLog(`🍖 Usou comida! +${heal}❤️`, 'player');
                        healed = true;
                        break;
                    }
                }
                if (!healed) {
                    arenaLog(`❌ Sem comida disponível!`, 'info');
                    return;
                }

            } else if (action === 'flee') {
                a.inBattle = false;
                a.autoMode = false;
                if (a.autoInterval) { clearInterval(a.autoInterval); a.autoInterval = null; }
                a.streak = 0;
                arenaLog(`🏃 Você fugiu da batalha e desativou o auto-battle!`, 'system');
                renderArenaPage();
                return;
            }

            // Passiva do Inimigo: Manto de Magma (Reflete 10% do dano causado pelo jogador)
            if (playerDmg > 0 && a.currentEnemy?.passiveSkill?.name === 'Manto de Magma') {
                const reflect = Math.max(1, Math.floor(playerDmg * 0.10));
                a.playerHP = Math.max(0, a.playerHP - reflect);
                arenaLog(`🔥 Manto de Magma: ${a.currentEnemy.name} refletiu +${reflect} dano de fogo de volta em você!`, 'enemy');
                
                if (a.playerHP <= 0) {
                    a.playerHP = 0;
                    arenaLog(`💀 Você morreu devido ao dano refletido!`, 'system');
                    arenaDefeat();
                    return;
                }
            }

            // Verificar se inimigo morreu
            if (a.enemyHP <= 0) {
                arenaVictory();
                return;
            }

            a.lastAction = action;
            renderArenaHPBars();

            // Turno do inimigo
            setTimeout(() => arenaEnemyTurn(), 400);
        }

        // Turno do inimigo
        function arenaEnemyTurn() {
            const a = gameState.arena;
            if (!a.inBattle) return;
            const enemy = a.currentEnemy;

            // --- Pinguim Glacial: inimigo congelado perde a ação ---
            if (a.enemyFrozen) {
                a.enemyFrozen = false;
                arenaLog(`❄️ ${enemy.name} está congelado e perdeu o turno!`, 'system');
                renderArenaHPBars();
                return;
            }

            // --- Cobra Peçonhenta & Dragãozinho: dano por segundo/turno (DOT) ---
            if (a.enemyPoisoned && a.enemyPoisonTurns > 0) {
                const poisonDmg = a.enemyPoisonDmg || 5;
                a.enemyHP = Math.max(0, a.enemyHP - poisonDmg);
                a.enemyPoisonTurns--;
                arenaLog(`🐍 Veneno: ${enemy.name} sofreu <strong>${poisonDmg}</strong> dano de veneno! (${a.enemyPoisonTurns} turnos restantes)`, 'player');
                if (a.enemyPoisonTurns <= 0) a.enemyPoisoned = false;
                if (a.enemyHP <= 0) {
                    arenaVictory();
                    return;
                }
            }

            if (a.enemyBurned && a.enemyBurnTurns > 0) {
                const burnDmg = a.enemyBurnDmg || 10;
                a.enemyHP = Math.max(0, a.enemyHP - burnDmg);
                a.enemyBurnTurns--;
                arenaLog(`🔥 Queimadura: ${enemy.name} sofreu <strong>${burnDmg}</strong> dano de fogo! (${a.enemyBurnTurns} turnos restantes)`, 'player');
                if (a.enemyBurnTurns <= 0) a.enemyBurned = false;
                if (a.enemyHP <= 0) {
                    arenaVictory();
                    return;
                }
            }

            // Espectro dodgeChance perk: +15% de chance de esquivar de ataques inimigos na Arena
            const wraithDodge = getCharacterClassPassive('dodgeChance');
            if (wraithDodge > 0 && Math.random() * 100 < wraithDodge) {
                arenaLog(`👻 Intangível: Você se esquivou do ataque de ${enemy.name}!`, 'player');
                renderArenaHPBars();
                return;
            }

            // --- Pavão Exibido: 15% de chance de o inimigo errar o ataque ---
            let pavaoBlindChance = 0;
            if (gameState.pets.active === 'pavao_exibido') {
                const petState = getPetState('pavao_exibido');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'pavao_exibido') : null;
                const basePavao = petData ? (petData.effectValue || 15) : 15;
                pavaoBlindChance = basePavao * levelMultiplier;
            }
            if (pavaoBlindChance > 0 && Math.random() * 100 < pavaoBlindChance) {
                arenaLog(`🦚 Pavão Exibido: Penas brilhantes distraíram ${enemy.name} e ele errou o ataque!`, 'player');
                renderArenaHPBars();
                return;
            }

            // Regeneração das Marés: Cura 3% do HP máximo a cada turno
            if (enemy.passiveSkill?.name === 'Regeneração das Marés') {
                const heal = Math.floor(enemy.hp * 0.03);
                a.enemyHP = Math.min(enemy.hp, a.enemyHP + heal);
                arenaLog(`💧 Regeneração das Marés: ${enemy.name} recuperou +${heal}❤️!`, 'enemy');
            }

            // Inimigo usa habilidade se HP < threshold
            const hpPct = a.enemyHP / enemy.hp;
            let dmg = calcArenaEnemyDmg();
            const isCrit = a.enemyLastHitCrit;

            if (hpPct < enemy.skill.trigger && Math.random() < 0.45) {
                dmg = Math.floor(dmg * enemy.skill.dmgMult);
                arenaLog(`💥 CRÍTICO DO CHEFE! ${enemy.icon} ${enemy.name} ${enemy.skill.msg} — <strong>${dmg}</strong> dano!`, 'enemy');
            } else {
                if (isCrit) {
                    arenaLog(`💥 CRÍTICO! ${enemy.icon} ${enemy.name} desferiu um golpe crítico! — <strong>${dmg}</strong> dano`, 'enemy');
                } else {
                    arenaLog(`💢 ${enemy.icon} ${enemy.name} atacou! — <strong>${dmg}</strong> dano`, 'enemy');
                }
            }

            // Defesa bloqueia ou reduz
            if (a.defenseMode) {
                const blocked = Math.floor(dmg * 0.65);
                dmg = Math.max(1, dmg - blocked);
                arenaLog(`🛡️ Defesa! ${blocked} dano bloqueado.`, 'player');
                spawnArenaFloatingDmg('arenaPlayerFighter', blocked, 'heal', '#44aaff');
                // Remove glowPulse ao consumir defesa
                const _defPF = document.getElementById('arenaPlayerFighter');
                if (_defPF) _defPF.classList.remove('glowPulse');
                a.defenseMode = false;
            }

            a.playerHP -= dmg;
            // Efeito shake ao tomar dano
            const _dmgPF = document.getElementById('arenaPlayerFighter');
            if (_dmgPF) { _dmgPF.classList.add('shake'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('shake'); }, 600); }
            spawnArenaFloatingDmg('arenaPlayerFighter', dmg, 'damage', '#ff4444');

            // --- Crocodilo Casca-Grossa: refletir 15% do dano físico recebido ---
            if (gameState.pets.active === 'crocodilo_casca_grossa' && dmg > 0) {
                const petState = getPetState('crocodilo_casca_grossa');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'crocodilo_casca_grossa') : null;
                const baseReflect = petData ? (petData.effectValue || 15) : 15;
                const reflectPct = baseReflect * levelMultiplier;
                const reflectDmg = Math.max(1, Math.floor(dmg * reflectPct / 100));
                a.enemyHP = Math.max(0, a.enemyHP - reflectDmg);
                arenaLog(`🐊 Crocodilo Casca-Grossa: Refletiu <strong>${reflectDmg}</strong> dano de volta para ${enemy.name}!`, 'player');
                if (a.enemyHP <= 0) {
                    arenaVictory();
                    return;
                }
            }

            // Lifesteal Sombrio: Recupera 10% do dano causado como HP
            if (enemy.passiveSkill?.name === 'Lifesteal Sombrio') {
                const heal = Math.floor(dmg * 0.10);
                a.enemyHP = Math.min(enemy.hp, a.enemyHP + heal);
                arenaLog(`💀 Lifesteal Sombrio: ${enemy.name} sugou +${heal}❤️ de vida!`, 'enemy');
            }


            // Toque Glacial / Estática Eletrizante
            const equipBonuses = getEquipmentBonuses();
            const tenacity = equipBonuses.tenacity || 0;
            const resistStatusMult = Math.max(0, 1 - (tenacity / 100));

            if (enemy.passiveSkill?.name === 'Toque Glacial' && Math.random() < 0.15 * resistStatusMult) {
                a.playerFrozen = true;
                arenaLog(`❄️ Toque Glacial: Você foi CONGELADO e perderá o próximo turno!`, 'enemy');
            }
            if (enemy.passiveSkill?.name === 'Estática Eletrizante' && Math.random() < 0.15 * resistStatusMult) {
                a.playerParalyzed = true;
                arenaLog(`⚡ Estática Eletrizante: Você foi PARALISADO e perderá o próximo turno!`, 'enemy');
            }

            // Morte e ressurreição do jogador
            if (a.playerHP <= 0) {
                // Reencarnado Segunda Chance passive: revive uma vez com 30% HP
                const revivePct = getCharacterClassPassive('reviveOnce');
                if (revivePct > 0 && !a.hasRevived) {
                    a.hasRevived = true;
                    a.playerHP = Math.floor(gameState.combat.maxPlayerHealth * (revivePct / 100));
                    arenaLog(`🔄 Segunda Chance: Você reviveu com ${a.playerHP}❤️!`, 'system');
                } else {
                    const equipBonuses = getEquipmentBonuses();
                    if ((equipBonuses.phoenix || 0) > 0 && !a.hasRevived) {
                        a.hasRevived = true;
                        a.playerHP = Math.floor(gameState.combat.maxPlayerHealth * 0.20);
                        arenaLog(`🔥 FÊNIX! Você ressuscitou com ${a.playerHP}❤️!`, 'system');
                    } else {
                        a.playerHP = 0;
                        arenaDefeat();
                        return;
                    }
                }
            }

            renderArenaHPBars();
        }

        // Vitória na arena
        function arenaVictory() {
            const a = gameState.arena;
            a.inBattle = false;
            // Efeito Sparkle no inimigo ao morrer
            const _victoryEF = document.getElementById('arenaEnemyFighter');
            if (_victoryEF) { _victoryEF.classList.add('sparkle'); setTimeout(function(){ const e=document.getElementById('arenaEnemyFighter'); if(e)e.classList.remove('sparkle'); }, 2200); }
            // Efeito Rainbow no jogador ao vencer
            const _victoryPF = document.getElementById('arenaPlayerFighter');
            if (_victoryPF) { _victoryPF.classList.add('rainbow'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('rainbow'); }, 2500); }
            a.hasRevived = false;
            if (a.autoInterval) clearInterval(a.autoInterval);

            const enemy = a.currentEnemy;
            a.wins++;
            a.streak++;
            if (a.streak > a.bestStreak) a.bestStreak = a.streak;

            // Multiplicador de streak
            let streakMult = 1.0;
            if (a.streak >= 10) streakMult = 2.0;
            else if (a.streak >= 5) streakMult = 1.5;

            const goldMult = 1 + (applyPotionEffects('goldBoost') + getClassPassive('goldBoost')) / 100;
            
            // Porco Capitalista: +40% ouro na vitória da Arena (escalado por nível)
            let petGoldMult = 1.0;
            if (gameState.pets.active === 'porco_capitalista') {
                const petState = getPetState('porco_capitalista');
                const levelMultiplier = 1 + (petState.level - 1) * 0.15;
                const petData = typeof pets !== 'undefined' ? pets.find(p => p.id === 'porco_capitalista') : null;
                const baseGold = petData ? (petData.effectValue || 40) : 40;
                petGoldMult += (baseGold * levelMultiplier) / 100;
            }

            const admGoldMult = window.balancingConfig?.arenaGoldMult || 1.0;
            const admCoinMult = window.balancingConfig?.arenaCoinMult || 1.0;

            let goldReward = Math.floor(enemy.gold * goldMult * streakMult * petGoldMult * admGoldMult);

            let coinsReward = Math.floor(enemy.coins * streakMult * admCoinMult);
            let xpReward = Math.floor(enemy.xp * streakMult);

            // World Boss Buff (Bênção do Titã)
            if (window.getWorldBossBuffBonus) {
                const wBossBonus = window.getWorldBossBuffBonus();
                goldReward = Math.floor(goldReward * (1 + wBossBonus));
                xpReward = Math.floor(xpReward * (1 + wBossBonus));
            }
            
            // EVENTO GLOBAL: Fúria da Arena (2x loot)
            if (window.activeGlobalEvent === 'arena_fury') {
                goldReward *= 2;
                coinsReward *= 2;
                xpReward *= 2;
            }

            const jokerChance = getCharacterClassPassive('bossDoubleDrop');
            let jokerDoubled = false;
            if (enemy.isBoss && jokerChance > 0 && Math.random() * 100 < jokerChance) {
                goldReward *= 2;
                coinsReward *= 2;
                xpReward *= 2;
                jokerDoubled = true;
            }

            gameState.gold += goldReward;
            a.arenaCoins += coinsReward;

            // Pontos semanais
            const basePoints = enemy.isBoss ? 25 : 10;
            a.weeklyPoints += Math.floor(basePoints * streakMult);

            addXP('mining', Math.floor(xpReward / 2));
            addXP('woodcutting', Math.floor(xpReward / 2));

            // Avançar wave ou manter farm
            if (a.maxWave === undefined) a.maxWave = a.wave || 1;
            
            if (a.wave === a.maxWave) {
                if (a.maxWave >= 90) {
                    a.maxWave = 1;
                    a.wave = 1;
                    arenaLog(`🏆 COMPLETOU TODAS AS WAVES! Reiniciando da wave 1 com inimigos mais fortes!`, 'system');
                } else {
                    a.maxWave++;
                    a.wave = a.maxWave;
                }
            } else {
                arenaLog(`🌾 Farmando na wave ${a.wave} (Progresso máximo: wave ${a.maxWave})`, 'system');
            }

            const streakMsg = a.streak >= 2 ? ` 🔥×${a.streak}` : '';
            arenaLog(`✅ VITÓRIA! +${goldReward}💰 +${coinsReward}🏟️ +${xpReward}XP${streakMsg}`, 'system');
            showNotification('🏆 Vitória!', `${enemy.icon} ${enemy.name} derrotado! +${goldReward}💰 +${coinsReward}🏟️`, 'success', enemy.icon);
            
            // Efeito visual de vitória
            if (typeof triggerCombatVictoryEffect === 'function') {
                triggerCombatVictoryEffect();
            }

            // Drop de equipamento (base rate configurável, 1.75x para boss)
            const equipBonuses = getEquipmentBonuses();
            const lootLuckBonus = (equipBonuses.lootLuck || 0) / 100;
            const admBaseDropRate = (window.balancingConfig?.arenaEquipDropRate !== undefined ? window.balancingConfig.arenaEquipDropRate : 15) / 100;
            const dropChance = (enemy.isBoss ? admBaseDropRate * 1.75 : admBaseDropRate) + lootLuckBonus;
            const drops = enemyEquipDrops[gameState.combat.enemyType] || enemyEquipDrops['goblin'] || [];
            if (drops.length > 0 && Math.random() < dropChance) {
                const dropId = drops[Math.floor(Math.random() * drops.length)];
                const dropEq = equipmentData[dropId];
                if (dropEq) {
                    addNewEquipmentToInventory(dropId);
                    arenaLog(`🌟 Drop! ${dropEq.icon} ${dropEq.name} encontrado!`, 'system');

                    const jokerChance = getCharacterClassPassive('bossDoubleDrop');
                    if (enemy.isBoss && jokerChance > 0 && Math.random() * 100 < jokerChance) {
                        addNewEquipmentToInventory(dropId);
                        arenaLog(`🃏 Truque do Caos! Dobrou o drop de equipamento do chefe!`, 'system');
                    }
                }
            }

            initAchievements();
            gameState.stats.totalKills = (gameState.stats.totalKills || 0) + 1;
            
            // GRANDE OBSERVATÓRIO - Atualiza estatísticas globais
            incrementMonsterKilled();
            if (enemy.isBoss) {
                recordBossKill(enemy.id);
            }
            if (gameState.combat.critThisTurn && gameState.combat.critThisTurn > globalStats.maxCritDamage) {
                recordCritDamage(gameState.combat.critThisTurn, gameState.player?.name || 'Jogador');
            }
            
            // Perícias de Arma (EXP) - baseado no tipo de arma equipada
            const equippedWeapon = gameState.equipment?.equipped?.weapon;
            let weaponType = 'melee'; // padrão
            
            if (equippedWeapon) {
                const weaponData = typeof getEquipmentItemData === 'function'
                    ? getEquipmentItemData(equippedWeapon)
                    : (equipmentData[equippedWeapon] || (typeof getBaseEquipmentKey === 'function' ? equipmentData[getBaseEquipmentKey(equippedWeapon)] : null));
                if (weaponData && weaponData.weaponSkillType) {
                    weaponType = weaponData.weaponSkillType;
                }
            }
            
            // EXP baseada na wave
            const xpGained = Math.floor(10 + a.wave / 5);
            advanceWeaponSkill(weaponType, xpGained);
            
            // XP de Shielding se tiver escudo equipado
            if (gameState.equipment?.equipped?.shield) {
                advanceWeaponSkill('shielding', xpGained);
            }
            
            // Bestiário
            if (!gameState.bestiary) gameState.bestiary = {};
            const mobId = enemy.id || enemy.name;
            if (!gameState.bestiary[mobId]) {
                gameState.bestiary[mobId] = { name: enemy.name, count: 0, icon: enemy.icon };
            }
            gameState.bestiary[mobId].count++;
            checkAchievements();
            saveGame();
            renderArenaPage();
            // Auto-battle contínuo
            if (a.autoMode) {
                setTimeout(() => {
                    if (a.autoMode && !a.inBattle) {
                        if (a.stamina > 0) {
                            initArenaBattle();
                        } else {
                            arenaLog(`⏳ Aguardando regeneração de stamina para continuar...`, 'system');
                        }
                    }
                }, 1500);
            }
        }

        // Progresso de Perícia de Arma (Weapon Skill)
        function advanceWeaponSkill(skillKey, amount) {
            if (!gameState.weaponSkills) return;
            if (!gameState.weaponSkills[skillKey]) return;
            
            const skill = gameState.weaponSkills[skillKey];
            if (skill.level >= 1000) return; // Max level
            
            skill.xp += amount;
            
            let req = skill.level * 100;
            let leveledUp = false;
            while (skill.xp >= req && skill.level < 1000) {
                skill.xp -= req;
                skill.level++;
                leveledUp = true;
                req = skill.level * 100;
            }
            
            if (leveledUp) {
                const names = { melee: 'Corpo a Corpo', magic: 'Mágica', distance: 'Distância', shielding: 'Defesa' };
                showNotification('🗡️ Perícia Evoluiu!', `Sua perícia em ${names[skillKey]} subiu para o nível ${skill.level}!`, 'success', '✨');
                arenaLog(`✨ Perícia de ${names[skillKey]} evoluiu para o nível ${skill.level}!`, 'system');
            }
        }

        // Derrota na arena
        function arenaDefeat() {
            const a = gameState.arena;
            a.inBattle = false;
            a.hasRevived = false;
            if (a.autoInterval) clearInterval(a.autoInterval);
            const prevStreak = a.streak;
            a.streak = 0;
            arenaLog(`💀 DERROTA! Sequência de ${prevStreak} vitórias encerrada.`, 'system');
            showNotification('💀 Derrota!', `Você foi derrotado! Sequência perdida (${prevStreak} vitórias).`, 'error', '💀');
            
            // Efeito visual de derrota
            // Flicker no jogador ao ser derrotado
            const _defeatPF = document.getElementById('arenaPlayerFighter');
            if (_defeatPF) { _defeatPF.classList.add('flicker'); setTimeout(function(){ const e=document.getElementById('arenaPlayerFighter'); if(e)e.classList.remove('flicker'); }, 1500); }
            if (typeof triggerScreenShake === 'function') {
                triggerScreenShake(6, 500);
            }
            gameState.combat.playerHealth = Math.max(1, Math.floor(gameState.combat.maxPlayerHealth * 0.3));
            renderArenaPage();

            // Auto-battle contínuo (tenta novamente a mesma wave)
            if (a.autoMode) {
                setTimeout(() => {
                    if (a.autoMode && !a.inBattle) {
                        if (a.stamina > 0) {
                            initArenaBattle();
                        } else {
                            arenaLog(`⏳ Aguardando regeneração de stamina para continuar...`, 'system');
                        }
                    }
                }, 1500);
            }
        }

        // Alternar modo automático
        function toggleArenaAutoMode() {
            const a = gameState.arena;
            a.autoMode = !a.autoMode;
            if (!a.autoMode) {
                if (a.autoInterval) {
                    clearInterval(a.autoInterval);
                    a.autoInterval = null;
                }
            } else {
                if (a.inBattle) {
                    if (a.autoInterval) clearInterval(a.autoInterval);
                    a.autoInterval = setInterval(() => {
                        if (!gameState.arena.inBattle) { clearInterval(gameState.arena.autoInterval); return; }
                        arenaPlayerAction('attack');
                    }, 1200);
                } else if (a.stamina > 0) {
                    initArenaBattle();
                } else {
                    showNotification('⏳ Aguardando Stamina!', 'O auto-battle iniciará assim que recuperar stamina.', 'info');
                }
            }
            renderArenaPage();
        }

        // Compra na loja da arena
        function buyArenaShopItem(id) {
            const a = gameState.arena;
            const item = arenaShopItems.find(i => i.id === id);
            if (!item) return;

            let cost = item.cost;
            const merchBonus = getCharacterClassPassive('goldAndDiscount');
            if (merchBonus > 0) cost = Math.max(1, Math.floor(cost * 0.90));

            if (item.requires && !a.shopPurchased[item.requires]) {
                showNotification('❌ Requisito!', `Compre "${arenaShopItems.find(i=>i.id===item.requires)?.name}" primeiro.`, 'error');
                return;
            }

            if (item.type !== 'consumable' && a.shopPurchased[id]) {
                showNotification('❌ Já adquirido!', `${item.name} já foi comprado.`, 'error');
                return;
            }

            if (a.arenaCoins < cost) {
                showNotification('❌ Fichas insuficientes!', `Precisa de ${cost} 🏟️ Fichas.`, 'error');
                return;
            }

            a.arenaCoins -= cost;

            if (item.id === 'elixir') {
                a.shopPurchased.elixir_stock = (a.shopPurchased.elixir_stock || 0) + 1;
                showNotification('💊 Elixir!', 'Elixir de Arena adquirido!', 'success', '💊');
            } else if (item.id === 'stamina2') {
                a.stamina = Math.min(a.stamina + 2, a.maxStamina);
                showNotification('⚡ Stamina!', '+2 Stamina restaurada!', 'success', '⚡');
            } else {
                a.shopPurchased[id] = true;
                showNotification(`${item.icon} Comprado!`, `${item.name} adquirido!`, 'success', item.icon);
            }

            renderArenaPage();
            saveGame();
        }

        // Usar elixir durante batalha
        function useArenaElixir() {
            const a = gameState.arena;
            if (!a.inBattle) return;
            if ((a.shopPurchased?.elixir_stock || 0) <= 0) {
                showNotification('❌ Sem Elixir!', 'Compre na loja da arena.', 'error'); return;
            }
            a.shopPurchased.elixir_stock--;
            const heal = Math.floor(gameState.combat.maxPlayerHealth * 0.5);
            a.playerHP = Math.min(a.playerHP + heal, gameState.combat.maxPlayerHealth);
            arenaLog(`💊 Elixir usado! +${heal}❤️`, 'player');
            renderArenaHPBars();
        }

        // Rank da semana
        function getArenaRank() {
            const pts = gameState.arena?.weeklyPoints || 0;
            if (pts >= 500) return { rank: 'Campeão',   icon: '🥇', color: '#ffd700' };
            if (pts >= 250) return { rank: 'Gladiador', icon: '🥈', color: '#c0c0c0' };
            if (pts >= 100) return { rank: 'Guerreiro', icon: '🥉', color: '#cd7f32' };
            return { rank: 'Iniciante',  icon: '🏅', color: '#6a8aaa' };
        }

        // Mudar aba da arena
        function switchArenaTab(tab) {
            gameState.arena.arenaTab = tab;
            renderArenaPage();
        }

        function changeArenaWave(delta) {
            const a = gameState.arena;
            if (a.inBattle) return;
            
            if (a.maxWave === undefined) a.maxWave = a.wave || 1;
            
            const newWave = a.wave + delta;
            if (newWave >= 1 && newWave <= a.maxWave) {
                a.wave = newWave;
                a.currentEnemy = null; // Reseta para carregar o inimigo correto da wave selecionada
                renderArenaPage();
            } else {
                if (newWave > a.maxWave) {
                    showNotification('🔒 Bloqueado!', 'Derrote o oponente atual para desbloquear waves maiores!', 'info');
                }
            }
        }

        // Atualiza apenas as barras de HP (sem re-render total)
        // Renderiza slot de equipamento compacto para o painel da arena
        function renderArenaEquipSlot(slot, emoji) {
            const equipped = gameState.equipment?.equipped;
            const id = equipped?.[slot];
            if (!id) return `<div class="arena-equip-slot empty" title="${slot}">${emoji}</div>`;
            const data = typeof getEquipmentItemData === 'function' ? getEquipmentItemData(id) : null;
            if (!data) return `<div class="arena-equip-slot empty" title="${slot}">${emoji}</div>`;
            const rarityCls = data.rarity || 'common';
            return `<div class="arena-equip-slot rarity-${rarityCls}" title="${data.name}\n${data.stats ? Object.entries(data.stats).map(s=>s[0]+': '+s[1]).join(' | ') : ''}">${data.icon || emoji}</div>`;
        }

        // Renderiza buffs ativos compactos para o painel da arena
        function renderArenaActiveBuffs() {
            const parts = [];
            const eb = typeof getEquipmentBonuses === 'function' ? getEquipmentBonuses() : {};
            const pet = gameState.pets?.active ? (typeof getPetName === 'function' ? getPetName(gameState.pets.active) : gameState.pets.active) : null;
            if (pet) parts.push(`<span class="arena-buff-tag pet-buff">🐾 ${pet}</span>`);
            if (eb.lifesteal > 0) parts.push(`<span class="arena-buff-tag">🩸 Vamp ${eb.lifesteal}%</span>`);
            if (eb.phoenix > 0) parts.push(`<span class="arena-buff-tag">🔥 Fênix</span>`);
            const arenaDmg = typeof getArenaShopBonus === 'function' ? getArenaShopBonus('arenaDmg') : 0;
            if (arenaDmg > 0) parts.push(`<span class="arena-buff-tag">🔶 +${arenaDmg}% Dano</span>`);
            const arenaDef = typeof getArenaShopBonus === 'function' ? getArenaShopBonus('arenaDefPct') : 0;
            if (arenaDef > 0) parts.push(`<span class="arena-buff-tag">🔷 -${arenaDef}% Dano Rec.</span>`);
            if (window.activeGlobalEvent === 'arena_fury') parts.push(`<span class="arena-buff-tag global-event">👺 Fúria Global</span>`);
            const potMult = typeof applyPotionEffects === 'function' ? applyPotionEffects('combatMult') : 0;
            if (potMult > 0) parts.push(`<span class="arena-buff-tag">🧪 ×${(1 + potMult/100).toFixed(2)} Ataque</span>`);
            if (parts.length === 0) parts.push(`<span class="arena-buff-tag inactive">Nenhum buff ativo</span>`);
            return parts.join('');
        }

        // Número flutuante de dano/cura próximo a um elemento
        function spawnArenaFloatingDmg(elId, amount, type, color) {
            if (typeof spawnFloatingText !== 'function') return;
            const el = document.getElementById(elId);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 + (Math.random() - 0.5) * 40;
            const cy = rect.top + 10 + Math.random() * 20;
            const prefix = type === 'heal' ? '+' : '';
            spawnFloatingText(cx, cy, prefix + amount, { type: type, color: color, duration: 0.9 });
        }

        // Hit Sparkle — flash vermelho no card do inimigo ao ser atingido
        function triggerHitSparkle() {
            const el = document.getElementById('arenaEnemyFighter');
            if (!el) return;
            el.classList.remove('hit-sparkle');
            // Força reflow para reiniciar a animação
            void el.offsetWidth;
            el.classList.add('hit-sparkle');
        }

        function renderArenaHPBars() {
            const a = gameState.arena;
            const maxP = gameState.combat.maxPlayerHealth;
            const pb = document.getElementById('arenaPlayerHPBar');
            const pt = document.getElementById('arenaPlayerHPText');
            const eb = document.getElementById('arenaEnemyHPBar');
            const et = document.getElementById('arenaEnemyHPText');
            if (pb) pb.style.width = Math.max(0, a.playerHP / maxP * 100) + '%';
            if (pt) pt.textContent = `${Math.max(0,a.playerHP)} / ${maxP}`;
            if (eb && a.currentEnemy) eb.style.width = Math.max(0, a.enemyHP / a.currentEnemy.hp * 100) + '%';
            if (et && a.currentEnemy) et.textContent = `${Math.max(0,a.enemyHP)} / ${a.currentEnemy.hp}`;
            
            // Efeito Glitch quando HP do inimigo está baixo (< 30%)
            const enemyFighter = document.getElementById('arenaEnemyFighter');
            if (enemyFighter && a.currentEnemy) {
                const hpPct = a.enemyHP / a.currentEnemy.hp;
                if (a.inBattle && hpPct < 0.30 && hpPct > 0) {
                    enemyFighter.classList.add('glitchIntense');
                } else {
                    enemyFighter.classList.remove('glitchIntense');
                }
            }
        }

        // Render completo da página de arena
        function renderArenaPage() {
            const el = document.getElementById('arenaPageContent');
            if (!el) return;
            const a = gameState.arena;
            if (a.maxWave === undefined) a.maxWave = a.wave || 1;
            a.stamina = a.maxStamina || 5; // Stamina desativada temporariamente (sempre cheia)
            const classSkill = getArenaClassSkill();
            const rank = getArenaRank();
            const enemy = a.currentEnemy || arenaEnemies[Math.min(a.wave - 1, arenaEnemies.length - 1)];
            const maxP = gameState.combat.maxPlayerHealth;
            const playerEl = getPlayerElement();
            const cdLeft = a.cooldowns?.skill || 0;
            const tab = a.arenaTab || 'battle';
            const elixirStock = a.shopPurchased?.elixir_stock || 0;
            const equipBonuses = typeof getEquipmentBonuses === 'function' ? getEquipmentBonuses() : {};

            // Stamina dots
            const staminaDots = Array.from({length: a.maxStamina}, (_, i) =>
                `<span class="arena-stamina-dot ${i < a.stamina ? 'full' : ''}"></span>`
            ).join('');

            // Fila de waves
            const queueHTML = arenaEnemies.map((e, i) => {
            const wNum = i + 1;
                let cls = 'arena-queue-item';
                if (wNum < a.wave) cls += ' done';
                else if (wNum === a.wave) cls += ' current';
                if (e.isBoss) cls += ' boss';
                return `<div class="${cls}" title="Wave ${wNum}: ${e.name}">${e.icon}<span>${wNum}</span></div>`;
            }).join('');

            // Tabs
            const tabHTML = `
                <div class="arena-tabs">
                    <button class="arena-tab-btn ${tab==='battle'?'active':''}" onclick="switchArenaTab('battle')">⚔️ Batalha</button>
                    <button class="arena-tab-btn ${tab==='queue'?'active':''}" onclick="switchArenaTab('queue')">📋 Fila</button>
                    <button class="arena-tab-btn ${tab==='ranking'?'active':''}" onclick="switchArenaTab('ranking')">🏆 Ranking</button>
                    <button class="arena-tab-btn ${tab==='shop'?'active':''}" onclick="switchArenaTab('shop')">🛒 Loja</button>
                </div>
            `;

            let contentHTML = '';

            if (tab === 'battle') {
                const waveEnemy = arenaEnemies[Math.min(a.wave - 1, arenaEnemies.length - 1)];
                const displayEnemy = a.inBattle ? enemy : waveEnemy;
                const playerHPPct = a.inBattle ? Math.max(0, a.playerHP / maxP * 100) : 100;
                const enemyHPPct = a.inBattle ? Math.max(0, a.enemyHP / displayEnemy.hp * 100) : 100;
                const playerHPDisplay = a.inBattle ? `${a.playerHP} / ${maxP}` : `${maxP} / ${maxP}`;
                const enemyHPDisplay = a.inBattle ? `${a.enemyHP} / ${displayEnemy.hp}` : `${displayEnemy.hp} / ${displayEnemy.hp}`;

                // Calcular chance de crítico do oponente para exibição
                let enemyCritChance = 8;
                if (displayEnemy.element === 'wind') enemyCritChance = 15;
                else if (displayEnemy.element === 'lightning') enemyCritChance = 18;
                else if (displayEnemy.element === 'legendary') enemyCritChance = 15;

                // Setas para mudar wave (apenas fora de batalha)
                const showArrows = !a.inBattle;
                const prevBtnHTML = showArrows ? `<button onclick="changeArenaWave(-1)" style="position: absolute; left: -22px; top: 50%; transform: translateY(-50%); background: rgba(16,26,36,0.9); border: 1.5px solid var(--primary-color); border-radius: 50%; width: 34px; height: 34px; color: var(--primary-color); cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.95em; z-index: 10; box-shadow: 0 0 10px rgba(255,215,0,0.35); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-50%) scale(1.15)';" onmouseout="this.style.transform='translateY(-50%) scale(1)';" title="Wave Anterior">◀</button>` : '';
                
                const nextBtnHTML = showArrows ? `<button onclick="changeArenaWave(1)" style="position: absolute; right: -22px; top: 50%; transform: translateY(-50%); background: rgba(16,26,36,0.9); border: 1.5px solid var(--primary-color); border-radius: 50%; width: 34px; height: 34px; color: var(--primary-color); cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.95em; z-index: 10; box-shadow: 0 0 10px rgba(255,215,0,0.35); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-50%) scale(1.15)';" onmouseout="this.style.transform='translateY(-50%) scale(1)';" title="Próxima Wave">▶</button>` : '';

                // Montar resistências do oponente
                const elementNames = {
                    fire: { label: 'Fogo', emoji: '🔥', color: '#ff6644' },
                    ice: { label: 'Gelo', emoji: '❄️', color: '#aaccff' },
                    water: { label: 'Água', emoji: '💧', color: '#5da4ff' },
                    wind: { label: 'Vento', emoji: '🌪️', color: '#4ac97a' },
                    earth: { label: 'Terra', emoji: '🪨', color: '#ffd700' },
                    dark: { label: 'Trevas', emoji: '💀', color: '#ff6666' },
                    holy: { label: 'Luz', emoji: '✨', color: '#ffd700' },
                    lightning: { label: 'Raio', emoji: '⚡', color: '#ff9944' }
                };

                let resHTML = '';
                const allElements = ['fire', 'ice', 'water', 'wind', 'earth', 'dark', 'holy', 'lightning'];
                allElements.forEach(elKey => {
                    const resValue = displayEnemy.res?.[elKey] || 0;
                    const elData = elementNames[elKey];
                    if (resValue !== 0) {
                        const isWeakness = resValue < 0;
                        const sign = resValue > 0 ? '+' : '';
                        const color = isWeakness ? '#ff4444' : '#4aff4a';
                        const extraLabel = isWeakness ? ' (Fraqueza!)' : ' (Resistente)';
                        resHTML += `
                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85em; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.02);">
                                <span style="color:${elData.color}">${elData.emoji} ${elData.label}</span>
                                <span style="color:${color}; font-weight:bold;">${sign}${resValue}%${extraLabel}</span>
                            </div>
                        `;
                    }
                });
                if (!resHTML) {
                    resHTML = '<div style="color:#aaa; font-size:0.85em; text-align:center; padding:10px;">Sem resistências ou fraquezas especiais (Neutro)</div>';
                }

                // Passiva do monstro
                let passiveHTML = '<span style="color:#888;">Nenhuma passiva</span>';
                if (displayEnemy.passiveSkill) {
                    passiveHTML = `<strong style="color:#ffd700;">${displayEnemy.passiveSkill.name}</strong><br><span style="font-size:0.82em; color:#aaa; line-height:1.2; display:block; margin-top:2px;">${displayEnemy.passiveSkill.desc}</span>`;
                }

                // Habilidade Especial do monstro
                const specialHTML = `
                    <strong style="color:#ff9944;">${displayEnemy.skill.name}</strong><br>
                    <span style="font-size:0.82em; color:#aaa; line-height:1.2; display:block; margin-top:2px;">Dano: <strong>${displayEnemy.skill.dmgMult}x</strong>. Ativa abaixo de <strong>${Math.floor(displayEnemy.skill.trigger * 100)}% HP</strong>.</span>
                `;

                const statsPanelHTML = `
                    <div class="arena-enemy-stats-panel" style="margin-top:15px; margin-bottom:15px; background:rgba(0,0,0,0.3); border:1.5px solid rgba(255,255,255,0.06); border-radius:12px; padding:12px; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; text-align:left;">
                        <div>
                            <div style="font-family:'Cinzel'; color:#ffd700; font-size:0.9em; border-bottom:1px solid rgba(255,215,0,0.15); padding-bottom:3px; margin-bottom:8px;">📊 Atributos do Oponente</div>
                            <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-bottom:4px;"><span style="color:#aaa;">HP Máximo:</span><span style="font-weight:bold; color:#fff;">${displayEnemy.hp}</span></div>
                            <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-bottom:4px;"><span style="color:#aaa;">Dano Base:</span><span style="font-weight:bold; color:#fff;">⚔️${displayEnemy.atk}</span></div>
                            <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-bottom:4px;"><span style="color:#aaa;">Defesa:</span><span style="font-weight:bold; color:#fff;">🛡️${displayEnemy.def}</span></div>
                            <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-bottom:4px;"><span style="color:#aaa;">Golpe Crítico:</span><span style="font-weight:bold; color:#ff6666;">${enemyCritChance}% (1.5x)</span></div>
                        </div>
                        <div>
                            <div style="font-family:'Cinzel'; color:#ffd700; font-size:0.9em; border-bottom:1px solid rgba(255,215,0,0.15); padding-bottom:3px; margin-bottom:8px;">🛡️ Resistências</div>
                            ${resHTML}
                        </div>
                        <div>
                            <div style="font-family:'Cinzel'; color:#ffd700; font-size:0.9em; border-bottom:1px solid rgba(255,215,0,0.15); padding-bottom:3px; margin-bottom:8px;">✨ Habilidade & Passiva</div>
                            <div style="font-size:0.82em; margin-bottom:6px; line-height:1.2;">
                                ${specialHTML}
                            </div>
                            <div style="font-size:0.82em; line-height:1.2; border-top:1px solid rgba(255,255,255,0.03); padding-top:6px;">
                                ${passiveHTML}
                            </div>
                        </div>
                    </div>
                `;

                contentHTML = `
                    <div class="arena-battle-area">
                        <div class="arena-combatants">
                            <div class="arena-fighter player-fighter" id="arenaPlayerFighter">
                                <div class="arena-fighter-icon">🧙</div>
                                <div class="arena-fighter-name">Seu Herói</div>
                                <div class="arena-fighter-element">${playerEl}</div>
                                <div class="arena-hp-bar-wrap">
                                    <div class="arena-hp-bar player-hp" id="arenaPlayerHPBar" style="width:${playerHPPct}%"></div>
                                </div>
                                <div class="arena-hp-text" id="arenaPlayerHPText">${playerHPDisplay}</div>
                                <div class="arena-fighter-stats">⚔️${gameState.combat.playerStrength} ATK</div>
                            </div>
                            <div class="arena-vs">VS</div>
                            <div class="arena-fighter enemy-fighter ${displayEnemy.isBoss ? 'boss-fighter' : ''}" id="arenaEnemyFighter" style="position: relative;">
                                ${prevBtnHTML}
                                <div class="arena-fighter-icon">${displayEnemy.icon}</div>
                                <div class="arena-fighter-name">${displayEnemy.name}</div>
                                <div class="arena-fighter-element">${displayEnemy.element}${displayEnemy.weakness ? ` <span style="color:#f90">⚠️ fraco: ${displayEnemy.weakness}</span>` : ''}</div>
                                <div class="arena-hp-bar-wrap">
                                    <div class="arena-hp-bar enemy-hp" id="arenaEnemyHPBar" style="width:${enemyHPPct}%"></div>
                                </div>
                                <div class="arena-hp-text" id="arenaEnemyHPText">${enemyHPDisplay}</div>
                                <div class="arena-fighter-stats">⚔️${displayEnemy.atk} ATK | 🛡️${displayEnemy.def} DEF</div>
                                ${nextBtnHTML}
                            </div>
                        </div>

                        <!-- Painel Compacto do Personagem -->
                        <div class="arena-char-panel" id="arenaCharPanel">
                            <div class="arena-char-toggle" onclick="const p=document.getElementById('arenaCharPanelContent'); if(p){const vis=p.style.display; p.style.display=vis==='none'?'flex':'none'; this.classList.toggle('collapsed');}">
                                <span>🧙 Detalhes do Herói</span>
                                <span class="arena-char-toggle-icon">▼</span>
                            </div>
                            <div class="arena-char-content" id="arenaCharPanelContent">
                                <!-- Equipamentos (grid compacto 8 slots) -->
                                <div class="arena-char-section">
                                    <div class="arena-char-section-title">🎒 Equipamentos</div>
                                    <div class="arena-equip-grid">
                                        ${renderArenaEquipSlot('helmet','🪖')}
                                        ${renderArenaEquipSlot('amulet','📿')}
                                        ${renderArenaEquipSlot('weapon','⚔️')}
                                        ${renderArenaEquipSlot('armor','🛡️')}
                                        ${renderArenaEquipSlot('shield','🔰')}
                                        ${renderArenaEquipSlot('ring','💍')}
                                        ${renderArenaEquipSlot('pants','👖')}
                                        ${renderArenaEquipSlot('boots','👢')}
                                    </div>
                                </div>
                                <!-- Atributos -->
                                <div class="arena-char-section">
                                    <div class="arena-char-section-title">📊 Atributos</div>
                                    <div class="arena-stats-grid">
                                        <div class="arena-stat-item"><span class="arena-stat-icon">❤️</span><span class="arena-stat-label">HP</span><span class="arena-stat-val">${gameState.combat.maxPlayerHealth}</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">⚔️</span><span class="arena-stat-label">ATQ</span><span class="arena-stat-val">${gameState.combat.playerStrength}</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">🛡️</span><span class="arena-stat-label">DEF</span><span class="arena-stat-val">${equipBonuses.defense || 0}</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">🍀</span><span class="arena-stat-label">Crítico</span><span class="arena-stat-val">${((equipBonuses.critChance || 0) + (typeof getClassPassive === 'function' ? getClassPassive('critChance') : 0)).toFixed(0)}%</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">⚡</span><span class="arena-stat-label">Veloc.</span><span class="arena-stat-val">+${(equipBonuses.speedBonus || 0) + (typeof getClassPassive === 'function' ? getClassPassive('speedBonus') : 0)}%</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">🎯</span><span class="arena-stat-label">Pen.</span><span class="arena-stat-val">${(equipBonuses.armorPenetration || 0).toFixed(0)}%</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">🩸</span><span class="arena-stat-label">Dano Puro</span><span class="arena-stat-val">${equipBonuses.trueDamage || 0}</span></div>
                                        <div class="arena-stat-item"><span class="arena-stat-icon">🛡️</span><span class="arena-stat-label">Tenac.</span><span class="arena-stat-val">${(equipBonuses.tenacity || 0).toFixed(0)}%</span></div>
                                    </div>
                                </div>
                                <!-- Buffs Ativos -->
                                <div class="arena-char-section">
                                    <div class="arena-char-section-title">✨ Buffs Ativos</div>
                                    <div class="arena-buffs-grid" id="arenaPlayerBuffs">
                                        ${renderArenaActiveBuffs()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        ${statsPanelHTML}

                        <div class="arena-actions">
                            ${!a.inBattle ? `
                                <button class="arena-btn start" onclick="initArenaBattle()" ${a.stamina<=0?'disabled':''}>⚔️ Iniciar Batalha ${a.stamina<=0?'(Sem Stamina)':''}</button>
                                <button class="arena-btn auto ${a.autoMode?'active':''}" onclick="toggleArenaAutoMode()">🤖 AUTO-BATALHA: ${a.autoMode?'LIGADO':'DESLIGADO'}</button>
                            ` : `
                                <button class="arena-btn attack" onclick="arenaPlayerAction('attack')">⚔️ Atacar</button>
                                <button class="arena-btn defend" onclick="arenaPlayerAction('defend')">🛡️ Defender</button>
                                <button class="arena-btn skill" onclick="arenaPlayerAction('skill')" ${cdLeft>0?'disabled':''}>${classSkill.name}${cdLeft>0?` (${cdLeft})`:''}  </button>
                                <button class="arena-btn heal" onclick="arenaPlayerAction('heal')">🍖 Curar</button>
                                ${elixirStock > 0 ? `<button class="arena-btn elixir" onclick="useArenaElixir()">💊 Elixir (${elixirStock})</button>` : ''}
                                <button class="arena-btn flee" onclick="arenaPlayerAction('flee')">🏃 Fugir</button>
                                <button class="arena-btn auto ${a.autoMode?'active':''}" onclick="toggleArenaAutoMode()">🤖 AUTO-BATALHA: ${a.autoMode?'LIGADO':'DESLIGADO'}</button>
                            `}
                        </div>

                        <div class="arena-log" id="arenaBattleLog">
                            ${a.battleLog.length === 0 ? '<div class="arena-log-system">Inicie uma batalha para ver o log...</div>' :
                                a.battleLog.map(entry => {
                                    const cls = entry.type === 'player' ? 'arena-log-player' : entry.type === 'enemy' ? 'arena-log-enemy' : entry.type === 'system' ? 'arena-log-system' : 'arena-log-info';
                                    return `<div class="arena-log-entry ${cls}">${entry.msg}</div>`;
                                }).join('')
                            }
                        </div>
                    </div>
                `;

            } else if (tab === 'queue') {
                // Mapa emoji → chave do elemento
                const _emojiToElemKey = {
                    '❄️': 'ice', '🔥': 'fire', '💧': 'water', '🌪️': 'wind',
                    '🪨': 'earth', '💀': 'dark', '✨': 'holy', '⚡': 'lightning', '👑': 'legendary'
                };

                contentHTML = `
                    <div class="arena-queue-area">
                        <div style="color:#aaa;font-size:0.85em;margin-bottom:10px;">Progresso das Waves — Boss nas waves 5, 10, 15, 20</div>
                        <div class="arena-queue-grid">${queueHTML}</div>
                        <div style="margin-top:16px;">
${arenaEnemies.map((e, i) => {
    const wNum = i + 1;
    const isCurrent = wNum === a.wave;
    const elemKey = _emojiToElemKey[e.element] || '';
    const elemCls = elemKey ? 'elem-' + elemKey : '';
    return `<div class="arena-enemy-card ${isCurrent?'current-wave':''} ${elemCls}" style="${e.isBoss?'border-color:#ffd700;':''} ">
        <span style="font-size:1.4em;">${e.icon}</span>
        <div>
            <div style="font-weight:700;font-size:0.9em;">Wave ${wNum}: ${e.name} ${e.isBoss?'👑':''}</div>
            <div style="font-size:0.75em;color:#aaa;">${e.element}${e.weakness?` ⚠️fraco:${e.weakness}`:''} · ❤️${e.hp} · ⚔️${e.atk} · 🛡️${e.def}</div>
            <div style="font-size:0.75em;color:#f9a;">${wNum < a.wave ? '✅ Derrotado' : isCurrent ? '🎯 ATUAL' : '🔒 Bloqueado'}</div>
        </div>
        <div style="text-align:right;font-size:0.8em;color:#f0c040;">💰${e.gold}<br/>🏟️${e.coins}</div>
    </div>`;
}).join('')}
                        </div>
                    </div>
                `;

            } else if (tab === 'ranking') {
                const rankData = [
                    { label: 'Campeão',   icon: '🥇', color: '#ffd700', req: '≥ 500 pts', reward: 'Skin + Título Dourado' },
                    { label: 'Gladiador', icon: '🥈', color: '#c0c0c0', req: '≥ 250 pts', reward: 'Runa Épica semanal' },
                    { label: 'Guerreiro', icon: '🥉', color: '#cd7f32', req: '≥ 100 pts', reward: 'Bônus de Fichas' },
                    { label: 'Iniciante', icon: '🏅', color: '#6a8aaa', req: '< 100 pts',  reward: 'Participação' }
                ];
                contentHTML = `
                    <div class="arena-ranking-area">
                        <div class="arena-rank-display" style="border-color:${rank.color};">
                            <div style="font-size:2em;">${rank.icon}</div>
                            <div style="font-size:1.1em;font-weight:700;color:${rank.color};">${rank.rank}</div>
                            <div style="font-size:0.85em;color:#aaa;">Pontuação: <strong style="color:#fff;">${a.weeklyPoints}</strong> pts</div>
                            <div style="font-size:0.8em;color:#aaa;">Vitórias: ${a.wins} · Melhor Sequência: ${a.bestStreak}🔥</div>
                        </div>
                        <div style="margin-top:14px;">
                            ${rankData.map(r => `
                                <div class="arena-rank-row" style="border-left:3px solid ${r.color};">
                                    <span style="font-size:1.3em;">${r.icon}</span>
                                    <div>
                                        <div style="font-weight:700;color:${r.color};">${r.label}</div>
                                        <div style="font-size:0.78em;color:#aaa;">${r.req} · ${r.reward}</div>
                                    </div>
                                </div>`).join('')}
                        </div>
                        <div style="margin-top:12px;font-size:0.8em;color:#6a8aaa;">💡 Pontuação: +10pts/vitória, +25pts/boss · ×1.5 seq≥5 · ×2.0 seq≥10</div>
                    </div>
                `;

            } else if (tab === 'shop') {
                contentHTML = `
                    <div class="arena-shop-area">
                        <div style="font-size:0.85em;color:#aaa;margin-bottom:8px;">Gaste suas Fichas de Arena 🏟️ em melhorias permanentes e consumíveis.</div>
                        ${arenaShopItems.map(item => {
                            let cost = item.cost;
                            const merchBonus = getCharacterClassPassive('goldAndDiscount');
                            if (merchBonus > 0) cost = Math.max(1, Math.floor(cost * 0.90));

                            const owned = a.shopPurchased?.[item.id];
                            const stock = item.id === 'elixir' ? (a.shopPurchased?.elixir_stock || 0) : null;
                            const canBuy = a.arenaCoins >= cost && (!owned || item.type === 'consumable');
                            const reqMet = !item.requires || a.shopPurchased?.[item.requires];
                            return `
                                <div class="arena-shop-item ${owned && item.type !== 'consumable' ? 'owned' : ''} ${!reqMet ? 'locked' : ''}">
                                    <span style="font-size:1.4em;">${item.icon}</span>
                                    <div style="flex:1;">
                                        <div style="font-weight:700;font-size:0.9em;">${item.name} ${owned && item.type !== 'consumable' ? '✅' : stock !== null ? `(x${stock})` : ''}</div>
                                        <div style="font-size:0.75em;color:#aaa;">${item.desc}${!reqMet ? ' 🔒 Requisito não atendido' : ''}</div>
                                    </div>
                                    <button class="arena-shop-btn" onclick="buyArenaShopItem('${item.id}')" ${(!canBuy || !reqMet) ? 'disabled' : ''}>
                                        ${cost}🏟️
                                    </button>
                                </div>`;
                        }).join('')}
                    </div>
                `;
            }

            el.innerHTML = `
                <div class="arena-header">
                    <div class="arena-header-stats">
                        <span>🏟️ <strong>${a.arenaCoins}</strong> Fichas</span>
                        <span>Wave <strong>${a.wave}</strong>/90 (Máx: ${a.maxWave})</span>
                        <span>🔥 Seq: <strong>${a.streak}</strong></span>
                        <span>✅ <strong>${a.wins}</strong> vitórias</span>
                        <span class="arena-rank-badge" style="color:${rank.color}">${rank.icon} ${rank.rank}</span>
                    </div>
                    <div class="arena-stamina-row">
                        <span style="font-size:0.8em;color:#aaa;">⚡ Stamina:</span>
                        ${staminaDots}
                        <span style="font-size:0.75em;color:#6a8aaa;">${a.stamina}/${a.maxStamina}</span>
                    </div>
                </div>
                ${tabHTML}
                ${contentHTML}
            `;
        }

        // Regeneração de stamina (chamada pelo tick principal)
        function tickArenaStamina() {
            if (!gameState.arena) return;
            const a = gameState.arena;
            a.stamina = a.maxStamina || 5; // Stamina desativada (sempre cheia)
            a.lastStaminaRegen = Date.now();
            return;
            const now = Date.now();
            const elapsed = (now - (a.lastStaminaRegen || now)) / 1000;
            if (elapsed >= 10) { // 10 segundos por stamina (modo teste)
                a.stamina = Math.min(a.stamina + 1, a.maxStamina);
                a.lastStaminaRegen = now;
                const staminaEl = document.querySelectorAll('.arena-stamina-dot');
                if (staminaEl.length) renderArenaPage(); // atualiza dots
                
                // Se estiver em modo automático e fora de batalha, auto-inicia
                if (a.autoMode && !a.inBattle && a.stamina >= 1) {
                    initArenaBattle();
                }
            }
        }

        // ============================================
        // FUNÇÕES DE COMBATE (LEGADO — USADO NAS MASMORRAS)
        // ============================================
        function selectEnemy() {
            const select = document.getElementById('enemySelect');
            const enemy = enemies[select.value];
            if (enemy) {
                gameState.combat.enemyType = select.value;
                gameState.combat.enemyName = enemy.name;
                gameState.combat.maxEnemyHealth = enemy.health;
                gameState.combat.enemyHealth = enemy.health;
                gameState.combat.enemyDamage = enemy.damage;
                updateUI();
            }
        }

        function startCombat() {
            if (gameState.combat.inCombat) return;
            if (gameState.combat.playerHealth <= 0) {
                showNotification('❌ Derrotado!', 'Resete o combate para continuar.', 'error', '❌');
                return;
            }

            // Tech: healthBoost — bônus de vida máxima no início do combate
            const techHealthBoost = applyTechBonus('healthBoost');
            if (techHealthBoost > 0) {
                const bonusHP = Math.floor(gameState.combat.maxPlayerHealth * techHealthBoost / 100);
                gameState.combat.maxPlayerHealth += bonusHP;
                if (gameState.combat.playerHealth > gameState.combat.maxPlayerHealth)
                    gameState.combat.playerHealth = gameState.combat.maxPlayerHealth;
            }

            gameState.combat.inCombat = true;
            gameState.combat.hasRevivedThisCombat = false;
            updateUI();

            gameState.combat.combatInterval = setInterval(() => {
                const equipBonuses = getEquipmentBonuses();

                // --- JOGADOR ATACA ---
                // Força base: playerStrength (já inclui upgrades + equipamentos via updateUI)
                let baseDamage = Math.floor(Math.random() * gameState.combat.playerStrength) + 3;
                // Óleo de Fogo
                const combatMult = 1 + applyPotionEffects('combatMult') / 100;
                baseDamage = Math.floor(baseDamage * combatMult);

                // Pet: combatBoost — multiplica o dano
                const petCombatMult = applyPetBonus('combat', 'combatBoost');
                baseDamage = Math.floor(baseDamage * petCombatMult);

                // Passiva Targaryen: +30% dano
                const classCombat = getClassPassive('combatBoost');
                if (classCombat > 0) baseDamage = Math.floor(baseDamage * (1 + classCombat / 100));

                // Poção de Força — adiciona força fixa
                const potionStr = applyPotionEffects('strength');
                baseDamage += Math.floor(potionStr);

                // Tech: criticalChance + equip + poção + passiva Targaryen
                const critChance = applyTechBonus('criticalChance') + (equipBonuses.critChance || 0) + applyPotionEffects('luck') + getClassPassive('critChance');
                let isCrit = false;
                if (Math.random() * 100 < critChance) {
                    const critDamageBonus = equipBonuses.critDamage || 0;
                    baseDamage = Math.floor(baseDamage * (2 + critDamageBonus / 100));
                    isCrit = true;
                }

                const playerDamage = Math.max(1, baseDamage);
                gameState.combat.enemyHealth -= playerDamage;

                // Runa do Trovão
                const thunderChance = equipBonuses.thunderChance || 0;
                let thunderDmg = 0;
                if (thunderChance > 0 && Math.random() * 100 < thunderChance) {
                    thunderDmg = Math.floor(playerDamage * 0.50);
                    gameState.combat.enemyHealth -= thunderDmg;
                }

                // Notificação de ataque com dano discriminado por fonte
                const activeCls2 = gameState.player?.classId
                    ? gameClasses.find(c => c.id === gameState.player.classId) : null;
                const clsIcon2 = activeCls2 ? activeCls2.icon : '';

                const dmgParts = [];
                if (isCrit)            dmgParts.push(`💥×${2 + (equipBonuses.critDamage || 0)/100}`);
                if (combatMult > 1)    dmgParts.push(`+${Math.round((combatMult-1)*100)}%🔥`);
                if (petCombatMult > 1) dmgParts.push(`+${Math.round((petCombatMult-1)*100)}%🐾`);
                if (classCombat > 0)   dmgParts.push(`+${classCombat}%${clsIcon2}`);
                if (potionStr > 0)     dmgParts.push(`+${Math.floor(potionStr)}💪`);
                if (thunderDmg > 0)    dmgParts.push(`+${thunderDmg}⚡`);
                const dmgStr = dmgParts.length > 0 ? ` (${dmgParts.join(' ')})` : '';
                showNotification('⚔️ Ataque!', `${playerDamage + thunderDmg} dano${dmgStr}`, 'info', '⚔️');

                // Tech: lifesteal + poções + runas
                const lifestealPct = applyTechBonus('lifesteal') + applyPotionEffects('lifesteal_pot') + (equipBonuses.lifesteal || 0);
                if (lifestealPct > 0) {
                    const heal = Math.max(1, Math.floor((playerDamage + thunderDmg) * lifestealPct / 100));
                    gameState.combat.playerHealth = Math.min(gameState.combat.playerHealth + heal, gameState.combat.maxPlayerHealth);
                    showNotification('🩸 Vampirismo!', `+${heal}❤️ (${lifestealPct}% absorvido)`, 'success', '🩸');
                }

                updateUI();

                // Verificar se inimigo morreu
                if (gameState.combat.enemyHealth <= 0) {
                    clearInterval(gameState.combat.combatInterval);
                    gameState.combat.inCombat = false;

                    // Recompensas — poção do mercador + passiva Lannister aumenta ouro
                    const goldMult = 1 + (applyPotionEffects('goldBoost') + getClassPassive('goldBoost')) / 100;
                    const baseGold = Math.floor(Math.random() * 20) + 10;
                    const goldReward = Math.floor(baseGold * goldMult);
                    gameState.gold += goldReward;

                    // Montar string de ouro discriminado
                    const goldPotBonus  = applyPotionEffects('goldBoost');
                    const goldClsBonus  = getClassPassive('goldBoost');
                    const goldFromPot   = goldPotBonus > 0 ? Math.floor(baseGold * goldPotBonus / 100) : 0;
                    const goldFromCls   = goldClsBonus > 0 ? Math.floor(baseGold * goldClsBonus / 100) : 0;
                    const activeCls3    = gameState.player?.classId
                                         ? gameClasses.find(c => c.id === gameState.player.classId) : null;
                    const clsIcon3      = activeCls3 ? activeCls3.icon : '';
                    let goldStr = `+${baseGold}💰`;
                    const goldParts = [];
                    if (goldFromPot > 0) goldParts.push(`+${goldFromPot}💰🧪`);
                    if (goldFromCls > 0) goldParts.push(`+${goldFromCls}💰${clsIcon3}`);
                    if (goldParts.length > 0) goldStr += ` (${goldParts.join(' ')})`;
                    const goldBonusMsg = goldParts.length > 0 ? ` [${goldParts.join(' ')}]` : '';

                    // Chance de drop de peixe
                    if (Math.random() < 0.3) {
                        const fishKeys = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
                        const randomFish = fishKeys[Math.floor(Math.random() * fishKeys.length)];
                        const totalItems = Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
                        if (totalItems < gameState.bankSlots) {
                            gameState.inventory[randomFish] = (gameState.inventory[randomFish] || 0) + 1;
                            // Conta como coleta no Grande Observatório
                            if (typeof incrementItemsGathered === 'function') incrementItemsGathered(1);
                            if (typeof incrementFishCaught === 'function') incrementFishCaught(1);
                            const fishName = getItemName(randomFish);
                            showNotification('🎁 Vitória!', `${gameState.combat.enemyName} · ${goldStr} · 🐟 ${fishName}`, 'success', '🎁');
                        } else {
                            showNotification('🎁 Vitória!', `${gameState.combat.enemyName} · ${goldStr}`, 'success', '🎁');
                        }
                    } else {
                        showNotification('🎁 Vitória!', `${gameState.combat.enemyName} · ${goldStr}`, 'success', '🎁');
                    }

                    // Chance de drop de equipamento (15% base + Sorte do Saqueador)
                    const lootLuckBonus = (equipBonuses.lootLuck || 0) / 100;
                    const admBaseDropRate = (window.balancingConfig?.arenaEquipDropRate !== undefined ? window.balancingConfig.arenaEquipDropRate : 15) / 100;
                    const dropChance = admBaseDropRate + lootLuckBonus;
                    const drops = enemyEquipDrops[gameState.combat.enemyType] || [];
                    if (drops.length > 0 && Math.random() < dropChance) {
                        const dropId = drops[Math.floor(Math.random() * drops.length)];
                        const dropEq = equipmentData[dropId];
                        if (dropEq) {
                            const finalId = addNewEquipmentToInventory(dropId);
                            const hasSlots = finalId.startsWith('inst_');
                            showNotification('🌟 Drop Raro!', `${dropEq.icon} ${dropEq.name}${hasSlots ? ' (2 Slots)' : ''} encontrado!`, 'success', dropEq.icon);
                            if (typeof triggerRareDropEffect === 'function') {
                                triggerRareDropEffect(dropEq.icon, dropEq.name);
                            }
                        }
                    }

                    // Tracking de kills para conquistas
                    initAchievements();
                    gameState.stats.totalKills = (gameState.stats.totalKills || 0) + 1;
                    checkAchievements();

                    resetCombat();
                    updateUI();
                    return;
                }

                // --- INIMIGO ATACA ---
                const rawEnemyDamage = Math.floor(Math.random() * gameState.combat.enemyDamage) + 2;
                const defense = equipBonuses.defense || 0;
                const enemyDamage = Math.max(1, rawEnemyDamage - Math.floor(defense / 3));
                gameState.combat.playerHealth -= enemyDamage;
                const blockedMsg = defense > 0 ? ` (${rawEnemyDamage - enemyDamage} bloqueado)` : '';
                showNotification('💔 Dano recebido!', `${gameState.combat.enemyName} causou ${enemyDamage} de dano.${blockedMsg}`, 'error', '💔');

                updateUI();

                if (gameState.combat.playerHealth <= 0) {
                    const phoenixCount = equipBonuses.phoenix || 0;
                    if (phoenixCount > 0 && !gameState.combat.hasRevivedThisCombat) {
                        gameState.combat.hasRevivedThisCombat = true;
                        const reviveHP = Math.floor(gameState.combat.maxPlayerHealth * 0.20);
                        gameState.combat.playerHealth = reviveHP;
                        showNotification('🔥 Runa do Fênix!', `Você ressuscitou com ${reviveHP}❤️ de vida!`, 'success', '🔥');
                        updateUI();
                    } else {
                        clearInterval(gameState.combat.combatInterval);
                        gameState.combat.inCombat = false;
                        gameState.combat.playerHealth = 0;
                        showNotification('💀 Derrota!', 'Você foi derrotado!', 'error', '💀');
                        updateUI();
                    }
                }
            }, 1500);
        }

        function resetCombat() {
            if (gameState.combat.combatInterval) clearInterval(gameState.combat.combatInterval);
            gameState.combat.inCombat = false;
            gameState.combat.playerHealth = gameState.combat.maxPlayerHealth;
            const enemy = enemies[gameState.combat.enemyType || 'goblin'];
            if (enemy) {
                gameState.combat.enemyName = enemy.name;
                gameState.combat.enemyHealth = enemy.health;
                gameState.combat.maxEnemyHealth = enemy.health;
                gameState.combat.enemyDamage = enemy.damage;
            }
            updateUI();
        }

        function eatFood() {
            const cookedFish = ['cookedFish1', 'cookedFish2', 'cookedFish3', 'cookedFish4', 'cookedFish5'];
            let found = null;
            for (let f of cookedFish) if (gameState.inventory[f] > 0) { found = f; break; }
            if (!found) { showNotification('❌ Sem comida!', 'Você não tem peixe cozido.', 'error'); return; }
            if (gameState.combat.playerHealth >= gameState.combat.maxPlayerHealth) { showNotification('❌ Vida cheia!', 'Sua vida já está no máximo.', 'error'); return; }
            const heal = getItemHeal(found);
            gameState.inventory[found]--;
            gameState.combat.playerHealth = Math.min(gameState.combat.playerHealth + heal, gameState.combat.maxPlayerHealth);
            
            // Grande Observatório
            incrementFoodUsed();
            
            showNotification('🍖 Comida!', `Recuperou ${heal} de vida.`, 'success');
            updateUI();
        }

