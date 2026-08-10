/**
 * ============================================
 * HUD EDIT MODE - Editor de HUD RPG Moderno
 * ============================================
 * 
 * Novas Funcionalidades:
 * - Smart Alignment Lines: Linhas guias magnéticas fluorescentes em tempo real (ciano/magenta)
 * - Painel em Árvore Expansível: Lista hierárquica sanfonada no painel lateral com sub-elementos agrupados
 * - Pausa Automática do Jogo (isGamePausedForEditor = true)
 * - Z-index elevado (99940+) e rAF loop contínuo
 * - 5 Containers HUD Principais isolados
 * - Toggles Granulares: [🖐️ Mover], [📐 Redimensionar], [🧲 Grade]
 * - Presets Prontos (Padrão, Mobile, Imersivo, Combate)
 * - Persistência em localStorage ('idleCraftHUDConfig')
 */

const LayoutEditor = (function() {
    'use strict';

    // ==========================================
    // ESTADO E CONFIGURAÇÃO
    // ==========================================
    const _state = {
        active: false,
        selectedId: null,
        selectedEl: null,
        dragging: false,
        resizing: false,
        resizeHandle: null,
        allowDrag: true,       // Permite/bloqueia arraste livre
        allowResize: true,     // Permite/bloqueia alças de redimensionamento
        gridSnap: true,        // Permite/bloqueia alinhamento magnético
        gridSize: 20,
        animFrameId: null
    };

    let _history = [];
    let _historyIndex = -1;
    const MAX_HISTORY = 30;

    let _gridOverlay = null;
    let _toolbar = null;
    let _sidePanel = null;
    let _selectionBox = null;
    let _helpOverlay = null;

    let _guideContainer = null;
    let _guideHLine = null;
    let _guideVLine = null;

    let _registeredWidgets = {};
    let _expandedNodes = { 'topStatsBar': true, 'gameSidebar': true, 'gameContentArea': true };
    let _bound = false;
    let _initialized = false;

    // Estrutura em Árvore Hierárquica dos Containers e Sub-elementos
    const WIDGET_TREE = [
        {
            id: 'topStatsBar',
            label: '📊 Barra Superior',
            icon: '📊',
            children: [
                { id: 'topResContainer', label: '🌲 Estoque de Recursos', selector: '.top-bar-resources' },
                { id: 'topWorkersContainer', label: '👷 Trabalhadores Alocados', selector: '.top-bar-item' },
                { id: 'topForgeContainer', label: '🔥 Fornalha & Calor', selector: '.furnace-info' }
            ]
        },
        {
            id: 'gameSidebar',
            label: '📋 Menu Lateral',
            icon: '📋',
            children: [
                { id: 'playerInfoBar', label: '👤 Perfil do Jogador', selector: '#playerInfoBar' },
                { id: 'sidebarStats', label: '📈 Status & Atributos', selector: '#sidebarStats' },
                { id: 'sidebarQuickLinks', label: '🔗 Atalhos Rápidos', selector: '#sidebarQuickLinks' }
            ]
        },
        {
            id: 'gameContentArea',
            label: '📄 Janela de Conteúdo',
            icon: '🎮',
            children: [
                { id: 'inventorySection', label: '🎒 Mochila & Inventário', selector: '#inventoryPage' },
                { id: 'craftingSection', label: '🔨 Telas de Profissões', selector: '#craftingPage' }
            ]
        },
        {
            id: 'globalActiveBuffs',
            label: '⚡ Barra de Buffs',
            icon: '✨'
        },
        {
            id: 'notificationArea',
            label: '🔔 Área de Notificações',
            icon: '🔔'
        }
    ];

    function _clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ==========================================
    // PERSISTÊNCIA (LOCAL STORAGE LIMPO)
    // ==========================================
    function _getSavedConfig() {
        try {
            const raw = localStorage.getItem('idleCraftHUDConfig');
            if (!raw) return { widgets: {}, options: {} };
            const parsed = JSON.parse(raw);
            return {
                widgets: parsed.widgets || {},
                options: parsed.options || {},
                preset: parsed.preset || 'default'
            };
        } catch(e) {
            return { widgets: {}, options: {} };
        }
    }

    function _setSavedConfig(config) {
        try {
            localStorage.setItem('idleCraftHUDConfig', JSON.stringify(config));
        } catch(e) {
            console.warn('[LayoutEditor] Falha ao salvar HUD:', e);
        }
    }

    // ==========================================
    // HISTÓRICO (UNDO / REDO)
    // ==========================================
    function _saveSnapshot() {
        const config = _getSavedConfig();
        const snapshot = JSON.parse(JSON.stringify(config));
        _historyIndex++;
        _history.splice(_historyIndex);
        _history.push(snapshot);
        if (_history.length > MAX_HISTORY) {
            _history.shift();
            _historyIndex--;
        }
    }

    function _restoreSnapshot(snapshot) {
        _setSavedConfig(snapshot);
        _applyConfigToAll(snapshot);
        _updateSidePanel();
        _updateSelectionBox();
    }

    function _undo() {
        if (_historyIndex <= 0) return;
        _historyIndex--;
        _restoreSnapshot(_history[_historyIndex]);
        _notify('↩ Desfeito', 'info');
    }

    function _redo() {
        if (_historyIndex >= _history.length - 1) return;
        _historyIndex++;
        _restoreSnapshot(_history[_historyIndex]);
        _notify('↪ Refito', 'info');
    }

    // ==========================================
    // REGISTRO DE WIDGETS
    // ==========================================
    function _registerWidgets() {
        _registeredWidgets = {};

        WIDGET_TREE.forEach(def => {
            const el = document.getElementById(def.id);
            if (el) {
                el.classList.add('hud-widget-root');
                el.setAttribute('data-hud-label', def.label);
                _registeredWidgets[def.id] = {
                    el: el,
                    label: def.label,
                    icon: def.icon,
                    children: def.children || []
                };
            }
        });
    }

    // ==========================================
    // APLICAR CONFIGURAÇÕES AOS WIDGETS
    // ==========================================
    function _applyConfigToAll(config) {
        const widgets = (config && config.widgets) || {};

        Object.keys(_registeredWidgets).forEach(id => {
            const w = _registeredWidgets[id];
            if (!w || !w.el) return;
            const el = w.el;
            const cfg = widgets[id] || {};

            const posX = cfg.x || 0;
            const posY = cfg.y || 0;
            const scale = cfg.scale !== undefined ? cfg.scale : 1;
            const opacity = cfg.opacity !== undefined ? cfg.opacity : 1;

            if (posX !== 0 || posY !== 0 || scale !== 1) {
                el.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
                el.style.transformOrigin = 'top left';
            } else {
                el.style.transform = '';
            }

            if (opacity !== 1) {
                el.style.opacity = opacity;
            } else {
                el.style.opacity = '';
            }

            if (cfg.hidden === true) {
                if (_state.active) {
                    el.style.opacity = '0.3';
                    el.classList.add('hud-widget-hidden');
                } else {
                    el.style.display = 'none';
                    el.classList.remove('hud-widget-hidden');
                }
            } else if (cfg.hidden === false) {
                el.classList.remove('hud-widget-hidden');
                if (!_state.active) {
                    el.style.display = '';
                }
            } else {
                el.classList.remove('hud-widget-hidden');
            }
        });

        _updateSelectionBox();
    }

    // ==========================================
    // INTERFACE DE EDIÇÃO (TOOLBAR, PAINEL, ALÇAS, LINHAS)
    // ==========================================
    function _createEditUI() {
        if (_toolbar) return;

        // 1. Grade Blueprint Overlay
        _gridOverlay = document.createElement('div');
        _gridOverlay.id = 'hudEditGrid';
        _gridOverlay.className = 'hud-edit-grid';
        document.body.appendChild(_gridOverlay);

        // 2. Linhas Guias Magnéticas de Alinhamento (Smart Alignment Lines)
        _guideContainer = document.createElement('div');
        _guideContainer.id = 'hudGuideContainer';
        _guideContainer.className = 'hud-guide-container';
        _guideHLine = document.createElement('div');
        _guideHLine.className = 'hud-guide-h';
        _guideVLine = document.createElement('div');
        _guideVLine.className = 'hud-guide-v';
        _guideContainer.appendChild(_guideHLine);
        _guideContainer.appendChild(_guideVLine);
        document.body.appendChild(_guideContainer);

        // 3. Toolbar Flutuante Superior com Toggles Especificos
        _toolbar = document.createElement('div');
        _toolbar.id = 'hudEditToolbar';
        _toolbar.className = 'hud-edit-toolbar';
        _toolbar.innerHTML = `
            <div class="hud-tb-left">
                <span class="hud-tb-brand">✏️ EDITOR DE HUD</span>
                <span style="font-size:0.7em; background:rgba(255,170,0,0.2); color:#ffaa00; border:1px solid rgba(255,170,0,0.4); padding:2px 6px; border-radius:10px; font-weight:bold;">⏸️ JOGO PAUSADO</span>
                <div class="hud-preset-selector">
                    <button class="hud-preset-btn" onclick="LayoutEditor.applyPreset('default')" title="Layout Padrão">🌟 Padrão</button>
                    <button class="hud-preset-btn" onclick="LayoutEditor.applyPreset('mobile')" title="Modo Mobile Compacto">📱 Mobile</button>
                    <button class="hud-preset-btn" onclick="LayoutEditor.applyPreset('immersive')" title="Modo Imersivo">🎮 Imersivo</button>
                    <button class="hud-preset-btn" onclick="LayoutEditor.applyPreset('combat')" title="Modo Combate">⚔️ Combate</button>
                </div>
            </div>

            <div class="hud-tb-center">
                <button class="hud-tb-icon-btn ${_state.allowDrag ? 'active' : ''}" id="hudOptDragBtn" onclick="LayoutEditor.toggleOption('allowDrag')" title="Permitir Arraste com Mouse/Touch">
                    🖐️ Mover: ${_state.allowDrag ? 'ON' : 'OFF'}
                </button>
                <button class="hud-tb-icon-btn ${_state.allowResize ? 'active' : ''}" id="hudOptResizeBtn" onclick="LayoutEditor.toggleOption('allowResize')" title="Permitir Redimensionamento por Alças">
                    📐 Redimensionar: ${_state.allowResize ? 'ON' : 'OFF'}
                </button>
                <button class="hud-tb-icon-btn ${_state.gridSnap ? 'active' : ''}" id="hudOptSnapBtn" onclick="LayoutEditor.toggleOption('gridSnap')" title="Snap na Grade Magnética">
                    🧲 Grade: ${_state.gridSnap ? 'ON' : 'OFF'}
                </button>

                <span class="hud-tb-divider"></span>

                <button class="hud-tb-icon-btn" onclick="LayoutEditor.undo()" title="Desfazer (Ctrl+Z)">↩ Desfazer</button>
                <button class="hud-tb-icon-btn" onclick="LayoutEditor.redo()" title="Refazer (Ctrl+Shift+Z)">↪ Refazer</button>
                <button class="hud-tb-icon-btn" onclick="LayoutEditor.resetAllLayout()" title="Restaurar Padrão">🔄 Restaurar</button>
            </div>

            <div class="hud-tb-right">
                <button class="hud-tb-icon-btn" onclick="LayoutEditor.exportLayout()" title="Exportar Layout JSON">📤 Exportar</button>
                <button class="hud-tb-icon-btn" onclick="document.getElementById('hudImportInput').click()" title="Importar JSON">📥 Importar</button>
                <button class="hud-tb-save-btn" onclick="LayoutEditor.applyLayout()" title="Salvar e Sair (Ctrl+S)">✅ Salvar</button>
                <button class="hud-tb-close-btn" onclick="LayoutEditor.exit()" title="Fechar (ESC)">✕</button>
                <input type="file" id="hudImportInput" accept=".json" style="display:none" onchange="LayoutEditor.importLayout(event)">
            </div>
        `;
        document.body.appendChild(_toolbar);

        // 4. Painel Lateral Persistente (Árvore Expansível)
        _sidePanel = document.createElement('div');
        _sidePanel.id = 'hudSidePanel';
        _sidePanel.className = 'hud-side-panel';
        document.body.appendChild(_sidePanel);

        // 5. Box de Seleção com 8 Alças de Redimensionamento
        _selectionBox = document.createElement('div');
        _selectionBox.id = 'hudSelectionBox';
        _selectionBox.className = 'hud-selection-box';
        _selectionBox.innerHTML = `
            <div class="hud-handle hud-h-nw" data-handle="nw"></div>
            <div class="hud-handle hud-h-n"  data-handle="n"></div>
            <div class="hud-handle hud-h-ne" data-handle="ne"></div>
            <div class="hud-handle hud-h-e"  data-handle="e"></div>
            <div class="hud-handle hud-h-se" data-handle="se"></div>
            <div class="hud-handle hud-h-s"  data-handle="s"></div>
            <div class="hud-handle hud-h-sw" data-handle="sw"></div>
            <div class="hud-handle hud-h-w"  data-handle="w"></div>
            <div class="hud-sel-badge" id="hudSelBadge">Widget</div>
        `;
        document.body.appendChild(_selectionBox);
    }

    // Loop continuo em rAF para manter o estado dos elementos 100% estável
    function _startRenderLoop() {
        if (_state.animFrameId) cancelAnimationFrame(_state.animFrameId);
        function loop() {
            if (_state.active) {
                _registerWidgets();
                _updateSelectionBox();
                _state.animFrameId = requestAnimationFrame(loop);
            }
        }
        loop();
    }

    // ==========================================
    // SMART ALIGNMENT LINES (LINHAS GUIAS MAGNÉTICAS)
    // ==========================================
    function _updateSmartAlignment(draggedId, currentX, currentY) {
        if (!_guideHLine || !_guideVLine) return { x: currentX, y: currentY };

        const draggedW = _registeredWidgets[draggedId];
        if (!draggedW || !draggedW.el) {
            _guideHLine.style.display = 'none';
            _guideVLine.style.display = 'none';
            return { x: currentX, y: currentY };
        }

        const dragRect = draggedW.el.getBoundingClientRect();
        const SNAP_THRESHOLD = 6;

        let snappedX = currentX;
        let snappedY = currentY;

        let showH = false;
        let showV = false;
        let hLineY = 0;
        let vLineX = 0;

        // Compara com todos os outros widgets visíveis
        Object.keys(_registeredWidgets).forEach(otherId => {
            if (otherId === draggedId) return;
            const otherW = _registeredWidgets[otherId];
            if (!otherW || !otherW.el) return;

            const otherRect = otherW.el.getBoundingClientRect();

            // 1. Alinhamentos Verticais (Eixo X)
            const vPoints = [
                { a: dragRect.left, b: otherRect.left, offset: 0, line: otherRect.left },
                { a: dragRect.right, b: otherRect.right, offset: 0, line: otherRect.right },
                { a: (dragRect.left + dragRect.width/2), b: (otherRect.left + otherRect.width/2), offset: 0, line: (otherRect.left + otherRect.width/2) },
                { a: dragRect.left, b: otherRect.right, offset: 0, line: otherRect.right },
                { a: dragRect.right, b: otherRect.left, offset: 0, line: otherRect.left }
            ];

            for (let p of vPoints) {
                if (Math.abs(p.a - p.b) < SNAP_THRESHOLD) {
                    snappedX += (p.b - p.a);
                    showV = true;
                    vLineX = p.line;
                    break;
                }
            }

            // 2. Alinhamentos Horizontais (Eixo Y)
            const hPoints = [
                { a: dragRect.top, b: otherRect.top, offset: 0, line: otherRect.top },
                { a: dragRect.bottom, b: otherRect.bottom, offset: 0, line: otherRect.bottom },
                { a: (dragRect.top + dragRect.height/2), b: (otherRect.top + otherRect.height/2), offset: 0, line: (otherRect.top + otherRect.height/2) },
                { a: dragRect.top, b: otherRect.bottom, offset: 0, line: otherRect.bottom },
                { a: dragRect.bottom, b: otherRect.top, offset: 0, line: otherRect.top }
            ];

            for (let p of hPoints) {
                if (Math.abs(p.a - p.b) < SNAP_THRESHOLD) {
                    snappedY += (p.b - p.a);
                    showH = true;
                    hLineY = p.line;
                    break;
                }
            }
        });

        if (showH) {
            _guideHLine.style.display = 'block';
            _guideHLine.style.top = `${hLineY}px`;
        } else {
            _guideHLine.style.display = 'none';
        }

        if (showV) {
            _guideVLine.style.display = 'block';
            _guideVLine.style.left = `${vLineX}px`;
        } else {
            _guideVLine.style.display = 'none';
        }

        return { x: snappedX, y: snappedY };
    }

    function _clearAlignmentLines() {
        if (_guideHLine) _guideHLine.style.display = 'none';
        if (_guideVLine) _guideVLine.style.display = 'none';
    }

    // ==========================================
    // CAIXA DE SELEÇÃO E ALÇAS DE CANTO
    // ==========================================
    function _updateSelectionBox() {
        if (!_selectionBox || !_state.active) return;

        const id = _state.selectedId;
        const w = id ? _registeredWidgets[id] : null;

        if (!id || !w || !w.el) {
            _selectionBox.style.display = 'none';
            return;
        }

        const rect = w.el.getBoundingClientRect();
        _selectionBox.style.display = 'block';
        _selectionBox.style.left = `${rect.left}px`;
        _selectionBox.style.top = `${rect.top}px`;
        _selectionBox.style.width = `${rect.width}px`;
        _selectionBox.style.height = `${rect.height}px`;

        if (_state.allowResize) {
            _selectionBox.classList.remove('no-handles');
        } else {
            _selectionBox.classList.add('no-handles');
        }

        const badge = document.getElementById('hudSelBadge');
        if (badge) badge.textContent = `${w.icon} ${w.label}`;
    }

    // ==========================================
    // SELEÇÃO E PAINEL LATERAL EM ÁRVORE HIERÁRQUICA
    // ==========================================
    function _selectWidget(id) {
        if (!id || !_registeredWidgets[id]) {
            _state.selectedId = null;
            _state.selectedEl = null;
            document.querySelectorAll('.hud-widget-root').forEach(el => el.classList.remove('hud-selected'));
            _updateSelectionBox();
            _updateSidePanel();
            return;
        }

        _state.selectedId = id;
        _state.selectedEl = _registeredWidgets[id].el;

        document.querySelectorAll('.hud-widget-root').forEach(el => {
            if (el.id === id) {
                el.classList.add('hud-selected');
            } else {
                el.classList.remove('hud-selected');
            }
        });

        _updateSelectionBox();
        _updateSidePanel();
    }

    function _updateSidePanel() {
        if (!_sidePanel) return;

        const config = _getSavedConfig();
        const widgetsCfg = config.widgets || {};
        const selId = _state.selectedId;
        const selW = selId ? _registeredWidgets[selId] : null;
        const selCfg = selId ? (widgetsCfg[selId] || {}) : {};

        let treeHTML = '';
        WIDGET_TREE.forEach(node => {
            const isSel = node.id === selId;
            const wCfg = widgetsCfg[node.id] || {};
            const isHidden = wCfg.hidden === true;
            const isExpanded = _expandedNodes[node.id] === true;
            const hasChildren = node.children && node.children.length > 0;

            let childrenHTML = '';
            if (hasChildren && isExpanded) {
                node.children.forEach(child => {
                    childrenHTML += `
                        <div class="hud-tree-subitem" 
                             onmouseover="LayoutEditor.highlightSubitem('${child.selector}', true)" 
                             onmouseout="LayoutEditor.highlightSubitem('${child.selector}', false)"
                             onclick="LayoutEditor.selectById('${node.id}')">
                            <span>🔍 ${child.label}</span>
                        </div>
                    `;
                });
            }

            treeHTML += `
                <div class="hud-tree-node">
                    <div class="hud-sp-item ${isSel ? 'active' : ''}" onclick="LayoutEditor.selectById('${node.id}')">
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${hasChildren ? `
                                <span class="hud-tree-arrow ${isExpanded ? 'expanded' : ''}" 
                                      onclick="event.stopPropagation(); LayoutEditor.toggleNodeExpand('${node.id}')">▶</span>
                            ` : '<span style="width:14px;"></span>'}
                            <span class="hud-sp-item-title">${node.icon} ${node.label}</span>
                        </div>
                        <button class="hud-sp-eye-btn ${isHidden ? 'hidden-eye' : ''}" 
                                onclick="event.stopPropagation(); LayoutEditor.toggleVisibility('${node.id}')" 
                                title="Exibir/Ocultar Widget">
                            ${isHidden ? '🙈' : '👁️'}
                        </button>
                    </div>
                    ${hasChildren && isExpanded ? `<div class="hud-tree-children">${childrenHTML}</div>` : ''}
                </div>
            `;
        });

        let selControlsHTML = '';
        if (selW && selId) {
            const scale = selCfg.scale !== undefined ? selCfg.scale : 1;
            const opacity = selCfg.opacity !== undefined ? selCfg.opacity : 1;
            const posX = selCfg.x || 0;
            const posY = selCfg.y || 0;

            selControlsHTML = `
                <div class="hud-sp-section">
                    <div class="hud-sp-section-title">⚙️ Propriedades de ${selW.label}</div>
                    
                    <div class="hud-sp-row">
                        <span class="hud-sp-coord-badge">Posição X: ${posX}px | Y: ${posY}px</span>
                    </div>

                    <div class="hud-sp-field">
                        <label>📐 Escala de Tamanho: <b id="hudScaleVal">${Math.round(scale * 100)}%</b></label>
                        <input type="range" min="70" max="130" step="5" value="${Math.round(scale * 100)}" 
                            ${!_state.allowResize ? 'disabled' : ''}
                            oninput="LayoutEditor.setWidgetScale('${selId}', this.value)">
                    </div>

                    <div class="hud-sp-field">
                        <label>✨ Transparência / Opacidade: <b id="hudOpacityVal">${Math.round(opacity * 100)}%</b></label>
                        <input type="range" min="20" max="100" step="5" value="${Math.round(opacity * 100)}" 
                            oninput="LayoutEditor.setWidgetOpacity('${selId}', this.value)">
                    </div>

                    <div class="hud-sp-anchors">
                        <button onclick="LayoutEditor.anchorWidget('${selId}', 'top-left')">↖ Topo Esq</button>
                        <button onclick="LayoutEditor.anchorWidget('${selId}', 'top-center')">⬆ Centro Topo</button>
                        <button onclick="LayoutEditor.anchorWidget('${selId}', 'top-right')">↗ Topo Dir</button>
                        <button onclick="LayoutEditor.anchorWidget('${selId}', 'center')">🎯 Centralizar</button>
                        <button onclick="LayoutEditor.anchorWidget('${selId}', 'reset')" class="hud-sp-reset-btn">🔄 Posição Padrão</button>
                    </div>
                </div>
            `;
        } else {
            selControlsHTML = `
                <div class="hud-sp-section">
                    <div class="hud-sp-empty">👈 Clique em um widget na árvore acima para ajustar suas propriedades.</div>
                </div>
            `;
        }

        _sidePanel.innerHTML = `
            <div class="hud-sp-header">
                <span>📋 Árvore do HUD (Hierarquia)</span>
            </div>
            <div class="hud-sp-body">
                <div class="hud-sp-list">${treeHTML}</div>
                ${selControlsHTML}
            </div>
        `;
    }

    // ==========================================
    // NOTIFICAÇÕES TOAST
    // ==========================================
    function _notify(msg, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification('✏️ Editor de HUD', msg, type);
        }
    }

    // ==========================================
    // ARRASTE E REDIMENSIONAMENTO (MOUSE & TOUCH)
    // ==========================================
    function _startDrag(e, el) {
        if (!_state.active || !_state.allowDrag) return;
        const id = el.id;
        if (!id) return;

        _selectWidget(id);
        _state.dragging = true;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const config = _getSavedConfig();
        const cfg = (config.widgets && config.widgets[id]) || {};

        _state.dragStartX = clientX;
        _state.dragStartY = clientY;
        _state.dragOrigX = cfg.x || 0;
        _state.dragOrigY = cfg.y || 0;

        el.classList.add('hud-dragging');
    }

    function _startResize(e, handleType) {
        if (!_state.active || !_state.allowResize || !_state.selectedId || !_state.selectedEl) return;

        _state.resizing = true;
        _state.resizeHandle = handleType;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const config = _getSavedConfig();
        const cfg = (config.widgets && config.widgets[_state.selectedId]) || {};

        _state.dragStartX = clientX;
        _state.dragStartY = clientY;
        _state.dragOrigScale = cfg.scale !== undefined ? cfg.scale : 1;

        e.stopPropagation();
        e.preventDefault();
    }

    function _onMouseMove(e) {
        if (!_state.active) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        if (_state.dragging && _state.selectedId && _state.allowDrag) {
            let deltaX = clientX - _state.dragStartX;
            let deltaY = clientY - _state.dragStartY;

            let newX = _state.dragOrigX + deltaX;
            let newY = _state.dragOrigY + deltaY;

            // Smart Alignment Lines & Snap Magnético entre Widgets
            const snapped = _updateSmartAlignment(_state.selectedId, newX, newY);
            newX = snapped.x;
            newY = snapped.y;

            const maxW = window.innerWidth - 60;
            const maxH = window.innerHeight - 60;
            newX = _clamp(newX, -maxW, maxW);
            newY = _clamp(newY, -maxH, maxH);

            if (_state.gridSnap) {
                const step = _state.gridSize;
                newX = Math.round(newX / step) * step;
                newY = Math.round(newY / step) * step;
            }

            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[_state.selectedId]) config.widgets[_state.selectedId] = {};

            config.widgets[_state.selectedId].x = newX;
            config.widgets[_state.selectedId].y = newY;

            _setSavedConfig(config);
            _applyConfigToAll(config);
            _updateSidePanel();
        } else if (_state.resizing && _state.selectedId && _state.allowResize) {
            let deltaX = clientX - _state.dragStartX;
            let deltaY = clientY - _state.dragStartY;

            let scaleDelta = (deltaX + deltaY) / 300;
            if (_state.resizeHandle.includes('w') || _state.resizeHandle.includes('n')) {
                scaleDelta = -scaleDelta;
            }

            let newScale = Math.max(0.7, Math.min(1.3, _state.dragOrigScale + scaleDelta));
            newScale = Math.round(newScale * 20) / 20;

            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[_state.selectedId]) config.widgets[_state.selectedId] = {};

            config.widgets[_state.selectedId].scale = newScale;

            _setSavedConfig(config);
            _applyConfigToAll(config);
            _updateSidePanel();
        }
    }

    function _onMouseUp() {
        _clearAlignmentLines();

        if (_state.dragging) {
            _state.dragging = false;
            if (_state.selectedEl) _state.selectedEl.classList.remove('hud-dragging');
            _saveSnapshot();
        }
        if (_state.resizing) {
            _state.resizing = false;
            _saveSnapshot();
        }
    }

    // ==========================================
    // API PÚBLICA DO EDITOR
    // ==========================================
    return {
        init: function() {
            if (_initialized) return;
            _initialized = true;

            _registerWidgets();
            this.loadLayout();
        },

        isActive: function() {
            return _state.active;
        },

        toggle: function() {
            if (_state.active) {
                this.exit();
            } else {
                this.enter();
            }
        },

        enter: function() {
            _state.active = true;
            window.isGamePausedForEditor = true;

            _registerWidgets();
            _createEditUI();

            document.body.classList.add('layout-editor-active', 'hud-edit-mode-active');
            
            const config = _getSavedConfig();
            _applyConfigToAll(config);
            _updateSidePanel();
            _saveSnapshot();
            _startRenderLoop();

            _notify('⏸️ Jogo Pausado | Modo de Edição com Guias Magnéticas Ativo!', 'info');
        },

        exit: function() {
            _state.active = false;
            window.isGamePausedForEditor = false;

            document.body.classList.remove('layout-editor-active', 'hud-edit-mode-active');

            if (_state.animFrameId) cancelAnimationFrame(_state.animFrameId);
            if (_selectionBox) _selectionBox.style.display = 'none';
            _clearAlignmentLines();
            _selectWidget(null);

            const config = _getSavedConfig();
            _applyConfigToAll(config);
        },

        loadLayout: function() {
            _registerWidgets();
            const config = _getSavedConfig();
            _applyConfigToAll(config);
        },

        selectById: function(id) {
            _selectWidget(id);
        },

        toggleNodeExpand: function(nodeId) {
            _expandedNodes[nodeId] = !_expandedNodes[nodeId];
            _updateSidePanel();
        },

        highlightSubitem: function(selector, enable) {
            if (!selector) return;
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                if (enable) {
                    el.classList.add('hud-subitem-highlight');
                } else {
                    el.classList.remove('hud-subitem-highlight');
                }
            });
        },

        toggleOption: function(optionName) {
            if (optionName === 'allowDrag') {
                _state.allowDrag = !_state.allowDrag;
                const btn = document.getElementById('hudOptDragBtn');
                if (btn) {
                    btn.classList.toggle('active', _state.allowDrag);
                    btn.innerHTML = `🖐️ Mover: ${_state.allowDrag ? 'ON' : 'OFF'}`;
                }
                _notify(_state.allowDrag ? '🖐️ Arraste de Mover: ATIVADO' : '🚫 Arraste de Mover: BLOQUEADO', 'info');
            } else if (optionName === 'allowResize') {
                _state.allowResize = !_state.allowResize;
                const btn = document.getElementById('hudOptResizeBtn');
                if (btn) {
                    btn.classList.toggle('active', _state.allowResize);
                    btn.innerHTML = `📐 Redimensionar: ${_state.allowResize ? 'ON' : 'OFF'}`;
                }
                _updateSelectionBox();
                _updateSidePanel();
                _notify(_state.allowResize ? '📐 Redimensionamento por Alças: ATIVADO' : '🚫 Redimensionamento por Alças: OCULTO', 'info');
            } else if (optionName === 'gridSnap') {
                _state.gridSnap = !_state.gridSnap;
                const btn = document.getElementById('hudOptSnapBtn');
                if (btn) {
                    btn.classList.toggle('active', _state.gridSnap);
                    btn.innerHTML = `🧲 Grade: ${_state.gridSnap ? 'ON' : 'OFF'}`;
                }
                _notify(_state.gridSnap ? '🧲 Alinhamento Magnético: ATIVADO' : '🔓 Alinhamento Magnético: DESATIVADO', 'info');
            }
        },

        applyLayout: function() {
            const config = _getSavedConfig();
            _setSavedConfig(config);
            _notify('✅ Layout de HUD Salvo com Sucesso!', 'success');
            this.exit();
        },

        resetAllLayout: function() {
            localStorage.removeItem('idleCraftHUDConfig');
            localStorage.removeItem('idleCraftLayout');
            _history = [];
            _historyIndex = -1;

            Object.keys(_registeredWidgets).forEach(id => {
                const w = _registeredWidgets[id];
                if (w && w.el) {
                    w.el.style.transform = '';
                    w.el.style.opacity = '';
                    w.el.style.display = '';
                    w.el.classList.remove('hud-widget-hidden', 'hud-selected');
                }
            });

            _selectWidget(null);
            _notify('🔄 Layout Restaurado para o Padrão!', 'success');
        },

        setWidgetScale: function(id, valPercent) {
            const scale = parseFloat(valPercent) / 100;
            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[id]) config.widgets[id] = {};

            config.widgets[id].scale = scale;
            _setSavedConfig(config);
            _applyConfigToAll(config);

            const label = document.getElementById('hudScaleVal');
            if (label) label.textContent = `${Math.round(scale * 100)}%`;
        },

        setWidgetOpacity: function(id, valPercent) {
            const opacity = parseFloat(valPercent) / 100;
            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[id]) config.widgets[id] = {};

            config.widgets[id].opacity = opacity;
            _setSavedConfig(config);
            _applyConfigToAll(config);

            const label = document.getElementById('hudOpacityVal');
            if (label) label.textContent = `${Math.round(opacity * 100)}%`;
        },

        toggleVisibility: function(id) {
            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[id]) config.widgets[id] = {};

            config.widgets[id].hidden = !config.widgets[id].hidden;
            _setSavedConfig(config);
            _applyConfigToAll(config);
            _updateSidePanel();
        },

        anchorWidget: function(id, anchorType) {
            const config = _getSavedConfig();
            if (!config.widgets) config.widgets = {};
            if (!config.widgets[id]) config.widgets[id] = {};

            switch(anchorType) {
                case 'top-left':
                    config.widgets[id].x = -40;
                    config.widgets[id].y = -20;
                    break;
                case 'top-center':
                    config.widgets[id].x = 0;
                    config.widgets[id].y = -20;
                    break;
                case 'top-right':
                    config.widgets[id].x = 40;
                    config.widgets[id].y = -20;
                    break;
                case 'center':
                    config.widgets[id].x = 0;
                    config.widgets[id].y = 0;
                    break;
                case 'reset':
                default:
                    config.widgets[id].x = 0;
                    config.widgets[id].y = 0;
                    config.widgets[id].scale = 1;
                    config.widgets[id].opacity = 1;
                    config.widgets[id].hidden = false;
                    break;
            }

            _setSavedConfig(config);
            _applyConfigToAll(config);
            _updateSidePanel();
            _saveSnapshot();
        },

        applyPreset: function(presetKey) {
            const config = _getSavedConfig();
            config.preset = presetKey;
            config.widgets = {};

            if (presetKey === 'mobile') {
                config.widgets['topStatsBar'] = { scale: 0.95 };
                config.widgets['gameSidebar'] = { scale: 0.9 };
            } else if (presetKey === 'immersive') {
                config.widgets['topStatsBar'] = { opacity: 0.85 };
                config.widgets['notificationArea'] = { hidden: true };
            } else if (presetKey === 'combat') {
                config.widgets['globalActiveBuffs'] = { scale: 1.15, y: -10 };
            }

            _setSavedConfig(config);
            _applyConfigToAll(config);
            _updateSidePanel();
            _saveSnapshot();
            _notify(`🌟 Preset Aplicado: ${presetKey.toUpperCase()}`, 'success');
        },

        undo: function() { _undo(); },
        redo: function() { _redo(); },

        exportLayout: function() {
            const config = _getSavedConfig();
            const json = JSON.stringify(config, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'idle-craft-hud-layout.json';
            a.click();
            URL.revokeObjectURL(url);
            _notify('📤 Layout Exportado!', 'success');
        },

        importLayout: function(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);
                    _setSavedConfig(config);
                    _applyConfigToAll(config);
                    _saveSnapshot();
                    _updateSidePanel();
                    _notify('📥 Layout Importado!', 'success');
                } catch(err) {
                    _notify('❌ JSON Inválido', 'error');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        },

        showHelp: function() {
            if (_helpOverlay) { _helpOverlay.style.display = 'flex'; return; }
            _helpOverlay = document.createElement('div');
            _helpOverlay.id = 'hudHelpOverlay';
            _helpOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
            _helpOverlay.onclick = function(e) { if (e.target === _helpOverlay) _helpOverlay.style.display = 'none'; };
            _helpOverlay.innerHTML = `
                <div style="background:#161d2a;border:1px solid #4a5a7a;border-radius:16px;padding:24px 30px;max-width:440px;width:90%;font-family:'Outfit',sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.8);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <span style="color:#ffd700;font-size:1.3em;font-weight:bold;">❓ Como Usar o Editor de HUD</span>
                        <button onclick="document.getElementById('hudHelpOverlay').style.display='none'" style="background:none;border:none;color:#aaa;font-size:1.4em;cursor:pointer;">✕</button>
                    </div>
                    <div style="color:#ccc;font-size:0.92em;line-height:1.7;">
                        <p style="margin-bottom:12px;"><b style="color:#7ab8ff;">🖐️ Mover & 📐 Redimensionar</b><br>Alterne os botões no menu superior para ativar ou desativar o movimento livre ou as alças de tamanho.</p>
                        <p style="margin-bottom:12px;"><b style="color:#7ab8ff;">📋 Árvore Hierárquica</b><br>Expanda as categorias (▶) no painel à direita para visualizar sub-elementos.</p>
                        <p style="margin-bottom:12px;"><b style="color:#88ff88;">🧲 Guias Magnéticas</b><br>Linhas fluorescentes acendem automaticamente para alinhar bordas e centros.</p>
                        <p style="margin-bottom:0;"><b style="color:#888;">⌨️ Atalhos:</b> <b style="color:#fff;">ESC</b> sair · <b style="color:#fff;">Ctrl+Z</b> desfazer · <b style="color:#fff;">Ctrl+S</b> salvar</p>
                    </div>
                </div>
            `;
            document.body.appendChild(_helpOverlay);
        },

        bindEvents: function() {
            if (_bound) return;
            _bound = true;

            const self = this;

            // BLOQUEIA CLIQUES DE NAVEGAÇÃO INTERNA DO JOGO DURANTE O MODO DE EDIÇÃO
            document.addEventListener('click', function(e) {
                if (!document.body.classList.contains('hud-edit-mode-active')) return;

                if (e.target.closest('.hud-edit-toolbar') || 
                    e.target.closest('.hud-side-panel') || 
                    e.target.closest('#hudHelpOverlay') || 
                    e.target.closest('.le-toggle-btn')) {
                    return;
                }

                const widgetEl = e.target.closest('.hud-widget-root');
                if (widgetEl) {
                    e.preventDefault();
                    e.stopPropagation();
                    _selectWidget(widgetEl.id);
                }
            }, true);

            document.addEventListener('mousemove', function(e) {
                _onMouseMove(e);
            });

            document.addEventListener('mouseup', function(e) {
                _onMouseUp(e);
            });

            document.addEventListener('touchmove', function(e) {
                if (_state.dragging || _state.resizing) {
                    _onMouseMove(e);
                }
            }, { passive: true });

            document.addEventListener('touchend', function() {
                _onMouseUp();
            }, { passive: true });

            document.addEventListener('mousedown', function(e) {
                if (!document.body.classList.contains('hud-edit-mode-active')) return;

                const handle = e.target.closest('.hud-handle');
                if (handle && _state.allowResize) {
                    const type = handle.getAttribute('data-handle');
                    _startResize(e, type);
                    return;
                }

                if (e.target.closest('.hud-edit-toolbar') || e.target.closest('.hud-side-panel') || e.target.closest('#hudHelpOverlay')) {
                    return;
                }

                const widgetEl = e.target.closest('.hud-widget-root');
                if (widgetEl) {
                    _startDrag(e, widgetEl);
                }
            });

            document.addEventListener('touchstart', function(e) {
                if (!document.body.classList.contains('hud-edit-mode-active')) return;

                const handle = e.target.closest('.hud-handle');
                if (handle && _state.allowResize) {
                    const type = handle.getAttribute('data-handle');
                    _startResize(e, type);
                    return;
                }

                if (e.target.closest('.hud-edit-toolbar') || e.target.closest('.hud-side-panel') || e.target.closest('#hudHelpOverlay')) {
                    return;
                }

                const widgetEl = e.target.closest('.hud-widget-root');
                if (widgetEl) {
                    _startDrag(e, widgetEl);
                }
            }, { passive: true });

            document.addEventListener('keydown', function(e) {
                if (!document.body.classList.contains('hud-edit-mode-active')) return;

                if (e.key === 'Escape') {
                    self.exit();
                    e.preventDefault();
                } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    self.applyLayout();
                    e.preventDefault();
                } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                    _undo();
                    e.preventDefault();
                } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) {
                    _redo();
                    e.preventDefault();
                }
            });
        }
    };
})();

(function() {
    function boot() {
        LayoutEditor.init();
        LayoutEditor.bindEvents();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(boot, 200);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(boot, 200);
        });
    }
})();
