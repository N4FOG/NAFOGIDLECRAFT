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
    isOffline: [],       // Flags booleans de intervalos offline
    workerGains: [],     // Itens coletados por trabalhadores AFK
    playerGains: [],     // Itens coletados por ações manuais
    maxDataPoints: 120   // Manter apenas os últimos 120 pontos
};

// Histórico de Longo Prazo (Buckets Compactados de 1d a 30d)
const historicalArchives = {
    hourly: [], // 168 pontos max (7 dias em horas)
    daily: []   // 30 pontos max (30 dias)
};

function loadHistoricalArchives() {
    try {
        const saved = localStorage.getItem('idleCraftHistoricalArchives');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.hourly) historicalArchives.hourly = parsed.hourly;
            if (parsed.daily) historicalArchives.daily = parsed.daily;
        }
    } catch (e) {
        console.log('Iniciando arquivo histórico zerado');
    }
    
    // Se estiver vazio, popula a linha de base inicial
    if (historicalArchives.hourly.length === 0 || historicalArchives.daily.length === 0) {
        seedInitialHistoricalArchives();
    }
}

function saveHistoricalArchives() {
    try {
        localStorage.setItem('idleCraftHistoricalArchives', JSON.stringify(historicalArchives));
    } catch (e) {
        console.error('Erro ao salvar arquivos históricos');
    }
}

/**
 * Popula uma linha de base histórica para novos jogos/sessões para que os gráficos de 1d a 30d já nasçam preenchidos
 */
function seedInitialHistoricalArchives() {
    const now = Date.now();
    
    // Seed horários (7 dias = 168 horas)
    if (historicalArchives.hourly.length === 0) {
        const currentGoldRate = (gameState && gameState.gold) ? Math.min(2000, Math.floor(gameState.gold / 5)) : 100;
        const currentXpRate = 250;
        for (let i = 168; i >= 0; i -= 2) {
            const ts = now - (i * 3600000);
            const varFactor = 0.8 + Math.random() * 0.4;
            historicalArchives.hourly.push({
                timestamp: ts,
                goldPerHour: Math.floor(currentGoldRate * varFactor),
                xpPerHour: Math.floor(currentXpRate * varFactor),
                itemsCrafted: Math.floor(5 * varFactor),
                itemsGathered: Math.floor(15 * varFactor),
                workerGains: Math.floor(10 * varFactor),
                playerGains: Math.floor(5 * varFactor),
                isOffline: i % 8 === 0
            });
        }
    }
    
    // Seed diários (30 dias)
    if (historicalArchives.daily.length === 0) {
        const currentGoldRate = (gameState && gameState.gold) ? Math.min(5000, Math.floor(gameState.gold / 2)) : 500;
        const currentXpRate = 800;
        for (let i = 30; i >= 0; i--) {
            const ts = now - (i * 86400000);
            const growthFactor = (31 - i) / 30;
            historicalArchives.daily.push({
                timestamp: ts,
                goldPerHour: Math.floor(currentGoldRate * growthFactor * (0.85 + Math.random() * 0.3)),
                xpPerHour: Math.floor(currentXpRate * growthFactor * (0.85 + Math.random() * 0.3)),
                itemsCrafted: Math.floor(40 * growthFactor),
                itemsGathered: Math.floor(120 * growthFactor),
                workerGains: Math.floor(90 * growthFactor),
                playerGains: Math.floor(30 * growthFactor),
                isOffline: true
            });
        }
    }

    saveHistoricalArchives();
}

/**
 * Agrega e consolida dados em buckets horários e diários para manter uso de memória baixíssimo
 */
function archiveStatsBuckets() {
    const now = Date.now();
    const lastHourly = historicalArchives.hourly.length > 0 ? historicalArchives.hourly[historicalArchives.hourly.length - 1].timestamp : 0;
    const lastDaily = historicalArchives.daily.length > 0 ? historicalArchives.daily[historicalArchives.daily.length - 1].timestamp : 0;

    // A cada 1 hora (3.600.000 ms), cria bucket horário
    if (now - lastHourly >= 3600000 && statsTracker.timestamps.length > 0) {
        const avgGold = Math.floor(statsTracker.goldPerHour.reduce((a, b) => a + (b || 0), 0) / statsTracker.goldPerHour.length);
        const avgXP = Math.floor(statsTracker.xpPerHour.reduce((a, b) => a + (b || 0), 0) / statsTracker.xpPerHour.length);
        const sumCrafted = statsTracker.itemsCrafted.reduce((a, b) => a + (b || 0), 0);
        const sumGathered = statsTracker.itemsGathered.reduce((a, b) => a + (b || 0), 0);
        const sumWorkerGains = statsTracker.workerGains.reduce((a, b) => a + (b || 0), 0);
        const sumPlayerGains = statsTracker.playerGains.reduce((a, b) => a + (b || 0), 0);

        historicalArchives.hourly.push({
            timestamp: now,
            goldPerHour: avgGold,
            xpPerHour: avgXP,
            itemsCrafted: sumCrafted,
            itemsGathered: sumGathered,
            workerGains: sumWorkerGains,
            playerGains: sumPlayerGains,
            isOffline: statsTracker.isOffline.some(v => v === true)
        });

        // Limita a 168 horas (7 dias)
        if (historicalArchives.hourly.length > 168) {
            historicalArchives.hourly.shift();
        }
    }

    // A cada 24 horas (86.400.000 ms), cria bucket diário
    if (now - lastDaily >= 86400000) {
        const hourlySample = historicalArchives.hourly.slice(-24);
        if (hourlySample.length > 0) {
            const avgGold = Math.floor(hourlySample.reduce((a, b) => a + b.goldPerHour, 0) / hourlySample.length);
            const avgXP = Math.floor(hourlySample.reduce((a, b) => a + b.xpPerHour, 0) / hourlySample.length);
            const sumCrafted = hourlySample.reduce((a, b) => a + b.itemsCrafted, 0);
            const sumGathered = hourlySample.reduce((a, b) => a + b.itemsGathered, 0);
            const sumWorkerGains = hourlySample.reduce((a, b) => a + b.workerGains, 0);
            const sumPlayerGains = hourlySample.reduce((a, b) => a + b.playerGains, 0);

            historicalArchives.daily.push({
                timestamp: now,
                goldPerHour: avgGold,
                xpPerHour: avgXP,
                itemsCrafted: sumCrafted,
                itemsGathered: sumGathered,
                workerGains: sumWorkerGains,
                playerGains: sumPlayerGains,
                isOffline: hourlySample.some(v => v.isOffline === true)
            });

            // Limita a 30 dias
            if (historicalArchives.daily.length > 30) {
                historicalArchives.daily.shift();
            }
        }
    }

    saveHistoricalArchives();
}

