# 🤖 InterviewIQ AI – Intelligent AI-Powered Interview Assessment Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build_Tool-Vite_6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI_Engine-Gemini_1.5/2.0-8E44AD?logo=google)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-10B981)](#)

> **InterviewIQ AI** is a state-of-the-art multi-modal AI interview preparation and candidate assessment platform. By combining **Generative AI + Computer Vision + Speech Intelligence + Resume ATS Analytics + Algorithmic Coding Evaluation**, InterviewIQ AI conducts realistic mock interviews and generates 360-degree candidate scorecards.

---

## 🎯 Problem Statement & Solution

Many job seekers fail technical and HR interviews due to a lack of practice, communication disfluencies, unoptimized resumes, poor eye contact, or interview anxiety. Human mock interviews are expensive, non-standardized, and time-consuming.

**Solution:** **InterviewIQ AI** creates a 360-degree, real-time interview evaluation environment where an AI Interviewer asks adaptive follow-up questions, tracks candidate eye contact & facial emotions via webcam telemetry, measures speech speed (WPM) & filler word disfluencies, evaluates resume ATS match ratios, tests code execution, and exports official PDF scorecards for candidates and recruiters.

---

## 🌟 Key Features

### 1. 🤖 AI Interviewer Hub
- **Dynamic Question Generator**: Generates context-aware follow-up questions tailored to previous candidate answers.
- **8+ Supported Job Roles**: Software Engineer, Data Scientist, Full Stack Developer, AI/ML Engineer, Android Developer, Cybersecurity Analyst, UI/UX Designer, Product Manager.
- **5 Interview Categories**: Technical, Behavioral (STAR methodology), HR Interview, System Design, and Aptitude.
- **Voice Synthesis (TTS)**: Reads interview questions aloud using Web Speech API for an authentic interviewer persona.

### 2. 👁️ Real-Time Computer Vision HUD
- **Canvas Mesh Telemetry**: Sci-Fi HUD canvas overlay tracking facial landmarks in real-time over the live webcam feed.
- **Biometric Metrics**: Calculates Eye Contact %, Smile score, Attention level, Nervousness index, and Head posture.
- **Emotion Recognition Matrix**: Tracks real-time emotional state transitions (Happy, Neutral, Nervous, Surprised, Frustrated).

### 3. 🎙️ Voice Intelligence & Acoustic Analysis
- **Speech Speed (WPM)**: Calculates Words Per Minute speech speed and rates pace (Slow, Optimal, Fast).
- **Filler Word Engine**: Real-time detection and counting of disfluencies ("um", "like", "actually", "basically", "you know").
- **Live Transcript**: Real-time Speech-to-Text transcription.

### 4. 📄 Resume ATS Intelligence Engine
- **ATS Compatibility Gauge**: Calculates overall ATS score (0–100%) against target role skill benchmarks.
- **Missing Keyword Detection**: 1-click addition of missing industry keywords into the resume text.
- **Diagnostic Feedback**: Detailed breakdown of keyword density, formatting layout, project impact, and grammar.

### 5. 💻 Technical Coding Arena
- **In-Browser Code Sandbox**: Multi-language editor (JavaScript, Python) with real-time test case execution runner.
- **AI Code Mentor**: Automated evaluation of Time & Space Complexity ($O(N)$, $O(\log N)$) with code optimization tips.

### 6. 📊 Performance Analytics & Admin / Recruiter Portals
- **360° Radar Scorecard**: Multi-axis radar chart evaluating candidate readiness across 7 core dimensions.
- **Recruiter Candidate Portal**: Candidate leaderboard with shortlisting toggle, side-by-side comparison, and candidate status tracking.
- **Admin Management Portal**: Register candidates, issue 1-click interview invite links, filter by status, and monitor system health metrics.
- **Direct PDF Exporter**: Downloads official PDF evaluation scorecards directly to the user's device via `jsPDF`.

### 7. 🌍 Multi-Language Support
- Prompt & Voice prompt compatibility across **English, Hindi, Tamil, Telugu, Kannada, and Bengali**.

---

## 🏗️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │           React 18 + Vite Frontend           │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       │                              │                              │
         ┌─────────────▼─────────────┐  ┌─────────────▼─────────────┐  ┌─────────────▼─────────────┐
         │ Real-Time Face Vision HUD │  │ Real-Time Speech Engine   │  │ Resume ATS & NLP Engine   │
         │ - Eye Contact %           │  │ - Speech WPM Counter      │  │ - Keyword Match (0-100%)  │
         │ - Emotion Matrix          │  │ - Filler Word Counter     │  │ - Missing Skill Inspector │
         │ - Attention & Posture     │  │ - Vocal Clarity Score     │  │ - Formatting Audit        │
         └─────────────┬─────────────┘  └─────────────┬─────────────┘  └─────────────┬─────────────┘
                       │                              │                              │
                       └──────────────────────────────┼──────────────────────────────┘
                                                      │
                                        ┌─────────────▼─────────────┐
                                        │  AI Orchestrator (Gemini) │
                                        │  + Code Execution Sandbox │
                                        └─────────────┬─────────────┘
                                                      │
                                        ┌─────────────▼─────────────┐
                                        │ 360° AI Performance PDF   │
                                        │ & Recruiter/Admin Portals │
                                        └───────────────────────────┘
```

---

## 🛠️ Tech Stack & Dependencies

| Category | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 6, Tailwind CSS, Lucide Icons |
| **Computer Vision** | HTML5 Canvas API + WebCam Stream + Face Mesh HUD Telemetry |
| **Speech Processing** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) + Web Audio `AnalyserNode` |
| **Document Intelligence** | ATS Parsing Engine + PDF Text Extractor |
| **Generative AI** | Gemini API (`gemini-1.5-flash` / `gemini-2.0`) + Smart Offline Fallback Simulator |
| **Document Export** | `jsPDF` direct vector PDF downloader |
| **Data Analytics** | Recharts (Radar Chart, Area Chart, Bar Chart) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Clone Repository
```bash
git clone https://github.com/Manishsah098/AI-Interview-Simulator.git
cd AI-Interview-Simulator
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Step 4: Build for Production
```bash
npm run build
```

---

## 🔑 Environment & Gemini API Key Setup

InterviewIQ AI operates 100% out-of-the-box using our built-in smart AI simulator. 

To enable live LLM inference with Google Gemini API:
1. Click the **API Key** button in the top navigation bar.
2. Enter your **Gemini API Key** (`AIzaSy...`).
3. Click **Save Key**. (The key is securely stored in your browser's local storage).

---

## 📥 PDF Evaluation Report Export

Candidates and recruiters can export official PDF performance reports:
1. Complete an AI interview session or navigate to the **Recruiter / Admin Portal**.
2. Click **Export Candidate Assessment Report** or **Download PDF Report**.
3. A formatted PDF document (`InterviewIQ_Report_<Role>_<Timestamp>.pdf`) will automatically download to your device.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

---

## 👨‍💻 Developed By

**InterviewIQ AI Development Team** — Built for Hackathons & Candidate Excellence.
