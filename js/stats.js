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
 * Desenha gráficos de barras para o Observatório
 */
function drawObservatoryCharts(combatMetrics, gatheringMetrics, craftingMetrics) {
    // Gráfico de Combate
    drawObservatoryBarChart('chartObservatoryCombat', combatMetrics, '#ff4444', '#cc0000');
    
    // Gráfico de Coleta
    drawObservatoryBarChart('chartObservatoryGathering', gatheringMetrics, '#44ff88', '#00cc44');
    
    // Gráfico de Crafting
    drawObservatoryBarChart('chartObservatoryCrafting', craftingMetrics, '#44aaff', '#0088ff');
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

// Exibe o Observatório na UI com gráficos e visual moderno
function renderObservatory() {
    const container = document.getElementById('observatoryContainer');
    if (!container) return;
    
    const allMetrics = getObservatoryMetrics();
    
    // Separa métricas em categorias
    const combatMetrics = allMetrics.filter(m => ['⚔️', '💀', '💥', '☠️'].includes(m.icon));
    const gatheringMetrics = allMetrics.filter(m => ['🪓', '⛏️', '🎣', '🌿'].includes(m.icon));
    const craftingMetrics = allMetrics.filter(m => ['🔨', '⚒️', '🧪', '🍖'].includes(m.icon));
    const generalMetrics = allMetrics.filter(m => ['⏱️', '🐕'].includes(m.icon));
    
    container.innerHTML = `
        <div style="max-width:1100px; margin:0 auto; padding:10px;">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg, rgba(50,20,80,0.3), rgba(20,20,60,0.3)); border:2px solid rgba(150,100,255,0.4); border-radius:12px; padding:20px; margin-bottom:20px; text-align:center;">
                <div style="font-size:3em; margin-bottom:8px;">🔭</div>
                <div style="font-size:1.5em; font-weight:bold; color:#dd88ff; font-family:'Outfit', sans-serif; margin-bottom:5px;">
                    O Grande Observatório
                </div>
                <div style="font-size:0.95em; color:#aaa; font-family:'Outfit', sans-serif;">
                    Estatísticas Globais de Sua Jornada
                </div>
            </div>
            
            <!-- Visão Geral em Destaque -->
            <div style="background:linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1)); border:2px solid rgba(255,215,0,0.3); border-radius:12px; padding:18px; margin-bottom:20px;">
                <div style="font-size:1.2em; color:#ffd700; font-weight:bold; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                    ⭐ Destaques da Jornada
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
                    ${generalMetrics.map(m => `
                        <div style="background:rgba(0,0,0,0.2); border:1px solid ${m.color}40; border-radius:8px; padding:14px; text-align:center;">
                            <div style="font-size:2em; margin-bottom:6px;">${m.icon}</div>
                            <div style="font-size:1.3em; color:${m.color}; font-weight:bold; margin-bottom:4px;">${m.value}</div>
                            <div style="font-size:0.8em; color:#aaa;">${m.label}</div>
                            ${m.extra ? `<div style="font-size:0.7em; color:#888; margin-top:4px;">${m.extra}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Grid de Categorias -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:15px; margin-bottom:20px;">
                
                <!-- Combate -->
                <div style="background:rgba(255,68,68,0.08); border:1px solid rgba(255,68,68,0.3); border-radius:10px; padding:16px;">
                    <div style="font-size:1.05em; color:#ff4444; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                        ⚔️ Estatísticas de Combate
                    </div>
                    <canvas id="chartObservatoryCombat" style="width:100%; height:120px; display:block; margin-bottom:12px;"></canvas>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        ${combatMetrics.map(m => `
                            <div style="background:rgba(0,0,0,0.2); border-radius:6px; padding:10px; text-align:center;">
                                <div style="font-size:1.3em; margin-bottom:3px;">${m.icon}</div>
                                <div style="font-size:1.1em; color:${m.color}; font-weight:bold;">${m.value}</div>
                                <div style="font-size:0.7em; color:#aaa; margin-top:2px;">${m.label}</div>
                                ${m.extra ? `<div style="font-size:0.65em; color:#888; margin-top:2px;">${m.extra}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Coleta -->
                <div style="background:rgba(68,255,136,0.08); border:1px solid rgba(68,255,136,0.3); border-radius:10px; padding:16px;">
                    <div style="font-size:1.05em; color:#44ff88; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                        🎣 Estatísticas de Coleta
                    </div>
                    <canvas id="chartObservatoryGathering" style="width:100%; height:120px; display:block; margin-bottom:12px;"></canvas>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        ${gatheringMetrics.map(m => `
                            <div style="background:rgba(0,0,0,0.2); border-radius:6px; padding:10px; text-align:center;">
                                <div style="font-size:1.3em; margin-bottom:3px;">${m.icon}</div>
                                <div style="font-size:1.1em; color:${m.color}; font-weight:bold;">${m.value}</div>
                                <div style="font-size:0.7em; color:#aaa; margin-top:2px;">${m.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Crafting -->
                <div style="background:rgba(68,170,255,0.08); border:1px solid rgba(68,170,255,0.3); border-radius:10px; padding:16px;">
                    <div style="font-size:1.05em; color:#44aaff; font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                        🔨 Estatísticas de Produção
                    </div>
                    <canvas id="chartObservatoryCrafting" style="width:100%; height:120px; display:block; margin-bottom:12px;"></canvas>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        ${craftingMetrics.map(m => `
                            <div style="background:rgba(0,0,0,0.2); border-radius:6px; padding:10px; text-align:center;">
                                <div style="font-size:1.3em; margin-bottom:3px;">${m.icon}</div>
                                <div style="font-size:1.1em; color:${m.color}; font-weight:bold;">${m.value}</div>
                                <div style="font-size:0.7em; color:#aaa; margin-top:2px;">${m.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
            </div>
            
            <!-- Footer -->
            <div style="text-align:center; padding:15px; background:rgba(0,0,0,0.2); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                <div style="font-size:0.85em; color:#888; margin-bottom:8px;">
                    📊 Estatísticas atualizadas em tempo real
                </div>
                <button onclick="renderObservatory()" style="background:rgba(100,200,255,0.2); border:1px solid rgba(100,200,255,0.4); padding:8px 16px; border-radius:6px; color:#66ccff; cursor:pointer; font-family:'Outfit', sans-serif; font-size:0.9em;">
                    🔄 Atualizar Estatísticas
                </button>
            </div>
            
        </div>
    `;
    
    // Renderiza os gráficos após um pequeno delay
    setTimeout(() => {
        drawObservatoryCharts(combatMetrics, gatheringMetrics, craftingMetrics);
    }, 100);
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
window.renderObservatory = renderObservatory;
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
