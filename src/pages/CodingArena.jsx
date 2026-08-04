import React, { useState } from 'react';
import { Code } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';

const PROBLEMS = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    exampleInput: 'nums = [2, 7, 11, 15], target = 9',
    exampleOutput: '[0, 1]',
    explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9'
  },
  {
    id: 'binary-search',
    title: '2. Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`. You must write an algorithm with `O(log n)` runtime complexity.',
    exampleInput: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
    exampleOutput: '4',
    explanation: '9 exists in nums and its index is 4.',
    constraints: '1 <= nums.length <= 10^4, nums is sorted in ascending order'
  },
  {
    id: 'lru-cache',
    title: '3. LRU Cache',
    difficulty: 'Hard',
    category: 'System Design',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with `get(key)` and `put(key, value)` operations in `O(1)` average time complexity.',
    exampleInput: 'LRUCache(2), put(1, 1), put(2, 2), get(1)',
    exampleOutput: '1',
    explanation: 'Key 1 accessed, making it most recently used.',
    constraints: '1 <= capacity <= 3000, 0 <= key <= 10^4'
  }
];

export default function CodingArena() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase mb-2">
            <Code className="w-3.5 h-3.5" /> Technical Coding Assessment Arena
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live Algorithmic Assessment</h1>
        </div>
        <div className="flex items-center gap-2">
          {PROBLEMS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProblem(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedProblem.id === p.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p.title.split('.')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Problem Specs (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{selectedProblem.title}</h2>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              selectedProblem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              {selectedProblem.difficulty}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedProblem.description}</p>

          {/* Example Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sample Test Case</p>
            <p className="text-xs font-mono text-slate-800 font-semibold"><span className="text-slate-500">Input:</span> {selectedProblem.exampleInput}</p>
            <p className="text-xs font-mono text-emerald-700 font-bold"><span className="text-slate-500">Output:</span> {selectedProblem.exampleOutput}</p>
            <p className="text-[11px] text-slate-600 italic">{selectedProblem.explanation}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Constraints</p>
            <p className="text-xs font-mono text-slate-700 font-semibold">{selectedProblem.constraints}</p>
          </div>
        </div>

        {/* Right Code Editor (8 cols) */}
        <div className="lg:col-span-8">
          <CodeEditor problem={selectedProblem} />
        </div>

      </div>
    </div>
  );
}
