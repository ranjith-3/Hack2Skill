// ============================================================
// AnchorAI — Journal API Route (POST /api/journal)
// Voice journal reframe using Gemini Flash
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFlash } from '@/lib/gemini';
import { JOURNAL_SYSTEM_PROMPT, buildJournalReframePrompt } from '@/lib/prompts';

const JournalRequestSchema = z.object({
  entry: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = JournalRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { entry } = parsed.data;

    const reframe = await generateWithFlash(
      JOURNAL_SYSTEM_PROMPT,
      buildJournalReframePrompt(entry),
      200,
      0.7
    );

    return NextResponse.json({ reframe });
  } catch (error) {
    console.error('[Journal API Error]', error);
    return NextResponse.json({
      reframe: 'Thank you for sharing your thoughts. Writing them down is a powerful step in recovery. Every moment of honesty brings you closer to lasting change.',
    });
  }
}
