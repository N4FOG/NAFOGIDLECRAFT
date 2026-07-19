# Project knowledge

This file gives Freebuff context about your project: goals, commands, conventions, and gotchas.

## What it is
**Idle Craft** — an idle/incremental RPG game (Melvor Idle-style) built 100% in vanilla HTML/CSS/JS. Players gather resources, craft equipment, fight in an arena, explore dungeons, collect pets, research technologies, brew alchemy potions, and automate via workers. 

Language: **Portuguese (BR)** throughout UI and code. The `index.html` file contains both the HTML structure and inline `<script>` code. The `js/` modules are loaded via `<script src="...">` tags from `index.html`.

## Quickstart
- **Run the game**: Open `index.html` in any modern browser. No build step, no server needed.
- **Electron desktop app**: `node main.js` launches the Electron wrapper (requires `npm install electron` first). **Note:** `main.js` loads `A1GAME - OFICIAL V3 - JOGADOR.html`, not `index.html` — if running the Electron app, rename or symlink accordingly.
- **Live Server**: Use VS Code Live Server or any static file server for auto-reload during development.
- **Development**: Edit `index.html`, `style.css`, or any `.js` file and refresh the browser.

## Architecture
- **Entry point**: `index.html` — contains all HTML markup + inline JavaScript for: menus, keybindings, settings, modal logic, specialization systems (forge, sawmill), character creation, theme management, notification styles, keybindings config UI, and the main game loop init.
- **Styles**: `style.css` — CSS variables for theming (6 House color schemes), responsive layout (sidebar grid), modals, animations (confetti, floating text, screen shake, level-up glow, element flash), layout editor styles. Two Google Fonts: **Outfit** (UI text) and **Cinzel** (titles).
- **Game data** (loaded as `<script>` tags, in order):
  - `data-recursos.js` — resources, recipes, pets, potions, enemies, crafting/smithing/enchanting recipes, XP table, tools
  - `data-equipamentos.js` — equipment database, drops, rarity colors/names
  - `data-profissoes.js` — character classes, 6 Houses (Guardian of the North, Lions of Gold, Lords of Fire, Black Sea Brotherhood, Eternal Gardens, The Last Guard), character avatars/races divided into 5 race groups
- **Game logic** (loaded as `<script>` tags after data files, in exact order):
  - `js/core.js` — game loop, tick system, save/load, XP/gold calculations, custom theme system (color picker, font selection, presets)
  - `js/utils.js` — helper functions, number formatting, random, **emoji-to-image system** (`resolveIcon`, `getItemIconHtml`, `emojiToImagePath`), **visual effects system** (`spawnConfetti`, `spawnFloatingText`, `triggerScreenShake`, `flashElement`, `triggerLevelUpEffect`, `triggerRareDropEffect`, `triggerCombatVictoryEffect`), effect container management, coordinate helpers
  - `js/achievements.js` — achievement system (triggers confetti on unlock)
  - `js/pets.js` — pet system (activation/enshrinement effects)
  - `js/tech.js` — technology upgrades (gathering, combat, crafting, alchemy trees)
  - `js/camp.js` — camp/property management with buildings: farm, sawmill, forge, stable, library, tavern, workerCamp
  - `js/dungeons.js` — dungeon system
  - `js/menu.js` — main menu, new game screen, character creation
  - `js/ui.js` — UI rendering, notifications, buff display, sidebar, multiplayer city features (ranking modal)
  - `js/firebase-service.js` — Firebase integration (leaderboard, World Boss, Wishing Well) — **NOTE**: loaded as `<script type="module">`, the only module script in the project
  - `js/gathering.js` — woodcutting, mining, fishing, herbalism logic (floating text on gather)
  - `js/cooking.js` — cooking skill
  - `js/crafting.js` — crafting skill
  - `js/alchemy.js` — potion brewing
  - `js/enchanting.js` — enchanting skill
  - `js/smithing.js` — smithing skill
  - `js/combat.js` — arena combat system with 90 waves across 9 stages (ice, fire, water, wind, earth, dark, holy, lightning, legendary), class skills, elemental weaknesses, enemy passives, shop items (victory/defeat screen effects, rare drop effects)
  - `js/layout-editor.js` — visual layout editor for UI customization (drag, resize, z-index, undo/redo, properties panel)
  - `js/worldboss.js` — global World Boss system via Firebase
- **External services**:
  - `js/firebase-service.js` — connects to Firebase Firestore (`nafog-idle-game` project) for: leaderboard ranking, World Boss (global boss with shared HP), Wishing Well (community gold sink with global events)
- **Assets**:
  - `img/` — custom icon images (currently `tree.png` for 🌳 emoji). Mapped in `emojiToImagePath` inside `js/utils.js`.
- **Effects Libray**: `Effects Libray/` — biblioteca de efeitos visuais CSS reutilizáveis:
  - `demo.html` — demonstração interativa com todos os efeitos
  - `css/effects.css` — classes de brilho (`.glow-gold`, `.glow-blue`, `.glow-purple`, `.legendary`, `.rare`, `.epic`)
  - `css/animations.css` — animações (`.float`, `.pulse`, `.spin`, `.bounce`)
  - As classes estão integradas no `style.css` do jogo na seção `EFFECTS LIBRAY`
  - **Categoria 5** (20 efeitos novos): Partículas via box-shadow (neve, chuva, vagalumes, bolhas, brasas, confetes, estrelas, pó mágico) + Transições avançadas (morphElastic, perspectiveFlip, cardSwipe, doorOpen, ripple, glitchIntense, scanline, neonSign, focusIn, slideReveal)
