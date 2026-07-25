// ============================================================
// AnchorAI — Journal Page (Voice Craving Journal)
// Speak your thoughts → Gemini transcribes and reframes
// ============================================================
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import VoiceWaveform from '@/components/VoiceWaveform';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { getProfile, getJournalEntries, saveJournalEntry, generateId } from '@/lib/store';
import type { JournalEntry } from '@/lib/types';

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [reframe, setReframe] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEntries, setShowEntries] = useState(false);

  const handleVoiceResult = useCallback((transcript: string) => {
    setCurrentText(transcript);
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleVoiceResult,
    continuous: false,
  });

  useEffect(() => {
    if (!getProfile()) {
      router.replace('/');
      return;
    }
    setEntries(getJournalEntries().reverse().slice(0, 10));
  }, [router]);

  const handleSubmit = async () => {
    if (!currentText.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: currentText }),
      });

      let reframeText = '';
      if (res.ok) {
        const data = await res.json();
        reframeText = data.reframe;
        setReframe(reframeText);
      }

      // Save entry
      const entry: JournalEntry = {
        id: generateId(),
        userId: getProfile()?.id || '',
        rawText: currentText,
        reframe: reframeText,
        createdAt: new Date().toISOString(),
      };
      saveJournalEntry(entry);
      setEntries((prev) => [entry, ...prev]);
    } catch {
      setReframe('Thank you for sharing. Writing your thoughts down is a powerful step in recovery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEntry = () => {
    setCurrentText('');
    setReframe(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="glow-orb w-64 h-64 bg-[#f59e0b] top-[-100px] right-[-60px] opacity-8" />

      <div className="max-w-lg mx-auto px-5 pt-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Journal</h1>
            <p className="text-[#64748b] text-sm mt-1">Voice your thoughts, get a gentle reframe</p>
          </div>
          <button
            onClick={() => setShowEntries(!showEntries)}
            className="text-xs text-[#22c55e] px-3 py-1.5 rounded-lg bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.2)] transition-all"
          >
            {showEntries ? 'New Entry' : 'History'}
          </button>
        </div>

        {/* New entry mode */}
        {!showEntries && (
          <div className="animate-fade-in-up">
            {/* Voice input area */}
            <div className="glass-card p-6 mb-4">
              {!reframe ? (
                <>
                  <div className="mb-4">
                    {isListening && (
                      <VoiceWaveform isActive={isListening} barCount={16} color="#f59e0b" />
                    )}
                  </div>

                  <textarea
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder={isListening ? 'Listening...' : 'What\'s on your mind? Type or use voice...'}
                    rows={4}
                    className="w-full bg-transparent border-none outline-none text-white placeholder:text-[#64748b] resize-none text-base leading-relaxed"
                  />

                  <div className="flex gap-3 mt-4">
                    {isSupported && (
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2
                          ${isListening
                            ? 'bg-[rgba(239,68,68,0.15)] border border-[#ef4444]/30 text-[#ef4444]'
                            : 'bg-[rgba(245,158,11,0.15)] border border-[#f59e0b]/30 text-[#f59e0b]'
                          }`}
                      >
                        {isListening ? '⏹ Stop' : '🎤 Speak'}
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={!currentText.trim() || isSubmitting}
                      className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all
                        ${currentText.trim() && !isSubmitting
                          ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                          : 'bg-[rgba(255,255,255,0.06)] text-[#64748b] cursor-not-allowed'
                        }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Reflecting...
                        </span>
                      ) : (
                        '✨ Get Reframe'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Reframe result */
                <div className="animate-fade-in">
                  <p className="text-xs uppercase tracking-wider text-[#64748b] mb-2">You shared:</p>
                  <p className="text-sm text-[#94a3b8] italic mb-4">&ldquo;{currentText}&rdquo;</p>

                  <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                    <p className="text-xs uppercase tracking-wider text-[#22c55e] mb-2 font-semibold">
                      ✨ Gemini&apos;s Gentle Reframe
                    </p>
                    <p className="text-base text-[#e2e8f0] leading-relaxed">
                      {reframe}
                    </p>
                  </div>

                  <button
                    onClick={handleNewEntry}
                    className="mt-6 w-full py-3 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#94a3b8] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
                  >
                    Write another entry
                  </button>
                </div>
              )}
            </div>

            {/* AI badge */}
            <div className="text-center">
              <p className="text-xs text-[#64748b]">
                Reframes powered by <span className="text-[#22c55e]">Google Gemini</span> · Your entries stay on your device
              </p>
            </div>
          </div>
        )}

        {/* History mode */}
        {showEntries && (
          <div className="space-y-3 animate-fade-in-up">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📝</p>
                <p className="text-[#94a3b8]">No journal entries yet.</p>
                <p className="text-xs text-[#64748b] mt-1">Tap &ldquo;New Entry&rdquo; to start</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="glass-card p-4">
                  <p className="text-xs text-[#64748b] mb-2">{formatDate(entry.createdAt)}</p>
                  <p className="text-sm text-[#94a3b8] italic mb-2">&ldquo;{entry.rawText}&rdquo;</p>
                  {entry.reframe && (
                    <div className="border-t border-[rgba(255,255,255,0.06)] pt-2 mt-2">
                      <p className="text-xs text-[#22c55e] mb-1">✨ Reframe</p>
                      <p className="text-sm text-[#e2e8f0]">{entry.reframe}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
