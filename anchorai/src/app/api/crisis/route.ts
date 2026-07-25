// ============================================================
// AnchorAI — Crisis API Route (POST /api/crisis)
// Core crisis intervention flow using Gemini Flash
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFlash } from '@/lib/gemini';
import {
  CRISIS_SYSTEM_PROMPT,
  buildCrisisUserPrompt,
  buildGroundingExercisePrompt,
} from '@/lib/prompts';

const CrisisRequestSchema = z.object({
  name: z.string().min(1),
  substance: z.string().min(1),
  copingStyle: z.string().min(1),
  triggerType: z.enum(['tap', 'voice']),
  voiceTranscript: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CrisisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, substance, copingStyle, triggerType, voiceTranscript } = parsed.data;

    // Generate crisis response first (highest priority), then grounding exercise
    // Sequential to avoid rate limit bursts on free tier
    const scriptText = await generateWithFlash(
      CRISIS_SYSTEM_PROMPT,
      buildCrisisUserPrompt(name, substance, voiceTranscript ?? null, copingStyle),
      300,
      0.7
    );

    const groundingText = await generateWithFlash(
      'You are a calm grounding exercise guide.',
      buildGroundingExercisePrompt(copingStyle),
      100,
      0.5
    );

    return NextResponse.json({
      script: scriptText,
      groundingExercise: groundingText,
      hotlineNumber: '988 (Suicide & Crisis Lifeline) or 1-800-662-4357 (SAMHSA)',
      triggerType,
    });
  } catch (error) {
    console.error('[Crisis API Error]', error);

    // Fallback script for when API is unavailable
    return NextResponse.json({
      script: "You're safe right now. Take a slow breath in through your nose for 4 counts... hold it... and exhale through your mouth for 6 counts. You've made it through tough moments before, and you'll make it through this one too. If you need immediate help, call 988 or 1-800-662-4357.",
      groundingExercise: "Let's try the 5-4-3-2-1 technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      hotlineNumber: '988 (Suicide & Crisis Lifeline) or 1-800-662-4357 (SAMHSA)',
      isFallback: true,
    });
  }
}
