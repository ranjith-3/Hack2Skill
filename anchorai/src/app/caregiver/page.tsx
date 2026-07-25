// ============================================================
// AnchorAI — Caregiver Page
// Caregiver contact management + alert history
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getProfile, saveProfile, getCaregiverAlerts } from '@/lib/store';
import type { UserProfile, CaregiverAlert } from '@/lib/types';

export default function CaregiverPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    setProfile(p);
    setEditName(p.caregiverName || '');
    setEditContact(p.caregiverContact || '');
    setAlerts(getCaregiverAlerts().reverse());
  }, [router]);

  const handleSave = () => {
    if (!profile) return;
    const updated = {
      ...profile,
      caregiverName: editName.trim(),
      caregiverContact: editContact.trim(),
    };
    saveProfile(updated);
    setProfile(updated);
    setEditMode(false);
  };

  const handleTestAlert = async () => {
    if (!profile) return;
    setTestSending(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverName: profile.caregiverName,
          userName: profile.name,
        }),
      });
      const data = await res.json();
      setTestResult(data.message);
    } catch {
      setTestResult('Test alert generated (demo mode — no SMS sent)');
    } finally {
      setTestSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="glow-orb w-64 h-64 bg-[#8b5cf6] top-[-100px] left-[-60px] opacity-10" />

      <div className="max-w-lg mx-auto px-5 pt-8 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Caregiver Support</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Your support person gets a gentle alert during crisis moments
          </p>
        </div>

        {/* Caregiver Contact Card */}
        <div className="glass-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
              Support Person
            </h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs text-[#22c55e] px-2 py-1 rounded-lg hover:bg-[rgba(34,197,94,0.1)] transition-all"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!editMode ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-2xl">
                💜
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {profile.caregiverName || 'Not set'}
                </p>
                <p className="text-sm text-[#64748b]">
                  {profile.caregiverContact || 'No contact info'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Caregiver name"
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#22c55e] transition-all"
              />
              <input
                type="text"
                value={editContact}
                onChange={(e) => setEditContact(e.target.value)}
                placeholder="Phone or email"
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#22c55e] transition-all"
              />
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-medium hover:bg-[#16a34a] transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="glass-card p-5 mb-5">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            How Alerts Work
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">1️⃣</span>
              <p className="text-sm text-[#e2e8f0]">You activate crisis mode (tap or voice)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">2️⃣</span>
              <p className="text-sm text-[#e2e8f0]">
                <span className="text-[#22c55e]">Gemini AI</span> drafts a warm, non-alarming message
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">3️⃣</span>
              <p className="text-sm text-[#e2e8f0]">Your caregiver receives the notification</p>
            </div>
          </div>
        </div>

        {/* Test Alert */}
        <div className="glass-card p-5 mb-5">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Test Alert Preview
          </h2>
          <button
            onClick={handleTestAlert}
            disabled={testSending || !profile.caregiverName}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all mb-3
              ${!testSending && profile.caregiverName
                ? 'bg-[rgba(139,92,246,0.15)] border border-[#8b5cf6]/30 text-[#a78bfa] hover:bg-[rgba(139,92,246,0.25)]'
                : 'bg-[rgba(255,255,255,0.06)] text-[#64748b] cursor-not-allowed'
              }`}
          >
            {testSending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin" />
                Generating preview...
              </span>
            ) : (
              '🔔 Preview Alert Message'
            )}
          </button>
          {testResult && (
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] animate-fade-in">
              <p className="text-xs text-[#64748b] mb-1">AI-generated alert preview:</p>
              <p className="text-sm text-[#e2e8f0] italic">&ldquo;{testResult}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Alert History */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Alert History
          </h2>
          {alerts.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-[#64748b]">No alerts sent yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="glass-card p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#22c55e] font-medium">
                      {alert.method === 'sms' ? '📱 SMS' : '🔔 In-App'}
                    </span>
                    <span className="text-xs text-[#64748b]">{formatDate(alert.sentAt)}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
