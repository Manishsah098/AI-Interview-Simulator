import React from 'react';
import { Sparkles, TrendingUp, Calendar, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const progressData = [
  { date: 'Jul 28', confidence: 64, technical: 70, eyeContact: 72, wpm: 120 },
  { date: 'Jul 30', confidence: 70, technical: 75, eyeContact: 78, wpm: 135 },
  { date: 'Aug 01', confidence: 75, technical: 82, eyeContact: 81, wpm: 140 },
  { date: 'Aug 02', confidence: 82, technical: 85, eyeContact: 88, wpm: 148 },
  { date: 'Aug 04', confidence: 88, technical: 90, eyeContact: 92, wpm: 152 },
];

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Performance Analytics & AI Trends
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Interview Readiness Analytics</h1>
        <p className="text-slate-600 text-sm mt-1">Track your growth across technical competence, eye contact, speech clarity, and confidence over time.</p>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confidence & Technical Growth Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" /> Longitudinal Skill Growth
          </h3>
          <p className="text-xs text-slate-500 mb-4">Technical Depth vs Confidence Score progression</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="technical" name="Technical Depth" stroke="#4F46E5" fill="url(#techGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="confidence" name="Confidence" stroke="#0891B2" fill="url(#confGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Eye Contact & WPM Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" /> Eye Contact & Speech Speed (WPM)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Facial engagement score vs Words Per Minute</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis domain={[0, 160]} tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="eyeContact" name="Eye Contact %" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wpm" name="Speech WPM" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Historical Session Log Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" /> Interview History Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Job Role</th>
                <th className="p-3">Type</th>
                <th className="p-3">Overall</th>
                <th className="p-3">Eye Contact</th>
                <th className="p-3">Clarity</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              <tr>
                <td className="p-3 font-mono text-slate-500">Aug 04, 2026</td>
                <td className="p-3 font-bold text-slate-900">Software Engineer</td>
                <td className="p-3 text-indigo-600 font-semibold">Technical</td>
                <td className="p-3 font-mono font-bold text-emerald-600">88%</td>
                <td className="p-3 font-mono">92%</td>
                <td className="p-3 font-mono">89%</td>
                <td className="p-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">Interview Ready</span></td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-500">Aug 02, 2026</td>
                <td className="p-3 font-bold text-slate-900">Data Scientist</td>
                <td className="p-3 text-indigo-600 font-semibold">Behavioral</td>
                <td className="p-3 font-mono font-bold text-emerald-600">82%</td>
                <td className="p-3 font-mono">85%</td>
                <td className="p-3 font-mono">82%</td>
                <td className="p-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">Interview Ready</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
