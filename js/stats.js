// ============================================
// STATS.JS
// Sistema de Estatísticas em Tempo Real
// ============================================

// Estrutura para armazenar histórico de dados
const statsTracker = {
    timestamps: [],      // Array de timestamps
    goldPerHour: [],     // Ouro ganho por hora
    xpPerHour: [],       // XP ganho por hora (total de todas skills)
    itemsCrafted: [],    // Itens criados
    itemsGathered: [],   // Itens coletados
    activePlayers: [],   // Jogadores em atividade manual
    workers: [],         // Trabalhadores ativos
    combatWins: [],      // Vitórias em combate
    maxDataPoints: 120   // Manter apenas os últimos 120 pontos (2 horas com update a cada min)
};

let lastSnapshot = {
    gold: 0,
    totalXP: 0,
    totalItemsCrafted: 0,
    totalItemsGathered: 0,
    combatWins: 0,
    timestamp: Date.now()
};

/**
 * Coleta snapshot do estado atual
 */
function captureStatsSnapshot() {
    if (!gameState) return;

    const now = Date.now();
    const timeDiff = (now - lastSnapshot.timestamp) / 3600000; // em horas

    // Calcula diferenciais
    const goldGained = (gameState.gold || 0) - lastSnapshot.gold;
    const xpGained = calculateTotalXP() - lastSnapshot.totalXP;
    const itemsCrafted = countItemsCrafted() - lastSnapshot.totalItemsCrafted;
    const itemsGathered = countItemsGathered() - lastSnapshot.totalItemsGathered;
    const combatWinsGained = (gameState.arena?.wins || 0) - lastSnapshot.combatWins;

    // Calcula taxa por hora
    const goldPerHour = timeDiff > 0 ? Math.floor(goldGained / timeDiff) : 0;
    const xpPerHour = timeDiff > 0 ? Math.floor(xpGained / timeDiff) : 0;

    // Conta trabalhadores e atividades ativas
    const activeWorkers = Object.keys(gameState.autoIntervals || {}).length;
    const manualActivityActive = gameState.currentPage && 
        ['woodcutting', 'mining', 'fishing', 'herbalism', 'cooking', 'crafting', 'smithing', 'enchanting', 'combat'].includes(gameState.currentPage) ? 1 : 0;

    // Adiciona ao histórico
    statsTracker.timestamps.push(now);
    statsTracker.goldPerHour.push(goldPerHour);
    statsTracker.xpPerHour.push(xpPerHour);
    statsTracker.itemsCrafted.push(itemsCrafted);
    statsTracker.itemsGathered.push(itemsGathered);
    statsTracker.activePlayers.push(manualActivityActive);
    statsTracker.workers.push(activeWorkers);
    statsTracker.combatWins.push(combatWinsGained);

    // Limita ao tamanho máximo
    if (statsTracker.timestamps.length > statsTracker.maxDataPoints) {
        statsTracker.timestamps.shift();
        statsTracker.goldPerHour.shift();
        statsTracker.xpPerHour.shift();
        statsTracker.itemsCrafted.shift();
        statsTracker.itemsGathered.shift();
        statsTracker.activePlayers.shift();
        statsTracker.workers.shift();
        statsTracker.combatWins.shift();
    }

    // Atualiza snapshot
    lastSnapshot = {
        gold: gameState.gold || 0,
        totalXP: calculateTotalXP(),
        totalItemsCrafted: countItemsCrafted(),
        totalItemsGathered: countItemsGathered(),
        combatWins: gameState.arena?.wins || 0,
        timestamp: now
    };
}

function calculateTotalXP() {
    if (!gameState.skills) return 0;
    return Object.values(gameState.skills).reduce((sum, skill) => sum + (skill.xp || 0), 0);
}

function countItemsCrafted() {
    // Lê do localStorage se disponível, caso contrário usa proxy
    try {
        const saved = localStorage.getItem('itemsCraftedCount');
        return saved ? parseInt(saved) : 0;
    } catch {
        let total = 0;
        ['cooking', 'crafting', 'smithing', 'enchanting'].forEach(skill => {
            if (gameState.skills && gameState.skills[skill]) {
                total += (gameState.skills[skill].level || 1) * 10;
            }
        });
        return total;
    }
}

