// ============================================================
// AnchorAI — Caregiver Live Dashboard
// Real-time alert feed for caregivers
// Open this in a separate tab/device to receive alerts
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { listenForAlerts } from '@/lib/notifications';
import { getCaregiverAlerts } from '@/lib/store';
import type { CaregiverAlert } from '@/lib/types';

interface LiveAlert {
  caregiverName: string;
  userName: string;
  message: string;
  timestamp: string;
}

export default function CaregiverLivePage() {
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [pastAlerts, setPastAlerts] = useState<CaregiverAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [flashAlert, setFlashAlert] = useState(false);

  useEffect(() => {
    // Load historical alerts
    setPastAlerts(getCaregiverAlerts().reverse());

    // Subscribe to real-time alerts via BroadcastChannel
    const cleanup = listenForAlerts((alert) => {
      setLiveAlerts((prev) => [
        {
          caregiverName: alert.caregiverName,
          userName: alert.userName,
          message: alert.message,
          timestamp: alert.timestamp,
        },
        ...prev,
      ]);

      // Flash effect for new alerts
      setFlashAlert(true);
      setTimeout(() => setFlashAlert(false), 3000);

      // Play alert sound (system beep)
      try {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch {
        // Silent fail — audio not critical
      }
    });

    setIsConnected(true);

    return cleanup;
  }, []);

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${flashAlert ? 'bg-[#1a0a2e]' : 'bg-[#0a0a1a]'}`}>
      <div className="max-w-lg mx-auto px-5 pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💜</div>
          <h1 className="text-2xl font-bold text-white">Caregiver Dashboard</h1>
          <p className="text-[#94a3b8] text-sm mt-1">
            Real-time support notifications from AnchorAI
          </p>

          {/* Connection status */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.06)]">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#22c55e] animate-pulse' : 'bg-[#ef4444]'}`} />
            <span className="text-xs text-[#94a3b8]">
              {isConnected ? 'Listening for alerts...' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* How to use */}
        <div className="glass-card p-4 mb-6 border-l-4 border-[#8b5cf6]">
          <p className="text-sm text-[#e2e8f0]">
            <strong>How this works:</strong> Keep this page open in a browser tab or on your phone.
            When your loved one activates their crisis support tool, you&apos;ll receive a gentle notification here in real-time.
          </p>
        </div>

        {/* ═══ LIVE ALERTS (Real-time) ═══ */}
        {liveAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              New Alerts
            </h2>
            <div className="space-y-3">
              {liveAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="glass-card p-5 border-l-4 border-[#8b5cf6] animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-[rgba(139,92,246,0.2)] text-[#c4b5fd] px-2 py-0.5 rounded-full font-medium">
                      🔔 LIVE ALERT
                    </span>
                    <span className="text-xs text-[#64748b]">{formatTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mb-1">
                    For <strong className="text-white">{alert.caregiverName}</strong> about <strong className="text-white">{alert.userName}</strong>
                  </p>
                  <p className="text-base text-[#e2e8f0] leading-relaxed mt-2">
                    {alert.message}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <a
                      href="tel:988"
                      className="flex-1 py-2 rounded-xl bg-[rgba(34,197,94,0.15)] border border-[#22c55e]/30 text-[#22c55e] text-sm text-center font-medium hover:bg-[rgba(34,197,94,0.25)] transition-all"
                    >
                      📞 Call them
                    </a>
                    <button
                      className="flex-1 py-2 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#94a3b8] text-sm font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
                    >
                      💬 Send a message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ WAITING STATE ═══ */}
        {liveAlerts.length === 0 && pastAlerts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
              <span className="text-3xl">🔔</span>
            </div>
            <p className="text-[#94a3b8] mb-1">No alerts yet</p>
            <p className="text-xs text-[#64748b]">
              When your loved one uses their support tool, you&apos;ll be notified here instantly.
            </p>
          </div>
        )}

        {/* ═══ PAST ALERTS (from localStorage) ═══ */}
        {pastAlerts.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
              Alert History
            </h2>
            <div className="space-y-2">
              {pastAlerts.map((alert) => (
                <div key={alert.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#64748b]">
                      {alert.method === 'sms' ? '📱 SMS' : '🔔 In-App'}
                    </span>
                    <span className="text-xs text-[#64748b]">{formatDate(alert.sentAt)}</span>
                  </div>
                  <p className="text-sm text-[#e2e8f0]">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-[#64748b]">
            AnchorAI Caregiver Dashboard · Powered by Google Gemini
          </p>
          <p className="text-xs text-[#475569] mt-1">
            Your loved one&apos;s privacy is protected — only wellness check-ins are shared, never personal details.
          </p>
        </div>
      </div>
    </div>
  );
}
