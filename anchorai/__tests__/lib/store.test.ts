import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getProfile, saveProfile, deleteProfile,
  getCheckIns, saveCheckIn, getRecentCheckIns,
  getSobrietyDays, generateId, isOnboardingComplete,
  setOnboardingComplete,
} from '@/lib/store';
import type { UserProfile, CheckIn } from '@/lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const mockProfile: UserProfile = {
  id: 'test-1',
  name: 'Test User',
  substance: 'Alcohol',
  triggers: ['Stress at work'],
  copingStyle: 'breathing',
  caregiverName: 'Mom',
  caregiverContact: 'mom@example.com',
  sobrietyStartDate: new Date(Date.now() - 7 * 86400000).toISOString(),
  language: 'en',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Store — Profile', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns null when no profile exists', () => {
    expect(getProfile()).toBeNull();
  });

  it('saves and retrieves a profile', () => {
    saveProfile(mockProfile);
    const retrieved = getProfile();
    expect(retrieved?.name).toBe('Test User');
    expect(retrieved?.caregiverContact).toBe('mom@example.com');
  });

  it('updates updatedAt timestamp on save', () => {
    const before = new Date().toISOString();
    saveProfile(mockProfile);
    const retrieved = getProfile();
    expect(retrieved?.updatedAt).toBeDefined();
    expect(retrieved!.updatedAt >= before).toBe(true);
  });

  it('deleteProfile clears all keys', () => {
    saveProfile(mockProfile);
    setOnboardingComplete();
    deleteProfile();
    expect(getProfile()).toBeNull();
    expect(isOnboardingComplete()).toBe(false);
  });
});

describe('Store — Onboarding', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns false when onboarding is not complete', () => {
    expect(isOnboardingComplete()).toBe(false);
  });

  it('returns true after setOnboardingComplete', () => {
    setOnboardingComplete();
    expect(isOnboardingComplete()).toBe(true);
  });
});

describe('Store — Check-ins', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns empty array when no check-ins', () => {
    expect(getCheckIns()).toEqual([]);
  });

  it('saves and retrieves check-ins', () => {
    const checkIn: CheckIn = {
      id: generateId(),
      userId: 'test-1',
      mood: 3,
      cravingLevel: 2,
      createdAt: new Date().toISOString(),
    };
    saveCheckIn(checkIn);
    expect(getCheckIns()).toHaveLength(1);
    expect(getCheckIns()[0].mood).toBe(3);
  });

  it('appends multiple check-ins', () => {
    for (let i = 0; i < 3; i++) {
      saveCheckIn({
        id: generateId(),
        userId: 'test-1',
        mood: (i + 1) as 1 | 2 | 3,
        cravingLevel: 1,
        createdAt: new Date().toISOString(),
      });
    }
    expect(getCheckIns()).toHaveLength(3);
  });

  it('getRecentCheckIns filters by date', () => {
    const old: CheckIn = {
      id: '1', userId: 'test-1', mood: 2, cravingLevel: 4,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    const recent: CheckIn = {
      id: '2', userId: 'test-1', mood: 4, cravingLevel: 1,
      createdAt: new Date().toISOString(),
    };
    saveCheckIn(old);
    saveCheckIn(recent);
    expect(getRecentCheckIns(7)).toHaveLength(1);
    expect(getRecentCheckIns(7)[0].id).toBe('2');
  });
});

describe('Store — Sobriety Days', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns 0 when no profile', () => {
    expect(getSobrietyDays()).toBe(0);
  });

  it('calculates days correctly', () => {
    saveProfile(mockProfile); // sobrietyStartDate = 7 days ago
    expect(getSobrietyDays()).toBeGreaterThanOrEqual(7);
  });

  it('returns 0 for future sobriety date', () => {
    const futureProfile = {
      ...mockProfile,
      sobrietyStartDate: new Date(Date.now() + 86400000).toISOString(),
    };
    saveProfile(futureProfile);
    expect(getSobrietyDays()).toBe(0);
  });
});

describe('Store — generateId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('generates string IDs', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(5);
  });
});
