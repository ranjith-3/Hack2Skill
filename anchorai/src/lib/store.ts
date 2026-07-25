// ============================================================
// AnchorAI — LocalStorage Persistence Layer
// No PII stored server-side; all data is local-first
// ============================================================

import type { UserProfile, CheckIn, CrisisEvent, CaregiverAlert, JournalEntry } from './types';

const KEYS = {
  PROFILE: 'anchorai_profile',
  CHECKINS: 'anchorai_checkins',
  CRISIS_EVENTS: 'anchorai_crisis_events',
  CAREGIVER_ALERTS: 'anchorai_caregiver_alerts',
  JOURNAL_ENTRIES: 'anchorai_journal_entries',
  ONBOARDING_COMPLETE: 'anchorai_onboarding_complete',
} as const;

/** Generate a simple unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Profile ────────────────────────────────────────────────

export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function deleteProfile(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function setOnboardingComplete(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
}

// ─── Check-ins ──────────────────────────────────────────────

export function getCheckIns(): CheckIn[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CHECKINS);
  return data ? JSON.parse(data) : [];
}

export function saveCheckIn(checkIn: CheckIn): void {
  if (typeof window === 'undefined') return;
  const checkins = getCheckIns();
  checkins.push(checkIn);
  localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkins));
}

export function getRecentCheckIns(days: number = 7): CheckIn[] {
  const all = getCheckIns();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return all.filter((c) => new Date(c.createdAt) >= cutoff);
}

// ─── Crisis Events ──────────────────────────────────────────

export function getCrisisEvents(): CrisisEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CRISIS_EVENTS);
  return data ? JSON.parse(data) : [];
}

export function saveCrisisEvent(event: CrisisEvent): void {
  if (typeof window === 'undefined') return;
  const events = getCrisisEvents();
  events.push(event);
  localStorage.setItem(KEYS.CRISIS_EVENTS, JSON.stringify(events));
}

// ─── Caregiver Alerts ───────────────────────────────────────

export function getCaregiverAlerts(): CaregiverAlert[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CAREGIVER_ALERTS);
  return data ? JSON.parse(data) : [];
}

export function saveCaregiverAlert(alert: CaregiverAlert): void {
  if (typeof window === 'undefined') return;
  const alerts = getCaregiverAlerts();
  alerts.push(alert);
  localStorage.setItem(KEYS.CAREGIVER_ALERTS, JSON.stringify(alerts));
}

// ─── Journal Entries ────────────────────────────────────────

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.JOURNAL_ENTRIES);
  return data ? JSON.parse(data) : [];
}

export function saveJournalEntry(entry: JournalEntry): void {
  if (typeof window === 'undefined') return;
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
}

// ─── Sobriety Streak ────────────────────────────────────────

export function getSobrietyDays(): number {
  const profile = getProfile();
  if (!profile?.sobrietyStartDate) return 0;
  const start = new Date(profile.sobrietyStartDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
