const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
    if (i >= 550 && i <= 580) {
        console.log(i + 1, ':', l.trim());
    }
});
