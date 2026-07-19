const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('content.style.position') || l.includes("content.style.zIndex") || l.includes("modal-content") && l.includes("z-index")) {
        console.log(i + 1, ':', l.trim());
    }
});
