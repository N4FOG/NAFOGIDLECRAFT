const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('id="miniWikiModal"');
const start = content.indexOf('<nav class="mw-nav">', idx);
const end = content.indexOf('</nav>', start) + 6;
console.log('NAV section:');
console.log(content.substring(start, end));
