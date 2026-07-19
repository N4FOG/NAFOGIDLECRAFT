        function updateCookingPage() {
            const container = document.getElementById('cookingRecipes');
            if (!container) return;

            container.innerHTML = '';
            const skillData = gameState.skills.cooking;

            cookingRecipes.forEach(recipe => {
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

                const isCrafting = gameState.craftingTimers[`cooking_${recipe.id}`] ? true : false;
                if (isCrafting) card.classList.add('crafting');

                const hasIngredients = gameState.inventory[recipe.input.type] >= recipe.input.qty;
                const totalItems = Object.values(gameState.inventory).filter(q => q > 0).length
                const hasSpace = totalItems < gameState.bankSlots ||
                    (gameState.inventory[recipe.output.type] > 0 && totalItems <= gameState.bankSlots);

                const canCraft = isUnlocked && hasIngredients && hasSpace && !isCrafting;

                let progressWidth = '0%';
                if (isCrafting) {
                    const timer = gameState.craftingTimers[`cooking_${recipe.id}`];
                    if (timer) {
                        const elapsed = Date.now() - timer.startTime;
                        const percent = Math.min((elapsed / (timer.craftTime * 1000)) * 100, 100);
                        progressWidth = percent + '%';
                    }
                }

                if (!isUnlocked) {
                    card.innerHTML = `
                        <div class="resource-lock">🔒</div>
                        <div class="recipe-name">
                            ${recipe.icon} ${recipe.name}
                            <span class="recipe-level-req">Nível ${recipe.levelReq}</span>
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
                            <span>❤️ Cura ${recipe.healAmount}</span>
                        </div>
                        <button class="craft-btn" disabled>🔒 Bloqueado</button>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="recipe-name">
                            ${recipe.icon} ${recipe.name}
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
                            <span>❤️ Cura ${recipe.healAmount}</span>
                        </div>
                        ${workerHtml}
                        <div class="craft-progress">
                            <div class="craft-progress-bar" id="progress_cooking_${recipe.id}" style="width: ${progressWidth}"></div>
                        </div>
                        <div class="craft-buttons-row" style="display: flex; gap: 8px; width: 100%; margin-top: 10px;">
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('cooking', '${recipe.id}', 1)"
                                    ${!canCraft ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Cozinhando...' : '🍳 Cozinhar (1)'}
                            </button>
                            <button class="craft-btn ${isCrafting ? 'crafting' : ''}" 
                                    onclick="startCrafting('cooking', '${recipe.id}', 'all')"
                                    ${!canCraft || maxQty <= 1 ? 'disabled' : ''}>
                                ${isCrafting ? '⏳ Cozinhando...' : `🍳 Todos (${maxQty})`}
                            </button>
                        </div>
                    `;
                }

                container.appendChild(card);
            });
        }
