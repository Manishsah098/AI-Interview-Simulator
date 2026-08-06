import React, { useState } from 'react';
import { 
  Users, Search, Download,
  Brain, MessageSquare, Loader2, Sparkles, AlertCircle, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportCandidatePDF } from '../services/pdfService';
import { GeminiService } from '../services/geminiService';

const MOCK_ANSWERS_ALEX = [
  { 
    q: "Can you explain the internal mechanism of a Hash Table and how collision resolution strategies work in production systems?", 
    a: "A hash table uses a hash function to map keys to bucket indices. Under collision, we can use Chaining with linked lists or Red-Black trees, or Open Addressing like Linear Probing or Double Hashing. Production engines like Java's HashMap use chaining but upgrade linked lists to self-balancing BSTs if collisions exceed a threshold." 
  },
  { 
    q: "How would you design a distributed rate limiter for a high-throughput REST API processing 100k requests/sec?", 
    a: "I'd use Redis with a token bucket or sliding window algorithm. Because it's 100k req/sec, a single Redis instance might be a bottleneck, so we can shard keys using consistent hashing, and implement local in-memory token buffering on API gateways to reduce roundtrips to Redis." 
  }
];

const MOCK_EVALS_ALEX = [
  { 
    score: 92, 
    technicalDepth: 95, 
    communication: 90, 
    strengths: ["Clear explanation of collision upgrading", "Good complexity understanding"], 
    weaknesses: ["Did not discuss double hashing math"], 
    idealAnswerTip: "Discuss prime table sizing and how it relates to double hashing stride." 
  },
  { 
    score: 95, 
    technicalDepth: 96, 
    communication: 94, 
    strengths: ["Excellent distributed scaling logic", "Local buffering to reduce Redis load"], 
    weaknesses: ["Did not mention Redis Cluster split-brain scenarios"], 
    idealAnswerTip: "Detail sentinel failover and read/write split handling during networking partitions." 
  }
];

const MOCK_ANSWERS_SARAH = [
  {
    q: "Explain how the Transformer architecture uses Multi-Head Self-Attention to capture long-range dependencies.",
    a: "Transformer uses Query, Key, and Value vectors to compute attention scores, allowing the model to focus on different parts of the sequence. Multi-head attention projects Q, K, and V multiple times, letting the model jointly attend to information from different representation subspaces at different positions."
  },
  {
    q: "What is the difference between L1 (Lasso) and L2 (Ridge) regularization, and how do they affect model weight sparsity?",
    a: "L1 regularization adds the absolute values of weights to the loss, which drives some weights to zero, creating sparsity (feature selection). L2 adds the squared values of weights, which shrinks all weights but doesn't make them exactly zero, retaining all features."
  }
];

const MOCK_EVALS_SARAH = [
  {
    score: 90,
    technicalDepth: 92,
    communication: 88,
    strengths: ["Good mathematical intuition", "Clear breakdown of Q, K, V mechanism"],
    weaknesses: ["Could explain scale factors in self-attention"],
    idealAnswerTip: "Explain why scaling by square root of head dimension is crucial to prevent vanishing gradients in softmax."
  },
  {
    score: 88,
    technicalDepth: 90,
    communication: 86,
    strengths: ["Clear explanation of sparsity", "Correct geometric differences"],
    weaknesses: ["Did not explain why L1 creates sparsity mathematically"],
    idealAnswerTip: "Discuss the contours of L1 (sharp diamond corners) vs L2 (smooth circle) intersections with loss function contours."
  }
];

