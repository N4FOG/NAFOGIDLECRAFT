const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find the MiniWiki content area
const idx = content.indexOf('id="miniWikiModal"');
const contentStart = content.indexOf('class="mw-content"', idx);
console.log('mw-content starts at index:', contentStart);
console.log(content.substring(contentStart, contentStart + 5000));
