// ============================================
// WORLDBOSS.JS
// Mecânica de Chefe Global Assíncrono (Firebase)
// ============================================

let currentWorldBoss = null;
let worldBossUnsubscribe = null;
let accumulatedDamage = 0;
let lastDamageSync = 0;
let worldBossCombatInterval = null;
let lastTickTime = Date.now();
let leaderboardInterval = null;

// Bestiário estático dos 10 chefes para o showcase
const worldBossesList = [
    {
        name: "Dragão Ancestral de Ouro",
        icon: "🐉",
        maxHp: 10000,
        desc: "Um antigo dragão dourado cujo sopro derrete montanhas.",
        rewardEquip: "wb_dragon_crown",
        rewardGold: 100000,
        rewardExtraItem: { type: "bar4", qty: 10, name: "10x Barras de Ouro" },
        buff: { id: "dragon_wealth", name: "Fortuna do Dragão", icon: "💰", desc: "+40% Ouro em Batalhas e +50% Venda no Mercado", value: 40 }
    },
    {
        name: "Beholder do Vazio",
        icon: "👁️",
        maxHp: 10000,
        desc: "Sua mera presença distorce a realidade e a sanidade.",
        rewardEquip: "wb_void_amulet",
        rewardGold: 30000,
        rewardExtraItem: { type: "wood5", qty: 5, name: "5x Madeira Mística" },
        buff: { id: "void_knowledge", name: "Conhecimento do Vazio", icon: "🌀", desc: "+50% XP em TODAS as Skills e Perícias de Arma", value: 50 }
    },
    {
        name: "Fênix de Magma",
        icon: "🔥",
        maxHp: 10000,
        desc: "Ressurge das cinzas vulcânicas espalhando fogo eterno.",
        rewardEquip: "wb_phoenix_staff",
        rewardGold: 35000,
        rewardExtraItem: { type: "slag", qty: 50, name: "50x Escória Brilhante" },
        buff: { id: "forge_eruption", name: "Erupção da Forja", icon: "🔥", desc: "Forja sem calor + 100% chance de duplicar lingotes", value: 100 }
    },
    {
        name: "Golem de Mitril Silencioso",
        icon: "🗿",
        maxHp: 10000,
        desc: "Um guardião titânico feito do mais puro metal mitril.",
        rewardEquip: "wb_golem_shield",
        rewardGold: 40000,
        rewardExtraItem: { type: "bar5", qty: 15, name: "15x Barras de Mitril" },
        buff: { id: "mythril_bulwark", name: "Baluarte de Mitril", icon: "🛡️", desc: "+40% Armadura, Defesa e Redução de Dano em Batalhas", value: 40 }
    },
    {
        name: "Lich do Cataclismo",
        icon: "💀",
        maxHp: 10000,
        desc: "Um lorde necromante supremo que comanda o exército dos mortos.",
        rewardEquip: "wb_lich_ring",
        rewardGold: 45000,
        rewardExtraItem: { type: "bar3", qty: 10, name: "10x Barras de Prata Rúnicas" },
        buff: { id: "cataclysm_vampirism", name: "Vampirismo do Cataclismo", icon: "🩸", desc: "+15% Roubo de Vida e +30% Dano Crítico", value: 30 }
    },
    {
        name: "Kraken dos Abismos",
        icon: "🐙",
        maxHp: 10000,
        desc: "A lendária criatura marinha que arrasta frotas inteiras ao fundo.",
        rewardEquip: "wb_kraken_trident",
        rewardGold: 50000,
        rewardExtraItem: { type: "fish5", qty: 10, name: "10x Peixes Míticos Abissais" },
        buff: { id: "abyss_treasures", name: "Tesouros do Abismo", icon: "🌊", desc: "+50% Pesca Rara e +30% Loot em Baús de Masmorra", value: 50 }
    },
    {
        name: "Quimera da Tempestade",
        icon: "🦁⚡",
        maxHp: 10000,
        desc: "Um monstro híbrido envolto em raios e ventanias destrutivas.",
        rewardEquip: "wb_chimera_boots",
        rewardGold: 35000,
        rewardExtraItem: { type: "wood4", qty: 20, name: "20x Madeira de Ébano" },
        buff: { id: "gale_fury", name: "Fúria dos Ventos", icon: "⚡", desc: "+35% Vel. Ataque e +50% Vel. no Corte de Madeira", value: 35 }
    },
    {
        name: "Titã de Pedra Ancestral",
        icon: "⛰️",
        maxHp: 10000,
        desc: "Uma montanha viva despertada da hibernação dos séculos.",
        rewardEquip: "wb_stone_helm",
        rewardGold: 40000,
        rewardExtraItem: { type: "bar5", qty: 10, name: "10x Minérios Raros" },
        buff: { id: "earth_voice", name: "Voz da Terra", icon: "💎", desc: "+50% Chance de Minérios Raros e Gemas Preciosas", value: 50 }
    },
    {
        name: "Lorde Vampiro Drácula",
        icon: "🧛",
        maxHp: 10000,
        desc: "O soberano das sombras que se alimenta do sangue dos guerreiros.",
        rewardEquip: "wb_dracula_cloak",
        rewardGold: 60000,
        rewardExtraItem: { type: "arena_coins", qty: 1000, name: "1.000 Moedas da Arena" },
        buff: { id: "blood_banquet", name: "Banquete de Sangue", icon: "🩸", desc: "+25% Taxa Crítica e +100% Moedas na Arena", value: 25 }
    },
    {
        name: "Rei Slime Corrompido",
        icon: "👑💧",
        maxHp: 10000,
        desc: "Uma massa gelatinosa titânica que consome tudo em seu caminho.",
        rewardEquip: "wb_slime_crown",
        rewardGold: 30000,
        rewardExtraItem: { type: "wood1", qty: 100, name: "100x Ervas Especiais" },
        buff: { id: "slime_transmutation", name: "Transmutação Gelatinosa", icon: "🧪", desc: "Criação de Poções e Alquimia rendem 3x mais poções", value: 300 }
    }
];

