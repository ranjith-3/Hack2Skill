// ============================================================
// AnchorAI — Landing Page (Root Route)
// Shows onboarding for new users, redirects to /home for existing
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete } from '@/lib/store';
import OnboardingFlow from '@/components/OnboardingFlow';

export default function LandingPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace('/home');
    } else {
      setShowOnboarding(true);
      setLoading(false);
    }
  }, [router]);

  if (loading && !showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Loading AnchorAI...</p>
        </div>
      </div>
    );
  }

  return <OnboardingFlow />;
}
