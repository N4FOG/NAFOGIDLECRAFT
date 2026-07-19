const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('id="settingsModal"');
if (idx !== -1) {
    const startOfModal = content.substring(idx);
    const endOfModalIndex = startOfModal.indexOf('</div>\n    </div>'); // typical nesting end
    console.log(startOfModal.substring(0, endOfModalIndex + 400));
} else {
    console.log('settingsModal not found');
}
