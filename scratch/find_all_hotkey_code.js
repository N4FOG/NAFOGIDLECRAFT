const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find line numbers for key hotkey areas
const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('ctrlKey') || l.includes("key === 'c'") || l.includes("key === 'i'") || l.includes("key === 'q'") || l.includes("keybindings")) {
        console.log(i + 1, ':', l.trim());
    }
});
