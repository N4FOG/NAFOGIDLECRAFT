/**
 * ============================================
 * LAYOUT EDITOR - Editor Visual de Interface
 * ============================================
 * 
 * Recursos:
 * - Arrastar elementos livremente (mouse + touch)
 * - Redimensionar com 8 alças
 * - Guias de distância inteligentes (Figma-style)
 * - Painel de Propriedades (posição, tamanho, cores, etc.)
 * - Painel de Hierarquia
 * - Controle de Z-Index
 * - Color Picker embutido
 * - Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
 * - Persistência (localStorage)
 * - Importar/Exportar layout JSON
 * 
 * Uso: LayoutEditor.init() após o DOM carregar.
 * Botão ✏️ EDITOR na topStatsBar chama LayoutEditor.toggle()
 */

const LayoutEditor = (function() {
    'use strict';

    // ==========================================
    // ESTADO PRIVADO
    // ==========================================
    const _state = {
        active: false,
        selectedEl: null,
        selectedId: null,
        dragging: false,
        resizing: false,
        resizeCorner: null,
        dragStartX: 0,
        dragStartY: 0,
        dragOrigX: 0,
        dragOrigY: 0,
        origRect: null
    };

    let _history = [];
    let _historyIndex = -1;
    const MAX_HISTORY = 30;

    let _overlay = null;
    let _handles = {};
    let _guideLines = [];
    let _distanceLabels = [];

    let _toolbar = null;
    let _propertiesPanel = null;
    let _hierarchyPanel = null;

    let _registered = {};
    let _savedStyles = {};
    let _initialized = false;
    let _bound = false;

    // ==========================================
    // UTILITÁRIOS
    // ==========================================
    function _makeId(el) {
        return el.id || 'le-' + Math.random().toString(36).slice(2, 8);
    }

    function _clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function _getSavedConfig() {
        try {
            const raw = localStorage.getItem('idleCraftLayout');
            return raw ? JSON.parse(raw) : {};
        } catch(e) {
            return {};
        }
    }

    function _setSavedConfig(config) {
        try {
            localStorage.setItem('idleCraftLayout', JSON.stringify(config));
        } catch(e) {
            console.warn('[LayoutEditor] Falha ao salvar layout:', e);
        }
    }

    // ==========================================
    // HISTÓRICO (UNDO/REDO)
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
        // Limpa estilos inline de TODOS os elementos registrados antes de aplicar
        Object.keys(_registered).forEach(function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            el.style.transform = '';
            el.style.width = '';
            el.style.height = '';
            el.style.zIndex = '';
            el.style.margin = '';
            el.style.padding = '';
            el.style.background = '';
            el.style.color = '';
            el.style.borderColor = '';
            el.style.borderRadius = '';
            el.style.opacity = '';
            el.style.boxShadow = '';
            el.style.visibility = '';
            if (el.dataset.origPos) {
                el.style.position = el.dataset.origPos;
                delete el.dataset.origPos;
            }
        });
        _setSavedConfig(snapshot);
        _applyConfigToAll(snapshot);
    }

    function _undo() {
        if (_historyIndex <= 0) return;
        _historyIndex--;
        _restoreSnapshot(_history[_historyIndex]);
        _updatePropertiesPanel();
        _updateHierarchyPanel();
        _updateOverlayPosition();
    }

    function _redo() {
        if (_historyIndex >= _history.length - 1) return;
        _historyIndex++;
        _restoreSnapshot(_history[_historyIndex]);
        _updatePropertiesPanel();
        _updateHierarchyPanel();
        _updateOverlayPosition();
    }

    // ==========================================
    // REGISTRO DE ELEMENTOS
    // ==========================================
    function _registerElements() {
        _registered = {};
        const els = document.querySelectorAll('.layout-editable');
        els.forEach((el, idx) => {
            const id = _makeId(el);
            if (!el.id) el.id = id;
            const label = el.getAttribute('data-layout-label') || el.id || 'Elemento ' + (idx + 1);
            const parentEl = el.parentElement;
            const parentId = parentEl && parentEl.closest('.layout-editable') ? _makeId(parentEl.closest('.layout-editable')) : null;
            
            const cs = window.getComputedStyle(el);
            _registered[id] = {
                el: el,
                label: label,
                parentId: parentId,
                originalPos: cs.position
            };
        });
    }

    // ==========================================
    // APLICAR / RESTAURAR ESTILOS
    // ==========================================
    function _applyEditorStyles() {
        const config = _getSavedConfig();
        const elements = config.elements || {};

        Object.keys(_registered).forEach(id => {
            const reg = _registered[id];
            if (!reg || !reg.el) return;
            const el = reg.el;
            const cfg = elements[id] || {};

            // Só muda position se tiver configuração de translate
            if (cfg.translateX || cfg.translateY) {
                const origPos = window.getComputedStyle(el).position;
                if (origPos !== 'absolute' && origPos !== 'fixed' && origPos !== 'relative') {
                    el.dataset.origPos = origPos;
                    el.style.position = 'relative';
                }
            }

            if (cfg.translateX || cfg.translateY) {
                el.style.transform = 'translate(' + (cfg.translateX || 0) + 'px, ' + (cfg.translateY || 0) + 'px)';
            }
            if (cfg.width) el.style.width = cfg.width;
            if (cfg.height) el.style.height = cfg.height;
            if (cfg.zIndex) el.style.zIndex = cfg.zIndex;
            if (cfg.padding) el.style.padding = cfg.padding;
            if (cfg.margin) el.style.margin = cfg.margin;
            if (cfg.borderRadius) el.style.borderRadius = cfg.borderRadius;
            if (cfg.background) el.style.background = cfg.background;
            if (cfg.color) el.style.color = cfg.color;
            if (cfg.borderColor) el.style.borderColor = cfg.borderColor;
            if (cfg.opacity !== undefined) el.style.opacity = cfg.opacity;
            if (cfg.boxShadow) el.style.boxShadow = cfg.boxShadow;
            el.classList.add('le-active');
        });
    }

    function _restoreEditorStyles() {
        Object.keys(_registered).forEach(id => {
            const reg = _registered[id];
            if (!reg || !reg.el) return;
            const el = reg.el;
            el.classList.remove('le-active', 'le-selected');

            const origPos = el.dataset.origPos;
            if (origPos) {
                el.style.position = origPos;
                delete el.dataset.origPos;
            }

            el.style.transform = '';
            el.style.width = '';
            el.style.height = '';
            el.style.zIndex = '';
            el.style.margin = '';
            el.style.padding = '';
            el.style.background = '';
            el.style.color = '';
            el.style.borderColor = '';
            el.style.borderRadius = '';
            el.style.opacity = '';
            el.style.boxShadow = '';
            el.style.visibility = '';
            el.style.top = '';
            el.style.left = '';
        });
    }

    function _applyConfigToAll(config) {
        const elements = config.elements || {};
        Object.keys(_registered).forEach(id => {
            const reg = _registered[id];
            if (!reg || !reg.el) return;
            const el = reg.el;
            const cfg = elements[id] || {};
            const hasCfg = Object.keys(cfg).length > 0;

            // Só limpa/remove estilos se houver config para este elemento
            if (hasCfg) {
                el.style.transform = '';
                el.style.width = '';
                el.style.height = '';
                el.style.zIndex = '';
                el.style.margin = '';
                el.style.padding = '';
                el.style.background = '';
                el.style.color = '';
                el.style.borderColor = '';
                el.style.borderRadius = '';
                el.style.opacity = '';
                el.style.boxShadow = '';
            }

            if (cfg.translateX || cfg.translateY) {
                const pos = window.getComputedStyle(el).position;
                if (pos !== 'absolute' && pos !== 'fixed' && pos !== 'relative') {
                    el.dataset.origPos = pos;
                    el.style.position = 'relative';
                }
                el.style.transform = 'translate(' + (cfg.translateX || 0) + 'px, ' + (cfg.translateY || 0) + 'px)';
            } else if (el.dataset.origPos) {
                el.style.position = el.dataset.origPos;
                delete el.dataset.origPos;
            }

            if (cfg.width) el.style.width = cfg.width;
            if (cfg.height) el.style.height = cfg.height;
            if (cfg.zIndex) el.style.zIndex = cfg.zIndex;
            if (cfg.padding) el.style.padding = cfg.padding;
            if (cfg.margin) el.style.margin = cfg.margin;
            if (cfg.borderRadius) el.style.borderRadius = cfg.borderRadius;
            if (cfg.background) el.style.background = cfg.background;
            if (cfg.color) el.style.color = cfg.color;
            if (cfg.borderColor) el.style.borderColor = cfg.borderColor;
            if (cfg.opacity !== undefined) el.style.opacity = cfg.opacity;
            if (cfg.boxShadow) el.style.boxShadow = cfg.boxShadow;

            // Só adiciona le-active se o editor estiver ativo
            if (document.body.classList.contains('layout-editor-active')) {
                el.classList.add('le-active');
            }
        });
    }

    // ==========================================
    // HELPER: Compute hex color from various formats
    // ==========================================
    function _computeColorInput(value) {
        if (!value) return '';
        if (/^#[0-9a-f]{6}$/i.test(value)) return value;
        if (/^#[0-9a-f]{3}$/i.test(value)) return '#' + value[1]+value[1]+value[2]+value[2]+value[3]+value[3];
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            return '#' + r + g + b;
        }
        return '';
    }

    // EXPORTA computeColorInput para uso em inline handlers
    window._leComputeColor = _computeColorInput;

    // ==========================================
    // CRIAÇÃO DOS PAINÉIS
    // ==========================================
    function _createPanels() {
        if (_toolbar) return;

        // === PAINEL DE HIERARQUIA (agora inclui a toolbar) ===
        _toolbar = document.createElement('div');
        _toolbar.id = 'layoutEditorToolbar';
        _toolbar.className = 'layout-editor-toolbar';
        _toolbar.innerHTML = '' +
            '<div class="le-toolbar-row">' +
                '<span class="le-toolbar-title">✏️ Editor de Layout</span>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.showHelp()" title="Como usar o editor">?</button>' +
                '<button class="le-toolbar-btn le-toolbar-exit" onclick="LayoutEditor.exit()" title="Sair do editor (ESC)">✕</button>' +
            '</div>' +
            '<div class="le-toolbar-row">' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.undo()" title="Desfazer (Ctrl+Z)">↩</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.redo()" title="Refazer (Ctrl+Shift+Z)">↪</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.bringToFront()" title="Trazer para frente">⬆</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.sendToBack()" title="Enviar para trás">⬇</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.exportLayout()" title="Exportar JSON">📤</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.applyLayout()" title="Aplicar alterações (Ctrl+S)">✅ Aplicar</button>' +
                '<button class="le-toolbar-btn" onclick="LayoutEditor.resetAllLayout()" title="Restaurar layout padrão">🔄 Restaurar</button>' +
                '<button class="le-toolbar-btn" onclick="document.getElementById(\'leImportInput\').click()" title="Importar JSON">📥</button>' +
            '</div>' +
            '<input type="file" id="leImportInput" accept=".json" style="display:none" onchange="LayoutEditor.importLayout(event)">';

        _hierarchyPanel = document.createElement('div');
        _hierarchyPanel.id = 'layoutHierarchyPanel';
        _hierarchyPanel.className = 'layout-editor-panel le-panel-left';
        _hierarchyPanel.appendChild(_toolbar);

        var hierBody = document.createElement('div');
        hierBody.className = 'le-panel-body';
        hierBody.id = 'leHierarchyBody';
        _hierarchyPanel.appendChild(hierBody);

        document.body.appendChild(_hierarchyPanel);

        // === PAINEL DE PROPRIEDADES ===
        _propertiesPanel = document.createElement('div');
        _propertiesPanel.id = 'layoutPropertiesPanel';
        _propertiesPanel.className = 'layout-editor-panel le-panel-right';
        _propertiesPanel.innerHTML = '' +
            '<div class="le-panel-header">' +
                '<button class="le-panel-close" onclick="LayoutEditor.toggleProperties()" title="Ocultar painel">▶</button>' +
                '<span>⚙️ Propriedades</span>' +
            '</div>' +
            '<div class="le-panel-body" id="lePropertiesBody">' +
                '<div class="le-prop-empty">Selecione um elemento</div>' +
            '</div>';
        document.body.appendChild(_propertiesPanel);
    }

    // ==========================================
    // PAINEL DE HIERARQUIA
    // ==========================================
    function _updateHierarchyPanel() {
        var body = document.getElementById('leHierarchyBody');
        if (!body) return;
        body.innerHTML = '';

        var config = _getSavedConfig();
        var elements = config.elements || {};

        var topLevel = [];
        var children = {};
        Object.keys(_registered).forEach(function(id) {
            var reg = _registered[id];
            if (!reg) return;
            if (reg.parentId && _registered[reg.parentId]) {
                if (!children[reg.parentId]) children[reg.parentId] = [];
                children[reg.parentId].push(id);
            } else {
                topLevel.push(id);
            }
        });

        function renderItem(id, depth) {
            var reg = _registered[id];
            if (!reg) return '';
            var cfg = elements[id] || {};
            var isSelected = _state.selectedId === id;
            var hasTransform = cfg.translateX || cfg.translateY;
            var hasResize = cfg.width || cfg.height;

            var html = '';
            var indent = depth * 14;
            var icon = hasTransform ? '📍' : (hasResize ? '📐' : '□');
            html += '<div class="le-hierarchy-item' + (isSelected ? ' le-hierarchy-selected' : '') + '" ' +
                        'data-id="' + id + '" ' +
                        'style="padding-left:' + (12 + indent) + 'px;" ' +
                        'onclick="LayoutEditor.selectById(\'' + id + '\')" ' +
                        'ondblclick="LayoutEditor.focusById(\'' + id + '\')">' +
                    '<span class="le-hierarchy-icon">' + icon + '</span>' +
                    '<span class="le-hierarchy-label">' + reg.label + '</span>' +
                    (hasTransform ? '<span class="le-hierarchy-badge">📍</span>' : '') +
                    (hasResize ? '<span class="le-hierarchy-badge">📐</span>' : '') +
                '</div>';

            if (children[id]) {
                children[id].forEach(function(childId) {
                    html += renderItem(childId, depth + 1);
                });
            }
            return html;
        }

        topLevel.forEach(function(id) {
            body.innerHTML += renderItem(id, 0);
        });
    }

    // ==========================================
    // PAINEL DE PROPRIEDADES
    // ==========================================
    function _updatePropertiesPanel() {
        var body = document.getElementById('lePropertiesBody');
        if (!body) return;

        var id = _state.selectedId;
        var reg = _registered[id];
        if (!id || !reg) {
            body.innerHTML = '<div class="le-prop-empty">Selecione um elemento</div>';
            return;
        }

        var config = _getSavedConfig();
        var elements = config.elements || {};
        var cfg = elements[id] || {};
        var el = reg.el;
        var cs = window.getComputedStyle(el);

        // Helper: pega valor do cfg ou do estilo computado
        var _v = function(prop, cssProp) {
            if (!cssProp) cssProp = prop;
            var c = cfg[prop];
            if (c && c.toString().trim()) return c.toString().trim();
            var val = cs[cssProp];
            if (val && val !== 'none' && val !== 'auto' && val !== '' && val !== '0px') return val;
            return '';
        };
        var _bg = cfg.background || cs.background || '';
        var _color = cfg.color || cs.color || '';
        var _borderColor = cfg.borderColor || cs.borderColor || '';
        var _shadow = cfg.boxShadow || cs.boxShadow || '';
        if (_bg === 'none' || _bg === 'rgba(0, 0, 0, 0)') _bg = '';
        if (_color === 'none') _color = '';
        if (_borderColor === 'none') _borderColor = '';
        if (_shadow === 'none') _shadow = '';

        var bgHex = _computeColorInput(_bg) || '#1a1a2e';
        var textHex = _computeColorInput(_color) || '#ffffff';
        var borderHex = _computeColorInput(_borderColor) || '#444444';
        var shadowColor = _shadow ? _computeColorInput(_shadow) || '#000000' : '#000000';

        var opacityVal = cfg.opacity !== undefined ? cfg.opacity : (cs.opacity !== '' ? parseFloat(cs.opacity) : 1);
        if (isNaN(opacityVal) || opacityVal === 0 && cs.opacity === '') opacityVal = 1;

        var posX = cfg.translateX || 0;
        var posY = cfg.translateY || 0;

        var wVal = _v('width');
        var hVal = _v('height');
        var zVal = _v('zIndex', 'zIndex');
        var padVal = _v('padding');
        var marVal = _v('margin');
        var radVal = _v('borderRadius');

        // Helper: parse spacing shorthand into [top, right, bottom, left]
        function _parseSpacing(v) {
            if (!v) return ['0px','0px','0px','0px'];
            var parts = v.split(/\s+/);
            if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
            if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
            if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
            return [parts[0], parts[1], parts[2], parts[3]];
        }
        function _joinSpacing(a, b, c, d) {
            if (a === b && b === c && c === d) return a;
            if (a === c && b === d) return a + ' ' + b;
            return a + ' ' + b + ' ' + c + ' ' + d;
        }
        // Helper: make 4-input block with steppers for a CSS property
        function _spacingHTML(prop, vals) {
            var sides = ['Cima','Dir.','Baixo','Esq.'];
            var html = '';
            for (var si = 0; si < 4; si++) {
                html += '<div style="display:flex;flex-direction:column;align-items:center;gap:0;">' +
                        '<button class="le-stepper" onclick="LayoutEditor.spacingStepper(this,\'' + id + '\',\'' + prop + '\',1)" title="+1" style="font-size:0.5em;padding:0 6px;line-height:1;">▲</button>' +
                        '<input type="text" class="le-prop-input le-spacing-input" value="' + vals[si] + '" ' +
                            'oninput="LayoutEditor.spacingInput(\'' + id + '\',\'' + prop + '\')" ' +
                            'data-prop="' + prop + '" ' +
                            'style="width:36px;font-size:0.65em;padding:1px 2px;text-align:center;">' +
                        '<button class="le-stepper" onclick="LayoutEditor.spacingStepper(this,\'' + id + '\',\'' + prop + '\',-1)" title="-1" style="font-size:0.5em;padding:0 6px;line-height:1;">▼</button>' +
                '</div>';
            }
            return html;
        }

        var padParts = _parseSpacing(padVal);
        var marParts = _parseSpacing(marVal);
        var radParts = _parseSpacing(radVal);

        body.innerHTML = '' +
            '<div class="le-prop-section">' +
                '<div class="le-prop-label">Elemento</div>' +
                '<div class="le-prop-name">' + reg.label + '</div>' +
                '<div class="le-prop-id">#' + id + '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">📐 Posição</div>' +
                '<div class="le-prop-row">' +
                    '<div class="le-prop-field">' +
                        '<label>X (px)</label>' +
                        '<input type="number" class="le-prop-input" id="lePropX" value="' + posX + '" ' +
                               'onchange="LayoutEditor.setTranslate(\'' + id + '\', \'x\', parseInt(this.value) || 0)">' +
                    '</div>' +
                    '<div class="le-prop-field">' +
                        '<label>Y (px)</label>' +
                        '<input type="number" class="le-prop-input" id="lePropY" value="' + posY + '" ' +
                               'onchange="LayoutEditor.setTranslate(\'' + id + '\', \'y\', parseInt(this.value) || 0)">' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">📏 Tamanho</div>' +
                '<div class="le-prop-row">' +
                    '<div class="le-prop-field">' +
                        '<label>Largura</label>' +
                        '<input type="text" class="le-prop-input" id="lePropW" value="' + wVal + '" ' +
                               'placeholder="auto" onchange="LayoutEditor.setSize(\'' + id + '\', \'width\', this.value)">' +
                    '</div>' +
                    '<div class="le-prop-field">' +
                        '<label>Altura</label>' +
                        '<input type="text" class="le-prop-input" id="lePropH" value="' + hVal + '" ' +
                               'placeholder="auto" onchange="LayoutEditor.setSize(\'' + id + '\', \'height\', this.value)">' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">📊 Z-Index</div>' +
                '<div class="le-prop-row">' +
                    '<div class="le-prop-field">' +
                        '<input type="number" class="le-prop-input" id="lePropZ" value="' + zVal + '" ' +
                               'placeholder="auto" onchange="LayoutEditor.setZIndex(\'' + id + '\', parseInt(this.value) || 0)">' +
                    '</div>' +
                    '<button class="le-prop-btn" onclick="LayoutEditor.bringToFront()" title="Trazer para frente">⬆</button>' +
                    '<button class="le-prop-btn" onclick="LayoutEditor.sendToBack()" title="Enviar para trás">⬇</button>' +
                '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">🔄 Espaçamento</div>' +
                '<div class="le-prop-field" style="grid-column:1/-1;margin-bottom:2px;">' +
                        '<label style="font-size:0.7em;color:#aaa;">Padding (▲ topo · ▶ direita · ▼ baixo · ◀ esquerda)</label>' +
                    '</div>' +
                '<div style="display: flex;gap:6px;justify-content: center;">' +
                    
                    _spacingHTML('padding', padParts) +
                '</div>' +
                '<div style="display: flex;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;align-items: center;">' +
                    '<div class="le-prop-field" style="grid-column:1/-1;margin-bottom:2px;">' +
                        '<label style="font-size:0.7em;color:#aaa;">Margin</label>' +
                    '</div>' +
                    _spacingHTML('margin', marParts) +
                '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">🎨 Aparência</div>' +

                '<div class="le-prop-row" style="margin-bottom:6px;">' +
                    '<div class="display: flex;gap:6px;justify-content: center;">' +
                        '<label style="font-size:0.7em;color:#aaa;">Border Radius (sup.esq · sup.dir · inf.dir · inf.esq)</label>' +
                    '</div>' +
                '</div>' +
                '<div style="display: flex;gap:6px;justify-content: center;">' +
                    _spacingHTML('borderRadius', radParts) +
                '</div>' +
                '<div class="le-prop-row" style="margin-top:8px;">' +
                    '<div class="le-prop-field">' +
                        '<label>Opacity</label>' +
                        '<input type="range" class="le-prop-range" id="lePropOpacity" min="0" max="1" step="0.05" ' +
                               'value="' + opacityVal + '" ' +
                               'oninput="LayoutEditor.setStyle(\'' + id + '\', \'opacity\', parseFloat(this.value)); ' +
                                        'document.getElementById(\'lePropOpacityVal\').textContent = this.value;"> ' +
                        '<span class="le-prop-range-val" id="lePropOpacityVal">' + opacityVal + '</span>' +
                    '</div>' +
                '</div>' +

                '<div class="le-prop-color-row">' +
                    '<label>Fundo</label>' +
                    '<input type="color" class="le-prop-color" id="lePropBgColor" value="' + bgHex + '" ' +
                           'oninput="LayoutEditor.setStyle(\'' + id + '\', \'background\', this.value);this.nextElementSibling.value=this.value;">' +
                    '<input type="text" class="le-prop-color-text" value="' + _bg + '" ' +
                           'placeholder="rgba/código" ' +
                           'onchange="var c=this.value; LayoutEditor.setStyle(\'' + id + '\', \'background\', c); ' +
                                   'var h=_leComputeColor(c); if(h) document.getElementById(\'lePropBgColor\').value=h;">' +
                '</div>' +

                '<div class="le-prop-color-row">' +
                    '<label>Texto</label>' +
                    '<input type="color" class="le-prop-color" id="lePropTextColor" value="' + textHex + '" ' +
                           'oninput="LayoutEditor.setStyle(\'' + id + '\', \'color\', this.value);this.nextElementSibling.value=this.value;">' +
                    '<input type="text" class="le-prop-color-text" value="' + _color + '" ' +
                           'placeholder="cor do texto" ' +
                           'onchange="var c=this.value; LayoutEditor.setStyle(\'' + id + '\', \'color\', c); ' +
                                   'var h=_leComputeColor(c); if(h) document.getElementById(\'lePropTextColor\').value=h;">' +
                '</div>' +

                '<div class="le-prop-color-row">' +
                    '<label>Borda</label>' +
                    '<input type="color" class="le-prop-color" id="lePropBorderColor" value="' + borderHex + '" ' +
                           'oninput="LayoutEditor.setStyle(\'' + id + '\', \'borderColor\', this.value);this.nextElementSibling.value=this.value;">' +
                    '<input type="text" class="le-prop-color-text" value="' + _borderColor + '" ' +
                           'placeholder="cor da borda" ' +
                           'onchange="var c=this.value; LayoutEditor.setStyle(\'' + id + '\', \'borderColor\', c); ' +
                                   'var h=_leComputeColor(c); if(h) document.getElementById(\'lePropBorderColor\').value=h;">' +
                '</div>' +

                '<div class="le-prop-color-row">' +
                    '<label>Sombra</label>' +
                    '<input type="color" class="le-prop-color" id="lePropShadowColor" value="' + shadowColor + '" ' +
                           'oninput="LayoutEditor.setStyle(\'' + id + '\', \'boxShadow\', \'0 2px 8px \' + this.value + \'40\');this.nextElementSibling.value=\'0 2px 8px \' + this.value + \'40\';">' +
                    '<input type="text" class="le-prop-color-text" value="' + _shadow + '" ' +
                           'placeholder="box-shadow" ' +
                           'onchange="LayoutEditor.setStyle(\'' + id + '\', \'boxShadow\', this.value); ' +
                                   'var h=_leComputeColor(this.value); if(h) document.getElementById(\'lePropShadowColor\').value=h;">' +
                '</div>' +
            '</div>' +

            '<div class="le-prop-section">' +
                '<div class="le-prop-section-title">🔄 Resetar</div>' +
                '<div class="le-prop-reset-grid">' +
                    '<button class="le-prop-reset" onclick="LayoutEditor.resetColor(\'' + id + '\')" title="Resetar apenas cores e opacidade">🎨 Cor</button>' +
                    '<button class="le-prop-reset" onclick="LayoutEditor.resetPosition(\'' + id + '\')" title="Resetar apenas posição">📍 Posição</button>' +
                    '<button class="le-prop-reset" onclick="LayoutEditor.resetSize(\'' + id + '\')" title="Resetar apenas largura/altura">📏 Tamanho</button>' +
                    '<button class="le-prop-reset" onclick="LayoutEditor.resetZIndex(\'' + id + '\')" title="Resetar apenas z-index">📊 Z-Index</button>' +
                    '<button class="le-prop-reset" onclick="LayoutEditor.resetSpacing(\'' + id + '\')" title="Resetar apenas padding/margin">🔄 Espaçamento</button>' +
                '</div>' +
                '<button class="le-prop-reset le-prop-reset-all" onclick="LayoutEditor.resetElement(\'' + id + '\')">🔄 Resetar Tudo</button>' +
            '</div>';
    }

    // ==========================================
    // SELEÇÃO
    // ==========================================
    function _selectElement(el) {
        if (!el) return _deselectAll();

        var id = _makeId(el);
        var reg = _registered[id];
        if (!reg) return;

        _state.selectedEl = el;
        _state.selectedId = id;

        document.querySelectorAll('.le-active').forEach(function(e) { e.classList.remove('le-selected'); });
        el.classList.add('le-selected');

        _createOverlay(el);
        _updatePropertiesPanel();
        _updateHierarchyPanel();
        _hideGuides();
    }

    function _deselectAll() {
        _state.selectedEl = null;
        _state.selectedId = null;
        _state.dragging = false;
        _state.resizing = false;

        document.querySelectorAll('.le-active').forEach(function(e) { e.classList.remove('le-selected'); });

        _removeOverlay();
        _updatePropertiesPanel();
        _updateHierarchyPanel();
        _hideGuides();
    }

    // ==========================================
    // OVERLAY + HANDLES
    // ==========================================
    function _createOverlay(el) {
        _removeOverlay();

        var rect = el.getBoundingClientRect();
        _overlay = document.createElement('div');
        _overlay.className = 'le-selection-overlay';
        _overlay.style.left = (rect.left + window.scrollX) + 'px';
        _overlay.style.top = (rect.top + window.scrollY) + 'px';
        _overlay.style.width = rect.width + 'px';
        _overlay.style.height = rect.height + 'px';
        document.body.appendChild(_overlay);

        var corners = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
        var self = this;
        corners.forEach(function(name) {
            var handle = document.createElement('div');
            handle.className = 'le-handle le-handle-' + name;
            handle.dataset.corner = name;
            handle.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                _startResize(e, name);
            });
            handle.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) return;
                e.stopPropagation();
                _startResize({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: function() { e.preventDefault(); } }, name);
            }, { passive: true });
            _overlay.appendChild(handle);
            _handles[name] = handle;
        });

        _overlay.addEventListener('mousedown', function(e) {
            if (e.target === _overlay) _startDrag(e);
        });
        _overlay.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) return;
            if (e.target === _overlay) {
                _startDrag({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: function() { e.preventDefault(); } });
            }
        }, { passive: true });
    }

    function _removeOverlay() {
        if (_overlay) {
            _overlay.remove();
            _overlay = null;
        }
        _handles = {};
    }

    function _updateOverlayPosition() {
        if (!_overlay || !_state.selectedEl) return;
        var rect = _state.selectedEl.getBoundingClientRect();
        _overlay.style.left = (rect.left + window.scrollX) + 'px';
        _overlay.style.top = (rect.top + window.scrollY) + 'px';
        _overlay.style.width = rect.width + 'px';
        _overlay.style.height = rect.height + 'px';
    }

    // ==========================================
    // DRAG
    // ==========================================
    function _startDrag(e) {
        if (_state.resizing) return;
        _state.dragging = true;
        _state.dragStartX = e.clientX;
        _state.dragStartY = e.clientY;

        var id = _state.selectedId;
        var config = _getSavedConfig();
        var elements = config.elements || {};
        var cfg = elements[id] || {};

        _state.dragOrigX = cfg.translateX || 0;
        _state.dragOrigY = cfg.translateY || 0;

        if (e.preventDefault) e.preventDefault();
    }

    function _onDrag(e) {
        if (!_state.dragging || !_state.selectedEl) return;
        var dx = e.clientX - _state.dragStartX;
        var dy = e.clientY - _state.dragStartY;
        var el = _state.selectedEl;
        var id = _state.selectedId;

        var newX = (_state.dragOrigX || 0) + dx;
        var newY = (_state.dragOrigY || 0) + dy;

        el.style.transform = 'translate(' + newX + 'px, ' + newY + 'px)';

        // Garantir position: relative se necessário
        var pos = window.getComputedStyle(el).position;
        if (pos !== 'absolute' && pos !== 'fixed' && pos !== 'relative' && !el.dataset.origPos) {
            el.dataset.origPos = pos;
            el.style.position = 'relative';
        }

        _showGuides(el, newX, newY);
        _updateOverlayPosition();
    }

    function _endDrag(e) {
        if (!_state.dragging) return;
        _state.dragging = false;

        var el = _state.selectedEl;
        var id = _state.selectedId;
        if (!id || !el) return;

        var config = _getSavedConfig();
        var elements = config.elements || {};
        if (!elements[id]) elements[id] = {};
        var cfg = elements[id];

        var match = el.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
            var newX = Math.round(parseFloat(match[1]));
            var newY = Math.round(parseFloat(match[2]));
            if (newX !== 0) cfg.translateX = newX; else delete cfg.translateX;
            if (newY !== 0) cfg.translateY = newY; else delete cfg.translateY;
        }

        _setSavedConfig(config);
        _saveSnapshot();
        _updatePropertiesPanel();
        _hideGuides();
        _updateOverlayPosition();
    }

    // ==========================================
    // RESIZE
    // ==========================================
    function _startResize(e, corner) {
        _state.resizing = true;
        _state.resizeCorner = corner;
        _state.dragStartX = e.clientX;
        _state.dragStartY = e.clientY;

        var el = _state.selectedEl;
        _state.origRect = el.getBoundingClientRect();

        var id = _state.selectedId;
        var config = _getSavedConfig();
        var elements = config.elements || {};
        if (!elements[id]) elements[id] = {};
        var cfg = elements[id];

        if (!cfg.width && _state.origRect.width) cfg.width = _state.origRect.width + 'px';
        if (!cfg.height && _state.origRect.height) cfg.height = _state.origRect.height + 'px';
        _setSavedConfig(config);

        if (e.preventDefault) e.preventDefault();
    }

    function _onResize(e) {
        if (!_state.resizing || !_state.selectedEl) return;
        var corner = _state.resizeCorner;
        var el = _state.selectedEl;
        var id = _state.selectedId;

        var dx = e.clientX - _state.dragStartX;
        var dy = e.clientY - _state.dragStartY;

        var newW, newH, newX = 0, newY = 0;
        var baseW = _state.origRect.width;
        var baseH = _state.origRect.height;

        if (corner.indexOf('e') >= 0) newW = Math.max(50, baseW + dx);
        else if (corner.indexOf('w') >= 0) { newW = Math.max(50, baseW - dx); newX = baseW - newW; }
        else newW = baseW;

        if (corner.indexOf('s') >= 0) newH = Math.max(30, baseH + dy);
        else if (corner.indexOf('n') >= 0) { newH = Math.max(30, baseH - dy); newY = baseH - newH; }
        else newH = baseH;

        if (newW !== baseW) el.style.width = newW + 'px';
        if (newH !== baseH) el.style.height = newH + 'px';

        var match = el.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        var curTX = match ? parseFloat(match[1]) : 0;
        var curTY = match ? parseFloat(match[2]) : 0;

        if (newX !== 0 || newY !== 0) {
            el.style.transform = 'translate(' + (curTX + newX) + 'px, ' + (curTY + newY) + 'px)';
        }

        _updateOverlayPosition();
    }

    function _endResize(e) {
        if (!_state.resizing) return;
        _state.resizing = false;
        _state.resizeCorner = null;

        var el = _state.selectedEl;
        var id = _state.selectedId;
        if (!id || !el) return;

        var config = _getSavedConfig();
        var elements = config.elements || {};
        if (!elements[id]) elements[id] = {};
        var cfg = elements[id];

        var w = el.style.width;
        var h = el.style.height;
        if (w && w !== 'auto' && parseFloat(w) > 0) cfg.width = w;
        else delete cfg.width;
        if (h && h !== 'auto' && parseFloat(h) > 0) cfg.height = h;
        else delete cfg.height;

        var match = el.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
            var newX = Math.round(parseFloat(match[1]));
            var newY = Math.round(parseFloat(match[2]));
            if (newX !== 0) cfg.translateX = newX; else delete cfg.translateX;
            if (newY !== 0) cfg.translateY = newY; else delete cfg.translateY;
        }

        _setSavedConfig(config);
        _saveSnapshot();
        _updatePropertiesPanel();
        _updateOverlayPosition();
    }

    // ==========================================
    // GUIAS DE DISTÂNCIA
    // ==========================================
    function _showGuides(el) {
        _hideGuides();

        var rect = el.getBoundingClientRect();
        var elCenterX = rect.left + rect.width / 2;
        var elCenterY = rect.top + rect.height / 2;

        var candidates = [];
        Object.keys(_registered).forEach(function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el || reg.el === el) return;
            var r = reg.el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;

            candidates.push({
                rect: r,
                distLeft: Math.abs(rect.left - r.left),
                distRight: Math.abs(rect.right - r.right),
                distTop: Math.abs(rect.top - r.top),
                distBottom: Math.abs(rect.bottom - r.bottom),
                distCenterX: Math.abs(elCenterX - (r.left + r.width / 2)),
                distCenterY: Math.abs(elCenterY - (r.top + r.height / 2))
            });
        });

        candidates.sort(function(a, b) {
            var minA = Math.min(a.distLeft, a.distRight, a.distTop, a.distBottom, a.distCenterX, a.distCenterY);
            var minB = Math.min(b.distLeft, b.distRight, b.distTop, b.distBottom, b.distCenterX, b.distCenterY);
            return minA - minB;
        });

        var guidesShown = 0;
        for (var i = 0; i < candidates.length && guidesShown < 3; i++) {
            var c = candidates[i];
            var THRESHOLD = 10;

            if (c.distLeft <= THRESHOLD) {
                _addGuideLine(c.rect.left, c.rect.top, c.rect.left, c.rect.bottom, 'v');
                _addDistanceLabel(c.rect.left, rect.top - 20, Math.round(c.distLeft) + 'px');
                guidesShown++;
            } else if (c.distCenterX <= THRESHOLD) {
                var cx = c.rect.left + c.rect.width / 2;
                _addGuideLine(cx, c.rect.top, cx, c.rect.bottom, 'v');
                _addDistanceLabel(cx, rect.top - 20, Math.round(c.distCenterX) + 'px');
                guidesShown++;
            } else if (c.distRight <= THRESHOLD) {
                _addGuideLine(c.rect.right, c.rect.top, c.rect.right, c.rect.bottom, 'v');
                _addDistanceLabel(c.rect.right, rect.top - 20, Math.round(c.distRight) + 'px');
                guidesShown++;
            }

            if (c.distTop <= THRESHOLD) {
                _addGuideLine(c.rect.left, c.rect.top, c.rect.right, c.rect.top, 'h');
                if (guidesShown < 3) {
                    _addDistanceLabel(c.rect.right + 5, c.rect.top - 6, Math.round(c.distTop) + 'px');
                    guidesShown++;
                }
            } else if (c.distCenterY <= THRESHOLD) {
                var cy = c.rect.top + c.rect.height / 2;
                _addGuideLine(c.rect.left, cy, c.rect.right, cy, 'h');
                if (guidesShown < 3) {
                    _addDistanceLabel(c.rect.right + 5, cy - 6, Math.round(c.distCenterY) + 'px');
                    guidesShown++;
                }
            } else if (c.distBottom <= THRESHOLD) {
                _addGuideLine(c.rect.left, c.rect.bottom, c.rect.right, c.rect.bottom, 'h');
                if (guidesShown < 3) {
                    _addDistanceLabel(c.rect.right + 5, c.rect.bottom - 6, Math.round(c.distBottom) + 'px');
                    guidesShown++;
                }
            }
        }
    }

    function _addGuideLine(x1, y1, x2, y2, orientation) {
        var line = document.createElement('div');
        line.className = 'le-guide-line le-guide-' + orientation;
        if (orientation === 'v') {
            line.style.left = x1 + 'px';
            line.style.top = Math.min(y1, y2) + 'px';
            line.style.width = '1px';
            line.style.height = Math.abs(y2 - y1) + 'px';
        } else {
            line.style.left = Math.min(x1, x2) + 'px';
            line.style.top = y1 + 'px';
            line.style.width = Math.abs(x2 - x1) + 'px';
            line.style.height = '1px';
        }
        document.body.appendChild(line);
        _guideLines.push(line);
    }

    function _addDistanceLabel(x, y, text) {
        var label = document.createElement('div');
        label.className = 'le-distance-label';
        label.textContent = text;
        label.style.left = x + 'px';
        label.style.top = y + 'px';
        document.body.appendChild(label);
        _distanceLabels.push(label);
    }

    function _hideGuides() {
        _guideLines.forEach(function(g) { g.remove(); });
        _guideLines = [];
        _distanceLabels.forEach(function(l) { l.remove(); });
        _distanceLabels = [];
    }

    // ==========================================
    // API PÚBLICA
    // ==========================================
    return {
        init: function() {
            if (_initialized) return;
            _registerElements();
            _createPanels();
            this.loadLayout();
            this.bindEvents();
            _initialized = true;
            console.log('[LayoutEditor] ✅ Inicializado. ' + Object.keys(_registered).length + ' elementos registrados.');
        },

        toggle: function() {
            if (!_initialized) this.init();
            if (_state.active) this.exit();
            else this.enter();
        },

        enter: function() {
            if (_state.active) return;
            _state.active = true;
            _saveSnapshot();
            document.body.classList.add('layout-editor-active');

            // Overlay de carregamento
            var loadOverlay = document.createElement('div');
            loadOverlay.id = 'leLoadOverlay';
            loadOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.5s;';
            loadOverlay.innerHTML = '' +
                '<div style="font-size:2.6em;font-weight:700;color:#ffd700;font-family:Cinzel,serif;text-shadow:0 0 30px rgba(255,215,0,0.3);margin-bottom:12px;">⏳ CARREGANDO EDITOR...</div>' +
                '<div style="font-size:1em;color:#ccc;font-family:Outfit,sans-serif;max-width:420px;text-align:center;line-height:1.6;padding:0 20px;">' +
                    '💡 Use a <b style="color:#7ab8ff;">barra da esquerda</b> para escolher os elementos<br>' +
                    'e a <b style="color:#7ab8ff;">da direita</b> para editar.<br>' +
                    'Você pode <b style="color:#88ff88;">clicar e arrastar</b> os elementos.' +
                '</div>' +
                '<div style="margin-top:24px;width:200px;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">' +
                    '<div style="width:0%;height:100%;background:linear-gradient(90deg,#ffd700,#ffaa00);border-radius:2px;animation:leLoadBar 4.5s ease-in-out forwards;"></div>' +
                '</div>';
            document.body.appendChild(loadOverlay);

            // Esconde os painéis até o carregamento terminar
            _hierarchyPanel.style.display = 'flex';
            _hierarchyPanel.style.opacity = '0';
            _propertiesPanel.style.display = 'flex';
            _propertiesPanel.style.opacity = '0';
            _updateHierarchyPanel();
            _updatePropertiesPanel();

            // After 5 seconds: fade out overlay, reveal panels AND apply editor styles
            setTimeout(function() {
                _applyEditorStyles();
                loadOverlay.style.opacity = '0';
                _hierarchyPanel.style.opacity = '1';
                _propertiesPanel.style.opacity = '1';
                setTimeout(function() {
                    if (loadOverlay.parentNode) loadOverlay.parentNode.removeChild(loadOverlay);
                }, 600);
            }, 5000);
        },

        exit: function() {
            if (!_state.active) return;
            _state.active = false;
            _deselectAll();
            document.body.classList.remove('layout-editor-active');
            _hierarchyPanel.style.display = 'none';
            _propertiesPanel.style.display = 'none';
            // Remove apenas as classes do editor, mantém os estilos editados visíveis
            Object.keys(_registered).forEach(function(id) {
                var reg = _registered[id];
                if (!reg || !reg.el) return;
                reg.el.classList.remove('le-active', 'le-selected');
            });
            if (typeof showNotification === 'function') {
                showNotification('✏️ Editor Desativado', 'Layout aplicado com sucesso!', 'success');
            }
        },

        selectById: function(id) {
            var reg = _registered[id];
            if (reg && reg.el) {
                reg.el.scrollIntoView({ behavior: 'auto', block: 'center' });
                _selectElement(reg.el);
            }
        },

        focusById: function(id) {
            var reg = _registered[id];
            if (reg && reg.el) {
                reg.el.scrollIntoView({ behavior: 'auto', block: 'center' });
                _selectElement(reg.el);
            }
        },

        setTranslate: function(id, axis, value) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];

            value = Math.round(value);
            cfg[axis === 'x' ? 'translateX' : 'translateY'] = value;
            el.style.transform = 'translate(' + (cfg.translateX || 0) + 'px, ' + (cfg.translateY || 0) + 'px)';

            var pos = window.getComputedStyle(el).position;
            if (pos !== 'absolute' && pos !== 'fixed' && pos !== 'relative' && !el.dataset.origPos) {
                el.dataset.origPos = pos;
                el.style.position = 'relative';
            }

            _setSavedConfig(config);
            _saveSnapshot();
            _updateOverlayPosition();
        },

        setSize: function(id, dimension, value) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];

            if (value && value.trim()) {
                cfg[dimension] = value.trim();
                el.style[dimension] = value.trim();
            } else {
                delete cfg[dimension];
                el.style[dimension] = '';
            }
            _setSavedConfig(config);
            _saveSnapshot();
            _updateOverlayPosition();
        },

        setZIndex: function(id, value) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];

            cfg.zIndex = value;
            el.style.zIndex = value;
            _setSavedConfig(config);
            _saveSnapshot();
        },

        setStyle: function(id, property, value) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];

            // Corrigido: 0 é um valor válido (opacity=0, translateX=0, etc)
            if (value !== undefined && value !== null && value !== '') {
                var strVal = value.toString().trim();
                if (strVal !== '') {
                    cfg[property] = strVal;
                    el.style[property] = strVal;
                } else {
                    delete cfg[property];
                    el.style[property] = '';
                }
            } else {
                delete cfg[property];
                el.style[property] = '';
            }
            _setSavedConfig(config);
            _saveSnapshot();
        },

        bringToFront: function() {
            var id = _state.selectedId;
            if (!id) return;
            var reg = _registered[id];
            if (!reg || !reg.el) return;

            var maxZ = 0;
            Object.keys(_registered).forEach(function(otherId) {
                var r = _registered[otherId];
                if (!r || !r.el) return;
                var z = parseInt(window.getComputedStyle(r.el).zIndex) || 0;
                if (z > maxZ) maxZ = z;
            });

            var newZ = maxZ + 1;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            cfg.zIndex = newZ;
            reg.el.style.zIndex = newZ;
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
        },

        sendToBack: function() {
            var id = _state.selectedId;
            if (!id) return;
            var reg = _registered[id];
            if (!reg || !reg.el) return;

            var newZ = -1;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            cfg.zIndex = newZ;
            reg.el.style.zIndex = newZ;
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
        },

        resetElement: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;

            var config = _getSavedConfig();
            var elements = config.elements || {};
            delete elements[id];
            _setSavedConfig(config);

            el.style.transform = '';
            el.style.width = '';
            el.style.height = '';
            el.style.zIndex = '';
            el.style.margin = '';
            el.style.padding = '';
            el.style.background = '';
            el.style.color = '';
            el.style.borderColor = '';
            el.style.borderRadius = '';
            el.style.opacity = '';
            el.style.boxShadow = '';

            if (el.dataset.origPos) {
                el.style.position = el.dataset.origPos;
                delete el.dataset.origPos;
            }
            el.style.visibility = '';

            _saveSnapshot();
            _updatePropertiesPanel();
            _updateOverlayPosition();
        },

        resetColor: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var propKeys = ['background', 'color', 'borderColor', 'boxShadow', 'borderRadius', 'opacity'];
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            propKeys.forEach(function(k) { delete cfg[k]; });
            if (Object.keys(cfg).length === 0) delete elements[id];
            _setSavedConfig(config);
            propKeys.forEach(function(k) { el.style[k] = ''; });
            _saveSnapshot();
            _updatePropertiesPanel();
        },

        resetPosition: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            delete cfg.translateX;
            delete cfg.translateY;
            el.style.transform = '';
            if (el.dataset.origPos) {
                el.style.position = el.dataset.origPos;
                delete el.dataset.origPos;
            }
            if (Object.keys(cfg).length === 0) delete elements[id];
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
            _updateOverlayPosition();
        },

        resetSize: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            delete cfg.width;
            delete cfg.height;
            el.style.width = '';
            el.style.height = '';
            if (Object.keys(cfg).length === 0) delete elements[id];
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
            _updateOverlayPosition();
        },

        resetZIndex: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            delete cfg.zIndex;
            el.style.zIndex = '';
            if (Object.keys(cfg).length === 0) delete elements[id];
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
        },

        resetSpacing: function(id) {
            var reg = _registered[id];
            if (!reg || !reg.el) return;
            var el = reg.el;
            var config = _getSavedConfig();
            var elements = config.elements || {};
            if (!elements[id]) elements[id] = {};
            var cfg = elements[id];
            delete cfg.padding;
            delete cfg.margin;
            el.style.padding = '';
            el.style.margin = '';
            if (Object.keys(cfg).length === 0) delete elements[id];
            _setSavedConfig(config);
            _saveSnapshot();
            _updatePropertiesPanel();
        },



        spacingInput: function(id, prop) {
            var inputs = document.querySelectorAll('#lePropertiesBody .le-spacing-input[data-prop="' + prop + '"]');
            if (!inputs || inputs.length < 4) return;
            var v = [];
            for (var j = 0; j < 4; j++) v.push(inputs[j].value || '0px');
            var joined = v[0];
            if (v[0] === v[2] && v[1] === v[3]) {
                if (v[0] === v[1]) joined = v[0];
                else joined = v[0] + ' ' + v[1];
            } else {
                joined = v[0] + ' ' + v[1] + ' ' + v[2] + ' ' + v[3];
            }
            this.setStyle(id, prop, joined);
        },

        spacingStepper: function(btn, id, prop, delta) {
            // No novo layout vertical, o input é o filho do meio (index 1) do parentNode
            var input = btn.parentNode.children[1];
            if (!input || !input.classList.contains('le-spacing-input')) return;
            var cur = parseFloat(input.value) || 0;
            var unit = input.value.replace(/[\d.\-]/g, '') || 'px';
            input.value = (cur + delta) + unit;
            this.spacingInput(id, prop);
        },

        showHelp: function() {
            var overlay = document.getElementById('leHelpOverlay');
            if (overlay) { overlay.style.display = 'flex'; return; }
            overlay = document.createElement('div');
            overlay.id = 'leHelpOverlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;';
            overlay.onclick = function(e) { if (e.target === overlay) overlay.style.display = 'none'; };
            overlay.innerHTML = '' +
                '<div style="background:#1a2a3a;border:1px solid #4a5a6a;border-radius:14px;padding:24px 28px;max-width:400px;width:90%;font-family:Outfit,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.6);">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
                        '<span style="color:#ffd700;font-size:1.3em;font-weight:bold;">❓ Como usar o Editor</span>' +
                        '<button onclick="document.getElementById(\'leHelpOverlay\').style.display=\'none\'" style="background:none;border:none;color:#aaa;font-size:1.4em;cursor:pointer;padding:2px 8px;">✕</button>' +
                    '</div>' +
                    '<div style="color:#ccc;font-size:0.9em;line-height:1.7;">' +
                        '<p style="margin-bottom:12px;"><b style="color:#7ab8ff;">📋 Barra da Esquerda (Hierarquia)</b><br>Clique em qualquer elemento da lista para <b>selecioná-lo</b>.</p>' +
                        '<p style="margin-bottom:12px;"><b style="color:#7ab8ff;">⚙️ Barra da Direita (Propriedades)</b><br>Altere <b>posição, tamanho, cores, espaçamento</b> e muito mais.</p>' +
                        '<p style="margin-bottom:12px;"><b style="color:#88ff88;">🖱️ Clique e Arraste</b><br>Segure o <b>botão esquerdo</b> sobre o elemento selecionado e arraste para <b>movê-lo</b>.</p>' +
                        '<p style="margin-bottom:12px;"><b style="color:#ffaa44;">📐 Redimensionar</b><br>Use as <b>alças</b> nos cantos e bordas do elemento para <b>redimensionar</b>.</p>' +
                        '<p style="margin-bottom:0;"><b style="color:#888;">⌨️ Atalhos:</b> <b style="color:#fff;">ESC</b> sair · <b style="color:#fff;">Ctrl+Z</b> desfazer · <b style="color:#fff;">Ctrl+Shift+Z</b> refazer</p>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(overlay);
        },

        undo: function() { _undo(); },
        redo: function() { _redo(); },

        toggleHierarchy: function() {
            _hierarchyPanel.classList.toggle('le-panel-collapsed');
        },

        toggleProperties: function() {
            _propertiesPanel.classList.toggle('le-panel-collapsed');
        },

        exportLayout: function() {
            var config = _getSavedConfig();
            var json = JSON.stringify(config, null, 2);
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'idle-craft-layout.json';
            a.click();
            URL.revokeObjectURL(url);
            if (typeof showNotification === 'function') {
                showNotification('📤 Layout Exportado!', 'Arquivo JSON salvo.', 'success');
            }
        },

        applyLayout: function() {
            // Força salvamento do estado atual e notifica o usuário
            var config = _getSavedConfig();
            _setSavedConfig(config);
            if (typeof showNotification === 'function') {
                showNotification('✅ Layout Aplicado!', 'As alterações foram salvas permanentemente.', 'success');
            }
        },

        resetAllLayout: function() {
            if (typeof showNotification === 'function') {
                showNotification('🔄 Restaurando...', 'Layout voltando ao padrão.', 'info');
            }
            // Limpa o config salvo
            localStorage.removeItem('idleCraftLayout');
            _history = [];
            _historyIndex = -1;
            // Restaura todos os elementos ao estado original (remove inline styles)
            _restoreEditorStyles();
            // Atualiza painéis
            if (_state.active) {
                _updateHierarchyPanel();
                _updatePropertiesPanel();
                _deselectAll();
            }
            if (typeof showNotification === 'function') {
                showNotification('🔄 Layout Restaurado!', 'O layout voltou ao padrão original.', 'success');
            }
        },

        importLayout: function(event) {
            var file = event.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var config = JSON.parse(e.target.result);
                    _setSavedConfig(config);
                    _applyConfigToAll(config);
                    _saveSnapshot();
                    _updatePropertiesPanel();
                    _updateHierarchyPanel();
                    if (typeof showNotification === 'function') {
                        showNotification('📥 Layout Importado!', 'Layout aplicado com sucesso.', 'success');
                    }
                } catch(err) {
                    if (typeof showNotification === 'function') {
                        showNotification('❌ Erro ao Importar', 'Arquivo JSON inválido.', 'error');
                    }
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        },

        loadLayout: function() {
            var config = _getSavedConfig();
            _applyConfigToAll(config);
        },

        // ==========================================
        // BIND DOS EVENTOS GLOBAIS (dentro da closure)
        // ==========================================
        bindEvents: function() {
            if (_bound) return;
            _bound = true;
            var self = this;

            document.addEventListener('mousemove', function(e) {
                if (_state.dragging) _onDrag(e);
                if (_state.resizing) _onResize(e);
            });

            document.addEventListener('mouseup', function(e) {
                if (_state.dragging) _endDrag(e);
                if (_state.resizing) _endResize(e);
            });

            document.addEventListener('touchmove', function(e) {
                if (_state.dragging && e.touches.length === 1) {
                    _onDrag({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
                }
                if (_state.resizing && e.touches.length === 1) {
                    _onResize({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
                }
            }, { passive: true });

            document.addEventListener('touchend', function(e) {
                if (_state.dragging) _endDrag(e);
                if (_state.resizing) _endResize(e);
            }, { passive: true });

            document.addEventListener('keydown', function(e) {
                if (!document.body.classList.contains('layout-editor-active')) return;

                if (e.key === 'Escape') {
                    self.exit();
                    e.preventDefault();
                    return;
                }

                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    self.applyLayout();
                    e.preventDefault();
                    return;
                }

                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                    _undo();
                    e.preventDefault();
                    return;
                }

                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) {
                    _redo();
                    e.preventDefault();
                    return;
                }

                if ((e.key === 'Delete' || e.key === 'Backspace') && 
                    e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    var sel = document.querySelector('.le-selected');
                    if (sel && sel.id) {
                        self.resetElement(sel.id);
                        e.preventDefault();
                    }
                }
            });

            document.addEventListener('mousedown', function(e) {
                if (!document.body.classList.contains('layout-editor-active')) return;
                if (_state.dragging || _state.resizing) return;

                var leEl = e.target.closest('.le-active');
                if (leEl) {
                    _selectElement(leEl);
                    return;
                }

                if (e.target.closest('.le-selection-overlay') || 
                    e.target.closest('.layout-editor-panel') ||
                    e.target.closest('.layout-editor-toolbar') ||
                    e.target.closest('.le-handle') ||
                    e.target.closest('.le-guide-line') ||
                    e.target.closest('.le-distance-label')) {
                    return;
                }

                _deselectAll();
            });
        }
    };
})();

// ==========================================
// INICIALIZAÇÃO
// ==========================================
(function() {
    function boot() {
        LayoutEditor.init();
        LayoutEditor.bindEvents();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(boot, 300);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(boot, 300);
        });
    }
})();