function countItemsGathered() {
    // Lê do localStorage se disponível, caso contrário usa proxy
    try {
        const saved = localStorage.getItem('itemsGatheredCount');
        return saved ? parseInt(saved) : 0;
    } catch {
        let total = 0;
        ['woodcutting', 'mining', 'fishing', 'herbalism'].forEach(skill => {
            if (gameState.skills && gameState.skills[skill]) {
                total += (gameState.skills[skill].level || 1) * 10;
            }
        });
        return total;
    }
}

/**
 * Inicia coleta automática de dados a cada minuto
 */
function startStatsCollection() {
    window.statsCollectionInterval = setInterval(() => {
        captureStatsSnapshot();
    }, 60000); // A cada 1 minuto
    
    // Captura inicial
    captureStatsSnapshot();
}

/**
 * Para coleta de dados
 */
function stopStatsCollection() {
    if (window.statsCollectionInterval) {
        clearInterval(window.statsCollectionInterval);
        window.statsCollectionInterval = null;
    }
}

/**
 * Retorna os dados formatados para exibição
 */
function getStatsData() {
    return {
        timestamps: statsTracker.timestamps,
        goldPerHour: statsTracker.goldPerHour,
        xpPerHour: statsTracker.xpPerHour,
        itemsCrafted: statsTracker.itemsCrafted,
        itemsGathered: statsTracker.itemsGathered,
        activePlayers: statsTracker.activePlayers,
        workers: statsTracker.workers,
        combatWins: statsTracker.combatWins
    };
}

/**
 * Calcula estatísticas agregadas
 */
function getAggregateStats() {
    const data = getStatsData();
    const toNumber = (arr) => arr.map(v => v || 0);

    const avg = (arr) => arr.length > 0 ? Math.floor(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const max = (arr) => arr.length > 0 ? Math.max(...arr) : 0;
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);

    return {
        avgGoldPerHour: avg(toNumber(data.goldPerHour)),
        maxGoldPerHour: max(toNumber(data.goldPerHour)),
        avgXpPerHour: avg(toNumber(data.xpPerHour)),
        maxXpPerHour: max(toNumber(data.xpPerHour)),
        totalItemsCrafted: sum(toNumber(data.itemsCrafted)),
        totalItemsGathered: sum(toNumber(data.itemsGathered)),
        totalCombatWins: sum(toNumber(data.combatWins)),
        avgWorkersActive: avg(toNumber(data.workers)),
        avgPlayerActive: avg(toNumber(data.activePlayers))
    };
}

/**
 * Zera todas as estatísticas coletadas
 */
function resetStatistics() {
    if (!confirm('⚠️ Tem certeza que deseja zerar TODAS as estatísticas?\n\nEsta ação não pode ser desfeita.')) {
        return;
    }

    // Limpa arrays
    statsTracker.timestamps = [];
    statsTracker.goldPerHour = [];
    statsTracker.xpPerHour = [];
    statsTracker.itemsCrafted = [];
    statsTracker.itemsGathered = [];
    statsTracker.activePlayers = [];
    statsTracker.workers = [];
    statsTracker.combatWins = [];

    // Reseta snapshot
    lastSnapshot = {
        gold: gameState.gold || 0,
        totalXP: calculateTotalXP(),
        totalItemsCrafted: countItemsCrafted(),
        totalItemsGathered: countItemsGathered(),
        combatWins: gameState.arena?.wins || 0,
        timestamp: Date.now()
    };

    // Avisa o usuário
    showNotification('✅ Estatísticas Zeradas', 'Todos os dados coletados foram removidos. A coleta recomeçará agora.', 'success');

    // Atualiza a UI imediatamente
    if (typeof refreshStatsDisplay === 'function') {
        setTimeout(refreshStatsDisplay, 500);
    }
}

// Expõe globalmente
window.resetStatistics = resetStatistics;

// Expõe globalmente
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof startStatsCollection === 'function') {
            startStatsCollection();
        }
    }, 1000);
});

// Parar coleta ao sair
window.addEventListener('beforeunload', () => {
    stopStatsCollection();
});
