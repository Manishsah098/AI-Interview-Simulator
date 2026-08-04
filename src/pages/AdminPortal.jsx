import React, { useState } from 'react';
import { 
  ShieldCheck, UserPlus, Search, Filter, Trash2, Edit3, 
  Send, Download, CheckCircle2, XCircle, Clock, AlertCircle, 
  Sparkles, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportCandidatePDF } from '../services/pdfService';

const INITIAL_CANDIDATES = [
  { id: 101, name: 'Alex Chen', email: 'alex.chen@tech.com', role: 'Software Engineer', exp: '3 yrs', overallScore: 92, atsScore: 88, status: 'Shortlisted', date: '2026-08-04' },
  { id: 102, name: 'Sarah Jenkins', email: 'sarah.j@ai-labs.org', role: 'Data Scientist', exp: '4 yrs', overallScore: 89, atsScore: 91, status: 'Offered', date: '2026-08-03' },
  { id: 103, name: 'Michael Vance', email: 'mvance@devstudio.io', role: 'Full Stack Developer', exp: '2 yrs', overallScore: 84, atsScore: 82, status: 'Pending', date: '2026-08-02' },
  { id: 104, name: 'Priya Sharma', email: 'priya.sharma@mlcorp.com', role: 'AI/ML Engineer', exp: '5 yrs', overallScore: 95, atsScore: 94, status: 'Shortlisted', date: '2026-08-01' },
  { id: 105, name: 'David Kim', email: 'dkim@securesys.com', role: 'Cybersecurity Analyst', exp: '3 yrs', overallScore: 78, atsScore: 80, status: 'Rejected', date: '2026-07-30' },
];

export default function AdminPortal() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    role: 'Software Engineer',
    exp: '2 yrs',
    status: 'Pending'
  });

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.email) return;

    const candidate = {
      id: Date.now(),
      ...newCandidate,
      overallScore: Math.round(75 + Math.random() * 20),
      atsScore: Math.round(80 + Math.random() * 15),
      date: new Date().toISOString().split('T')[0]
    };

    setCandidates([candidate, ...candidates]);
    setNewCandidate({ name: '', email: '', role: 'Software Engineer', exp: '2 yrs', status: 'Pending' });
    setShowAddModal(false);

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleExportPDF = (candidate) => {
    exportCandidatePDF(candidate);
  };

  const copyInviteLink = (id) => {
    const link = `${window.location.origin}/#interview?ref=${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filtered Candidate List
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // System Stats
  const totalCount = candidates.length;
  const shortlistedCount = candidates.filter(c => c.status === 'Shortlisted' || c.status === 'Offered').length;
  const avgScore = Math.round(candidates.reduce((a, b) => a + b.overallScore, 0) / (totalCount || 1));
  const passRate = Math.round((shortlistedCount / (totalCount || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Candidate Administration & Tracking</h1>
          <p className="text-slate-600 text-sm mt-1">Manage assessment pipelines, invite candidates, assign interview tracks, and export reports.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" /> Add New Candidate
        </button>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Candidates</p>
          <p className="text-3xl font-extrabold font-mono text-slate-900">{totalCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Registered in pipeline</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Shortlisted / Offered</p>
          <p className="text-3xl font-extrabold font-mono text-emerald-600">{shortlistedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">{passRate}% Qualification Rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Average AI Score</p>
          <p className="text-3xl font-extrabold font-mono text-indigo-600">{avgScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Across all role assessments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Health</p>
          <p className="text-3xl font-extrabold font-mono text-cyan-600">99.9%</p>
          <p className="text-[10px] text-slate-500 mt-1">Gemini API & Telemetry online</p>
        </div>
      </div>

      {/* Candidate Management Table Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
        
        {/* Controls: Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 px-3 py-2 rounded-xl outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Offered">Offered</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">Candidate Name</th>
                <th className="p-3.5">Target Role</th>
                <th className="p-3.5">AI Score</th>
                <th className="p-3.5">ATS Fit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              {filteredCandidates.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.email}</p>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800">
                    {c.role}
                    <span className="block text-[10px] text-slate-400 font-normal">{c.exp} experience</span>
                  </td>

                  <td className="p-3.5 font-mono font-extrabold text-indigo-600 text-sm">
                    {c.overallScore}%
                  </td>

                  <td className="p-3.5 font-mono font-bold text-cyan-600">
                    {c.atsScore}%
                  </td>

                  <td className="p-3.5">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                        c.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        c.status === 'Offered' ? 'bg-indigo-50 text-indigo-800 border-indigo-300' :
                        c.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {c.date}
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => copyInviteLink(c.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Copy Interview Invite Link"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleExportPDF(c)}
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Export PDF Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Delete Candidate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Register New Candidate
            </h3>

            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emily Watson"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="emily@company.com"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Role</label>
                  <select
                    value={newCandidate.role}
                    onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none"
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Android Developer">Android Developer</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Experience</label>
                  <select
                    value={newCandidate.exp}
                    onChange={(e) => setNewCandidate({ ...newCandidate, exp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none"
                  >
                    <option value="1 yr">1 Year</option>
                    <option value="2 yrs">2 Years</option>
                    <option value="3 yrs">3 Years</option>
                    <option value="5+ yrs">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Save & Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
