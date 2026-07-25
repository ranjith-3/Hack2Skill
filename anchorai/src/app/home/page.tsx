// ============================================================
// AnchorAI — Home Dashboard
// Emergency button, check-in, streak counter, status overview
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getProfile, getSobrietyDays, saveCheckIn, getRecentCheckIns, generateId } from '@/lib/store';
import type { UserProfile, MoodLevel } from '@/lib/types';

const moodEmojis: { value: MoodLevel; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Struggling' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '😊', label: 'Good' },
  { value: 4, emoji: '💪', label: 'Strong' },
  { value: 5, emoji: '🌟', label: 'Great' },
];

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [days, setDays] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    setProfile(p);
    setDays(getSobrietyDays());
  }, [router]);

  const handleMoodCheckIn = async (mood: MoodLevel) => {
    if (checkedIn) return;
    setSelectedMood(mood);
    setCheckedIn(true);

    const checkIn = {
      id: generateId(),
      userId: profile?.id || '',
      mood,
      cravingLevel: (6 - mood) as MoodLevel, // inverse of mood as rough craving estimate
      createdAt: new Date().toISOString(),
    };
    saveCheckIn(checkIn);

    // Fetch AI insight
    setLoadingInsight(true);
    try {
      const recent = getRecentCheckIns(7);
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIns: recent }),
      });
      if (res.ok) {
        const data = await res.json();
        setInsight(data.insight);
      }
    } catch {
      // Silent fail — insight is optional
    } finally {
      setLoadingInsight(false);
    }
  };

  const getMilestoneMessage = (d: number): string => {
    if (d >= 365) return '🏆 Over a year strong!';
    if (d >= 90) return '🌟 90+ days — incredible!';
    if (d >= 30) return '💎 One month milestone!';
    if (d >= 7) return '⭐ One week strong!';
    if (d >= 1) return '🌱 Every day counts';
    return '🌅 Today is day one';
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="glow-orb w-80 h-80 bg-[#22c55e] top-[-150px] right-[-100px] opacity-10" />
      <div className="glow-orb w-60 h-60 bg-[#8b5cf6] bottom-[200px] left-[-80px] opacity-8" style={{ animationDelay: '4s' }} />

      <div className="max-w-lg mx-auto px-5 pt-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#64748b] text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{profile.name} 👋</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#22c55e] streak-glow">{days}</div>
            <div className="text-xs text-[#64748b]">days clean</div>
          </div>
        </div>

        {/* Milestone card */}
        <div className="glass-card p-4 mb-6 text-center">
          <p className="text-sm text-[#94a3b8]">{getMilestoneMessage(days)}</p>
        </div>

        {/* ═══ CRISIS BUTTON ═══ */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push('/crisis')}
            className="crisis-btn-pulse w-44 h-44 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex flex-col items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform duration-200 cursor-pointer"
            aria-label="Activate crisis mode — I need help"
          >
            <span className="text-4xl mb-1">🆘</span>
            <span className="text-lg font-bold">I Need Help</span>
            <span className="text-xs opacity-80 mt-0.5">Tap for support</span>
          </button>
        </div>

        {/* ═══ DAILY CHECK-IN ═══ */}
        <div className="glass-card p-5 mb-5 animate-fade-in-up">
          <h2 className="text-sm font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">
            How are you today?
          </h2>
          <div className="flex justify-between gap-2">
            {moodEmojis.map((item) => (
              <button
                key={item.value}
                onClick={() => handleMoodCheckIn(item.value)}
                disabled={checkedIn}
                className={`emoji-btn flex-1 ${selectedMood === item.value ? 'emoji-btn-selected' : ''} ${checkedIn && selectedMood !== item.value ? 'opacity-40' : ''}`}
                aria-label={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>
          {checkedIn && (
            <div className="mt-3 text-center animate-fade-in">
              <p className="text-xs text-[#22c55e]">✓ Check-in recorded</p>
              {loadingInsight && (
                <div className="mt-2 shimmer h-10 rounded-lg" />
              )}
              {insight && (
                <p className="mt-2 text-sm text-[#94a3b8] italic">{insight}</p>
              )}
            </div>
          )}
        </div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => router.push('/learn')}
            className="glass-card p-4 text-left cursor-pointer"
          >
            <span className="text-2xl">📚</span>
            <p className="text-sm font-medium text-white mt-2">Learn</p>
            <p className="text-xs text-[#64748b]">Recovery resources</p>
          </button>
          <button
            onClick={() => router.push('/journal')}
            className="glass-card p-4 text-left cursor-pointer"
          >
            <span className="text-2xl">📝</span>
            <p className="text-sm font-medium text-white mt-2">Journal</p>
            <p className="text-xs text-[#64748b]">Voice your thoughts</p>
          </button>
          <button
            onClick={() => router.push('/caregiver')}
            className="glass-card p-4 text-left cursor-pointer"
          >
            <span className="text-2xl">💜</span>
            <p className="text-sm font-medium text-white mt-2">Caregiver</p>
            <p className="text-xs text-[#64748b]">Support network</p>
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="glass-card p-4 text-left cursor-pointer"
          >
            <span className="text-2xl">⚙️</span>
            <p className="text-sm font-medium text-white mt-2">Settings</p>
            <p className="text-xs text-[#64748b]">Your profile</p>
          </button>
        </div>

        {/* Hotline always visible */}
        <div className="glass-card p-3 text-center mb-4">
          <p className="text-xs text-[#64748b]">
            24/7 Support: <a href="tel:988" className="text-[#22c55e] font-medium hover:underline">988</a> (Crisis Lifeline) · <a href="tel:18006624357" className="text-[#22c55e] font-medium hover:underline">1-800-662-4357</a> (SAMHSA)
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
