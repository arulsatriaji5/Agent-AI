const fs = require("fs");
let content = fs.readFileSync("src/components/WorkMode.tsx", "utf8");

// Empty state logo
content = content.replace(
  /<div className="w-16 h-16 bg-gray-100 dark:bg-white\/5 rounded-full flex items-center justify-center mb-6 shadow-md">[\s\S]*?<\/div>/,
  `<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg mb-4 mx-auto text-xl">
          AS
        </div>`
);

// Empty state text
content = content.replace(
  /<h2 className="text-3xl md:text-4xl font-medium text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">[\s\S]*?<\/h2>/,
  `<h2 className="text-3xl md:text-4xl font-medium text-center mb-8 text-gray-900 dark:text-white">
          Apa yang harus kita kerjakan?
        </h2>`
);

// Input section replacement
const inputSectionStart = `<div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-100 dark:bg-gray-100 dark:bg-[#1e1f20]`;
const oldInputRegex = new RegExp(`<div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-100[\\s\\S]*?</p>\\s*</div>`, "g");

const newInputs = `
          <div className="max-w-3xl mx-auto flex items-end bg-gray-100 dark:bg-[#1e1f20] rounded-[28px] border border-gray-200/80 dark:border-[#3c4043]/80 focus-within:border-blue-400/50 dark:focus-within:border-blue-400/30 transition-all shadow-sm hover:shadow-md p-1.5">
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
              placeholder="Tuliskan instruksi analisis Anda..." 
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
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-3 hidden sm:block">
            Agens dapat melakukan kesalahan. Harap periksa informasi penting.
          </p>
        </div>`;

content = content.replace(oldInputRegex, newInputs);

fs.writeFileSync("src/components/WorkMode.tsx", content);
console.log("Updated WorkMode inputs");
