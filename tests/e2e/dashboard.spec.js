// TestSprite Test: Dashboard Functionality
// Tests the main dashboard features and navigation

const { test, expect } = require('@playwright/test');

test.describe('Dashboard Functionality', () => {
  let testUser;

  test.beforeEach(async ({ page }) => {
    testUser = global.testData.testUser;
    
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('should display dashboard correctly', async ({ page }) => {
    // Check main dashboard elements
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('text=Here\'s what\'s happening with your investments')).toBeVisible();
    
    // Check stats cards
    await expect(page.locator('text=Total Value')).toBeVisible();
    await expect(page.locator('text=ETF Tokens')).toBeVisible();
    await expect(page.locator('text=Referral Earnings')).toBeVisible();
    await expect(page.locator('text=Loyalty Points')).toBeVisible();
    
    // Check sections
    await expect(page.locator('text=Market Prices')).toBeVisible();
    await expect(page.locator('text=Recent Transactions')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('should display crypto prices', async ({ page }) => {
    // Check if crypto prices are loaded
    await expect(page.locator('text=Market Prices')).toBeVisible();
    
    // Wait for prices to load
    await page.waitForTimeout(2000);
    
    // Check for crypto symbols
    const cryptoSymbols = ['ETH', 'BTC', 'ETF'];
    for (const symbol of cryptoSymbols) {
      await expect(page.locator(`text=${symbol}`)).toBeVisible();
    }
  });

  test('should show recent transactions', async ({ page }) => {
    // Check transactions section
    await expect(page.locator('text=Recent Transactions')).toBeVisible();
    
    // Should show "No transactions yet" for new user
    await expect(page.locator('text=No transactions yet')).toBeVisible();
  });

  test('should navigate to quick action pages', async ({ page }) => {
    // Test Deposit navigation
    await page.click('text=Deposit');
    await expect(page).toHaveURL(/.*\/deposit/);
    await expect(page.locator('h1')).toContainText('Deposit');
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Test Withdraw navigation
    await page.click('text=Withdraw');
    await expect(page).toHaveURL(/.*\/withdraw/);
    await expect(page.locator('h1')).toContainText('Withdraw');
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Test Staking navigation
    await page.click('text=Stake');
    await expect(page).toHaveURL(/.*\/staking/);
    await expect(page.locator('h1')).toContainText('Staking');
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Test Referrals navigation
    await page.click('text=Refer');
    await expect(page).toHaveURL(/.*\/referrals/);
    await expect(page.locator('h1')).toContainText('Referral Program');
  });

  test('should display user profile information', async ({ page }) => {
    // Check if user name is displayed
    await expect(page.locator('h1')).toContainText(testUser.fullName);
    
    // Check navigation menu (if exists)
    const profileMenu = page.locator('[data-testid="profile-menu"]');
    if (await profileMenu.isVisible()) {
      await profileMenu.click();
      await expect(page.locator('text=Profile')).toBeVisible();
      await expect(page.locator('text=Settings')).toBeVisible();
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if dashboard adapts to mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Total Value')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check if dashboard adapts to tablet
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Market Prices')).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should update portfolio values in real-time', async ({ page }) => {
    // Check initial portfolio values
    const totalValue = page.locator('text=Total Value').locator('..').locator('text=0.00');
    await expect(totalValue).toBeVisible();
    
    // Wait for any real-time updates
    await page.waitForTimeout(3000);
    
    // Check if values are still displayed (even if 0)
    await expect(page.locator('text=ETF Tokens')).toBeVisible();
    await expect(page.locator('text=Referral Earnings')).toBeVisible();
  });

  test('should handle navigation menu', async ({ page }) => {
    // Check if navigation menu exists
    const navMenu = page.locator('nav, [role="navigation"]');
    
    if (await navMenu.isVisible()) {
      // Test navigation links
      const navLinks = ['Dashboard', 'Portfolio', 'Deposit', 'Withdraw', 'Referrals', 'Staking', 'Rewards', 'Profile'];
      
      for (const link of navLinks) {
        const navLink = page.locator(`text=${link}`);
        if (await navLink.isVisible()) {
          await navLink.click();
          await page.waitForTimeout(500);
          
          // Should navigate to correct page
          if (link === 'Dashboard') {
            await expect(page).toHaveURL(/.*\/dashboard/);
          } else {
            await expect(page).toHaveURL(new RegExp(`.*\\/${link.toLowerCase()}`));
          }
          
          // Go back to dashboard for next test
          await page.goto('/dashboard');
        }
      }
    }
  });

  test('should handle dark mode toggle', async ({ page }) => {
    // Look for dark mode toggle
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"], button:has-text("Dark"), button:has-text("Light")');
    
    if (await darkModeToggle.isVisible()) {
      // Get initial theme
      const body = page.locator('body');
      const initialClass = await body.getAttribute('class');
      
      // Toggle dark mode
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if theme changed
      const newClass = await body.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
      
      // Toggle back
      await darkModeToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('should handle notifications', async ({ page }) => {
    // Look for notification bell or notification area
    const notificationBell = page.locator('[data-testid="notifications"], button:has-text("🔔"), button:has-text("Notifications")');
    
    if (await notificationBell.isVisible()) {
      await notificationBell.click();
      
      // Check if notification panel opens
      await expect(page.locator('text=Notifications')).toBeVisible();
      
      // Close notification panel
      await page.keyboard.press('Escape');
    }
  });

  test('should handle search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    
    if (await searchInput.isVisible()) {
      // Test search
      await searchInput.fill('portfolio');
      await page.keyboard.press('Enter');
      
      // Should show search results or navigate
      await page.waitForTimeout(1000);
      
      // Clear search
      await searchInput.clear();
    }
  });
});
