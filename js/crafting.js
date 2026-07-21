        function updateCraftingPage() {
            const container = document.getElementById('craftingRecipes');
            if (!container) return;

            container.innerHTML = '';
            const skillData = gameState.skills.crafting;

            craftingRecipes.forEach(recipe => {
                const maxQty = Math.floor((gameState.inventory[recipe.input.type] || 0) / recipe.input.qty);
                const isUnlocked = skillData.level >= recipe.levelReq;
                const workerCount = gameState.workers?.allocated?.[recipe.id] || 0;
                const workerTotal = getWorkerTotal();
                const workerHtml = workerTotal > 0 ? `
                    <div class="worker-control" style="margin-top: 10px; display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <button class="worker-btn" onclick="allocateWorker('${recipe.id}', -1)" ${workerCount <= 0 ? 'disabled' : ''}>-</button>
                        <span class="worker-count" style="font-size: 0.9em; font-family:'Outfit', sans-serif;">👷 ${workerCount}</span>
                        <button class="worker-btn" onclick="allocateWorker('${recipe.id}', 1)" ${getWorkerFree() <= 0 ? 'disabled' : ''}>+</button>
                        <span class="worker-prod" style="font-size: 0.75em; color: #aaa; font-family:'Outfit', sans-serif;">
                            ${workerCount > 0 ? `Gasta: ${workerCount * recipe.input.qty}x/3s` : ''}
                        </span>
                        <button class="worker-btn" style="background:none;border:none;cursor:pointer;font-size:1.1em;padding:0;margin-left:5px;box-shadow:none;transition:transform 0.2s;" onclick="toggleWorkerNotification('${recipe.id}')" title="Alternar notificações">${(gameState.notificationFilters?.workers?.[recipe.id]) ? '🔕' : '🔔'}</button>
                    </div>
                ` : '';

                const card = document.createElement('div');
                card.className = `recipe-card ${isUnlocked ? 'unlocked' : 'locked'}`;

                const isCrafting = gameState.craftingTimers[`crafting_${recipe.id}`] ? true : false;
                if (isCrafting) card.classList.add('crafting');

                const hasIngredients = gameState.inventory[recipe.input.type] >= recipe.input.qty;
                const totalItems = Object.values(gameState.inventory).filter(q => q > 0).length
                const hasSpace = totalItems < gameState.bankSlots ||
                    (gameState.inventory[recipe.output.type] > 0 && totalItems <= gameState.bankSlots);

                const canCraft = isUnlocked && hasIngredients && hasSpace && !isCrafting;

                let progressWidth = '0%';
                if (isCrafting) {
                    const timer = gameState.craftingTimers[`crafting_${recipe.id}`];
                    if (timer) {
                        const elapsed = Date.now() - timer.startTime;
                        const percent = Math.min((elapsed / (timer.craftTime * 1000)) * 100, 100);
                        progressWidth = percent + '%';
                    }
                }

                const recipeIcon = recipe.image 
                    ? `<img src="${recipe.image}" style="width:48px;height:48px;vertical-align:middle;margin-right:8px;" onerror="this.style.display='none';this.nextSibling.style.display='inline';" /><span style="display:none;">${recipe.icon}</span>`
                    : recipe.icon;

                if (!isUnlocked) {
                    card.innerHTML = `
                        <div class="resource-lock">🔒</div>
                        <div class="recipe-name" style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;">
                            ${recipeIcon} ${recipe.name}
                            <span class="recipe-level-req" style="width:100%;text-align:center;margin-top:4px;">Nível ${recipe.levelReq}</span>
                        </div>
                        <div class="recipe-desc">${recipe.desc}</div>
                        <div class="recipe-ingredients">
                            <div class="ingredient-row">
                                <span class="ingredient-name">Requer:</span>
                                <span class="ingredient-qty">${recipe.input.qty}x ${getItemName(recipe.input.type)}</span>
                            </div>
                        </div>
                        <div class="recipe-result">
                            <span class="result-name">→ ${recipe.output.name}</span>
                            <span class="result-qty">+${recipe.output.qty}</span>
                        </div>
                        <div class="recipe-stats">
                            <span>🎯 ${recipe.xpGain} XP</span>
                            <span>💰 ${recipe.price} ouro</span>
                        </div>
                        <button class="craft-btn" disabled>🔒 Bloqueado</button>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="recipe-name" style="display:flex;align-items:center;justify-content:center;">
                            ${recipeIcon} ${recipe.name}
                        </div>
                        <div class="recipe-desc">${recipe.desc}</div>
                        <div class="recipe-ingredients">
                            <div class="ingredient-row">
                                <span class="ingredient-name">Requer:</span>
                                <span class="ingredient-qty">${recipe.input.qty}x ${getItemName(recipe.input.type)}</span>
                            </div>
                        </div>
                        <div class="recipe-result">
                            <span class="result-name">→ ${recipe.output.name}</span>
                            <span class="result-qty">+${recipe.output.qty}</span>
                        </div>
                        <div class="recipe-stats">
                            <span>🎯 ${recipe.xpGain} XP</span>
                            <span>💰 ${recipe.price} ouro</span>
                        </div>
                        ${workerHtml}
                        <div class="craft-progress">
                            <div class="craft-progress-bar" id="progress_crafting_${recipe.id}" style="width: ${progressWidth}"></div>
                        </div>
                        <div class="craft-buttons-row" style="display: flex; gap: 8px; width: 100%; margin-top: 10px;">
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('crafting', '${recipe.id}', 1)"
                                    ${!canCraft ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Criando...' : '🔨 Criar (1)'}
                            </button>
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('crafting', '${recipe.id}', 'all')"
                                    ${!canCraft || maxQty <= 1 ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Criando...' : `🔨 Todos (${maxQty})`}
                            </button>
                        </div>
                    `;
                }

                container.appendChild(card);
            });

            // Seção de equipamentos craftáveis (Criação)
            const equipSection = document.createElement('div');
            equipSection.style.cssText = 'grid-column:1/-1;margin-top:20px;';
            equipSection.innerHTML = `<div style="color:#ffd700;font-size:1.2em;font-weight:bold;margin-bottom:15px;border-bottom:1px solid #ffd700;padding-bottom:8px;">🎽 Craftar Equipamentos</div>`;
            const equipGrid = document.createElement('div');
            equipGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:15px;';

            craftingEquipRecipes.forEach(eq => {
                const isUnlocked = skillData.level >= eq.craftReq;
                const hasAll = eq.ingredients.every(ing => (gameState.inventory[ing.type] || 0) >= ing.qty);
                const inInv = gameState.equipment.inventory[eq.id] || 0;
                const card = document.createElement('div');
                card.className = `recipe-card ${isUnlocked ? 'unlocked' : ''}`;
                card.style.cssText = 'border-color:#4a5a6a;';
                const ingHtml = eq.ingredients.map(ing => {
                    const has = (gameState.inventory[ing.type] || 0) >= ing.qty;
                    return `<div style="color:${has ? '#4aff4a' : '#ff4444'}">${ing.qty}x ${getItemName(ing.type)}</div>`;
                }).join('');
                const equipIcon = eq.image 
                    ? `<img src="${eq.image}" style="width:48px;height:48px;vertical-align:middle;margin-right:8px;" onerror="this.style.display='none';this.nextSibling.style.display='inline';" /><span style="display:none;">${eq.icon}</span>`
                    : eq.icon;
                card.innerHTML = `
                    ${!isUnlocked ? '<div class="resource-lock">🔒</div>' : ''}
                    <div class="recipe-name" style="color:#fff;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;">${equipIcon} ${eq.name} <span class="recipe-level-req" style="width:100%;text-align:center;margin-top:4px;">Nv.${eq.craftReq}</span></div>
                    <div style="color:#888;font-size:0.8em;margin-bottom:8px;">[Básico] • ${slotNames[eq.slot]}</div>
                    <div class="recipe-desc">${eq.desc}</div>
                    <div style="color:#4aff4a;font-size:0.85em;margin:8px 0;">${formatStats(eq.stats)}</div>
                    <div class="recipe-ingredients">${ingHtml}</div>
                    <div style="color:#aaa;font-size:0.85em;margin-bottom:8px;">No inventário: <span style="color:#ffd700">${inInv}</span></div>
                    <button class="craft-btn" onclick="craftEquipment('${eq.id}')" ${!isUnlocked || !hasAll ? 'disabled' : ''}>
                        ${!isUnlocked ? '🔒 Bloqueado' : '🔨 Craftar'}
                    </button>`;
                equipGrid.appendChild(card);
            });

            equipSection.appendChild(equipGrid);
            container.appendChild(equipSection);
        }

