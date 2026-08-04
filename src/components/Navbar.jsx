import React, { useState } from 'react';
import { 
  Bot, 
  Video, 
  FileText, 
  Code, 
  BarChart3, 
  Key, 
  Globe, 
  Briefcase, 
  Sparkles,
  Users
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

export default function Navbar({ activeTab, setActiveTab, selectedLang, setSelectedLang }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(GeminiService.getApiKey());
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = () => {
    GeminiService.setApiKey(apiKeyInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'interview', label: 'AI Interview Chamber', icon: Video },
    { id: 'resume', label: 'Resume ATS Engine', icon: FileText },
    { id: 'coding', label: 'Coding Arena', icon: Code },
    { id: 'analytics', label: 'Performance Analytics', icon: Sparkles },
    { id: 'recruiter', label: 'Recruiter Portal', icon: Users },
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-[#080C14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-400 tracking-tight">
                  Interview<span className="text-indigo-400">IQ</span> AI
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  PRO
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Controls Right */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative group">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 border border-slate-700/60 cursor-pointer">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <select 
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* API Key Modal Button */}
              <button
                onClick={() => setShowKeyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/70 text-xs font-medium transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">API Key</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-indigo-500/30 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Configure Gemini API Key
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              InterviewIQ AI operates seamlessly with our smart built-in AI simulator. Enter your Gemini API key for live real-time LLM inference.
            </p>

            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm mb-4"
            />

            {isSaved && (
              <div className="mb-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-center">
                ✓ Gemini API Key Saved Successfully!
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