/**
 * Retorna o conjunto de dados formatados de acordo com o intervalo temporal selecionado
 * ('live', '2h', '1d', '7d', '20d', '30d')
 */
function getFilteredStatsData(timeRange = 'live') {
    loadHistoricalArchives();

    if (timeRange === 'live') {
        const len = statsTracker.timestamps.length;
        const startIdx = Math.max(0, len - 60);
        return {
            timestamps: statsTracker.timestamps.slice(startIdx),
            goldPerHour: statsTracker.goldPerHour.slice(startIdx),
            xpPerHour: statsTracker.xpPerHour.slice(startIdx),
            itemsCrafted: statsTracker.itemsCrafted.slice(startIdx),
            itemsGathered: statsTracker.itemsGathered.slice(startIdx),
            workerGains: statsTracker.workerGains.slice(startIdx),
            playerGains: statsTracker.playerGains.slice(startIdx),
            isOffline: statsTracker.isOffline.slice(startIdx)
        };
    } else if (timeRange === '2h') {
        return {
            timestamps: statsTracker.timestamps,
            goldPerHour: statsTracker.goldPerHour,
            xpPerHour: statsTracker.xpPerHour,
            itemsCrafted: statsTracker.itemsCrafted,
            itemsGathered: statsTracker.itemsGathered,
            workerGains: statsTracker.workerGains,
            playerGains: statsTracker.playerGains,
            isOffline: statsTracker.isOffline
        };
    } else if (timeRange === '1d') {
        // Se houver hourly archive usa ele, caso contrário simula do statsTracker
        const sample = historicalArchives.hourly.slice(-24);
        if (sample.length >= 3) {
            return {
                timestamps: sample.map(s => s.timestamp),
                goldPerHour: sample.map(s => s.goldPerHour),
                xpPerHour: sample.map(s => s.xpPerHour),
                itemsCrafted: sample.map(s => s.itemsCrafted),
                itemsGathered: sample.map(s => s.itemsGathered),
                workerGains: sample.map(s => s.workerGains),
                playerGains: sample.map(s => s.playerGains),
                isOffline: sample.map(s => s.isOffline)
            };
        }
        return getFilteredStatsData('2h');
    } else if (timeRange === '7d') {
        const sample = historicalArchives.hourly.slice(-168);
        if (sample.length >= 3) {
            return {
                timestamps: sample.map(s => s.timestamp),
                goldPerHour: sample.map(s => s.goldPerHour),
                xpPerHour: sample.map(s => s.xpPerHour),
                itemsCrafted: sample.map(s => s.itemsCrafted),
                itemsGathered: sample.map(s => s.itemsGathered),
                workerGains: sample.map(s => s.workerGains),
                playerGains: sample.map(s => s.playerGains),
                isOffline: sample.map(s => s.isOffline)
            };
        }
        return getFilteredStatsData('1d');
    } else if (timeRange === '20d') {
        const sample = historicalArchives.daily.slice(-20);
        if (sample.length >= 2) {
            return {
                timestamps: sample.map(s => s.timestamp),
                goldPerHour: sample.map(s => s.goldPerHour),
                xpPerHour: sample.map(s => s.xpPerHour),
                itemsCrafted: sample.map(s => s.itemsCrafted),
                itemsGathered: sample.map(s => s.itemsGathered),
                workerGains: sample.map(s => s.workerGains),
                playerGains: sample.map(s => s.playerGains),
                isOffline: sample.map(s => s.isOffline)
            };
        }
        return getFilteredStatsData('7d');
    } else if (timeRange === '30d') {
        const sample = historicalArchives.daily.slice(-30);
        if (sample.length >= 2) {
            return {
                timestamps: sample.map(s => s.timestamp),
                goldPerHour: sample.map(s => s.goldPerHour),
                xpPerHour: sample.map(s => s.xpPerHour),
                itemsCrafted: sample.map(s => s.itemsCrafted),
                itemsGathered: sample.map(s => s.itemsGathered),
                workerGains: sample.map(s => s.workerGains),
                playerGains: sample.map(s => s.playerGains),
                isOffline: sample.map(s => s.isOffline)
            };
        }
        return getFilteredStatsData('20d');
    }

    return getFilteredStatsData('live');
}

// Carrega arquivos históricos na inicialização
loadHistoricalArchives();

// ============================================
// SISTEMA DO GRANDE OBSERVATÓRIO
// Estatísticas Globais do Servidor (Multiplayer)
// ============================================

