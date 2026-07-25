import { test, expect } from '@playwright/test';

test.describe('Crisis Flow & Onboarding E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure a clean state
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
  });

  test('onboarding flow completes successfully and navigates to home', async ({ page }) => {
    // Start at root
    await page.goto('http://localhost:3000');
    
    // Check we are at onboarding step 0 (Welcome)
    await expect(page.locator('text=Welcome to AnchorAI')).toBeVisible();

    // Step 0: Name + Email
    await page.fill('input[placeholder*="call you"]', 'E2E Tester');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Continue")');
    
    // Step 1: Substance
    await expect(page.locator('text=Primary Challenge')).toBeVisible();
    await page.click('button:has-text("Alcohol")');
    await page.click('button:has-text("Continue")');
    
    // Step 2: Triggers (select 1)
    await expect(page.locator('text=Common Triggers')).toBeVisible();
    await page.click('button:has-text("Stress at work")');
    await page.click('button:has-text("Continue")');
    
    // Step 3: Coping style
    await expect(page.locator('text=Preferred Coping Method')).toBeVisible();
    await page.click('button:has-text("Breathing")');
    await page.click('button:has-text("Continue")');
    
    // Step 4: Caregiver
    await expect(page.locator('text=Support Contact')).toBeVisible();
    await page.fill('input[placeholder*="caregiver"]', 'Mom');
    await page.fill('input[placeholder*="phone or email"]', 'mom@test.com');
    await page.click('button:has-text("Complete Setup")');
    
    // Should redirect to home
    await page.waitForURL('**/home', { timeout: 15000 });
    expect(page.url()).toContain('/home');

    // Verify localStorage has the profile
    const isComplete = await page.evaluate(() => localStorage.getItem('anchorai_onboarding_complete'));
    expect(isComplete).toBe('true');
  });

  test('crisis button triggers script and shows confirmation', async ({ page }) => {
    // First, seed localStorage so we skip onboarding
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      const profile = {
        id: 'e2e-test',
        name: 'E2E User',
        substance: 'Alcohol',
        triggers: ['Stress'],
        copingStyle: 'breathing',
        caregiverName: 'Mom',
        caregiverContact: 'mom@test.com',
        userEmail: 'user@test.com',
        sobrietyStartDate: new Date().toISOString(),
        language: 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('anchorai_profile', JSON.stringify(profile));
      localStorage.setItem('anchorai_onboarding_complete', 'true');
    });

    await page.goto('http://localhost:3000/home');
    
    // Click the crisis button
    const crisisBtn = page.locator('button:has-text("I Need Help")');
    await expect(crisisBtn).toBeVisible();
    await crisisBtn.click();
    
    // Wait for crisis page to load
    await page.waitForURL('**/crisis', { timeout: 10000 });
    
    // Wait for the script to generate and appear
    // We check for the visual script element (which could be the fallback or real API response)
    await expect(page.locator('text=Close')).toBeVisible({ timeout: 30000 });
    
    // Wait for the alert sent text to eventually appear (after the email API finishes)
    await expect(page.locator('text=Alert sent to Mom')).toBeVisible({ timeout: 30000 });
  });
});