const MOCK_ANSWERS_MICHAEL = [
  {
    q: "How does the React 18 Concurrent Rendering Engine work under the hood, and how do useTransition and useDeferredValue prevent main thread blocking?",
    a: "React 18 Concurrent mode allows rendering to be interrupted. It slices rendering work into small chunks. useTransition lets us mark state updates as transitions, which can be interrupted if a higher-priority update (like user input) occurs, preventing main thread blocking."
  },
  {
    q: "Explain HTTP/2 multiplexing versus HTTP/3 QUIC connection establishment.",
    a: "HTTP/2 uses a single TCP connection but introduces binary framing streams, solving head-of-line blocking at the application level. However, TCP packet loss still blocks all streams. HTTP/3 uses UDP-based QUIC, which handles packet loss per stream, avoiding connection-wide HOL blocking."
  }
];

const MOCK_EVALS_MICHAEL = [
  {
    score: 85,
    technicalDepth: 88,
    communication: 82,
    strengths: ["Good grasp of concurrency concepts", "Correct useTransition definition"],
    weaknesses: ["Omitted details about fiber tree cloning"],
    idealAnswerTip: "Mention the dual-buffering (work-in-progress vs current tree) technique in Fiber."
  },
  {
    score: 83,
    technicalDepth: 85,
    communication: 80,
    strengths: ["Accurate HOL blocking distinction", "UDP/QUIC protocol understanding"],
    weaknesses: ["Did not explain QUIC 0-RTT handshake"],
    idealAnswerTip: "Detail how QUIC combines cryptographic and transport handshakes into 1-RTT or 0-RTT."
  }
];

const MOCK_ANSWERS_PRIYA = [
  {
    q: "Explain Retrieval-Augmented Generation (RAG) and how vector similarity search (HNSW, IVFFlat) scales to millions of embeddings.",
    a: "RAG retrieves external document chunks matching a user query, inserts them into the LLM context, and generates answers. For vector scaling, HNSW constructs a multi-layer graph where search navigates from coarse to fine clusters, whereas IVFFlat uses inverted file indices to search only close clusters."
  },
  {
    q: "What techniques (Quantization, LoRA, FlashAttention) would you use to deploy a 70B parameter model on a single GPU?",
    a: "To fit a 70B model (needs 140GB in FP16), we can use 4-bit quantization (GPTQ/AWQ) which reduces it to 35GB. For training/fine-tuning, we'd use LoRA to update a small subset of weights. We'd use FlashAttention to reduce attention memory complexity from quadratic to linear by tiling."
  }
];

const MOCK_EVALS_PRIYA = [
  {
    score: 96,
    technicalDepth: 98,
    communication: 94,
    strengths: ["Deep mathematical understanding of graph routing", "Accurate comparison of HNSW and IVFFlat"],
    weaknesses: ["Could touch on vector quantization compression"],
    idealAnswerTip: "Mention how Product Quantization (PQ) reduces memory footprint by compressing coordinate vectors."
  },
  {
    score: 94,
    technicalDepth: 96,
    communication: 92,
    strengths: ["Correct model size arithmetic", "Clear explanation of tiling in FlashAttention"],
    weaknesses: ["Could specify hardware recommendations (e.g. A100/H100)"],
    idealAnswerTip: "List GPU memory capacity requirements explicitly for each quantization format."
  }
];

