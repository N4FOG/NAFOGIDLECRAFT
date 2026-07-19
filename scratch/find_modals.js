const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('class="modal"') || l.includes('id="settingsModal"')) {
        console.log(i + 1, ':', l.trim());
    }
});
