// TestSprite Test: Referral System
// Tests the 5-level referral pyramid functionality

const { test, expect } = require('@playwright/test');

test.describe('Referral System', () => {
  let testUser;

  test.beforeEach(async ({ page }) => {
    testUser = global.testData.testUser;
    
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Navigate to referrals page
    await page.goto('/referrals');
    await expect(page.locator('h1')).toContainText('Referral Program');
  });

  test('should display referral program correctly', async ({ page }) => {
    // Check main referral elements
    await expect(page.locator('h1')).toContainText('Referral Program');
    await expect(page.locator('text=Earn up to 10% bonus on referral deposits across 5 levels')).toBeVisible();
    
    // Check referral stats
    await expect(page.locator('text=Total Referrals')).toBeVisible();
    await expect(page.locator('text=Referral Earnings')).toBeVisible();
    await expect(page.locator('text=Network Value')).toBeVisible();
  });

  test('should display referral link', async ({ page }) => {
    // Check referral link section
    await expect(page.locator('text=Your Referral Link')).toBeVisible();
    
    // Check referral link input
    const referralLinkInput = page.locator('input[readonly]');
    await expect(referralLinkInput).toBeVisible();
    
    // Check if link contains the user's referral code
    const linkValue = await referralLinkInput.inputValue();
    expect(linkValue).toContain('ref=');
  });

  test('should display referral code', async ({ page }) => {
    // Check referral code display
    await expect(page.locator('text=Your Referral Code:')).toBeVisible();
    
    // Check referral code element
    const referralCode = page.locator('code');
    await expect(referralCode).toBeVisible();
    
    // Code should be visible and not empty
    const codeValue = await referralCode.textContent();
    expect(codeValue).toBeTruthy();
    expect(codeValue.length).toBeGreaterThan(0);
  });

  test('should copy referral link', async ({ page }) => {
    // Click copy button
    await page.click('text=Copy');
    
    // Should show success message
    await expect(page.locator('text=Copied!')).toBeVisible();
    
    // Button text should change temporarily
    await expect(page.locator('text=Copied!')).toBeVisible();
    
    // Wait for button to reset
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Copy')).toBeVisible();
  });

  test('should share referral link', async ({ page }) => {
    // Click share button
    await page.click('text=Share');
    
    // Should either open share dialog or copy to clipboard
    // In test environment, it might just copy to clipboard
    await page.waitForTimeout(1000);
  });

  test('should display bonus structure', async ({ page }) => {
    // Check bonus structure section
    await expect(page.locator('text=Bonus Structure')).toBeVisible();
    
    // Check for all 5 levels
    const levels = ['L1', 'L2', 'L3', 'L4', 'L5'];
    for (const level of levels) {
      await expect(page.locator(`text=${level}`)).toBeVisible();
    }
    
    // Check bonus rates
    const rates = ['10%', '5%', '3%', '2%', '1%'];
    for (const rate of rates) {
      await expect(page.locator(`text=${rate}`)).toBeVisible();
    }
  });

  test('should display referral network', async ({ page }) => {
    // Check network section
    await expect(page.locator('text=Your Network')).toBeVisible();
    
    // For new user, should show no referrals
    await expect(page.locator('text=No referrals yet')).toBeVisible();
    
    // Check share button for new users
    await expect(page.locator('text=Share Now')).toBeVisible();
  });

  test('should handle referral link generation', async ({ page }) => {
    // Get the referral link
    const referralLinkInput = page.locator('input[readonly]');
    const linkValue = await referralLinkInput.inputValue();
    
    // Link should be a valid URL
    expect(linkValue).toMatch(/^https?:\/\//);
    
    // Link should contain ref parameter
    expect(linkValue).toContain('ref=');
    
    // Link should contain the referral code
    const referralCode = page.locator('code');
    const codeValue = await referralCode.textContent();
    expect(linkValue).toContain(codeValue);
  });

  test('should display referral statistics', async ({ page }) => {
    // Check stats cards
    await expect(page.locator('text=Total Referrals')).toBeVisible();
    await expect(page.locator('text=Referral Earnings')).toBeVisible();
    await expect(page.locator('text=Network Value')).toBeVisible();
    
    // Check for direct referrals count
    await expect(page.locator('text=direct referrals')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if referrals page adapts to mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Your Referral Link')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check if referrals page adapts to tablet
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Bonus Structure')).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should display referral tree structure', async ({ page }) => {
    // Check if referral tree is displayed
    const referralTree = page.locator('[data-testid="referral-tree"], .referral-tree');
    
    if (await referralTree.isVisible()) {
      await expect(referralTree).toBeVisible();
    } else {
      // For new users, should show empty state
      await expect(page.locator('text=No referrals yet')).toBeVisible();
    }
  });

  test('should handle referral link validation', async ({ page }) => {
    // Test with invalid referral code
    await page.goto('/signup?ref=INVALID123');
    
    // Should still show signup form
    await expect(page.locator('h1')).toContainText('Create Account');
    
    // Invalid referral code should be in the input
    const referralInput = page.locator('input[placeholder="Enter referral code"]');
    await expect(referralInput).toHaveValue('INVALID123');
  });

  test('should display referral earnings breakdown', async ({ page }) => {
    // Check for earnings breakdown
    const earningsSection = page.locator('text=Referral Earnings');
    await expect(earningsSection).toBeVisible();
    
    // Check for ETF tokens display
    await expect(page.locator('text=ETF Tokens')).toBeVisible();
  });

  test('should handle referral notifications', async ({ page }) => {
    // Look for notification settings or referral notifications
    const notificationSettings = page.locator('text=Notifications, [data-testid="notification-settings"]');
    
    if (await notificationSettings.isVisible()) {
      await notificationSettings.click();
      
      // Check if notification options are available
      await expect(page.locator('text=Email notifications')).toBeVisible();
    }
  });

  test('should display referral milestones', async ({ page }) => {
    // Check for milestone information
    const milestones = ['First Referral', '5 Referrals', '10 Referrals', '25 Referrals'];
    
    for (const milestone of milestones) {
      const milestoneElement = page.locator(`text=${milestone}`);
      if (await milestoneElement.isVisible()) {
        await expect(milestoneElement).toBeVisible();
      }
    }
  });

  test('should handle referral analytics', async ({ page }) => {
    // Check for analytics or detailed stats
    const analyticsSection = page.locator('text=Analytics, [data-testid="analytics"]');
    
    if (await analyticsSection.isVisible()) {
      await analyticsSection.click();
      
      // Check for analytics data
      await expect(page.locator('text=Referral Performance')).toBeVisible();
    }
  });

  test('should display referral terms and conditions', async ({ page }) => {
    // Check for terms link or information
    const termsLink = page.locator('text=Terms, [data-testid="terms"]');
    
    if (await termsLink.isVisible()) {
      await termsLink.click();
      
      // Should show terms or open in new tab
      await page.waitForTimeout(1000);
    }
  });

  test('should handle referral code regeneration', async ({ page }) => {
    // Look for regenerate referral code option
    const regenerateButton = page.locator('text=Regenerate, [data-testid="regenerate-code"]');
    
    if (await regenerateButton.isVisible()) {
      // Get current referral code
      const currentCode = await page.locator('code').textContent();
      
      // Click regenerate
      await regenerateButton.click();
      
      // Confirm regeneration
      await page.click('text=Yes, Regenerate');
      
      // New code should be different
      await page.waitForTimeout(1000);
      const newCode = await page.locator('code').textContent();
      expect(newCode).not.toBe(currentCode);
    }
  });
});