function initWorldBoss() {
    if (!window.FirebaseService) {
        document.getElementById('worldbossContainer').innerHTML = '<div style="text-align:center; padding: 40px; color:#ff4444;">Erro de conexão com o servidor. Tente novamente mais tarde.</div>';
        return;
    }

    // Tenta spawnar se necessário
    window.FirebaseService.checkAndSpawnWorldBoss();

    // Inicia escuta em tempo real do World Boss
    if (worldBossUnsubscribe) worldBossUnsubscribe();
    worldBossUnsubscribe = window.FirebaseService.listenToWorldBoss((bossData) => {
        if (!bossData) {
            renderWorldBoss(null);
            return;
        }
        currentWorldBoss = bossData;
        renderWorldBoss(bossData);
        refreshWorldBossLeaderboard();

        // 1. BUFF GLOBAL DO SERVIDOR: Ativa automaticamente a Bênção do Titã para TODOS os jogadores
        let globalBuff = bossData.activeBuff;
        if (globalBuff && globalBuff.expiresAt) {
            let exp = globalBuff.expiresAt;
            if (typeof exp === 'object' && exp.toMillis) exp = exp.toMillis();
            else if (typeof exp === 'object' && exp.seconds) exp = exp.seconds * 1000;

            if (Date.now() < exp) {
                gameState.worldBossBuff = {
                    name: globalBuff.name || "Bênção do Titã",
                    value: globalBuff.value || 5,
                    expiresAt: exp,
                    bossName: globalBuff.bossName || bossData.name
                };
                if (typeof updateSidebarBuffs === 'function') updateSidebarBuffs();
            }
        } else if (bossData.hp <= 0 && bossData.defeatTime) {
            // Fallback se o chefe foi derrotado recentemente (nas últimas 4h)
            let defTime = bossData.defeatTime;
            if (typeof defTime === 'object' && defTime.toMillis) defTime = defTime.toMillis();
            else if (typeof defTime === 'object' && defTime.seconds) defTime = defTime.seconds * 1000;

            const buffDuration = 4 * 60 * 60 * 1000;
            if (Date.now() - defTime < buffDuration) {
                if (!gameState.worldBossBuff || gameState.worldBossBuff.expiresAt < defTime + buffDuration) {
                    gameState.worldBossBuff = {
                        name: "Bênção do Titã",
                        value: 5,
                        expiresAt: defTime + buffDuration,
                        bossName: bossData.name
                    };
                    if (typeof updateSidebarBuffs === 'function') updateSidebarBuffs();
                }
            }
        }

        // 2. Se o chefe morreu e o jogador estava lutando, encerra a luta local e entrega recompensas de loot pessoais
        if (bossData.hp <= 0) {
            if (gameState.isFightingWorldBoss) {
                gameState.isFightingWorldBoss = false;
                if (worldBossCombatInterval) {
                    clearInterval(worldBossCombatInterval);
                    worldBossCombatInterval = null;
                }
                syncWorldBossDamage();
            }
            checkAndClaimWorldBossRewards(bossData);
        } else {
            // Se o jogador estiver em modo de batalha, garante que o loop de combate local esteja rodando
            if (gameState.isFightingWorldBoss && !worldBossCombatInterval) {
                lastTickTime = Date.now();
                gameState.lastWorldBossTick = Date.now();
                worldBossCombatInterval = setInterval(worldBossCombatTick, 1000);
            }
        }
    });

    // Inicia a atualização do placar a cada 5 segundos
    startLeaderboardRefresh();
}

function startLeaderboardRefresh() {
    if (leaderboardInterval) clearInterval(leaderboardInterval);
    leaderboardInterval = setInterval(() => {
        if (gameState.currentPage === 'worldboss') {
            refreshWorldBossLeaderboard();
        }
    }, 5000);
}

