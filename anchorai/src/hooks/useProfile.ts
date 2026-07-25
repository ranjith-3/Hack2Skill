// ============================================================
// AnchorAI — User Profile Management Hook
// ============================================================
'use client';

import { useState, useCallback, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { getProfile, saveProfile, deleteProfile, isOnboardingComplete, setOnboardingComplete, generateId, getSobrietyDays } from '@/lib/store';

interface UseProfileReturn {
  profile: UserProfile | null;
  isOnboarded: boolean;
  sobrietyDays: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  createProfile: (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => UserProfile;
  completeOnboarding: () => void;
  clearAllData: () => void;
  loading: boolean;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [sobrietyDays, setSobrietyDays] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    const stored = getProfile();
    setProfile(stored);
    setIsOnboarded(isOnboardingComplete());
    setSobrietyDays(getSobrietyDays());
    setLoading(false);
  }, []);

  const createProfile = useCallback((data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile => {
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    saveProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const current = getProfile();
    if (current) {
      const updated = { ...current, ...updates };
      saveProfile(updated);
      setProfile(updated);
      if (updates.sobrietyStartDate) {
        setSobrietyDays(getSobrietyDays());
      }
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete();
    setIsOnboarded(true);
  }, []);

  const clearAllData = useCallback(() => {
    deleteProfile();
    setProfile(null);
    setIsOnboarded(false);
    setSobrietyDays(0);
  }, []);

  return {
    profile,
    isOnboarded,
    sobrietyDays,
    updateProfile,
    createProfile,
    completeOnboarding,
    clearAllData,
    loading,
  };
}
