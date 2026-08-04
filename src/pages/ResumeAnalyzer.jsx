import React, { useState } from 'react';
import { 
  FileText, Upload, Sparkles, CheckCircle2, XCircle, 
  AlertTriangle, Plus, RefreshCw
} from 'lucide-react';
import { ATSAnalyzer } from '../services/atsService';

const SAMPLE_RESUME = `
ALEX CHEN
Software Engineer | Full Stack Specialist
alex.chen@email.com | +1 (555) 234-5678 | github.com/alexchen | linkedin.com/in/alexchen

SUMMARY
Results-driven Software Engineer with 3+ years of experience building scalable web applications. Proficient in React, JavaScript, Node.js, SQL, and REST APIs. Experienced in Agile workflows and CI/CD pipelines.

SKILLS
Programming Languages: JavaScript, Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
Tools & Databases: Git, PostgreSQL, MongoDB, Docker, REST API

PROJECTS
E-Commerce Engine | React, Node.js, MongoDB
- Architected full-stack shopping portal serving 15,000 active monthly users.
- Optimized database query response times by 40% using indexed PostgreSQL schemas.
- Implemented OAuth2 authentication and Stripe checkout integration.

Real-Time Chat App | React, WebSockets, Express
- Developed real-time messaging application supporting multi-user room channels.
- Deployed microservices architecture using Docker containers on AWS EC2.

EDUCATION
B.S. in Computer Science | State University (2020 - 2024)
`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [report, setReport] = useState(ATSAnalyzer.analyzeText(SAMPLE_RESUME, 'Software Engineer'));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setReport(ATSAnalyzer.analyzeText(resumeText, targetRole));
      setIsAnalyzing(false);
    }, 600);
  };

  const addKeywordToResume = (kw) => {
    setResumeText(prev => prev + `\n- Experience with ${kw}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold tracking-widest uppercase mb-3">
          <FileText className="w-3.5 h-3.5" /> Resume Intelligence Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">ATS Resume Optimization & Scoring</h1>
        <p className="text-slate-600 text-sm mt-1">Upload your resume to get instant ATS scores, missing keyword detection, and AI recommendations.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Input / Editor */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" /> Resume Content
            </h3>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold px-3 py-1.5 rounded-xl outline-none"
            >
              <option value="Software Engineer">Target: Software Engineer</option>
              <option value="Data Scientist">Target: Data Scientist</option>
              <option value="Full Stack Developer">Target: Full Stack Developer</option>
              <option value="AI/ML Engineer">Target: AI/ML Engineer</option>
              <option value="Android Developer">Target: Android Developer</option>
            </select>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your plain text resume or upload PDF..."
            className="w-full h-96 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-opacity"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Scanning ATS Keywords...' : 'Run ATS AI Scan'}
          </button>
        </div>

        {/* Right: ATS Diagnostic Scorecard */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col gap-6 shadow-sm">
          
          {/* Main Score Gauge */}
          <div className="flex items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                <circle
                  cx="48" cy="48" r="40"
                  stroke={report.overallATS >= 80 ? '#059669' : report.overallATS >= 60 ? '#D97706' : '#E11D48'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (251 * report.overallATS) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-2xl font-black font-mono text-slate-900">{report.overallATS}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall ATS Score</p>
              <h3 className="text-lg font-bold text-slate-900">
                {report.overallATS >= 80 ? 'High ATS Compatibility' : 'Needs Keywords Optimization'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">Scored against {targetRole} industry benchmarks.</p>
            </div>
          </div>

          {/* Sub-Score Progress Bars */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Keyword Density</span>
                <span className="text-cyan-700 font-mono font-bold">{report.keywordScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${report.keywordScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Layout & Format</span>
                <span className="text-indigo-700 font-mono font-bold">{report.formatScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${report.formatScore}%` }} />
              </div>
            </div>
          </div>

          {/* Missing Keywords Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing Critical Keywords (Click to append)
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.missingKeywords.map(kw => (
                <button
                  key={kw}
                  onClick={() => addKeywordToResume(kw)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-semibold"
                >
                  <Plus className="w-3 h-3" /> {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <h5 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strengths Detected
              </h5>
              <ul className="space-y-1">
                {report.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-800 font-medium flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
              <h5 className="text-xs font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Key Weaknesses
              </h5>
              <ul className="space-y-1">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-slate-800 font-medium flex items-center gap-2">
                    <span className="text-rose-600 font-bold">✕</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
