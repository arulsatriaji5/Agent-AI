const fs = require('fs');
let content = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-4">[\s\S]*?<\/div>\s*\)\s*:\s*\(/;
if (content.match(regex)) {
    content = content.replace(regex, ') : (');
    fs.writeFileSync('src/components/WorkMode.tsx', content);
    console.log("Action Cards removed.");
} else {
    console.log("Still could not match.");
}
