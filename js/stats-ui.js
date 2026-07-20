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
    
    // Calcula eficiência global
    const efficiency = calculateEfficiency(stats, data);
    const effEl = document.getElementById('statEfficiency');
    if (effEl) {
        effEl.textContent = efficiency + '%';
        effEl.style.color = efficiency >= 80 ? '#44ff44' : efficiency >= 50 ? '#ffdd44' : '#ff6666';
    }
    
    // Gera sugestões inteligentes
    generateSmartSuggestions(stats, data);
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
window.exportStatsToCSV = exportStatsToCSV;
