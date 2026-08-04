import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Activity, AlertTriangle, Volume2 } from 'lucide-react';
import { voiceAnalyzer } from '../services/speechService';

export default function AudioAnalyzer({ isListening, onTranscriptUpdate, onMetricsUpdate }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    fillerCount: 0,
    fillerMap: {},
    wordCount: 0,
    clarityScore: 100,
    speedRating: 'Optimal'
  });
  const [transcript, setTranscript] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const barsRef = useRef(Array.from({ length: 40 }, () => 4));

  useEffect(() => {
    voiceAnalyzer.onTranscriptUpdate = (t) => {
      setTranscript(t);
      if (onTranscriptUpdate) onTranscriptUpdate(t);
    };
    voiceAnalyzer.onMetricsUpdate = (m) => {
      setMetrics(m);
      if (onMetricsUpdate) onMetricsUpdate(m);
    };

    if (isListening) {
      voiceAnalyzer.startListening().then(() => setIsMicActive(true));
    } else {
      setIsMicActive(false);
    }

    return () => {};
  }, [isListening]);

  // Animated waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const draw = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = 64;
      ctx.clearRect(0, 0, W, H);

      const bars = barsRef.current.length;
      const barW = (W / bars) - 2;

      for (let i = 0; i < bars; i++) {
        const target = isListening
          ? 4 + Math.abs(Math.sin(t * 2.5 + i * 0.4)) * 40 + Math.random() * 8
          : 4;
        barsRef.current[i] = barsRef.current[i] + (target - barsRef.current[i]) * 0.15;
        const h = barsRef.current[i];
        const x = i * (barW + 2);
        const grad = ctx.createLinearGradient(0, H / 2 - h / 2, 0, H / 2 + h / 2);
        grad.addColorStop(0, isListening ? '#4F46E5' : '#CBD5E1');
        grad.addColorStop(0.5, isListening ? '#0891B2' : '#94A3B8');
        grad.addColorStop(1, isListening ? '#4F46E5' : '#CBD5E1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, H / 2 - h / 2, barW, h, 3);
        ctx.fill();
      }

      t += 0.04;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isListening]);

  const fillerEntries = Object.entries(metrics.fillerMap || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          {isListening ? <Mic className="w-4 h-4 text-indigo-600 animate-pulse" /> : <MicOff className="w-4 h-4 text-slate-400" />}
          Voice Intelligence
        </h3>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
          metrics.speedRating === 'Optimal'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
            : metrics.speedRating === 'Fast'
            ? 'bg-rose-100 text-rose-800 border-rose-200'
            : 'bg-amber-100 text-amber-800 border-amber-200'
        }`}>
          <Volume2 className="w-3 h-3" />
          {metrics.speedRating} Speed
        </div>
      </div>

      {/* Waveform */}
      <div className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2 overflow-hidden">
        <canvas ref={canvasRef} className="w-full" style={{ height: '64px' }} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <p className="text-2xl font-bold font-mono text-indigo-600">{metrics.wpm || 0}</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">WPM</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <p className={`text-2xl font-bold font-mono ${metrics.fillerCount > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {metrics.fillerCount}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Filler Words</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <p className={`text-2xl font-bold font-mono ${metrics.clarityScore > 80 ? 'text-cyan-600' : 'text-amber-600'}`}>
            {metrics.clarityScore}%
          </p>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Clarity</p>
        </div>
      </div>

      {/* Filler Word Breakdown */}
      {fillerEntries.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
          <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Filler Words Detected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fillerEntries.map(([word, count]) => (
              <span key={word} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-mono font-semibold">
                "{word}" × {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scrolling Transcript */}
      {transcript && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 max-h-20 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-600" /> Live Transcript
          </p>
          <p className="text-xs text-slate-800 font-mono leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}
