// ============================================
// INSPEÇÃO DE PERSONAGEM (RANKING GLOBAL)
// ============================================

// Helper para renderizar um slot de equipamento (exposto globalmente para tab switch)
window._renderEquipSlot = function(slotName, instanceId, snap) {
    const slotLabel = (typeof slotNames !== 'undefined') ? (slotNames[slotName] || slotName) : slotName;
    if (!instanceId || !snap.instances || !snap.instances[instanceId]) {
        return `<div class="inspect-equip-slot empty">
            <div class="inspect-slot-icon">❌</div>
            <div class="inspect-slot-label">${slotLabel}</div>
            <div class="inspect-slot-name">Vazio</div>
        </div>`;
    }

    const inst = snap.instances[instanceId];
    const baseId = inst.id || instanceId;
    const base = (typeof equipmentData !== 'undefined') ? equipmentData[baseId] : null;
    if (!base) {
        return `<div class="inspect-equip-slot empty">
            <div class="inspect-slot-icon">❌</div>
            <div class="inspect-slot-label">${slotLabel}</div>
            <div class="inspect-slot-name">Desconhecido</div>
        </div>`;
    }

    const quality = inst.quality || 'common';
    const color = (typeof rarityColors !== 'undefined') ? rarityColors[quality] || '#fff' : '#fff';
    const qualityName = (typeof rarityNames !== 'undefined') ? rarityNames[quality] || quality : quality;
    const rarityClass = 'rarity-' + quality + '-card';
    const icon = base.icon || '📦';
    const name = base.name || baseId;

    let statsHtml = '';
    if (base.stats) {
        statsHtml = Object.entries(base.stats).map(([statKey, baseVal]) => {
            const rolled = inst.statRolls && inst.statRolls[statKey] ? inst.statRolls[statKey] : 1;
            const finalVal = Math.round(baseVal * rolled);
            const statLabels = {
                strength: 'Força', defense: 'Defesa', maxHealth: 'Vida Máx',
                critChance: 'Crítico %', speedBonus: 'Velocidade', xpBonus: 'XP Bônus',
                armorPenetration: 'Penetração'
            };
            return `<div class="inspect-stat-row"><span>${statLabels[statKey] || statKey}</span><span>+${finalVal}</span></div>`;
        }).join('');
    }

    let elementHtml = '';
    if (inst.element) {
        const elIcon = inst.element === 'fire' ? '🔥' : inst.element === 'ice' ? '❄️' : inst.element === 'lightning' ? '⚡' : '✨';
        elementHtml = `<div class="inspect-element-badge" style="color:${inst.element === 'fire' ? '#ff4444' : inst.element === 'ice' ? '#44aaff' : inst.element === 'lightning' ? '#ffdd00' : '#aa88ff'}">${elIcon} ${inst.element}</div>`;
    }

    return `<div class="inspect-equip-slot filled ${rarityClass}" style="border-color:${color};">
        <div class="inspect-slot-icon">${icon}</div>
        <div class="inspect-slot-label">${slotLabel}</div>
        <div class="inspect-slot-name" style="color:${color};">${name}</div>
        <div class="inspect-slot-quality" style="color:${color};">${qualityName}</div>
        ${elementHtml}
        <div class="inspect-slot-stats">${statsHtml}</div>
    </div>`;
};

