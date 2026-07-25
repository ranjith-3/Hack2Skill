# AnchorAI — Recovery & Prevention Platform
## PromptWars Hackathon · Google for Developers × H2S × Build with AI
### First-Level Actionable Project Document · v1.0

---

## ⚠️ ASSUMPTIONS (Confirm or Adjust Before Building)

| Assumption | Working Value | Action Needed |
|---|---|---|
| **Platform** | **Responsive Web Application** — desktop-primary, responsive to tablet/mobile browser | No native app; no PWA install required |
| **"Genius AI Service"** | **Google Gemini 1.5 Flash + Pro** via AI Studio API (Google event context) | Confirm: replace with correct service name if different |
| **AI Depth** | Functional production prototype with live Gemini calls | Confirm: no mocked responses |
| **Data Privacy** | No PII stored server-side; session-scoped; local-first | Confirm: no clinical/HIPAA compliance required for hackathon |
| **Build Environment** | Cursor IDE + GitHub (public repo) + Antigravity deployment | Confirm: verify Antigravity account is live |
| **Team Size** | 2–3 people | Adjust phase timelines accordingly |
| **Time Budget** | ~6–8 hours build window (typical hackathon sprint) | Adjust scope if different |

---

## 1. EXECUTIVE SUMMARY

**Project Name:** AnchorAI
**Tagline:** *When words fail, AnchorAI speaks for you.*

AnchorAI is a zero-typing, voice-first, multimodal GenAI recovery **website** that intervenes when cognitive load peaks during a substance use crisis. It serves two users simultaneously: the **person in recovery** (who gets instant, hands-free support via their browser) and the **caregiver** (who gets real-time alerts and a coordination dashboard).

### Why AnchorAI Stands Out Among 100 Teams

The challenge brief contains one precise, under-addressed phrase: *"when cognitive load is highest."* Most teams will build a chatbot that requires composing a message in a crisis — the exact moment when typing is impossible. AnchorAI eliminates the keyboard entirely:

- **One tap or one word** triggers a 90-second, AI-voiced emergency script customized to the user's substance, triggers, and coping style.
- **Caregivers receive an alert** with the user's last known safe location and a recommended response script — without the user having to explain anything.
- **Between crises**, the platform educates and builds personalized resilience plans using Gemini's long-context reasoning.

**Judge-Facing Alignment:**
| Judge Criterion | How AnchorAI Delivers |
|---|---|
| **Code Quality (High)** | TypeScript + Next.js 14, clean component separation, documented API routes |
| **Problem Statement Alignment (High)** | Directly solves zero-typing, emergency scripts, caregiver loop — verbatim from brief |
| **Security (Medium)** | No PII on server; Supabase RLS; HTTPS-only; input sanitization |
| **Efficiency (Medium)** | Gemini Flash for crisis (low latency); Pro for generation; edge deployment |
| **Testing (Low)** | Jest unit tests on AI utility functions; Playwright E2E on critical flow |
| **Accessibility (Low)** | Voice-first by design; WCAG 2.1 AA; high-contrast crisis mode |

---

## 2. PROJECT OBJECTIVE & SUCCESS CRITERIA

### Objective
Build a deployed, multimodal web application that:
1. Delivers a complete crisis intervention flow in under 3 seconds with zero typing required.
2. Generates personalized, Gemini-backed emergency scripts specific to the individual's recovery context.
3. Notifies caregivers automatically and provides them actionable guidance.
4. Educates users with AI-curated resources during calm, low-load periods.

### MVP Success Criteria (Hard Targets)
- [ ] Crisis mode triggered by one tap or voice command, fully functional
- [ ] Gemini API response rendered (spoken aloud) in ≤ 3 seconds on mobile
- [ ] Personalized emergency script generated using user profile (name, substance, triggers, coping style)
- [ ] Caregiver SMS/email alert sent within 30 seconds of crisis trigger
- [ ] App fully functional in desktop Chrome/Edge/Firefox (primary browsers)
- [ ] Responsive layout — readable on tablet/mobile browser without breaking
- [ ] GitHub repo public with README; deployed link live on Antigravity
- [ ] Gen AI service integration documented in submission description

### Stretch Success Criteria
- [ ] Daily check-in with craving/mood log (voice or one-tap only)
- [ ] Multilingual support (Gemini translation layer)
- [ ] Caregiver web dashboard with activity timeline
- [ ] Trigger pattern analysis ("You tend to struggle Friday evenings")

