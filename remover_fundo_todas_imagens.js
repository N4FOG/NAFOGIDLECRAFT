// ============================================================
// REMOVER DE FUNDO EM LOTE PARA TODAS AS IMAGENS EM img/
// PROJETO: IDLECRAFT RPG
// ============================================================

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const imgDir = path.join(__dirname, 'img');

function getImagesRecursively(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getImagesRecursively(filePath));
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.png' && !file.includes('_backup') && !file.includes('_transparent')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function processImageBackground(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const png = PNG.sync.read(buffer);

        const width = png.width;
        const height = png.height;
        const data = png.data;

        function getIdx(x, y) {
            return (y * width + x) * 4;
        }

        // BFS flood fill starting from borders
        const visited = new Uint8Array(width * height);
        const queue = [];

        // Push border pixels
        for (let x = 0; x < width; x++) {
            queue.push([x, 0]);
            queue.push([x, height - 1]);
        }
        for (let y = 0; y < height; y++) {
            queue.push([0, y]);
            queue.push([width - 1, y]);
        }

        // Color check for white/light background
        function isWhiteBackground(x, y) {
            const idx = getIdx(x, y);
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // If already transparent, treat as background
            if (a < 50) return true;

            const brightness = (r + g + b) / 3;
            const diff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
            
            // White / light grey threshold (brightness > 205, low saturation)
            return brightness > 205 && diff < 40;
        }

        let head = 0;
        let removedCount = 0;

        while (head < queue.length) {
            const [x, y] = queue[head++];
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const pos = y * width + x;
            if (visited[pos]) continue;
            visited[pos] = 1;

            if (isWhiteBackground(x, y)) {
                const idx = getIdx(x, y);
                data[idx + 3] = 0; // set alpha = 0
                removedCount++;

                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }

        // Edge Antialiasing (smooth transition around icon border)
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pos = y * width + x;
                if (!visited[pos]) {
                    let transparentNeighbors = 0;
                    const neighbors = [
                        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
                    ];
                    neighbors.forEach(([nx, ny]) => {
                        const nPos = ny * width + nx;
                        if (visited[nPos]) transparentNeighbors++;
                    });

                    if (transparentNeighbors > 0) {
                        const idx = getIdx(x, y);
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        const brightness = (r + g + b) / 3;
                        if (brightness > 180) {
                            data[idx + 3] = Math.max(0, Math.floor(255 * (1 - (brightness - 180) / 75)));
                        }
                    }
                }
            }
        }

        if (removedCount > 0) {
            const outBuffer = PNG.sync.write(png);
            fs.writeFileSync(filePath, outBuffer);
            return { success: true, removedCount };
        } else {
            return { success: true, removedCount: 0, note: 'Already transparent or non-white' };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function startBatchRemoval() {
    const images = getImagesRecursively(imgDir);
    console.log(`\n🚀 INICIANDO REMOÇÃO DE FUNDO EM ${images.length} IMAGENS...\n`);

    let processed = 0;
    let errors = 0;

    for (let i = 0; i < images.length; i++) {
        const filePath = images[i];
        const relPath = path.relative(imgDir, filePath);
        
        process.stdout.write(`[${i + 1}/${images.length}] 🎨 Processando: ${relPath}... `);
        
        const res = processBackground(filePath);
        if (res.success) {
            if (res.removedCount > 0) {
                console.log(`✅ Fundo removido! (${res.removedCount} px)`);
            } else {
                console.log(`ℹ️ Sem fundo branco para remover`);
            }
            processed++;
        } else {
            console.log(`❌ Erro: ${res.error}`);
            errors++;
        }
    }

    console.log(`\n🎉 PROCESSO CONCLUÍDO! ${processed} imagens processadas com sucesso. (${errors} erros)\n`);
}

function processBackground(filePath) {
    return processImageBackground(filePath);
}

startBatchRemoval();
