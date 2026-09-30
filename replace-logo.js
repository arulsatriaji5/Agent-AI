const fs = require('fs');
let content = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

const regex = /<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg mb-4 mx-auto text-xl">\s*AS\s*<\/div>\s*<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">\s*Apa yang harus kita kerjakan\?\s*<\/h1>/g;

const replacement = `<img src="/logo_1.png" alt="Agens" className="h-14 w-auto mx-auto mb-6 drop-shadow-md" />\n              <h2 className="text-3xl md:text-4xl font-medium text-center mb-8 bg-gradient-to-r from-blue-900 to-sky-400 dark:from-blue-400 dark:to-sky-200 bg-clip-text text-transparent">\n                Apa yang harus kita kerjakan?\n              </h2>`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/WorkMode.tsx', content);
    console.log("Logo replaced successfully.");
} else {
    console.log("Regex did not match.");
}
