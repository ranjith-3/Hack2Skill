// ============================================================
// AnchorAI — Resources API Route (GET /api/resources)
// AI-generated educational recovery resource cards
// ============================================================

import { NextResponse } from 'next/server';
import { generateWithPro } from '@/lib/gemini';
import { RESOURCE_SYSTEM_PROMPT, RESOURCE_GENERATION_PROMPT } from '@/lib/prompts';

// Cache the generated resources in memory for efficiency
let cachedResources: string | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
  try {
    const now = Date.now();
    // Return cached resources if fresh
    if (cachedResources && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(JSON.parse(cachedResources));
    }

    const result = await generateWithPro(
      RESOURCE_SYSTEM_PROMPT,
      RESOURCE_GENERATION_PROMPT,
      1000,
      0.7
    );

    // Clean up potential markdown formatting from Gemini
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Validate JSON
    const parsed = JSON.parse(cleaned);
    cachedResources = JSON.stringify(parsed);
    cacheTimestamp = now;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[Resources API Error]', error);

    // Fallback static resources
    return NextResponse.json({
      cards: [
        {
          title: 'Understanding Your Cravings',
          topic: 'Cravings',
          summary: 'Cravings are your brain\'s normal response to change. They typically peak in 15-20 minutes and then fade. Knowing this can help you ride them out.',
          practicalTip: 'When a craving hits, set a 20-minute timer. Do something engaging until it goes off.',
          readTime: 3,
        },
        {
          title: 'Talking to Family About Recovery',
          topic: 'Family',
          summary: 'Open communication with family can strengthen your recovery. Start with one trusted person and be honest about what support you need.',
          practicalTip: 'Write down three things you wish your family understood about your recovery journey.',
          readTime: 3,
        },
        {
          title: 'Understanding Treatment Options',
          topic: 'Treatment',
          summary: 'Medication-assisted treatment (MAT) is an evidence-based approach that combines medication with counseling. It\'s not replacing one substance with another.',
          practicalTip: 'Ask your healthcare provider about MAT options at your next appointment.',
          readTime: 4,
        },
        {
          title: 'Building Your Support Network',
          topic: 'Support',
          summary: 'Recovery is easier with people who understand. Support groups, sponsors, and sober friends create a safety net for challenging moments.',
          practicalTip: 'Identify one person you can call when things get tough and save their number.',
          readTime: 3,
        },
        {
          title: 'Managing High-Risk Situations',
          topic: 'Prevention',
          summary: 'Knowing your triggers is half the battle. High-risk situations often involve specific places, people, or emotions that your brain links to substance use.',
          practicalTip: 'Make a list of your top 3 high-risk situations and plan one escape strategy for each.',
          readTime: 3,
        },
      ],
    });
  }
}
