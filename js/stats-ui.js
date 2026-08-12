// Estado da Interface do Dashboard de Performance
window.dashboardTimeRange = window.dashboardTimeRange || 'live'; // 'live', '2h', '1d', '7d', '20d', '30d'
window.dashboardViewMode = window.dashboardViewMode || 'charts'; // 'cards' ou 'charts'

function setDashboardTimeRange(range) {
    window.dashboardTimeRange = range;
    
    // Atualiza a iluminação visual ativa dos botões no DOM
    const timeButtons = {
        'live': 'btnTimeLive',
        '2h': 'btnTime2h',
        '1d': 'btnTime1d',
        '7d': 'btnTime7d',
        '20d': 'btnTime20d',
        '30d': 'btnTime30d'
    };
    
    for (const [key, btnId] of Object.entries(timeButtons)) {
        const btn = document.getElementById(btnId);
        if (btn) {
            if (key === range) {
                btn.style.background = 'linear-gradient(135deg, #0099ff, #0055cc)';
                btn.style.borderColor = '#66ccff';
                btn.style.color = '#ffffff';
                btn.style.fontWeight = 'bold';
                btn.style.boxShadow = '0 0 12px rgba(0, 153, 255, 0.4)';
            } else {
                btn.style.background = 'rgba(0,0,0,0.3)';
                btn.style.borderColor = 'rgba(255,255,255,0.15)';
                btn.style.color = '#ccc';
                btn.style.fontWeight = 'normal';
                btn.style.boxShadow = 'none';
            }
        }
    }
    
    // Atualiza rótulo de período na interface
    const labelEl = document.getElementById('statRangeLabel');
    if (labelEl) {
        const labels = {
            'live': 'Sessão Ao Vivo',
            '2h': 'Últimas 2 Horas',
            '1d': 'Últimas 24 Horas (1 Dia)',
            '7d': 'Últimos 7 Dias',
            '20d': 'Últimos 20 Dias',
            '30d': 'Últimos 30 Dias'
        };
        labelEl.textContent = labels[range] || range;
    }
    
    renderStatsGraphs();
    updateStatsUI();
}

function setDashboardViewMode(mode) {
    window.dashboardViewMode = mode;
    const cardsEl = document.getElementById('statsCardsContainer');
    const chartsEl = document.getElementById('statsChartsContainer');
    if (cardsEl) cardsEl.style.display = mode === 'cards' ? 'grid' : 'none';
    if (chartsEl) chartsEl.style.display = mode === 'charts' ? 'grid' : 'none';
}

/**
 * Abre o modal de estatísticas e renderiza gráficos
 */
function openStatsModal() {
    const modal = document.getElementById('statsModal');
    if (!modal) return;
    
    // Captura estado inicial APENAS na primeira vez ou após reset
    if (!window.statsSessionStart) {
        window.statsSessionStart = {
            gold: gameState.gold || 0,
            totalXP: calculateTotalXP(),
            timestamp: Date.now()
        };
    }
    
    modal.style.display = 'flex';
    
    // Renderiza e destaca botão selecionado
    setTimeout(() => {
        setDashboardTimeRange(window.dashboardTimeRange || 'live');
        setDashboardViewMode(window.dashboardViewMode || 'charts');
        renderStatsGraphs();
        updateStatsUI();
    }, 100);
}

/**
 * Renderiza todos os gráficos de linha com filtro de intervalo temporal selecionado
 */
function renderStatsGraphs() {
    const range = window.dashboardTimeRange || 'live';
    const data = typeof getFilteredStatsData === 'function' ? getFilteredStatsData(range) : getStatsData();
    
    if (data.goldPerHour && data.goldPerHour.length > 0) {
        drawLineChart('chartGoldPerHour', data.timestamps, data.goldPerHour, '#44ff44', '#00cc00', data.isOffline);
    }
    if (data.xpPerHour && data.xpPerHour.length > 0) {
        drawLineChart('chartXpPerHour', data.timestamps, data.xpPerHour, '#ffdd44', '#ffaa00', data.isOffline);
    }
    if (data.itemsCrafted && data.itemsCrafted.length > 0) {
        drawLineChart('chartItemsCrafted', data.timestamps, data.itemsCrafted, '#ff88cc', '#ff4488', data.isOffline);
    }
    if (data.itemsGathered && data.itemsGathered.length > 0) {
        drawLineChart('chartItemsGathered', data.timestamps, data.itemsGathered, '#88ffcc', '#00ff88', data.isOffline);
    }
}

/**
 * Desenha um gráfico de linha no canvas com suporte a linhas pontilhadas para períodos AFK/offline
 */
