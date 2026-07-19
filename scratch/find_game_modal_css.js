const fs = require('fs');
const content = fs.readFileSync('style.css', 'utf8');

const idx = content.indexOf('.game-modal');
if (idx !== -1) {
    console.log(content.substring(idx, idx + 400));
}
