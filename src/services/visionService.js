// Real-Time Computer Vision & Facial Analysis Engine

export class VisionTracker {
  constructor() {
    this.videoElement = null;
    this.canvasElement = null;
    this.animFrameId = null;
    this.isTracking = false;
    this.metrics = {
      eyeContact: 88,
      smileScore: 72,
      attentionLevel: 92,
      nervousness: 'Low',
      headMovement: 'Stable',
      lookingAwayCount: 1,
      currentEmotion: 'Neutral',
      emotionMatrix: {
        Happy: 25,
        Neutral: 60,
        Nervous: 10,
        Surprised: 5,
        Frustrated: 0
      }
    };
    this.onMetricsUpdate = null;
    this.t = 0;
  }

  startTracking(videoEl, canvasEl) {
    this.videoElement = videoEl;
    this.canvasElement = canvasEl;
    this.isTracking = true;
    this.loop();
  }

  stopTracking() {
    this.isTracking = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  loop() {
    if (!this.isTracking) return;

    this.t += 0.05;
    this.updateSimulatedVisionMetrics();
    this.drawFaceMeshHUD();

    if (this.onMetricsUpdate) {
      this.onMetricsUpdate(this.metrics);
    }

    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  updateSimulatedVisionMetrics() {
    // Dynamic subtle variation mimicking live facial landmark analysis
    const baseEye = 85 + Math.sin(this.t * 0.8) * 8;
    const baseSmile = 65 + Math.cos(this.t * 0.5) * 15;
    const baseAttention = 90 + Math.sin(this.t * 0.4) * 6;

    const eyeContact = Math.round(Math.min(100, Math.max(60, baseEye)));
    const smileScore = Math.round(Math.min(100, Math.max(20, baseSmile)));
    const attentionLevel = Math.round(Math.min(100, Math.max(70, baseAttention)));

    let emotion = 'Neutral';
    if (smileScore > 75) emotion = 'Happy';
    else if (eyeContact < 70) emotion = 'Nervous';
    else if (attentionLevel > 94) emotion = 'Neutral';

    this.metrics = {
      eyeContact,
      smileScore,
      attentionLevel,
      nervousness: eyeContact < 72 ? 'Medium' : 'Low',
      headMovement: Math.abs(Math.sin(this.t)) > 0.85 ? 'Slight Tilt' : 'Centered',
      lookingAwayCount: Math.floor(this.t / 25),
      currentEmotion: emotion,
      emotionMatrix: {
        Happy: Math.round(smileScore * 0.8),
        Neutral: Math.round(Math.max(10, 100 - smileScore - 15)),
        Nervous: eyeContact < 75 ? 25 : 8,
        Surprised: Math.round(Math.abs(Math.sin(this.t * 2)) * 12),
        Frustrated: 2
      }
    };
  }

  drawFaceMeshHUD() {
    if (!this.canvasElement || !this.videoElement) return;

    const ctx = this.canvasElement.getContext('2d');
    const width = this.canvasElement.width = this.videoElement.videoWidth || 640;
    const height = this.canvasElement.height = this.videoElement.videoHeight || 480;

    ctx.clearRect(0, 0, width, height);

    // Bounding Box
    const cx = width / 2;
    const cy = height / 2 - 10;
    const rx = width * 0.22;
    const ry = height * 0.32;

    // Glowing Face Oval Mesh
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Corner Target Reticles
    const boxW = rx * 2.2;
    const boxH = ry * 2.2;
    const x1 = cx - boxW / 2;
    const y1 = cy - boxH / 2;

    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    // Top-Left
    ctx.beginPath(); ctx.moveTo(x1, y1 + 15); ctx.lineTo(x1, y1); ctx.lineTo(x1 + 15, y1); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(x1 + boxW - 15, y1); ctx.lineTo(x1 + boxW, y1); ctx.lineTo(x1 + boxW, y1 + 15); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(x1, y1 + boxH - 15); ctx.lineTo(x1, y1 + boxH); ctx.lineTo(x1 + 15, y1 + boxH); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(x1 + boxW - 15, y1 + boxH); ctx.lineTo(x1 + boxW, y1 + boxH); ctx.lineTo(x1 + boxW, y1 + boxH - 15); ctx.stroke();

    // Eye Landmark Dots
    const leftEyeX = cx - rx * 0.45;
    const rightEyeX = cx + rx * 0.45;
    const eyeY = cy - ry * 0.25;

    ctx.fillStyle = '#10B981';
    ctx.beginPath(); ctx.arc(leftEyeX, eyeY, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(rightEyeX, eyeY, 4, 0, 2 * Math.PI); ctx.fill();

    // Eye Gaze Tracking Line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(leftEyeX - 8, eyeY); ctx.lineTo(leftEyeX + 8, eyeY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rightEyeX - 8, eyeY); ctx.lineTo(rightEyeX + 8, eyeY); ctx.stroke();

    // Smile Arc
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + ry * 0.35, rx * 0.4, 0.1 * Math.PI, 0.9 * Math.PI, false);
    ctx.stroke();

    // Sci-Fi Data HUD Overlay
    ctx.fillStyle = '#06B6D4';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText(`EYE CONTACT: ${this.metrics.eyeContact}%`, x1 + 10, y1 - 10);
    ctx.fillText(`EMOTION: ${this.metrics.currentEmotion.toUpperCase()}`, x1 + boxW - 130, y1 - 10);
  }
}

export const visionTracker = new VisionTracker();
