const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find the openSettingsModal function which applies position:fixed to .modal-content
const idx = content.indexOf('content.style.position');
if (idx !== -1) {
    console.log(content.substring(idx - 300, idx + 500));
}
