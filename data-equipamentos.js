// ============================================
// DATA-EQUIPAMENTOS.JS
// equipmentData, drops por inimigo,
// rarityColors, rarityNames, slotNames
// ============================================

        // ============================================
        // DADOS DE EQUIPAMENTOS
        // ============================================
        const equipmentData = {
            // ARMAS (Ferraria)
            'weapon_copper': { id: 'weapon_copper', name: 'Espada de Cobre', icon: '🗡️', slot: 'weapon', rarity: 'common', stats: { strength: 3 }, desc: 'Espada básica de cobre', craftSkill: 'smithing', craftReq: 1, ingredients: [{ type: 'bar1', qty: 2 }], price: 30, weaponSkillType: 'melee' },
            'weapon_iron':   { id: 'weapon_iron',   name: 'Espada de Ferro',  icon: '⚔️', slot: 'weapon', rarity: 'uncommon', stats: { strength: 7 }, desc: 'Espada resistente de ferro', craftSkill: 'smithing', craftReq: 20, ingredients: [{ type: 'bar2', qty: 2 }], price: 70, weaponSkillType: 'melee' },
            'weapon_silver': { id: 'weapon_silver', name: 'Lâmina de Prata',  icon: '🌙', slot: 'weapon', rarity: 'rare', stats: { strength: 14, critChance: 5 }, desc: 'Lâmina afiada de prata', craftSkill: 'smithing', craftReq: 40, ingredients: [{ type: 'bar3', qty: 2 }], price: 150, weaponSkillType: 'melee' },
            'weapon_gold':   { id: 'weapon_gold',   name: 'Sabre Dourado',    icon: '✨', slot: 'weapon', rarity: 'epic', stats: { strength: 22, critChance: 10 }, desc: 'Sabre lendário de ouro', craftSkill: 'smithing', craftReq: 65, ingredients: [{ type: 'bar4', qty: 2 }], price: 300, weaponSkillType: 'melee' },
            'weapon_mithril':{ id: 'weapon_mithril',name: 'Espada de Mitril', icon: '💫', slot: 'weapon', rarity: 'legendary', stats: { strength: 35, critChance: 15, xpBonus: 10 }, desc: 'Arma lendária de mitril', craftSkill: 'smithing', craftReq: 90, ingredients: [{ type: 'bar5', qty: 2 }], price: 600, weaponSkillType: 'melee' },

            // ARMADURAS (Ferraria)
            'armor_copper':  { id: 'armor_copper',  name: 'Armadura de Cobre', icon: '🥉', slot: 'armor', rarity: 'common', stats: { defense: 3 }, desc: 'Proteção básica de cobre', craftSkill: 'smithing', craftReq: 1, ingredients: [{ type: 'bar1', qty: 3 }], price: 40 },
            'armor_iron':    { id: 'armor_iron',    name: 'Armadura de Ferro',  icon: '⚙️', slot: 'armor', rarity: 'uncommon', stats: { defense: 8, maxHealth: 10 }, desc: 'Armadura sólida de ferro', craftSkill: 'smithing', craftReq: 20, ingredients: [{ type: 'bar2', qty: 3 }], price: 90 },
            'armor_silver':  { id: 'armor_silver',  name: 'Armadura de Prata',  icon: '🥈', slot: 'armor', rarity: 'rare', stats: { defense: 16, maxHealth: 25 }, desc: 'Armadura brilhante de prata', craftSkill: 'smithing', craftReq: 40, ingredients: [{ type: 'bar3', qty: 3 }], price: 200 },
            'armor_gold':    { id: 'armor_gold',    name: 'Armadura Dourada',   icon: '🥇', slot: 'armor', rarity: 'epic', stats: { defense: 26, maxHealth: 50 }, desc: 'Armadura majestosa de ouro', craftSkill: 'smithing', craftReq: 65, ingredients: [{ type: 'bar4', qty: 3 }], price: 400 },
            'armor_mithril': { id: 'armor_mithril', name: 'Armadura de Mitril', icon: '💫', slot: 'armor', rarity: 'legendary', stats: { defense: 40, maxHealth: 100, xpBonus: 5 }, desc: 'Armadura lendária de mitril', craftSkill: 'smithing', craftReq: 90, ingredients: [{ type: 'bar5', qty: 3 }], price: 800 },

            // CAPACETES (Ferraria)
            'helmet_copper': { id: 'helmet_copper', name: 'Elmo de Cobre',  icon: '🪖', slot: 'helmet', rarity: 'common', stats: { defense: 2 }, desc: 'Elmo básico de cobre', craftSkill: 'smithing', craftReq: 1, ingredients: [{ type: 'bar1', qty: 2 }], price: 25 },
            'helmet_iron':   { id: 'helmet_iron',   name: 'Elmo de Ferro',  icon: '⛑️', slot: 'helmet', rarity: 'uncommon', stats: { defense: 5, maxHealth: 5 }, desc: 'Elmo resistente de ferro', craftSkill: 'smithing', craftReq: 20, ingredients: [{ type: 'bar2', qty: 2 }], price: 60 },
            'helmet_mithril':{ id: 'helmet_mithril',name: 'Elmo de Mitril', icon: '👑', slot: 'helmet', rarity: 'legendary', stats: { defense: 20, maxHealth: 30, xpBonus: 15 }, desc: 'Elmo lendário de mitril', craftSkill: 'smithing', craftReq: 90, ingredients: [{ type: 'bar5', qty: 2 }], price: 500 },

            // ESCUDOS (Ferraria)
            'shield_copper': { id: 'shield_copper', name: 'Escudo de Cobre', icon: '🔰', slot: 'shield', rarity: 'common', stats: { defense: 4 }, desc: 'Escudo básico de cobre', craftSkill: 'smithing', craftReq: 1, ingredients: [{ type: 'bar1', qty: 2 }], price: 35 },
            'shield_iron':   { id: 'shield_iron',   name: 'Escudo de Ferro', icon: '🛡️', slot: 'shield', rarity: 'uncommon', stats: { defense: 10 }, desc: 'Escudo sólido de ferro', craftSkill: 'smithing', craftReq: 20, ingredients: [{ type: 'bar2', qty: 2 }], price: 80 },
            'shield_mithril':{ id: 'shield_mithril',name: 'Escudo de Mitril',icon: '⚜️', slot: 'shield', rarity: 'legendary', stats: { defense: 30, strength: 5 }, desc: 'Escudo lendário de mitril', craftSkill: 'smithing', craftReq: 90, ingredients: [{ type: 'bar5', qty: 2 }], price: 550 },

            // CALÇAS (Ferraria)
            'pants_iron':    { id: 'pants_iron',    name: 'Grevas de Ferro',  icon: '🦵', slot: 'pants', rarity: 'uncommon', stats: { defense: 6 }, desc: 'Proteção para as pernas', craftSkill: 'smithing', craftReq: 20, ingredients: [{ type: 'bar2', qty: 2 }], price: 65 },
            'pants_mithril': { id: 'pants_mithril', name: 'Grevas de Mitril', icon: '✨', slot: 'pants', rarity: 'legendary', stats: { defense: 18, speedBonus: 10 }, desc: 'Grevas lendárias de mitril', craftSkill: 'smithing', craftReq: 90, ingredients: [{ type: 'bar5', qty: 2 }], price: 480 },

            // BOTAS (Criação)
            'boots_wood':    { id: 'boots_wood',    name: 'Botas de Madeira', icon: '👢', slot: 'boots', rarity: 'common', stats: { speedBonus: 5 }, desc: 'Botas leves de madeira', craftSkill: 'crafting', craftReq: 1, ingredients: [{ type: 'wood1', qty: 3 }], price: 20 },
            'boots_oak':     { id: 'boots_oak',     name: 'Botas de Carvalho',icon: '🥾', slot: 'boots', rarity: 'uncommon', stats: { speedBonus: 12, xpBonus: 5 }, desc: 'Botas resistentes de carvalho', craftSkill: 'crafting', craftReq: 20, ingredients: [{ type: 'wood2', qty: 3 }], price: 55 },
            'boots_magic':   { id: 'boots_magic',   name: 'Botas Mágicas',    icon: '✨', slot: 'boots', rarity: 'legendary', stats: { speedBonus: 30, xpBonus: 20 }, desc: 'Botas encantadas com magia', craftSkill: 'crafting', craftReq: 90, ingredients: [{ type: 'wood5', qty: 3 }], price: 450 },

            // ANÉIS (Criação)
            'ring_wood':     { id: 'ring_wood',     name: 'Anel de Madeira',  icon: '💍', slot: 'ring', rarity: 'common', stats: { xpBonus: 5 }, desc: 'Anel simples de madeira', craftSkill: 'crafting', craftReq: 1, ingredients: [{ type: 'wood2', qty: 2 }], price: 25 },
            'ring_ebony':    { id: 'ring_ebony',    name: 'Anel de Ébano',    icon: '🖤', slot: 'ring', rarity: 'rare', stats: { xpBonus: 15, critChance: 5 }, desc: 'Anel escuro de ébano', craftSkill: 'crafting', craftReq: 40, ingredients: [{ type: 'wood4', qty: 2 }], price: 120 },
            'ring_magic':    { id: 'ring_magic',    name: 'Anel Mágico',      icon: '🌟', slot: 'ring', rarity: 'legendary', stats: { xpBonus: 30, critChance: 10, speedBonus: 10 }, desc: 'Anel infundido com magia', craftSkill: 'crafting', craftReq: 90, ingredients: [{ type: 'wood5', qty: 2 }, { type: 'bar5', qty: 1 }], price: 500 },

            // AMULETOS (Criação)
            'amulet_wood':   { id: 'amulet_wood',   name: 'Amuleto de Madeira', icon: '📿', slot: 'amulet', rarity: 'common', stats: { maxHealth: 10 }, desc: 'Amuleto protetor de madeira', craftSkill: 'crafting', craftReq: 1, ingredients: [{ type: 'wood1', qty: 2 }, { type: 'wood2', qty: 1 }], price: 30 },
            'amulet_rune':   { id: 'amulet_rune',   name: 'Amuleto Rúnico',     icon: '🔮', slot: 'amulet', rarity: 'rare', stats: { maxHealth: 30, xpBonus: 10 }, desc: 'Amuleto com runas antigas', craftSkill: 'crafting', craftReq: 40, ingredients: [{ type: 'wood3', qty: 2 }, { type: 'bar3', qty: 1 }], price: 180 },
            'amulet_dragon': { id: 'amulet_dragon', name: 'Amuleto do Dragão',  icon: '🐉', slot: 'amulet', rarity: 'legendary', stats: { maxHealth: 80, strength: 10, xpBonus: 20 }, desc: 'Amuleto lendário do dragão', craftSkill: 'crafting', craftReq: 90, ingredients: [{ type: 'wood5', qty: 2 }, { type: 'bar5', qty: 1 }], price: 700 },

            // EQUIPAMENTOS DA CRIAÇÃO (Arco, Cajado, Bastão, Escudo)
            'craftedItem2': { id: 'craftedItem2', name: 'Arco Curto',     icon: '🏹', slot: 'weapon', rarity: 'uncommon', stats: { strength: 6, critChance: 2 }, desc: 'Arco feito de madeira de carvalho', craftSkill: 'crafting', craftReq: 20, ingredients: [{ type: 'wood2', qty: 2 }], price: 20, weaponSkillType: 'distance' },
            'craftedItem3': { id: 'craftedItem3', name: 'Bastão Rúnico',   icon: '🪄', slot: 'weapon', rarity: 'rare',     stats: { strength: 12, xpBonus: 5 },     desc: 'Bastão com runas gravadas',        craftSkill: 'crafting', craftReq: 40, ingredients: [{ type: 'wood3', qty: 2 }], price: 35, weaponSkillType: 'magic' },
            'craftedItem4': { id: 'craftedItem4', name: 'Escudo Ébano',    icon: '🛡️', slot: 'shield', rarity: 'epic',     stats: { defense: 22 },                  desc: 'Escudo resistente feito de ébano', craftSkill: 'crafting', craftReq: 65, ingredients: [{ type: 'wood4', qty: 2 }], price: 55 },
            'craftedItem5': { id: 'craftedItem5', name: 'Cajado Mágico',   icon: '🔮', slot: 'weapon', rarity: 'legendary',stats: { strength: 30, critChance: 8, xpBonus: 10 }, desc: 'Cajado infundido com magia poderosa', craftSkill: 'crafting', craftReq: 90, ingredients: [{ type: 'wood5', qty: 2 }], price: 85, weaponSkillType: 'magic' },
        };

        // Receitas de equipamentos para Ferraria e Criação
        const smithingEquipRecipes = Object.values(equipmentData).filter(e => e.craftSkill === 'smithing');
        const craftingEquipRecipes = Object.values(equipmentData).filter(e => e.craftSkill === 'crafting' && !e.id.startsWith('craftedItem'));

        // Drops de equipamentos por inimigo
        const enemyEquipDrops = {
            goblin:     ['weapon_copper', 'armor_copper', 'helmet_copper'],
            esqueleto:  ['weapon_iron', 'armor_iron', 'shield_copper'],
            lobisomem:  ['weapon_silver', 'armor_silver', 'helmet_iron'],
            dragao:     ['weapon_gold', 'armor_gold', 'ring_ebony'],
            troll:      ['weapon_mithril', 'armor_mithril', 'amulet_rune']
        };

        const rarityColors = { common: '#fff', uncommon: '#4aff4a', rare: '#4a9aff', epic: '#c96ac9', legendary: '#ffd700' };
        const rarityNames  = { common: 'Comum', uncommon: 'Incomum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' };
        const slotNames    = { helmet: 'Capacete', amulet: 'Amuleto', weapon: 'Arma', armor: 'Armadura', shield: 'Escudo', ring: 'Anel', pants: 'Calças', boots: 'Botas' };
