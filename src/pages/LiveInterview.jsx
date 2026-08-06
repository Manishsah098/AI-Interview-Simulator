import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Mic, ChevronRight,
  Award, Sparkles, Clock, Volume2, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FaceTracker from '../components/FaceTracker';
import AudioAnalyzer from '../components/AudioAnalyzer';
import { GeminiService } from '../services/geminiService';
import { voiceAnalyzer } from '../services/speechService';
import { exportCandidatePDF } from '../services/pdfService';

const JOB_ROLES = ['Software Engineer', 'Data Scientist', 'Full Stack Developer', 'AI/ML Engineer', 'Android Developer', 'Cybersecurity Analyst', 'UI/UX Designer', 'Product Manager'];
const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'HR Interview', 'System Design'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const EMOTION_EMOJI = { Happy: '😊', Neutral: '😐', Nervous: '😟', Surprised: '😮', Frustrated: '😠' };

export default function LiveInterview({ language, userProfile, setUserProfile }) {
  const [phase, setPhase] = useState(() => userProfile ? 'setup' : 'register'); // 'register' | 'setup' | 'live' | 'complete'
  const [config, setConfig] = useState({ role: 'Software Engineer', type: 'Technical', difficulty: 'Intermediate' });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [visionMetrics, setVisionMetrics] = useState({});
  const [voiceMetrics, setVoiceMetrics] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalReport, setFinalReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emotion, setEmotion] = useState('Neutral');
  const [confidence, setConfidence] = useState(82);
  const timerRef = useRef(null);

  // Mock Google Authentication Dialogue popup state
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [popupStep, setPopupStep] = useState(1); // 1: Inputs, 2: Loading verification, 3: Completed
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [popupError, setPopupError] = useState('');

  const totalQuestions = 5;

  // Reactively track sign-out or session updates
  useEffect(() => {
    if (!userProfile) {
      setPhase('register');
    } else if (phase === 'register') {
      setPhase('setup');
    }
  }, [userProfile]);

  // Timer
  useEffect(() => {
    if (phase === 'live') {
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const getEnhancedRole = () => {
    const company = userProfile?.company || 'google.com';
    const name = userProfile?.name || 'Candidate';
    return `${config.role} at ${company} (Candidate Name: ${name})`;
  };

  const startInterview = async () => {
    setPhase('live');
    setIsGenerating(true);
    const q1 = await GeminiService.generateQuestion(getEnhancedRole(), config.difficulty, config.type, [], language, []);
    setQuestions([q1]);
    setIsGenerating(false);
    speakQuestion(q1);
  };

  const speakQuestion = (text) => {
    setIsAISpeaking(true);
    voiceAnalyzer.speakText(text, language, () => setIsAISpeaking(false));
  };

  const startAnswer = () => {
    setIsListening(true);
    setCurrentTranscript('');
    voiceAnalyzer.startListening();
  };

  const submitAnswer = async () => {
    setIsListening(false);
    const transcript = currentTranscript || voiceMetrics.transcript || '(No speech detected)';
    const finalVoice = voiceAnalyzer.stopListening();
    const answersArr = [...answers, { q: questions[currentQ], a: transcript, voiceMetrics: finalVoice }];
    setAnswers(answersArr);

    // Evaluate answer
    const ev = await GeminiService.evaluateAnswer(questions[currentQ], transcript, getEnhancedRole(), { ...visionMetrics, ...finalVoice });
    const evsArr = [...evaluations, ev];
    setEvaluations(evsArr);

    if (currentQ + 1 >= totalQuestions) {
      generateFinalReport(answersArr, evsArr);
    } else {
      setIsGenerating(true);
      const nextQ = await GeminiService.generateQuestion(getEnhancedRole(), config.difficulty, config.type, answersArr.map(a => a.a), language, questions);
      setQuestions(prev => [...prev, nextQ]);
      setCurrentQ(currentQ + 1);
      setIsGenerating(false);
      setCurrentTranscript('');
      speakQuestion(nextQ);
    }
  };

  const generateFinalReport = (answersArr, evsArr) => {
    const avgScore = Math.round(evsArr.reduce((sum, e) => sum + (e.score || 75), 0) / evsArr.length);
    const eyeContact = visionMetrics.eyeContact || 85;
    const smileScore = visionMetrics.smileScore || 72;
    const clarityScore = voiceMetrics.clarityScore || 88;

    const rep = {
      id: Date.now(),
      name: userProfile?.name || 'Candidate',
      avatar: userProfile?.avatar || '👨‍💻',
      company: userProfile?.company || 'google.com',
      overallScore: avgScore,
      technicalScore: Math.round(avgScore * 0.95),
      communicationScore: clarityScore,
      confidenceScore: Math.round((eyeContact + clarityScore) / 2),
      bodyLanguageScore: Math.round((eyeContact + smileScore) / 2),
      behavioralScore: Math.round(avgScore * 0.9),
      atsScore: 88,
      codingScore: 92,
      eyeContact: eyeContact,
      strengths: evsArr.flatMap(e => e.strengths || []).slice(0, 3),
      weaknesses: evsArr.flatMap(e => e.weaknesses || []).slice(0, 3),
      tips: evsArr.map(e => e.idealAnswerTip).filter(Boolean).slice(0, 2),
      duration: formatTime(elapsedSeconds),
      role: config.role,
      status: 'Shortlisted',
      answers: answersArr,
      evaluations: evsArr
    };

    // Save completed reports to localStorage for the RecruiterPortal
    try {
      const existing = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      existing.unshift(rep);
      localStorage.setItem('completed_interviews', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error while saving report:', err.message);
    }

    setFinalReport(rep);
    setPhase('complete');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleDownloadPDF = () => {
    if (finalReport) {
      exportCandidatePDF(finalReport);
    }
  };

  const renderGoogleModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col font-sans text-left">
          
          {/* Header */}
          <div className="p-6 text-center border-b border-slate-100">
            {/* Google Logo SVG */}
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 select-none" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Sign in with Google</h3>
            <p className="text-[11px] text-slate-500 mt-1">to continue to <span className="font-bold text-slate-700">InterviewIQ AI</span></p>
          </div>

          {/* Modal Steps */}
          {popupStep === 1 && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Google Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. user@gmail.com"
                  value={registerEmail}
                  onChange={(e) => { setRegisterEmail(e.target.value); setPopupError(''); }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Display Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={registerName}
                  onChange={(e) => { setRegisterName(e.target.value); setPopupError(''); }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-xs"
                />
              </div>

              {popupError && (
                <p className="text-[10px] text-rose-600 font-bold">{popupError}</p>
              )}

              <div className="flex items-center justify-between text-xs text-indigo-600 font-bold pt-2">
                <span className="hover:underline cursor-pointer" onClick={() => { setRegisterName('Alex Mercer'); setRegisterEmail('alex.mercer@gmail.com'); }}>Use Demo Details</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!registerName || !registerEmail) {
                      setPopupError('Please fill in both name and email.');
                      return;
                    }
                    setPopupStep(2);
                    setTimeout(() => {
                      setPopupStep(3);
                      setTimeout(() => {
                        setShowGooglePopup(false);
                        setUserProfile({
                          name: registerName.trim(),
                          email: registerEmail.trim(),
                          avatar: '👨‍💻',
                          company: 'google.com'
                        });
                      }, 900);
                    }, 1600);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {popupStep === 2 && (
            <div className="p-10 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800 animate-pulse">Verifying Identity</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Connecting to accounts.google.com...</p>
              </div>
            </div>
          )}

          {popupStep === 3 && (
            <div className="p-10 flex flex-col items-center justify-center space-y-3 bg-emerald-50/50">
              <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">
                ✓
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-emerald-800">Success!</p>
                <p className="text-[10px] text-slate-500 mt-1">Authenticated as <strong>{registerName}</strong></p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
            <span>English (United States)</span>
            <div className="flex gap-2">
              <span className="hover:underline cursor-pointer">Help</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. Registration Phase
  if (phase === 'register') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold tracking-widest uppercase mb-4">
            <Bot className="w-3.5 h-3.5" /> Authentication Portal
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Registration</h2>
          <p className="text-slate-500 text-xs mt-1">Authenticate with Google to customize and unlock your mock interview chamber.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="text-center p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You are launching a benchmark evaluation modeled after <strong>Google's Software Engineering & Technical Recruiting standards</strong>. Please authenticate to create your assessment profile.
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => {
              setPopupStep(1);
              setShowGooglePopup(true);
            }}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm hover:scale-[1.005] transition-all cursor-pointer bg-white"
          >
            {/* Google Multi-colored G logo */}
            <svg className="w-4 h-4 select-none" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Register with Google.com</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Or Register Manually</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!registerName || !registerEmail) return;
            setUserProfile({
              name: registerName.trim(),
              email: registerEmail.trim(),
              avatar: '👩‍💻',
              company: 'google.com'
            });
          }} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Dev"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. jordan@google.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={!registerName || !registerEmail}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.005] transition-all cursor-pointer"
            >
              Verify Profile & Start Setup
            </button>
          </form>
        </div>

        {/* Simulated OAuth dialog */}
        {showGooglePopup && renderGoogleModal()}
      </div>
    );
  }

  // 2. Setup Phase
  if (phase === 'setup') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold tracking-widest uppercase mb-4">
            <Bot className="w-3.5 h-3.5" /> AI Interview Chamber
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Configure Your Interview Session</h2>
          <p className="text-slate-600 text-sm">Select your role, interview style, and difficulty to begin your AI-powered assessment.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-8 shadow-sm">
          {/* Job Role */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Job Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {JOB_ROLES.map(role => (
                <button key={role} onClick={() => setConfig(c => ({ ...c, role }))}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    config.role === role
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}>{role}</button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Interview Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTERVIEW_TYPES.map(type => (
                <button key={type} onClick={() => setConfig(c => ({ ...c, type }))}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    config.type === type
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}>{type}</button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d, i) => (
                <button key={d} onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                  className={`p-4 rounded-xl text-sm font-bold border transition-all ${
                    config.difficulty === d
                      ? ['bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm', 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm', 'bg-rose-50 text-rose-800 border-rose-300 shadow-sm'][i]
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {['🟢 Beginner', '🟡 Intermediate', '🔴 Advanced'][i]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-indigo-600/20 hover:opacity-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
          >
            <Bot className="w-5 h-5" />
            Launch AI Interview Session
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Complete Phase
  if (phase === 'complete' && finalReport) {
    const scoreColor = (s) => s >= 85 ? 'text-emerald-600' : s >= 70 ? 'text-amber-600' : 'text-rose-600';
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-indigo-600/20">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Interview Complete!</h2>
          <p className="text-slate-600 text-sm">{finalReport.role} · {finalReport.duration} session · {totalQuestions} questions assessed</p>
        </div>

        {/* Overall Score */}
        <div className="glass-panel p-8 rounded-3xl border border-indigo-200 bg-white text-center shadow-md">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Overall Performance Score</p>
          <p className={`text-8xl font-black font-mono ${scoreColor(finalReport.overallScore)}`}>{finalReport.overallScore}<span className="text-4xl">%</span></p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Technical Skills', score: finalReport.technicalScore, icon: '🧠' },
            { label: 'Communication', score: finalReport.communicationScore, icon: '🗣️' },
            { label: 'Confidence', score: finalReport.confidenceScore, icon: '💪' },
            { label: 'Body Language', score: finalReport.bodyLanguageScore, icon: '👁️' },
            { label: 'Behavioral', score: finalReport.behavioralScore, icon: '🤝' },
          ].map(m => (
            <div key={m.label} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
              <span className="text-2xl">{m.icon}</span>
              <p className={`text-3xl font-black font-mono mt-2 ${scoreColor(m.score)}`}>{m.score}%</p>
              <p className="text-xs text-slate-600 font-semibold mt-1">{m.label}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                <div className={`h-full rounded-full ${m.score >= 85 ? 'bg-emerald-600' : m.score >= 70 ? 'bg-amber-500' : 'bg-rose-600'}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-200 bg-emerald-50">
            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">✅ Key Strengths</h4>
            <ul className="space-y-2">
              {(finalReport.strengths.length > 0 ? finalReport.strengths : ['Structured thinking', 'Good technical foundation', 'Professional tone']).map((s, i) => (
                <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-rose-200 bg-rose-50">
            <h4 className="text-sm font-bold text-rose-800 mb-3 flex items-center gap-2">⚠️ Areas to Improve</h4>
            <ul className="space-y-2">
              {(finalReport.weaknesses.length > 0 ? finalReport.weaknesses : ['Reduce filler words', 'Maintain eye contact', 'Add more concrete examples']).map((w, i) => (
                <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('setup'); setQuestions([]); setAnswers([]); setEvaluations([]); setCurrentQ(0); setElapsedSeconds(0); setFinalReport(null); }}
            className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm transition-colors border border-slate-200">
            Start New Interview
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>
    );
  }

  // Live Interview Phase
  const question = questions[currentQ];
  const progress = ((currentQ) / totalQuestions) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between glass-panel px-5 py-3 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-mono">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span className="text-cyan-700 font-bold text-sm">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs text-slate-600">Question <span className="text-slate-900 font-bold">{currentQ + 1}</span> of {totalQuestions}</span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-xs text-slate-600 font-medium">{config.role} · {config.type} · {config.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Emotion:</span>
          <span className="text-slate-900 font-bold">{EMOTION_EMOJI[visionMetrics.currentEmotion || 'Neutral']} {visionMetrics.currentEmotion || 'Neutral'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <FaceTracker isLive={true} onMetricsChange={(m) => { setVisionMetrics(m); setEmotion(m.currentEmotion || 'Neutral'); setConfidence(Math.round((m.eyeContact + m.attentionLevel) / 2)); }} />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-indigo-200 bg-white flex-1 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">InterviewIQ AI</p>
                <p className="text-[10px] text-indigo-600 font-semibold">Senior Technical Interviewer</p>
              </div>
              {isAISpeaking && (
                <div className="ml-auto flex items-center gap-1 text-[10px] text-indigo-600 font-bold animate-pulse">
                  <Volume2 className="w-3 h-3" /> Speaking...
                </div>
              )}
            </div>
            {isGenerating ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Generating next question...
              </div>
            ) : (
              <p className="text-sm text-slate-900 leading-relaxed font-semibold">{question}</p>
            )}
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white">
            {!isListening ? (
              <button
                onClick={startAnswer}
                disabled={isAISpeaking || isGenerating}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-md shadow-indigo-600/20"
              >
                <Mic className="w-5 h-5" /> {isAISpeaking ? 'AI is speaking...' : 'Speak Your Answer'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Recording...
                </div>
                {currentTranscript && (
                  <p className="text-xs text-slate-800 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-16 overflow-y-auto">{currentTranscript}</p>
                )}
                <button onClick={submitAnswer}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-opacity">
                  <ChevronRight className="w-5 h-5" /> Submit & Next Question
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AudioAnalyzer
            isListening={isListening}
            onTranscriptUpdate={setCurrentTranscript}
            onMetricsUpdate={setVoiceMetrics}
          />
        </div>
      </div>
    </div>
  );
}
