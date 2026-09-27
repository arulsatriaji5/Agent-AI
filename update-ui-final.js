const fs = require('fs');

const inputReplacementChat = `
          <div className="flex items-center bg-gray-100 dark:bg-[#1e1f20] rounded-full p-2 px-4 shadow-sm border border-gray-200/80 dark:border-[#3c4043]/80 max-w-3xl mx-auto w-full transition-all focus-within:shadow-md focus-within:border-blue-400/50">
            {/* Ikon Plus Kiri */}
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors shrink-0"
              >
                <Plus size={24} />
              </button>
              
              {/* Attach dropdown */}
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[#2b2d30] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-1 w-48 z-50">
                  <button
                    type="button"
                    onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Unggah Gambar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { folderInputRef.current?.click(); setShowAttachMenu(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Folder className="w-4 h-4 text-amber-500" />
                    <span>Unggah Folder</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Kolom Teks Input */}
            <textarea 
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = \`\${Math.min(target.scrollHeight, 200)}px\`;
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-white px-3 py-2.5 outline-none placeholder-gray-500 dark:placeholder-gray-400 min-w-0 resize-none max-h-[200px] overflow-y-auto text-sm" 
              placeholder="Tanyakan sesuatu kepada Agens..." 
              rows={1}
            />
            
            {/* Wrapper Kanan: Dropdown Model & Tombol Kirim */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dropdown Model ala Gemini */}
              <div className="relative hidden sm:flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-[#333538] rounded-lg px-2 py-1.5 transition-colors cursor-pointer">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 outline-none cursor-pointer appearance-none pr-4 max-w-[120px] truncate"
                >
                  <option value="gemini-2.5-flash" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Gemini 2.5 Flash</option>
                  <option value="llama3-70b-8192" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3 70B</option>
                  <option value="meta-llama/llama-3.1-8b-instruct:free" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3.1 8B</option>
                </select>
                {/* Custom Chevron karena appearance-none */}
                <div className="absolute right-1 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Ikon Pesawat Kertas (Kirim) */}
              <button 
                type="submit" 
                disabled={isLoading || (!localInput.trim() && attachments.length === 0)}
                className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>
`;

const inputReplacementWork = `
          <div className="flex items-center bg-gray-100 dark:bg-[#1e1f20] rounded-full p-2 px-4 shadow-sm border border-gray-200/80 dark:border-[#3c4043]/80 max-w-3xl mx-auto w-full transition-all focus-within:shadow-md focus-within:border-blue-400/50">
            {/* Ikon Plus Kiri */}
            <button 
              type="button" 
              onClick={() => { fileInputRef.current?.click(); }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors shrink-0"
            >
              <Plus size={24} />
            </button>
            
            {/* Kolom Teks Input */}
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
                target.style.height = \`\${Math.min(target.scrollHeight, 200)}px\`;
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-white px-3 py-2.5 outline-none placeholder-gray-500 dark:placeholder-gray-400 min-w-0 resize-none max-h-[200px] overflow-y-auto text-sm" 
              placeholder="Kerjakan apa saja..." 
              rows={1}
            />
            
            {/* Wrapper Kanan: Dropdown Model & Tombol Kirim */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dropdown Model ala Gemini */}
              <div className="relative hidden sm:flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-[#333538] rounded-lg px-2 py-1.5 transition-colors cursor-pointer">
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 outline-none cursor-pointer appearance-none pr-4 max-w-[120px] truncate"
                >
                  <option value="gemini-2.5-flash" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Gemini 2.5</option>
                  <option value="llama-3.3-70b-versatile" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3.3</option>
                </select>
                {/* Custom Chevron karena appearance-none */}
                <div className="absolute right-1 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Ikon Pesawat Kertas (Kirim) */}
              <button 
                onClick={() => runAction()}
                disabled={isWorking || (!taskInput.trim() && attachments.length === 0)}
                className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>
`;

// 1. Update ChatMode.tsx
let chatContent = fs.readFileSync('src/components/ChatMode.tsx', 'utf8');

// Replace the old input form in ChatMode
const chatInputRegex = /<form[\s\S]*?<div className="max-w-3xl mx-auto flex items-end[\s\S]*?<\/form>/;
// Ensure we inject <form> into the wrapper
const newChatInputWrapped = `<form\n          ref={formRef}\n          onSubmit={(e) => {\n            e.preventDefault();\n            const finalPrompt = folderContext ? \`\${folderContext}\\n\${localInput.trim()}\` : localInput.trim();\n            if ((finalPrompt || attachments.length > 0) && !isLoading) {\n              append({ \n                role: "user", \n                content: finalPrompt,\n                experimental_attachments: attachments.length > 0 ? attachments : undefined\n              });\n              setLocalInput("");\n              setAttachments([]);\n              setFolderContext("");\n              setFolderName("");\n            }\n          }}\n          className="max-w-3xl mx-auto w-full"\n        >\n${inputReplacementChat}\n        </form>`;
chatContent = chatContent.replace(chatInputRegex, newChatInputWrapped);

// Add SendHorizontal to imports if not present
if (!chatContent.includes("SendHorizontal")) {
  chatContent = chatContent.replace(/import { Send, Bot,/, "import { Send, Bot, SendHorizontal,");
}

fs.writeFileSync('src/components/ChatMode.tsx', chatContent);
console.log("ChatMode.tsx updated.");

// 2. Update WorkMode.tsx
let workContent = fs.readFileSync('src/components/WorkMode.tsx', 'utf8');

// Add SendHorizontal to imports
if (!workContent.includes("SendHorizontal")) {
  workContent = workContent.replace(/import { \n  Bot, /, "import { \n  Bot, \n  SendHorizontal, \n  Plus, ");
}
if (!workContent.includes("Plus, ")) {
    workContent = workContent.replace(/import { \n  Bot, /, "import { \n  Bot, \n  Plus, ");
}


// A. Empty State Replacements
const oldWorkLogo = `<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg mb-4 mx-auto text-xl">\n                  AS\n                </div>`;
const newWorkLogo = ``;

const oldWorkHeading = `<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">\n                  Apa yang harus kita kerjakan?\n                </h1>`;
const newWorkHeading = `<h2 className="text-3xl md:text-4xl font-medium text-center mb-8 bg-gradient-to-r from-blue-900 to-sky-400 dark:from-blue-400 dark:to-sky-200 bg-clip-text text-transparent">\n                  Apa yang harus kita kerjakan?\n                </h2>`;

// B. Remove Action Cards
const oldActionCards = /<div className="grid grid-cols-1 md:grid-cols-3 gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\) : \(/;
const newActionCards = `</div>\n        ) : (`

workContent = workContent.replace(oldWorkLogo, newWorkLogo);
workContent = workContent.replace(oldWorkHeading, newWorkHeading);
if (workContent.match(oldActionCards)) {
    workContent = workContent.replace(oldActionCards, newActionCards);
} else {
    console.log("Could not find action cards to remove");
}

// C. Replace Input Capsules
// In WorkMode, there are two identical capsules (one for empty state, one for sticky bottom)
// I will replace both using regex.
const workInputRegex = /<div className="max-w-3xl mx-auto flex items-end bg-gray-100[\s\S]*?<\/button>\s*<\/div>/g;

workContent = workContent.replace(workInputRegex, inputReplacementWork);

fs.writeFileSync('src/components/WorkMode.tsx', workContent);
console.log("WorkMode.tsx updated.");