window.inspectCharacter = function(event, playerData) {
    if (event) event.stopPropagation();
    if (!playerData) return;

    const p = playerData;
    // Normaliza o snapshot: campos grandes podem vir como string JSON (para contornar limite de índices do Firestore)
    const rawSnap = p.charSnapshot || {};
    const snap = Object.assign({}, rawSnap, {
        instances:    typeof rawSnap.instancesJson    === 'string' ? JSON.parse(rawSnap.instancesJson)    : (rawSnap.instances    || {}),
        bestiary:     typeof rawSnap.bestiaryJson     === 'string' ? JSON.parse(rawSnap.bestiaryJson)     : (rawSnap.bestiary     || {}),
        achievements: typeof rawSnap.achievementsJson === 'string' ? JSON.parse(rawSnap.achievementsJson) : (rawSnap.achievements || {}),
        petLevels:    typeof rawSnap.petLevelsJson    === 'string' ? JSON.parse(rawSnap.petLevelsJson)    : (rawSnap.petLevels    || {})
    });

    // Fechar modal existente
    const oldModal = document.getElementById('inspectModal');
    if (oldModal) oldModal.remove();
    const oldOverlay = document.getElementById('inspectOverlay');
    if (oldOverlay) oldOverlay.remove();

    // Cache do snapshot para re-renderização nas abas
    window._lastInspectSnapshot = snap;

    // === Pre-computar conteúdo de cada aba ===

    // Equipamento
    function buildEquipTab() {
        const slots = ['helmet', 'amulet', 'weapon', 'armor', 'shield', 'ring', 'pants', 'boots'];
        const equipped = snap.equipped || {};
        return '<div class="inspect-equip-grid">' + slots.map(s => window._renderEquipSlot(s, equipped[s], snap)).join('') + '</div>';
    }

    // Bestiário
    function buildBestTab() {
        const bestiary = snap.bestiary || {};
        const entries = Object.values(bestiary);
        if (entries.length === 0) {
            return '<div class="inspect-empty-tab">📖 Nenhum inimigo registrado no bestiário.</div>';
        }
        entries.sort((a, b) => b.count - a.count);
        return entries.map(m => `
            <div class="inspect-bestiary-entry">
                <span class="inspect-bes-icon">${m.icon || '💀'}</span>
                <span class="inspect-bes-name">${m.name}</span>
                <span class="inspect-bes-count">${m.count} abates</span>
            </div>
        `).join('');
    }

    // Conquistas
    function buildAchTab() {
        const achData = snap.achievements || {};
        const total = typeof achievementsList !== 'undefined' ? achievementsList.length : 0;
        const unlocked = Object.keys(achData).filter(id => achData[id]).length;

        if (total === 0) {
            return '<div class="inspect-empty-tab">🏆 Nenhuma informação de conquistas disponível.</div>';
        }

        let html = `<div class="inspect-ach-summary">🏆 ${unlocked} / ${total} conquistas desbloqueadas</div>`;

        if (unlocked > 0 && typeof achievementsList !== 'undefined') {
            const unlockedAchs = achievementsList.filter(a => achData[a.id]);
            html += unlockedAchs.map(a => `
                <div class="inspect-ach-entry">
                    <span class="inspect-ach-icon">${a.icon}</span>
                    <div class="inspect-ach-info">
                        <div class="inspect-ach-name">${a.name}</div>
                        <div class="inspect-ach-bonus">${a.bonusLabel}</div>
                    </div>
                </div>
            `).join('');
        } else if (unlocked > 0) {
            html += `<div class="inspect-empty-tab">${unlocked} conquista(s) desbloqueada(s).</div>`;
        }

        return html;
    }

    // Mascotes
    function buildPetTab() {
        const petActive = snap.petActive;
        const petLevels = snap.petLevels || {};
        const ownedPets = (typeof pets !== 'undefined') ? pets : [];

        const activePet = ownedPets.find(p => p.id === petActive);
        let html = '';

        if (activePet) {
            const lvlData = petLevels[activePet.id] || { level: 1 };
            html += `<div class="inspect-pet-active">
                <span class="inspect-pet-icon-big">${activePet.icon}</span>
                <div class="inspect-pet-info">
                    <div class="inspect-pet-name">🐾 ${activePet.name} <span class="inspect-pet-level">Nv. ${lvlData.level}</span></div>
                    <div class="inspect-pet-desc">${activePet.description}</div>
                    <div class="inspect-pet-effect">✨ ${activePet.effectType === 'xpBoost' ? '+' + activePet.effectValue + '% XP' : activePet.effectType === 'combatBoost' ? '+' + activePet.effectValue + '% Combate' : '+' + activePet.effectValue + '%'}</div>
                </div>
            </div>`;
        } else {
            html += '<div class="inspect-empty-tab">🐾 Nenhum mascote ativo.</div>';
        }

        const otherPets = ownedPets.filter(p => p.id !== petActive && snap.petLevels && snap.petLevels[p.id]);
        if (otherPets.length > 0) {
            html += '<div class="inspect-pets-others-title">📋 Outros Mascotes:</div>';
            html += '<div class="inspect-pets-grid">';
            html += otherPets.map(p => {
                const lvlData = petLevels[p.id] || { level: 1 };
                return `<div class="inspect-pet-card">
                    <span class="inspect-pet-icon">${p.icon}</span>
                    <span class="inspect-pet-lvl">Nv. ${lvlData.level}</span>
                    <span class="inspect-pet-pname">${p.name}</span>
                </div>`;
            }).join('');
            html += '</div>';
        }

        return html;
    }

    // Skills compactas
    function buildSkillsBar() {
        if (!snap.skills) return '';
        const skillNames = {
            woodcutting: '🌲 Corte', mining: '⛏️ Mineração', fishing: '🎣 Pesca',
            herbalism: '🌿 Herbalismo', cooking: '🍳 Culinária', crafting: '🔨 Criação',
            smithing: '⚒️ Ferraria', enchanting: '✨ Encantamento', alchemy: '🧪 Alquimia'
        };
        return Object.entries(snap.skills).map(([k, v]) => {
            const name = skillNames[k] || k;
            return `<span class="inspect-skill-pill">${name} ${v.level || 0}</span>`;
        }).join('');
    }

    // Pre-computar conteúdo das abas
    const tabContents = {
        equip: buildEquipTab(),
        pets: buildPetTab(),
        achs: buildAchTab(),
        best: buildBestTab()
    };

    const cls = (typeof gameClasses !== 'undefined') ? gameClasses.find(c => c.id === snap.classId) : null;
    const className = cls ? cls.name : (p.class || 'Sem classe');
    const houseName = cls ? cls.house : (p.house || 'Sem Casa');
    const avatar = p.avatar || '⚔️';
    const level = p.level || 0;
    const gs = p.gearScore || 0;

    // === Montar o DOM ===
    const overlay = document.createElement('div');
    overlay.id = 'inspectOverlay';
    overlay.className = 'inspect-overlay';
    overlay.onclick = closeInspectModal;

    const modal = document.createElement('div');
    modal.id = 'inspectModal';
    modal.className = 'inspect-modal';

    modal.innerHTML = `
        <div class="inspect-header">
            <div class="inspect-header-left">
                <span class="inspect-avatar">${avatar}</span>
                <div class="inspect-hero-info">
                    <div class="inspect-hero-name">${p.name || 'Desconhecido'}</div>
                    <div class="inspect-hero-class">${className} · ${houseName}</div>
                    <div class="inspect-hero-levels">🏆 Nv. Total ${level}</div>
                </div>
            </div>
            <div class="inspect-header-right">
                <div class="inspect-gs-badge">⭐ GS ${gs}</div>
                <button class="inspect-close-btn" onclick="closeInspectModal()">✕</button>
            </div>
        </div>
        <div class="inspect-skills-bar">${buildSkillsBar()}</div>
        <div class="inspect-tabs">
            <button class="inspect-tab-btn active" data-tab="equip" onclick="switchInspectTab('equip')">⚔️ Equipamento</button>
            <button class="inspect-tab-btn" data-tab="pets" onclick="switchInspectTab('pets')">🐾 Mascotes</button>
            <button class="inspect-tab-btn" data-tab="achs" onclick="switchInspectTab('achs')">🏆 Conquistas</button>
            <button class="inspect-tab-btn" data-tab="best" onclick="switchInspectTab('best')">📖 Bestiário</button>
        </div>
        <div class="inspect-body" id="inspectBody">${tabContents.equip}</div>
    `;

    // Guardar conteúdos pré-computados no modal
    modal._tabContents = tabContents;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Animação de entrada — preservar o translate(-50%,-50%) do CSS para manter centralizado
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) translateY(0)';
    });
};

// Fechar modal
window.closeInspectModal = function() {
    const modal = document.getElementById('inspectModal');
    const overlay = document.getElementById('inspectOverlay');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) translateY(20px)';
        setTimeout(() => modal.remove(), 200);
    }
    if (overlay) setTimeout(() => overlay.remove(), 200);
};

// Trocar abas
window.switchInspectTab = function(tabId) {
    const modal = document.getElementById('inspectModal');
    if (!modal) return;

    modal.querySelectorAll('.inspect-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const body = modal.querySelector('.inspect-body');
    if (!body) return;

    const contents = modal._tabContents;
    if (contents && contents[tabId]) {
        body.innerHTML = contents[tabId];
    }
};
