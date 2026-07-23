        // ============================================
        // SISTEMA DE MASMORRAS
        // ============================================
        const dungeonsData = [
            {
                id: 'caverna',
                name: 'Caverna dos Goblins',
                icon: '🕳️',
                desc: 'Uma caverna escura infestada de goblins e esqueletos.',
                reqLevel: 10,
                floors: 10,
                theme: '#4a6a3a',
                enemies: [
                    { name: 'Goblin Batedeiro', icon: '👺', hp: 20, dmg: 2, xp: 15, gold: 8 },
                    { name: 'Goblin Arqueiro',  icon: '🏹', hp: 25, dmg: 3, xp: 18, gold: 10 },
                    { name: 'Esqueleto',        icon: '💀', hp: 30, dmg: 4, xp: 22, gold: 12 },
                    { name: 'Goblin Guerreiro', icon: '⚔️', hp: 35, dmg: 4, xp: 25, gold: 14 },
                    { name: 'Esqueleto Mago',   icon: '🧙', hp: 28, dmg: 5, xp: 28, gold: 16 },
                ],
                boss: { name: 'Rei Goblin', icon: '👑', hp: 120, dmg: 8, xp: 150, gold: 80 },
                dropTable: ['weapon_copper', 'armor_copper', 'helmet_copper', 'shield_copper'],
                bossDropTable: ['weapon_iron', 'armor_iron', 'helmet_iron'],
            },
            {
                id: 'mina',
                name: 'Mina Amaldiçoada',
                icon: '⛏️',
                desc: 'Uma mina abandonada habitada por criaturas das profundezas.',
                reqLevel: 50,
                floors: 10,
                theme: '#6a5a3a',
                enemies: [
                    { name: 'Rato Gigante',    icon: '🐀', hp: 45, dmg: 6, xp: 35, gold: 18 },
                    { name: 'Toupeira Mutante',icon: '🦔', hp: 55, dmg: 7, xp: 40, gold: 22 },
                    { name: 'Golem de Pedra',  icon: '🪨', hp: 70, dmg: 8, xp: 50, gold: 28 },
                    { name: 'Mineiro Zumbi',   icon: '🧟', hp: 60, dmg: 9, xp: 55, gold: 30 },
                    { name: 'Elemental de Terra',icon:'🌍', hp: 65, dmg: 10, xp: 60, gold: 35 },
                ],
                boss: { name: 'Golem Ancião', icon: '⛰️', hp: 280, dmg: 18, xp: 350, gold: 200 },
                dropTable: ['weapon_iron', 'armor_iron', 'shield_iron', 'pants_iron'],
                bossDropTable: ['weapon_silver', 'armor_silver', 'helmet_iron'],
            },
            {
                id: 'floresta',
                name: 'Floresta Sombria',
                icon: '🌲',
                desc: 'Uma floresta encantada onde criaturas mágicas espreitam.',
                reqLevel: 120,
                floors: 10,
                theme: '#2a5a3a',
                enemies: [
                    { name: 'Lobo Sombrio',    icon: '🐺', hp: 80, dmg: 12, xp: 70, gold: 40 },
                    { name: 'Treant Corrompido',icon: '🌳', hp: 100, dmg: 10, xp: 75, gold: 45 },
                    { name: 'Fada Maligna',    icon: '🧚', hp: 65, dmg: 15, xp: 80, gold: 50 },
                    { name: 'Centauro Negro',  icon: '🐴', hp: 110, dmg: 13, xp: 85, gold: 55 },
                    { name: 'Druida Corrompido',icon:'🧙', hp: 90, dmg: 16, xp: 90, gold: 60 },
                ],
                boss: { name: 'Espírito da Floresta', icon: '🌿', hp: 500, dmg: 28, xp: 700, gold: 400 },
                dropTable: ['weapon_silver', 'armor_silver', 'ring_ebony', 'boots_oak'],
                bossDropTable: ['weapon_gold', 'armor_gold', 'amulet_rune'],
            },
            {
                id: 'castelo',
                name: 'Castelo dos Mortos',
                icon: '🏰',
                desc: 'Um castelo amaldiçoado onde os mortos não descansam.',
                reqLevel: 250,
                floors: 10,
                theme: '#4a2a5a',
                enemies: [
                    { name: 'Cavaleiro Morto-Vivo', icon: '💀', hp: 150, dmg: 20, xp: 120, gold: 70 },
                    { name: 'Vampiro Nobre',        icon: '🧛', hp: 130, dmg: 22, xp: 130, gold: 80 },
                    { name: 'Banshee',              icon: '👻', hp: 110, dmg: 25, xp: 140, gold: 85 },
                    { name: 'Lich Menor',           icon: '🦴', hp: 160, dmg: 23, xp: 150, gold: 90 },
                    { name: 'Gargoyle',             icon: '🗿', hp: 180, dmg: 21, xp: 145, gold: 88 },
                ],
                boss: { name: 'Lorde Vampiro', icon: '🧛‍♂️', hp: 900, dmg: 45, xp: 1200, gold: 700 },
                dropTable: ['weapon_gold', 'armor_gold', 'ring_ebony', 'pants_mithril'],
                bossDropTable: ['weapon_mithril', 'armor_mithril', 'amulet_dragon'],
            },
            {
                id: 'vulcao',
                name: 'Vulcão do Dragão',
                icon: '🌋',
                desc: 'O lar de dragões antigos e criaturas de fogo lendárias.',
                reqLevel: 450,
                floors: 10,
                theme: '#6a2a1a',
                enemies: [
                    { name: 'Salamandra de Lava', icon: '🦎', hp: 220, dmg: 30, xp: 200, gold: 120 },
                    { name: 'Elemental de Fogo',  icon: '🔥', hp: 200, dmg: 35, xp: 220, gold: 130 },
                    { name: 'Wyvern',             icon: '🐲', hp: 260, dmg: 32, xp: 240, gold: 140 },
                    { name: 'Dragão de Cinzas',   icon: '🐉', hp: 300, dmg: 38, xp: 280, gold: 160 },
                    { name: 'Titã de Magma',      icon: '🌋', hp: 280, dmg: 40, xp: 300, gold: 170 },
                ],
                boss: { name: 'Dragão Ancião', icon: '🐉', hp: 2000, dmg: 80, xp: 3000, gold: 1500 },
                dropTable: ['weapon_mithril', 'armor_mithril', 'ring_magic', 'boots_magic'],
                bossDropTable: ['weapon_mithril', 'armor_mithril', 'amulet_dragon', 'helmet_mithril'],
            },
        ];

        // Estado da batalha de masmorra
        let dungeonBattle = {
            active: false,
            dungeonId: null,
            floor: null,
            playerHP: 0,
            enemyHP: 0,
            enemyMaxHP: 0,
            enemy: null,
            interval: null,
        };

        function getTotalCombatLevel() {
            let total = 0;
            for (let s in gameState.skills) total += gameState.skills[s].level;
            return total;
        }

        function getDungeonProgress(dungeonId) {
            if (!gameState.dungeons[dungeonId]) gameState.dungeons[dungeonId] = { maxFloor: 0 };
            return gameState.dungeons[dungeonId];
        }

        function updateDungeonPage() {
            const list = document.getElementById('dungeonList');
            if (!list) return;
            list.innerHTML = '';
            const totalLevel = getTotalCombatLevel();

            dungeonsData.forEach(d => {
                const prog = getDungeonProgress(d.id);
                const locked = totalLevel < d.reqLevel;
                const pct = Math.round((prog.maxFloor / d.floors) * 100);

                const card = document.createElement('div');
                card.className = `dungeon-card ${locked ? 'locked' : ''} ${dungeonBattle.dungeonId === d.id ? 'selected' : ''}`;
                card.innerHTML = `
                    <div class="dungeon-card-header">
                        <span class="dungeon-card-icon">${d.icon}</span>
                        <div>
                            <div class="dungeon-card-name">${d.name}</div>
                            <div class="dungeon-card-req">${locked ? `🔒 Nível total ${d.reqLevel}` : `Andares: ${prog.maxFloor}/${d.floors}`}</div>
                        </div>
                    </div>
                    <div class="dungeon-progress-bar"><div class="dungeon-progress-fill" style="width:${pct}%"></div></div>
                    <div class="dungeon-progress-label">${locked ? 'Bloqueado' : prog.maxFloor >= d.floors ? '✅ Completo' : `${pct}% explorado`}</div>`;
                if (!locked) card.onclick = () => selectDungeon(d.id);
                list.appendChild(card);
            });
        }

        function selectDungeon(dungeonId) {
            if (dungeonBattle.active) return; // não troca durante batalha
            dungeonBattle.dungeonId = dungeonId;
            renderDungeonDetail(dungeonId);
            updateDungeonPage();
        }

        function renderDungeonDetail(dungeonId) {
            const detail = document.getElementById('dungeonDetail');
            if (!detail) return;
            const d = dungeonsData.find(x => x.id === dungeonId);
            if (!d) return;
            const prog = getDungeonProgress(dungeonId);

            // Grade de andares
            let floorsHtml = '';
            for (let f = 1; f <= d.floors; f++) {
                const isBoss    = f === d.floors;
                const cleared   = f <= prog.maxFloor;
                const locked    = f > prog.maxFloor + 1;
                const isActive  = dungeonBattle.active && dungeonBattle.floor === f && dungeonBattle.dungeonId === dungeonId;
                const cls = [
                    'floor-btn',
                    isBoss   ? 'boss-floor'   : '',
                    cleared  ? 'cleared'      : '',
                    locked   ? 'locked'       : '',
                    isActive ? 'active-floor' : '',
                ].filter(Boolean).join(' ');

                floorsHtml += `<div class="${cls}" onclick="enterFloor('${dungeonId}', ${f})">
                    <div class="floor-number">${isBoss ? '👑' : f}</div>
                    <div class="floor-icon">${isBoss ? d.boss.icon : cleared ? '✅' : locked ? '🔒' : '⚔️'}</div>
                    <div class="floor-status">${isBoss ? 'BOSS' : cleared ? 'Limpo' : locked ? '' : 'Entrar'}</div>
                </div>`;
            }

            // Preview de recompensas do próximo andar
            const nextFloor = prog.maxFloor + 1;
            const isBossFloor = nextFloor === d.floors;
            const enemyPool = isBossFloor ? [d.boss] : d.enemies;
            const sampleEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];

            detail.innerHTML = `
                <div class="dungeon-detail-header">
                    <span class="dungeon-detail-icon">${d.icon}</span>
                    <div>
                        <div class="dungeon-detail-title">${d.name}</div>
                        <div class="dungeon-detail-desc">${d.desc}</div>
                    </div>
                </div>
                <div class="floors-grid">${floorsHtml}</div>
                <div class="dungeon-rewards-preview">
                    <div class="dungeon-reward-item">⚔️ Próximo: <span>Andar ${Math.min(nextFloor, d.floors)}</span></div>
                    <div class="dungeon-reward-item">💰 Ouro: <span>~${isBossFloor ? d.boss.gold : Math.round(d.enemies.reduce((a,e)=>a+e.gold,0)/d.enemies.length)}</span></div>
                    <div class="dungeon-reward-item">📚 XP: <span>~${isBossFloor ? d.boss.xp : Math.round(d.enemies.reduce((a,e)=>a+e.xp,0)/d.enemies.length)}</span></div>
                    <div class="dungeon-reward-item">🎁 Drop: <span>${isBossFloor ? 'Garantido!' : '20% chance'}</span></div>
                </div>
                <div id="dungeonBattleArea"></div>`;

            if (dungeonBattle.active && dungeonBattle.dungeonId === dungeonId) {
                renderDungeonBattle();
            } else {
                renderDungeonIdleControls(dungeonId);
            }
        }

        function renderDungeonIdleControls(dungeonId) {
            const area = document.getElementById('dungeonBattleArea');
            if (!area) return;
            const d = dungeonsData.find(x => x.id === dungeonId);
            const prog = getDungeonProgress(dungeonId);
            const nextFloor = Math.min(prog.maxFloor + 1, d.floors);
            area.innerHTML = `
                <div class="dungeon-controls">
                    <button class="dungeon-btn enter" onclick="enterFloor('${dungeonId}', ${nextFloor})">
                        ⚔️ Entrar no Andar ${nextFloor}${nextFloor === d.floors ? ' (BOSS)' : ''}
                    </button>
                    ${prog.maxFloor > 0 ? `<button class="dungeon-btn flee" onclick="enterFloor('${dungeonId}', 1)">🔄 Reiniciar</button>` : ''}
                </div>`;
        }

        function renderDungeonBattle() {
            const area = document.getElementById('dungeonBattleArea');
            if (!area || !dungeonBattle.active) return;
            const d = dungeonsData.find(x => x.id === dungeonBattle.dungeonId);
            const isBoss = dungeonBattle.floor === d.floors;
            const maxHP = gameState.combat.maxPlayerHealth;

            area.innerHTML = `
                <div class="dungeon-battle-area">
                    <div class="dungeon-battle-title">
                        <span>${isBoss ? '👑 BOSS — ' : ''}Andar ${dungeonBattle.floor}</span>
                        <span style="color:#aaa;font-size:0.85em;">${dungeonBattle.enemy.name}</span>
                    </div>
                    <div class="dungeon-combatants">
                        <div class="dungeon-fighter">
                            <div class="dungeon-fighter-icon">${gameState.player?.avatar || '🧙'}</div>
                            <div class="dungeon-fighter-name">${gameState.player?.name || 'Herói'}</div>
                            <div class="dungeon-hp-bar">
                                <div class="dungeon-hp-fill player" id="dPlayerBar" style="width:${(dungeonBattle.playerHP/maxHP*100)}%"></div>
                                <div class="dungeon-hp-text" id="dPlayerText">${dungeonBattle.playerHP}/${maxHP}</div>
                            </div>
                        </div>
                        <div class="dungeon-vs">VS</div>
                        <div class="dungeon-fighter">
                            <div class="dungeon-fighter-icon">${dungeonBattle.enemy.icon}</div>
                            <div class="dungeon-fighter-name">${dungeonBattle.enemy.name}</div>
                            <div class="dungeon-hp-bar">
                                <div class="dungeon-hp-fill enemy" id="dEnemyBar" style="width:100%"></div>
                                <div class="dungeon-hp-text" id="dEnemyText">${dungeonBattle.enemyHP}/${dungeonBattle.enemyMaxHP}</div>
                            </div>
                        </div>
                    </div>
                    <div class="dungeon-log" id="dungeonLog"></div>
                    <div class="dungeon-controls">
                        <button class="dungeon-btn flee" onclick="fleeDungeon()">🏃 Fugir</button>
                    </div>
                </div>`;
        }

        function dungeonLog(msg, cls = 'info') {
            const log = document.getElementById('dungeonLog');
            if (!log) return;
            const el = document.createElement('div');
            el.className = `dlog ${cls}`;
            el.textContent = msg;
            log.appendChild(el);
            log.scrollTop = log.scrollHeight;
        }

        function updateDungeonBars() {
            const maxHP = gameState.combat.maxPlayerHealth;
            const pb = document.getElementById('dPlayerBar');
            const pt = document.getElementById('dPlayerText');
            const eb = document.getElementById('dEnemyBar');
            const et = document.getElementById('dEnemyText');
            if (pb) pb.style.width = Math.max(0, dungeonBattle.playerHP / maxHP * 100) + '%';
            if (pt) pt.textContent = `${Math.max(0, dungeonBattle.playerHP)}/${maxHP}`;
            if (eb) eb.style.width = Math.max(0, dungeonBattle.enemyHP / dungeonBattle.enemyMaxHP * 100) + '%';
            if (et) et.textContent = `${Math.max(0, dungeonBattle.enemyHP)}/${dungeonBattle.enemyMaxHP}`;
        }

        function enterFloor(dungeonId, floor) {
            if (dungeonBattle.active) return;
            const d = dungeonsData.find(x => x.id === dungeonId);
            if (!d) return;
            const prog = getDungeonProgress(dungeonId);
            if (floor > prog.maxFloor + 1) return; // andar bloqueado

            const isBoss = floor === d.floors;
            const enemy  = isBoss ? { ...d.boss } : { ...d.enemies[Math.floor(Math.random() * d.enemies.length)] };

            // Escalar inimigo pelo andar
            const scale = 1 + (floor - 1) * 0.15;
            enemy.hp  = Math.floor(enemy.hp  * scale);
            enemy.dmg = Math.floor(enemy.dmg * scale);

            dungeonBattle = {
                active: true,
                dungeonId,
                floor,
                playerHP: gameState.combat.maxPlayerHealth,
                enemyHP: enemy.hp,
                enemyMaxHP: enemy.hp,
                enemy,
                interval: null,
                hasRevived: false
            };

            renderDungeonDetail(dungeonId);
            dungeonLog(`⚔️ Entrando no Andar ${floor}${isBoss ? ' — BOSS!' : ''}...`, isBoss ? 'boss' : 'info');
            dungeonLog(`Inimigo: ${enemy.icon} ${enemy.name} (${enemy.hp} HP)`, 'info');

            const dungTimeMult = window.balancingConfig?.dungeonTimeMult || 1.0;
            const intervalMs = Math.max(200, Math.floor(1000 * dungTimeMult));
            dungeonBattle.interval = setInterval(() => {
                if (!dungeonBattle.active) { clearInterval(dungeonBattle.interval); return; }

                const equipBonuses = getEquipmentBonuses();

                // Jogador ataca
                let dmg = Math.floor(Math.random() * gameState.combat.playerStrength) + 3;
                // Óleo de Fogo
                const combatMult = 1 + applyPotionEffects('combatMult') / 100;
                dmg = Math.floor(dmg * combatMult);

                const petMult = applyPetBonus('combat', 'combatBoost');
                dmg = Math.floor(dmg * petMult);
                const classCombat = getClassPassive('combatBoost');
                if (classCombat > 0) dmg = Math.floor(dmg * (1 + classCombat / 100));
                if (window.getWorldBossBuffBonus) dmg = Math.floor(dmg * (1 + window.getWorldBossBuffBonus()));
                dmg += Math.floor(applyPotionEffects('strength'));

                const critChance = applyTechBonus('criticalChance') + (equipBonuses.critChance || 0) + applyPotionEffects('luck') + getClassPassive('critChance');
                let isCrit = false;
                if (Math.random() * 100 < critChance) { 
                    const critDamageBonus = equipBonuses.critDamage || 0;
                    dmg = Math.floor(dmg * (2 + critDamageBonus / 100)); 
                    isCrit = true; 
                }
                dmg = Math.max(1, dmg);

                dungeonBattle.enemyHP -= dmg;
                dungeonLog(`${isCrit ? '💥 CRÍTICO! ' : ''}Você causou ${dmg} de dano a ${dungeonBattle.enemy.name}`, isCrit ? 'crit' : 'hit');

                // Runa do Trovão
                const thunderChance = equipBonuses.thunderChance || 0;
                let thunderDmg = 0;
                if (thunderChance > 0 && Math.random() * 100 < thunderChance) {
                    thunderDmg = Math.floor(dmg * 0.50);
                    dungeonBattle.enemyHP -= thunderDmg;
                    dungeonLog(`⚡ Dano Elétrico: +${thunderDmg} dano elétrico extra!`, 'crit');
                }

                // Vampirismo + Óleo de Veneno + Runa do Vampiro
                const lifesteal = applyTechBonus('lifesteal') + applyPotionEffects('lifesteal_pot') + (equipBonuses.lifesteal || 0);
                if (lifesteal > 0) {
                    const heal = Math.max(1, Math.floor(dmg * (lifesteal / 100)));
                    dungeonBattle.playerHP = Math.min(gameState.combat.maxPlayerHealth, dungeonBattle.playerHP + heal);
                    dungeonLog(`🩸 Vampirismo: +${heal} de vida recuperada!`, 'heal');
                }

                updateDungeonBars();

                // Inimigo morreu
                if (dungeonBattle.enemyHP <= 0) {
                    clearInterval(dungeonBattle.interval);
                    dungeonBattle.active = false;

                    const rewardMult = window.balancingConfig?.dungeonRewardMult || 1.0;
                    const goldMult = 1 + (applyPotionEffects('goldBoost') + getClassPassive('goldBoost')) / 100;
                    let gold = Math.floor(dungeonBattle.enemy.gold * goldMult * rewardMult);
                    if (window.getWorldBossBuffBonus) gold = Math.floor(gold * (1 + window.getWorldBossBuffBonus()));
                    const xpGain = Math.floor((dungeonBattle.enemy.xp || 20) * rewardMult);
                    gameState.gold += gold;
                    addXP('woodcutting', Math.floor(xpGain / 3));
                    addXP('mining',      Math.floor(xpGain / 3));
                    addXP('fishing',     Math.floor(xpGain / 3));

                    dungeonLog(`✅ ${dungeonBattle.enemy.name} derrotado! +${gold}💰 +${xpGain}XP`, 'reward');

                    // Drop de equipamento
                    const isBossFloor = floor === d.floors;
                    const dropPool = isBossFloor ? d.bossDropTable : d.dropTable;
                    const chestDropMult = window.balancingConfig?.dungeonChestDropMult || 1.0;
                    const lootLuckBonus = (equipBonuses.lootLuck || 0) / 100;
                    const dropChance = Math.min(1.0, ((isBossFloor ? 1.0 : 0.20) * chestDropMult) + lootLuckBonus);
                    if (Math.random() < dropChance) {
                        const dropId = dropPool[Math.floor(Math.random() * dropPool.length)];
                        const dropEq = equipmentData[dropId];
                        if (dropEq) {
                            const finalId = addNewEquipmentToInventory(dropId);
                            const hasSlots = finalId.startsWith('inst_');
                            dungeonLog(`🎁 Drop: ${dropEq.icon} ${dropEq.name}${hasSlots ? ' (2 Slots)' : ''}!`, 'reward');
                            showNotification('🎁 Drop!', `${dropEq.icon} ${dropEq.name}${hasSlots ? ' (2 Slots)' : ''} encontrado na masmorra!`, 'success', dropEq.icon);
                        }
                    }

                    // Avançar progresso
                    const prog = getDungeonProgress(dungeonId);
                    if (floor > prog.maxFloor) prog.maxFloor = floor;

                    if (isBossFloor) {
                        dungeonLog(`🏆 MASMORRA COMPLETA! Parabéns!`, 'boss');
                        showNotification('🏆 Masmorra!', `${d.name} conquistada!`, 'success', d.icon);
                    }

                    // Restaurar HP do jogador para o próximo andar (parcialmente)
                    gameState.combat.playerHealth = dungeonBattle.playerHP;

                    updateUI();
                    setTimeout(() => renderDungeonDetail(dungeonId), 500);
                    return;
                }

                // Inimigo ataca
                const rawDmg = Math.floor(Math.random() * dungeonBattle.enemy.dmg) + 2;
                const defense = equipBonuses.defense || 0;
                const finalDmg = Math.max(1, rawDmg - Math.floor(defense / 3));
                dungeonBattle.playerHP -= finalDmg;
                const blockedMsg = defense > 0 ? ` (${rawDmg - finalDmg} bloqueado)` : '';
                dungeonLog(`💔 ${dungeonBattle.enemy.name} causou ${finalDmg} de dano${blockedMsg}`, 'hit');

                updateDungeonBars();

                // Jogador morreu na masmorra
                if (dungeonBattle.playerHP <= 0) {
                    const phoenixCount = equipBonuses.phoenix || 0;
                    if (phoenixCount > 0 && !dungeonBattle.hasRevived) {
                        dungeonBattle.hasRevived = true;
                        const reviveHP = Math.floor(gameState.combat.maxPlayerHealth * 0.20);
                        dungeonBattle.playerHP = reviveHP;
                        dungeonLog(`🔥 Runa do Fênix: Você ressuscitou com ${reviveHP} HP!`, 'heal');
                        showNotification('🔥 Runa do Fênix!', `Você ressuscitou com ${reviveHP}❤️ de vida!`, 'success', '🔥');
                        updateDungeonBars();
                    } else {
                        clearInterval(dungeonBattle.interval);
                        dungeonBattle.active = false;
                        dungeonBattle.playerHP = 0;
                        dungeonLog(`💀 Você foi derrotado no Andar ${floor}!`, 'boss');
                        showNotification('💀 Derrota!', `Derrotado no Andar ${floor} de ${d.name}.`, 'error', '💀');
                        gameState.combat.playerHealth = Math.floor(gameState.combat.maxPlayerHealth * 0.3);
                        updateUI();
                        setTimeout(() => renderDungeonDetail(dungeonId), 500);
                    }
                }
            }, 1200);
        }

        function fleeDungeon() {
            if (!dungeonBattle.active) return;
            clearInterval(dungeonBattle.interval);
            const dungeonId = dungeonBattle.dungeonId;
            dungeonBattle.active = false;
            gameState.combat.playerHealth = Math.max(1, dungeonBattle.playerHP);
            showNotification('🏃 Fugiu!', 'Você escapou da masmorra.', 'info', '🏃');
            updateUI();
            setTimeout(() => renderDungeonDetail(dungeonId), 300);
        }
