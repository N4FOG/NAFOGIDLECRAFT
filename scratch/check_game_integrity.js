const fs = require('fs');
const path = require('path');

// 1. Load index.html
const htmlContent = fs.readFileSync('index.html', 'utf8');

// 2. Load all JS files in js/ and root
const jsDir = 'js';
const jsFiles = fs.readdirSync(jsDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(jsDir, f))
    .concat(['data-profissoes.js', 'data-recursos.js', 'data-equipamentos.js']);

console.log('Analyzing files:', jsFiles);

// Extract all defined functions and variables
const definedGlobals = new Set([
    'gameState', 'ngState', 'resources', 'characterClasses', 'gameClasses', 'toolsData', 'pets',
    'equipmentData', 'rarityColors', 'rarityNames', 'slotNames', 'localStorage', 'window', 'document',
    'console', 'Math', 'confirm', 'alert', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout',
    'parseInt', 'parseFloat', 'isNaN', 'Date', 'JSON', 'event', 'activePage', 'lastActivePage',
    'location', 'applyCustomTheme', 'closeModal', 'tools', 'recipes', 'dungeonsData'
]);

const declaredFunctions = new Map(); // name -> file
const declaredVariables = new Map(); // name -> file

jsFiles.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');
    
    // Simple regex for function declarations: function name(...)
    const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
    let match;
    while ((match = funcRegex.exec(code)) !== null) {
        declaredFunctions.set(match[1], file);
        definedGlobals.add(match[1]);
    }

    // Regex for var/let/const declarations at root level (or close to it)
    const varRegex = /(?:var|let|const)\s+([a-zA-Z0-9_]+)\s*=/g;
    while ((match = varRegex.exec(code)) !== null) {
        declaredVariables.set(match[1], file);
        definedGlobals.add(match[1]);
    }
});

console.log(`\nFound ${declaredFunctions.size} functions and ${declaredVariables.size} variables.`);

// 3. Extract onclick and other handlers from HTML
const htmlHandlers = [];
const handlerRegex = /\son[a-z]+="([^"]+)"/gi;
let htmlMatch;
while ((htmlMatch = handlerRegex.exec(htmlContent)) !== null) {
    const action = htmlMatch[1].trim();
    // Get function name call (e.g. "changeTheme('stark')" -> "changeTheme")
    const funcCallMatch = action.match(/^([a-zA-Z0-9_]+)\s*\(/);
    if (funcCallMatch) {
        htmlHandlers.push({ action, funcName: funcCallMatch[1], raw: htmlMatch[0] });
    } else {
        // e.g. "scrollToWikiSection('monsters')" or inline statements
        const words = action.split(/[^a-zA-Z0-9_]+/);
        words.forEach(w => {
            if (w && !['true', 'false', 'null', 'return', 'this', 'if', 'else', 'event'].includes(w)) {
                htmlHandlers.push({ action, funcName: w, raw: htmlMatch[0] });
            }
        });
    }
}

// 4. Verify HTML Handlers
console.log('\n--- VERIFYING HTML EVENT HANDLERS ---');
const missingHandlers = [];
htmlHandlers.forEach(h => {
    if (!definedGlobals.has(h.funcName)) {
        // Double check: is it in index.html scripts?
        const inlineScriptRegex = new RegExp('function\\s+' + h.funcName + '\\s*\\(', 'g');
        if (!inlineScriptRegex.test(htmlContent)) {
            missingHandlers.push(h);
        }
    }
});

if (missingHandlers.length > 0) {
    console.warn('⚠️ Found potentially missing/undefined functions called from HTML:');
    // Deduplicate
    const uniqueMissing = Array.from(new Set(missingHandlers.map(h => h.funcName)));
    uniqueMissing.forEach(name => {
        const matching = missingHandlers.find(h => h.funcName === name);
        console.log(`- "${name}" (called in: ${matching.raw})`);
    });
} else {
    console.log('✅ All functions called from HTML are defined in JS modules!');
}

// 5. Verify Cross-module calls and potential reference errors
console.log('\n--- VERIFYING CROSS-MODULE JS REFERENCES ---');
const referenceErrors = [];
jsFiles.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');
    // Find all identifiers used in the code (words that look like variables/functions)
    const words = code.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const uniqueWords = Array.from(new Set(words));
    
    uniqueWords.forEach(w => {
        // Ignore JS keywords
        if ([
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
            'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
            'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
            'void', 'while', 'with', 'yield', 'let', 'static', 'enum', 'await', 'null', 'undefined',
            'true', 'false', 'any', 'string', 'number', 'boolean', 'symbol', 'Map', 'Set', 'Array',
            'Object', 'RegExp', 'Error', 'Promise'
        ].includes(w)) {
            return;
        }
        
        // If it starts with a number or is all uppercase, typically ignore constants or standard attributes
        if (/^[0-9_]/.test(w)) return;
        
        // Check if it is defined anywhere
        if (!definedGlobals.has(w)) {
            // Check if it is a local variable/parameter in the file
            // (Simple heuristic: defined via function parameters or local var inside functions)
            // For a highly accurate check, we can check if it is defined in the same file via some pattern,
            // otherwise flag as potential global reference check.
            const localDeclRegex = new RegExp('\\b(?:var|let|const|function)\\s+' + w + '\\b|\\b' + w + '\\s*\\(|\\bfunction\\s+\\w+\\s*\\([^)]*\\b' + w + '\\b');
            if (!localDeclRegex.test(code)) {
                referenceErrors.push({ file, word: w });
            }
        }
    });
});

console.log(`Scanned ${jsFiles.length} modules for reference consistency.`);
const suspicious = referenceErrors.filter(e => {
    // Filter out DOM element IDs since they can be accessed globally on window,
    // e.g. "themeBgPicker", "sidebarAvatar", etc.
    const isDomId = htmlContent.includes(`id="${e.word}"`) || htmlContent.includes(`id='${e.word}'`);
    // Filter out standard browser APIs or commonly used variables
    const isCommon = ['e', 'i', 'j', 'k', 'x', 'y', 'el', 'btn', 'res', 'qty', 'val', 'item', 'req', 'cls', 'lvl', 'xp', 'cb', 'fs', 'path', 'require', 'module', 'exports'].includes(e.word);
    return !isDomId && !isCommon;
});

if (suspicious.length > 0) {
    console.log('\n🔍 Reviewing potential undefined variable/function references:');
    // Group by file
    const grouped = {};
    suspicious.forEach(e => {
        if (!grouped[e.file]) grouped[e.file] = [];
        grouped[e.file].push(e.word);
    });
    for (let f in grouped) {
        console.log(`In file ${f}:`);
        console.log(`  Potential undefined terms: ${Array.from(new Set(grouped[f])).join(', ')}`);
    }
} else {
    console.log('✅ No obvious undefined globals or missing references found in any JS file!');
}

console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
