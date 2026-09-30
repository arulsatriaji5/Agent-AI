const fs = require('fs');
let content = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

// Find the ArrowUp block that is dangling and remove it.
const arrowUpDangling = /\{\/\* Text Input \*\/\}[\s\S]*?<ArrowUp className="w-5 h-5" \/>\s*<\/button>\s*<\/div>/g;

content = content.replace(arrowUpDangling, '');

// Also check for the `<p className="text-center...` that was left behind after the first dangling block if any.
// Actually, let's just use regex to clean up any stray Text Input blocks that were left.
const strayTextInput = /\{\/\* Text Input \*\/\}[\s\S]*?<\/button>\s*<\/div>/g;
content = content.replace(strayTextInput, '');

fs.writeFileSync('src/components/WorkMode.tsx', content);
console.log('Fixed bottom bar');
