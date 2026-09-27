const fs = require("fs");
let content = fs.readFileSync("src/components/Sidebar.tsx", "utf8");

// We need to move `const sidebarContent = ...` before `if (!isSidebarOpen) {`
const ifBlockRegex = /\/\/ --- Collapsed sidebar \(icons only\) ---[\s\S]*?if \(!isSidebarOpen\) \{[\s\S]*?return \([\s\S]*?<>\s*<aside[\s\S]*?<\/aside>\s*\{isMobileSidebarOpen && <MobileDrawer close=\{[\s\S]*?\} \/>\}\s*<\/>\s*\);\s*\}/;
const ifBlockMatch = content.match(ifBlockRegex);

const sidebarContentRegex = /\/\/ --- Full expanded sidebar ---[\s\S]*?const sidebarContent = \([\s\S]*?<\/aside>\s*\);/;
const sidebarContentMatch = content.match(sidebarContentRegex);

if (ifBlockMatch && sidebarContentMatch) {
  content = content.replace(ifBlockMatch[0], "");
  content = content.replace(sidebarContentMatch[0], sidebarContentMatch[0] + "\n\n  " + ifBlockMatch[0]);
  fs.writeFileSync("src/components/Sidebar.tsx", content);
  console.log("Fixed Sidebar.tsx ReferenceError");
} else {
  console.log("Could not find regex matches in Sidebar.tsx");
}
