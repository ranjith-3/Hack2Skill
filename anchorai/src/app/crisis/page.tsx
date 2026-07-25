// ============================================================
// AnchorAI — Crisis Mode Page
// Full-screen, voice-first emergency intervention
// Zero typing required — tap or voice to activate
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import VoiceWaveform from '@/components/VoiceWaveform';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { getProfile, saveCrisisEvent, saveCaregiverAlert, generateId } from '@/lib/store';
import { sendCaregiverNotification } from '@/lib/notifications';
import type { UserProfile, CrisisResponse } from '@/lib/types';

type CrisisState = 'loading' | 'speaking' | 'grounding' | 'post-crisis' | 'error';

export default function CrisisPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<CrisisState>('loading');
  const [crisisData, setCrisisData] = useState<CrisisResponse | null>(null);
  const [postFeeling, setPostFeeling] = useState<'better' | 'struggling' | null>(null);
  const [alertSent, setAlertSent] = useState<string | null>(null);

  const { isSpeaking, speak, cancel: cancelSpeech } = useSpeechSynthesis({
    rate: 0.85,
    onEnd: () => {
      if (state === 'speaking') {
        setState('grounding');
      }
    },
  });

  // Trigger crisis flow on mount
  const triggerCrisis = useCallback(async (p: UserProfile) => {
    setState('loading');

    try {
      const res = await fetch('/api/crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          substance: p.substance,
          copingStyle: p.copingStyle,
          triggerType: 'tap',
        }),
      });

      const data: CrisisResponse = await res.json();
      setCrisisData(data);
      setState('speaking');

      // Speak the crisis script
      speak(data.script);

      // Log crisis event
      saveCrisisEvent({
        id: generateId(),
        userId: p.id,
        triggerType: 'tap',
        caregiverAlerted: true,
        createdAt: new Date().toISOString(),
      });

      // Send caregiver alert (non-blocking) — with visible feedback
      if (p.caregiverName) {
        fetch('/api/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caregiverName: p.caregiverName,
            caregiverContact: p.caregiverContact,
            userName: p.name,
            userEmail: p.userEmail,
          }),
        })
          .then((r) => r.json())
          .then((alertData) => {
            saveCaregiverAlert({
              id: generateId(),
              userId: p.id,
              message: alertData.message,
              sentAt: alertData.sentAt || new Date().toISOString(),
              method: 'in-app',
            });
            // Send real notification via Browser Notification + BroadcastChannel
            sendCaregiverNotification(p.caregiverName!, p.name, alertData.message);
            // Show visible confirmation to user
            setAlertSent(`✓ ${p.caregiverName} has been notified`);
            setTimeout(() => setAlertSent(null), 8000);
          })
          .catch((err) => {
            console.error(err);
            setAlertSent(`✓ ${p.caregiverName} alert saved (offline mode)`);
            saveCaregiverAlert({
              id: generateId(),
              userId: p.id,
              message: `Gentle check-in: ${p.name} used their AnchorAI support tool.`,
              sentAt: new Date().toISOString(),
              method: 'in-app',
            });
            setTimeout(() => setAlertSent(null), 8000);
          });
      }
    } catch (error) {
      console.error('Crisis API error:', error);
      // Use fallback script
      const fallback: CrisisResponse = {
        script: `${p.name}, you're safe right now. Take a slow breath in through your nose for 4 counts... hold it... and exhale through your mouth for 6 counts. You've made it through tough moments before, and you'll make it through this one too. If you need immediate help, call 988 or 1-800-662-4357.`,
        groundingExercise: "Let's try the 5-4-3-2-1 technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        hotlineNumber: '988 or 1-800-662-4357',
      };
      setCrisisData(fallback);
      setState('speaking');
      speak(fallback.script);
    }
  }, [speak]);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    setProfile(p);
    triggerCrisis(p);

    return () => {
      cancelSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostFeeling = (feeling: 'better' | 'struggling') => {
    setPostFeeling(feeling);
    if (feeling === 'better') {
      setTimeout(() => router.push('/home'), 2000);
    }
  };

  const handleCallHotline = () => {
    window.location.href = 'tel:988';
  };

  return (
    <div className="crisis-bg fixed inset-0 flex flex-col items-center justify-center p-6 z-[100]">
      {/* Breathing background circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="breathe-circle w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* ═══ CAREGIVER ALERT TOAST ═══ */}
        {alertSent && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
            <div className="px-5 py-3 rounded-2xl bg-[rgba(139,92,246,0.2)] border border-[#8b5cf6]/40 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-[rgba(139,92,246,0.2)]">
              <span className="text-lg">💜</span>
              <span className="text-sm text-[#c4b5fd] font-medium">{alertSent}</span>
            </div>
          </div>
        )}
        {/* ═══ LOADING STATE ═══ */}
        {state === 'loading' && (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Hold on, {profile?.name}
            </h1>
            <p className="text-[#94a3b8]">Getting your personalized support ready...</p>
          </div>
        )}

        {/* ═══ SPEAKING STATE ═══ */}
        {state === 'speaking' && crisisData && (
          <div className="text-center animate-fade-in-up w-full">
            <div className="mb-6">
              <VoiceWaveform isActive={isSpeaking} />
            </div>
            <p className="text-xl leading-relaxed text-white font-medium mb-8 max-h-[40vh] overflow-y-auto px-2">
              {crisisData.script}
            </p>
            <button
              onClick={() => { cancelSpeech(); setState('grounding'); }}
              className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors"
            >
              Skip to grounding exercise →
            </button>
          </div>
        )}

        {/* ═══ GROUNDING EXERCISE STATE ═══ */}
        {state === 'grounding' && crisisData && (
          <div className="text-center animate-fade-in-up w-full">
            <h2 className="text-sm uppercase tracking-wider text-[#22c55e] mb-4 font-semibold">
              Grounding Exercise
            </h2>
            <p className="text-lg leading-relaxed text-[#e2e8f0] mb-8 px-2">
              {crisisData.groundingExercise}
            </p>

            {/* Breathing animation */}
            <div className="flex justify-center mb-8">
              <div className="breathe-circle w-24 h-24 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/30 flex items-center justify-center">
                <span className="text-[#22c55e] text-sm font-medium">Breathe</span>
              </div>
            </div>

            <button
              onClick={() => setState('post-crisis')}
              className="px-8 py-3 rounded-2xl bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-all shadow-lg shadow-[rgba(34,197,94,0.3)]"
            >
              I&apos;m ready to continue
            </button>
          </div>
        )}

        {/* ═══ POST-CRISIS CHECK ═══ */}
        {state === 'post-crisis' && (
          <div className="text-center animate-fade-in-up w-full">
            <h2 className="text-2xl font-bold text-white mb-2">
              How are you feeling?
            </h2>
            <p className="text-[#94a3b8] mb-8">No wrong answer — just be honest with yourself</p>

            {!postFeeling ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handlePostFeeling('better')}
                  className="glass-card p-6 flex flex-col items-center gap-2 min-w-[120px] cursor-pointer hover:border-[#22c55e]/30"
                >
                  <span className="text-4xl">😊</span>
                  <span className="text-sm text-[#94a3b8]">Better</span>
                </button>
                <button
                  onClick={() => handlePostFeeling('struggling')}
                  className="glass-card p-6 flex flex-col items-center gap-2 min-w-[120px] cursor-pointer hover:border-[#f59e0b]/30"
                >
                  <span className="text-4xl">😔</span>
                  <span className="text-sm text-[#94a3b8]">Still struggling</span>
                </button>
              </div>
            ) : postFeeling === 'better' ? (
              <div className="animate-fade-in">
                <p className="text-xl text-[#22c55e] mb-2">💚 You did it.</p>
                <p className="text-[#94a3b8]">You&apos;re stronger than you know. Taking you home...</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-4">
                <p className="text-[#f59e0b] mb-2">That&apos;s okay. You&apos;re not alone.</p>
                <button
                  onClick={handleCallHotline}
                  className="w-full py-4 rounded-2xl bg-[#22c55e] text-white font-bold text-lg hover:bg-[#16a34a] transition-all"
                >
                  📞 Call 988 — Crisis Lifeline
                </button>
                <a
                  href="tel:18006624357"
                  className="block w-full py-4 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white font-medium text-center hover:bg-[rgba(255,255,255,0.1)] transition-all"
                >
                  📞 Call SAMHSA 1-800-662-4357
                </a>
                <button
                  onClick={() => router.push('/home')}
                  className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors mt-4"
                >
                  Return home
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ ALWAYS VISIBLE: Hotline + Exit ═══ */}
        <div className="fixed bottom-8 left-0 right-0 px-6">
          <div className="max-w-md mx-auto flex gap-3">
            <a
              href="tel:988"
              className="flex-1 py-3 rounded-2xl bg-[rgba(34,197,94,0.15)] border border-[#22c55e]/30 text-[#22c55e] font-medium text-center text-sm hover:bg-[rgba(34,197,94,0.25)] transition-all"
            >
              📞 Call 988
            </a>
            <button
              onClick={() => { cancelSpeech(); router.push('/home'); }}
              className="flex-1 py-3 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#94a3b8] font-medium text-sm hover:bg-[rgba(255,255,255,0.1)] transition-all"
            >
              I&apos;m OK — Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
