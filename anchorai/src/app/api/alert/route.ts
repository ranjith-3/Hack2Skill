// ============================================================
// AnchorAI — Caregiver Alert API Route (POST /api/alert)
// Generates warm, non-alarming caregiver notification
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFlash } from '@/lib/gemini';
import { sendEmail } from '@/lib/email';
import { ALERT_SYSTEM_PROMPT, buildCaregiverAlertPrompt } from '@/lib/prompts';

const AlertRequestSchema = z.object({
  caregiverName: z.string().min(1),
  caregiverContact: z.string().optional(),
  userName: z.string().min(1),
  userEmail: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AlertRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { caregiverName, caregiverContact, userName, userEmail } = parsed.data;

    let message = '';
    let isFallback = false;

    try {
      message = await generateWithFlash(
        ALERT_SYSTEM_PROMPT,
        buildCaregiverAlertPrompt(caregiverName, userName),
        100,
        0.6
      );
    } catch (error) {
      console.error('[Alert API Error] Gemini generation failed, using fallback:', error);
      message = `Hi there, just a gentle heads-up that your loved one used their support tool today. No action required — they're safe and using their recovery tools. Just keeping you in the loop with care.`;
      isFallback = true;
    }

    let method = 'in-app';
    let previewUrl = undefined;

    // If contact looks like an email, send real email via Nodemailer
    if (caregiverContact && caregiverContact.includes('@')) {
      try {
        const emailResult = await sendEmail({
          to: caregiverContact,
          subject: `AnchorAI Alert: Support needed for ${userName}`,
          text: message,
          userName: userName,
          userEmail: userEmail,
        });
        method = 'email';
        previewUrl = emailResult.previewUrl;
      } catch (err) {
        console.error('[Alert API] Email sending failed:', err);
      }
    }

    return NextResponse.json({
      message,
      sentAt: new Date().toISOString(),
      method,
      previewUrl,
      isFallback,
    });
  } catch (error) {
    console.error('[Alert API Critical Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
