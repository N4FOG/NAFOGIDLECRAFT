// ============================================================
// GERADOR AUTOMÁTICO DE ÍCONES EMOJI 3D (PROMPTS MINIMALISTAS E DIRETOS)
// PROJETO: IDLECRAFT RPG
// ============================================================

const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = path.join(__dirname, 'img', 'generated');

const folders = ['pets', 'pocoes', 'recursos', 'equipamentos', 'profissoes', 'dungeons', 'monstros', 'ui'];
folders.forEach(folder => {
    const dirPath = path.join(baseDir, folder);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

const prompts = [
    { folder: 'equipamentos', id: 'sword1', name: 'Espada de Treino', prompt: '3D emoji icon of a wooden sword, white background' },
    { folder: 'equipamentos', id: 'sword2', name: 'Espada de Cobre', prompt: '3D emoji icon of a copper sword, white background' },
    { folder: 'equipamentos', id: 'sword3', name: 'Espada de Ferro', prompt: '3D emoji icon of an iron broadsword, white background' },
    { folder: 'equipamentos', id: 'sword4', name: 'Espada de Ouro', prompt: '3D emoji icon of a golden knight sword, white background' },
    { folder: 'equipamentos', id: 'sword5', name: 'Espada de Titânio', prompt: '3D emoji icon of a glowing purple titanium sword, white background' },
    { folder: 'equipamentos', id: 'axe', name: 'Machado Comum', prompt: '3D emoji icon of a battle axe, white background' },
    { folder: 'equipamentos', id: 'axe1', name: 'Machado de Madeira', prompt: '3D emoji icon of a wooden axe, white background' },
    { folder: 'equipamentos', id: 'axe2', name: 'Machado de Cobre', prompt: '3D emoji icon of a copper axe, white background' },
    { folder: 'equipamentos', id: 'axe3', name: 'Machado de Ferro', prompt: '3D emoji icon of an iron battle axe, white background' },
    { folder: 'equipamentos', id: 'axe4', name: 'Machado de Ouro', prompt: '3D emoji icon of a golden axe, white background' },
    { folder: 'equipamentos', id: 'axe5', name: 'Machado de Titânio', prompt: '3D emoji icon of a glowing purple titanium axe, white background' },
    { folder: 'equipamentos', id: 'pickaxe', name: 'Picareta Comum', prompt: '3D emoji icon of a mining pickaxe, white background' },
    { folder: 'equipamentos', id: 'pick1', name: 'Picareta de Madeira', prompt: '3D emoji icon of a wooden pickaxe, white background' },
    { folder: 'equipamentos', id: 'pick2', name: 'Picareta de Cobre', prompt: '3D emoji icon of a copper pickaxe, white background' },
    { folder: 'equipamentos', id: 'pick3', name: 'Picareta de Ferro', prompt: '3D emoji icon of an iron pickaxe, white background' },
    { folder: 'equipamentos', id: 'pick4', name: 'Picareta de Ouro', prompt: '3D emoji icon of a golden pickaxe, white background' },
    { folder: 'equipamentos', id: 'pick5', name: 'Picareta de Titânio', prompt: '3D emoji icon of a glowing purple titanium pickaxe, white background' },
    { folder: 'equipamentos', id: 'shield1', name: 'Escudo de Madeira', prompt: '3D emoji icon of a wooden shield, white background' },
    { folder: 'equipamentos', id: 'shield2', name: 'Escudo de Cobre', prompt: '3D emoji icon of a copper shield, white background' },
    { folder: 'equipamentos', id: 'shield3', name: 'Escudo de Ferro', prompt: '3D emoji icon of an iron knight shield, white background' },
    { folder: 'equipamentos', id: 'shield4', name: 'Escudo de Ouro', prompt: '3D emoji icon of a golden shield, white background' },
    { folder: 'equipamentos', id: 'shield5', name: 'Escudo de Titânio', prompt: '3D emoji icon of a glowing purple titanium shield, white background' },
    { folder: 'pocoes', id: 'speed_potion', name: 'Poção de Velocidade', prompt: '3D emoji icon of a yellow potion bottle, white background' },
    { folder: 'pocoes', id: 'luck_potion', name: 'Poção de Sorte', prompt: '3D emoji icon of a green potion bottle with four-leaf clover, white background' },
    { folder: 'pocoes', id: 'strength_potion', name: 'Poção de Força', prompt: '3D emoji icon of a red potion bottle, white background' },
    { folder: 'pocoes', id: 'xp_potion', name: 'Poção do Sábio', prompt: '3D emoji icon of a purple magic potion bottle, white background' },
    { folder: 'pocoes', id: 'gold_potion', name: 'Poção do Mercador', prompt: '3D emoji icon of a golden potion bottle, white background' },
    { folder: 'pocoes', id: 'instant_heal', name: 'Poção de Cura', prompt: '3D emoji icon of a red health potion bottle with heart, white background' },
    { folder: 'pocoes', id: 'fire_oil', name: 'Óleo de Fogo', prompt: '3D emoji icon of a fire potion bottle, white background' },
    { folder: 'pocoes', id: 'poison_oil', name: 'Óleo de Veneno', prompt: '3D emoji icon of a green poison bottle, white background' },
    { folder: 'pets', id: 'woodpecker', name: 'Pica-pau', prompt: '3D emoji icon of a woodpecker bird, white background' },
    { folder: 'pets', id: 'lava_salamander', name: 'Salamandra de Lava', prompt: '3D emoji icon of a fire salamander lizard, white background' },
    { folder: 'pets', id: 'golden_fish', name: 'Peixe Dourado', prompt: '3D emoji icon of a golden fish, white background' },
    { folder: 'pets', id: 'battle_wolf', name: 'Lobo de Guerra', prompt: '3D emoji icon of a wolf head, white background' },
    { folder: 'pets', id: 'crystal_dragon', name: 'Dragão de Cristal', prompt: '3D emoji icon of a crystal dragon, white background' },
    { folder: 'recursos', id: 'wood1', name: 'Madeira Comum', prompt: '3D emoji icon of a wood log, white background' },
    { folder: 'recursos', id: 'ore1', name: 'Minério de Cobre', prompt: '3D emoji icon of copper ore stone, white background' },
    { folder: 'recursos', id: 'bar1', name: 'Barra de Cobre', prompt: '3D emoji icon of a copper ingot bar, white background' },
    { folder: 'recursos', id: 'bar4', name: 'Barra de Ouro', prompt: '3D emoji icon of a gold ingot bar, white background' },
    { folder: 'recursos', id: 'gem1', name: 'Rubi', prompt: '3D emoji icon of a red ruby gem, white background' },
    { folder: 'recursos', id: 'gem3', name: 'Esmeralda', prompt: '3D emoji icon of a green emerald gem, white background' },
    { folder: 'recursos', id: 'gem5', name: 'Diamante', prompt: '3D emoji icon of a blue diamond gem, white background' },
    { folder: 'ui', id: 'inventory', name: 'Inventário', prompt: '3D emoji icon of a backpack, white background' },
    { folder: 'ui', id: 'dungeons', name: 'Dungeons', prompt: '3D emoji icon of a castle, white background' },
    { folder: 'ui', id: 'gold', name: 'Ouro', prompt: '3D emoji icon of gold coins, white background' }
];

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, (res2) => {
                    res2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                }).on('error', reject);
            } else {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            }
        }).on('error', reject);
    });
}

async function startBatchGeneration() {
    console.log(`\n🚀 INICIANDO GERAÇÃO EM LOTE DE ${prompts.length} ÍCONES (PROMPT ULTRA SIMPLES E DIRETO)...\n`);

    for (let i = 0; i < prompts.length; i++) {
        const item = prompts[i];
        const filePath = path.join(baseDir, item.folder, `${item.id}.png`);
        
        console.log(`[${i + 1}/${prompts.length}] 🎨 Gerando: ${item.name} (${item.folder}/${item.id}.png)...Prompt: "${item.prompt}"`);
        
        const encoded = encodeURIComponent(item.prompt);
        const seed = Math.floor(Math.random() * 100000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}`;

        try {
            await downloadImage(imageUrl, filePath);
            console.log(`   ✅ Salvo com sucesso! (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        } catch (err) {
            console.error(`   ❌ Erro ao gerar ${item.name}:`, err.message);
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n🎉 PROCESSO CONCLUÍDO! Todos os ícones foram gerados em: ${baseDir}\n`);
}

startBatchGeneration();