// Métricas globais rastreadas localmente
const globalStats = {
    totalPlayTime: 0,           // Tempo total jogado (minutos)
    monstersKilled: 0,          // Total de monstros derrotados
    treesCut: 0,                // Total de árvores cortadas
    foodsUsed: 0,               // Total de comidas consumidas
    petsAdopted: 0,             // Total de mascotes adotados
    potionsMade: 0,             // Total de poções preparadas
    equipmentsForged: 0,        // Total de equipamentos forjados
    maxCritDamage: 0,           // Maior dano crítico já registrado
    maxCritPlayer: '',          // Nome do jogador do maior crítico
    bossKills: {},              // { 'dragão': 50, 'goblin': 200 }
    gameOverCount: 0,           // Vezes que morreu
    mostDeadlyEnemy: '',        // Inimigo que mais matou jogadores
    mostDeadlyEnemyKills: 0,    // Quantas vezes matou jogadores
    totalCrafts: 0,             // Total de crafts (todas as skills)
    resourcesMined: 0,          // Total de minérios coletados
    fishCaught: 0,              // Total de peixes pescadas
    herbsGathered: 0,           // Total de ervas coletadas
    workerOfflineDrops: 0,      // Total de itens coletados por trabalhadores AFK
    playerActiveDrops: 0,       // Total de itens coletados por ações manuais
    workerOfflineTime: 0,       // Tempo total offline processado (minutos)
    lastUpdate: Date.now()      // Última atualização
};

// Carrega estatísticas globais do localStorage
function loadGlobalStats() {
    try {
        const saved = localStorage.getItem('idleCraftGlobalStats');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(globalStats, parsed);
        }
    } catch {
        console.log('Iniciando estatísticas globais zeradas');
    }
}

// Salva estatísticas globais no localStorage
function saveGlobalStats() {
    try {
        localStorage.setItem('idleCraftGlobalStats', JSON.stringify(globalStats));
    } catch {
        console.error('Erro ao salvar estatísticas globais');
    }
}

// Inicia timer de tempo jogado
function startPlayTimeTracker() {
    loadGlobalStats();
    window.playTimeInterval = setInterval(() => {
        globalStats.totalPlayTime++;
        globalStats.lastUpdate = Date.now();
        saveGlobalStats();
    }, 60000); // A cada minuto
    
    // Salvar ao sair
    window.addEventListener('beforeunload', () => {
        saveGlobalStats();
        if (window.playTimeInterval) clearInterval(window.playTimeInterval);
    });
}

// Funções para incrementar métricas do Observatório
function incrementMonsterKilled(enemyId = 'generic') {
    globalStats.monstersKilled++;
    saveGlobalStats();
    
    // Sincroniza com Firebase se disponível
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('monstersKilled', 1);
    }
}

function incrementTreeCut(amount = 1) {
    globalStats.treesCut += amount;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('treesCut', amount);
    }
}

function incrementFoodUsed() {
    globalStats.foodsUsed++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('foodsUsed', 1);
    }
}

function incrementPetAdopted() {
    globalStats.petsAdopted++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('petsAdopted', 1);
    }
}

function incrementPotionMade() {
    globalStats.potionsMade++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('potionsMade', 1);
    }
}

function incrementEquipmentForged() {
    globalStats.equipmentsForged++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('equipmentsForged', 1);
    }
}

function recordCritDamage(damage, playerName = 'Você') {
    if (damage > globalStats.maxCritDamage) {
        globalStats.maxCritDamage = damage;
        globalStats.maxCritPlayer = playerName;
        saveGlobalStats();
        
        if (typeof syncGlobalStat === 'function') {
            syncGlobalStat('maxCritDamage', damage);
            syncGlobalStat('maxCritPlayer', playerName);
        }
        
        return true; // Novo record
    }
    return false;
}

function recordBossKill(bossId) {
    if (!globalStats.bossKills[bossId]) {
        globalStats.bossKills[bossId] = 0;
    }
    globalStats.bossKills[bossId]++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat(`bossKill_${bossId}`, 1);
    }
}

function recordGameOver(enemyId) {
    globalStats.gameOverCount++;
    
    // Atualiza inimigo mais mortal
    if (!globalStats.mostDeadlyEnemy) {
        globalStats.mostDeadlyEnemy = enemyId;
        globalStats.mostDeadlyEnemyKills = 1;
    } else {
        globalStats.mostDeadlyEnemyKills++;
    }
    
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('gameOverCount', 1);
        syncGlobalStat('mostDeadlyEnemy', enemyId);
    }
}

function incrementCraft(skill) {
    globalStats.totalCrafts++;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('totalCrafts', 1);
    }
}

function incrementResourcesMined(amount = 1) {
    globalStats.resourcesMined += amount;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('resourcesMined', amount);
    }
}

function incrementFishCaught(amount = 1) {
    globalStats.fishCaught += amount;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('fishCaught', amount);
    }
}

function incrementHerbsGathered(amount = 1) {
    globalStats.herbsGathered += amount;
    saveGlobalStats();
    
    if (typeof syncGlobalStat === 'function') {
        syncGlobalStat('herbsGathered', amount);
    }
}

// Formata tempo jogado para exibição
function formatPlayTime(totalMinutes) {
    if (totalMinutes < 60) {
        return `${totalMinutes} minutos`;
    } else if (totalMinutes < 1440) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
        const days = Math.floor(totalMinutes / 1440);
        const remainingHours = Math.floor((totalMinutes % 1440) / 60);
        const remainingMins = totalMinutes % 60;
        
        if (days >= 365) {
            const years = Math.floor(days / 365);
            const months = Math.floor((days % 365) / 30);
            return `${years} ano${years > 1 ? 's' : ''}, ${months} mê${months > 1 ? 'ses' : 's'}`;
        } else {
            return `${days} dia${days > 1 ? 's' : ''}, ${remainingHours}h`;
        }
    }
}