function renderWorldBoss(boss) {
    const container = document.getElementById('worldbossContainer');
    if (!container) return;
    
    if (!boss) {
        container.innerHTML = '<div style="text-align:center; padding: 40px; color:#aaa;">Nenhum Chefe Global ativo no momento.</div>';
        return;
    }

    const hpPercent = Math.max(0, (boss.hp / boss.maxHp) * 100).toFixed(4);
    const isDead = boss.hp <= 0;

    let html = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; padding:20px;">
            
            <div style="text-align:center;">
                <h2 style="font-family:'Cinzel', serif; font-size:2em; color:#ffd700; text-shadow: 0 0 10px rgba(255,215,0,0.5); margin:0;">${boss.name}</h2>
                <div style="font-size:0.9em; color:#aaa;">Chefe Mundial Titânico</div>
            </div>

            <div style="font-size:6em; line-height:1; filter: drop-shadow(0 0 20px rgba(255,215,0,0.4));">${boss.icon || '🐉'}</div>

            <div style="width: 100%; max-width: 600px; background: rgba(0,0,0,0.5); border: 2px solid #555; border-radius: 10px; padding: 4px;">
                <div style="width: ${hpPercent}%; height: 24px; background: linear-gradient(90deg, #ff4444, #cc0000); border-radius: 6px; transition: width 0.5s ease;"></div>
            </div>
            
            <div style="font-family:'Cinzel', serif; font-size:1.2em; font-weight:bold; color:#fff;">
                HP: ${formatNumber(Math.max(0, boss.hp))} / ${formatNumber(boss.maxHp)} (${hpPercent}%)
            </div>

            <div style="margin-top: 10px; display:flex; gap:10px;">
                ${isDead 
                    ? `<button class="menu-btn" onclick="forceClaimCurrentBossReward()" style="background:linear-gradient(135deg, #ffd700, #b8860b); color:#000; font-weight:bold; font-size:1.15em; padding: 12px 28px; border-radius:8px; cursor:pointer; box-shadow:0 0 15px rgba(255,215,0,0.4);">🎁 Reivindicar Bênção do Titã (+Dano, Ouro e XP)</button>` 
                    : `<button class="menu-btn" id="btnToggleWBBattle" onclick="toggleWorldBossBattle()" style="background:linear-gradient(135deg, ${gameState.isFightingWorldBoss ? '#555, #333' : '#a00, #600'}); border:1px solid #f55; color:#fff; font-size:1.2em; padding: 10px 30px;">${gameState.isFightingWorldBoss ? '⚔️ Lutando (Sair da Batalha)' : '🔥 Entrar na Batalha'}</button>`
                }
            </div>

            <div id="wbDamageDisplay" style="margin-top:10px; font-size:1.2em; color:#ffd700; height:30px; font-weight:bold;">
                <!-- Dano dinâmico -->
            </div>

            <!-- Top Contribuições (atualizado a cada 5s) -->
            <div style="width:100%; max-width:800px; margin-top:20px; background:rgba(0,0,0,0.3); border-radius:10px; padding:20px;">
                <h3 style="font-family:'Cinzel',serif; color:#fff; text-align:center; border-bottom:1px solid #444; padding-bottom:10px;">🏆 Top Contribuições (Atualiza a cada 5s)</h3>
                <div id="wbLeaderboardList" style="margin-top:15px; display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto; padding-right:10px;">
                    <div style="text-align:center; color:#888;">Carregando contribuições...</div>
                </div>
            </div>

            <!-- Bestiário / Showcase dos 10 Chefes Globais -->
            <div style="width:100%; max-width:800px; margin-top:40px; background:rgba(20,30,50,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:25px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                <h3 style="font-family:'Cinzel', serif; color:#ffd700; text-align:center; margin-top:0; margin-bottom:5px; font-size:1.4em;">👁️ Bestiário de Chefes Globais</h3>
                <p style="font-size:0.85em; color:#aaa; text-align:center; margin-top:0; margin-bottom:20px;">Estes são os lendários Titãs que habitam as terras. Apenas um por vez surge para desafiar o reino.</p>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    ${renderBossShowcaseHTML(boss)}
                </div>
            </div>

        </div>
    `;

    container.innerHTML = html;
}

function renderBossShowcaseHTML(activeBoss) {
    // Verifica se há buff ativo do world boss
    const wb = gameState && gameState.worldBossBuff;
    const buffActive = wb && wb.expiresAt && Date.now() < wb.expiresAt;

    // Banner de buff ativo (aparece no topo do bestiário)
    let activeBanner = '';
    if (buffActive) {
        const remaining = wb.expiresAt - Date.now();
        const hLeft = Math.floor(remaining / 3600000);
        const mLeft = Math.floor((remaining % 3600000) / 60000);
        const sLeft = Math.floor((remaining % 60000) / 1000);
        const timeStr = hLeft > 0 ? `${hLeft}h ${mLeft}m` : `${mLeft}m ${sLeft}s`;

        // Cor da poção baseada no valor do buff
        const buffColors = {
            1: { from:'#555', to:'#333', border:'#888',   glow:'rgba(150,150,150,0.4)', color:'#ccc'    },
            2: { from:'#0d3a6e', to:'#0a2a52', border:'#3a8fff', glow:'rgba(58,143,255,0.4)', color:'#78c8ff' },
            3: { from:'#0d4a1e', to:'#0a3214', border:'#2ecc71', glow:'rgba(46,204,113,0.4)', color:'#7de87d' },
            4: { from:'#4a3a00', to:'#322800', border:'#ffd700', glow:'rgba(255,215,0,0.4)',   color:'#ffe066' },
            5: { from:'#4a2200', to:'#321600', border:'#ff8800', glow:'rgba(255,136,0,0.4)',   color:'#ffaa44' },
            6: { from:'#4a0a0a', to:'#320606', border:'#ff4444', glow:'rgba(255,68,68,0.4)',   color:'#ff6666' },
            7: { from:'#3a0a5a', to:'#28063e', border:'#d896ff', glow:'rgba(216,150,255,0.6)', color:'#d896ff' },
        };
        const c = buffColors[wb.value] || buffColors[1];

        activeBanner = `
            <div style="
                grid-column: 1 / -1;
                background: linear-gradient(135deg, ${c.from}, ${c.to});
                border: 2px solid ${c.border};
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 0 20px ${c.glow};
                display: flex;
                align-items: center;
                gap: 18px;
                margin-bottom: 4px;
                animation: wbBuffPulse 2.5s ease-in-out infinite;
            ">
                <div style="font-size:3em; filter: drop-shadow(0 0 10px ${c.glow});">🧪</div>
                <div style="flex:1;">
                    <div style="font-family:'Cinzel', serif; font-size:1.1em; color:${c.color}; font-weight:bold; margin-bottom:4px;">
                        ⚡ Bênção do Titã ativa — <span style="font-size:1.2em;">+${wb.value}%</span> Dano · Ouro · XP
                    </div>
                    <div style="font-size:0.8em; color:#bbb;">Recompensa do Chefe Global · Expira em <strong style="color:${c.color};">${timeStr}</strong></div>
                    <div style="margin-top:8px; background:rgba(0,0,0,0.3); border-radius:6px; height:6px; overflow:hidden;">
                        <div style="width:${Math.min(100,(remaining / (4*3600000))*100).toFixed(1)}%; height:100%; background: linear-gradient(90deg, ${c.border}, ${c.color}); border-radius:6px; transition: width 1s linear;"></div>
                    </div>
                </div>
                <div style="font-size:0.75em; color:${c.color}; font-weight:bold; text-align:center; white-space:nowrap;">
                    ⏳<br>${timeStr}<br>restante
                </div>
            </div>
            <style>
                @keyframes wbBuffPulse {
                    0%,100% { box-shadow: 0 0 15px ${c.glow}; }
                    50%      { box-shadow: 0 0 30px ${c.glow}; }
                }
            </style>
        `;
    }

    const cards = worldBossesList.map(b => {
        const isActive = activeBoss && activeBoss.name === b.name;
        const statusText = isActive ? '<span style="color:#2ecc71; font-weight:bold;">⚡ ATIVO AGORA</span>' : '<span style="color:#888;">⏳ Adormecido</span>';
        const cardBorder = isActive ? 'border: 2px solid #2ecc71; box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);' : 'border: 1px solid rgba(255,255,255,0.06);';
        const cardBg = isActive ? 'background: rgba(46, 204, 113, 0.05);' : 'background: rgba(0,0,0,0.25);';

        return `
            <div style="display:flex; flex-direction:column; justify-content:space-between; padding:15px; border-radius:10px; ${cardBg} ${cardBorder} font-family:'Outfit', sans-serif;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:1.8em; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));">${b.icon}</span>
                        <span style="font-size:0.75em; text-transform:uppercase; padding:3px 8px; border-radius:12px; background:rgba(255,255,255,0.05);">${statusText}</span>
                    </div>
                    <div style="font-family:'Cinzel', serif; font-size:1.05em; color:#fff; font-weight:bold; margin-bottom:4px;">${b.name}</div>
                    <div style="font-size:0.75em; color:#888; margin-bottom:12px; height: 36px; overflow:hidden;">${b.desc}</div>
                </div>
                <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:10px; font-size:0.8em; color:#bbb;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                        <span>💖 Max HP:</span>
                        <span style="color:#ff5555; font-weight:bold;">${formatNumber(b.maxHp)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                        <span>💰 Ouro:</span>
                        <span style="color:#ffd700; font-weight:bold;">+${formatNumber(b.rewardGold)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>🗡️ Item Único:</span>
                        <span style="color:#ff44aa; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;" title="${equipmentData[b.rewardEquip]?.name || 'Item Ancestral'}">${equipmentData[b.rewardEquip]?.name || 'Item Ancestral'}</span>
                    </div>
                    <div style="background:rgba(155,89,182,0.1); border:1px solid rgba(155,89,182,0.25); border-radius:8px; padding:8px 10px; margin-top:6px;">
                        <div style="color:#d896ff; font-weight:bold; margin-bottom:3px; font-size:0.85em;">${b.buff.icon} ${b.buff.name} (4h)</div>
                        <div style="color:#aaa; font-size:0.75em; line-height:1.2;">${b.buff.desc}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return activeBanner + cards;
}

function toggleWorldBossBattle() {
    gameState.isFightingWorldBoss = !gameState.isFightingWorldBoss;
    
    if (gameState.isFightingWorldBoss) {
        gameState.hasParticipatedInWorldBoss = true;
        lastTickTime = Date.now();
        gameState.lastWorldBossTick = Date.now();
        if (worldBossCombatInterval) clearInterval(worldBossCombatInterval);
        worldBossCombatInterval = setInterval(worldBossCombatTick, 1000);
        showNotification('⚔️ Entrou na Batalha!', 'Você começará a causar dano contínuo ao Chefe Global (mesmo offline)!', 'success');
    } else {
        if (worldBossCombatInterval) clearInterval(worldBossCombatInterval);
        worldBossCombatInterval = null;
        syncWorldBossDamage();
        showNotification('🏃 Fugiu da Batalha!', 'Você parou de atacar o Chefe Global.', 'info');
    }
    
    // Salva o estado imediatamente
    localStorage.setItem('idleCraftSave', JSON.stringify(gameState));

    if (currentWorldBoss) renderWorldBoss(currentWorldBoss);
}

function worldBossCombatTick() {
    if (!currentWorldBoss || currentWorldBoss.hp <= 0) {
        if (worldBossCombatInterval) clearInterval(worldBossCombatInterval);
        worldBossCombatInterval = null;
        gameState.isFightingWorldBoss = false;
        if (currentWorldBoss) renderWorldBoss(currentWorldBoss);
        return;
    }

    gameState.hasParticipatedInWorldBoss = true;
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTickTime) / 1000);
    if (elapsedSeconds <= 0) return;

    lastTickTime = now;
    gameState.lastWorldBossTick = now;

    // Calcula dano para cada segundo passado (evita perda de dano por abas minimizadas)
    let totalDmg = 0;
    const pDmg = calculatePlayerDamage();
    for (let i = 0; i < elapsedSeconds; i++) {
        let dmg = Math.floor(pDmg.min + Math.random() * (pDmg.max - pDmg.min + 1));
        if (Math.random() * 100 < pDmg.critChance) {
            dmg = Math.floor(dmg * pDmg.critMult);
        }
        totalDmg += dmg;
    }

    if (totalDmg > 0) {
        accumulatedDamage += totalDmg;
        showWorldBossHit(totalDmg, elapsedSeconds > 1);
    }

    // Sincroniza a cada 5 segundos (requisito: "envio do dano do jogador enviado a cada 5 segundos")
    if (now - lastDamageSync > 5000 && accumulatedDamage > 0) {
        syncWorldBossDamage();
    }
}

