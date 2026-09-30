const fs = require('fs');
let content = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

// The missing </div> for the max-w-4xl container of the empty state
content = content.replace(/\s*\)\s*:\s*\(\s*\/\* Active State: Conversational Thread \*\//, '\n          </div>\n        ) : (\n          /* Active State: Conversational Thread */');

fs.writeFileSync('src/components/WorkMode.tsx', content);
console.log("Syntax fixed");
