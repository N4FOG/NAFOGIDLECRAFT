        function updateCraftingPage() {
            const container = document.getElementById('craftingRecipes');
            if (!container) return;

            if (!gameState.craftingMainFilter) gameState.craftingMainFilter = 'recipes';
            if (!gameState.craftingSlotFilter) gameState.craftingSlotFilter = 'all';

            const mainCategory = gameState.craftingMainFilter;
            const slotFilter = gameState.craftingSlotFilter;

            container.innerHTML = '';
            const skillData = gameState.skills.crafting;

            // Injetar barra de sub-filtros da Criação (Receitas vs Equipamentos)
            const subFiltersDiv = document.createElement('div');
            subFiltersDiv.style.cssText = 'grid-column: 1 / -1; margin-bottom: 20px; width: 100%; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid #3a4a5a;';
            
            let slotButtonsHtml = '';
            if (mainCategory === 'equip') {
                const slots = [
                    { id: 'all', label: 'Todos', count: craftingEquipRecipes.length },
                    { id: 'weapon', label: '⚔️ Armas', count: craftingEquipRecipes.filter(e => e.slot === 'weapon').length },
                    { id: 'helmet', label: '🪖 Capacetes', count: craftingEquipRecipes.filter(e => e.slot === 'helmet').length },
                    { id: 'armor', label: '🛡️ Armaduras', count: craftingEquipRecipes.filter(e => e.slot === 'armor').length },
                    { id: 'shield', label: '🔰 Escudos', count: craftingEquipRecipes.filter(e => e.slot === 'shield').length },
                    { id: 'boots', label: '🥾 Botas', count: craftingEquipRecipes.filter(e => e.slot === 'boots').length },
                    { id: 'ring', label: '💍 Anéis', count: craftingEquipRecipes.filter(e => e.slot === 'ring').length },
                    { id: 'amulet', label: '📿 Amuletos', count: craftingEquipRecipes.filter(e => e.slot === 'amulet').length }
                ];
                slotButtonsHtml = `
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                        ${slots.map(s => `
                            <button class="arena-tab-btn ${slotFilter === s.id ? 'active' : ''}" onclick="setCraftingSlotFilter('${s.id}')" style="padding: 6px 14px; font-size: 0.85em; border-radius: 6px; cursor: pointer;">
                                ${s.label} (${s.count})
                            </button>
                        `).join('')}
                    </div>
                `;
            }

            subFiltersDiv.innerHTML = `
                <div style="display: flex; gap: 10px;">
                    <button class="arena-tab-btn ${mainCategory === 'recipes' ? 'active' : ''}" onclick="setCraftingMainFilter('recipes')" style="flex: 1; padding: 10px; font-weight: bold; border-radius: 8px;">🔨 Receitas de Criação (${craftingRecipes.length})</button>
                    <button class="arena-tab-btn ${mainCategory === 'equip' ? 'active' : ''}" onclick="setCraftingMainFilter('equip')" style="flex: 1; padding: 10px; font-weight: bold; border-radius: 8px;">🎽 Equipamentos (${craftingEquipRecipes.length})</button>
                </div>
                ${slotButtonsHtml}
            `;
            container.appendChild(subFiltersDiv);

            if (mainCategory === 'recipes') {
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
                    const totalItems = Object.values(gameState.inventory).filter(q => q > 0).length;
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
            } else if (mainCategory === 'equip') {
                const filteredEquip = craftingEquipRecipes.filter(eq => {
                    if (slotFilter === 'all') return true;
                    return eq.slot === slotFilter;
                });

                if (filteredEquip.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; color: #aaa; padding: 30px; font-size: 1.1em; border: 1px dashed #4a5a6a; border-radius: 8px;';
                    emptyMsg.textContent = 'Nenhum equipamento craftável disponível para este slot no momento.';
                    container.appendChild(emptyMsg);
                } else {
                    filteredEquip.forEach(eq => {
                        const isUnlocked = skillData.level >= eq.craftReq;
                        const hasAll = eq.ingredients.every(ing => (gameState.inventory[ing.type] || 0) >= ing.qty);
                        const workerCount = gameState.workers?.allocated?.[eq.id] || 0;
                        const workerTotal = getWorkerTotal();
                        const workerHtml = (workerTotal > 0 && isUnlocked) ? `
                            <div class="worker-control" style="margin-top: 10px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; justify-content: center;">
                                <button class="worker-btn" onclick="allocateWorker('${eq.id}', -1)" ${workerCount <= 0 ? 'disabled' : ''}>-</button>
                                <span class="worker-count" style="font-size: 0.9em; font-family:'Outfit', sans-serif;">👷 ${workerCount}</span>
                                <button class="worker-btn" onclick="allocateWorker('${eq.id}', 1)" ${getWorkerFree() <= 0 ? 'disabled' : ''}>+</button>
                                <button class="worker-btn" style="background:none;border:none;cursor:pointer;font-size:1.1em;padding:0;margin-left:5px;box-shadow:none;transition:transform 0.2s;" onclick="toggleWorkerNotification('${eq.id}')" title="Alternar notificações">${(gameState.notificationFilters?.workers?.[eq.id]) ? '🔕' : '🔔'}</button>
                            </div>
                        ` : '';

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
                            <div style="color:#888;font-size:0.8em;margin-bottom:8px;">[Básico] • ${slotNames[eq.slot] || eq.slot}</div>
                            <div class="recipe-desc">${eq.desc}</div>
                            <div style="color:#4aff4a;font-size:0.85em;margin:8px 0;">${formatStats(eq.stats)}</div>
                            <div class="recipe-ingredients">${ingHtml}</div>
                            ${workerHtml}
                            <button class="craft-btn" onclick="craftEquipment('${eq.id}')" ${!isUnlocked || !hasAll ? 'disabled' : ''}>
                                ${!isUnlocked ? '🔒 Bloqueado' : '🔨 Craftar'}
                            </button>`;
                        container.appendChild(card);
                    });
                }
            }
        }

        // Handlers de Filtro para Criação
        function setCraftingMainFilter(filter) {
            gameState.craftingMainFilter = filter;
            updateCraftingPage();
        }

        function setCraftingSlotFilter(slot) {
            gameState.craftingSlotFilter = slot;
            updateCraftingPage();
        }