function calculatePlayerDamage() {
    let baseStr = gameState.combat?.playerStrength || 10;
    let baseDmgMin = Math.floor(baseStr * 0.8);
    let baseDmgMax = Math.floor(baseStr * 1.2);
    
    let critChance = 5;
    let critMult = 1.5;
    
    if (typeof getEquipmentBonuses === 'function') {
        const eq = getEquipmentBonuses();
        if (eq.critChance) critChance += eq.critChance;
        if (eq.critDamage) critMult += eq.critDamage / 100;
    }
    
    return {
        min: baseDmgMin,
        max: baseDmgMax,
        critChance: critChance,
        critMult: critMult
    };
}

function showWorldBossHit(dmg, isOffline = false) {
    const el = document.getElementById('wbDamageDisplay');
    if (!el) return;
    
    el.innerHTML = `<span style="color:#ff4444; animation: popText 0.3s ease;">💥 -${formatNumber(dmg)} dano ao Chefe Global!</span>`;
    
    setTimeout(() => {
        if (el) el.innerHTML = '';
    }, 2000);
}

function syncWorldBossDamage() {
    const pName = gameState.player?.name || gameState.name || 'Herói';
    if (accumulatedDamage <= 0 || !pName) return;
    
    const dmgToSend = accumulatedDamage;
    accumulatedDamage = 0; 
    lastDamageSync = Date.now();
    
    const avatar = gameState.player?.avatar || 'knight';
    if (window.FirebaseService && typeof window.FirebaseService.submitWorldBossDamage === 'function') {
        window.FirebaseService.submitWorldBossDamage(dmgToSend, pName, avatar);
    }
    
    refreshWorldBossLeaderboard();
}

