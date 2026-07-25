// ============================================================
// AnchorAI — Check-In API Route (POST /api/checkin)
// Daily mood/craving analysis using Gemini Flash
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFlash } from '@/lib/gemini';
import { CHECKIN_SYSTEM_PROMPT, buildCheckInAnalysisPrompt } from '@/lib/prompts';

const CheckInAnalysisSchema = z.object({
  checkIns: z.array(z.object({
    mood: z.number().min(1).max(5),
    cravingLevel: z.number().min(1).max(5),
    notes: z.string().optional(),
    createdAt: z.string(),
  })),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckInAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { checkIns } = parsed.data;

    if (checkIns.length === 0) {
      return NextResponse.json({
        insight: 'Start logging your daily check-ins to unlock AI-powered insights about your recovery patterns.',
      });
    }

    const analysis = await generateWithFlash(
      CHECKIN_SYSTEM_PROMPT,
      buildCheckInAnalysisPrompt(JSON.stringify(checkIns)),
      150,
      0.6
    );

    return NextResponse.json({ insight: analysis });
  } catch (error) {
    console.error('[CheckIn API Error]', error);
    return NextResponse.json({
      insight: 'Keep tracking your progress — every check-in matters. You\'re doing great by showing up for yourself.',
    });
  }
}
