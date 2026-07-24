const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, 'img', '11_pickaxe.png');
const outputPath = path.join(__dirname, 'img', '11_pickaxe_transparent.png');
const originalBackup = path.join(__dirname, 'img', '11_pickaxe_original_backup.png');

if (!fs.existsSync(originalBackup)) {
    fs.copyFileSync(inputPath, originalBackup);
}

fs.createReadStream(inputPath)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function() {
        const width = this.width;
        const height = this.height;
        const data = this.data;

        function getIdx(x, y) {
            return (y * width + x) * 4;
        }

        const visited = new Uint8Array(width * height);
        const queue = [];

        for (let x = 0; x < width; x++) {
            queue.push([x, 0]);
            queue.push([x, height - 1]);
        }
        for (let y = 0; y < height; y++) {
            queue.push([0, y]);
            queue.push([width - 1, y]);
        }

        function isBackgroundPixel(x, y) {
            const idx = getIdx(x, y);
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = (r + g + b) / 3;
            const diff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
            return brightness > 215 && diff < 35;
        }

        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const pos = y * width + x;
            if (visited[pos]) continue;
            visited[pos] = 1;

            if (isBackgroundPixel(x, y)) {
                const idx = getIdx(x, y);
                data[idx + 3] = 0;

                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }

        // Smooth edges
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pos = y * width + x;
                if (!visited[pos]) {
                    let transparentNeighbors = 0;
                    const neighbors = [
                        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
                        [x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]
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
                        if (brightness > 190) {
                            data[idx + 3] = Math.max(0, Math.floor(255 * (1 - (brightness - 190) / 65)));
                        }
                    }
                }
            }
        }

        this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
            fs.copyFileSync(outputPath, inputPath);
            console.log('Background removed successfully! Image updated at 11_pickaxe.png');
        });
    });
