const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').concat(fs.readdirSync('js').map(f => path.join('js', f)));
files.forEach(f => {
    if (f.endsWith('.js') || f.endsWith('.html')) {
        const content = fs.readFileSync(f, 'utf8');
        if (content.includes('keydown') || content.includes('keyup') || content.includes('hotkey')) {
            console.log(f, 'has keydown/keyup/hotkey reference');
        }
    }
});
