const fs = require("fs");
let content = fs.readFileSync("src/components/WorkMode.tsx", "utf8");

// Fix double dark classes
content = content.replace(/dark:bg-white dark:bg-\[\#131314\]/g, "dark:bg-[#131314]");
content = content.replace(/dark:bg-gray-100 dark:bg-\[\#1e1f20\]/g, "dark:bg-[#1e1f20]");
content = content.replace(/dark:bg-gray-50 dark:bg-\[\#1b1b1d\]/g, "dark:bg-[#1b1b1d]");
content = content.replace(/dark:bg-gray-200 dark:bg-white\/10/g, "dark:bg-white/10");
content = content.replace(/dark:border-gray-200 dark:border-white\/5/g, "dark:border-white/5");
content = content.replace(/dark:border-gray-200 dark:border-white\/10/g, "dark:border-white/10");
content = content.replace(/dark:text-gray-900 dark:text-gray-100/g, "dark:text-gray-100");
content = content.replace(/dark:text-gray-900 dark:text-white/g, "dark:text-white");
content = content.replace(/dark:text-gray-800 dark:text-gray-200/g, "dark:text-gray-200");
content = content.replace(/dark:text-gray-600 dark:text-gray-300/g, "dark:text-gray-300");

// Fix the empty state logo and text
const oldEmptyLogo = `<div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-lg border border-gray-200 dark:border-white/5">\n                <Bot className="w-8 h-8 text-gray-700 dark:text-gray-300" />\n              </div>`;
const newEmptyLogo = `<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg mb-4 mx-auto text-xl">\n                AS\n              </div>`;
content = content.replace(oldEmptyLogo, newEmptyLogo);

// Fix the input capsule in empty state
const oldInputState = `<div className="bg-gray-100 dark:bg-[#1e1f20] rounded-2xl p-1 sm:p-2 border border-gray-300 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center shadow-lg focus-within:border-white/20 transition-colors">`;
const endOfOldInputState = `</button>\n              </div>\n            </div>`;

// Use regex to replace the entire empty state input block
const regexInputState = /<div className="bg-gray-100 dark:bg-\[\#1e1f20\] rounded-2xl[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;

const newInputState = `<div className="max-w-3xl mx-auto flex items-end bg-gray-100 dark:bg-[#1e1f20] rounded-[28px] border border-gray-200/80 dark:border-[#3c4043]/80 focus-within:border-blue-400/50 dark:focus-within:border-blue-400/30 transition-all shadow-sm hover:shadow-md p-1.5">
            {/* Plus / Attachment Button */}
            <div className="relative">
              <button 
                type="button" 
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                title="Lampiran"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>

            {/* Text Input */}
            <textarea 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAction();
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = \`\${Math.min(target.scrollHeight, 150)}px\`;
              }}
              placeholder="Kerjakan apa saja..." 
              rows={1}
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 px-2 py-2.5 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none max-h-[150px] overflow-y-auto"
            />

            {/* Model Selector */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-gray-500 dark:text-gray-400 border-none px-1 py-1 focus:outline-none focus:ring-0 cursor-pointer text-xs max-w-[100px] truncate hidden sm:block"
            >
              <option className="bg-white dark:bg-[#1e1f20]" value="gemini-2.5-flash">Gemini 2.5</option>
              <option className="bg-white dark:bg-[#1e1f20]" value="llama-3.3-70b-versatile">Llama 3.3</option>
            </select>

            {/* Send Button */}
            <button 
              onClick={() => runAction()}
              disabled={isWorking || (!taskInput.trim() && attachments.length === 0)}
              className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            </button>
          </div>`;

content = content.replace(regexInputState, newInputState);

fs.writeFileSync("src/components/WorkMode.tsx", content);
console.log("Updated WorkMode completely!");
