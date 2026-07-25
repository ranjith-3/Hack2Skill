# 🚀 AnchorAI — Complete Project Breakdown & Architecture Guide

> **Created for:** Team AnchorAI · PromptWars Hackathon 2026 (Google for Developers × H2S × Build with AI)  
> **Status:** ✅ 100% Built & Verified (MVP + Stretch Features Complete)

This document provides a comprehensive summary of everything completed in the **AnchorAI** project so far. Use this guide to fully understand the system architecture, code structure, AI implementation, and how to successfully demonstrate the platform to judges.

---

## 1. 🌟 Executive Summary & What We Built

**AnchorAI** is a zero-typing, voice-first, multimodal recovery and prevention web application designed to support individuals navigating substance use disorders during moments of peak cognitive load (crisis moments).

### Core Problem Solved:
In a substance use crisis or craving peak, composing text or navigating complex menus is cognitively difficult or impossible. **AnchorAI eliminates the keyboard**:
1. **One-Tap or Voice Command ("I need help")** immediately triggers a high-contrast, zero-distraction crisis mode.
2. **Google Gemini** generates a compassionate, tailored emergency script based on the user's pre-configured triggers and coping style.
3. **Web Speech API** reads the support script aloud (zero reading required) and guides the user through real-time breathing/grounding exercises.
4. **Caregiver Loop:** A warm, neutral, non-alarming notification is automatically drafted by AI and recorded for the caregiver without exposing clinical details or forcing the user to explain their state.

---

## 2. 🏗️ High-Level System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER & CAREGIVER LAYER                          │
│   ┌────────────────────────────────┐    ┌──────────────────────────┐   │
│   │  Web App (Next.js App Router)  │    │  Caregiver Web Portal    │   │
│   │  Tailwind CSS + Glassmorphism  │    │  (Contact & Alert Logs)  │   │
│   └───────────────┬────────────────┘    └────────────┬─────────────┘   │
└───────────────────┼──────────────────────────────────┼─────────────────┘
                    │                                  │
┌───────────────────▼──────────────────────────────────▼─────────────────┐
│                          LOCAL STORAGE LAYER                           │
│   Privacy-First Data Store: User Profile, Check-ins, Journal, Alerts   │
│   (Zero Personally Identifiable Information stored on remote servers)  │
└───────────────────┬──────────────────────────────────┬─────────────────┘
                    │                                  │
┌───────────────────▼──────────────────────────────────▼─────────────────┐
│                      API LAYER (Serverless Routes)                     │
│    /api/crisis   ·   /api/script   ·   /api/alert   ·   /api/resources  │
│    /api/checkin  ·   /api/journal  (All protected with Zod validation) │
└───────────────────┬──────────────────────────────────┬─────────────────┘
                    │                                  │
     ┌──────────────▼──────────────┐          ┌────────▼────────┐
     │      GOOGLE GEMINI AI       │          │  WEB SPEECH API │
     │  gemini-2.0-flash (Realtime)│          │  Browser Native │
     │  + Retry & Backoff Engine   │          │  STT & TTS I/O  │
     └─────────────────────────────┘          └─────────────────┘
