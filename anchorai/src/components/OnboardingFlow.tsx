// ============================================================
// AnchorAI — Onboarding Flow Component
// 5-step wizard: Name → Substance → Triggers → Coping → Caregiver
// Designed for minimal typing — chips, selectors, one-tap
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { requestNotificationPermission } from '@/lib/notifications';
import type { CopingStyle } from '@/lib/types';
import { SUBSTANCE_OPTIONS, TRIGGER_OPTIONS, COPING_STYLE_OPTIONS } from '@/lib/types';

export default function OnboardingFlow() {
  const router = useRouter();
  const { createProfile, completeOnboarding } = useProfile();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [substance, setSubstance] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [copingStyle, setCopingStyle] = useState<CopingStyle | ''>('');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverContact, setCaregiverContact] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 5;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return name.trim().length > 0 && userEmail.trim().length > 0 && userEmail.includes('@');
      case 1: return substance !== '';
      case 2: return triggers.length >= 1 && triggers.length <= 3;
      case 3: return copingStyle !== '';
      case 4: return caregiverName.trim().length > 0;
      default: return false;
    }
  };

  const toggleTrigger = (trigger: string) => {
    setTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : prev.length < 3 ? [...prev, trigger] : prev
    );
  };

  const handleComplete = async () => {
    if (!copingStyle) return;
    setIsGenerating(true);

    try {
      // Create the user profile
      const profile = createProfile({
        name: name.trim(),
        userEmail: userEmail.trim(),
        substance,
        triggers,
        copingStyle: copingStyle as CopingStyle,
        caregiverName: caregiverName.trim(),
        caregiverContact: caregiverContact.trim(),
        sobrietyStartDate: new Date().toISOString(),
        language: 'en',
      });

      // Pre-generate emergency script via Gemini Pro
      try {
        const res = await fetch('/api/script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profile.name,
            substance: profile.substance,
            triggers: profile.triggers,
            copingStyle: profile.copingStyle,
            caregiverName: profile.caregiverName,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          // Update profile with the pre-generated script
          const stored = JSON.parse(localStorage.getItem('anchorai_profile') || '{}');
          stored.personalScript = data.script;
          localStorage.setItem('anchorai_profile', JSON.stringify(stored));
        }
      } catch {
        // Script generation is optional — don't block onboarding
        console.warn('Script pre-generation failed, will generate on-demand');
      }

      // Request notification permission for caregiver alerts
      await requestNotificationPermission();

      completeOnboarding();
      router.push('/home');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background effects */}
      <div className="glow-orb w-64 h-64 bg-[#22c55e] top-[-100px] left-[-50px] opacity-20" />
      <div className="glow-orb w-48 h-48 bg-[#8b5cf6] bottom-[-80px] right-[-30px] opacity-15" style={{ animationDelay: '3s' }} />

      {/* Progress dots */}
      <div className="flex gap-3 mb-10 z-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === step ? 'progress-dot-active' : ''} ${i < step ? 'progress-dot-complete' : ''}`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-md z-10 animate-fade-in-up" key={step}>
        {/* Step 0: Name */}
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-white">
              Welcome to <span className="text-[#22c55e]">AnchorAI</span>
            </h2>
            <p className="text-[#94a3b8] mb-6">Let&apos;s personalize your support experience.</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What should we call you?"
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl px-5 py-4 text-white placeholder-[#64748b] focus:outline-none focus:border-[#22c55e] transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl px-5 py-4 text-white placeholder-[#64748b] focus:outline-none focus:border-[#22c55e] transition-colors"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <p className="text-xs text-[#64748b] text-left">
                Your email is only used as the &quot;Reply-To&quot; address when alerting your caregiver. It is never sold or shared.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Substance */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              Hi {name} 👋
            </h2>
            <p className="text-[#94a3b8] mb-6">
              What are you working to overcome?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {SUBSTANCE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setSubstance(option)}
                  className={`chip ${substance === option ? 'chip-selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Triggers */}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              What triggers you most?
            </h2>
            <p className="text-[#94a3b8] mb-6">
              Select up to 3 triggers
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TRIGGER_OPTIONS.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`chip text-sm ${triggers.includes(trigger) ? 'chip-selected' : ''}`}
                >
                  {trigger}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#64748b] mt-4">
              {triggers.length}/3 selected
            </p>
          </div>
        )}

        {/* Step 3: Coping Style */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              What helps you cope?
            </h2>
            <p className="text-[#94a3b8] mb-6">
              When things get tough, what works for you?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {COPING_STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCopingStyle(option.value)}
                  className={`glass-card p-5 flex flex-col items-center gap-2 cursor-pointer
                    ${copingStyle === option.value
                      ? '!border-[#22c55e] !bg-[rgba(34,197,94,0.1)]'
                      : ''
                    }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className={`text-sm font-medium ${copingStyle === option.value ? 'text-[#4ade80]' : 'text-[#94a3b8]'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Caregiver Contact */}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              Who&apos;s your support person?
            </h2>
            <p className="text-[#94a3b8] mb-6">
              They&apos;ll get a gentle alert if you activate crisis mode
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                placeholder="Their name"
                className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white text-center placeholder:text-[#64748b] focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
                autoFocus
              />
              <input
                type="text"
                value={caregiverContact}
                onChange={(e) => setCaregiverContact(e.target.value)}
                placeholder="Phone or email (optional)"
                className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white text-center placeholder:text-[#64748b] focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-10 z-10 w-full max-w-md">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1 as 0 | 1 | 2 | 3 | 4)}
            className="flex-1 py-3 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#94a3b8] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
          >
            Back
          </button>
        )}
        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3 | 4)}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all
              ${canProceed()
                ? 'bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-lg shadow-[rgba(34,197,94,0.3)]'
                : 'bg-[rgba(255,255,255,0.06)] text-[#64748b] cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!canProceed() || isGenerating}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all
              ${canProceed() && !isGenerating
                ? 'bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-lg shadow-[rgba(34,197,94,0.3)]'
                : 'bg-[rgba(255,255,255,0.06)] text-[#64748b] cursor-not-allowed'
              }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Preparing your plan...
              </span>
            ) : (
              'Get Started'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
