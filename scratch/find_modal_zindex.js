const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find z-index of settingsModal
const settingsIdx = content.indexOf('id="settingsModal"');
console.log('settingsModal context:');
console.log(content.substring(settingsIdx - 10, settingsIdx + 200));

// Find z-index of keybindingsModal
const kbIdx = content.indexOf('id="keybindingsModal"');
console.log('\nkeybindingsModal context:');
console.log(content.substring(kbIdx - 10, kbIdx + 200));

// Find game-modal CSS
const cssIdx = content.indexOf('.game-modal');
if (cssIdx !== -1) {
    console.log('\n.game-modal CSS:');
    console.log(content.substring(cssIdx, cssIdx + 300));
}
