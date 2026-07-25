// ============================================================
// AnchorAI — Web Speech API: Speech Synthesis (TTS) Hook
// Reads crisis scripts aloud — no reading required in crisis
// ============================================================
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onEnd?: () => void;
  onStart?: () => void;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  progress: number; // 0 to 1 rough progress
}

export function useSpeechSynthesis({
  rate = 0.9,
  pitch = 1,
  lang = 'en-US',
  onEnd,
  onStart,
}: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    // Try to get a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && v.name.includes('Google')
    ) || voices.find(
      (v) => v.lang.startsWith('en') && v.localService === false
    ) || voices.find(
      (v) => v.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setProgress(0);
      onStart?.();

      // Approximate progress tracking
      const estimatedDuration = (text.length / 15) * 1000; // rough chars per second
      const intervalTime = 100;
      let elapsed = 0;
      progressIntervalRef.current = setInterval(() => {
        elapsed += intervalTime;
        setProgress(Math.min(elapsed / estimatedDuration, 0.95));
      }, intervalTime);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setProgress(1);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, rate, pitch, lang, onEnd, onStart]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [isSupported]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    speak,
    pause,
    resume,
    cancel,
    progress,
  };
}
