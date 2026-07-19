const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all mw-section ids
const regex = /id="wsec-(\w+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log('Section:', match[1]);
}
