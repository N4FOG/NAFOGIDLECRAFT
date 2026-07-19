// Mapping achievement IDs to categories for the filter system
function getAchievementCategory(achId) {
    if (achId.startsWith('ach_wood') || achId.startsWith('ach_ore') || achId.startsWith('ach_fish')) return 'coleta';
    if (achId.startsWith('ach_craft') || achId.startsWith('ach_smith') || achId.startsWith('ach_cook') || achId.startsWith('ach_alchemy')) return 'craft';
    if (achId.startsWith('ach_lvl')) return 'niveis';
    if (achId.startsWith('ach_gold')) return 'ouro';
    if (achId.startsWith('ach_kill') || achId.startsWith('ach_dungeon')) return 'combate';
    if (achId.startsWith('ach_pet')) return 'mascotes';
    if (achId.startsWith('ach_prop')) return 'propriedade';
    if (achId.startsWith('ach_bestiary')) return 'bestiario';
    return 'especiais'; // auto, bank, sell, potion, eq, total, surviv, tech, rich
}

const achievementCategories = [
    { id: 'all',      icon: '📋', name: 'Todas',     desc: 'Exibir todas as conquistas' },
    { id: 'coleta',   icon: '🌾', name: 'Coleta',    desc: 'Madeira, Mineração e Pesca' },
    { id: 'craft',    icon: '🔨', name: 'Craft',     desc: 'Criação, Ferraria, Culinária e Alquimia' },
    { id: 'niveis',   icon: '📈', name: 'Níveis',    desc: 'Progressão de habilidades' },
    { id: 'ouro',     icon: '💰', name: 'Ouro',      desc: 'Acumular e gastar moedas' },
    { id: 'combate',  icon: '⚔️', name: 'Combate',   desc: 'Abates, Masmorras e Batalhas' },
    { id: 'mascotes', icon: '🐉', name: 'Mascotes',  desc: 'Adquirir e consagrar mascotes' },
    { id: 'propriedade', icon: '🏡', name: 'Propriedade', desc: 'Melhorias de terreno' },
    { id: 'especiais', icon: '✨', name: 'Especiais', desc: 'Automação, Vendas, Tecnologia e mais' },
    { id: 'bestiario', icon: '📖', name: 'Bestiário', desc: 'Abates de criaturas específicas' },
];
