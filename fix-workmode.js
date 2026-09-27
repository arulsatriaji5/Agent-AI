const fs = require('fs');
let content = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

// There are TWO dangling blocks, one for the empty state, one for the bottom sticky bar.
// Dangling block:
const regex = /\{\/\* Text Input \*\/\}[\s\S]*?<\/svg>\s*<\/button>\s*<\/div>/g;

content = content.replace(regex, '');

fs.writeFileSync('src/components/WorkMode.tsx', content);
console.log('Fixed dangling blocks in WorkMode.tsx');
