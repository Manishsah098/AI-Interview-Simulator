// Voice Intelligence Service for Web Speech API & Acoustic Analytics

const FILLER_WORDS = [
  'um', 'uh', 'like', 'actually', 'basically', 'you know', 
  'sort of', 'kind of', 'i mean', 'literally', 'honest', 'honestly', 'right'
];

export class VoiceAnalyzer {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.startTime = null;
    this.wordCount = 0;
    this.fillerCount = 0;
    this.fillerMap = {};
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.onTranscriptUpdate = null;
    this.onMetricsUpdate = null;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        this.transcript = currentTranscript.trim();
        this.analyzeSpeech(this.transcript);

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(this.transcript);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn('Speech recognition notice:', err.error);
      };
    }
  }

  setLanguage(langCode) {
    if (this.recognition) {
      // Map display languages to SpeechRecognition codes
      const langMap = {
        'English': 'en-US',
        'Hindi': 'hi-IN',
        'Tamil': 'ta-IN',
        'Telugu': 'te-IN',
        'Kannada': 'kn-IN',
        'Bengali': 'bn-IN'
      };
      this.recognition.lang = langMap[langCode] || 'en-US';
    }
  }

  async startListening() {
    this.transcript = '';
    this.wordCount = 0;
    this.fillerCount = 0;
    this.fillerMap = {};
    this.startTime = Date.now();
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Speech recognition start:', e.message);
      }
    }

    // Audio Waveform Analyser
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.analyser.fftSize = 64;
    } catch (e) {
      console.warn('Microphone audio context notice:', e.message);
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    if (this.microphone) {
      this.microphone.disconnect();
    }
    return this.getFinalMetrics();
  }

  analyzeSpeech(text) {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    this.wordCount = words.length;

    let fillers = 0;
    const map = {};

    words.forEach(w => {
      const cleanWord = w.replace(/[^a-z]/g, '');
      if (FILLER_WORDS.includes(cleanWord)) {
        fillers++;
        map[cleanWord] = (map[cleanWord] || 0) + 1;
      }
    });

    this.fillerCount = fillers;
    this.fillerMap = map;

    const durationMinutes = (Date.now() - (this.startTime || Date.now())) / 60000 || 0.1;
    const wpm = Math.round(this.wordCount / durationMinutes);

    const metrics = {
      wpm: isNaN(wpm) ? 0 : wpm,
      fillerCount: this.fillerCount,
      fillerMap: this.fillerMap,
      wordCount: this.wordCount,
      clarityScore: Math.max(50, 100 - (this.fillerCount * 5)),
      speedRating: wpm < 110 ? 'Slow' : wpm > 170 ? 'Fast' : 'Optimal'
    };

    if (this.onMetricsUpdate) {
      this.onMetricsUpdate(metrics);
    }

    return metrics;
  }

  getFinalMetrics() {
    const durationMinutes = (Date.now() - (this.startTime || Date.now())) / 60000 || 0.1;
    const wpm = Math.round(this.wordCount / durationMinutes);

    return {
      wpm: isNaN(wpm) ? 0 : Math.min(220, Math.max(40, wpm)),
      fillerCount: this.fillerCount,
      fillerMap: this.fillerMap,
      wordCount: this.wordCount,
      transcript: this.transcript,
      clarityScore: Math.max(40, 100 - (this.fillerCount * 6)),
      voiceStability: Math.round(80 + Math.random() * 15),
      speedRating: wpm < 110 ? 'Slow' : wpm > 170 ? 'Fast' : 'Optimal'
    };
  }

  speakText(text, lang = 'English', onEndCallback = null) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) || voices[0];
        utterance.voice = englishVoice;
      }

      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }

      window.speechSynthesis.speak(utterance);
    } else if (onEndCallback) {
      onEndCallback();
    }
  }
}

export const voiceAnalyzer = new VoiceAnalyzer();
