import React, { useState } from 'react';
import { 
  Bot, 
  Video, 
  FileText, 
  Code, 
  BarChart3, 
  Key, 
  Globe, 
  Sparkles,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

export default function Navbar({ activeTab, setActiveTab, selectedLang, setSelectedLang }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(GeminiService.getApiKey());
  const [showKeyText, setShowKeyText] = useState(false);
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
    { id: 'interview', label: 'AI Interview', icon: Video, badge: 'Live' },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'coding', label: 'Coding Arena', icon: Code },
    { id: 'analytics', label: 'Analytics', icon: Sparkles },
    { id: 'recruiter', label: 'Recruiter Portal', icon: Users },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Enterprise Logo */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 flex items-center justify-center p-[2px] shadow-sm group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Interview<span className="text-indigo-600">IQ</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ENTERPRISE AI
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {item.label}
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Controls Right */}
            <div className="flex items-center gap-3">
              {/* System Status Pill */}
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>AI Models Online</span>
              </div>

              {/* Language Selector */}
              <div className="relative group">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <Globe className="w-3.5 h-3.5 text-cyan-600" />
                  <select 
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-transparent text-slate-800 outline-none cursor-pointer text-xs font-semibold"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang} className="bg-white text-slate-900">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* API Key Modal Button */}
              <button
                onClick={() => setShowKeyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">API Key</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white p-7 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl relative">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5 mb-2">
              <Key className="w-5 h-5 text-indigo-600" />
              Configure Gemini API Key
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              InterviewIQ AI operates seamlessly with our smart built-in AI simulator. Enter your Gemini API key for live real-time LLM inference.
            </p>

            <div className="relative mb-4">
              <input
                type={showKeyText ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-indigo-200 text-slate-900 font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-colors pr-10 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowKeyText(!showKeyText)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                title={showKeyText ? "Hide key" : "Show key"}
              >
                {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isSaved && (
              <div className="mb-4 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
                ✓ Gemini API Key Saved Successfully!
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
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
