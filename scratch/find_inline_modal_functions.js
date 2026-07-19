const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
    if (i >= 430 && i <= 490) {
        console.log(i + 1, ':', l.trim());
    }
});
