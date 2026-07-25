// ============================================================
// AnchorAI — Settings Page
// Profile management, data controls, about info
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getProfile, saveProfile, deleteProfile, getSobrietyDays, getCheckIns, getCrisisEvents, getJournalEntries } from '@/lib/store';
import type { UserProfile, CopingStyle } from '@/lib/types';
import { SUBSTANCE_OPTIONS, COPING_STYLE_OPTIONS } from '@/lib/types';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({ checkIns: 0, crisisEvents: 0, journalEntries: 0, sobrietyDays: 0 });

  // Edit fields
  const [editSubstance, setEditSubstance] = useState('');
  const [editCopingStyle, setEditCopingStyle] = useState<CopingStyle | ''>('');
  const [editSobrietyDate, setEditSobrietyDate] = useState('');

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    setProfile(p);
    setEditSubstance(p.substance);
    setEditCopingStyle(p.copingStyle);
    setEditSobrietyDate(p.sobrietyStartDate ? new Date(p.sobrietyStartDate).toISOString().split('T')[0] : '');
    setStats({
      checkIns: getCheckIns().length,
      crisisEvents: getCrisisEvents().length,
      journalEntries: getJournalEntries().length,
      sobrietyDays: getSobrietyDays(),
    });
  }, [router]);

  const handleSave = () => {
    if (!profile || !editCopingStyle) return;
    const updated = {
      ...profile,
      substance: editSubstance,
      copingStyle: editCopingStyle as CopingStyle,
      sobrietyStartDate: editSobrietyDate ? new Date(editSobrietyDate).toISOString() : profile.sobrietyStartDate,
    };
    saveProfile(updated);
    setProfile(updated);
    setEditMode(false);
  };

  const handleDeleteAll = () => {
    deleteProfile();
    router.replace('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="glow-orb w-64 h-64 bg-[#22c55e] bottom-[-100px] right-[-60px] opacity-8" />

      <div className="max-w-lg mx-auto px-5 pt-8 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#64748b] text-sm mt-1">Manage your profile and data</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
              Your Profile
            </h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs text-[#22c55e] px-2 py-1 rounded-lg hover:bg-[rgba(34,197,94,0.1)] transition-all"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#64748b]">Name</span>
                <span className="text-sm text-white">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#64748b]">Substance</span>
                <span className="text-sm text-white">{profile.substance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#64748b]">Coping Style</span>
                <span className="text-sm text-white capitalize">{profile.copingStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#64748b]">Triggers</span>
                <span className="text-sm text-white text-right max-w-[60%]">{profile.triggers.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#64748b]">Sobriety Start</span>
                <span className="text-sm text-white">
                  {profile.sobrietyStartDate
                    ? new Date(profile.sobrietyStartDate).toLocaleDateString()
                    : 'Not set'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#64748b] block mb-1">Substance</label>
                <select
                  value={editSubstance}
                  onChange={(e) => setEditSubstance(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-[#22c55e] transition-all"
                >
                  {SUBSTANCE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#64748b] block mb-1">Coping Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {COPING_STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEditCopingStyle(opt.value)}
                      className={`p-3 rounded-xl text-sm border transition-all text-left
                        ${editCopingStyle === opt.value
                          ? 'border-[#22c55e] bg-[rgba(34,197,94,0.1)] text-[#4ade80]'
                          : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#94a3b8]'
                        }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748b] block mb-1">Sobriety Start Date</label>
                <input
                  type="date"
                  value={editSobrietyDate}
                  onChange={(e) => setEditSobrietyDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-[#22c55e] transition-all"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-medium hover:bg-[#16a34a] transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="glass-card p-5 mb-5">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Your Journey
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#22c55e]">{stats.sobrietyDays}</div>
              <div className="text-xs text-[#64748b]">Days Clean</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3b82f6]">{stats.checkIns}</div>
              <div className="text-xs text-[#64748b]">Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f59e0b]">{stats.journalEntries}</div>
              <div className="text-xs text-[#64748b]">Journal Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#8b5cf6]">{stats.crisisEvents}</div>
              <div className="text-xs text-[#64748b]">Crises Managed</div>
            </div>
          </div>
        </div>

        {/* Gen AI Info */}
        <div className="glass-card p-5 mb-5">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            AI Services Used
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs text-[#22c55e] mt-0.5">●</span>
              <p className="text-sm text-[#e2e8f0]">
                <strong>Google Gemini Flash</strong> — Crisis responses, caregiver alerts, check-in analysis, journal reframes
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-[#8b5cf6] mt-0.5">●</span>
              <p className="text-sm text-[#e2e8f0]">
                <strong>Google Gemini Pro</strong> — Emergency script generation, educational resources
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-[#f59e0b] mt-0.5">●</span>
              <p className="text-sm text-[#e2e8f0]">
                <strong>Web Speech API</strong> — Voice input (STT) + script playback (TTS)
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="glass-card p-5 mb-5">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Privacy & Data
          </h2>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-[#e2e8f0] flex items-center gap-2">
              <span className="text-[#22c55e]">✓</span> All data stored locally on your device
            </p>
            <p className="text-sm text-[#e2e8f0] flex items-center gap-2">
              <span className="text-[#22c55e]">✓</span> No personal data sent to servers
            </p>
            <p className="text-sm text-[#e2e8f0] flex items-center gap-2">
              <span className="text-[#22c55e]">✓</span> Voice recordings are never stored
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[#ef4444]/20 text-[#ef4444] font-medium text-sm hover:bg-[rgba(239,68,68,0.2)] transition-all"
            >
              Delete All My Data
            </button>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <p className="text-sm text-[#ef4444] text-center">This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] text-[#94a3b8] font-medium text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 py-3 rounded-xl bg-[#ef4444] text-white font-medium text-sm hover:bg-[#dc2626] transition-all"
                >
                  Yes, Delete Everything
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="text-center text-xs text-[#64748b] mb-4">
          <p>AnchorAI v1.0 · PromptWars Hackathon 2026</p>
          <p className="mt-1">Google for Developers × H2S × Build with AI</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