function drawLineChart(canvasId, timestamps, values, lineColor, fillColor, isOfflineArray) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Define tamanho real do canvas para clareza em displays de alta resolução
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Se não há dados suficientes, mostra mensagem
    if (!values || values.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '14px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Sem dados ainda para este período...', width / 2, height / 2);
        return;
    }
    
    // Encontra min/max com padding
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;
    const paddedMax = maxValue + range * 0.1;
    const paddedMin = Math.max(0, minValue - range * 0.1);
    const paddedRange = paddedMax - paddedMin;
    
    // Limpa canvas
    ctx.clearRect(0, 0, width, height);
    
    // Desenha grid de fundo com linhas mais suaves
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let i = 0; i <= 5; i++) {
        const y = padding + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Grid vertical
    const verticalLines = Math.min(values.length, 10);
    for (let i = 0; i <= verticalLines; i++) {
        const x = padding + (graphWidth / verticalLines) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Calcula pontos da linha com suavização
    const points = values.map((value, idx) => {
        const x = padding + (idx / Math.max(values.length - 1, 1)) * graphWidth;
        const y = height - padding - ((value - paddedMin) / paddedRange) * graphHeight;
        return { x, y, value, offline: isOfflineArray ? isOfflineArray[idx] : false };
    });
    
    // Desenha gradiente de preenchimento
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, fillColor + '60');
    gradient.addColorStop(0.5, fillColor + '30');
    gradient.addColorStop(1, fillColor + '08');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    
    // Usa curvas suaves (quadratic) entre pontos
    points.forEach((p, i) => {
        if (i === 0) {
            ctx.lineTo(p.x, p.y);
        } else {
            const prevP = points[i - 1];
            const midX = (prevP.x + p.x) / 2;
            ctx.quadraticCurveTo(prevP.x, prevP.y, midX, (prevP.y + p.y) / 2);
            if (i === points.length - 1) {
                ctx.quadraticCurveTo(midX, (prevP.y + p.y) / 2, p.x, p.y);
            }
        }
    });
    
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Desenha linhas com suporte a segmentos pontilhados para períodos AFK
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        if (p2.offline || p1.offline) {
            ctx.strokeStyle = '#bb66ff'; // Linha Roxo AFK
            ctx.setLineDash([6, 4]);     // Traço pontilhado
        } else {
            ctx.strokeStyle = lineColor;
            ctx.setLineDash([]);        // Traço sólido
        }
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Desenha pontos nos vértices
    points.forEach((p, i) => {
        const isLast = i === points.length - 1;
        const radius = isLast ? 5 : 3;
        
        // Borda branca
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Ponto colorido (Roxo se AFK, cor normal se ativo)
        ctx.fillStyle = p.offline ? '#bb66ff' : lineColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Valor no último ponto
        if (isLast && values.length > 1) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Outfit';
            ctx.textAlign = 'left';
            ctx.fillText(formatNumber(p.value), p.x + 10, p.y - 5);
        }
    });
    
    // Labels do eixo Y com melhor formatação
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Outfit';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 5; i++) {
        const value = paddedMin + (paddedRange / 5) * (5 - i);
        const y = padding + (graphHeight / 5) * i;
        const formattedValue = value >= 1000 ? (value / 1000).toFixed(1) + 'k' : Math.floor(value);
        ctx.fillText(formattedValue, padding - 8, y);
    }
    
    // Labels do eixo X com timestamps (formatados segundo o range selecionado)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const rangeMode = window.dashboardTimeRange || 'live';
    const isLongTerm = ['7d', '20d', '30d'].includes(rangeMode);
    
    const labelCount = Math.min(5, timestamps.length);
    for (let i = 0; i < labelCount; i++) {
        const idx = Math.floor((timestamps.length - 1) * (i / (labelCount - 1)));
        if (timestamps[idx] && points[idx]) {
            const date = new Date(timestamps[idx]);
            const time = isLongTerm ? 
                date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) :
                date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            ctx.fillText(time, points[idx].x, height - padding + 8);
        }
    }
    
    // Indicador de tendência (seta)
    if (values.length >= 2) {
        const lastValue = values[values.length - 1];
        const prevValue = values[values.length - 2];
        const trend = lastValue > prevValue ? '↗' : lastValue < prevValue ? '↘' : '→';
        const trendColor = lastValue > prevValue ? '#44ff44' : lastValue < prevValue ? '#ff6666' : '#ffdd44';
        
        ctx.fillStyle = trendColor;
        ctx.font = 'bold 16px Outfit';
        ctx.textAlign = 'right';
        ctx.fillText(trend, width - padding + 20, padding);
    }
}

/**
 * Atualiza os valores de texto do painel de estatísticas
 */
