// ============================================
// STATS-UI.JS
// UI para Estatísticas em Tempo Real
// ============================================

/**
 * Abre o modal de estatísticas e renderiza gráficos
 */
function openStatsModal() {
    const modal = document.getElementById('statsModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Renderiza os gráficos
    setTimeout(() => {
        renderStatsGraphs();
        updateStatsUI();
    }, 100);
}

/**
 * Renderiza todos os gráficos de linha
 */
function renderStatsGraphs() {
    const data = getStatsData();
    
    if (data.goldPerHour.length > 0) {
        drawLineChart('chartGoldPerHour', data.timestamps, data.goldPerHour, '#44ff44', '#00cc00');
    }
    if (data.xpPerHour.length > 0) {
        drawLineChart('chartXpPerHour', data.timestamps, data.xpPerHour, '#ffdd44', '#ffaa00');
    }
    if (data.itemsCrafted.length > 0) {
        drawLineChart('chartItemsCrafted', data.timestamps, data.itemsCrafted, '#ff88cc', '#ff4488');
    }
    if (data.itemsGathered.length > 0) {
        drawLineChart('chartItemsGathered', data.timestamps, data.itemsGathered, '#88ffcc', '#00ff88');
    }
}

/**
 * Desenha um gráfico de linha no canvas
 */
function drawLineChart(canvasId, timestamps, values, lineColor, fillColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Encontra min/max
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;
    
    // Limpa canvas
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    
    // Desenha grid de fundo
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Desenha eixo X e Y
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Calcula pontos da linha
    const points = values.map((value, idx) => {
        const x = padding + (idx / Math.max(values.length - 1, 1)) * graphWidth;
        const y = height - padding - ((value - minValue) / range) * graphHeight;
        return { x, y, value };
    });
    
    // Desenha área preenchida
    ctx.fillStyle = fillColor + '30'; // Com transparência
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach((p, i) => {
        if (i === 0) {
            ctx.lineTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Desenha linha
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.stroke();
    
    // Desenha pontos
    ctx.fillStyle = lineColor;
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Labels do eixo Y
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Outfit';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.floor(minValue + (range / 5) * i);
        const y = height - padding - (graphHeight / 5) * i;
        ctx.fillText(formatNumber(value), padding - 8, y + 4);
    }
    
    // Labels do eixo X (últimos 3 timestamps)
    ctx.textAlign = 'center';
    for (let i = 0; i < Math.min(3, points.length); i++) {
        const idx = Math.floor((points.length - 1) * (i / Math.max(2, points.length - 1)));
        if (points[idx]) {
            const time = timestamps[idx] ? new Date(timestamps[idx]).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
            ctx.fillText(time, points[idx].x, height - padding + 20);
        }
    }
}

/**
 * Atualiza os valores de texto do painel de estatísticas
 */
function updateStatsUI() {
    const stats = getAggregateStats();
    const data = getStatsData();
    
    // Atualiza cards de resumo
    document.getElementById('statGoldPerHour').textContent = formatNumber(stats.avgGoldPerHour);
    document.getElementById('statGoldMax').textContent = formatNumber(stats.maxGoldPerHour);
    
    document.getElementById('statXpPerHour').textContent = formatNumber(stats.avgXpPerHour);
    document.getElementById('statXpMax').textContent = formatNumber(stats.maxXpPerHour);
    
    document.getElementById('statItemsCrafted').textContent = data.itemsCrafted.length > 0 ? data.itemsCrafted[data.itemsCrafted.length - 1] : 0;
    document.getElementById('statItemsCraftedTotal').textContent = formatNumber(stats.totalItemsCrafted);
    
    document.getElementById('statItemsGathered').textContent = data.itemsGathered.length > 0 ? data.itemsGathered[data.itemsGathered.length - 1] : 0;
    document.getElementById('statItemsGatheredTotal').textContent = formatNumber(stats.totalItemsGathered);
    
    // Atualiza atividade
    document.getElementById('statWorkersActive').textContent = Math.round(stats.avgWorkersActive);
    document.getElementById('statPlayerActive').textContent = stats.avgPlayerActive > 0.5 ? '✓ Sim' : 'Não';
    document.getElementById('statCombatWins').textContent = stats.totalCombatWins;
    
    // Tempo monitorado
    const timeMonitoredMinutes = Math.floor(data.timestamps.length);
    document.getElementById('statMonitorTime').textContent = timeMonitoredMinutes + ' min';
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
