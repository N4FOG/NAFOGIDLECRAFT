const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('id="miniWikiModal"');
if (idx !== -1) {
    console.log(content.substring(idx - 100, idx + 2500));
} else {
    console.log('miniWikiModal not found');
}
