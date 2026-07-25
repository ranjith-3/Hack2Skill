// ============================================================
// AnchorAI — Script Generation API Route (POST /api/script)
// Generates personalized emergency script at onboarding
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithPro } from '@/lib/gemini';
import { SCRIPT_SYSTEM_PROMPT, buildScriptGenerationPrompt } from '@/lib/prompts';

const ScriptRequestSchema = z.object({
  name: z.string().min(1),
  substance: z.string().min(1),
  triggers: z.array(z.string()),
  copingStyle: z.string().min(1),
  caregiverName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ScriptRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, substance, triggers, copingStyle, caregiverName } = parsed.data;

    const script = await generateWithPro(
      SCRIPT_SYSTEM_PROMPT,
      buildScriptGenerationPrompt(name, substance, triggers, copingStyle, caregiverName),
      500,
      0.8
    );

    return NextResponse.json({ script });
  } catch (error) {
    console.error('[Script API Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}