function updateStatsUI() {
    const rangeMode = window.dashboardTimeRange || 'live';
    const rangeData = typeof getFilteredStatsData === 'function' ? getFilteredStatsData(rangeMode) : getStatsData();
    const stats = getAggregateStats();
    
    // Sumarização do período filtrado
    const rangeGoldSum = (rangeData.goldPerHour || []).reduce((a, b) => a + (b || 0), 0);
    const rangeXpSum = (rangeData.xpPerHour || []).reduce((a, b) => a + (b || 0), 0);
    const rangeCraftsSum = (rangeData.itemsCrafted || []).reduce((a, b) => a + (b || 0), 0);
    const rangeGatheredSum = (rangeData.itemsGathered || []).reduce((a, b) => a + (b || 0), 0);
    
    // Atualiza cards de resumo com totais do período selecionado
    const goldEl = document.getElementById('statGoldPerHour');
    if (goldEl) {
        goldEl.textContent = formatNumber(Math.max(0, rangeGoldSum));
    }
    
    const xpEl = document.getElementById('statXpPerHour');
    if (xpEl) {
        xpEl.textContent = formatNumber(Math.max(0, rangeXpSum));
    }
    
    // Mostra recordes nos labels "Máx"
    const maxGold = rangeData.goldPerHour && rangeData.goldPerHour.length > 0 ? Math.max(...rangeData.goldPerHour) : stats.maxGoldPerHour;
    const maxXp = rangeData.xpPerHour && rangeData.xpPerHour.length > 0 ? Math.max(...rangeData.xpPerHour) : stats.maxXpPerHour;
    
    const statGoldMaxEl = document.getElementById('statGoldMax');
    if (statGoldMaxEl) statGoldMaxEl.textContent = formatNumber(maxGold) + '/h';
    
    const statXpMaxEl = document.getElementById('statXpMax');
    if (statXpMaxEl) statXpMaxEl.textContent = formatNumber(maxXp) + '/h';
    
    const statCraftedEl = document.getElementById('statItemsCrafted');
    if (statCraftedEl) statCraftedEl.textContent = formatNumber(rangeCraftsSum);
    
    const statCraftedTotalEl = document.getElementById('statItemsCraftedTotal');
    if (statCraftedTotalEl) statCraftedTotalEl.textContent = formatNumber(stats.totalItemsCrafted);
    
    const statGatheredEl = document.getElementById('statItemsGathered');
    if (statGatheredEl) statGatheredEl.textContent = formatNumber(rangeGatheredSum);
    
    const statGatheredTotalEl = document.getElementById('statItemsGatheredTotal');
    if (statGatheredTotalEl) statGatheredTotalEl.textContent = formatNumber(stats.totalItemsGathered);
    
    // Atualiza atividade
    document.getElementById('statWorkersActive').textContent = Math.round(stats.avgWorkersActive);
    document.getElementById('statPlayerActive').textContent = stats.avgPlayerActive > 0.5 ? '✓ Sim' : 'Não';
    document.getElementById('statCombatWins').textContent = stats.totalCombatWins;
    
    // Tempo monitorado (tempo desde abertura do dashboard)
    const sessionTimeStr = sessionTime >= 60 ? 
        `${Math.floor(sessionTime / 60)}h ${Math.floor(sessionTime % 60)}m` : 
        `${Math.floor(sessionTime)}m`;
    document.getElementById('statMonitorTime').textContent = sessionTimeStr || '0m';
    
    // Calcula eficiência global
    const efficiency = calculateEfficiency(stats, data);
    const effEl = document.getElementById('statEfficiency');
    if (effEl) {
        effEl.textContent = efficiency + '%';
        effEl.style.color = efficiency >= 80 ? '#44ff44' : efficiency >= 50 ? '#ffdd44' : '#ff6666';
    }
    
    // Gera sugestões inteligentes
    generateSmartSuggestions(stats, data, sessionGold, sessionXP, sessionTime);
}

/**
 * Calcula a eficiência global do jogador (0-100%)
 */
function calculateEfficiency(stats, data) {
    let score = 0;
    let factors = 0;
    
    // Fator 1: Trabalhadores ativos (30% do score)
    if (stats.avgWorkersActive > 0) {
        const workerScore = Math.min(stats.avgWorkersActive / 10, 1) * 30;
        score += workerScore;
    }
    factors += 30;
    
    // Fator 2: Atividade manual (20% do score)
    if (stats.avgPlayerActive > 0) {
        score += stats.avgPlayerActive * 20;
    }
    factors += 20;
    
    // Fator 3: Produtividade de ouro (25% do score)
    if (stats.avgGoldPerHour > 0) {
        const goldScore = Math.min(stats.avgGoldPerHour / 1000, 1) * 25;
        score += goldScore;
    }
    factors += 25;
    
    // Fator 4: Produtividade de XP (25% do score)
    if (stats.avgXpPerHour > 0) {
        const xpScore = Math.min(stats.avgXpPerHour / 500, 1) * 25;
        score += xpScore;
    }
    factors += 25;
    
    return Math.round(score);
}

/**
 * Gera sugestões inteligentes baseadas nos dados
 */
