import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// 1. First, we must vi.mock BEFORE importing the route
vi.mock('@/lib/gemini', () => ({
  generateWithFlash: vi.fn().mockResolvedValue('Test alert message for caregiver'),
  generateWithPro: vi.fn().mockResolvedValue('Pro test message'),
}));

vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({
    success: true,
    messageId: '<test-id@anchorai.app>',
    previewUrl: 'https://ethereal.email/message/test',
  }),
}));

// 2. Then import the route and dependencies after mocks
import { POST } from '@/app/api/alert/route';
import { sendEmail } from '@/lib/email';
import { generateWithFlash } from '@/lib/gemini';

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/alert API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for missing required fields (userName)', async () => {
    const res = await POST(createRequest({ caregiverName: 'Mom' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid request body');
  });

  it('generates message and sends email when contact is an email address', async () => {
    const res = await POST(createRequest({
      caregiverName: 'Mom',
      caregiverContact: 'mom@example.com',
      userName: 'Ranjith',
      userEmail: 'ranjith@example.com',
    }));

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.method).toBe('email');
    expect(data.message).toBe('Test alert message for caregiver');
    expect(data.previewUrl).toBe('https://ethereal.email/message/test');
    
    expect(generateWithFlash).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'mom@example.com',
      userName: 'Ranjith',
      userEmail: 'ranjith@example.com',
    }));
  });

  it('uses in-app method when contact is just a phone number (no @)', async () => {
    const res = await POST(createRequest({
      caregiverName: 'Mom',
      caregiverContact: '+1234567890',
      userName: 'Ranjith',
    }));

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.method).toBe('in-app');
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('falls back to safe message and still sends email if Gemini throws error', async () => {
    // Mock Gemini to throw an error (e.g. 429 Rate Limit)
    vi.mocked(generateWithFlash).mockRejectedValueOnce(new Error('429 Too Many Requests'));

    const res = await POST(createRequest({
      caregiverName: 'Dad',
      caregiverContact: 'dad@example.com',
      userName: 'Ranjith',
    }));

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.isFallback).toBe(true);
    expect(data.message).toContain('Hi there, just a gentle heads-up');
    expect(data.method).toBe('email');
    
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining('just a gentle heads-up'),
      to: 'dad@example.com',
    }));
  });
});