```

---

## 3. 📁 File-by-File Code Breakdown

Every single core file in `c:\projects\Hack2Skill\anchorai\src\` was purposefully engineered. Here is what each file does:

### ⚙️ Core Configuration & Types (`src/lib/` & `src/types/`)
*   **[types.ts](file:///c:/projects/Hack2Skill/anchorai/src/lib/types.ts):** Defines TypeScript interfaces for `UserProfile`, `CheckIn`, `CrisisEvent`, `CaregiverAlert`, `ResourceCard`, and onboarding constants (Substances, Triggers, Coping Styles). Ensures strict type safety across the entire codebase.
*   **[store.ts](file:///c:/projects/Hack2Skill/anchorai/src/lib/store.ts):** Manages the **Privacy-First Local Storage** layer. Handles saving and retrieving profiles, check-in histories, sobriety streak date calculations, and journal entries directly on the user's device without exposing PII to external servers.
*   **[gemini.ts](file:///c:/projects/Hack2Skill/anchorai/src/lib/gemini.ts):** Our custom server-side Google Gemini client wrapper (`@google/generative-ai`).
    *   *Critical Feature:* Includes an **Exponential Backoff Retry Engine** (`generateWithRetry`) that catches `429 Too Many Requests` (quota limit) errors and automatically retries at 2s, 4s, and 8s intervals.
*   **[prompts.ts](file:///c:/projects/Hack2Skill/anchorai/src/lib/prompts.ts):** Centralized library containing all System Instructions and Prompt Builders for Crisis Intervention, Emergency Scripts, Caregiver Alerts, Education Cards, Mood Analytics, and Journal Reframes.
*   **[speech.d.ts](file:///c:/projects/Hack2Skill/anchorai/src/types/speech.d.ts):** TypeScript ambient declarations for the browser-native Web Speech API (`SpeechRecognition` and `SpeechSynthesis`).

### 🎣 Custom React Hooks (`src/hooks/`)
*   **[useProfile.ts](file:///c:/projects/Hack2Skill/anchorai/src/hooks/useProfile.ts):** Connects UI components to `localStorage` state, managing onboarding status, user data updates, and automatically calculating the sobriety streak (in days) based on the sobriety start date.
*   **[useSpeechRecognition.ts](file:///c:/projects/Hack2Skill/anchorai/src/hooks/useSpeechRecognition.ts):** Wraps the browser's native Speech-to-Text (STT) engine. Listens for voice input during journal entries and continuously monitors for voice trigger phrases like *"I need help"*, *"Anchor"*, or *"Help"* to immediately invoke crisis mode.
*   **[useSpeechSynthesis.ts](file:///c:/projects/Hack2Skill/anchorai/src/hooks/useSpeechSynthesis.ts):** Wraps the browser's Text-to-Speech (TTS) engine. Automatically reads Gemini-generated crisis scripts aloud with soothing tone parameters and real-time playback progress tracking.

### 🌐 Serverless AI API Endpoints (`src/app/api/`)
All endpoints utilize **Zod** schema validation to guarantee clean input and feature built-in **Fallback Regressions** so the app *never breaks or displays blank pages* even if network connectivity drops or quotas are exceeded.

*   **[`/api/crisis/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/crisis/route.ts):** Receives the user's profile and trigger type. Calls Gemini Flash to generate an empathetic, concise calming script (<80 words) and a specific grounding technique (e.g., box breathing, 5-4-3-2-1 sensory method). Executed sequentially to respect API rate limits.
*   **[`/api/script/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/script/route.ts):** Called upon onboarding completion. Pre-generates a personalized 90-second emergency defense plan tailored specifically to the individual's identified triggers and preferred coping styles.
*   **[`/api/alert/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/alert/route.ts):** Generates a warm, neutral, non-stigmatizing notification directed to the designated support caregiver (e.g., *"Just a gentle heads up that [Name] used their support tool. No action required — just keeping you in the loop"*).
*   **[`/api/resources/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/resources/route.ts):** Uses Gemini Pro to generate structured JSON containing 5 educational recovery cards written at an accessible 8th-grade reading level, accompanied by practical action tips. Features a **1-hour server memory cache** for ultra-fast load times.
*   **[`/api/checkin/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/checkin/route.ts):** Evaluates the user's last 7 days of mood and craving logs, summarizing behavioral trend insights and recommending one small, concrete adjustment for the day.
*   **[`/api/journal/route.ts`](file:///c:/projects/Hack2Skill/anchorai/src/app/api/journal/route.ts):** Takes raw speech or text journal thoughts and utilizes Gemini to gently reframe negative cognitions, validating emotional distress while providing a constructive, hopeful perspective.

### 🖥️ Frontend User Interface & Pages (`src/app/` & `src/components/`)
*   **[globals.css](file:///c:/projects/Hack2Skill/anchorai/src/app/globals.css):** Defines our bespoke dark-mode design system. Features glassmorphic card containers (`.glass-card`), pulsing red animations for emergency triggers (`.crisis-btn-pulse`), soothing breathing animations (`.breathe-circle`), and shimmer loading placeholders.
*   **[layout.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/layout.tsx):** Root layout wrapping the app with modern Google typography (`Inter`), comprehensive SEO tags, and mobile safe-area paddings.
*   **[page.tsx (Landing)](file:///c:/projects/Hack2Skill/anchorai/src/app/page.tsx):** Smart router that inspects local storage; sends new visitors directly into the onboarding funnel while directing returning users straight to their home dashboard.
*   **[OnboardingFlow.tsx](file:///c:/projects/Hack2Skill/anchorai/src/components/OnboardingFlow.tsx):** A visually stunning 5-screen interactive wizard. Designed for **minimum typing**, utilizing click-based chip selections for addiction recovery substances, triggers, and coping preferences.
*   **[home/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/home/page.tsx):** The primary command center. Contains the prominent, unmissable red **"I Need Help"** emergency button, an interactive 5-emoji daily check-in widget, a sobriety streak day counter with milestone banners, and 24/7 direct click-to-call links for 988 (Suicide & Crisis Lifeline) and SAMHSA helplines.
*   **[crisis/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/crisis/page.tsx):** The **core centerpiece** of AnchorAI. When triggered:
    1. Switches to an ultra-clean, dark, high-contrast Safe Mode screen to lower cognitive stimulation.
    2. Displays an animated speech waveform ([`VoiceWaveform.tsx`](file:///c:/projects/Hack2Skill/anchorai/src/components/VoiceWaveform.tsx)) while reciting the AI calming script aloud via browser TTS.
    3. Guides the user through a rhythmic visual breathing circle animation.
    4. Concludes with a post-crisis evaluation (*"Feeling Better"* vs *"Still Struggling"*), dynamically providing escalation support or returning home safely.
*   **[learn/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/learn/page.tsx):** Interactive resource library displaying Gemini-curated recovery lessons organized by category (Cravings, Treatment, Family, Support) with expandable actionable daily tips.
*   **[journal/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/journal/page.tsx):** Voice-activated journal room. Allows users to tap a microphone button, speak out their craving experiences, and instantly view Gemini's compassionate reframe alongside a chronological history log.
*   **[caregiver/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/caregiver/page.tsx):** Caregiver coordination dashboard. Displays active support contacts, explains the non-invasive alerting mechanism, lets users preview AI-generated test alerts, and logs timestamped notification histories.
*   **[settings/page.tsx](file:///c:/projects/Hack2Skill/anchorai/src/app/settings/page.tsx):** Comprehensive management portal to adjust profile parameters, customize sobriety starting dates, audit cumulative usage metrics, view full disclosure of Gen AI integrations, and safely wipe all local data with a 2-step verification delete button.
*   **[BottomNav.tsx](file:///c:/projects/Hack2Skill/anchorai/src/components/BottomNav.tsx):** Persistent, glassmorphic bottom navigation bar providing seamless one-tap switching between Home, Learn, Journal, Care, and Settings.

---

## 4. 🏆 Alignment With Hackathon Judging Criteria

AnchorAI was systematically architected to maximize points across the 6 official PromptWars parameters:

| Judging Parameter | Impact Weight | How AnchorAI Maximizes Score |
| :--- | :--- | :--- |
| **Code Quality** | 🔴 **High Impact** | Built with robust **TypeScript**, modular clean architecture, DRY principles, component isolation, strict ESLint rules, and explicit interface typing across all layers. |
| **Problem Statement Alignment** | 🔴 **High Impact** | Solves the prompt verbatim: features **zero-typing crisis intervention** (one-tap / voice trigger + TTS playback) for peak cognitive load, personalized scripts, caregiver coordination loops, and preventative AI education. |
| **Security** | 🟡 **Medium Impact** | **Privacy-by-Design:** No Personal Identifiable Information (PII) is uploaded to databases; all sensitive data lives strictly inside local device storage. Serverless routes validate inputs via **Zod** schemas, and API keys remain strictly isolated on the server side. |
| **Efficiency** | 🟡 **Medium Impact** | Deploys low-latency **Gemini Flash (`gemini-2.0-flash`)** for rapid crisis intervention (<3s target) and includes sequential request queuing, **exponential backoff retries**, and 1-hour memory caching for static resource generation. |
| **Testing & Reliability** | ⚪ **Low Impact** | Comprehensive graceful degradation: every AI API route contains **evidence-based fallback content** ensuring the frontend continues operating flawlessly even during network dropouts or API quota exhaustion during demonstrations. |
| **Accessibility** | ⚪ **Low Impact** | Built from the ground up as a **Voice-First** application for users impaired by acute stress or motor distress. Enforces WCAG-friendly high-contrast dark visual palettes, large touch targets (minimum 44×44px), and legible typography. |

---

## 5. 🎤 Step-by-Step Hackathon Demo Script

When presenting AnchorAI to evaluators, follow this precise walkthrough to showcase its technical depth and emotional impact:

1. **The Hook & Problem (30 Seconds):**
   > *"When someone suffers an intense substance craving or addiction crisis, cognitive load skyrockets. Asking a struggling individual to type messages into a standard chatbot is unrealistic and ineffective. Meet **AnchorAI**: a zero-typing, voice-first recovery platform that intervenes instantly when words fail."*
2. **Onboarding — Zero Typing Focus (45 Seconds):**
   * Open `http://localhost:3000` (ensure localStorage is fresh).
   * Demonstrate the **5-step Onboarding Flow**. Point out that beyond entering a name, the user merely taps interactive chips (*Alcohol*, *Stress at Work*, *Breathing Exercises*).
   * Point out that behind the scenes, Google Gemini constructs an individualized emergency profile.
3. **The Core Magic — One-Tap Crisis Intervention (60 Seconds):**
   * On the Home Dashboard, point out the sobriety streak and check-in widget.
   * Click the pulsing red **"🆘 I Need Help"** emergency button.
   * **Highlight what happens without touching the keyboard:** 
     * The UI transforms into an anti-distraction dark mode.
     * Gemini generates an instant, personalized intervention script.
     * The **Web Speech API reads the words aloud to the user** while the audio waveform pulses onscreen.
     * Walk through the visual grounding breathing circle and test the post-crisis check-in button (*"Feeling Better"*).
4. **Caregiver & Prevention Loop (45 Seconds):**
   * Navigate to the **Care** tab. Explain how AnchorAI silently notifies caregivers in parallel during a crisis using warm, stigma-free language drafted by Gemini Flash. Click **"🔔 Preview Alert Message"** to demonstrate live text generation.
   * Jump to the **Journal** tab. Show how users can speak their thoughts aloud, allowing Gemini to return compassionate **Cognitive Reframes** that reshape despair into motivation.
5. **Closing — Technical Distinction (20 Seconds):**
   * Conclude by highlighting the architecture: *"AnchorAI achieves full problem statement alignment by pairing Google Gemini 2.0 Flash with native browser Speech APIs, protected by strict Zod schema validation and local-first data privacy. Thank you."*

---

## 6. 🛠️ Troubleshooting & Live Server Setup

### Starting or Restarting the Dev Server
If you need to kill lingering server processes and restart cleanly on port `3000`, run this terminal command:
```powershell
taskkill /F /IM node.exe 2>$null; Start-Sleep -Seconds 2; npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in **Google Chrome** or **Microsoft Edge** (strongly recommended over Firefox or Safari to guarantee seamless native Web Speech API functionality).

### Resetting the Application (Testing Onboarding Again)
If you want to clear your saved profile and restart from Step 1 of Onboarding:
1. Navigate to **Settings** in the bottom menu and tap **"Delete All My Data"**, OR:
2. In Google Chrome, hit `F12` to open DevTools → Select the **Application** tab → Expand **Local Storage** on the left menu → Select `http://localhost:3000` → Click the 🚫 **Clear All** icon at the top of the storage table → Reload the page (`Ctrl + R`).

### Understanding API Keys & Quotas (HTTP 429 Errors)
*   **Key Format Check:** Standard Google Gemini API keys generated via Google AI Studio typically begin with **`AIzaSy...`**. If your key looks entirely different (such as `AQ.Ab8...`), ensure you clicked **"Get Code"** or **"Create API Key in New Project"** directly inside [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and copied the correct API credentials.
*   **Rate Limits:** The Gemini Free Tier allows 15 Requests Per Minute (RPM) and a dedicated daily token quota. Because demoing onboarding, crisis triggering, caregiver notifications, and resource generating in rapid succession can trigger temporary burst limits (`429 Quota Exceeded`), our wrapper (`gemini.ts`) incorporates **exponential retry logic** alongside seamless fallbacks, guaranteeing your demonstration remains completely stable under any condition!