// Retorna métricas formatadas para exibição no Observatório
function getObservatoryMetrics() {
    return [
        {
            icon: '⏱️',
            label: 'Tempo Total Jogado',
            value: formatPlayTime(globalStats.totalPlayTime),
            color: '#ffd700',
            format: 'time'
        },
        {
            icon: '⚔️',
            label: 'Monstros Derrotados',
            value: formatNumber(globalStats.monstersKilled),
            color: '#ff4444',
            format: 'number'
        },
        {
            icon: '🪓',
            label: 'Árvores Cortadas',
            value: formatNumber(globalStats.treesCut),
            color: '#8b4513',
            format: 'number'
        },
        {
            icon: '💀',
            label: 'Inimigo Mais Mortal',
            value: globalStats.mostDeadlyEnemy || 'Nenhum',
            color: '#993333',
            format: 'text'
        },
        {
            icon: '🍖',
            label: 'Comidas Consumidas',
            value: formatNumber(globalStats.foodsUsed),
            color: '#ff8844',
            format: 'number'
        },
        {
            icon: '🐕',
            label: 'Mascotes Adotados',
            value: formatNumber(globalStats.petsAdopted),
            color: '#44aa88',
            format: 'number'
        },
        {
            icon: '🧪',
            label: 'Poções Preparadas',
            value: formatNumber(globalStats.potionsMade),
            color: '#aa44ff',
            format: 'number'
        },
        {
            icon: '⚒️',
            label: 'Equipamentos Forjados',
            value: formatNumber(globalStats.equipmentsForged),
            color: '#888888',
            format: 'number'
        },
        {
            icon: '💥',
            label: 'Maior Dano Crítico',
            value: `${formatNumber(globalStats.maxCritDamage)}`,
            color: '#ff00ff',
            format: 'crit',
            extra: globalStats.maxCritPlayer ? `por ${globalStats.maxCritPlayer}` : ''
        },
        {
            icon: '☠️',
            label: 'Vezes Derrotado',
            value: formatNumber(globalStats.gameOverCount),
            color: '#666666',
            format: 'number'
        },
        {
            icon: '🔨',
            label: 'Total de Crafts',
            value: formatNumber(globalStats.totalCrafts),
            color: '#44aaff',
            format: 'number'
        },
        {
            icon: '⛏️',
            label: 'Minérios Coletados',
            value: formatNumber(globalStats.resourcesMined),
            color: '#708090',
            format: 'number'
        },
        {
            icon: '🎣',
            label: 'Peixes Pescados',
            value: formatNumber(globalStats.fishCaught),
            color: '#00bfff',
            format: 'number'
        },
        {
            icon: '🌿',
            label: 'Ervas Coletadas',
            value: formatNumber(globalStats.herbsGathered),
            color: '#228b22',
            format: 'number'
        }
    ];
}

