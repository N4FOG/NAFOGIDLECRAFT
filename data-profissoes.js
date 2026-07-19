// ============================================
// DATA-PROFISSOES.JS
// Classes do jogador (Game of Thrones)
// Avatares e estado inicial do novo jogo
// ============================================

        // DADOS DE CASAS / ORIGENS (Game of Thrones)
        // ============================================
        const gameClasses = [
            {
                id: 'guardiao_norte',
                name: 'Guardião do Norte',
                house: 'Guardiões do Norte',
                icon: '🐺❄️',
                color: '#aaccff',
                desc: 'Forjados pelo frio extremo e ventos gélidos. Sobreviventes natos das montanhas frias, mestres da caça e do aço do norte.',
                perks: [
                    { label: '+25% XP em Coleta (madeira, minério, pesca, herbolaria)', type: 'xpBoost_gather', value: 25 },
                    { label: '+30 Vida Máxima inicial', type: 'maxHealth', value: 30 },
                    { label: '+15% velocidade de ataque', type: 'speedBonus', value: 15 },
                    { label: 'Começa com 2 trabalhadores liberados', type: 'autoSlots', value: 2 },
                ]
            },
            {
                id: 'leao_ouro',
                name: 'Senhor das Riquezas',
                house: 'Leões de Ouro',
                icon: '🦁👑',
                color: '#ffd700',
                desc: 'Uma casa que prospera através do ouro, da mineração e de transações comerciais infalíveis. A riqueza corre em suas veias.',
                perks: [
                    { label: '+40% ouro de todas as fontes', type: 'goldBoost', value: 40 },
                    { label: '+20% XP em Ferraria, Criação e Encantamento', type: 'xpBoost_craft', value: 20 },
                    { label: 'Começa com 500 ouro extra', type: 'startGold', value: 500 },
                    { label: '+2 slots de inventário iniciais', type: 'bankSlots', value: 2 },
                ]
            },
            {
                id: 'senhor_fogo',
                name: 'Sangue do Dragão',
                house: 'Senhores do Fogo',
                icon: '🐉🔥',
                color: '#ff6644',
                desc: 'O fogo não queima quem carrega o sangue do dragão. Uma linhagem guerreira lendária, impiedosa no ataque.',
                perks: [
                    { label: '+30% dano em combate', type: 'combatBoost', value: 30 },
                    { label: '+20% chance de crítico', type: 'critChance', value: 20 },
                    { label: '+25% XP global em todas as skills', type: 'xpBoost_all', value: 25 },
                    { label: 'Começa com Espada de Ferro equipada', type: 'startWeapon', value: 'weapon_iron' },
                ]
            },
            {
                id: 'mar_negro',
                name: 'Navegador do Abismo',
                house: 'Irmandade do Mar Negro',
                icon: '🚢🌊',
                color: '#00ffd2',
                desc: 'Soberanos dos mares escuros e tormentas revoltas. Especialistas na pesca em águas profundas e na pilhagem rápida.',
                perks: [
                    { label: '+35% XP em Pesca', type: 'xpBoost_fishing', value: 35 },
                    { label: '+25% chance de colheita dupla (Peixes e Minérios)', type: 'doubleDropChance', value: 25 },
                    { label: '+15% velocidade de ataque', type: 'speedBonus', value: 15 },
                    { label: 'Começa com Vara de Pesca equipada', type: 'startTool', value: 'rod' },
                ]
            },
            {
                id: 'jardim_eterno',
                name: 'Herborista Arcano',
                house: 'Jardins Eternos',
                icon: '🌹🍃',
                color: '#4aff4a',
                desc: 'Em perfeita comunhão com a natureza e com a cura. Mestres da manipulação de ervas, elixires regenerativos e culinária.',
                perks: [
                    { label: '+30% XP em Herbolaria, Alquimia e Culinária', type: 'xpBoost_herbs_alchemy_cooking', value: 30 },
                    { label: 'Regenera +5 de vida por turno na Arena', type: 'regenHealth', value: 5 },
                    { label: 'Efeitos de poções duram +30% mais', type: 'potionDuration', value: 30 },
                    { label: 'Começa com 30 poções de cura básicas', type: 'startPotions', value: 30 },
                ]
            },
            {
                id: 'ultima_guarda',
                name: 'Defensor Inabalável',
                house: 'A Última Guarda',
                icon: '⚜️🛡️',
                color: '#d4a373',
                desc: 'A muralha humana que protege o reino do caos. Blindagem intransponível, foco em resiliência extrema e contra-ataques.',
                perks: [
                    { label: '+25% Defesa Permanente', type: 'defenseBoost', value: 25 },
                    { label: '+50 Vida Máxima inicial', type: 'maxHealth', value: 50 },
                    { label: 'Reduz em 15% todo dano recebido na Arena', type: 'damageReduction', value: 15 },
                    { label: 'Começa com Escudo de Ferro equipado', type: 'startShield', value: 'shield_iron' },
                ]
            }
        ];

        // DADOS DE CLASSES DE PERSONAGEM
        // ============================================
        const characterClasses = [
            // --- HUMANOS ---
            { id: 'dark_knight', nameM: 'Cavaleiro das Trevas', nameF: 'Cavaleira das Trevas', emojiM: '🛡️', emojiF: '🛡️', raceGroup: 'humans', desc: '⚔️ Executor: +30% de dano contra inimigos com < 30% de HP.', perkType: 'executeBoost', perkValue: 30 },
            { id: 'shadow_assassin', nameM: 'Assassino Sombrio', nameF: 'Assassina Sombria', emojiM: '🗡️', emojiF: '🗡️', raceGroup: 'humans', desc: '👤 Crítico Furtivo: O primeiro ataque na batalha sempre é crítico (dano ×2).', perkType: 'firstHitCrit', perkValue: 100 },
            { id: 'gladiator', nameM: 'Gladiador', nameF: 'Gladiadora', emojiM: '🔱', emojiF: '🔱', raceGroup: 'humans', desc: '🏆 Foco do Guerreiro: +2% de dano por wave na sequência de vitórias (até +40%).', perkType: 'streakDamage', perkValue: 2 },
            { id: 'sharpshooter', nameM: 'Atirador de Elite', nameF: 'Atiradora de Elite', emojiM: '🏹', emojiF: '🏹', raceGroup: 'humans', desc: '🎯 Precisão Extrema: +25% de chance de crítico; acertos críticos ignoram 30% da defesa do alvo.', perkType: 'ignoreDefCrit', perkValue: 30 },
            { id: 'royal_squire', nameM: 'Escudeiro Real', nameF: 'Escudeira Real', emojiM: '💂‍♂️', emojiF: '💂‍♀️', raceGroup: 'humans', desc: '🛡️ Proteção de Ferro: Reduz em 15% todo dano recebido na Arena.', perkType: 'damageReduction', perkValue: 15 },
            { id: 'merchant', nameM: 'Mercador Viajante', nameF: 'Mercadora Viajante', emojiM: '👑', emojiF: '👑', raceGroup: 'humans', desc: '💰 Comércio Mestre: +20% ouro de todas as fontes e 10% de desconto na Loja da Arena.', perkType: 'goldAndDiscount', perkValue: 20 },
            { id: 'ancient_miner', nameM: 'Minerador Ancião', nameF: 'Mineradora Anciã', emojiM: '⛏️', emojiF: '⛏️', raceGroup: 'humans', desc: '💎 Prospector: +35% de chance de encontrar gemas raras ao minerar.', perkType: 'gemChance', perkValue: 35 },
            { id: 'sage', nameM: 'Sábio Ancião', nameF: 'Sábia Anciã', emojiM: '📜', emojiF: '📜', raceGroup: 'humans', desc: '🧠 Erudito: +20% de ganho de XP global em todas as habilidades.', perkType: 'xpBoost_all', perkValue: 20 },
            { id: 'apprentice', nameM: 'Aprendiz', nameF: 'Aprendiz', emojiM: '🎓', emojiF: '🎓', raceGroup: 'humans', desc: '⚡ Curva de Aprendizado: Dobra o XP ganho (+100%) em habilidades de nível < 30.', perkType: 'lowLevelXPDouble', perkValue: 100 },

            // --- RAÇAS FANTÁSTICAS ---
            { id: 'elf', nameM: 'Elfo', nameF: 'Elfa', emojiM: '🧝‍♂️', emojiF: '🧝‍♀️', raceGroup: 'fantastic', desc: '🏹 Agilidade Élfica: +15% de velocidade de ataque permanente.', perkType: 'speedBonus', perkValue: 15 },
            { id: 'berserker', nameM: 'Berserker', nameF: 'Berserker', emojiM: '🪓', emojiF: '🪓', raceGroup: 'fantastic', desc: '🪓 Ira Incontrolável: Dano aumenta conforme vida perdida (até +50% dano).', perkType: 'lowHPDamage', perkValue: 50 },
            { id: 'stone_golem', nameM: 'Golem de Pedra', nameF: 'Golem de Pedra', emojiM: '🗿', emojiF: '🗿', raceGroup: 'fantastic', desc: '🧱 Corpo de Rocha: +50% de defesa dos equipamentos, mas -20% vel. de ataque na Arena.', perkType: 'golemPerk', perkValue: 50 },
            { id: 'turtle_knight', nameM: 'Cavaleiro Tartaruga', nameF: 'Cavaleira Tartaruga', emojiM: '🐢', emojiF: '🐢', raceGroup: 'fantastic', desc: '🐢 Casco Eterno: Ganha +1 Defesa permanente a cada 50 vitórias na Arena.', perkType: 'turtleDefense', perkValue: 1 },
            { id: 'mimic', nameM: 'Mímico', nameF: 'Mímica', emojiM: '🎭', emojiF: '🎭', raceGroup: 'fantastic', desc: '📦 Réplica: +50% de chance de duplicar recursos obtidos na coleta manual.', perkType: 'doubleHarvest', perkValue: 50 },

            // --- CRIATURAS DAS TREVAS ---
            { id: 'vampire', nameM: 'Vampiro', nameF: 'Vampira', emojiM: '🧛‍♂️', emojiF: '🧛‍♀️', raceGroup: 'darkness', desc: '🩸 Sanguessuga: Roubo de Vida (+5% do dano causado na Arena revertido em cura).', perkType: 'lifesteal', perkValue: 5 },
            { id: 'scorpion_king', nameM: 'Escorpião Rei', nameF: 'Rainha Escorpião', emojiM: '🦂', emojiF: '🦂', raceGroup: 'darkness', desc: '🦂 Veneno Concentrado: Efeitos de Veneno na Arena causam +20% de dano.', perkType: 'poisonBoost', perkValue: 20 },
            { id: 'wraith', nameM: 'Espectro', nameF: 'Espectro', emojiM: '🌫️', emojiF: '🌫️', raceGroup: 'darkness', desc: '👻 Intangível: +15% de chance de esquivar de ataques inimigos na Arena.', perkType: 'dodgeChance', perkValue: 15 },
            { id: 'zombie', nameM: 'Zumbi', nameF: 'Zumbi', emojiM: '🧟‍♂️', emojiF: '🧟‍♀️', raceGroup: 'darkness', desc: '🧟 Pele Podre: Ignora 5 de dano de qualquer ataque físico inimigo.', perkType: 'flatDamageBlock', perkValue: 5 },

            // --- SERES CELESTIAIS ---
            { id: 'genie', nameM: 'Gênio', nameF: 'Gênia', emojiM: '🧞‍♂️', emojiF: '🧞‍♀️', raceGroup: 'celestials', desc: '✨ Desejos Mágicos: Suas habilidades de classe na Arena causam +20% de dano/cura.', perkType: 'skillBoost', perkValue: 20 },
            { id: 'gold_alchemist', nameM: 'Alquimista Dourado', nameF: 'Alquimista Dourada', emojiM: '🪙', emojiF: '🪙', raceGroup: 'celestials', desc: '🪙 Toque de Midas: Converte 5% de todo o dano causado na Arena em ouro.', perkType: 'damageToGold', perkValue: 5 },
            { id: 'seer', nameM: 'Vidente', nameF: 'Vidente', emojiM: '🔮', emojiF: '🔮', raceGroup: 'celestials', desc: '🔮 Identificação Divina: Equipamentos criados têm +15% de chance de ter qualidade épica/lendária.', perkType: 'craftQualityBoost', perkValue: 15 },
            { id: 'brilliant_mind', nameM: 'Mente Brilhante', nameF: 'Mente Brilhante', emojiM: '🧠', emojiF: '🧠', raceGroup: 'celestials', desc: '⚡ Foco Estudo: +25% de velocidade de ganho de XP na Biblioteca do acampamento.', perkType: 'librarySpeed', perkValue: 25 },
            { id: 'reincarnated', nameM: 'Reencarnado', nameF: 'Reencarnada', emojiM: '🔄', emojiF: '🔄', raceGroup: 'celestials', desc: '👼 Segunda Chance: Revive uma vez por batalha com 30% de HP ao morrer.', perkType: 'reviveOnce', perkValue: 30 },

            // --- DIFERENTÕES ---
            { id: 'automaton', nameM: 'Autômato', nameF: 'Autômata', emojiM: '🤖', emojiF: '🤖', raceGroup: 'differents', desc: '⚙️ Engrenagem Perfeita: +15% de eficácia para todos os trabalhadores ativos.', perkType: 'workerEfficiency', perkValue: 15 },
            { id: 'alien', nameM: 'Alienígena', nameF: 'Alienígena', emojiM: '👽', emojiF: '👽', raceGroup: 'differents', desc: '🧪 Metabolismo Cósmico: Efeitos de poções duram +50% mais tempo.', perkType: 'potionDuration', perkValue: 50 },
            { id: 'cyborg', nameM: 'Ciborgue', nameF: 'Ciborgue', emojiM: '🦾', emojiF: '🦾', raceGroup: 'differents', desc: '🛠️ Impulso Biônico: +15% de chance de duplicar itens fabricados na Ferraria ou Alquimia.', perkType: 'doubleCraft', perkValue: 15 },
            { id: 'illusionist', nameM: 'Ilusionista', nameF: 'Ilusionista', emojiM: '🎭', emojiF: '🎭', raceGroup: 'differents', desc: '🌀 Dobra Mental: Reduz o tempo de recarga (cooldown) das habilidades na Arena em 1 turno.', perkType: 'cooldownReduction', perkValue: 1 },
            { id: 'bard', nameM: 'Bardo', nameF: 'Barda', emojiM: '🎪', emojiF: '🎪', raceGroup: 'differents', desc: '🎵 Melodia Inspiradora: Aumenta a velocidade de todos os trabalhadores passivos em 10%.', perkType: 'workerSpeed', perkValue: 10 },
            { id: 'joker', nameM: 'Coringa', nameF: 'Coringa', emojiM: '🃏', emojiF: '🃏', raceGroup: 'differents', desc: '🃏 Truque do Caos: +10% de chance de duplicar os drops de chefes derrotados na Arena.', perkType: 'bossDoubleDrop', perkValue: 10 }
        ];

        // Mapeamentos para manter compatibilidade com códigos antigos
        const avatarEmojis = { M: [], F: [] };
        const avatarNames = { M: [], F: [] };
        characterClasses.forEach(c => {
            avatarEmojis.M.push(c.emojiM);
            avatarEmojis.F.push(c.emojiF);
            avatarNames.M.push(c.nameM);
            avatarNames.F.push(c.nameF);
        });

        const raceGroupLabels = {
            humans: '👨 Humanos',
            fantastic: '🧝 Raças Fantásticas',
            darkness: '🌙 Criaturas das Trevas',
            celestials: '✨ Seres Celestiais',
            differents: '🤖 Diferentões'
        };

        // Estado do novo jogo
        let ngState = { name: '', gender: null, avatar: null, classId: null, selectedClassFilter: 'humans' };
