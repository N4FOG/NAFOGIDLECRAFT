// ============================================
// DATA-RECURSOS.JS
// Pets, Poções, Recursos, Receitas, Inimigos,
// Itens de inventário, XP table, Ferramentas
// ============================================

        // ============================================
        // DADOS DOS MASCOTES
        // ============================================
        const pets = [
            { id: 'woodpecker', name: 'Pica-pau', icon: '🐦', description: 'Um pássaro amigo que adora madeira', price: 1500, levelReq: 5, effect: 'woodcutting', effectType: 'xpBoost', effectValue: 10, autoCollect: 'wood1', autoCollectChance: 30, masteryBonus: { type: 'xpBoost_gather', value: 2 } },
            { id: 'lava_salamander', name: 'Salamandra de Lava', icon: '🦎', description: 'Criatura das profundezas que ama minérios', price: 5000, levelReq: 20, effect: 'mining', effectType: 'doubleChance', effectValue: 15, autoCollect: 'ore1', autoCollectChance: 25, masteryBonus: { type: 'xpBoost_gather', value: 2 } },
            { id: 'golden_fish', name: 'Peixe Dourado', icon: '🐠', description: 'Peixe místico que atrai peixes raros', price: 8000, levelReq: 35, effect: 'fishing', effectType: 'rareChance', effectValue: 20, autoCollect: 'fish2', autoCollectChance: 20, masteryBonus: { type: 'xpBoost_gather', value: 2 } },
            { id: 'battle_wolf', name: 'Lobo de Guerra', icon: '🐺', description: 'Companheiro fiel que luta ao seu lado', price: 30000, levelReq: 60, effect: 'combat', effectType: 'combatBoost', effectValue: 20, autoCollect: 'cookedFish3', autoCollectChance: 15, masteryBonus: { type: 'strengthBonus', value: 3 } },
            { id: 'crystal_dragon', name: 'Dragão de Cristal', icon: '🐉', description: 'Dragão lendário que concede sabedoria', price: 100000, levelReq: 95, effect: 'global', effectType: 'allBoost', effectValue: 15, autoCollect: 'wood5', autoCollectChance: 10, masteryBonus: { type: 'xpBoost_all', value: 2 } },
            { id: 'cobra_peconhenta', name: 'Cobra Peçonhenta', icon: '🐍', description: '20% chance de envenenar inimigos na Arena (dano baseado na arma)', price: 15000, levelReq: 45, effect: 'combat', effectType: 'poisonChance', effectValue: 20, autoCollect: 'herb2', autoCollectChance: 15, masteryBonus: { type: 'strengthBonus', value: 2 } },
            { id: 'war_elephant', name: 'Elefante de Guerra', icon: '🐘', description: 'Aumenta Vida Máxima em +20% e Defesa Base em +15%', price: 35000, levelReq: 65, effect: 'combat', effectType: 'tankBoost', effectValue: 20, autoCollect: 'bar2', autoCollectChance: 10, masteryBonus: { type: 'healthBonus', value: 15 } },
            { id: 'pinguim_glacial', name: 'Pinguim Glacial', icon: '🐧', description: 'Ataca a cada 4 turnos com 50% de chance de congelar o inimigo', price: 50000, levelReq: 80, effect: 'combat', effectType: 'freezeChance', effectValue: 50, autoCollect: 'fish3', autoCollectChance: 12, masteryBonus: { type: 'healthBonus', value: 10 } },
            { id: 'crocodilo_casca_grossa', name: 'Crocodilo Casca-Grossa', icon: '🐊', description: 'Reflete 15% de todo o dano físico recebido na Arena', price: 60000, levelReq: 85, effect: 'combat', effectType: 'damageReflect', effectValue: 15, autoCollect: 'fish4', autoCollectChance: 10, masteryBonus: { type: 'healthBonus', value: 15 } },
            { id: 'porco_capitalista', name: 'Porco Capitalista', icon: '🐖', description: 'Multiplica todo o ouro ganho na Arena em +40%', price: 20000, levelReq: 50, effect: 'gold', effectType: 'goldBoost', effectValue: 40, autoCollect: 'ore3', autoCollectChance: 15, masteryBonus: { type: 'goldBonus', value: 3 } },
            { id: 'abelha_rainha', name: 'Abelha Rainha', icon: '🐝', description: 'Aumenta a velocidade de coleta dos trabalhadores passivos em +10%', price: 22000, levelReq: 55, effect: 'workers', effectType: 'workerSpeed', effectValue: 10, autoCollect: 'herb3', autoCollectChance: 20, masteryBonus: { type: 'xpBoost_gather', value: 1 } },
            { id: 'pombo_correio', name: 'Pombo Correio', icon: '🕊', description: 'Traz pacotes misteriosos (Ouro, Madeira ou Gemas) a cada 10 minutos', price: 12000, levelReq: 40, effect: 'delivery', effectType: 'pomboDelivery', effectValue: 1, autoCollect: 'wood2', autoCollectChance: 25, masteryBonus: { type: 'goldBonus', value: 2 } },
            { id: 'gato_preto', name: 'Gato Preto', icon: '🐈', description: 'Aumenta Chance de Crítico em +10% e Dano do Crítico em +25%', price: 40000, levelReq: 70, effect: 'combat', effectType: 'critBoost', effectValue: 10, autoCollect: 'wood3', autoCollectChance: 15, masteryBonus: { type: 'critChance', value: 2 } },
            { id: 'pavao_exibido', name: 'Pavão Exibido', icon: '🦚', description: 'Reduz a precisão (chance de acerto) dos inimigos na Arena em 15%', price: 45000, levelReq: 75, effect: 'combat', effectType: 'enemyBlind', effectValue: 15, autoCollect: 'wood4', autoCollectChance: 15, masteryBonus: { type: 'healthBonus', value: 10 } },
            { id: 'dragaozinho', name: 'Dragãozinho', icon: '🐉', description: 'Causa queimaduras na Arena (dano extra) e reduz o tempo de fundição em 20%', price: 120000, levelReq: 99, effect: 'smithing', effectType: 'meltSpeed', effectValue: 20, autoCollect: 'ore4', autoCollectChance: 10, masteryBonus: { type: 'xpBoost_craft', value: 2 } }
        ];


        // ============================================
        // DADOS DAS POÇÕES
        // ============================================
        const potions = [
            { id: 'speed_potion', name: 'Poção de Velocidade', icon: '⚡', image: 'img/pocao/501_pocao_de_velocidade.png', description: 'Aumenta sua velocidade de coleta', effect: '+50% velocidade', duration: 300, craftTime: 10, levelReq: 15, xpGain: 60, ingredients: [{ type: 'fish2', qty: 3 }, { type: 'wood2', qty: 5 }], effectType: 'speed', effectValue: 50 },
            { id: 'luck_potion', name: 'Poção de Sorte', icon: '🍀', image: 'img/pocao/508_pocao_de_sorte.png', description: 'Aumenta chances de crítico', effect: '+30% chance crítico', duration: 600, craftTime: 15, levelReq: 85, xpGain: 400, ingredients: [{ type: 'fish5', qty: 1 }, { type: 'wood4', qty: 3 }], effectType: 'luck', effectValue: 30 },
            { id: 'strength_potion', name: 'Poção de Força', icon: '💪', image: 'img/pocao/509_oleo_de_forca.png', description: 'Aumenta força temporariamente', effect: '+20 força', duration: 180, craftTime: 12, levelReq: 40, xpGain: 120, ingredients: [{ type: 'bar3', qty: 2 }, { type: 'fish3', qty: 3 }], effectType: 'strength', effectValue: 20 },
            { id: 'xp_potion', name: 'Poção do Sábio', icon: '📚', image: 'img/pocao/503_pocao_do_sabio.png', description: 'Dobra o ganho de XP', effect: '+100% XP', duration: 900, craftTime: 20, levelReq: 90, xpGain: 500, ingredients: [{ type: 'wood5', qty: 2 }, { type: 'ore5', qty: 2 }], effectType: 'xpBoost', effectValue: 100 },
            { id: 'gold_potion', name: 'Poção do Mercador', icon: '💰', image: 'img/pocao/505_pocao_do_mercador.png', description: 'Aumenta ouro obtido', effect: '+50% ouro', duration: 600, craftTime: 15, levelReq: 65, xpGain: 250, ingredients: [{ type: 'bar4', qty: 2 }, { type: 'cookedFish4', qty: 2 }], effectType: 'goldBoost', effectValue: 50 },
            { id: 'instant_heal', name: 'Poção de Cura', icon: '❤️', image: 'img/pocao/502_pocao_de_cura.png', description: 'Cura instantaneamente', effect: 'Cura 50% da vida', duration: 0, craftTime: 5, levelReq: 60, xpGain: 150, ingredients: [{ type: 'cookedFish2', qty: 3 }, { type: 'fish4', qty: 2 }], effectType: 'heal', effectValue: 50 },
            { id: 'fire_oil', name: 'Óleo de Fogo', icon: '🔥', image: 'img/pocao/510_oleo_de_fogo.png', description: 'Arma flamejante que aumenta seu dano global', effect: '+25% dano combate', duration: 300, craftTime: 12, levelReq: 20, xpGain: 80, ingredients: [{ type: 'wood2', qty: 6 }, { type: 'bar2', qty: 3 }], effectType: 'combatMult', effectValue: 25 },
            { id: 'poison_oil', name: 'Óleo de Veneno', icon: '🧪', image: 'img/pocao/506_oleo_de_veneno.png', description: 'Arma venenosa que rouba vida ao atacar', effect: '+15% roubo de vida', duration: 300, craftTime: 12, levelReq: 35, xpGain: 100, ingredients: [{ type: 'fish3', qty: 4 }, { type: 'wood3', qty: 6 }], effectType: 'lifesteal_pot', effectValue: 15 },
            { id: 'builder_elixir', name: 'Elixir do Construtor', icon: '🔨', image: 'img/pocao/504_elixir_do_construcao.png', description: 'Reduz o tempo de fabricação de itens', effect: '-20% tempo craft', duration: 600, craftTime: 15, levelReq: 60, xpGain: 200, ingredients: [{ type: 'bar3', qty: 3 }, { type: 'wood4', qty: 8 }], effectType: 'craftSpeed_pot', effectValue: 20 },
            { id: 'meistre_elixir', name: 'Elixir do Meistre', icon: '📜', image: 'img/pocao/500_elixir_do_meistre.png', description: 'Concentração profunda que concede XP extra', effect: '+25% XP global', duration: 600, craftTime: 20, levelReq: 85, xpGain: 450, ingredients: [{ type: 'wood5', qty: 3 }, { type: 'bar4', qty: 4 }], effectType: 'xpBoost_all_pot', effectValue: 25 }
        ];

        // ============================================
        // RECURSOS E RECEITAS (COMPLETOS)
        // ============================================
        const resources = {
            woodcutting: [
                { id: 'wood1', name: 'Madeira Comum', icon: '🪵', levelReq: 1, xpGain: 6, price: 5, desc: 'Madeira básica' },
                { id: 'wood2', name: 'Madeira de Carvalho', icon: '🌳', levelReq: 15, xpGain: 15, price: 8, desc: 'Madeira resistente' },
                { id: 'wood3', name: 'Madeira de Teixo', icon: '🌲', levelReq: 35, xpGain: 35, price: 18, desc: 'Ótima para arcos' },
                { id: 'wood4', name: 'Madeira de Ébano', icon: '🪨', levelReq: 60, xpGain: 80, price: 35, desc: 'Madeira escura' },
                { id: 'wood5', name: 'Madeira Mágica', icon: '✨', levelReq: 85, xpGain: 200, price: 60, desc: 'Infundida com magia' }
            ],
            mining: [
                { id: 'ore1', name: 'Minério de Cobre', icon: '🥉', levelReq: 1, xpGain: 6, price: 3, desc: 'Minério básico' },
                { id: 'ore2', name: 'Minério de Ferro', icon: '⚙️', levelReq: 15, xpGain: 15, price: 10, desc: 'Mais resistente' },
                { id: 'ore3', name: 'Minério de Prata', icon: '🥈', levelReq: 35, xpGain: 35, price: 22, desc: 'Brilhante' },
                { id: 'ore4', name: 'Minério de Ouro', icon: '🥇', levelReq: 60, xpGain: 80, price: 40, desc: 'Valioso' },
                { id: 'ore5', name: 'Minério de Mitril', icon: '💫', levelReq: 85, xpGain: 200, price: 70, desc: 'Lendário' },
                { id: 'ore6', name: 'Minério de Titânio', image: 'img/ore6_titanio.jpg', levelReq: 70, xpGain: 350, price: 120, desc: 'Minério de titânio denso e ultrarresistente' },
                { id: 'ore7', name: 'Minério de Adamantita', image: 'img/bar7_adamantita.jpg', levelReq: 80, xpGain: 600, price: 200, desc: 'Minério verde radiante com dureza lendária' },
                { id: 'ore8', name: 'Minério de Obsidiana', image: 'img/weapon_obsidian.jpg', levelReq: 95, xpGain: 1200, price: 380, desc: 'Vidro vulcânico incandescente' },
                { id: 'ore9', name: 'Minério Estelar', image: 'img/shield_starfall.jpg', levelReq: 100, xpGain: 2500, price: 800, desc: 'Fragmento de meteorito cósmico' }
            ],
            fishing: [
                { id: 'fish1', name: 'Peixe Pequeno', icon: '🐟', levelReq: 1, xpGain: 6, price: 2, desc: 'Fácil de pescar', healAmount: 10 },
                { id: 'fish2', name: 'Salmão', icon: '🐠', levelReq: 15, xpGain: 15, price: 10, desc: 'Peixe de água doce', healAmount: 15 },
                { id: 'fish3', name: 'Atum', icon: '🐡', levelReq: 35, xpGain: 35, price: 22, desc: 'Peixe grande', healAmount: 20 },
                { id: 'fish4', name: 'Peixe-espada', icon: '🗡️', levelReq: 60, xpGain: 80, price: 40, desc: 'Raro', healAmount: 25 },
                { id: 'fish5', name: 'Peixe Mágico', icon: '🌟', levelReq: 85, xpGain: 200, price: 70, desc: 'Mágico', healAmount: 30 }
            ],
            herbalism: [
                { id: 'herb1', name: 'Folha de Calêndula', icon: '🌿', levelReq: 1, xpGain: 6, price: 3, desc: 'Uma erva medicinal comum' },
                { id: 'herb2', name: 'Flor de Lavanda', icon: '🌸', levelReq: 15, xpGain: 15, price: 10, desc: 'Flor perfumada calmante' },
                { id: 'herb3', name: 'Líquen de Rocha', icon: '🍄', levelReq: 35, xpGain: 35, price: 22, desc: 'Líquen mágico que cresce na pedra' },
                { id: 'herb4', name: 'Lótus de Fogo', icon: '🔥', levelReq: 60, xpGain: 80, price: 40, desc: 'Flor ardente que cresce perto de vulcões' },
                { id: 'herb5', name: 'Orquídea Celestial', icon: '✨', levelReq: 85, xpGain: 200, price: 70, desc: 'Uma flor brilhante estelar' }
            ]
        };

        const cookingRecipes = [
            {
                id: 'cookedFish1',
                name: 'Peixe Pequeno Assado',
                icon: '🍖',
                levelReq: 1,
                input: { type: 'fish1', qty: 1 },
                output: { type: 'cookedFish1', qty: 1, name: 'Peixe Pequeno Assado' },
                xpGain: 30,
                time: 2.0,
                desc: 'Um peixe pequeno simplesmente assado',
                healAmount: 10
            },
            {
                id: 'cookedFish2',
                name: 'Salmão Grelhado',
                icon: '🍣',
                levelReq: 15,
                input: { type: 'fish2', qty: 1 },
                output: { type: 'cookedFish2', qty: 1, name: 'Salmão Grelhado' },
                xpGain: 75,
                time: 2.5,
                desc: 'Salmão grelhado com ervas',
                healAmount: 15
            },
            {
                id: 'cookedFish3',
                name: 'Atum ao Molho',
                icon: '🍱',
                levelReq: 35,
                input: { type: 'fish3', qty: 1 },
                output: { type: 'cookedFish3', qty: 1, name: 'Atum ao Molho' },
                xpGain: 180,
                time: 3.0,
                desc: 'Atum preparado com molho especial',
                healAmount: 20
            },
            {
                id: 'cookedFish4',
                name: 'Peixe-espada Grelhado',
                icon: '🍽️',
                levelReq: 60,
                input: { type: 'fish4', qty: 1 },
                output: { type: 'cookedFish4', qty: 1, name: 'Peixe-espada Grelhado' },
                xpGain: 450,
                time: 3.5,
                desc: 'Peixe-espada grelhado na brasa',
                healAmount: 25
            },
            {
                id: 'cookedFish5',
                name: 'Peixe Mágico Encantado',
                icon: '✨',
                levelReq: 85,
                input: { type: 'fish5', qty: 1 },
                output: { type: 'cookedFish5', qty: 1, name: 'Peixe Mágico Encantado' },
                xpGain: 1200,
                time: 4.0,
                desc: 'Peixe mágico que brilha intensamente',
                healAmount: 30
            }
        ];
        const craftingRecipes = [
            {
                id: 'craftedItem1',
                name: 'Flecha de Madeira',
                icon: '🏹',
                image: 'img/600_flecha_de_madeira.png',
                levelReq: 1,
                input: { type: 'wood1', qty: 2 },
                output: { type: 'craftedItem1', qty: 1, name: 'Flecha de Madeira' },
                xpGain: 30,
                time: 2.0,
                desc: 'Flechas básicas para combate',
                price: 10
            },
            {
                id: 'craftedItem2',
                name: 'Arco Curto',
                icon: '🏹',
                image: 'img/weapons/100_arco_curto.png',
                levelReq: 20,
                input: { type: 'wood2', qty: 2 },
                output: { type: 'craftedItem2', qty: 1, name: 'Arco Curto' },
                xpGain: 100,
                time: 2.5,
                desc: 'Arco feito de madeira de carvalho',
                price: 20
            },
            {
                id: 'craftedItem3',
                name: 'Bastão Rúnico',
                icon: '🪄',
                image: 'img/weapons/700_bastao_runico.png',
                levelReq: 40,
                input: { type: 'wood3', qty: 2 },
                output: { type: 'craftedItem3', qty: 1, name: 'Bastão Rúnico' },
                xpGain: 250,
                time: 3.0,
                desc: 'Bastão com runas gravadas',
                price: 35
            },
            {
                id: 'craftedItem4',
                name: 'Escudo Ébano',
                icon: '🛡️',
                levelReq: 65,
                input: { type: 'wood4', qty: 2 },
                output: { type: 'craftedItem4', qty: 1, name: 'Escudo Ébano' },
                xpGain: 600,
                time: 3.5,
                desc: 'Escudo resistente feito de ébano',
                price: 55
            },
            {
                id: 'craftedItem5',
                name: 'Cajado Mágico',
                icon: '🔮',
                image: 'img/weapons/800_cajado_magico.png',
                levelReq: 90,
                input: { type: 'wood5', qty: 2 },
                output: { type: 'craftedItem5', qty: 1, name: 'Cajado Mágico' },
                xpGain: 1500,
                time: 4.0,
                desc: 'Cajado infundido com magia poderosa',
                price: 85
            }
        ];

        // Receitas de Ferraria
        const smithingRecipes = [
            {
                id: 'bar1',
                name: 'Barra de Cobre',
                icon: '🥉',
                image: 'img/barras/900_barra_de_cobre.png',
                levelReq: 1,
                input: { type: 'ore1', qty: 3 },
                output: { type: 'bar1', qty: 1, name: 'Barra de Cobre' },
                xpGain: 35,
                time: 2.0,
                desc: 'Barra de cobre maleável',
                price: 12
            },
            {
                id: 'bar2',
                name: 'Barra de Ferro',
                icon: '⚙️',
                image: 'img/barras/901_barra_de_ferro.png',
                levelReq: 15,
                input: { type: 'ore2', qty: 3 },
                output: { type: 'bar2', qty: 1, name: 'Barra de Ferro' },
                xpGain: 80,
                time: 2.5,
                desc: 'Barra de ferro resistente',
                price: 24
            },
            {
                id: 'bar3',
                name: 'Barra de Prata',
                icon: '🥈',
                image: 'img/barras/902_barra_de_prata.png',
                levelReq: 35,
                input: { type: 'ore3', qty: 3 },
                output: { type: 'bar3', qty: 1, name: 'Barra de Prata' },
                xpGain: 180,
                time: 3.0,
                desc: 'Barra de prata brilhante',
                price: 40
            },
            {
                id: 'bar4',
                name: 'Barra de Ouro',
                icon: '🥇',
                image: 'img/barras/903_barra_de_ouro.png',
                levelReq: 60,
                input: { type: 'ore4', qty: 3 },
                output: { type: 'bar4', qty: 1, name: 'Barra de Ouro' },
                xpGain: 450,
                time: 3.5,
                desc: 'Barra de ouro valiosa',
                price: 65
            },
            {
                id: 'bar5',
                name: 'Barra de Mitril',
                icon: '💫',
                image: 'img/904_barra_de_mitril.png',
                levelReq: 85,
                input: { type: 'ore5', qty: 3 },
                output: { type: 'bar5', qty: 1, name: 'Barra de Mitril' },
                xpGain: 1200,
                time: 4.0,
                desc: 'Barra lendária de mitril',
                price: 100
            },
            {
                id: 'bar6',
                name: 'Barra de Titânio',
                image: 'img/ore6_titanio.jpg',
                levelReq: 70,
                input: { type: 'ore6', qty: 3 },
                output: { type: 'bar6', qty: 1, name: 'Barra de Titânio' },
                xpGain: 1500,
                time: 4.2,
                desc: 'Barra leve e resistente de titânio',
                price: 300
            },
            {
                id: 'bar7',
                name: 'Barra de Adamantita',
                image: 'img/bar7_adamantita.jpg',
                levelReq: 80,
                input: { type: 'ore7', qty: 3 },
                output: { type: 'bar7', qty: 1, name: 'Barra de Adamantita' },
                xpGain: 2200,
                time: 4.5,
                desc: 'Barra verde escura e impenetrável de adamantita',
                price: 500
            },
            {
                id: 'bar8',
                name: 'Barra de Obsidiana',
                image: 'img/weapon_obsidian.jpg',
                levelReq: 95,
                input: { type: 'ore8', qty: 3 },
                output: { type: 'bar8', qty: 1, name: 'Barra de Obsidiana' },
                xpGain: 4000,
                time: 5.0,
                desc: 'Barra negra e incandescente com veios de lava',
                price: 900
            },
            {
                id: 'bar9',
                name: 'Barra Estelar',
                image: 'img/shield_starfall.jpg',
                levelReq: 100,
                input: { type: 'ore9', qty: 3 },
                output: { type: 'bar9', qty: 1, name: 'Barra Estelar' },
                xpGain: 8000,
                time: 6.0,
                desc: 'Barra cósmica cintilante de poeira estelar',
                price: 2000
            },
            {
                id: 'blade1',
                name: 'Lâmina de Cobre',
                icon: '⚙️',
                levelReq: 10,
                input: { type: 'bar1', qty: 5 },
                output: { type: 'blade1', qty: 1, name: 'Lâmina de Cobre' },
                xpGain: 100,
                time: 3.0,
                desc: 'Lâmina básica para a Serraria',
                price: 70
            },
            {
                id: 'blade2',
                name: 'Lâmina de Ferro',
                icon: '⚙️',
                levelReq: 25,
                input: { type: 'bar2', qty: 5 },
                output: { type: 'blade2', qty: 1, name: 'Lâmina de Ferro' },
                xpGain: 250,
                time: 4.0,
                desc: 'Lâmina durável para a Serraria',
                price: 150
            },
            {
                id: 'blade3',
                name: 'Lâmina de Mitril',
                icon: '⚙️',
                levelReq: 90,
                input: { type: 'bar5', qty: 5 },
                output: { type: 'blade3', qty: 1, name: 'Lâmina de Mitril' },
                xpGain: 2000,
                time: 6.0,
                desc: 'Lâmina indestrutível para a Serraria',
                price: 600
            }
        ];

        const enchantingRecipes = [
            // Armas (+15 ATK Elemental)
            { id: 'enchant_atk_fire', name: 'Pergaminho de Fogo (Arma) 🔥', icon: '📜', levelReq: 5, input: { type: 'herb1', qty: 5 }, output: { type: 'enchant_atk_fire', qty: 1, name: 'Pergaminho de Fogo (Arma) 🔥' }, xpGain: 50, time: 3.0, desc: 'Encanta a Arma ativa com +15 Dano de Fogo' },
            { id: 'enchant_atk_ice', name: 'Pergaminho de Gelo (Arma) ❄️', icon: '📜', levelReq: 25, input: { type: 'herb2', qty: 5 }, output: { type: 'enchant_atk_ice', qty: 1, name: 'Pergaminho de Gelo (Arma) ❄️' }, xpGain: 150, time: 3.5, desc: 'Encanta a Arma ativa com +15 Dano de Gelo' },
            { id: 'enchant_atk_lightning', name: 'Pergaminho de Raio (Arma) ⚡', icon: '📜', levelReq: 50, input: { type: 'herb3', qty: 5 }, output: { type: 'enchant_atk_lightning', qty: 1, name: 'Pergaminho de Raio (Arma) ⚡' }, xpGain: 400, time: 4.0, desc: 'Encanta a Arma ativa com +15 Dano de Raio' },
            { id: 'enchant_atk_nature', name: 'Pergaminho de Natureza (Arma) 🌿', icon: '📜', levelReq: 75, input: { type: 'herb4', qty: 5 }, output: { type: 'enchant_atk_nature', qty: 1, name: 'Pergaminho de Natureza (Arma) 🌿' }, xpGain: 900, time: 4.5, desc: 'Encanta a Arma ativa com +15 Dano de Natureza' },
            { id: 'enchant_atk_holy', name: 'Pergaminho Sagrado (Arma) ✨', icon: '📜', levelReq: 95, input: { type: 'herb5', qty: 3 }, output: { type: 'enchant_atk_holy', qty: 1, name: 'Pergaminho Sagrado (Arma) ✨' }, xpGain: 2000, time: 5.0, desc: 'Encanta a Arma ativa com +15 Dano Sagrado' },
            { id: 'enchant_atk_dark', name: 'Pergaminho Sombrio (Arma) 💀', icon: '📜', levelReq: 95, input: { type: 'herb5', qty: 3 }, output: { type: 'enchant_atk_dark', qty: 1, name: 'Pergaminho Sombrio (Arma) 💀' }, xpGain: 2000, time: 5.0, desc: 'Encanta a Arma ativa com +15 Dano Sombrio' },
            // Armaduras (-20% Dano Elemental recebido)
            { id: 'enchant_def_fire', name: 'Barreira de Fogo (Armadura) 🔥', icon: '📜', levelReq: 5, input: { type: 'herb1', qty: 5 }, output: { type: 'enchant_def_fire', qty: 1, name: 'Barreira de Fogo (Armadura) 🔥' }, xpGain: 50, time: 3.0, desc: 'Encanta a Armadura com -20% Dano de Fogo recebido' },
            { id: 'enchant_def_ice', name: 'Barreira de Gelo (Armadura) ❄️', icon: '📜', levelReq: 25, input: { type: 'herb2', qty: 5 }, output: { type: 'enchant_def_ice', qty: 1, name: 'Barreira de Gelo (Armadura) ❄️' }, xpGain: 150, time: 3.5, desc: 'Encanta a Armadura com -20% Dano de Gelo recebido' },
            { id: 'enchant_def_lightning', name: 'Barreira de Raio (Armadura) ⚡', icon: '📜', levelReq: 50, input: { type: 'herb3', qty: 5 }, output: { type: 'enchant_def_lightning', qty: 1, name: 'Barreira de Raio (Armadura) ⚡' }, xpGain: 400, time: 4.0, desc: 'Encanta a Armadura com -20% Dano de Raio recebido' },
            { id: 'enchant_def_nature', name: 'Barreira de Natureza (Armadura) 🌿', icon: '📜', levelReq: 75, input: { type: 'herb4', qty: 5 }, output: { type: 'enchant_def_nature', qty: 1, name: 'Barreira de Natureza (Armadura) 🌿' }, xpGain: 900, time: 4.5, desc: 'Encanta a Armadura com -20% Dano de Natureza recebido' },
            { id: 'enchant_def_holy', name: 'Proteção Sagrada (Armadura) ✨', icon: '📜', levelReq: 95, input: { type: 'herb5', qty: 3 }, output: { type: 'enchant_def_holy', qty: 1, name: 'Proteção Sagrada (Armadura) ✨' }, xpGain: 2000, time: 5.0, desc: 'Encanta a Armadura com -20% Dano Sagrado recebido' },
            { id: 'enchant_def_dark', name: 'Proteção Sombria (Armadura) 💀', icon: '📜', levelReq: 95, input: { type: 'herb5', qty: 3 }, output: { type: 'enchant_def_dark', qty: 1, name: 'Proteção Sombria (Armadura) 💀' }, xpGain: 2000, time: 5.0, desc: 'Encanta a Armadura com -20% Dano Sombrio recebido' },
            { id: 'potion_blacksmith', name: 'Elixir do Ferreiro 🧪✨', icon: '🧪', levelReq: 95, input: { type: 'herb5', qty: 15 }, output: { type: 'potion_blacksmith', qty: 1, name: 'Elixir do Ferreiro 🧪✨' }, xpGain: 2000, time: 5.0, desc: 'Garante 100% de sucesso no próximo aprimoramento da Ferraria' }
        ];

        const enemies = {
            goblin: { name: 'Goblin', health: 30, damage: 3 },
            esqueleto: { name: 'Esqueleto', health: 45, damage: 5 },
            lobisomem: { name: 'Lobisomem', health: 60, damage: 7 },
            dragao: { name: 'Dragão Jovem', health: 80, damage: 10 },
            troll: { name: 'Troll', health: 100, damage: 12 }
        };

        const inventoryItems = [
            { key: 'wood1', name: 'Madeira Comum', icon: '🪵' }, { key: 'wood2', name: 'Madeira de Carvalho', icon: '🌳' }, { key: 'wood3', name: 'Madeira de Teixo', icon: '🌲' }, { key: 'wood4', name: 'Madeira de Ébano', icon: '🪨' }, { key: 'wood5', name: 'Madeira Mágica', icon: '✨' },
            { key: 'ore1', name: 'Minério de Cobre', icon: '🥉' }, { key: 'ore2', name: 'Minério de Ferro', icon: '⚙️' }, { key: 'ore3', name: 'Minério de Prata', icon: '🥈' }, { key: 'ore4', name: 'Minério de Ouro', icon: '🥇' }, { key: 'ore5', name: 'Minério de Mitril', icon: '💫' },
            { key: 'fish1', name: 'Peixe Pequeno', icon: '🐟' }, { key: 'fish2', name: 'Salmão', icon: '🐠' }, { key: 'fish3', name: 'Atum', icon: '🐡' }, { key: 'fish4', name: 'Peixe-espada', icon: '🗡️' }, { key: 'fish5', name: 'Peixe Mágico', icon: '🌟' },
            { key: 'cookedFish1', name: 'Peixe Assado', icon: '🍖' }, { key: 'cookedFish2', name: 'Salmão Grelhado', icon: '🍣' }, { key: 'cookedFish3', name: 'Atum ao Molho', icon: '🍱' }, { key: 'cookedFish4', name: 'Peixe-espada Grelhado', icon: '🍽️' }, { key: 'cookedFish5', name: 'Peixe Mágico', icon: '✨' },
            { key: 'craftedItem1', name: 'Flecha de Madeira', icon: '🏹' }, { key: 'craftedItem2', name: 'Arco Curto', icon: '🏹' }, { key: 'craftedItem3', name: 'Bastão Rúnico', icon: '🪄' }, { key: 'craftedItem4', name: 'Escudo Ébano', icon: '🛡️' }, { key: 'craftedItem5', name: 'Cajado Mágico', icon: '🔮' },
            { key: 'bar1', name: 'Barra de Cobre', icon: '🥉' }, { key: 'bar2', name: 'Barra de Ferro', icon: '⚙️' }, { key: 'bar3', name: 'Barra de Prata', icon: '🥈' }, { key: 'bar4', name: 'Barra de Ouro', icon: '🥇' }, { key: 'bar5', name: 'Barra de Mitril', icon: '💫' },
            // Ervas
            { key: 'herb1', name: 'Folha de Calêndula', icon: '🌿' }, { key: 'herb2', name: 'Flor de Lavanda', icon: '🌸' }, { key: 'herb3', name: 'Líquen de Rocha', icon: '🍄' }, { key: 'herb4', name: 'Lótus de Fogo', icon: '🔥' }, { key: 'herb5', name: 'Orquídea Celestial', icon: '✨' },
            // Encantamentos Arma
            { key: 'enchant_atk_fire', name: 'Pergaminho de Fogo (Arma)', icon: '📜🔥' },
            { key: 'enchant_atk_ice', name: 'Pergaminho de Gelo (Arma)', icon: '📜❄️' },
            { key: 'enchant_atk_lightning', name: 'Pergaminho de Raio (Arma)', icon: '📜⚡' },
            { key: 'enchant_atk_nature', name: 'Pergaminho de Natureza (Arma)', icon: '📜🌿' },
            { key: 'enchant_atk_holy', name: 'Pergaminho Sagrado (Arma)', icon: '📜✨' },
            { key: 'enchant_atk_dark', name: 'Pergaminho Sombrio (Arma)', icon: '📜💀' },
            // Encantamentos Armadura
            { key: 'enchant_def_fire', name: 'Barreira de Fogo (Armadura)', icon: '📜🔥' },
            { key: 'enchant_def_ice', name: 'Barreira de Gelo (Armadura)', icon: '📜❄️' },
            { key: 'enchant_def_lightning', name: 'Barreira de Raio (Armadura)', icon: '📜⚡' },
            { key: 'enchant_def_nature', name: 'Barreira de Natureza (Armadura)', icon: '📜🌿' },
            { key: 'enchant_def_holy', name: 'Proteção Sagrada (Armadura)', icon: '📜✨' },
            { key: 'enchant_def_dark', name: 'Proteção Sombria (Armadura)', icon: '📜💀' },
            { key: 'potion_blacksmith', name: 'Elixir do Ferreiro', icon: '🧪' },
            { key: 'blade1', name: 'Lâmina de Cobre', icon: '⚙️' },
            { key: 'blade2', name: 'Lâmina de Ferro', icon: '⚙️' },
            { key: 'blade3', name: 'Lâmina de Mitril', icon: '⚙️' },
            { key: 'amber', name: 'Âmbar Ancestral', icon: '💎' },
            { key: 'slag', name: 'Escória Brilhante', icon: '🔥' }
        ];