- **Scratch scripts**: `scratch/` — utility/debug scripts for exploring the codebase

## Data Flow
- Global `gameState` object holds all player progress (resources, equipment, skills, combat, settings, property, workers, arena, pets, tech, alchemy, dungeons). Initialized in `js/core.js`.
- Persisted to `localStorage` under key `'idleCraftSave'` via `saveGame()`.
- Loaded on start via `loadGame()`; auto-save interval runs every 60 seconds.
- Property tick runs every 10 seconds.
- UI progress bars update every 50ms.
- **Firebase**: Leaderboard updates throttle to every 15 seconds. World Boss damage syncs every 10 seconds.

## Visual Effects System
Located in `js/utils.js`. Global functions available everywhere:
- `spawnConfetti(x, y, count, colors)` — particle burst at position
- `spawnFloatingText(x, y, text, options)` — floating text (supports types: xp, gold, damage, heal, item, special)
- `triggerScreenShake(intensity, duration)` — screen shake on `.game-container`
- `flashElement(element, color, bgColor, duration)` — flash highlight on an element
- `triggerLevelUpEffect(element)` — golden glow + confetti + floating text
- `triggerRareDropEffect(icon, name)` — purple confetti + special text
- `triggerCombatVictoryEffect()` — victory confetti + text
- Effects rendered in `#effectContainer` (fixed, pointer-events: none, z-index: 99999)

## Icon System (Emoji → Image)
Located in `js/utils.js`:
- `emojiToImagePath` map: emoji → `img/*.png` path
- `resolveIcon(emoji)` — returns `<img>` HTML if mapped, else raw emoji
- `getItemIconHtml(key)` — like `getItemIcon()` but returns HTML with `<img>` fallback
- Used in camp.js and ui.js tooltips. Add new entries to `emojiToImagePath` and place images in `img/`.
- CSS class `.emoji-icon-img` sizes icons contextually (resource, pet, menu, notification, etc.)

## Conventions
- **Language**: Portuguese (comments, UI strings, variable names).
- **Theme system**: 6 CSS classes (`class-guardiao_norte`, `class-leao_ouro`, `class-senhor_fogo`, `class-mar_negro`, `class-jardim_eterno`, `class-ultima_guarda`) toggle CSS variables via `document.body.className`. Custom themes override via `gameState.customThemeColors` with `applyCustomTheme()`.
- **Modals**: Each modal is a `<div>` with class `game-modal`, toggled via `display: flex/none`. The settings modal and keybindings modal are draggable via `makeDraggable()`.
- **Pages**: Each game section is a `<div class="content-page">`, shown via `showPage(pageName)`.
- **Notifications**: Toast notifications in the top-right corner via `showNotification()`. Configurable style (style1-3), max count, font size, per-category toggles.
- **Equipment slots**: 8 slots (helmet, amulet, weapon, armor, shield, ring, pants, boots). Items have durability, rarity, and variable attributes.
- **Skills**: Each has level 1–50, XP bar, and resource tiers (1–5, unlocked at levels 1,2,3,4,5). Weapon skills (melee, distance, magic, shielding) level by use.
- **Property buildings**: farm, sawmill (with blade durability + spec system), forge (with heat/fuel + spec system), stable, library, tavern, workerCamp.
- **Specializations**: Forge (artisan, founder, spark, flameMaster) and Sawmill (brute, collector, swiftSaw, amberMiner) — unlocked by skill level, selectable via modals.
- **Keyboard shortcuts**: Defined in `_defaultKeybinds` (keys 1-9, i, b, m, p, a, d, t, n). Customizable via settings modal. Ctrl/Meta/Alt combos never intercepted.
- **Dev mode**: Toggle via settings (`gameState.settings.devMode`). Shows telemetry panel (FPS, speed bonuses, save latency).
- **Layout editor**: Toggle via `LayoutEditor.toggle()`. Editable elements have class `layout-editable`. Config saved to `localStorage` key `'idleCraftLayout'`.
- **Firebase multiplayer features**: World Boss (global HP pool), Wishing Well (community gold sink → global events), Leaderboard (top 50 players).

## Effects Libray — Integração no Jogo
- `glitchIntense` aplicado nos inimigos da arena (`combat.js`) quando HP < 30% — adiciona/remove classe em `renderArenaHPBars()`

## Things to Avoid
- **Do not add new JS frameworks or dependencies** — the game is intentionally vanilla.
- **Do not change the save key** (`idleCraftSave`) or save format without migration logic.
- **Do not break the script loading order** in `index.html`: data files **before** logic files.
- **Ctrl/Cmd key handling** — keyboard shortcuts intentionally skip when Ctrl/Meta/Alt is pressed to avoid interfering with browser shortcuts.
- **Don't add `<script>` type="module"** — all scripts use global scope and IIFE patterns. Only `js/firebase-service.js` is a module.
- **Don't modify firebase config** (`js/firebase-service.js`) unless migrating to a new Firebase project.
- **#effectContainer** is the global effects overlay — never delete or hide this element.
- **emojiToImagePath** in `js/utils.js` — add new image mappings here, not inline.
