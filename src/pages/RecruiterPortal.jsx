import React, { useState } from 'react';
import { Users, Search, Download, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportCandidatePDF } from '../services/pdfService';

const CANDIDATES = [
  { id: 1, name: 'Alex Chen', role: 'Software Engineer', overallScore: 92, atsScore: 88, codingScore: 95, eyeContact: 90, status: 'Shortlisted', avatar: '👨‍💻' },
  { id: 2, name: 'Sarah Jenkins', role: 'Data Scientist', overallScore: 89, atsScore: 91, codingScore: 86, eyeContact: 88, status: 'Shortlisted', avatar: '👩‍💻' },
  { id: 3, name: 'Michael Vance', role: 'Full Stack Developer', overallScore: 84, atsScore: 82, codingScore: 89, eyeContact: 82, status: 'Under Review', avatar: '👨‍💼' },
  { id: 4, name: 'Priya Sharma', role: 'AI/ML Engineer', overallScore: 95, atsScore: 94, codingScore: 98, eyeContact: 94, status: 'Shortlisted', avatar: '👩‍🔬' },
];

export default function RecruiterPortal({ userProfile }) {
  const [candidates, setCandidates] = useState(() => {
    try {
      const localCompleted = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      return [...localCompleted, ...CANDIDATES];
    } catch (e) {
      return CANDIDATES;
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(() => {
    try {
      const localCompleted = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      return localCompleted.length > 0 ? localCompleted[0] : CANDIDATES[0];
    } catch (e) {
      return CANDIDATES[0];
    }
  });

  const toggleStatus = (id) => {
    setCandidates(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          const next = c.status === 'Shortlisted' ? 'Under Review' : 'Shortlisted';
          return { ...c, status: next };
        }
        return c;
      });

      // Sync custom local candidates back to localStorage
      const localCandidates = updated.filter(c => ![1, 2, 3, 4].includes(c.id));
      localStorage.setItem('completed_interviews', JSON.stringify(localCandidates));
      return updated;
    });

    // Sync selected candidate status locally
    setSelectedCandidate(prev => {
      if (prev.id === id) {
        return { ...prev, status: prev.status === 'Shortlisted' ? 'Under Review' : 'Shortlisted' };
      }
      return prev;
    });
  };

  const handleExportPDF = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    exportCandidatePDF(selectedCandidate);
  };

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold uppercase mb-2">
          <Users className="w-3.5 h-3.5" /> Recruiter Candidate Intelligence Portal
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Candidate Assessment Dashboard</h1>
        <p className="text-slate-600 text-sm mt-1">Review AI interview recordings, ATS match scores, coding performance, and shortlist top talent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Candidate List (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search candidates by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCandidate(c)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedCandidate.id === c.id
                    ? 'bg-purple-50/80 border-purple-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{c.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-purple-700">{c.overallScore}% Score</p>
                    <p className="text-[10px] text-slate-500 font-medium">ATS Fit: {c.atsScore}%</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(c.id); }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${
                      c.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {c.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Inspection Card (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <span className="text-5xl">{selectedCandidate.avatar}</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{selectedCandidate.role}</p>
            </div>
          </div>

          {/* Metric Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <p className="text-2xl font-bold font-mono text-purple-700">{selectedCandidate.overallScore}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">Overall AI Score</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <p className="text-2xl font-bold font-mono text-cyan-700">{selectedCandidate.atsScore}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">Resume ATS Score</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <p className="text-2xl font-bold font-mono text-emerald-700">{selectedCandidate.codingScore}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">Coding Assessment</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <p className="text-2xl font-bold font-mono text-indigo-700">{selectedCandidate.eyeContact}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">Eye Contact Index</p>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            Export Candidate Assessment Report
          </button>
        </div>

      </div>
    </div>
  );
}