const CANDIDATES = [
  { 
    id: 1, 
    name: 'Alex Chen', 
    role: 'Software Engineer', 
    overallScore: 92, 
    atsScore: 88, 
    codingScore: 95, 
    eyeContact: 90, 
    status: 'Shortlisted', 
    avatar: '👨‍💻',
    answers: MOCK_ANSWERS_ALEX,
    evaluations: MOCK_EVALS_ALEX,
    aiAnalysis: {
      fitSummary: "Alex Chen is a stellar candidate for the Software Engineer role. He possesses strong computational foundations and understands practical scalability bottlenecks in high-throughput applications.",
      technicalAnalysis: "Excellent technical depth. Alex provided highly detailed explanations of HashMap collision scaling and sharding strategies for distributed rate limiters.",
      communicationAnalysis: "Strong, structured delivery. Speaks with confidence, maintains steady eye contact (90%), and articulates trade-offs clearly.",
      hiringRecommendation: "Strong Hire",
      recommendationReason: "Alex scored 92% overall. His technical correctness, coding speed (95%), and distributed system design patterns place him in the top tier."
    }
  },
  { 
    id: 2, 
    name: 'Sarah Jenkins', 
    role: 'Data Scientist', 
    overallScore: 89, 
    atsScore: 91, 
    codingScore: 86, 
    eyeContact: 88, 
    status: 'Shortlisted', 
    avatar: '👩‍💻',
    answers: MOCK_ANSWERS_SARAH,
    evaluations: MOCK_EVALS_SARAH,
    aiAnalysis: {
      fitSummary: "Sarah is a highly proficient Data Scientist with strong conceptual knowledge of neural architectures and statistical modeling.",
      technicalAnalysis: "Solid mathematical background. Addressed Transformer mechanics and weight sparsity concepts with clear accuracy.",
      communicationAnalysis: "Articulate and structured delivery. Maintains high engagement (88% eye contact) with slight pacing issues in complex descriptions.",
      hiringRecommendation: "Hire",
      recommendationReason: "Strong foundational ML skills and solid coding score (86%). Her mathematical clarity makes her an ideal candidate for deep learning applications."
    }
  },
  { 
    id: 3, 
    name: 'Michael Vance', 
    role: 'Full Stack Developer', 
    overallScore: 84, 
    atsScore: 82, 
    codingScore: 89, 
    eyeContact: 82, 
    status: 'Under Review', 
    avatar: '👨‍💼',
    answers: MOCK_ANSWERS_MICHAEL,
    evaluations: MOCK_EVALS_MICHAEL,
    aiAnalysis: {
      fitSummary: "Michael is a capable web developer with good familiarity with modern web architecture and React features.",
      technicalAnalysis: "Shows decent knowledge of frontend optimization and protocol differences, though some advanced system trade-offs were skipped.",
      communicationAnalysis: "Clear communication, though his confidence level was moderate. Speaks in a professional and constructive manner.",
      hiringRecommendation: "Hire",
      recommendationReason: "With an overall score of 84% and solid coding performance, Michael meets all typical requirements. He will adapt quickly with minor onboarding."
    }
  },
  { 
    id: 4, 
    name: 'Priya Sharma', 
    role: 'AI/ML Engineer', 
    overallScore: 95, 
    atsScore: 94, 
    codingScore: 98, 
    eyeContact: 94, 
    status: 'Shortlisted', 
    avatar: '👩‍🔬',
    answers: MOCK_ANSWERS_PRIYA,
    evaluations: MOCK_EVALS_PRIYA,
    aiAnalysis: {
      fitSummary: "Priya demonstrated elite competence in advanced machine learning scaling, model quantization, and optimization strategies.",
      technicalAnalysis: "Superb. Her explanation of vector indexing structures (HNSW) and tiling algorithms in attention modules shows world-class depth.",
      communicationAnalysis: "Extremely articulate and confident. Excellent eye contact (94%) and professional layout of recommendations.",
      hiringRecommendation: "Strong Hire",
      recommendationReason: "Priya scored 95% overall. Her outstanding coding score (98%) and capability to fit LLMs on restricted hardware makes her an invaluable asset."
    }
  },
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

  const [selectedTab, setSelectedTab] = useState('overview'); // 'overview' | 'ai' | 'transcript'
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleRunAIAnalysis = async (candidate) => {
    setIsAnalyzing(true);
    // Simulate thinking/synthesizing time for visual micro-animations
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const report = await GeminiService.analyzeInterview(candidate);
      
      setCandidates(prev => {
        const updated = prev.map(c => {
          if (c.id === candidate.id) {
            return { ...c, aiAnalysis: report };
          }
          return c;
        });
        
        // Sync custom local candidates back to localStorage
        const localCandidates = updated.filter(c => ![1, 2, 3, 4].includes(c.id));
        try { localStorage.setItem('completed_interviews', JSON.stringify(localCandidates)); } catch(e) {}
        return updated;
      });

      setSelectedCandidate(prev => {
        // Only update if we're still viewing the same candidate
        if (prev.id === candidate.id) {
          return { ...prev, aiAnalysis: report };
        }
        return prev;
      });

    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendationStyles = (recommendation = '') => {
    const rec = recommendation.toLowerCase();
    if (rec.includes('strong hire')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (rec.includes('hire')) {
      return 'bg-teal-100 text-teal-800 border-teal-300';
    } else if (rec.includes('reject')) {
      return 'bg-rose-100 text-rose-800 border-rose-300';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
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
        
        {/* Left Candidate List (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
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

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => { setSelectedCandidate(c); setSelectedTab('overview'); setIsAnalyzing(false); }}
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
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase transition-colors ${
                      c.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    {c.status}
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-8 font-medium">No candidates match your search filter.</p>
            )}
          </div>
        </div>

        {/* Right Detail Inspection Card (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col gap-6 shadow-sm min-h-[500px]">
          {/* Candidate Profile Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <span className="text-5xl">{selectedCandidate.avatar}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{selectedCandidate.role}</p>
            </div>
            {selectedCandidate.aiAnalysis?.hiringRecommendation && (
              <span className={`px-3 py-1 rounded-full text-[10px] border font-bold uppercase ${getRecommendationStyles(selectedCandidate.aiAnalysis.hiringRecommendation)}`}>
                {selectedCandidate.aiAnalysis.hiringRecommendation}
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500">
            <button 
              onClick={() => setSelectedTab('overview')}
              className={`flex-1 pb-3 text-center transition-all ${selectedTab === 'overview' ? 'border-b-2 border-purple-600 text-purple-600' : 'hover:text-slate-800'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedTab('ai')}
              className={`flex-1 pb-3 text-center transition-all flex items-center justify-center gap-1.5 ${selectedTab === 'ai' ? 'border-b-2 border-purple-600 text-purple-600' : 'hover:text-slate-800'}`}
            >
              <Brain className="w-3.5 h-3.5" /> AI Insights
            </button>
            <button 
              onClick={() => setSelectedTab('transcript')}
              className={`flex-1 pb-3 text-center transition-all flex items-center justify-center gap-1.5 ${selectedTab === 'transcript' ? 'border-b-2 border-purple-600 text-purple-600' : 'hover:text-slate-800'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Q&A Transcript
            </button>
          </div>

          {/* Tab Content Router */}
          <div className="flex-1">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center hover:shadow-sm transition-shadow">
                    <p className="text-2xl font-bold font-mono text-purple-700">{selectedCandidate.overallScore}%</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Overall AI Score</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center hover:shadow-sm transition-shadow">
                    <p className="text-2xl font-bold font-mono text-cyan-700">{selectedCandidate.atsScore}%</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Resume ATS Score</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center hover:shadow-sm transition-shadow">
                    <p className="text-2xl font-bold font-mono text-emerald-700">{selectedCandidate.codingScore}%</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Coding Assessment</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center hover:shadow-sm transition-shadow">
                    <p className="text-2xl font-bold font-mono text-indigo-700">{selectedCandidate.eyeContact}%</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Eye Contact Index</p>
                  </div>
                </div>

                {/* Additional metadata */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-600" /> Assessment Metadata</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium">
                    <div>Duration: <span className="text-slate-900 font-bold font-mono">{selectedCandidate.duration || '12:45'}</span></div>
                    <div>Evaluated State: <span className="text-emerald-700 font-bold">{selectedCandidate.status}</span></div>
                    <div>Target Role: <span className="text-slate-900 font-bold">{selectedCandidate.role}</span></div>
                    <div>Code Language: <span className="text-slate-900 font-bold">JavaScript</span></div>
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
            )}

            {selectedTab === 'ai' && (
              <div className="space-y-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Synthesizing Interview Data...</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mt-1">AI is analyzing spoken transcripts, core correctness, facial cues, and communication indicators.</p>
                    </div>
                  </div>
                ) : selectedCandidate.aiAnalysis ? (
                  <div className="space-y-4">
                    {/* Recommendation Card */}
                    <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Hiring Recommendation
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getRecommendationStyles(selectedCandidate.aiAnalysis.hiringRecommendation)}`}>
                          {selectedCandidate.aiAnalysis.hiringRecommendation}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        {selectedCandidate.aiAnalysis.recommendationReason}
                      </p>
                    </div>

                    {/* Fit summary */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">Role Fit & Traits Summary</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedCandidate.aiAnalysis.fitSummary}
                      </p>
                    </div>

                    {/* Technical details */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">Technical Depth Analysis</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedCandidate.aiAnalysis.technicalAnalysis}
                      </p>
                    </div>

                    {/* Communication details */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">Communication & Presentation</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedCandidate.aiAnalysis.communicationAnalysis}
                      </p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRunAIAnalysis(selectedCandidate)}
                        className="text-[10px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 transition-colors"
                      >
                        🔄 Re-run Deep AI Analysis
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 space-y-4">
                    <Brain className="w-12 h-12 text-purple-400" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">No AI Assessment Found</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">This candidate was added without a pre-computed AI analysis. Synthesize their records now.</p>
                    </div>
                    <button 
                      onClick={() => handleRunAIAnalysis(selectedCandidate)}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/10 hover:scale-[1.01] transition-all"
                    >
                      ✨ Generate AI Analysis Report
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'transcript' && (
              <div className="space-y-4">
                {(!selectedCandidate.answers || selectedCandidate.answers.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 space-y-3">
                    <MessageSquare className="w-12 h-12 text-slate-400" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">No Transcript Available</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">There are no recorded answers or telemetry associated with this candidate profile.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {selectedCandidate.answers.map((ans, idx) => {
                      const evaluation = selectedCandidate.evaluations?.[idx] || {};
                      return (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-xs font-extrabold text-slate-900 leading-normal">
                              Q{idx + 1}: {ans.q}
                            </h5>
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-extrabold font-mono shrink-0">
                              Score: {evaluation.score || 75}%
                            </span>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-slate-700 italic font-medium leading-relaxed relative pl-7 shadow-sm">
                            <span className="absolute left-2.5 top-1 text-purple-300 text-2xl font-serif">“</span>
                            {ans.a}
                          </div>

                          <div className="border-t border-slate-200 pt-3 space-y-2 text-[11px]">
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold">
                              <div>Technical Depth: <span className="text-cyan-700 font-mono">{evaluation.technicalDepth || 75}%</span></div>
                              <div>Communication: <span className="text-indigo-700 font-mono">{evaluation.communication || 75}%</span></div>
                            </div>
                            
                            <div className="space-y-1.5 mt-2 text-slate-700 font-medium">
                              {evaluation.strengths?.length > 0 && (
                                <div className="text-emerald-850 flex items-start gap-1">
                                  <span className="text-emerald-600 font-bold shrink-0">✔</span>
                                  <div><strong className="text-emerald-800 font-bold">Strength:</strong> {evaluation.strengths.join(', ')}</div>
                                </div>
                              )}
                              {evaluation.weaknesses?.length > 0 && (
                                <div className="text-amber-900 flex items-start gap-1">
                                  <span className="text-amber-600 font-bold shrink-0">⚠</span>
                                  <div><strong className="text-amber-800 font-bold">Weakness:</strong> {evaluation.weaknesses.join(', ')}</div>
                                </div>
                              )}
                              {evaluation.idealAnswerTip && (
                                <div className="text-indigo-900 bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-100 font-medium mt-2 flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                  <div><strong className="text-indigo-950 font-bold">AI Ideal Answer Tip:</strong> {evaluation.idealAnswerTip}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
