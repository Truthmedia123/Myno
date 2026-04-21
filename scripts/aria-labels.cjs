const fs = require('fs');
const path = require('path');

const chatPath = path.join(process.cwd(), 'src/pages/Chat.jsx');
let content = fs.readFileSync(chatPath, 'utf8');

const replacements = [
  {
    search: '<button\n                        onClick={() => speak(msg.parsed.word, true)}\n                        className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary transition-colors mx-auto scale-on-press"\n                      >',
    replace: '<button\n                        onClick={() => speak(msg.parsed.word, true)}\n                        className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary transition-colors mx-auto scale-on-press"\n                        aria-label="Play"\n                      >'
  },
  {
    search: 'className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"\n                          >',
    replace: 'className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"\n                            aria-label="Play"\n                          >'
  },
  {
    search: 'title="Save to vocabulary"\n                          >',
    replace: 'title="Save to vocabulary"\n                            aria-label="Save word"\n                          >'
  },
  {
    search: 'title="Explain grammar"\n                            disabled={grammarExplanations[i] && grammarExplanations[i] !== "Generating grammar explanation..."}\n                          >',
    replace: 'title="Explain grammar"\n                            aria-label="Explain grammar"\n                            disabled={grammarExplanations[i] && grammarExplanations[i] !== "Generating grammar explanation..."}\n                          >'
  },
  {
    search: 'title="Look up word in dictionary"\n                            disabled={!!dictionaryDefinitions[i] && (Array.isArray(dictionaryDefinitions[i]) || dictionaryDefinitions[i] === "Looking up definition...")}\n                          >',
    replace: 'title="Look up word in dictionary"\n                            aria-label="Define"\n                            disabled={!!dictionaryDefinitions[i] && (Array.isArray(dictionaryDefinitions[i]) || dictionaryDefinitions[i] === "Looking up definition...")}\n                          >'
  },
  {
    search: 'isListening ? "bg-red-500" : "bg-primary"\n            )}\n          >',
    replace: 'isListening ? "bg-red-500" : "bg-primary"\n            )}\n            aria-label="Record voice"\n          >'
  },
  {
    search: 'className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:bg-primary/90"\n          >',
    replace: 'className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:bg-primary/90"\n            aria-label="Send message"\n          >'
  }
];

replacements.forEach(({search, replace}) => {
  // Normalize search and actual content newlines to standard \n
  const searchRegex = new RegExp(search.replace(/\r?\n/g, '\\s*\\r?\\n\\s*').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  
  // Actually, string replace with custom spacing regex
  const regexBasedSearch = search
    .split('\n')
    .map(line => line.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape special characters
    .join('\\s*\\r?\\n\\s*');
    
  const r = new RegExp(regexBasedSearch, 'g');
  console.log('Replacing...', search.slice(0, 30));
  content = content.replace(r, replace);
});

fs.writeFileSync(chatPath, content, 'utf8');
console.log('ARIA labels applied successfully!');
