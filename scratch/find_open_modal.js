const fs = require('fs');
const content = fs.readFileSync('js/ui.js', 'utf8') + fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function openSettingsModal');
if (idx !== -1) {
    console.log(content.substring(idx - 100, idx + 800));
} else {
    console.log('openSettingsModal not found');
}
