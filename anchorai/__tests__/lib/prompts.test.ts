import { describe, it, expect } from 'vitest';
import {
  buildCrisisUserPrompt,
  buildScriptGenerationPrompt,
  buildCaregiverAlertPrompt,
  buildCheckInAnalysisPrompt,
  buildJournalReframePrompt,
  buildGroundingExercisePrompt,
  CRISIS_SYSTEM_PROMPT,
  RESOURCE_GENERATION_PROMPT
} from '@/lib/prompts';

describe('Prompt Templates', () => {
  it('buildCrisisUserPrompt includes all user fields', () => {
    const result = buildCrisisUserPrompt('Ranjith', 'Alcohol', 'I feel stressed', 'breathing');
    expect(result).toContain('Ranjith');
    expect(result).toContain('Alcohol');
    expect(result).toContain('I feel stressed');
    expect(result).toContain('breathing');
  });

  it('buildCrisisUserPrompt handles null voice transcript', () => {
    const result = buildCrisisUserPrompt('User', 'Opioids', null, 'talking');
    expect(result).toContain('not provided');
  });

  it('buildScriptGenerationPrompt includes triggers', () => {
    const result = buildScriptGenerationPrompt(
      'Ranjith', 'Alcohol', ['Stress at work', 'Loneliness'], 'breathing', 'Mom'
    );
    expect(result).toContain('Stress at work, Loneliness');
    expect(result).toContain('Mom');
  });

  it('buildCaregiverAlertPrompt is non-alarming', () => {
    const result = buildCaregiverAlertPrompt('Mom', 'Ranjith');
    expect(result.toLowerCase()).not.toContain('addiction');
    expect(result).toContain('Mom');
    expect(result).toContain('Ranjith');
  });

  it('CRISIS_SYSTEM_PROMPT contains safety hotline', () => {
    expect(CRISIS_SYSTEM_PROMPT).toContain('988');
    expect(CRISIS_SYSTEM_PROMPT).toContain('1-800-662-4357');
  });

  it('buildGroundingExercisePrompt includes coping style', () => {
    expect(buildGroundingExercisePrompt('breathing')).toContain('breathing');
    expect(buildGroundingExercisePrompt('movement')).toContain('movement');
  });

  it('buildCheckInAnalysisPrompt includes the check-in data', () => {
    const checkIns = 'Monday: Mood 3, Craving 2. Tuesday: Mood 4, Craving 1.';
    const result = buildCheckInAnalysisPrompt(checkIns);
    expect(result).toContain(checkIns);
  });

  it('buildJournalReframePrompt includes the journal entry', () => {
    const entry = 'I feel like I will never get better.';
    const result = buildJournalReframePrompt(entry);
    expect(result).toContain(entry);
  });

  it('RESOURCE_GENERATION_PROMPT defines JSON schema structure', () => {
    expect(RESOURCE_GENERATION_PROMPT).toContain('"cards"');
    expect(RESOURCE_GENERATION_PROMPT).toContain('"title"');
    expect(RESOURCE_GENERATION_PROMPT).toContain('"topic"');
    expect(RESOURCE_GENERATION_PROMPT).toContain('"practicalTip"');
  });
});
