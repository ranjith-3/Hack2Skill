// ============================================================
// AnchorAI — Core Type Definitions
// ============================================================

/** Coping styles offered during onboarding */
export type CopingStyle = 'breathing' | 'talking' | 'distraction' | 'movement';

/** How a crisis was triggered */
export type TriggerType = 'tap' | 'voice';

/** Mood levels for check-ins (1 = terrible, 5 = great) */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/** Craving levels for check-ins (1 = none, 5 = overwhelming) */
export type CravingLevel = 1 | 2 | 3 | 4 | 5;

/** User profile created during onboarding */
export interface UserProfile {
  id: string;
  name: string;
  substance: string;
  triggers: string[];
  copingStyle: CopingStyle;
  caregiverName: string;
  caregiverContact: string; // phone or email
  userEmail?: string; // email of the user
  personalScript?: string; // pre-generated emergency script
  sobrietyStartDate: string; // ISO date string
  language: string;
  createdAt: string;
  updatedAt: string;
}

/** Data for a daily check-in entry */
export interface CheckIn {
  id: string;
  userId: string;
  mood: MoodLevel;
  cravingLevel: CravingLevel;
  notes?: string;
  createdAt: string;
}

/** Data for a crisis event (anonymized) */
export interface CrisisEvent {
  id: string;
  userId: string;
  triggerType: TriggerType;
  caregiverAlerted: boolean;
  postCrisisFeeling?: 'better' | 'struggling';
  createdAt: string;
}

/** Caregiver alert record */
export interface CaregiverAlert {
  id: string;
  userId: string;
  message: string;
  sentAt: string;
  method: 'in-app' | 'sms' | 'email';
}

/** AI-generated resource card */
export interface ResourceCard {
  title: string;
  topic: string;
  summary: string;
  practicalTip: string;
  readTime: number;
  icon?: string;
}

/** Response from the crisis API */
export interface CrisisResponse {
  script: string;
  groundingExercise: string;
  hotlineNumber: string;
  caregiverMessage?: string;
}

/** Journal entry (voice or text) */
export interface JournalEntry {
  id: string;
  userId: string;
  rawText: string;
  reframe?: string; // Gemini-generated reframe
  createdAt: string;
}

/** Onboarding step index */
export type OnboardingStep = 0 | 1 | 2 | 3 | 4;

/** Substance options for onboarding */
export const SUBSTANCE_OPTIONS = [
  'Alcohol',
  'Opioids',
  'Stimulants',
  'Cannabis',
  'Benzodiazepines',
  'Nicotine',
  'Other',
] as const;

/** Common trigger options for onboarding */
export const TRIGGER_OPTIONS = [
  'Stress at work',
  'Loneliness',
  'Social events',
  'Financial pressure',
  'Family conflict',
  'Boredom',
  'Physical pain',
  'Sleep problems',
  'Peer pressure',
  'Celebrations',
  'Emotional distress',
  'Certain locations',
] as const;

/** Coping style options for onboarding */
export const COPING_STYLE_OPTIONS: { value: CopingStyle; label: string; icon: string }[] = [
  { value: 'breathing', label: 'Breathing Exercises', icon: '🌬️' },
  { value: 'talking', label: 'Talking It Out', icon: '💬' },
  { value: 'distraction', label: 'Distraction Activities', icon: '🎮' },
  { value: 'movement', label: 'Physical Movement', icon: '🏃' },
];
