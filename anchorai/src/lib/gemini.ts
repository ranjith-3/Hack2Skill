// ============================================================
// AnchorAI — OpenRouter AI Client (Server-Side Only)
// (Note: File kept as gemini.ts to maintain import compatibility)
// API key stored in environment variables, never client-side
// Includes retry logic with exponential backoff for rate limits
// ============================================================

/**
 * Sleep helper for retry backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate content with automatic retry on rate limit (429) errors.
 * Uses exponential backoff: 2s → 4s → 8s
 */
async function generateWithRetry(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number,
  maxRetries: number = 3
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'AnchorAI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API Error (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No completion choices returned from OpenRouter');
      }

      return data.choices[0].message.content;
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const isRateLimit = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests');

      if (isRateLimit && attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
        console.warn(`[OpenRouter] Rate limited, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(backoffMs);
        continue;
      }

      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Generate content using OpenRouter fast model (replaces Gemini Flash)
 */
export async function generateWithFlash(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 300,
  temperature: number = 0.7
): Promise<string> {
  // Using openai/gpt-4o-mini for fast, cheap responses
  return generateWithRetry('openai/gpt-4o-mini', systemPrompt, userPrompt, maxTokens, temperature);
}

/**
 * Generate content using OpenRouter pro model (replaces Gemini Pro)
 */
export async function generateWithPro(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<string> {
  // Using openai/gpt-4o for high-quality complex scripts
  return generateWithRetry('openai/gpt-4o', systemPrompt, userPrompt, maxTokens, temperature);
}