function generateSmartSuggestions(stats, data) {
    const suggestionsEl = document.getElementById('statsSuggestions');
    if (!suggestionsEl) return;
    
    const suggestions = [];
    
    // Sugestão 1: Trabalhadores
    if (stats.avgWorkersActive < 3) {
        suggestions.push({
            icon: '👷',
            text: 'Você tem poucos trabalhadores ativos. Considere alocar mais no Acampamento para produção passiva!',
            color: '#ffaa44'
        });
    }
    
    // Sugestão 2: Produção baixa
    if (stats.avgGoldPerHour < 100 && data.timestamps.length > 10) {
        suggestions.push({
            icon: '💰',
            text: 'Sua produção de ouro está baixa. Foque em vender itens ou melhorar equipamentos para Arena!',
            color: '#44ff44'
        });
    }
    
    // Sugestão 3: XP baixo
    if (stats.avgXpPerHour < 200 && data.timestamps.length > 10) {
        suggestions.push({
            icon: '⚡',
            text: 'Ganho de XP pode ser otimizado! Use poções de XP e equipe itens com bônus de XP.',
            color: '#ffdd44'
        });
    }
    
    // Sugestão 4: Sem atividade manual
    if (stats.avgPlayerActive < 0.3) {
        suggestions.push({
            icon: '🎮',
            text: 'Você está muito AFK! Ações manuais dão mais XP e recursos. Que tal explorar a Arena?',
            color: '#ff6666'
        });
    }
    
    // Sugestão 5: Muitas vitórias, baixo XP
    if (stats.totalCombatWins > 5 && stats.avgXpPerHour < 300) {
        suggestions.push({
            icon: '⚔️',
            text: 'Você está lutando muito mas ganhando pouco XP. Tente waves mais altas ou use boosts de XP!',
            color: '#ff88ff'
        });
    }
    
    // Sugestão 6: Tudo ótimo!
    if (suggestions.length === 0) {
        suggestions.push({
            icon: '🌟',
            text: 'Excelente trabalho! Você está jogando de forma muito eficiente. Continue assim!',
            color: '#44ff88'
        });
    }
    
    // Renderiza sugestões
    suggestionsEl.innerHTML = suggestions.map(s => `
        <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:6px; border-left:3px solid ${s.color}; display:flex; align-items:start; gap:10px;">
            <span style="font-size:1.5em; flex-shrink:0;">${s.icon}</span>
            <span style="line-height:1.5;">${s.text}</span>
        </div>
    `).join('');
}

/**
 * Reseta a contagem da sessão atual
 */
function resetStatsSession() {
    window.statsSessionStart = {
        gold: gameState.gold || 0,
        totalXP: calculateTotalXP(),
        timestamp: Date.now()
    };
    
    // Atualiza a interface imediatamente
    updateStatsUI();
    renderStatsGraphs();
    
    showNotification('🔄 Sessão Resetada', 'Contagem de ouro e XP reiniciada!', 'success');
}

/**
 * Exporta estatísticas para arquivo CSV
 */
function exportStatsToCSV() {
    const data = getStatsData();
    const stats = getAggregateStats();
    
    if (data.timestamps.length === 0) {
        showNotification('❌ Sem Dados', 'Não há estatísticas para exportar ainda.', 'error');
        return;
    }
    
    // Monta CSV
    let csv = 'Timestamp,Ouro/Hora,XP/Hora,Itens Criados,Itens Coletados,Trabalhadores,Atividade Manual,Vitórias\n';
    
    for (let i = 0; i < data.timestamps.length; i++) {
        const timestamp = new Date(data.timestamps[i]).toISOString();
        csv += `${timestamp},${data.goldPerHour[i]},${data.xpPerHour[i]},${data.itemsCrafted[i]},${data.itemsGathered[i]},${data.workers[i]},${data.activePlayers[i]},${data.combatWins[i]}\n`;
    }
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idle-craft-stats-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('✅ Exportado!', 'Estatísticas exportadas para CSV com sucesso!', 'success');
}

/**
 * Atualiza os gráficos em tempo real (chamado periodicamente)
 */
function refreshStatsDisplay() {
    const modal = document.getElementById('statsModal');
    if (modal && modal.style.display !== 'none') {
        renderStatsGraphs();
        updateStatsUI();
    }
}

// Atualiza a exibição a cada 30 segundos quando o modal está aberto
window.addEventListener('load', () => {
    window.statsRefreshInterval = setInterval(() => {
        refreshStatsDisplay();
    }, 30000);
});

window.addEventListener('beforeunload', () => {
    if (window.statsRefreshInterval) {
        clearInterval(window.statsRefreshInterval);
    }
});

// Expõe globalmente
window.openStatsModal = openStatsModal;
window.resetStatsSession = resetStatsSession;
window.exportStatsToCSV = exportStatsToCSV;
