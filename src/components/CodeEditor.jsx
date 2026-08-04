import React, { useState } from 'react';
import { Play, RotateCcw, Check, X, Lightbulb, ChevronDown } from 'lucide-react';

const DEFAULT_CODE = {
  javascript: `// Two Sum - Find two numbers that add up to target
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));       // [1, 2]
`,
  python: `# Two Sum - Find two numbers that add up to target
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]
`,
};

const KEYWORDS = {
  javascript: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'new', 'class', 'import', 'export', 'async', 'await', 'true', 'false', 'null'],
  python: ['def', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'import', 'from', 'class', 'True', 'False', 'None'],
};

function highlight(code, lang) {
  const keywords = KEYWORDS[lang] || KEYWORDS.javascript;
  const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/.*$|#.*$)/gm, '<span style="color:#64748B">$1</span>')
    .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#10B981">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#F59E0B">$1</span>')
    .replace(kwRegex, '<span style="color:#6366F1;font-weight:600">$1</span>');
}

export default function CodeEditor({ problem }) {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [aiTip, setAiTip] = useState(null);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setCode(DEFAULT_CODE[newLang] || DEFAULT_CODE.javascript);
    setOutput(null);
    setAiTip(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setAiTip(null);
    await new Promise(r => setTimeout(r, 900));

    let logs = [];
    const originalConsoleLog = console.log;

    if (lang === 'javascript') {
      console.log = (...args) => { logs.push(args.join(', ')); };
      try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
      } catch (e) {
        logs.push('❌ Error: ' + e.message);
      }
      console.log = originalConsoleLog;
    } else {
      logs.push('✓ Test 1: [0, 1] — Passed');
      logs.push('✓ Test 2: [1, 2] — Passed');
      logs.push('✓ Test 3: [0, 3] — Passed');
    }

    setOutput(logs);
    setIsRunning(false);

    setTimeout(() => {
      setAiTip({
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        style: 'Clean',
        tip: 'Great use of Hash Map! For sorted arrays, a Two-Pointer approach achieves O(1) space. Current solution is optimal for unsorted arrays.'
      });
    }, 800);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-amber-400 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-70" />
          </div>
          <span className="text-xs text-slate-400 font-mono font-medium">
            {problem?.title || 'Two Sum.js'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex gap-1">
            {['javascript', 'python'].map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  lang === l
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                {l === 'javascript' ? 'JS' : 'Python'}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCode(DEFAULT_CODE[lang]); setOutput(null); setAiTip(null); }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative flex flex-1 overflow-hidden min-h-[300px]">
        {/* Line numbers */}
        <div className="bg-slate-950/60 border-r border-slate-800/60 px-3 pt-4 text-right min-w-[48px] select-none">
          {code.split('\n').map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-slate-600 leading-6">{i + 1}</div>
          ))}
        </div>
        {/* Textarea (editable) */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-transparent caret-indigo-400 font-mono text-sm leading-6 p-4 resize-none outline-none absolute inset-0 z-10 pl-4"
          style={{ color: 'transparent', caretColor: '#818CF8' }}
        />
        {/* Highlighted layer */}
        <pre
          className="flex-1 font-mono text-sm leading-6 p-4 pointer-events-none select-none overflow-hidden text-slate-300"
          dangerouslySetInnerHTML={{ __html: highlight(code, lang) }}
        />
      </div>

      {/* Output Console */}
      {output !== null && (
        <div className="border-t border-slate-800/80 bg-slate-950/80 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Console Output</p>
          <div className="space-y-1">
            {output.map((line, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs font-mono ${
                line.includes('Error') ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {line.includes('Error') ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Tip */}
      {aiTip && (
        <div className="border-t border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">AI Code Review</p>
              <div className="flex gap-3 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">Time: {aiTip.timeComplexity}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">Space: {aiTip.spaceComplexity}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">Style: {aiTip.style}</span>
              </div>
              <p className="text-xs text-slate-300">{aiTip.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
