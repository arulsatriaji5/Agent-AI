const fs = require('fs');
let content = fs.readFileSync('src/components/ChatMode.tsx', 'utf8');

// Ensure SendHorizontal is imported
if (!content.includes('SendHorizontal')) {
  content = content.replace(/import \{([^}]+)\Bot,/g, 'import {$1Bot, SendHorizontal,');
}

// Replace the textarea and the right elements
const oldRegex = /\{\/\* Text Input \*\/\}[\s\S]*?<\/button>/;

const newContent = `{/* Text Input */}
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
            placeholder="Tanyakan sesuatu kepada Agens..."
            rows={1}
            className="flex-1 min-w-0 bg-transparent text-gray-900 dark:text-gray-100 px-3 py-2.5 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none max-h-[200px] overflow-y-auto"
          />

          {/* Wrapper Kanan: Dropdown Model & Tombol Kirim */}
          <div className="flex items-center gap-1 pr-1 shrink-0">
            {/* Dropdown Model Minimalis */}
            <div className="relative flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full px-3 py-1.5 transition-colors cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-700">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white outline-none cursor-pointer appearance-none pr-5 z-10"
              >
                <option value="gemini-2.5-flash" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Gemini 2.5 Flash</option>
                <option value="llama3-70b-8192" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3 70B</option>
                <option value="meta-llama/llama-3.1-8b-instruct:free" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3.1 8B</option>
              </select>
              {/* Ikon panah bawah kustom pengganti default browser */}
              <div className="absolute right-2 pointer-events-none text-gray-500 dark:text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* Tombol Kirim (Pesawat Kertas) */}
            <button 
              type="submit" 
              disabled={isLoading || (!localInput.trim() && attachments.length === 0)}
              className="p-2 ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SendHorizontal size={20} />
            </button>
          </div>`;

if (content.match(oldRegex)) {
  content = content.replace(oldRegex, newContent);
  fs.writeFileSync('src/components/ChatMode.tsx', content);
  console.log("ChatMode.tsx updated successfully.");
} else {
  console.log("Regex did not match.");
}
