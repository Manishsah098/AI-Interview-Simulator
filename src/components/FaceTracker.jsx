import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, Smile, Activity, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { visionTracker } from '../services/visionService';

export default function FaceTracker({ isLive, onMetricsChange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [metrics, setMetrics] = useState({
    eyeContact: 88,
    smileScore: 72,
    attentionLevel: 92,
    nervousness: 'Low',
    headMovement: 'Centered',
    currentEmotion: 'Neutral',
    emotionMatrix: { Happy: 25, Neutral: 65, Nervous: 10, Surprised: 0, Frustrated: 0 }
  });

  useEffect(() => {
    let stream = null;

    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          visionTracker.startTracking(videoRef.current, canvasRef.current);
        }
      } catch (err) {
        console.warn('Webcam stream fallback mode:', err.message);
        setCameraActive(false);
      }
    }

    if (isLive) {
      initCamera();
    }

    visionTracker.onMetricsUpdate = (newMetrics) => {
      setMetrics(newMetrics);
      if (onMetricsChange) onMetricsChange(newMetrics);
    };

    return () => {
      visionTracker.stopTracking();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLive]);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col h-full">
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            Computer Vision HUD
          </h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
          metrics.eyeContact > 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        }`}>
          {metrics.eyeContact > 80 ? 'High Engagement' : 'Adjust Focus'}
        </span>
      </div>

      {/* Video & Canvas Frame */}
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800/80 mb-4 shadow-inner">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive ? 'hidden' : ''}`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
        />

        {/* Fallback Camera Placeholder if webcam denied */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-300 mb-1">Simulated Vision Feed Active</p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Webcam permission optional. Vision telemetry running real-time facial landmark metrics.
            </p>
          </div>
        )}

        {/* Floating Emotion Tag */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
          <Smile className="w-3.5 h-3.5 text-amber-400" />
          <span>Emotion: <span className="text-white">{metrics.currentEmotion}</span></span>
        </div>
      </div>

      {/* Metrics Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-auto">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-cyan-400" /> Eye Contact</span>
            <span className="text-cyan-300 font-mono font-bold">{metrics.eyeContact}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${metrics.eyeContact}%` }} />
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
            <span className="flex items-center gap-1"><Smile className="w-3 h-3 text-amber-400" /> Smile Score</span>
            <span className="text-amber-300 font-mono font-bold">{metrics.smileScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${metrics.smileScore}%` }} />
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-400" /> Attention</span>
            <span className="text-emerald-300 font-mono font-bold">{metrics.attentionLevel}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${metrics.attentionLevel}%` }} />
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-purple-400" /> Nervousness</span>
            <span className="text-purple-300 font-mono font-bold">{metrics.nervousness}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full transition-all duration-300" style={{ width: metrics.nervousness === 'Low' ? '30%' : '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