---

## 3. FEATURE LIST — 25 CAPABILITIES

### 🔴 CORE (MVP — Build First)

| # | Feature | Description | Gemini Role |
|---|---|---|---|
| 1 | **One-Tap Crisis Mode** | Full-screen emergency interface, single tap activates — no typing ever required | Response generation + TTS |
| 2 | **Voice Activation** | "Hey Anchor" or "I need help" triggers crisis flow via Web Speech API | Intent recognition |
| 3 | **Personalized Emergency Script** | AI-generated 60–90 sec calming script using user's name, substance, and triggers | Gemini Pro generation |
| 4 | **AI Voice Playback** | Script read aloud via browser TTS (no reading required in crisis) | Text-to-speech output |
| 5 | **Grounding Exercise Coach** | Guided 5-4-3-2-1 or box breathing, voice-led | Real-time voice coaching |
| 6 | **Crisis Hotline Quick-Connect** | One-tap call to SAMHSA / local helpline, pre-populated | Static + AI routing |
| 7 | **Caregiver Alert (SMS/Email)** | Auto-alert sent on crisis trigger with user's safe message | Gemini drafts alert message |
| 8 | **User Onboarding Profile** | 5-question setup: name, substance, top triggers, coping preference, safe contacts | Gemini summarizes profile |
| 9 | **Resource Library** | AI-curated educational cards on recovery, stigma, medication-assisted treatment | Gemini content generation |
| 10 | **Safe Mode UI** | High-contrast, large-font, minimal UI for crisis screen — no distractions | UI design decision |

### 🟡 NICE-TO-HAVE (Build in Phase 2 if time allows)

| # | Feature | Description | Gemini Role |
|---|---|---|---|
| 11 | **Daily Check-In** | Morning/evening mood + craving tracker, voice or emoji-tap only | Gemini interprets trend |
| 12 | **Craving Journal (Voice)** | Speak your thoughts; Gemini transcribes and reflects back a reframe | STT + reframe generation |
| 13 | **Trigger Pattern Insights** | AI surfaces patterns from check-in history ("Fridays after 6pm are high-risk") | Gemini analysis |
| 14 | **Recovery Milestone Tracker** | Days sober counter with AI-generated encouragement messages | Gemini personalization |
| 15 | **Caregiver Dashboard** | Web portal for caregivers: timeline, alerts, Gemini-suggested responses | Gemini response coaching |
| 16 | **Educational Micro-Lessons** | 3-min AI-generated lessons on topics like withdrawal, stigma, family roles | Gemini lesson generation |
| 17 | **Multilingual Support** | All content + scripts translated via Gemini into user's language | Gemini translation |
| 18 | **Contextual Safety Tips** | AI detects time-of-day/context and proactively surfaces tips | Gemini contextual reasoning |
| 19 | **Emergency Contact Manager** | Store + manage caregiver contacts within the app | Standard CRUD + AI drafting |
| 20 | **Progress Narrative** | Gemini writes a weekly "recovery story" summary from user data | Long-context generation |

### ⚪ OPTIONAL (Phase 3 / Post-Hackathon)

| # | Feature | Description |
|---|---|---|
| 21 | **Offline Crisis Mode** | Cache last-generated scripts for use without connectivity (Service Worker) |
| 22 | **Peer Connection** | Anonymous, AI-moderated peer support chat |
| 23 | **Telehealth Bridge** | AI triage → handoff to licensed counselor via video |
| 24 | **Browser Notification Reminders** | Web Push API sends timed check-in reminders in desktop Chrome/Edge |
| 25 | **Clinical Provider Dashboard** | De-identified analytics for treatment providers |

---

## 4. HIGH-LEVEL ARCHITECTURE

### Component Map