// Sorteia métricas aleatórias para exibir no mural
function getRandomMetrics(count = 5) {
    const all = getObservatoryMetrics();
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Desenha gráficos para o Observatório
 */
function drawObservatoryCharts(combatMetrics, gatheringMetrics, craftingMetrics, filter = 'all') {
    // Gráfico de Combate
    drawObservatoryBarChart('chartObservatoryCombat', combatMetrics, '#ff4444', '#cc0000');
    
    // Gráfico de Coleta Temporal (Dashed Lines para períodos AFK sem spikes)
    drawObservatoryDashedLineChart('chartObservatoryGathering', filter);
    
    // Gráfico de Crafting
    drawObservatoryBarChart('chartObservatoryCrafting', craftingMetrics, '#44aaff', '#0088ff');
}

/**
 * Desenha gráfico de linhas com segmentos pontilhados para períodos offline (AFK)
 */
function drawObservatoryDashedLineChart(canvasId, filter) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 25;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    const timestamps = statsTracker.timestamps || [];
    let values = statsTracker.itemsGathered || [];
    
    if (filter === 'active') {
        values = statsTracker.playerGains || [];
    } else if (filter === 'afk') {
        values = statsTracker.workerGains || [];
    }
    
    ctx.clearRect(0, 0, width, height);
    
    if (timestamps.length === 0 || values.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '12px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Coletando dados temporais...', width / 2, height / 2);
        return;
    }
    
    const maxValue = Math.max(...values, 1);
    const minValue = 0;
    const range = maxValue - minValue || 1;
    
    // Desenha linhas de fundo
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let i = 0; i <= 3; i++) {
        const y = padding + (graphHeight / 3) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    const points = values.map((val, idx) => {
        const x = padding + (idx / Math.max(values.length - 1, 1)) * graphWidth;
        const y = height - padding - ((val - minValue) / range) * graphHeight;
        return { x, y, val, offline: statsTracker.isOffline ? statsTracker.isOffline[idx] : false };
    });
    
    // Desenha segmentos (sólidos para tempo real, pontilhados para offline AFK)
    for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        if (p2.offline || p1.offline) {
            ctx.strokeStyle = '#bb66ff'; // Roxo/Lilás para AFK
            ctx.setLineDash([6, 4]);     // Linha pontilhada
            ctx.lineWidth = 2.5;
        } else {
            ctx.strokeStyle = '#44ff88'; // Verde para Ativo Tempo Real
            ctx.setLineDash([]);        // Linha sólida
            ctx.lineWidth = 2.5;
        }
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Desenha pontos nos vértices
    points.forEach((p, i) => {
        const isLast = i === points.length - 1;
        ctx.fillStyle = p.offline ? '#bb66ff' : '#44ff88';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isLast ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Label do valor max
    ctx.fillStyle = '#aaa';
    ctx.font = '10px Outfit';
    ctx.textAlign = 'right';
    ctx.fillText(formatNumber(maxValue), padding - 4, padding + 5);
}

/**
 * Desenha um gráfico de barras horizontal
 */
function drawObservatoryBarChart(canvasId, metrics, barColor, barColorDark) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !metrics || metrics.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 10;
    const barHeight = (height - padding * 2) / metrics.length;
    
    ctx.clearRect(0, 0, width, height);
    
    // Extrai valores numéricos das métricas
    const values = metrics.map(m => {
        const numStr = String(m.value).replace(/[^0-9]/g, '');
        return parseInt(numStr) || 0;
    });
    
    const maxValue = Math.max(...values, 1);
    
    // Desenha as barras
    metrics.forEach((metric, i) => {
        const value = values[i];
        const barWidth = (value / maxValue) * (width - padding * 2);
        const y = padding + i * barHeight;
        
        // Gradiente da barra
        const gradient = ctx.createLinearGradient(padding, 0, padding + barWidth, 0);
        gradient.addColorStop(0, barColorDark);
        gradient.addColorStop(1, barColor);
        
        // Fundo da barra
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(padding, y + 2, width - padding * 2, barHeight - 4);
        
        // Barra preenchida
        ctx.fillStyle = gradient;
        ctx.fillRect(padding, y + 2, barWidth, barHeight - 4);
        
        // Borda da barra
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(padding, y + 2, width - padding * 2, barHeight - 4);
        
        // Ícone e valor
        ctx.fillStyle = '#fff';
        ctx.font = `${barHeight * 0.5}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(metric.icon, padding + 5, y + barHeight / 2);
        
        // Valor no final da barra
        if (barWidth > 40) {
            ctx.font = `bold ${barHeight * 0.4}px Outfit`;
            ctx.textAlign = 'right';
            ctx.fillStyle = '#000';
            ctx.fillText(metric.value, padding + barWidth - 5, y + barHeight / 2);
        } else {
            ctx.font = `bold ${barHeight * 0.35}px Outfit`;
            ctx.textAlign = 'left';
            ctx.fillStyle = barColor;
            ctx.fillText(metric.value, padding + barWidth + 5, y + barHeight / 2);
        }
    });
}

// Controle de estado da interface do Observatório
window.observatoryViewMode = window.observatoryViewMode || 'cards'; // 'cards' ou 'charts'
window.observatorySeriesFilter = window.observatorySeriesFilter || 'all'; // 'all', 'active', 'afk'

function setObservatoryViewMode(mode) {
    window.observatoryViewMode = mode;
    renderObservatory();
}

function setObservatorySeriesFilter(filter) {
    window.observatorySeriesFilter = filter;
    renderObservatory();
}

// Exibe o Observatório na UI com suporte a dupla visualização (Cards CSS vs Gráficos Canvas)
function renderObservatory() {
    const container = document.getElementById('observatoryContainer');
    if (!container) return;
    
    const allMetrics = getObservatoryMetrics();
    const mode = window.observatoryViewMode;
    const filter = window.observatorySeriesFilter;
    
    // Separa métricas em categorias
    const combatMetrics = allMetrics.filter(m => ['⚔️', '💀', '💥', '☠️'].includes(m.icon));
    const gatheringMetrics = allMetrics.filter(m => ['🪓', '⛏️', '🎣', '🌿'].includes(m.icon));
    const craftingMetrics = allMetrics.filter(m => ['🔨', '⚒️', '🧪', '🍖'].includes(m.icon));
    const generalMetrics = allMetrics.filter(m => ['⏱️', '🐕'].includes(m.icon));
    
    // Métricas de Rendimento Trabalhadores vs Manual
    const totalAFK = globalStats.workerOfflineDrops || 0;
    const totalActive = globalStats.playerActiveDrops || 0;
    const grandTotalDrops = totalAFK + totalActive || 1;
    const pctAFK = Math.round((totalAFK / grandTotalDrops) * 100);
    const pctActive = 100 - pctAFK;

    container.innerHTML = `
        <div style="max-width:1100px; margin:0 auto; padding:10px;">
            
            <!-- Header do Observatório -->
            <div style="background:linear-gradient(135deg, rgba(50,20,80,0.4), rgba(20,20,60,0.5)); border:2px solid rgba(150,100,255,0.4); border-radius:14px; padding:20px; margin-bottom:20px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.3);">
                <div style="font-size:3em; margin-bottom:6px;">🔭</div>
                <div style="font-size:1.6em; font-weight:bold; color:#dd88ff; font-family:'Outfit', sans-serif; margin-bottom:4px;">
                    O Grande Observatório
                </div>
                <div style="font-size:0.9em; color:#aaa; font-family:'Outfit', sans-serif; margin-bottom:15px;">
                    Análise Global da Sua Jornada &amp; Automação dos Trabalhadores
                </div>

                <!-- SELETOR DE MODO DE VISUALIZAÇÃO (Dupla Opção) -->
                <div style="display:inline-flex; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.15); border-radius:30px; padding:4px; gap:4px;">
                    <button onclick="setObservatoryViewMode('cards')" style="padding:8px 18px; border-radius:20px; border:none; background:${mode === 'cards' ? 'linear-gradient(135deg, #aa44ff, #7722cc)' : 'transparent'}; color:${mode === 'cards' ? '#fff' : '#aaa'}; font-weight:bold; font-family:'Outfit'; cursor:pointer; transition:all 0.2s;">
                        📋 Visão Sintética (Cards/CSS)
                    </button>
                    <button onclick="setObservatoryViewMode('charts')" style="padding:8px 18px; border-radius:20px; border:none; background:${mode === 'charts' ? 'linear-gradient(135deg, #00ccff, #0088cc)' : 'transparent'}; color:${mode === 'charts' ? '#fff' : '#aaa'}; font-weight:bold; font-family:'Outfit'; cursor:pointer; transition:all 0.2s;">
                        📊 Visão Analítica (Gráficos Canvas)
                    </button>
                </div>
            </div>
            
            <!-- PAINEL DE ORIGEM DOS RECURSOS (Manual vs AFK Trabalhadores) -->
            <div style="background:linear-gradient(145deg, rgba(20,28,40,0.7), rgba(12,18,28,0.9)); border:1px solid rgba(100,200,255,0.25); border-radius:12px; padding:16px; margin-bottom:20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                    <div style="font-size:1.1em; color:#66ccff; font-weight:bold; display:flex; align-items:center; gap:8px;">
                        ⚖️ Balanço de Coleta: Manual vs. Trabalhadores AFK
                    </div>
                    <div style="font-size:0.85em; color:#aaa;">
                        Tempo Offline Processado: <strong style="color:#ffd700;">${formatPlayTime(globalStats.workerOfflineTime || 0)}</strong>
                    </div>
                </div>

                <!-- Barra de Progresso Bi-Color (Verde = Ativo, Roxo = AFK) -->
                <div style="height:22px; background:rgba(0,0,0,0.5); border-radius:11px; overflow:hidden; display:flex; border:1px solid rgba(255,255,255,0.1); margin-bottom:10px; position:relative;">
                    <div style="width:${pctActive}%; background:linear-gradient(90deg, #33cc66, #44ff88); height:100%; transition:width 0.5s ease;" title="Manual: ${formatNumber(totalActive)} (${pctActive}%)"></div>
                    <div style="width:${pctAFK}%; background:linear-gradient(90deg, #8844ff, #bb66ff); height:100%; transition:width 0.5s ease;" title="Trabalhadores AFK: ${formatNumber(totalAFK)} (${pctAFK}%)"></div>
                </div>

                <!-- Legenda e Detalhes dos Drops -->
                <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap; gap:12px; font-size:0.88em;">
                    <div style="display:flex; align-items:center; gap:6px; color:#44ff88; font-weight:600;">
                        <span style="display:inline-block; width:12px; height:12px; background:#44ff88; border-radius:3px;"></span>
                        ⚡ Coleta Manual Ativa: <strong>${formatNumber(totalActive)}</strong> (${pctActive}%)
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; color:#bb66ff; font-weight:600;">
                        <span style="display:inline-block; width:12px; height:12px; background:#bb66ff; border-radius:3px;"></span>
                        💤 Trabalhadores AFK (Sem Spike): <strong>${formatNumber(totalAFK)}</strong> (${pctAFK}%)
                    </div>
                </div>
            </div>

            <!-- FILTRO DE SÉRIES DE DADOS (Quando no modo Gráfico) -->
            ${mode === 'charts' ? `
                <div style="display:flex; justify-content:center; gap:8px; margin-bottom:20px; flex-wrap:wrap;">
                    <button onclick="setObservatorySeriesFilter('all')" style="padding:6px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.15); background:${filter === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'}; color:${filter === 'all' ? '#fff' : '#888'}; font-size:0.85em; cursor:pointer;">
                        ✨ Todos os Dados
                    </button>
                    <button onclick="setObservatorySeriesFilter('active')" style="padding:6px 14px; border-radius:8px; border:1px solid rgba(68,255,136,0.3); background:${filter === 'active' ? 'rgba(68,255,136,0.2)' : 'rgba(0,0,0,0.3)'}; color:${filter === 'active' ? '#44ff88' : '#888'}; font-size:0.85em; cursor:pointer;">
                        ⚡ Apenas Ações Manuais (Ativo)
                    </button>
                    <button onclick="setObservatorySeriesFilter('afk')" style="padding:6px 14px; border-radius:8px; border:1px solid rgba(187,102,255,0.3); background:${filter === 'afk' ? 'rgba(187,102,255,0.2)' : 'rgba(0,0,0,0.3)'}; color:${filter === 'afk' ? '#bb66ff' : '#888'}; font-size:0.85em; cursor:pointer;">
                        💤 Apenas Trabalhadores (Linha Pontilhada AFK)
                    </button>
                </div>
            ` : ''}

            <!-- Destaques da Jornada -->
            <div style="background:linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,140,0,0.08)); border:1px solid rgba(255,215,0,0.25); border-radius:12px; padding:18px; margin-bottom:20px;">
                <div style="font-size:1.15em; color:#ffd700; font-weight:bold; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                    ⭐ Destaques Gerais
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
                    ${generalMetrics.map(m => `
                        <div style="background:rgba(0,0,0,0.25); border:1px solid ${m.color}35; border-radius:8px; padding:14px; text-align:center;">
                            <div style="font-size:2em; margin-bottom:4px;">${m.icon}</div>
                            <div style="font-size:1.3em; color:${m.color}; font-weight:bold; margin-bottom:2px;">${m.value}</div>
                            <div style="font-size:0.8em; color:#aaa;">${m.label}</div>
                            ${m.extra ? `<div style="font-size:0.7em; color:#888; margin-top:3px;">${m.extra}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- CONTEÚDO PRINCIPAL (ALTERNÂNCIA MODOS CARDS vs CHARTS) -->
            ${mode === 'cards' ? renderCardsView(combatMetrics, gatheringMetrics, craftingMetrics) : renderChartsView(combatMetrics, gatheringMetrics, craftingMetrics, filter)}
            
            <!-- Footer -->
            <div style="text-align:center; padding:15px; background:rgba(0,0,0,0.2); border-radius:8px; border:1px solid rgba(255,255,255,0.1); margin-top:20px;">
                <div style="font-size:0.85em; color:#888; margin-bottom:8px;">
                    📊 Estatísticas sincronizadas em tempo real · Períodos AFK interpolados sem spikes
                </div>
                <button onclick="renderObservatory()" style="background:rgba(100,200,255,0.2); border:1px solid rgba(100,200,255,0.4); padding:8px 16px; border-radius:6px; color:#66ccff; cursor:pointer; font-family:'Outfit', sans-serif; font-size:0.9em;">
                    🔄 Atualizar Estatísticas
                </button>
            </div>
            
        </div>
    `;
    
    // Se no modo gráficos, executa a renderização dos Canvas após pequeno timeout
    if (mode === 'charts') {
        setTimeout(() => {
            drawObservatoryCharts(combatMetrics, gatheringMetrics, craftingMetrics, filter);
        }, 100);
    }
}

// Renderizador MODO 1: VISÃO SINTÉTICA (CARDS CSS BI-COLOR)
function renderCardsView(combatMetrics, gatheringMetrics, craftingMetrics) {
    const renderMetricCard = (m) => `
        <div style="background:rgba(0,0,0,0.25); border-radius:8px; padding:12px; border:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1.4em;">${m.icon}</span>
                <span style="font-size:1.15em; color:${m.color}; font-weight:bold;">${m.value}</span>
            </div>
            <div style="font-size:0.8em; color:#aaa;">${m.label}</div>
            ${m.extra ? `<div style="font-size:0.7em; color:#888;">${m.extra}</div>` : ''}
        </div>
    `;

    return `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:15px;">
            
            <!-- Combate Card -->
            <div style="background:rgba(255,68,68,0.06); border:1px solid rgba(255,68,68,0.25); border-radius:12px; padding:16px;">
                <div style="font-size:1.1em; color:#ff4444; font-weight:bold; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                    ⚔️ Estatísticas de Combate
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${combatMetrics.map(renderMetricCard).join('')}
                </div>
            </div>
            
            <!-- Coleta Card -->
            <div style="background:rgba(68,255,136,0.06); border:1px solid rgba(68,255,136,0.25); border-radius:12px; padding:16px;">
                <div style="font-size:1.1em; color:#44ff88; font-weight:bold; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                    🎣 Estatísticas de Coleta
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${gatheringMetrics.map(renderMetricCard).join('')}
                </div>
            </div>
            
            <!-- Crafting Card -->
            <div style="background:rgba(68,170,255,0.06); border:1px solid rgba(68,170,255,0.25); border-radius:12px; padding:16px;">
                <div style="font-size:1.1em; color:#44aaff; font-weight:bold; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                    🔨 Estatísticas de Produção
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${craftingMetrics.map(renderMetricCard).join('')}
                </div>
            </div>

        </div>
    `;
}

// Renderizador MODO 2: VISÃO ANALÍTICA (GRÁFICOS CANVAS TEMPORIZADOS)
function renderChartsView(combatMetrics, gatheringMetrics, craftingMetrics, filter) {
    return `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:15px;">
            
            <!-- Gráfico de Combate -->
            <div style="background:rgba(255,68,68,0.08); border:1px solid rgba(255,68,68,0.3); border-radius:12px; padding:16px;">
                <div style="font-size:1.05em; color:#ff4444; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <span>⚔️ Progresso de Combate</span>
                    <span style="font-size:0.75em; color:#aaa; font-weight:normal;">Linha Sólida</span>
                </div>
                <canvas id="chartObservatoryCombat" style="width:100%; height:140px; display:block; margin-bottom:12px; background:rgba(0,0,0,0.2); border-radius:6px;"></canvas>
            </div>
            
            <!-- Gráfico de Coleta -->
            <div style="background:rgba(68,255,136,0.08); border:1px solid rgba(68,255,136,0.3); border-radius:12px; padding:16px;">
                <div style="font-size:1.05em; color:#44ff88; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <span>🎣 Rendimento de Coleta</span>
                    <span style="font-size:0.75em; color:#bbb; font-weight:normal;">⚡ Ativo / 💤 AFK Dashed</span>
                </div>
                <canvas id="chartObservatoryGathering" style="width:100%; height:140px; display:block; margin-bottom:12px; background:rgba(0,0,0,0.2); border-radius:6px;"></canvas>
            </div>
            
            <!-- Gráfico de Crafting -->
            <div style="background:rgba(68,170,255,0.08); border:1px solid rgba(68,170,255,0.3); border-radius:12px; padding:16px;">
                <div style="font-size:1.05em; color:#44aaff; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <span>🔨 Produção &amp; Crafting</span>
                    <span style="font-size:0.75em; color:#aaa; font-weight:normal;">Taxa/Hora</span>
                </div>
                <canvas id="chartObservatoryCrafting" style="width:100%; height:140px; display:block; margin-bottom:12px; background:rgba(0,0,0,0.2); border-radius:6px;"></canvas>
            </div>

        </div>
    `;
}

/**
 * Registra ganhos de trabalhadores obtidos durante período offline de forma interpolada,
 * prevenindo o pico (spike) vertical nos gráficos de linha e alimentando a visão bi-color.
 */
function recordOfflineGainsToStats(offlineSecs, collectedItems) {
    if (!offlineSecs || !collectedItems) return;
    
    // Soma total de itens coletados no retorno offline
    let totalItems = 0;
    if (typeof collectedItems === 'object') {
        for (const qty of Object.values(collectedItems)) {
            if (typeof qty === 'number') totalItems += qty;
        }
    } else if (typeof collectedItems === 'number') {
        totalItems = collectedItems;
    }
    
    if (totalItems <= 0) return;
    
    const elapsedMins = Math.max(1, Math.floor(offlineSecs / 60));
    
    // Atualiza acumulados globais
    globalStats.workerOfflineDrops = (globalStats.workerOfflineDrops || 0) + totalItems;
    globalStats.workerOfflineTime = (globalStats.workerOfflineTime || 0) + elapsedMins;
    saveGlobalStats();
    
    // Interpola os dados no histórico de gráficos
    const pointsCount = Math.min(20, Math.max(3, Math.floor(elapsedMins / 15)));
    const itemsPerPoint = Math.max(1, Math.round(totalItems / pointsCount));
    const stepMs = (offlineSecs * 1000) / pointsCount;
    const now = Date.now();
    const activeWorkersCount = (gameState && gameState.autoIntervals) ? Object.keys(gameState.autoIntervals).length : 1;
    
    for (let i = 0; i < pointsCount; i++) {
        const timestamp = now - (offlineSecs * 1000) + (i * stepMs);
        
        statsTracker.timestamps.push(timestamp);
        statsTracker.goldPerHour.push(0);
        statsTracker.xpPerHour.push(0);
        statsTracker.itemsCrafted.push(0);
        statsTracker.itemsGathered.push(itemsPerPoint);
        statsTracker.activePlayers.push(0);
        statsTracker.workers.push(activeWorkersCount);
        statsTracker.combatWins.push(0);
        statsTracker.isOffline.push(true);
        statsTracker.workerGains.push(itemsPerPoint);
        statsTracker.playerGains.push(0);
        
        // Mantém limite máximo de pontos
        if (statsTracker.timestamps.length > statsTracker.maxDataPoints) {
            statsTracker.timestamps.shift();
            statsTracker.goldPerHour.shift();
            statsTracker.xpPerHour.shift();
            statsTracker.itemsCrafted.shift();
            statsTracker.itemsGathered.shift();
            statsTracker.activePlayers.shift();
            statsTracker.workers.shift();
            statsTracker.combatWins.shift();
            if (statsTracker.isOffline) statsTracker.isOffline.shift();
            if (statsTracker.workerGains) statsTracker.workerGains.shift();
            if (statsTracker.playerGains) statsTracker.playerGains.shift();
        }
    }
    
    // Atualiza snapshot de baseline para a próxima coleta ativa não gerar spike
    lastSnapshot = {
        gold: gameState.gold || 0,
        totalXP: calculateTotalXP(),
        totalItemsCrafted: countItemsCrafted(),
        totalItemsGathered: countItemsGathered(),
        combatWins: gameState.arena?.wins || 0,
        timestamp: Date.now()
    };
}

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

    const activeGathered = itemsGathered > 0 ? itemsGathered : 0;
    if (activeGathered > 0) {
        globalStats.playerActiveDrops = (globalStats.playerActiveDrops || 0) + activeGathered;
        saveGlobalStats();
    }

    // Adiciona ao histórico
    statsTracker.timestamps.push(now);
    statsTracker.goldPerHour.push(goldPerHour);
    statsTracker.xpPerHour.push(xpPerHour);
    statsTracker.itemsCrafted.push(itemsCrafted);
    statsTracker.itemsGathered.push(activeGathered);
    statsTracker.activePlayers.push(manualActivityActive);
    statsTracker.workers.push(activeWorkers);
    statsTracker.combatWins.push(combatWinsGained);
    statsTracker.isOffline.push(false);
    statsTracker.workerGains.push(0);
    statsTracker.playerGains.push(activeGathered);

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
        if (statsTracker.isOffline) statsTracker.isOffline.shift();
        if (statsTracker.workerGains) statsTracker.workerGains.shift();
        if (statsTracker.playerGains) statsTracker.playerGains.shift();
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
    // Lê do localStorage se disponível
    try {
        const saved = localStorage.getItem('itemsCraftedCount');
        return saved ? parseInt(saved) : 0;
    } catch {
        return 0;
    }
}

function countItemsGathered() {
    // Lê do localStorage se disponível
    try {
        const saved = localStorage.getItem('itemsGatheredCount');
        return saved ? parseInt(saved) : 0;
    } catch {
        return 0;
    }
}

/**
 * Incrementa o contador de itens criados
 */
function incrementItemsCrafted(amount = 1) {
    try {
        const current = countItemsCrafted();
        const newCount = current + amount;
        localStorage.setItem('itemsCraftedCount', newCount.toString());
    } catch {
        console.error('Erro ao atualizar itemsCraftedCount');
    }
}

/**
 * Incrementa o contador de itens coletados
 */
function incrementItemsGathered(amount = 1) {
    try {
        const current = countItemsGathered();
        const newCount = current + amount;
        localStorage.setItem('itemsGatheredCount', newCount.toString());
    } catch {
        console.error('Erro ao atualizar itemsGatheredCount');
    }
}

/**
 * Inicia coleta automática de dados a cada minuto
 */
function startStatsCollection() {
    window.statsCollectionInterval = setInterval(() => {
        captureStatsSnapshot();
        archiveStatsBuckets();
    }, 60000); // A cada 1 minuto
    
    // Captura inicial
    captureStatsSnapshot();
    archiveStatsBuckets();
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
window.renderObservatory = renderObservatory;
window.setObservatoryViewMode = setObservatoryViewMode;
window.setObservatorySeriesFilter = setObservatorySeriesFilter;
window.recordOfflineGainsToStats = recordOfflineGainsToStats;
window.getFilteredStatsData = getFilteredStatsData;
window.archiveStatsBuckets = archiveStatsBuckets;
window.incrementItemsCrafted = incrementItemsCrafted;
window.incrementItemsGathered = incrementItemsGathered;
window.getStatsData = getStatsData;
window.getAggregateStats = getAggregateStats;

// Inicia tracker de tempo jogado (Grande Observatório)
if (typeof startPlayTimeTracker === 'function') {
    startPlayTimeTracker();
}

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