let xpBase = 100;
let xpMult = 1.14;
const xpRequired = [0];
for (let i = 1; i <= 500; i++) xpRequired.push(Math.floor(xpBase * Math.pow(xpMult, i - 1)));


        // DADOS E SISTEMA DE FERRAMENTAS
        // ============================================
        const toolsData = [
            {
                id: 'axe',
                name: 'Machado',
                icon: '🪓',
                skill: 'woodcutting',
                skillLabel: 'Corte de Lenha',
                buffIcon: '🪓',
                tiers: [
                    { name: 'Machado de Madeira',  icon: '🪓', xpBonus: 10, cost: 300,  reqLevel: 1  },
                    { name: 'Machado de Ferro',    icon: '⚙️🪓', xpBonus: 20, cost: 1500,  reqLevel: 15 },
                    { name: 'Machado de Prata',    icon: '🥈🪓', xpBonus: 35, cost: 5000, reqLevel: 35 },
                    { name: 'Machado de Ouro',     icon: '🥇🪓', xpBonus: 55, cost: 15000, reqLevel: 60 },
                    { name: 'Machado de Mitril',   icon: '💫🪓', xpBonus: 80, cost: 50000, reqLevel: 85 },
                ]
            },
            {
                id: 'pickaxe',
                name: 'Picareta',
                icon: '⛏️',
                skill: 'mining',
                skillLabel: 'Mineração',
                buffIcon: '⛏️',
                tiers: [
                    { name: 'Picareta de Madeira', icon: '⛏️',   xpBonus: 10, cost: 300,  reqLevel: 1  },
                    { name: 'Picareta de Ferro',   icon: '⚙️⛏️', xpBonus: 20, cost: 1500,  reqLevel: 15 },
                    { name: 'Picareta de Prata',   icon: '🥈⛏️', xpBonus: 35, cost: 5000, reqLevel: 35 },
                    { name: 'Picareta de Ouro',    icon: '🥇⛏️', xpBonus: 55, cost: 15000, reqLevel: 60 },
                    { name: 'Picareta de Mitril',  icon: '💫⛏️', xpBonus: 80, cost: 50000, reqLevel: 85 },
                ]
            },
            {
                id: 'rod',
                name: 'Vara de Pesca',
                icon: '🎣',
                skill: 'fishing',
                skillLabel: 'Pesca',
                buffIcon: '🎣',
                tiers: [
                    { name: 'Vara de Bambu',       icon: '🎣',   xpBonus: 10, cost: 300,  reqLevel: 1  },
                    { name: 'Vara de Carvalho',    icon: '🌳🎣', xpBonus: 20, cost: 1500,  reqLevel: 15 },
                    { name: 'Vara Élfica',         icon: '🌿🎣', xpBonus: 35, cost: 5000, reqLevel: 35 },
                    { name: 'Vara Encantada',      icon: '✨🎣', xpBonus: 55, cost: 15000, reqLevel: 60 },
                    { name: 'Vara Lendária',       icon: '💫🎣', xpBonus: 80, cost: 50000, reqLevel: 85 },
                ]
            }
        ];

        function getToolBonus(skill) {
            // Retorna o % de XP extra da ferramenta equipada para a skill
            if (!gameState.tools) return 0;
            const tool = toolsData.find(t => t.skill === skill);
            if (!tool) return 0;
            const tier = gameState.tools[tool.id] || 0; // 0 = sem ferramenta
            if (tier === 0) return 0;
            return tool.tiers[tier - 1].xpBonus;
        }

        function buyTool(toolId) {
            const tool = toolsData.find(t => t.id === toolId);
            if (!tool) return;
            if (!gameState.tools) gameState.tools = {};
            const currentTier = gameState.tools[toolId] || 0;
            if (currentTier >= tool.tiers.length) return; // já no máximo

            const nextTier = tool.tiers[currentTier]; // tier a comprar (0-indexed)
            const skillLevel = gameState.skills[tool.skill]?.level || 1;

            if (skillLevel < nextTier.reqLevel) {
                showNotification('❌ Nível!', `Precisa de nível ${nextTier.reqLevel} em ${tool.skillLabel}.`, 'error');
                return;
            }
            const customCost = window.balancingConfig?.toolCosts?.[toolId]?.[currentTier];
            const baseCost = (customCost !== undefined && customCost !== null) ? customCost : nextTier.cost;
            const shopMult = window.balancingConfig?.shopPriceMult || 1.0;
            const finalCost = Math.floor(baseCost * shopMult);

            if (gameState.gold < finalCost) {
                showNotification('❌ Ouro!', `Precisa de ${finalCost} 💰.`, 'error');
                return;
            }

            gameState.gold -= finalCost;
            gameState.tools[toolId] = currentTier + 1;

            const newTierData = tool.tiers[currentTier]; // agora é o tier recém comprado
            showNotification(
                `${tool.buffIcon} Ferramenta!`,
                `${newTierData.name} equipada! +${newTierData.xpBonus}% XP em ${tool.skillLabel}`,
                'success', tool.buffIcon
            );
            updateUI();
            updateToolsPage();
        }

        function updateToolsPage() {
            const grid = document.getElementById('toolsGrid');
            if (!grid) return;
            if (!gameState.tools) gameState.tools = {};

            grid.innerHTML = '';
            toolsData.forEach(tool => {
                const currentTier = gameState.tools[tool.id] || 0;
                const isMaxed = currentTier >= tool.tiers.length;
                const currentTierData = currentTier > 0 ? tool.tiers[currentTier - 1] : null;
                const nextTierData    = !isMaxed ? tool.tiers[currentTier] : null;
                const skillLevel      = gameState.skills[tool.skill]?.level || 1;

                const customCost = nextTierData ? window.balancingConfig?.toolCosts?.[tool.id]?.[currentTier] : null;
                const baseCost = (customCost !== undefined && customCost !== null) ? customCost : (nextTierData ? nextTierData.cost : 0);
                const shopMult = window.balancingConfig?.shopPriceMult || 1.0;
                const finalCost = Math.floor(baseCost * shopMult);

                const canAfford       = nextTierData && gameState.gold >= finalCost;
                const hasLevel        = nextTierData && skillLevel >= nextTierData.reqLevel;

                // Pips de tier
                const pips = tool.tiers.map((_, i) =>
                    `<div class="tool-tier-pip ${i < currentTier ? 'filled' : ''}"></div>`
                ).join('');

                const tierLabel = isMaxed
                    ? `✅ Máximo — ${currentTierData.name}`
                    : currentTier === 0
                        ? 'Sem ferramenta'
                        : `Tier ${currentTier}/5 — ${currentTierData.name}`;

                const effectNow = currentTierData
                    ? `+${currentTierData.xpBonus}% XP em ${tool.skillLabel}`
                    : `Sem bônus ativo`;

                const nextEffect = nextTierData
                    ? `Próximo: ${nextTierData.name} → +${nextTierData.xpBonus}% XP`
                    : '';

                const costHtml = isMaxed ? '' : `
                    <div class="tool-cost">
                        💰 ${finalCost.toLocaleString('pt-BR')}
                        ${!hasLevel ? `<span style="color:#ff4444;font-size:0.8em;"> (Nv.${nextTierData.reqLevel} necessário)</span>` : ''}
                    </div>`;

                const btnLabel = isMaxed ? '✅ Máximo' : currentTier === 0 ? '🔧 Comprar' : '⬆️ Melhorar';
                const btnDisabled = isMaxed || !canAfford || !hasLevel;

                const card = document.createElement('div');
                card.className = 'tool-card';
                card.innerHTML = `
                    <div class="tool-icon">${currentTierData ? currentTierData.icon : tool.icon}</div>
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-skill-label">📊 ${tool.skillLabel}</div>
                    <div class="tool-tier-bar">${pips}</div>
                    <div class="tool-current-tier">${tierLabel}</div>
                    <div class="tool-effect">${effectNow}</div>
                    <div class="tool-next-effect">${nextEffect}</div>
                    ${costHtml}
                    <button class="tool-buy-btn ${isMaxed ? 'maxed' : ''}"
                        onclick="buyTool('${tool.id}')"
                        ${btnDisabled ? 'disabled' : ''}>
                        ${btnLabel}
                    </button>`;
                grid.appendChild(card);
            });
        }
