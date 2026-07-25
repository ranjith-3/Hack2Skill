# AnchorAI — Recovery & Prevention Platform

> *When words fail, AnchorAI speaks for you.*

A voice-first, zero-typing, AI-powered recovery and prevention platform that intervenes when cognitive load peaks during a substance use crisis. Built for the **PromptWars Hackathon** (Google for Developers × H2S × Build with AI).

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Gemini](https://img.shields.io/badge/OpenRouter-AI-green?logo=openai)

## 🎯 Problem Statement

Design and build a multi-modal, GenAI-powered recovery and prevention platform that supports individuals navigating substance use disorders and their caregivers. The solution must utilize generative AI as a core engine to provide zero-typing interventions, personalized emergency scripts, backed by educational resources, and contextual safety tools that empower users when cognitive load is highest.

## 🚀 Features

### Core (MVP)
- **🆘 One-Tap Crisis Mode** — Full-screen emergency interface activated with a single tap
- **🎤 Voice Activation** — "I need help" triggers crisis flow via Web Speech API
- **🤖 Personalized Emergency Script** — AI-generated 90-second calming scripts using user's profile
- **🔊 AI Voice Playback** — Scripts read aloud via browser TTS (no reading required in crisis)
- **🫁 Grounding Exercise Coach** — Guided breathing and 5-4-3-2-1 exercises, voice-led
- **📞 Crisis Hotline Quick-Connect** — One-tap call to SAMHSA / 988 helpline
- **💜 Caregiver Alert** — Auto-alert sent on crisis trigger with warm, AI-drafted message
- **📋 User Onboarding** — 5-step profile setup with zero-typing chip selectors
- **📚 Resource Library** — AI-curated educational cards on recovery topics
- **🌙 Safe Mode UI** — High-contrast, large-font crisis screen with no distractions

### Enhanced
- **📝 Voice Journal** — Speak your thoughts → Gemini transcribes and provides cognitive reframes
- **😊 Daily Check-In** — One-tap mood/craving tracker with AI pattern insights
- **📊 Streak Counter** — Days clean counter with milestone celebrations
- **⚙️ Profile Management** — Edit profile, view journey stats, manage data

## 🧠 Gen AI Services Used

| Service | Model | Where Used |
|---|---|---|
| **OpenRouter (GPT-4o-mini)** | `gpt-4o-mini` | Crisis intervention responses, caregiver alert drafting, daily check-in analysis, journal cognitive reframes |
| **OpenRouter (GPT-4o)** | `gpt-4o` | Personalized emergency script generation (at onboarding), educational resource card generation |
| **Web Speech API** | Browser native | Voice input (STT) for crisis trigger + journal entry; Text-to-speech (TTS) for reading crisis scripts aloud |

### AI Integration Points
1. `/api/crisis` — GPT-4o-mini generates real-time personalized crisis intervention scripts
2. `/api/script` — GPT-4o creates deep, 90-second emergency scripts at onboarding
3. `/api/alert` — GPT-4o-mini drafts warm, non-alarming caregiver notifications
4. `/api/resources` — GPT-4o generates structured educational resource cards (JSON)
5. `/api/checkin` — GPT-4o-mini analyzes 7-day mood/craving patterns
6. `/api/journal` — GPT-4o-mini provides compassionate cognitive reframes

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (custom design system) |
| **Voice I/O** | Web Speech API (browser native) |
| **AI Engine** | OpenRouter API (native fetch w/ retries) |
| **Data** | LocalStorage (privacy-first, no PII on servers) |
| **Validation** | Zod schema validation on all API routes |
| **Deployment** | Vercel / Antigravity |

## 📦 Setup & Run

### Prerequisites
- Node.js 18+
- OpenRouter API key from [openrouter.ai](https://openrouter.ai)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/anchorai.git
cd anchorai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OPENROUTER_API_KEY
# Edit .env.local and add your EMAIL_USER and EMAIL_PASS

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge (recommended for voice features).

## 🔒 Security & Privacy

- ✅ All user data stored locally on device (localStorage)
- ✅ No PII sent to or stored on servers
- ✅ Voice recordings are never stored — processed by browser only
- ✅ OpenRouter API key and SMTP credentials stored in server-side environment variables only
- ✅ Zod input validation on all API routes
- ✅ HTTPS enforced in production

## ♿ Accessibility

- Voice-first design for motor impairments
- High-contrast crisis mode (dark background, white/green text)
- Minimum 18px font on crisis screen
- 44×44px minimum touch targets
- Keyboard navigation support
- Screen reader labels on interactive elements

## 📁 Project Structure

```
anchorai/
├── src/
│   ├── app/
│   │   ├── api/           # Gemini-powered API routes
│   │   │   ├── crisis/    # Crisis intervention
│   │   │   ├── script/    # Emergency script generation
│   │   │   ├── alert/     # Caregiver notifications
│   │   │   ├── resources/ # Educational content
│   │   │   ├── checkin/   # Check-in analysis
│   │   │   └── journal/   # Journal reframes
│   │   ├── home/          # Dashboard
│   │   ├── crisis/        # Crisis mode (fullscreen)
│   │   ├── learn/         # Resource library
│   │   ├── journal/       # Voice journal
│   │   ├── caregiver/     # Caregiver management
│   │   └── settings/      # Profile & data
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities, types, AI client
```

## 🏆 Hackathon Submission

- **Hackathon:** PromptWars (In-person) — Google for Developers × H2S × Build with AI
- **Challenge:** Recovery and Prevention Platform
- **Team:** AnchorAI

---

*Built with ❤️ and Google Gemini for the PromptWars Hackathon 2026*
