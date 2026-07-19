const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const sections = ['combat', 'alchemy', 'conquistas', 'forge', 'equip', 'howto'];
sections.forEach(sec => {
    const idx = content.indexOf(`id="wsec-${sec}"`);
    if (idx !== -1) {
        const lineNum = content.substring(0, idx).split('\n').length;
        console.log(`wsec-${sec}: starts at line ${lineNum}`);
    }
});
