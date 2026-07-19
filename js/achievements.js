        // ============================================
        // SISTEMA DE CONQUISTAS (50 ACHIEVEMENTS)
        // ============================================
        const achievementsList = [
            // ====== COLETA ======
            { id: 'ach_wood1',    icon: '🌱', name: 'Primeiro Galho',       desc: 'Colete 1 Madeira pela primeira vez.',         type: 'inventory', key: 'wood1',     threshold: 1,    bonus: { type: 'xpBoost_gather', value: 1 },   bonusLabel: '+1% XP em Coleta' },
            { id: 'ach_wood2',    icon: '🌳', name: 'Lenhador Aprendiz',   desc: 'Acumule 100 unidades de madeira coletadas.',  type: 'stat',     key: 'totalWood', threshold: 100,  bonus: { type: 'xpBoost_gather', value: 2 },   bonusLabel: '+2% XP em Coleta' },
            { id: 'ach_wood3',    icon: '🪓', name: 'Mestre Lenhador',     desc: 'Acumule 1000 unidades de madeira coletadas.', type: 'stat',     key: 'totalWood', threshold: 1000, bonus: { type: 'xpBoost_gather', value: 3 },   bonusLabel: '+3% XP em Coleta' },
            { id: 'ach_ore1',     icon: '⛏️', name: 'Primeira Mina',       desc: 'Colete 1 Minério pela primeira vez.',         type: 'inventory', key: 'ore1',      threshold: 1,    bonus: { type: 'xpBoost_gather', value: 1 },   bonusLabel: '+1% XP em Coleta' },
            { id: 'ach_ore2',     icon: '🪨', name: 'Mineiro Dedicado',    desc: 'Acumule 500 minérios coletados.',             type: 'stat',     key: 'totalOre',  threshold: 500,  bonus: { type: 'goldBonus', value: 1 },        bonusLabel: '+1% Ouro de combate' },
            { id: 'ach_ore3',     icon: '💎', name: 'Rei das Minas',       desc: 'Acumule 2000 minérios coletados.',            type: 'stat',     key: 'totalOre',  threshold: 2000, bonus: { type: 'goldBonus', value: 2 },        bonusLabel: '+2% Ouro de combate' },
            { id: 'ach_fish1',    icon: '🎣', name: 'Primeira Isca',       desc: 'Capture 1 peixe pela primeira vez.',          type: 'inventory', key: 'fish1',     threshold: 1,    bonus: { type: 'xpBoost_gather', value: 1 },   bonusLabel: '+1% XP em Coleta' },
            { id: 'ach_fish2',    icon: '🐠', name: 'Pescador Talentoso',  desc: 'Capture 200 peixes no total.',                type: 'stat',     key: 'totalFish', threshold: 200,  bonus: { type: 'healthBonus', value: 5 },      bonusLabel: '+5 Vida Máxima' },
            { id: 'ach_fish3',    icon: '🐋', name: 'Mestre dos Mares',    desc: 'Capture 1000 peixes no total.',               type: 'stat',     key: 'totalFish', threshold: 1000, bonus: { type: 'healthBonus', value: 15 },     bonusLabel: '+15 Vida Máxima' },
            // ====== CRAFT ======
            { id: 'ach_craft1',   icon: '🔨', name: 'Artesão Iniciante',   desc: 'Complete seu primeiro craft.',                type: 'stat',     key: 'totalCrafts', threshold: 1,   bonus: { type: 'xpBoost_craft', value: 1 },    bonusLabel: '+1% XP em Craft' },
            { id: 'ach_craft2',   icon: '🧰', name: 'Artesão Habilidoso',  desc: 'Complete 50 crafts.',                         type: 'stat',     key: 'totalCrafts', threshold: 50,  bonus: { type: 'xpBoost_craft', value: 2 },    bonusLabel: '+2% XP em Craft' },
            { id: 'ach_craft3',   icon: '🏺', name: 'Mestre Artesão',      desc: 'Complete 200 crafts.',                        type: 'stat',     key: 'totalCrafts', threshold: 200, bonus: { type: 'xpBoost_craft', value: 3 },    bonusLabel: '+3% XP em Craft' },
            { id: 'ach_smith1',   icon: '⚒️', name: 'Ferreiro Novato',     desc: 'Forje seu primeiro item na Ferraria.',        type: 'stat',     key: 'totalSmith', threshold: 1,   bonus: { type: 'strengthBonus', value: 1 },    bonusLabel: '+1 Força base' },
            { id: 'ach_smith2',   icon: '🔥', name: 'Ferreiro Experiente', desc: 'Forje 30 itens na Ferraria.',                 type: 'stat',     key: 'totalSmith', threshold: 30,  bonus: { type: 'strengthBonus', value: 3 },    bonusLabel: '+3 Força base' },
            { id: 'ach_cook1',    icon: '🍳', name: 'Chef Iniciante',      desc: 'Cozinhe seu primeiro prato.',                 type: 'stat',     key: 'totalCook',  threshold: 1,   bonus: { type: 'healthBonus', value: 5 },      bonusLabel: '+5 Vida Máxima' },
            { id: 'ach_cook2',    icon: '👨‍🍳','name': 'Chef Experiente',    desc: 'Cozinhe 50 pratos.',                          type: 'stat',     key: 'totalCook',  threshold: 50,  bonus: { type: 'healthBonus', value: 10 },     bonusLabel: '+10 Vida Máxima' },
            { id: 'ach_alchemy1', icon: '🧪', name: 'Alquimista Iniciante',desc: 'Crie sua primeira poção.',                    type: 'stat',     key: 'totalPotions', threshold: 1,  bonus: { type: 'xpBoost_all', value: 1 },      bonusLabel: '+1% XP global' },
            { id: 'ach_alchemy2', icon: '🔮', name: 'Mestre Alquimista',   desc: 'Crie 20 poções.',                             type: 'stat',     key: 'totalPotions', threshold: 20, bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            // ====== NÍVEIS ======
            { id: 'ach_lvl10a',   icon: '📈', name: 'Primeiros Passos',    desc: 'Atinja nível 10 em qualquer habilidade.',     type: 'skill_any', threshold: 10,  bonus: { type: 'xpBoost_all', value: 1 },      bonusLabel: '+1% XP global' },
            { id: 'ach_lvl25a',   icon: '⚡', name: 'Veterano',            desc: 'Atinja nível 25 em qualquer habilidade.',     type: 'skill_any', threshold: 25,  bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            { id: 'ach_lvl50a',   icon: '🌟', name: 'Lendário',            desc: 'Atinja nível 50 em qualquer habilidade.',     type: 'skill_any', threshold: 50,  bonus: { type: 'xpBoost_all', value: 5 },      bonusLabel: '+5% XP global' },
            { id: 'ach_lvl10all', icon: '📊', name: 'Generalista',         desc: 'Atinja nível 10 em todas as 6 habilidades.',  type: 'skill_all', threshold: 10,  bonus: { type: 'goldBonus', value: 3 },        bonusLabel: '+3% Ouro em tudo' },
            { id: 'ach_woodlvl20',icon: '🌲', name: 'Floresta Dominada',   desc: 'Atinja nível 20 em Corte de Lenha.',          type: 'skill',    key: 'woodcutting', threshold: 20, bonus: { type: 'xpBoost_gather', value: 2 },   bonusLabel: '+2% XP em Coleta' },
            { id: 'ach_minelvl20',icon: '⛏️', name: 'Profundidades',       desc: 'Atinja nível 20 em Mineração.',               type: 'skill',    key: 'mining',      threshold: 20, bonus: { type: 'strengthBonus', value: 2 },    bonusLabel: '+2 Força base' },
            { id: 'ach_fishlvl20',icon: '🌊', name: 'Mar Aberto',          desc: 'Atinja nível 20 em Pesca.',                   type: 'skill',    key: 'fishing',     threshold: 20, bonus: { type: 'healthBonus', value: 10 },     bonusLabel: '+10 Vida Máxima' },
            // ====== OURO ======
            { id: 'ach_gold1',    icon: '💰', name: 'Primeiras Moedas',    desc: 'Acumule 500 de ouro.',                        type: 'gold',     threshold: 500,   bonus: { type: 'goldBonus', value: 1 },        bonusLabel: '+1% Ouro' },
            { id: 'ach_gold2',    icon: '💵', name: 'Comerciante',         desc: 'Acumule 5.000 de ouro.',                      type: 'gold',     threshold: 5000,  bonus: { type: 'goldBonus', value: 2 },        bonusLabel: '+2% Ouro' },
            { id: 'ach_gold3',    icon: '🏦', name: 'Milionário do Império', desc: 'Acumule 50.000 de ouro.',                  type: 'gold',     threshold: 50000, bonus: { type: 'goldBonus', value: 5 },        bonusLabel: '+5% Ouro' },
            { id: 'ach_gold4',    icon: '👑', name: 'Riqueza dos Leões',   desc: 'Acumule 10.000 de ouro.',                     type: 'gold',     threshold: 10000, bonus: { type: 'goldBonus', value: 3 },        bonusLabel: '+3% Ouro' },
            // ====== COMBATE ======
            { id: 'ach_kill1',    icon: '⚔️', name: 'Primeiro Sangue',     desc: 'Derrote seu primeiro inimigo.',               type: 'stat',     key: 'totalKills', threshold: 1,   bonus: { type: 'strengthBonus', value: 1 },    bonusLabel: '+1 Força base' },
            { id: 'ach_kill2',    icon: '🗡️', name: 'Caçador',             desc: 'Derrote 25 inimigos.',                        type: 'stat',     key: 'totalKills', threshold: 25,  bonus: { type: 'strengthBonus', value: 2 },    bonusLabel: '+2 Força base' },
            { id: 'ach_kill3',    icon: '🦁', name: 'Guerreiro Lendário',  desc: 'Derrote 100 inimigos.',                       type: 'stat',     key: 'totalKills', threshold: 100, bonus: { type: 'strengthBonus', value: 5 },    bonusLabel: '+5 Força base' },
            { id: 'ach_dungeon1', icon: '🏰', name: 'Explorador',          desc: 'Complete sua primeira masmorra.',             type: 'stat',     key: 'totalDungeons', threshold: 1, bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            { id: 'ach_dungeon2', icon: '🐉', name: 'Conquistador',        desc: 'Complete 10 masmorras.',                      type: 'stat',     key: 'totalDungeons', threshold:10, bonus: { type: 'xpBoost_all', value: 3 },      bonusLabel: '+3% XP global' },
            // ====== MASCOTES ======
            { id: 'ach_pet1',     icon: '🐣', name: 'Primeiro Companheiro',desc: 'Obtenha seu primeiro mascote.',               type: 'pets',     threshold: 1,     bonus: { type: 'xpBoost_all', value: 1 },      bonusLabel: '+1% XP global' },
            { id: 'ach_pet2',     icon: '🐲', name: 'Criador de Mascotes', desc: 'Possua 3 mascotes.',                          type: 'pets',     threshold: 3,     bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            { id: 'ach_pet_master1',icon: '📖', name: 'Mestre dos Mascotes', desc: 'Consagre seu primeiro mascote no Livro de Conquistas.', type: 'enshrined', threshold: 1,  bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            { id: 'ach_pet_master2',icon: '🏛️',name: 'Arquivista Real',    desc: 'Consagre 3 mascotes no Livro de Conquistas.', type: 'enshrined', threshold: 3,  bonus: { type: 'xpBoost_all', value: 3 },      bonusLabel: '+3% XP global' },
            { id: 'ach_pet_master3',icon: '👑', name: 'Grão-Mestre',       desc: 'Consagre 5 mascotes no Livro de Conquistas.', type: 'enshrined', threshold: 5,  bonus: { type: 'xpBoost_all', value: 5 },      bonusLabel: '+5% XP global' },
            // ====== PROPRIEDADE ======
            { id: 'ach_prop1',    icon: '🏡', name: 'Proprietário',        desc: 'Melhore qualquer propriedade pela 1ª vez.',   type: 'stat',     key: 'totalPropUpg', threshold: 1,  bonus: { type: 'goldBonus', value: 1 },        bonusLabel: '+1% Ouro passivo' },
            { id: 'ach_prop2',    icon: '🏰', name: 'Senhor das Terras',   desc: 'Melhore propriedades 10 vezes.',              type: 'stat',     key: 'totalPropUpg', threshold: 10, bonus: { type: 'goldBonus', value: 2 },        bonusLabel: '+2% Ouro passivo' },
            // ====== ESPECIAIS ======
            { id: 'ach_auto1',    icon: '🤖', name: 'Automação Iniciada',  desc: 'Ative sua primeira automação.',               type: 'stat',     key: 'totalAutos', threshold: 1,   bonus: { type: 'xpBoost_all', value: 1 },      bonusLabel: '+1% XP global' },
            { id: 'ach_auto2',    icon: '⚙️', name: 'Império Automático',  desc: 'Ative 5 automações simultâneas.',             type: 'stat',     key: 'totalAutos', threshold: 5,   bonus: { type: 'xpBoost_all', value: 2 },      bonusLabel: '+2% XP global' },
            { id: 'ach_bank1',    icon: '📦', name: 'Armazém Ampliado',    desc: 'Expanda o banco para 10 espaços.',             type: 'bankSlots', threshold: 10,   bonus: { type: 'goldBonus', value: 1 },        bonusLabel: '+1% Ouro' },
            { id: 'ach_sell1',    icon: '🛒', name: 'Primeiro Negócio',    desc: 'Venda seu primeiro item.',                    type: 'stat',     key: 'totalSells', threshold: 1,   bonus: { type: 'goldBonus', value: 1 },        bonusLabel: '+1% Ouro' },
            { id: 'ach_sell2',    icon: '🏪', name: 'Mercador Experiente', desc: 'Venda 100 itens.',                            type: 'stat',     key: 'totalSells', threshold: 100, bonus: { type: 'goldBonus', value: 2 },        bonusLabel: '+2% Ouro' },
            { id: 'ach_potion1',  icon: '💊', name: 'Primeira Cura',       desc: 'Use sua primeira poção.',                     type: 'stat',     key: 'totalPotionsUsed', threshold: 1,  bonus: { type: 'healthBonus', value: 5 },   bonusLabel: '+5 Vida Máxima' },
            { id: 'ach_eq1',      icon: '🛡️', name: 'Primeiros Equipamentos', desc: 'Equipe um item.',                         type: 'stat',     key: 'totalEquipped', threshold: 1,  bonus: { type: 'xpBoost_all', value: 1 },    bonusLabel: '+1% XP global' },
            { id: 'ach_total50',  icon: '🌍', name: 'Nível 50 Global',     desc: 'Atinja Nível Total 50.',                      type: 'totalLevel', threshold: 50,  bonus: { type: 'xpBoost_all', value: 3 },      bonusLabel: '+3% XP global' },
            { id: 'ach_total100', icon: '🌟', name: 'Nível 100 Global',    desc: 'Atinja Nível Total 100.',                     type: 'totalLevel', threshold: 100, bonus: { type: 'xpBoost_all', value: 5 },      bonusLabel: '+5% XP global' },
            { id: 'ach_surviv1',  icon: '🏥', name: 'Sobrevivente',        desc: 'Sobreviva a 10 batalhas com vida abaixo de 20%.', type: 'stat', key: 'totalNearDeath', threshold: 10, bonus: { type: 'healthBonus', value: 20 }, bonusLabel: '+20 Vida Máxima' },
            { id: 'ach_tech1',    icon: '🔬', name: 'Cientista',           desc: 'Compre sua primeira melhoria de Tecnologia.', type: 'stat', key: 'totalTechBought', threshold: 1,   bonus: { type: 'xpBoost_all', value: 1 },     bonusLabel: '+1% XP global' },
            { id: 'ach_tech2',    icon: '🧬', name: 'Inventor',            desc: 'Compre 5 melhorias de Tecnologia.',           type: 'stat', key: 'totalTechBought', threshold: 5,   bonus: { type: 'xpBoost_all', value: 2 },     bonusLabel: '+2% XP global' },
            { id: 'ach_rich1',    icon: '✨', name: 'A Fortuna de Casterley', desc: 'Gaste mais de 10.000 de ouro no total.',   type: 'stat', key: 'totalGoldSpent', threshold: 10000, bonus: { type: 'goldBonus', value: 2 },      bonusLabel: '+2% Ouro' },
            // ====== BESTIÁRIO ======
            { id: 'ach_bestiary1', icon: '❄️', name: 'Caçador Glacial',    desc: 'Derrote 500 Golems de Gelo.', type: 'bestiary', key: 'Golem de Gelo', threshold: 500, bonus: { type: 'xpBoost_all', value: 1 }, bonusLabel: '+1% XP global' },
            { id: 'ach_bestiary2', icon: '🔥', name: 'Domador das Chamas', desc: 'Derrote 500 Elementais de Fogo.', type: 'bestiary', key: 'Elemental de Fogo', threshold: 500, bonus: { type: 'goldBonus', value: 1 }, bonusLabel: '+1% Ouro' },
            { id: 'ach_bestiary3', icon: '💧', name: 'Guardião dos Mares', desc: 'Derrote 500 Elementais de Água.', type: 'bestiary', key: 'Elemental de Água', threshold: 500, bonus: { type: 'healthBonus', value: 10 }, bonusLabel: '+10 Vida Máxima' },
            { id: 'ach_bestiary4', icon: '🌪️', name: 'Mestre dos Ventos',  desc: 'Derrote 500 Elementais de Ar.', type: 'bestiary', key: 'Elemental de Ar', threshold: 500, bonus: { type: 'strengthBonus', value: 2 }, bonusLabel: '+2 Força base' },
            { id: 'ach_bestiary5', icon: '🪨', name: 'Soberano da Terra',  desc: 'Derrote 500 Elementais de Terra.', type: 'bestiary', key: 'Elemental de Terra', threshold: 500, bonus: { type: 'xpBoost_all', value: 2 }, bonusLabel: '+2% XP global' },
        ];

        // Inicializar estrutura de conquistas e stats no gameState
        function initAchievements() {
            if (!gameState.achievements) gameState.achievements = {};
            if (!gameState.stats) gameState.stats = {
                totalWood: 0, totalOre: 0, totalFish: 0,
                totalCrafts: 0, totalSmith: 0, totalCook: 0, totalPotions: 0, totalPotionsUsed: 0,
                totalKills: 0, totalDungeons: 0, totalAutos: 0, totalSells: 0, totalEquipped: 0,
                totalNearDeath: 0, totalTechBought: 0, totalGoldSpent: 0, totalPropUpg: 0
            };
        }

        function checkAchievements() {
            if (!gameState.player) return;
            initAchievements();
            let anyNew = false;
            const totalLevel = Object.values(gameState.skills).reduce((a, s) => a + s.level, 0);

            for (const ach of achievementsList) {
                if (gameState.achievements[ach.id]) continue;
                let met = false;

                if (ach.type === 'inventory')    met = (gameState.inventory[ach.key] || 0) >= ach.threshold;
                if (ach.type === 'stat')         met = (gameState.stats[ach.key] || 0) >= ach.threshold;
                if (ach.type === 'gold')         met = gameState.gold >= ach.threshold;
                if (ach.type === 'bankSlots')    met = gameState.bankSlots >= ach.threshold;
                if (ach.type === 'skill')        met = (gameState.skills[ach.key]?.level || 0) >= ach.threshold;
                if (ach.type === 'skill_any')    met = Object.values(gameState.skills).some(s => s.level >= ach.threshold);
                if (ach.type === 'skill_all')    met = Object.values(gameState.skills).every(s => s.level >= ach.threshold);
                if (ach.type === 'pets')         met = (gameState.pets.owned?.length || 0) >= ach.threshold;
                if (ach.type === 'enshrined')    met = getEnshrinedCount() >= ach.threshold;
                if (ach.type === 'totalLevel')   met = totalLevel >= ach.threshold;
                if (ach.type === 'bestiary')     met = (gameState.bestiary?.[ach.key]?.count || 0) >= ach.threshold;

                if (met) {
                    gameState.achievements[ach.id] = true;
                    showNotification('🏆 Conquista!', `${ach.icon} ${ach.name} — ${ach.bonusLabel}`, 'success', '🏆');
                    anyNew = true;
                    // Efeito visual: confetes + texto flutuante
                    if (typeof spawnConfetti === 'function') {
                        const cx = window.innerWidth / 2;
                        const cy = window.innerHeight * 0.35;
                        spawnConfetti(cx, cy, 30, ['#ffd700', '#ffaa00', '#fff4a0', '#ffdd44', '#ffffff']);
                        spawnFloatingText(cx, cy - 40, `🏆 ${ach.icon} ${ach.name}`, { type: 'special', duration: 1.8 });
                    }
                }
            }
            return anyNew;
        }

        function getAchievementBonus(type) {
            if (!gameState.achievements) return 0;
            const achTotal = achievementsList
                .filter(a => a.bonus.type === type && gameState.achievements[a.id])
                .reduce((sum, a) => sum + a.bonus.value, 0);
            const masteryTotal = typeof getPetMasteryBonus === 'function' ? getPetMasteryBonus(type) : 0;
            return achTotal + masteryTotal;
        }

        // ============================================
        // SISTEMA DE FILTROS DAS CONQUISTAS
        // ============================================
        if (!window.achFilters) {
            window.achFilters = { category: 'all', status: 'all', search: '' };
        }

        function getAchievementCategory(achId) {
            if (achId.startsWith('ach_wood') || achId.startsWith('ach_ore') || achId.startsWith('ach_fish')) return 'coleta';
            if (achId.startsWith('ach_craft') || achId.startsWith('ach_smith') || achId.startsWith('ach_cook') || achId.startsWith('ach_alchemy')) return 'craft';
            if (achId.startsWith('ach_lvl')) return 'niveis';
            if (achId.startsWith('ach_gold')) return 'ouro';
            if (achId.startsWith('ach_kill') || achId.startsWith('ach_dungeon')) return 'combate';
            if (achId.startsWith('ach_pet')) return 'mascotes';
            if (achId.startsWith('ach_prop')) return 'propriedade';
            if (achId.startsWith('ach_bestiary')) return 'bestiario';
            return 'especiais';
        }

        function syncAchFilterUI() {
            if (!window.achFilters) return;
            const { category, status } = window.achFilters;
            
            document.querySelectorAll('#achCategoryFilters .ach-filter-btn').forEach(btn => {
                const isActive = btn.dataset.cat === category;
                btn.style.background = isActive ? 'rgba(255,215,0,0.2)' : '';
                btn.style.borderColor = isActive ? 'rgba(255,215,0,0.6)' : '';
                btn.style.color = isActive ? '#ffd700' : '';
                btn.style.fontWeight = isActive ? '700' : '600';
            });
            
            document.querySelectorAll('.ach-status-btn').forEach(btn => {
                const isActive = btn.dataset.status === status;
                btn.style.background = isActive ? 'rgba(255,215,0,0.15)' : 'transparent';
                btn.style.color = isActive ? '#ffd700' : '#aaa';
                btn.style.fontWeight = isActive ? '700' : '600';
            });
        }

        function setAchFilter(filterType, value) {
            if (!window.achFilters) window.achFilters = { category: 'all', status: 'all', search: '' };
            window.achFilters[filterType] = value;
            syncAchFilterUI();
            renderFilteredAchievements();
        }

        function renderFilteredAchievements() {
            const grid = document.getElementById('achievementsGrid');
            if (!grid) return;
            if (!window.achFilters) window.achFilters = { category: 'all', status: 'all', search: '' };

            const { category, status, search } = window.achFilters;
            const searchLower = search.toLowerCase().trim();

            let filtered = achievementsList.filter(ach => {
                // Filtro de categoria
                if (category !== 'all') {
                    if (getAchievementCategory(ach.id) !== category) return false;
                }

                // Filtro de status
                const done = !!gameState.achievements[ach.id];
                if (status === 'completed' && !done) return false;
                if (status === 'locked' && done) return false;

                // Filtro de busca textual
                if (searchLower) {
                    const matchName = ach.name.toLowerCase().includes(searchLower);
                    const matchDesc = ach.desc.toLowerCase().includes(searchLower);
                    const matchBonus = ach.bonusLabel.toLowerCase().includes(searchLower);
                    if (!matchName && !matchDesc && !matchBonus) return false;
                }

                return true;
            });

            // Atualizar contador de resultados
            const countEl = document.getElementById('achFilterResultCount');
            if (countEl) {
                const total = filtered.length;
                const shown = total;
                countEl.textContent = total > 0 ? `📌 ${total} resultado${total !== 1 ? 's' : ''}` : '';
            }

            if (filtered.length === 0) {
                grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:#666; font-family:'Outfit',sans-serif;">
                    <div style="font-size:2em; margin-bottom:8px;">🔍</div>
                    <div style="font-size:0.9em;">Nenhuma conquista encontrada com esses filtros.</div>
                </div>`;
                return;
            }

            grid.innerHTML = filtered.map(ach => {
                const done = !!gameState.achievements[ach.id];
                return `<div class="achievement-card ${done ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${done ? '🏆 ' : ''}${ach.name}</div>
                        <div class="achievement-desc">${ach.desc}</div>
                        <div class="achievement-bonus">${done ? '✅ ' : '🎁 '}${ach.bonusLabel}</div>
                    </div>
                </div>`;
            }).join('');
        }

        function updateProfileModal() {
            initAchievements();
            const cls = gameClasses.find(c => c.id === gameState.player?.classId);
            const totalLevel = Object.values(gameState.skills).reduce((a, s) => a + s.level, 0);

            // Hero card
            const heroCard = document.getElementById('profileHeroCard');
            if (heroCard) {
                let totalGS = 0;
                if (typeof calculateGearScore === 'function' && typeof getEquipmentItemData === 'function') {
                    for (let slot in gameState.equipment.equipped) {
                        const eqId = gameState.equipment.equipped[slot];
                        if (eqId) {
                            const eq = getEquipmentItemData(eqId);
                            if (eq) totalGS += calculateGearScore(eq);
                        }
                    }
                }
                
                heroCard.innerHTML = `
                    <div class="profile-avatar">${gameState.player.avatar || '⚔️'}</div>
                    <div class="profile-hero-info">
                        <div class="profile-hero-name">${gameState.player.name || 'Herói'}</div>
                        <div class="profile-hero-class">${cls ? cls.icon + ' ' + cls.name : ''}</div>
                        <div class="profile-hero-gold">💰 ${formatNumber(gameState.gold)} ouro · 🏆 Nível Total ${totalLevel}/300</div>
                        <div class="profile-hero-gs" style="color: #ffd700; font-weight: bold; margin-top: 5px;">⭐ Gear Score Total: ${totalGS}</div>
                    </div>`;
            }

            // Skills grid
            const skillsInfo = [
                { key: 'woodcutting', name: 'Corte de Lenha', icon: '🌳' },
                { key: 'mining',      name: 'Mineração',      icon: '⛏️' },
                { key: 'fishing',     name: 'Pesca',          icon: '🎣' },
                { key: 'cooking',     name: 'Culinária',      icon: '🍳' },
                { key: 'crafting',    name: 'Criação',        icon: '🔨' },
                { key: 'smithing',    name: 'Ferraria',       icon: '⚒️' },
            ];
            const skillsGrid = document.getElementById('profileSkillsGrid');
            if (skillsGrid) {
                skillsGrid.innerHTML = skillsInfo.map(s => {
                    const sd = gameState.skills[s.key];
                    const xpReq = xpRequired[sd.level] || 9999;
                    const pct = sd.level >= 50 ? 100 : Math.floor((sd.xp / xpReq) * 100);
                    return `<div class="profile-skill-card">
                        <div class="profile-skill-icon">${s.icon}</div>
                        <div class="profile-skill-info">
                            <div class="profile-skill-name">${s.name}</div>
                            <div class="profile-skill-level">Nv. ${sd.level}</div>
                            <div class="profile-skill-xpbar"><div class="profile-skill-xpfill" style="width:${pct}%"></div></div>
                        </div>
                    </div>`;
                }).join('');
            }
            // Weapon Skills grid
            const weaponSkillsInfo = [
                { key: 'melee', name: 'Corpo a Corpo', icon: '⚔️' },
                { key: 'magic', name: 'Mágica', icon: '🔮' },
                { key: 'distance', name: 'Distância', icon: '🏹' },
                { key: 'shielding', name: 'Defesa', icon: '🛡️' }
            ];
            const weaponSkillsGrid = document.getElementById('profileWeaponSkillsGrid');
            if (weaponSkillsGrid && gameState.weaponSkills) {
                weaponSkillsGrid.innerHTML = weaponSkillsInfo.map(s => {
                    const sd = gameState.weaponSkills[s.key] || { level: 1, xp: 0 };
                    const xpReq = sd.level * 100;
                    const pct = sd.level >= 1000 ? 100 : Math.floor((sd.xp / xpReq) * 100);
                    return `<div class="profile-skill-card">
                        <div class="profile-skill-icon">${s.icon}</div>
                        <div class="profile-skill-info">
                            <div class="profile-skill-name">${s.name}</div>
                            <div class="profile-skill-level">Nv. ${sd.level} <span style="font-size:0.82em;color:#ffd700;font-weight:600;">+${((sd.level - 1) * 0.5).toFixed(1)}% ${s.key === 'shielding' ? 'Bloqueio' : 'Dano'}</span></div>
                            <div class="profile-skill-xpbar"><div class="profile-skill-xpfill" style="width:${pct}%; background:linear-gradient(90deg, #ff9944, #ff5522);"></div></div>
                        </div>
                    </div>`;
                }).join('');
            }

            // Bestiary grid
            const bestiaryGrid = document.getElementById('profileBestiaryGrid');
            if (bestiaryGrid) {
                const bestiaryItems = Object.values(gameState.bestiary || {}).sort((a, b) => b.count - a.count);
                if (bestiaryItems.length > 0) {
                    bestiaryGrid.innerHTML = bestiaryItems.map(m => {
                        return `<div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:8px; display:flex; align-items:center; gap:8px;">
                            <div style="font-size:1.5em;">${m.icon || '💀'}</div>
                            <div style="flex:1;">
                                <div style="font-size:0.85em; font-weight:bold;">${m.name}</div>
                                <div style="font-size:0.75em; color:#aaa;">Abates: ${m.count}</div>
                            </div>
                        </div>`;
                    }).join('');
                } else {
                    bestiaryGrid.innerHTML = `<div style="color:#aaa; font-style:italic; font-size:0.85em; grid-column:1/-1; text-align:center;">Nenhum inimigo derrotado ainda.</div>`;
                }
            }

            // Bônus ativos de conquistas
            const bonusTypes = [
                { type: 'xpBoost_all',   label: '⚡ XP Global' },
                { type: 'xpBoost_gather',label: '🌾 XP Coleta' },
                { type: 'xpBoost_craft', label: '🔨 XP Craft' },
                { type: 'goldBonus',     label: '💰 Ouro' },
                { type: 'strengthBonus', label: '⚔️ Força' },
                { type: 'healthBonus',   label: '❤️ Vida' },
            ];
            const bonusList = document.getElementById('profileBonusesList');
            if (bonusList) {
                const pills = bonusTypes.map(b => {
                    const val = getAchievementBonus(b.type);
                    if (val === 0) return null;
                    const unit = (b.type === 'strengthBonus' || b.type === 'healthBonus') ? '' : '%';
                    return `<span class="bonus-pill">${b.label} +${val}${unit}</span>`;
                }).filter(Boolean);
                bonusList.innerHTML = pills.length
                    ? pills.join('')
                    : `<span class="bonus-pill empty">Nenhum bônus desbloqueado ainda.</span>`;
            }

            // Conquistas
            const unlocked = achievementsList.filter(a => gameState.achievements[a.id]).length;
            const countEl = document.getElementById('achUnlockedCount');
            if (countEl) countEl.textContent = `(${unlocked} / ${achievementsList.length})`;

            // Resetar filtros ao abrir o modal (sempre começar em "Todas")
            window.achFilters = { category: 'all', status: 'all', search: '' };
            
            // Limpar campo de busca
            const searchInput = document.getElementById('achSearchInput');
            if (searchInput) searchInput.value = '';
            
            // Sincronizar estado visual dos filtros
            syncAchFilterUI();
            renderFilteredAchievements();
        }
