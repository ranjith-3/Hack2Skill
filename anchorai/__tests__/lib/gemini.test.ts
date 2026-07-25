import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithFlash, generateWithPro } from '@/lib/gemini';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.stubEnv('OPENROUTER_API_KEY', 'sk-test-key');
  mockFetch.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe('generateWithFlash', () => {
  it('returns AI-generated text on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Stay strong, you are doing great.' } }],
      }),
    });

    const result = await generateWithFlash('system prompt', 'user prompt');
    expect(result).toBe('Stay strong, you are doing great.');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sends correct headers including Authorization', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Response' } }],
      }),
    });

    await generateWithFlash('sys', 'user');
    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.headers['Authorization']).toBe('Bearer sk-test-key');
    expect(callArgs.headers['Content-Type']).toBe('application/json');
    expect(callArgs.headers['X-Title']).toBe('AnchorAI');
  });

  it('sends system + user messages in the correct format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'OK' } }],
      }),
    });

    await generateWithFlash('my system prompt', 'my user prompt', 500, 0.5);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.messages).toEqual([
      { role: 'system', content: 'my system prompt' },
      { role: 'user', content: 'my user prompt' },
    ]);
    expect(body.max_tokens).toBe(500);
    expect(body.temperature).toBe(0.5);
  });

  it('uses gpt-4o-mini model for Flash', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Fast response' } }],
      }),
    });

    await generateWithFlash('sys', 'user');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe('openai/gpt-4o-mini');
  });

  it('throws on missing API key', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    await expect(generateWithFlash('sys', 'user')).rejects.toThrow('OPENROUTER_API_KEY');
  });

  it('retries on 429 with exponential backoff', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => '429 Too Many Requests',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Recovered!' } }],
        }),
      });

    const result = await generateWithFlash('sys', 'user');
    expect(result).toBe('Recovered!');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  }, 15000);

  it('throws after max retries exhausted', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => '429 Too Many Requests',
    });
    await expect(generateWithFlash('sys', 'user')).rejects.toThrow();
  }, 30000);

  it('throws on non-429 errors without retrying', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await expect(generateWithFlash('sys', 'user')).rejects.toThrow('500');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('throws when no choices returned', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [] }),
    });

    await expect(generateWithFlash('sys', 'user')).rejects.toThrow('No completion choices');
  });
});

describe('generateWithPro', () => {
  it('uses gpt-4o model', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Pro response' } }],
      }),
    });

    await generateWithPro('sys', 'user');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe('openai/gpt-4o');
  });

  it('defaults to higher maxTokens than Flash', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Detailed response' } }],
      }),
    });

    await generateWithPro('sys', 'user');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.max_tokens).toBe(1000);
  });
});
