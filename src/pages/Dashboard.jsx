import React, { useState, useEffect } from 'react';
import {
  Video, FileText, Code, BarChart3, Zap, Trophy, Clock,
  ChevronRight, Star, TrendingUp, TrendingDown, CheckCircle2,
  Activity, Brain, User
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
  { label: 'Sessions Completed', value: '6', icon: Trophy, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', icon_color: 'text-amber-400', trend: '+2 this week' },
  { label: 'Average Score', value: '82%', icon: Star, color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20', icon_color: 'text-indigo-400', trend: '↑ 8% improvement' },
  { label: 'Best Score', value: '94%', icon: TrendingUp, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', icon_color: 'text-emerald-400', trend: 'Software Engineer' },
  { label: 'Practice Time', value: '14h', icon: Clock, color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', icon_color: 'text-cyan-400', trend: 'Total logged' },
];

const recentInterviews = [
  { role: 'Software Engineer', type: 'Technical', score: 83, date: 'Today', emoji: '🖥️' },
  { role: 'Data Scientist', type: 'Behavioral', score: 76, date: 'Yesterday', emoji: '📊' },
  { role: 'Full Stack Developer', type: 'Technical', score: 91, date: '2 days ago', emoji: '🌐' },
];

const quickActions = [
  { id: 'interview', label: 'Start AI Interview', sub: 'Choose role & difficulty', icon: Video, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
  { id: 'resume', label: 'Scan Resume ATS', sub: 'Upload PDF & get score', icon: FileText, color: 'from-cyan-500 to-teal-600', shadow: 'shadow-cyan-500/20' },
  { id: 'coding', label: 'Coding Arena', sub: 'Practice algorithms', icon: Code, color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' },
  { id: 'analytics', label: 'View Analytics', sub: 'Track your progress', icon: BarChart3, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
];

export default function Dashboard({ setActiveTab }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-cyan-900/20 border border-indigo-500/20 p-8 shadow-xl shadow-indigo-500/5">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(99,102,241,0.35), transparent)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-bold tracking-widest uppercase mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              AI Assessment Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">InterviewIQ AI</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Your intelligent 360° interview preparation system powered by multi-modal AI. Analyze your technical skills, voice confidence, facial cues, resume ATS score, and coding performance.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('interview')}
            className="flex-shrink-0 group flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
          >
            <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Start Your Interview
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`relative p-5 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} overflow-hidden glass-card`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-slate-900/60 ${card.icon_color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white font-mono mb-1">{card.value}</p>
              <p className="text-xs text-slate-400 font-medium">{card.label}</p>
              <p className="text-[10px] text-slate-500 mt-1">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Skill Radar Matrix
          </h3>
          <p className="text-xs text-slate-500 mb-4">360° performance breakdown across all interview dimensions</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} outerRadius={85}>
              <PolarGrid stroke="#1E293B" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Radar name="Score" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Score Improvement Trend
          </h3>
          <p className="text-xs text-slate-500 mb-4">Overall interview performance across sessions</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#06B6D4" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setActiveTab(action.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${action.color} bg-opacity-10 border border-white/5 hover:scale-[1.02] hover:border-white/10 transition-all duration-200 shadow-lg ${action.shadow} text-left`}
                >
                  <div className="p-2.5 rounded-xl bg-white/10">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{action.label}</p>
                    <p className="text-[10px] text-white/60">{action.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Recent Sessions
          </h3>
          <div className="space-y-3">
            {recentInterviews.map((iv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 transition-colors">
                <span className="text-2xl">{iv.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{iv.role}</p>
                  <p className="text-[10px] text-slate-500">{iv.type} · {iv.date}</p>
                </div>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                  iv.score >= 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {iv.score}%
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('analytics')} className="mt-4 w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-2 rounded-xl hover:bg-indigo-500/10 transition-colors">
            View All Sessions →
          </button>
        </div>
      </div>
    </div>
  );
}
