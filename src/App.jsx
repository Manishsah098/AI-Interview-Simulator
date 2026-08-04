import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveInterview from './pages/LiveInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CodingArena from './pages/CodingArena';
import Analytics from './pages/Analytics';
import RecruiterPortal from './pages/RecruiterPortal';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLang, setSelectedLang] = useState('English');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'interview' && <LiveInterview language={selectedLang} />}
        {activeTab === 'resume' && <ResumeAnalyzer />}
        {activeTab === 'coding' && <CodingArena />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'recruiter' && <RecruiterPortal />}
        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 <span className="text-slate-900 font-bold">InterviewIQ AI</span> – Multi-Modal AI Interview Assessment Platform.</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">Documentation</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