```
┌─────────────────────────────────────────────────────┐
│                    USER LAYER                        │
│  ┌──────────────────┐    ┌────────────────────────┐  │
│  │  Web App (User)  │    │  Caregiver Web Portal  │  │
│  │  Next.js 14 +    │    │  Next.js 14            │  │
│  │  Tailwind CSS    │    │  (separate route/page) │  │
│  └────────┬─────────┘    └────────────┬───────────┘  │
└───────────┼──────────────────────────┼───────────────┘
            │                          │
┌───────────▼──────────────────────────▼───────────────┐
│                   API LAYER                           │
│         Next.js API Routes (serverless)               │
│  /api/crisis  /api/script  /api/checkin  /api/alert   │
└───────────┬──────────────────────────┬───────────────┘
            │                          │
     ┌──────▼──────┐          ┌────────▼────────┐
     │  GEMINI AI  │          │   SUPABASE      │
     │  1.5 Flash  │          │  (Postgres +    │
     │  (crisis)   │          │   Auth + RLS)   │
     │  1.5 Pro    │          │                 │
     │  (scripts)  │          │  Tables:        │
     └──────┬──────┘          │  - users        │
            │                 │  - profiles     │
     ┌──────▼──────┐          │  - checkins     │
     │  Web Speech │          │  - alerts       │
     │  API (STT)  │          └────────┬────────┘
     │  + TTS      │                   │
     └─────────────┘          ┌────────▼────────┐
                              │  NOTIFICATION   │
                              │  LAYER          │
                              │  Twilio SMS     │
                              │  Web Push API   │
                              └─────────────────┘
```

### Data Flow — Crisis Intervention (Core Flow)

```
USER TRIGGERS CRISIS
      │
      ▼
[1] One-Tap / Voice Command
      │
      ▼
[2] Frontend switches to Safe Mode UI (full-screen, high contrast)
    Web Speech API begins recording
      │
      ▼
[3] POST /api/crisis
    Body: { userId, triggerType: "tap"|"voice", voiceTranscript? }
      │
      ▼
[4] Server fetches UserProfile from Supabase
    (name, substance, triggers, coping style, caregiver contacts)
      │
      ▼
[5] Gemini 1.5 Flash call:
    System: crisis_intervention_prompt (see Section 6)
    Context: userProfile + triggerType
    → Returns: { script (text), groundingExercise, hotlineNumber }
      │
      ├──► [6a] Script sent to frontend → Web Speech API reads aloud
      │
      └──► [6b] POST /api/alert
                Twilio SMS to caregiver contacts
                Gemini drafts caregiver message
                (parallel, non-blocking)
      │
      ▼
[7] Crisis session logged to Supabase (anonymized, no raw transcript)
      │
      ▼
[8] Post-crisis: "How are you feeling?" (one-tap: Better / Still Struggling)
    → Gemini adapts follow-up based on response
```

### Routing & State Map

```
/                    → Landing + Onboarding (if no profile)
/home                → Dashboard: check-in, resources, streak
/crisis              → CRISIS MODE (fullscreen, voice-first)
/caregiver           → Caregiver alert setup + dashboard
/learn               → Resource library (AI-curated)
/journal             → Voice journal + craving log
/settings            → Profile, contacts, preferences
/api/crisis          → POST: trigger crisis flow
/api/script          → POST: generate personalized script
/api/checkin         → POST/GET: daily check-in data
/api/alert           → POST: send caregiver notification
/api/resources       → GET: AI-generated resource cards
```

---

## 5. TECH STACK

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR + API routes in one codebase; ideal for web submission |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, accessible, responsive grid |
| **Voice I/O** | Web Speech API (native browser) | Zero install; works natively in Chrome/Edge on desktop |
| **AI (Crisis)** | Gemini 1.5 Flash API | Lowest latency; ≤1s responses |
| **AI (Scripts/Content)** | Gemini 1.5 Pro API | Highest quality generation |
| **Database + Auth** | Supabase (PostgreSQL + GoTrue) | RLS, realtime, free tier, fast setup |
| **Notifications** | Twilio SMS + Web Push API | SMS reliable in crisis; Push for ambient |
| **Deployment** | Antigravity (primary) / Vercel (fallback) | Per hackathon requirement |
| **IDE** | Cursor | AI-assisted development speed |
| **Version Control** | GitHub (public repo) | Submission requirement |

---

## 6. MVP SPECIFICATION

### Scoped MVP Features (Build These Only in Phase 1)
1. User onboarding (5-field profile: name, substance, 3 triggers, coping style, 1 caregiver contact)
2. Home screen with "I Need Help" emergency button
3. Crisis mode: Gemini Flash generates + speaks personalized script
4. Caregiver SMS alert via Twilio
5. Static resource library (3–5 AI-generated cards)
6. Basic auth (Supabase email/magic link)

