import React, { useState, useEffect } from 'react';
import {
  Video, FileText, Code, BarChart3, Zap, Trophy, Clock,
  ChevronRight, Star, TrendingUp, Activity, Brain
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
  { label: 'Sessions Completed', value: '6', icon: Trophy, color: 'bg-amber-50 border-amber-200', icon_color: 'text-amber-600', trend: '+2 this week' },
  { label: 'Average Score', value: '82%', icon: Star, color: 'bg-indigo-50 border-indigo-200', icon_color: 'text-indigo-600', trend: '↑ 8% improvement' },
  { label: 'Best Score', value: '94%', icon: TrendingUp, color: 'bg-emerald-50 border-emerald-200', icon_color: 'text-emerald-600', trend: 'Software Engineer' },
  { label: 'Practice Time', value: '14h', icon: Clock, color: 'bg-cyan-50 border-cyan-200', icon_color: 'text-cyan-600', trend: 'Total logged' },
];

const recentInterviews = [
  { role: 'Software Engineer', type: 'Technical', score: 83, date: 'Today', emoji: '🖥️' },
  { role: 'Data Scientist', type: 'Behavioral', score: 76, date: 'Yesterday', emoji: '📊' },
  { role: 'Full Stack Developer', type: 'Technical', score: 91, date: '2 days ago', emoji: '🌐' },
];

const quickActions = [
  { id: 'interview', label: 'Start AI Interview', sub: 'Choose role & difficulty', icon: Video, color: 'bg-indigo-600 hover:bg-indigo-700 text-white', shadow: 'shadow-indigo-600/20' },
  { id: 'resume', label: 'Scan Resume ATS', sub: 'Upload PDF & get score', icon: FileText, color: 'bg-cyan-600 hover:bg-cyan-700 text-white', shadow: 'shadow-cyan-600/20' },
  { id: 'coding', label: 'Coding Arena', sub: 'Practice algorithms', icon: Code, color: 'bg-emerald-600 hover:bg-emerald-700 text-white', shadow: 'shadow-emerald-600/20' },
  { id: 'analytics', label: 'View Analytics', sub: 'Track your progress', icon: BarChart3, color: 'bg-rose-600 hover:bg-rose-700 text-white', shadow: 'shadow-rose-600/20' },
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 p-8 shadow-xl shadow-indigo-600/15 text-white">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              AI Assessment Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
              Welcome to InterviewIQ AI
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl leading-relaxed font-medium">
              Your intelligent 360° interview preparation system powered by multi-modal AI. Analyze your technical skills, voice confidence, facial cues, resume ATS score, and coding performance.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('interview')}
            className="flex-shrink-0 group flex items-center gap-3 px-7 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-xl hover:bg-indigo-50 hover:scale-[1.02] transition-all duration-200"
          >
            <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-indigo-600" />
            Start Your Interview
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`relative p-5 rounded-2xl ${card.color} border overflow-hidden glass-card`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-white shadow-xs ${card.icon_color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 font-mono mb-1">{card.value}</p>
              <p className="text-xs text-slate-600 font-semibold">{card.label}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" /> Skill Radar Matrix
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

        {/* Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200">
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

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" /> Quick Actions
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
                    <p className="text-[10px] text-white/80">{action.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Recent Sessions
          </h3>
          <div className="space-y-3">
            {recentInterviews.map((iv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors">
                <span className="text-2xl">{iv.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{iv.role}</p>
                  <p className="text-[10px] text-slate-500">{iv.type} · {iv.date}</p>
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
            View All Sessions →
          </button>
        </div>
      </div>
    </div>
  );
}
