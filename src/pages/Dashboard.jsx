import React, { useState, useEffect } from 'react';
import {
  Video, FileText, Code, BarChart3, Zap, Trophy, Clock,
  ChevronRight, Star, TrendingUp, Activity, Brain, ShieldCheck,
  CheckCircle2, Sparkles, Target, ArrowRight
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const radarData = [
  { subject: 'Technical', A: 82 },
  { subject: 'Communication', A: 88 },
  { subject: 'Confidence', A: 76 },
  { subject: 'Body Language', A: 71 },
  { subject: 'Coding', A: 90 },
  { subject: 'Resume', A: 84 },
  { subject: 'Behavioral', A: 79 },
];

const trendData = [
  { session: 'S1', score: 62 },
  { session: 'S2', score: 68 },
  { session: 'S3', score: 71 },
  { session: 'S4', score: 75 },
  { session: 'S5', score: 80 },
  { session: 'S6', score: 83 },
];

const statCards = [
  { label: 'Sessions Completed', value: '6', icon: Trophy, color: 'bg-white border-l-4 border-l-amber-500 border-slate-200', icon_color: 'text-amber-600 bg-amber-50', trend: '+2 this week' },
  { label: 'Average Score', value: '82%', icon: Star, color: 'bg-white border-l-4 border-l-indigo-600 border-slate-200', icon_color: 'text-indigo-600 bg-indigo-50', trend: '↑ 8% improvement' },
  { label: 'Best Score', value: '94%', icon: TrendingUp, color: 'bg-white border-l-4 border-l-emerald-600 border-slate-200', icon_color: 'text-emerald-600 bg-emerald-50', trend: 'Software Engineer' },
  { label: 'Practice Time', value: '14h', icon: Clock, color: 'bg-white border-l-4 border-l-cyan-600 border-slate-200', icon_color: 'text-cyan-600 bg-cyan-50', trend: 'Total logged' },
];

const recentInterviews = [
  { role: 'Software Engineer', type: 'Technical', score: 83, date: 'Today', emoji: '🖥️' },
  { role: 'Data Scientist', type: 'Behavioral', score: 76, date: 'Yesterday', emoji: '📊' },
  { role: 'Full Stack Developer', type: 'Technical', score: 91, date: '2 days ago', emoji: '🌐' },
];

const quickActions = [
  { id: 'interview', label: 'Start AI Interview', sub: 'Adaptive 5-question stream', icon: Video, color: 'bg-indigo-600 hover:bg-indigo-700 text-white', shadow: 'shadow-indigo-600/20' },
  { id: 'resume', label: 'Scan Resume ATS', sub: 'Upload PDF & get score', icon: FileText, color: 'bg-cyan-600 hover:bg-cyan-700 text-white', shadow: 'shadow-cyan-600/20' },
  { id: 'coding', label: 'Coding Arena', sub: 'Algorithmic test runner', icon: Code, color: 'bg-emerald-600 hover:bg-emerald-700 text-white', shadow: 'shadow-emerald-600/20' },
  { id: 'analytics', label: 'View Analytics', sub: 'Longitudinal growth trend', icon: BarChart3, color: 'bg-rose-600 hover:bg-rose-700 text-white', shadow: 'shadow-rose-600/20' },
];

const platformFeatures = [
  { title: 'Dynamic AI Interviewer', desc: 'Generates context-aware follow-up questions for 8+ technical & HR job roles.', icon: Brain },
  { title: 'Computer Vision HUD', desc: 'Real-time eye contact %, smile score, posture tracking, and emotion matrix.', icon: Activity },
  { title: 'Voice Intelligence', desc: 'Measures speech WPM, pitch stability, and real-time filler word disfluencies.', icon: Zap },
  { title: 'Resume ATS Engine', desc: 'Parses PDF text against role benchmarks with 1-click missing keyword insertion.', icon: Target },
];

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-grid-pattern">

      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 shadow-2xl border border-slate-800 text-white">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Multi-Modal Assessment Ecosystem
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 text-white">
              Elevate Your Interview Performance
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              InterviewIQ AI evaluates candidates across technical knowledge, vocal confidence, eye contact, resume ATS alignment, and live algorithmic coding in real-time.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => setActiveTab('interview')}
                className="btn-primary px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-3"
              >
                <Brain className="w-5 h-5 text-white" />
                Launch Mock Session
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                Scan Resume ATS
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 bg-slate-950/80 max-w-sm w-full space-y-3">
            <p className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Live System Benchmark</p>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">Eye Contact Accuracy</span>
              <span className="font-mono font-bold text-emerald-400">99.4%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">Speech Disfluency Engine</span>
              <span className="font-mono font-bold text-indigo-400">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ATS Keyword Database</span>
              <span className="font-mono font-bold text-cyan-400">8 Roles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`relative p-5 rounded-2xl ${card.color} shadow-sm glass-card`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.icon_color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono mb-1">{card.value}</p>
              <p className="text-xs text-slate-700 font-bold">{card.label}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Core Capability Suite */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" /> Platform Architecture & Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Matrix */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" /> Candidate Skill Radar Matrix
          </h3>
          <p className="text-xs text-slate-500 mb-4">360° performance breakdown across all interview dimensions</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} outerRadius={85}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
              <Radar name="Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} strokeWidth={2.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Graph */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" /> Score Improvement Trend
          </h3>
          <p className="text-xs text-slate-500 mb-4">Overall interview performance across sessions</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="score" stroke="#0891B2" fill="url(#scoreGrad)" strokeWidth={3} dot={{ r: 4, fill: '#0891B2', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" /> Quick Launch Hub
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setActiveTab(action.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl ${action.color} transition-all duration-200 shadow-md ${action.shadow} text-left hover:scale-[1.02]`}
                >
                  <div className="p-2.5 rounded-xl bg-white/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{action.label}</p>
                    <p className="text-[10px] text-white/80 font-medium">{action.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Recent Sessions
          </h3>
          <div className="space-y-3">
            {recentInterviews.map((iv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <span className="text-2xl">{iv.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{iv.role}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{iv.type} · {iv.date}</p>
                </div>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                  iv.score >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {iv.score}%
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('analytics')} className="mt-4 w-full text-center text-xs text-indigo-600 hover:text-indigo-700 font-bold py-2 rounded-xl hover:bg-indigo-50 transition-colors">
            View Detailed History →
          </button>
        </div>
      </div>

    </div>
  );
}