### Minimal UI/UX for MVP

**Home Screen:**
- Large centered "I Need Help" button (red, cannot be missed)
- "How are you today?" one-tap check-in (3 emoji options)
- Streak counter ("Day 47 clean")
- Bottom nav: Home / Learn / Journal / Settings

**Crisis Screen:**
- Full black/dark background (removes distractions)
- Animated waveform while AI speaks
- Text of script displayed in large font (backup for audio issues)
- "Call Helpline" button always visible
- "I'm OK" button to exit

**Onboarding (first-launch only):**
- Screen 1: Name
- Screen 2: Primary substance (selector)
- Screen 3: Top 3 triggers (multi-select chips)
- Screen 4: Preferred coping style (selector: breathing, talking, distraction, movement)
- Screen 5: Caregiver contact (name + phone/email)

### MVP Success Metrics
- Crisis-to-speech in ≤ 3 seconds
- Full zero-typing crisis flow working end-to-end
- Caregiver alert delivered in ≤ 30 seconds
- App renders correctly in Chrome, Edge, and Firefox (desktop)
- GitHub repo live + Antigravity deployment URL working

---

## 7. PHASED PLAN

### Phase 1 — MVP (Hours 0–3)

**Goal:** One working end-to-end crisis flow, deployed.

| Task | Owner | Estimate |
|---|---|---|
| Next.js project init, Tailwind setup, Supabase connect | Dev 1 | 20 min |
| User onboarding screens + profile schema | Dev 2 | 40 min |
| Supabase auth (magic link) | Dev 1 | 20 min |
| `/api/crisis` route + Gemini Flash integration | Dev 1 | 45 min |
| Crisis screen UI (full-screen, voice playback) | Dev 2 | 45 min |
| Web Speech API hook (STT + TTS) | Dev 1 | 30 min |
| Twilio SMS alert integration | Dev 2 | 30 min |
| Home screen + "I Need Help" button wiring | Both | 20 min |
| Deploy to Antigravity, verify public URL | Dev 1 | 15 min |
| **Phase 1 Review — test crisis flow end-to-end** | Both | 15 min |

**Phase 1 Deliverable:** Working app, deployed, crisis flow functional.

---

### Phase 2 — Enhancements (Hours 3–6)

**Goal:** Round out the platform to be judge-impressive.

| Task | Owner | Estimate |
|---|---|---|
| Daily check-in screen (emoji tap + voice journal) | Dev 2 | 45 min |
| `/api/resources` + AI resource cards | Dev 1 | 40 min |
| Resource library UI | Dev 2 | 30 min |
| Craving pattern analysis prompt + UI | Dev 1 | 45 min |
| Caregiver dashboard page (simple alerts log) | Dev 2 | 45 min |
| Multilingual support (Gemini translate layer) | Dev 1 | 30 min |
| Accessibility audit (voice, contrast, font size) | Both | 20 min |
| Add Jest tests for Gemini utility functions | Dev 1 | 25 min |
| Polish UI, loading states, error handling | Dev 2 | 30 min |
| **Phase 2 Review** | Both | 15 min |

---

### Phase 3 — Polish & Submission (Hours 6–8)

| Task | Owner | Estimate |
|---|---|---|
| Write GitHub README with setup + Gemini usage docs | Dev 1 | 25 min |
| Record 2-min demo video (optional but impactful) | Dev 2 | 30 min |
| Write project description (400 words, Gen AI usage noted) | Dev 1 | 20 min |
| Final deployment verification | Both | 10 min |
| Submit: GitHub link + deployed link + description | Both | 10 min |

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### Security
- HTTPS enforced on all routes (Antigravity default)
- No PII (names, substance data) stored on server in plaintext
- Supabase Row-Level Security: users can only read their own rows
- Gemini API key stored in environment variables only, never client-side
- Input sanitization on all API routes (Zod schema validation)
- Twilio credentials in `.env` only, server-side

### Accessibility (WCAG 2.1 AA Target)
- Voice-first design is inherently accessible for motor impairments
- High-contrast crisis mode (black background, white/green text)
- Font size minimum 18px on crisis screen
- All buttons minimum 44×44px touch target
- Screen reader labels on all interactive elements
- Keyboard navigation on web version

