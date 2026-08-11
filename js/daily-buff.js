/**
 * ============================================
 * DAILY BUFF SYSTEM — Sistema de Buff Diário (30 Minutos)
 * ============================================
 * 
 * - 30 Buffs Únicos com Rotação Deterministica por Data (todos recebem o mesmo buff no mesmo dia)
 * - Validade: 30 Minutos após o resgate
 * - Persistência em localStorage ('idleCraftDailyBuff')
 * - Reset às 00:00 UTC/Local diariamente
 */

(function() {
    'use strict';

    const DAILY_BUFFS = [
        { id: 'aurora_guerreiro', name: 'Aurora do Guerreiro', icon: '🌅', desc: '+25% Dano em Combates e Masmorras', category: 'Combate', effectType: 'combatBoost', effectValue: 25, color: '#ff5555' },
        { id: 'cancao_floresta', name: 'Canção da Floresta', icon: '🌲', desc: '+30% XP e Rendimento em Madeira', category: 'Coleta', effectType: 'woodcuttingXP', effectValue: 30, color: '#4aff4a' },
        { id: 'toque_ferreiro', name: 'Toque do Ferreiro', icon: '⚒️', desc: '+20% Chance de Sucesso e Qualidade na Forja', category: 'Crafting', effectType: 'smithingQuality', effectValue: 20, color: '#ffaa00' },
        { id: 'euforia_alquimica', name: 'Euforia Alquímica', icon: '🧪', desc: 'Poções Alquímicas duram +50% de tempo', category: 'Alquimia', effectType: 'potionDuration', effectValue: 50, color: '#dca8ff' },
        { id: 'bencao_mercador', name: 'Bênção do Mercador', icon: '💰', desc: '+25% Ouro ganho em vendas e batalhas', category: 'Economia', effectType: 'goldBoost', effectValue: 25, color: '#ffd700' },
        { id: 'harmonia_animal', name: 'Harmonia Animal', icon: '🐾', desc: '+30% de Eficiência em todos os Mascotes', category: 'Mascotes', effectType: 'petBoost', effectValue: 30, color: '#55ff99' },
        { id: 'faro_minerio', name: 'Faro de Minério', icon: '⛏️', desc: '+40% Chance de Minérios Raros e Gemas', category: 'Coleta', effectType: 'miningRare', effectValue: 40, color: '#4a9aff' },
        { id: 'mare_alta', name: 'Maré Alta', icon: '🎣', desc: '+50% XP de Pesca e +20% Peixes Raros', category: 'Coleta', effectType: 'fishingBoost', effectValue: 50, color: '#00e5ff' },
        { id: 'bencao_ervas', name: 'Bênção das Ervas', icon: '🌿', desc: '+35% Rendimento na Colheita de Ervas', category: 'Coleta', effectType: 'herbalismBoost', effectValue: 35, color: '#77ff77' },
        { id: 'clareza_mistica', name: 'Clareza Mística', icon: '🔮', desc: '+30% XP Global em todas as Perícias', category: 'Progresso', effectType: 'allXP', effectValue: 30, color: '#aa77ff' },
        { id: 'pele_pedra', name: 'Pele de Pedra', icon: '🛡️', desc: '+30% Defesa e Armadura em Combate', category: 'Combate', effectType: 'defenseBoost', effectValue: 30, color: '#aaaaff' },
        { id: 'vigor_noturno', name: 'Vigor Noturno', icon: '🌙', desc: 'Trabalhadores do Acampamento +25% mais rápidos', category: 'Automação', effectType: 'workerBoost', effectValue: 25, color: '#77aaff' },
        { id: 'chama_eterna', name: 'Chama Eterna', icon: '🔥', desc: 'Fornalha opera com +50% eficiência de calor', category: 'Forja', effectType: 'freeForge', effectValue: 50, color: '#ff6600' },
        { id: 'olho_aguia', name: 'Olho de Águia', icon: '💎', desc: '3x Chance de encontrar Gemas Raras', category: 'Sorte', effectType: 'gemBoost', effectValue: 3, color: '#00ffff' },
        { id: 'adrenalina', name: 'Adrenalina', icon: '⚡', desc: '+20% Velocidade de Ação em Coleta', category: 'Velocidade', effectType: 'speedBoost', effectValue: 20, color: '#ffff00' },
        { id: 'escama_dragao', name: 'Escama do Dragão', icon: '🐉', desc: '+50% Resistência Elemental', category: 'Combate', effectType: 'elementResist', effectValue: 50, color: '#ff4444' },
        { id: 'respiracao_mar', name: 'Respiração do Mar', icon: '🌊', desc: '+40% XP e Velocidade de Pesca', category: 'Coleta', effectType: 'fastFish', effectValue: 40, color: '#33ccff' },
        { id: 'broto_ancestral', name: 'Broto Ancestral', icon: '🌱', desc: 'Colheita e Fazenda produzem 2x recursos', category: 'Coleta', effectType: 'doubleGather', effectValue: 100, color: '#66ff66' },
        { id: 'instinto_campeao', name: 'Instinto de Campeão', icon: '🏆', desc: '+30% XP de Combate e Dungeons', category: 'Combate', effectType: 'combatXP', effectValue: 30, color: '#ffcc00' },
        { id: 'magnetismo', name: 'Magnetismo', icon: '🧲', desc: '+20% Chance de Duplicar qualquer craft', category: 'Crafting', effectType: 'doubleCraft', effectValue: 20, color: '#ff66cc' },
        { id: 'visao_estelar', name: 'Visão Estelar', icon: '🌌', desc: '+25% XP em Tecnologia e Alquimia', category: 'Pesquisa', effectType: 'techXP', effectValue: 25, color: '#9966ff' },
        { id: 'sorte_trevo', name: 'Sorte do Trevo', icon: '🍀', desc: '+15% Bônus em Absolutamente TUDO no jogo', category: 'Universal', effectType: 'allBoost', effectValue: 15, color: '#33ff33' },
        { id: 'olho_abismo', name: 'Olho do Abismo', icon: '👁️', desc: 'Masmorras dropam +50% Ouro e Baús', category: 'Dungeons', effectType: 'dungeonLoot', effectValue: 50, color: '#cc00ff' },
        { id: 'perfume_flores', name: 'Perfume das Flores', icon: '🌺', desc: 'Criação de Poções rende +50% unidades', category: 'Alquimia', effectType: 'cheapAlchemy', effectValue: 50, color: '#ff66aa' },
        { id: 'frenesi_construcao', name: 'Frenesi de Construção', icon: '🏗️', desc: 'Melhorias do Acampamento +30% mais eficientes', category: 'Vila', effectType: 'cheapCamp', effectValue: 30, color: '#ff9933' },
        { id: 'lamina_afiada', name: 'Lâmina Afiadíssima', icon: '🗡️', desc: '+35% Dano Crítico e +10% Chance de Crítico', category: 'Combate', effectType: 'critBoost', effectValue: 35, color: '#ff3333' },
        { id: 'melodia_bardo', name: 'Melodia do Bardo', icon: '🎶', desc: 'Trabalhadores +40% de velocidade de coleta', category: 'Automação', effectType: 'infiniteWorkers', effectValue: 40, color: '#ff99ff' },
        { id: 'pulso_vulcanico', name: 'Pulso Vulcânico', icon: '🌋', desc: 'Forja e Serraria operam 2x mais rápido', category: 'Refino', effectType: 'fastRefine', effectValue: 100, color: '#ff4500' },
        { id: 'cristal_gelo', name: 'Cristal de Gelo', icon: '🧊', desc: 'Encantamentos e Runas concedem +40% bônus', category: 'Encantamento', effectType: 'cheapEnchant', effectValue: 40, color: '#00ffff' },
        { id: 'dia_do_rei', name: 'Dia do Rei', icon: '👑', desc: '🔥 SUPREMO: +50% XP +50% Ouro +30% Dano em TUDO!', category: 'Épico', effectType: 'kingBoost', effectValue: 50, color: '#ffd700' }
    ];

    function getTodayString() {
        const d = new Date();
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }

    function getTodayIndex() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear % DAILY_BUFFS.length;
    }

    function getDailyBuffForToday() {
        return DAILY_BUFFS[getTodayIndex()];
    }

    function getDailyBuffState() {
        try {
            const saved = localStorage.getItem('idleCraftDailyBuff');
            if (!saved) return { dateStr: '', claimedAt: 0, expiresAt: 0 };
            return JSON.parse(saved);
        } catch(e) {
            return { dateStr: '', claimedAt: 0, expiresAt: 0 };
        }
    }

    function getActiveDailyBuff() {
        const state = getDailyBuffState();
        const now = Date.now();
        if (state.expiresAt && now < state.expiresAt) {
            const buff = DAILY_BUFFS.find(b => b.id === state.buffId) || getDailyBuffForToday();
            const remainingSecs = Math.max(0, Math.floor((state.expiresAt - now) / 1000));
            return {
                buff: buff,
                remainingSecs: remainingSecs,
                totalSecs: 1800
            };
        }
        return null;
    }

    function claimDailyBuff() {
        const todayStr = getTodayString();
        const state = getDailyBuffState();
        
        if (state.dateStr === todayStr && state.claimedAt > 0) {
            if (typeof showNotification === 'function') {
                showNotification('🎴 Buff Diário', 'Você já resgatou o buff de hoje!', 'info');
            }
            return;
        }

        const now = Date.now();
        const durationMs = 30 * 60 * 1000; // 30 minutos
        const todayBuff = getDailyBuffForToday();

        const newState = {
            dateStr: todayStr,
            claimedAt: now,
            expiresAt: now + durationMs,
            buffId: todayBuff.id
        };

        localStorage.setItem('idleCraftDailyBuff', JSON.stringify(newState));

        if (typeof showNotification === 'function') {
            showNotification('✨ Buff Resgatado!', `"${todayBuff.name}" ativo por 30 minutos!`, 'success', todayBuff.icon);
        }

        if (typeof spawnConfetti === 'function') {
            spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 35, [todayBuff.color, '#ffffff', '#ffd700']);
        }

        renderDailyBuffCard();
        if (typeof updateUI === 'function') updateUI();
    }

    function getTimeUntilTomorrow() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diffMs = tomorrow - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${hours}h ${mins.toString().padStart(2,'0')}m ${secs.toString().padStart(2,'0')}s`;
    }

    function formatTimer(totalSecs) {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }

    function renderDailyBuffCard() {
        const cardContainer = document.getElementById('dailyBuffCardContainer');
        if (!cardContainer) return;

        const todayBuff = getDailyBuffForToday();
        const todayStr = getTodayString();
        const state = getDailyBuffState();
        const activeInfo = getActiveDailyBuff();
        const isClaimedToday = state.dateStr === todayStr && state.claimedAt > 0;

        let statusBadge = '';
        let buttonHTML = '';
        let progressHTML = '';

        if (activeInfo) {
            const percent = Math.round((activeInfo.remainingSecs / activeInfo.totalSecs) * 100);
            statusBadge = `<span class="db-badge active">🟢 ATIVO (${formatTimer(activeInfo.remainingSecs)})</span>`;
            buttonHTML = `<button class="db-btn active-btn" disabled>🟢 BUFF ATIVO (${formatTimer(activeInfo.remainingSecs)})</button>`;
            progressHTML = `
                <div class="db-progress-bar-wrap">
                    <div class="db-progress-bar-fill" style="width: ${percent}%; background: linear-gradient(90deg, ${todayBuff.color}, #ffd700);"></div>
                    <span class="db-progress-text">${formatTimer(activeInfo.remainingSecs)} restantes</span>
                </div>
            `;
        } else if (isClaimedToday) {
            statusBadge = `<span class="db-badge done">✅ CONCLUÍDO HOJE</span>`;
            buttonHTML = `<button class="db-btn done-btn" disabled>✅ RESGATADO HOJE (Novo em ${getTimeUntilTomorrow()})</button>`;
        } else {
            statusBadge = `<span class="db-badge ready">✨ DISPONÍVEL</span>`;
            buttonHTML = `<button class="db-btn claim-btn" onclick="DailyBuffSystem.claim()">✨ RESGATAR BUFF (30 MINUTOS)</button>`;
        }

        cardContainer.innerHTML = `
            <div class="daily-buff-card" style="border-left-color: ${todayBuff.color};">
                <div class="db-card-header">
                    <div class="db-card-title">
                        <span class="db-title-icon">🎴</span>
                        <span>BUFF DIÁRIO DE HOJE</span>
                        <span class="db-category-tag" style="border-color:${todayBuff.color}; color:${todayBuff.color};">${todayBuff.category}</span>
                    </div>
                    ${statusBadge}
                </div>

                <div class="db-card-body">
                    <div class="db-buff-icon-wrap" style="text-shadow: 0 0 15px ${todayBuff.color};">
                        <span class="db-buff-icon">${todayBuff.icon}</span>
                    </div>
                    <div class="db-buff-info">
                        <div class="db-buff-name" style="color: ${todayBuff.color};">${todayBuff.name}</div>
                        <div class="db-buff-desc">${todayBuff.desc}</div>
                        <div class="db-buff-duration">⏱️ Duração: <b>30 Minutos</b> após ativado</div>
                    </div>
                </div>

                ${progressHTML}

                <div class="db-card-footer">
                    ${buttonHTML}
                </div>
            </div>
        `;
    }

    // Função de aplicação dos bônus no jogo
    function applyDailyBuffBonus(type) {
        const activeInfo = getActiveDailyBuff();
        if (!activeInfo) return 0;
        const b = activeInfo.buff;

        if (b.effectType === 'allBoost' || b.effectType === 'kingBoost') return b.effectValue;
        if (b.effectType === type) return b.effectValue;
        
        // Aliases para tipos comuns
        if (type === 'allXP' && (b.effectType === 'allXP' || b.effectType === 'kingBoost')) return b.effectValue;
        if (type === 'goldBoost' && (b.effectType === 'goldBoost' || b.effectType === 'kingBoost')) return b.effectValue;
        if (type === 'combatBoost' && (b.effectType === 'combatBoost' || b.effectType === 'kingBoost')) return b.effectValue;

        return 0;
    }

    // =============================================
    // BANNER DO MENU PRINCIPAL
    // =============================================
    function renderMenuBanner() {
        const banner = document.getElementById('menuDailyBuffBanner');
        if (!banner) return;

        const b = getDailyBuffForToday();
        if (!b) return;

        // Atualiza cor dinâmica via CSS variable
        banner.style.setProperty('--mdb-color', b.color);

        // Popula campos
        const iconEl = document.getElementById('mdbIcon');
        const nameEl = document.getElementById('mdbName');
        const descEl = document.getElementById('mdbDesc');
        const catEl  = document.getElementById('mdbCategory');

        if (iconEl) iconEl.textContent = b.icon;
        if (nameEl) nameEl.textContent = b.name;
        if (descEl) descEl.textContent = b.desc;
        if (catEl)  catEl.textContent  = b.category.toUpperCase();

        // Estado do buff — usa getDailyBuffState (nome correto da função interna)
        const state     = getDailyBuffState();
        const todayStr  = getTodayString();
        const now       = Date.now();
        const isActive  = state && state.dateStr === todayStr && state.expiresAt > now;
        const isClaimed = state && state.dateStr === todayStr && state.claimedAt > 0 && state.expiresAt <= now;

        const ctaEl = banner.querySelector('.mdb-cta');
        if (ctaEl) {
            if (isActive) {
                const rem = Math.max(0, Math.floor((state.expiresAt - now) / 1000));
                const m = Math.floor(rem / 60);
                const s = rem % 60;
                ctaEl.textContent = `⏱ ${m}:${s.toString().padStart(2,'0')}`;
                ctaEl.style.background = '#22aa22';
                ctaEl.style.color = '#fff';
            } else if (isClaimed) {
                ctaEl.textContent = '✓ USADO';
                ctaEl.style.background = '#444';
                ctaEl.style.color = '#888';
            } else {
                ctaEl.textContent = '▶ CONTINUAR E RESGATAR';
                ctaEl.style.background = b.color;
                ctaEl.style.color = '#000';
            }
        }

        // Define onclick do banner: claim + continuar OU destacar Novo Jogo
        banner.onclick = function() {
            const hasSave = !!localStorage.getItem('idleCraftSave');
            if (hasSave) {
                // Resgata o buff e entra no jogo
                claimDailyBuff();
                if (typeof menuContinue === 'function') menuContinue();
            } else {
                // Pisca o botão "NOVO JOGO" para orientar o jogador
                const newGameBtn = document.querySelector('.menu-btn-main.newgame');
                if (newGameBtn) {
                    newGameBtn.classList.add('menu-btn-pulse-glow');
                    setTimeout(() => newGameBtn.classList.remove('menu-btn-pulse-glow'), 2800);
                }
                if (typeof showNotification === 'function') {
                    showNotification('🎴 Buff do Dia', 'Crie um novo jogo para resgatar o buff!', 'info');
                }
            }
        };

        // Partículas flutuantes (geradas apenas 1x)
        const particlesEl = document.getElementById('mdbParticles');
        if (particlesEl && particlesEl.children.length === 0) {
            for (let i = 0; i < 8; i++) {
                const p = document.createElement('div');
                p.className = 'mdb-particle';
                p.style.left   = (Math.random() * 100) + '%';
                p.style.bottom = '-8px';
                p.style.setProperty('--dur',   (2 + Math.random() * 2.5).toFixed(1) + 's');
                p.style.setProperty('--delay', (Math.random() * 3).toFixed(1) + 's');
                p.style.width  = (3 + Math.random() * 4) + 'px';
                p.style.height = p.style.width;
                p.style.background = b.color;
                particlesEl.appendChild(p);
            }
        }
    }

    // Inicialização e loop de renderização do timer
    let _timerInterval = null;
    function startTimerLoop() {
        if (_timerInterval) clearInterval(_timerInterval);
        _timerInterval = setInterval(() => {
            renderDailyBuffCard();
            renderMenuBanner();
        }, 1000);
    }

    // Exposição Global API
    window.DailyBuffSystem = {
        init: function() {
            renderDailyBuffCard();
            renderMenuBanner();
            startTimerLoop();
        },
        claim: claimDailyBuff,
        getActiveBuff: getActiveDailyBuff,
        getBonus: applyDailyBuffBonus,
        getTodayBuff: getDailyBuffForToday,
        render: renderDailyBuffCard,
        renderMenuBanner: renderMenuBanner
    };

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (window.DailyBuffSystem) window.DailyBuffSystem.init();
        }, 300);
    });

})();
