const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('id="settingsModal"');
if (idx !== -1) {
    console.log(content.substring(idx, idx + 400));
}