### Performance
- Target: < 2s Time to Interactive on desktop broadband
- Gemini Flash: target ≤ 1s API response; 3s max acceptable in crisis flow
- Static assets cached via Next.js built-in caching (no Service Worker needed)
- Images optimized with Next.js Image component
- API routes run at edge (Antigravity/Vercel edge functions)

### Scalability
- Serverless architecture auto-scales with demand
- Supabase free tier supports up to 500MB; sufficient for demo
- Gemini API rate limits: 60 RPM (Flash), 2 RPM (Pro) on free tier
  - **Note:** Pro generation (script creation) happens at onboarding, not in crisis loop — Flash handles real-time

### Privacy
- Voice recordings are NOT stored; processed by browser Web Speech API only
- Craving journal entries stored encrypted in Supabase
- Caregiver alert message contains no clinical details by default
- Users can delete all data from Settings

---

## 9. RISK ASSESSMENT

| Risk | Severity | Probability | Mitigation |
|---|---|---|---|
| Gemini latency > 3s during crisis flow | High | Medium | Use Flash model for crisis; pre-cache one generic script as fallback |
| Twilio SMS fails to deliver | High | Low | Add Web Push as secondary; show in-app notification as tertiary |
| Antigravity deployment fails | High | Low | Have Vercel account ready as instant fallback |
| Web Speech API not available in Firefox/Safari (desktop) | Medium | Medium | Detect API support on load; show a "Use Chrome/Edge for voice features" banner; all flows have click-based fallbacks |
| Gemini generates harmful/inaccurate crisis advice | High | Medium | System prompt includes strict guardrails; always append hotline number |
| Scope creep eats MVP time | High | High | Enforce phase gates; Phase 1 must be done and deployed before Phase 2 starts |
| Supabase schema migrations during build | Medium | Low | Design schema fully before writing code; one migration only |
| API key exposed in client bundle | Critical | Low | Strict env variable discipline; Cursor `.env` reminder |
| Team build conflict on same file | Medium | Medium | Divide: Dev 1 owns API routes + AI; Dev 2 owns UI + components |

---

## 10. GEMINI AI INTEGRATION — EXAMPLE PROMPTS & API PATTERNS

> **Note:** "Genius AI Service" interpreted as **Google Gemini** (Gemini 1.5 Flash + Pro via AI Studio). Replace model strings if using a different service.

### 10.1 Crisis Intervention Prompt (Gemini 1.5 Flash)

```javascript
// /api/crisis/route.ts
const systemPrompt = `
You are AnchorAI, a compassionate crisis support companion for someone 
experiencing a substance use craving or crisis moment. 
They are in distress and may not be able to read — your response will be 
spoken aloud to them.

Rules:
- Keep your response under 80 words total
- Speak warmly, calmly, and without judgment
- Use their name exactly once at the start
- Reference their specific substance only if they provided it
- Guide them through exactly one grounding action (e.g., box breathing, 5-4-3-2-1)
- End with a short affirmation of their strength
- ALWAYS append: "If you're in immediate danger, call 988 (Suicide & Crisis Lifeline) or 1-800-662-4357 (SAMHSA)"
- Never provide medical advice or medication guidance
`;

const userPrompt = `
User profile:
- Name: ${profile.name}
- Primary substance: ${profile.substance}
- Current trigger (if voice): "${voiceTranscript || 'not provided'}"
- Preferred coping style: ${profile.copingStyle}

Generate a crisis intervention response now.
`;

const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
  body: JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
  })
});
```

---

### 10.2 Personalized Emergency Script Generation (Gemini 1.5 Pro)

```javascript
// Called at onboarding — pre-generates and stores user's personal script
const scriptPrompt = `
Create a personalized 90-second emergency script for someone in substance use recovery.

Profile:
- Name: ${profile.name}
- Primary substance: ${profile.substance}  
- Top triggers: ${profile.triggers.join(", ")}
- Preferred coping: ${profile.copingStyle}
- Support person: ${profile.caregiverName}

The script should:
1. Open with their name and immediate validation (2 sentences)
2. Guide them through their preferred coping exercise (30 seconds when read aloud)
3. Remind them of a specific strength or past success (10 seconds)
4. Close with their caregiver's name and the SAMHSA helpline number

Format: Plain spoken text only. No headers, no markdown. Approx 200 words.
`;
```

---

### 10.3 Caregiver Alert Message Generation (Gemini 1.5 Flash)