async function refreshWorldBossLeaderboard() {
    const listEl = document.getElementById('wbLeaderboardList');
    if (!listEl) return;
    
    if (gameState.currentPage !== 'worldboss') return;
    
    const lbData = await window.FirebaseService.getWorldBossLeaderboard();
    
    if (!lbData || lbData.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; color:#888;">Nenhum dano registrado ainda.</div>';
        return;
    }
    
    let html = '';
    lbData.forEach((p, index) => {
        let badge = `<span style="display:inline-block; width:24px; text-align:center; color:#888;">#${index+1}</span>`;
        if (index === 0) badge = '🥇';
        if (index === 1) badge = '🥈';
        if (index === 2) badge = '🥉';
        
        const avatarImg = `img/avatars/${p.avatarClass || 'knight'}.png`;
        
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px 15px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:1.2em;">${badge}</div>
                    <img src="${avatarImg}" onerror="this.src='img/avatars/knight.png'" style="width:32px; height:32px; border-radius:50%; border:1px solid #ffd700; background:#222;">
                    <div style="font-family:'Outfit', sans-serif; font-size:1.1em; color:#fff;">${p.name}</div>
                </div>
                <div style="font-family:'Cinzel', serif; font-size:1.1em; font-weight:bold; color:#f55;">
                    ⚔️ ${formatNumber(p.damage)}
                </div>
            </div>
        `;
    });
    
    listEl.innerHTML = html;
}

// Lógica de reivindicação de recompensas
async function checkAndClaimWorldBossRewards(bossData) {
    if (!bossData || bossData.hp > 0) return;
    
    const pName = gameState.player?.name || gameState.name || 'Herói';
    const bInfo = worldBossesList.find(b => b.name === bossData.name) || worldBossesList[0];

    // Normalizar ID único da luta para evitar colisão por 'undefined'
    let bossKey = bossData.spawnTime || bossData.defeatTime || (bossData.name + '_' + (bossData.maxHp || 10000));
    if (typeof bossKey === 'object') {
        bossKey = bossKey.toMillis ? bossKey.toMillis() : (bossKey.seconds ? bossKey.seconds * 1000 : JSON.stringify(bossKey));
    }
    bossKey = String(bossKey);

    gameState.claimedWorldBossRewards = gameState.claimedWorldBossRewards || {};
    
    // Limpa chave 'undefined' ou nula se existir de tentativas antigas
    if (gameState.claimedWorldBossRewards['undefined']) delete gameState.claimedWorldBossRewards['undefined'];
    if (gameState.claimedWorldBossRewards['null']) delete gameState.claimedWorldBossRewards['null'];

    if (gameState.claimedWorldBossRewards[bossKey]) return;
    
    let lbData = [];
    if (window.FirebaseService && typeof window.FirebaseService.getWorldBossLeaderboard === 'function') {
        lbData = await window.FirebaseService.getWorldBossLeaderboard();
    }
    
    const playerContribution = lbData ? lbData.find(p => p.name === pName) : null;
    const hasParticipated = gameState.hasParticipatedInWorldBoss || (playerContribution && playerContribution.damage > 0) || (typeof accumulatedDamage !== 'undefined' && accumulatedDamage > 0) || gameState.isFightingWorldBoss || !window.FirebaseService || window.FirebaseService.isFallback;
    
    if (hasParticipated) {
        gameState.claimedWorldBossRewards[bossKey] = true;
        gameState.hasParticipatedInWorldBoss = false;
        
        // 1. Ouro Único por Chefe
        const goldGain = bInfo.rewardGold || 50000;
        gameState.gold = (gameState.gold || 0) + goldGain;
        
        // 2. Equipamento Ancestral Único por Chefe
        const equipId = bInfo.rewardEquip || 'wb_dragon_crown';
        addNewEquipmentToInventory(equipId, 'ancient');
        
        // 3. Item/Recurso Extra Único
        if (bInfo.rewardExtraItem) {
            const exType = bInfo.rewardExtraItem.type;
            const exQty = bInfo.rewardExtraItem.qty;
            if (exType === 'arena_coins') {
                gameState.arenaCoins = (gameState.arenaCoins || 0) + exQty;
            } else {
                gameState.inventory[exType] = (gameState.inventory[exType] || 0) + exQty;
            }
        }
        
        // 4. Buff Server-Wide / Local Único
        gameState.worldBossBuff = {
            name: bInfo.buff.name,
            icon: bInfo.buff.icon,
            desc: bInfo.buff.desc,
            value: bInfo.buff.value,
            bossName: bInfo.name,
            expiresAt: Date.now() + 4 * 60 * 60 * 1000 // 4 horas
        };
        
        localStorage.setItem('idleCraftSave', JSON.stringify(gameState));
        if (typeof updateSidebarBuffs === 'function') updateSidebarBuffs();
        
        // Exibir modal premium de recompensa única
        const baseItem = equipmentData[equipId];
        const itemName = baseItem ? baseItem.name : "Equipamento Ancestral";
        const itemIcon = baseItem ? baseItem.icon : "⚔️";
        
        showWorldBossRewardModal(bossData.name, itemName, itemIcon, goldGain, bInfo.rewardExtraItem, bInfo.buff);
    }
}

window.forceClaimCurrentBossReward = function() {
    const bossName = currentWorldBoss ? currentWorldBoss.name : "Dragão Ancestral de Ouro";
    const bInfo = worldBossesList.find(b => b.name === bossName) || worldBossesList[0];
    
    const goldGain = bInfo.rewardGold || 50000;
    const equipId = bInfo.rewardEquip || 'wb_dragon_crown';
    
    gameState.gold = (gameState.gold || 0) + goldGain;
    addNewEquipmentToInventory(equipId, 'ancient');
    
    if (bInfo.rewardExtraItem) {
        const exType = bInfo.rewardExtraItem.type;
        const exQty = bInfo.rewardExtraItem.qty;
        if (exType === 'arena_coins') {
            gameState.arenaCoins = (gameState.arenaCoins || 0) + exQty;
        } else {
            gameState.inventory[exType] = (gameState.inventory[exType] || 0) + exQty;
        }
    }
    
    gameState.worldBossBuff = {
        name: bInfo.buff.name,
        icon: bInfo.buff.icon,
        desc: bInfo.buff.desc,
        value: bInfo.buff.value,
        bossName: bInfo.name,
        expiresAt: Date.now() + 4 * 60 * 60 * 1000 // 4 horas
    };
    
    if (currentWorldBoss) {
        let bossKey = currentWorldBoss.spawnTime || currentWorldBoss.defeatTime || (currentWorldBoss.name + '_' + (currentWorldBoss.maxHp || 10000));
        if (typeof bossKey === 'object') {
            bossKey = bossKey.toMillis ? bossKey.toMillis() : (bossKey.seconds ? bossKey.seconds * 1000 : JSON.stringify(bossKey));
        }
        gameState.claimedWorldBossRewards = gameState.claimedWorldBossRewards || {};
        gameState.claimedWorldBossRewards[String(bossKey)] = true;
    }
    
    localStorage.setItem('idleCraftSave', JSON.stringify(gameState));
    if (typeof updateSidebarBuffs === 'function') updateSidebarBuffs();
    
    const baseItem = equipmentData[equipId];
    const itemName = baseItem ? baseItem.name : "Equipamento Ancestral";
    const itemIcon = baseItem ? baseItem.icon : "⚔️";
    
    showWorldBossRewardModal(bossName, itemName, itemIcon, goldGain, bInfo.rewardExtraItem, bInfo.buff);
    showNotification(`👑 Recompensa de ${bossName}!`, `Você recebeu ${itemName} + ${bInfo.buff.name}!`, 'success');
};

function showWorldBossRewardModal(bossName, itemName, itemIcon, goldGain, extraItem, buff) {
    const modalId = 'wbRewardModal_' + Date.now();
    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.fontFamily = "'Outfit', sans-serif";
    overlay.style.backdropFilter = 'blur(10px)';
    
    const extraHtml = extraItem ? `
        <div style="display: flex; align-items: center; gap: 15px; background: rgba(74, 255, 74, 0.08); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(74, 255, 74, 0.2);">
            <span style="font-size: 1.5em;">🎁</span>
            <div>
                <div style="font-weight: bold; color: #4aff4a;">+${extraItem.name}</div>
                <div style="font-size: 0.75em; color: #888;">Recursos Temáticos Exclusivos</div>
            </div>
        </div>
    ` : '';

    overlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #1b263b, #0d1b2a); border: 2px solid #ffd700; border-radius: 16px; padding: 30px; width: 90%; max-width: 480px; text-align: center; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2); animation: scaleUp 0.3s ease-out;">
            <div style="font-size: 3.2em; margin-bottom: 10px;">🏆</div>
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; margin-top: 0; margin-bottom: 5px;">Recompensas Únicas!</h2>
            <p style="color: #aaa; font-size: 0.9em; margin-bottom: 25px;">O Titã <strong>${bossName}</strong> foi derrotado!</p>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.05); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
                    <span style="font-size: 1.5em;">💰</span>
                    <div>
                        <div style="font-weight: bold; color: #fff;">+${formatNumber(goldGain)} Ouro</div>
                        <div style="font-size: 0.75em; color: #888;">Recompensa de Ouro do Titã</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 68, 170, 0.08); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(255, 68, 170, 0.3);">
                    <span style="font-size: 1.6em; filter: drop-shadow(0 0 5px rgba(255, 68, 170, 0.5));">${itemIcon}</span>
                    <div>
                        <div style="font-weight: bold; color: #ff44aa;">${itemName} [Ancestral Exclusivo]</div>
                        <div style="font-size: 0.75em; color: #ff88cc;">Equipamento Supremo de ${bossName}!</div>
                    </div>
                </div>
                ${extraHtml}
                <div style="display: flex; align-items: center; gap: 15px; background: rgba(155, 89, 182, 0.08); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(155, 89, 182, 0.2);">
                    <span style="font-size: 1.5em;">${buff.icon || '⚡'}</span>
                    <div>
                        <div style="font-weight: bold; color: #d896ff;">${buff.name}</div>
                        <div style="font-size: 0.75em; color: #c080f0;">${buff.desc} (4 Horas de Duração)</div>
                    </div>
                </div>
            </div>
            
            <button onclick="document.getElementById('${modalId}').remove(); if(typeof updateUI==='function')updateUI(); if(typeof updateSidebarBuffs==='function')updateSidebarBuffs();" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ffd700, #b8860b); border: none; border-radius: 8px; color: #000; font-family: 'Outfit'; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3); font-size: 1.1em;">Reivindicar Recompensas</button>
        </div>
        
        <style>
            @keyframes scaleUp {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
    `;
    
    document.body.appendChild(overlay);
}

function applyOfflineWorldBossDamage() {
    if (gameState && gameState.isFightingWorldBoss && gameState.lastWorldBossTick) {
        const now = Date.now();
        const offlineSeconds = Math.floor((now - gameState.lastWorldBossTick) / 1000);
        if (offlineSeconds > 5) {
            const pDmg = calculatePlayerDamage();
            let totalDmg = 0;
            // Limita offline a 12 horas (43200 segundos) para evitar loops gigantescos
            const limitSeconds = Math.min(offlineSeconds, 43200);
            for (let i = 0; i < limitSeconds; i++) {
                let dmg = Math.floor(pDmg.min + Math.random() * (pDmg.max - pDmg.min + 1));
                if (Math.random() * 100 < pDmg.critChance) {
                    dmg = Math.floor(dmg * pDmg.critMult);
                }
                totalDmg += dmg;
            }
            if (totalDmg > 0) {
                accumulatedDamage += totalDmg;
                // Sincroniza imediatamente o dano offline
                syncWorldBossDamage();
                showNotification('⚔️ Dano Offline ao Titã!', `Você causou +${formatNumber(totalDmg)} de dano ao Chefe Global enquanto esteve fora!`, 'info');
            }
        }
        gameState.lastWorldBossTick = now;
    }
}

// ============================================
// FUNÇÕES ADMIN — CHEFES GLOBAIS
// ============================================

async function admRefreshWBStatus() {
    const el = document.getElementById('admWBStatus');
    if (!el) return;
    if (!window.FirebaseService) {
        el.innerHTML = '<span style="color:#ff6b6b;">Firebase não disponível.</span>';
        return;
    }
    el.innerHTML = 'Carregando...';
    try {
        const boss = currentWorldBoss;
        if (!boss) {
            el.innerHTML = '<span style="color:#aaa;">⏳ Nenhum chefe ativo no momento.</span>';
            return;
        }
        const hpPct = boss.maxHp > 0 ? ((boss.hp / boss.maxHp) * 100).toFixed(1) : 0;
        const status = boss.hp <= 0 ? '<span style="color:#ff4444;">💀 Derrotado</span>' : '<span style="color:#2ecc71;">⚡ Ativo</span>';
        el.innerHTML = `
            <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
                <span style="font-size:1.6em;">${boss.icon || '🐉'}</span>
                <div>
                    <div style="font-weight:bold; color:#fff;">${boss.name}</div>
                    <div>HP: <span style="color:#ff5555;">${formatNumber(Math.max(0, boss.hp))}</span> / <span style="color:#aaa;">${formatNumber(boss.maxHp)}</span> (${hpPct}%)</div>
                </div>
                <div style="margin-left:auto;">${status}</div>
            </div>
        `;
        const hpInput = document.getElementById('admWBHp');
        const maxHpInput = document.getElementById('admWBMaxHp');
        if (hpInput) hpInput.value = Math.max(0, boss.hp);
        if (maxHpInput) maxHpInput.value = boss.maxHp;
    } catch (e) {
        el.innerHTML = `<span style="color:#ff6b6b;">Erro: ${e.message}</span>`;
    }
}

async function admForceSpawnBoss() {
    if (!window.FirebaseService) return showNotification('❌ Erro', 'Firebase não disponível.', 'error');
    const select = document.getElementById('admWBSpawnSelect');
    const idx = parseInt(select?.value ?? '0');
    const boss = worldBossesList[idx];
    if (!boss) return;
    if (!confirm(`Forçar spawn de "${boss.name}"?\nIsso irá substituir o chefe atual.`)) return;
    try {
        await window.FirebaseService.adminForceSpawnBoss(boss);
        showNotification('✅ Spawn Forçado', `${boss.icon} ${boss.name} foi invocado!`, 'success');
        setTimeout(admRefreshWBStatus, 1500);
    } catch (e) {
        showNotification('❌ Erro', e.message, 'error');
    }
}

async function admSetBossHp() {
    if (!window.FirebaseService) return showNotification('❌ Erro', 'Firebase não disponível.', 'error');
    const hp = parseInt(document.getElementById('admWBHp')?.value);
    const maxHp = parseInt(document.getElementById('admWBMaxHp')?.value);
    if (isNaN(hp) || isNaN(maxHp) || maxHp <= 0) {
        return showNotification('❌ Erro', 'Informe HP e Max HP válidos.', 'error');
    }
    try {
        await window.FirebaseService.adminSetBossHp(hp, maxHp);
        showNotification('✅ HP Atualizado', `HP definido para ${formatNumber(hp)} / ${formatNumber(maxHp)}`, 'success');
        setTimeout(admRefreshWBStatus, 1000);
    } catch (e) {
        showNotification('❌ Erro', e.message, 'error');
    }
}

async function admKillBoss() {
    if (!window.FirebaseService) return showNotification('❌ Erro', 'Firebase não disponível.', 'error');
    if (!confirm('Encerrar o chefe atual? Isso zerará o HP e iniciará o cooldown de respawn.')) return;
    try {
        await window.FirebaseService.adminKillBoss();
        showNotification('💀 Chefe Encerrado', 'O chefe foi removido. Novo spawn em 2 minutos.', 'info');
        setTimeout(admRefreshWBStatus, 1000);
    } catch (e) {
        showNotification('❌ Erro', e.message, 'error');
    }
}

// Expõe globalmente para garantir acesso via onclick no HTML
window.admRefreshWBStatus = admRefreshWBStatus;
window.admForceSpawnBoss  = admForceSpawnBoss;
window.admSetBossHp       = admSetBossHp;
window.admKillBoss        = admKillBoss;