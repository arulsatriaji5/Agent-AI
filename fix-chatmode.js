const fs = require("fs");
let content = fs.readFileSync("src/components/ChatMode.tsx", "utf8");

content = content.replace(
  /from-blue-400 via-purple-400 to-pink-400 dark:from-gray-300 dark:via-gray-400 dark:to-gray-500/g,
  "from-blue-900 to-sky-400 dark:from-blue-400 dark:to-sky-200"
);

fs.writeFileSync("src/components/ChatMode.tsx", content);
console.log("Updated ChatMode.tsx");