```javascript
const alertPrompt = `
Write a brief, calm SMS message (under 120 characters) to a caregiver named 
${caregiverName} letting them know that ${userName} has activated their crisis 
support tool and may need a supportive call or message. 
Do not mention the word "addiction" or "crisis". Use warm, neutral language.
Keep it factual and non-alarming. End with: "No action required — just a heads up."
`;
```

---

### 10.4 Educational Resource Card Generation (Gemini 1.5 Pro)

```javascript
const resourcePrompt = `
Create a set of 5 educational cards for someone in early substance use recovery.
Each card covers a different topic.

Return ONLY valid JSON with this exact structure:
{
  "cards": [
    {
      "title": "string (max 8 words)",
      "topic": "string",
      "summary": "string (2-3 sentences, plain language, 8th grade reading level)",
      "practicalTip": "string (one action they can take today)",
      "readTime": "number (in minutes)"
    }
  ]
}

Topics to cover: understanding cravings, talking to family, medication-assisted treatment, 
building a support network, managing high-risk situations.
No preamble. No markdown. JSON only.
`;
```

---

### 10.5 Daily Check-In Analysis (Gemini 1.5 Flash)

```javascript
const analysisPrompt = `
A person in recovery logged these mood/craving check-ins over the past 7 days:
${JSON.stringify(checkIns)}

In 2 sentences, identify ONE pattern you notice and suggest ONE concrete action for today.
Be warm and specific. Do not be clinical. Begin with "I noticed..."
`;
```

---

### 10.6 Pattern Recognition Insight (Gemini 1.5 Pro)

```javascript
const patternPrompt = `
Analyze this recovery check-in dataset (${checkIns.length} entries):
${JSON.stringify(checkIns)}

Identify the top 2 highest-risk time/mood patterns. 
Return as JSON: { "patterns": [{ "observation": "string", "recommendation": "string" }] }
JSON only. No preamble.
`;
```

---

## 11. NEXT-STEP TASKS (Immediate Actions for the Team)

### Right Now (Before Writing Any Code)

- [ ] **Confirm Genius AI = Gemini** — get API key from [aistudio.google.com](https://aistudio.google.com)
- [ ] **Verify Antigravity account** — test a blank Next.js deploy works
- [ ] **Set up GitHub repo** — public, add `.gitignore` for `.env`
- [ ] **Create Supabase project** — copy connection string + anon key
- [ ] **Create Twilio account** — get a free trial number for SMS
- [ ] **Cursor setup** — open repo in Cursor, add context for this doc

### In First 30 Minutes

```bash
# Project scaffold
npx create-next-app@latest anchorai --typescript --tailwind --app
cd anchorai
npx shadcn@latest init
npm install @supabase/supabase-js twilio zod
```

- Create `.env.local`:
  ```
  GEMINI_API_KEY=your_key_here
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  SUPABASE_SERVICE_ROLE_KEY=your_key
  TWILIO_ACCOUNT_SID=your_sid
  TWILIO_AUTH_TOKEN=your_token
  TWILIO_FROM_NUMBER=+1xxxxxxxxxx
  ```

### Supabase Schema (Run This First)

```sql
-- Users profile table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  substance TEXT NOT NULL,
  triggers TEXT[] DEFAULT '{}',
  coping_style TEXT NOT NULL,
  caregiver_name TEXT,
  caregiver_contact TEXT,
  personal_script TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  craving_level INTEGER CHECK (craving_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis events (anonymized)
CREATE TABLE crisis_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trigger_type TEXT,
  caregiver_alerted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own checkins" ON checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own events" ON crisis_events FOR ALL USING (auth.uid() = user_id);
```

---

## 12. SUBMISSION CHECKLIST

- [ ] GitHub repo URL (public, with README)
- [ ] Deployed project URL (Antigravity)
- [ ] Project description (400 words max)
- [ ] Gen AI services listed:
  - **Google Gemini 1.5 Flash** — crisis intervention responses, caregiver alerts
  - **Google Gemini 1.5 Pro** — personalized script generation, resource cards, pattern analysis
  - **Web Speech API (Browser)** — STT (voice trigger) + TTS (script playback)

---

*Document prepared for PromptWars Hackathon | AnchorAI Team | July 2026*
*Assumptions marked ⚠️ should be verified with the full team before build begins.*
