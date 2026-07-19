const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const sections = ['forge', 'howto', 'profissoes', 'equip', 'combat', 'monsters', 'classes', 'alchemy', 'conquistas'];
sections.forEach(sec => {
    const idx = content.indexOf(`id="wsec-${sec}"`);
    const end = content.indexOf('</div>', idx + content.slice(idx).indexOf('</div>') + 5);
    const chunk = content.substring(idx, idx + 3000);
    // Find the section end which is </div> after the last mw-card
    console.log(`\n========== wsec-${sec} ==========`);
    console.log(chunk.substring(0, 1200));
    console.log('...');
});
