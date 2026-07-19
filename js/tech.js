        // ============================================
        // FUNÇÕES DE TECNOLOGIA
        // ============================================
        function buyTechUpgrade(categoryId, upgradeId) {
            const category = gameState.techTree[categoryId];
            const upgrade = category.upgrades.find(u => u.id === upgradeId);
            if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return;
            if (upgrade.required) {
                const req = category.upgrades.find(u => u.id === upgrade.required);
                if (!req || req.currentLevel === 0) { showNotification('❌ Requisito!', `Precisa de ${req.name} primeiro.`, 'error'); return; }
            }
            const cost = upgrade.cost * (upgrade.currentLevel + 1);
            if (gameState.gold < cost) { showNotification('❌ Ouro insuficiente!', `Precisa de ${cost} ouro.`, 'error'); return; }
            gameState.gold -= cost;
            upgrade.currentLevel++;
            showNotification('🔬 Tecnologia!', `${upgrade.name} nível ${upgrade.currentLevel}!`, 'success');
            updateUI();
            updateTechTreePage();
        }

        function applyTechBonus(type, skill = null) {
            const g = gameState.techTree.gathering.upgrades;
            const c = gameState.techTree.combat.upgrades;
            const cr = gameState.techTree.crafting.upgrades;
            const al = gameState.techTree.alchemy.upgrades;

            // COLETA
            if (type === 'xpBoost' && (skill === 'woodcutting' || skill === 'mining' || skill === 'fishing')) {
                const u = g.find(u => u.id === 'efficiency1');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // retorna % extra
            }
            if (type === 'doubleChance' && (skill === 'woodcutting' || skill === 'mining' || skill === 'fishing')) {
                const u = g.find(u => u.id === 'double1');
                if (u && u.currentLevel > 0) return (u.effectValue * u.currentLevel) / 100;
            }
            if (type === 'autoSpeed') {
                const u = g.find(u => u.id === 'autospeed1');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // segundos a reduzir
            }

            // COMBATE
            if (type === 'criticalChance') {
                const u = c.find(u => u.id === 'critical1');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % chance
            }
            if (type === 'lifesteal') {
                const u = c.find(u => u.id === 'vampirism');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % do dano curado
            }
            if (type === 'healthBoost') {
                const u = c.find(u => u.id === 'durability');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % de vida extra
            }

            // CRAFT
            if (type === 'costReduction') {
                const u = cr.find(u => u.id === 'materialEfficiency');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % de chance de não consumir material
            }
            if (type === 'craftSpeed') {
                const u = cr.find(u => u.id === 'craftSpeed');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % de redução de tempo
            }
            if (type === 'valueBoost') {
                const u = cr.find(u => u.id === 'masterCraft');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % de chance de craftar 2x
            }

            // ALQUIMIA
            if (type === 'potionDuration') {
                const u = al.find(u => u.id === 'potionMaster1');
                if (u && u.currentLevel > 0) return (u.effectValue * u.currentLevel) / 100;
            }
            if (type === 'potionPower') {
                const u = al.find(u => u.id === 'potionPower1');
                if (u && u.currentLevel > 0) return u.effectValue * u.currentLevel; // % extra no efeito
            }
            if (type === 'doublePotion') {
                const u = al.find(u => u.id === 'doublePotion');
                if (u && u.currentLevel > 0) return (u.effectValue * u.currentLevel) / 100;
            }

            return 0;
        }
