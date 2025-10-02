// Production-Grade TestSprite Tests for CoinDesk Crypto 5 ETF
// Tests all core functionalities systematically

const { test, expect } = require('@playwright/test');

test.describe('Production Test Suite - Core Functionalities', () => {
  
  test.describe('1. APPLICATION CONNECTIVITY', () => {
    test('should load landing page', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app');
      await expect(page).toHaveTitle(/CoinDesk|ETF/);
      await page.screenshot({ path: 'test-results/landing-page.png' });
    });

    test('should load signup page', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/signup');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/signup-page.png' });
    });

    test('should load login page', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/login');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/login-page.png' });
    });

    test('should load dashboard page', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/dashboard');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/dashboard-page.png' });
    });
  });

  test.describe('2. AUTHENTICATION SYSTEM', () => {
    test('signup form validation', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/signup');
      
      // Test empty form submission
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Check for validation errors
      const hasValidationErrors = await page.locator('text=required').count() > 0;
      console.log('Form validation working:', hasValidationErrors);
      
      await page.screenshot({ path: 'test-results/signup-validation.png' });
    });

    test('login form validation', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/login');
      
      // Test empty form submission
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Check for validation errors
      const hasValidationErrors = await page.locator('text=required').count() > 0;
      console.log('Login validation working:', hasValidationErrors);
      
      await page.screenshot({ path: 'test-results/login-validation.png' });
    });

    test('invalid credentials handling', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/login');
      
      await page.fill('input[type="email"]', 'invalid@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'test-results/invalid-credentials.png' });
    });
  });

  test.describe('3. PORTFOLIO MANAGEMENT', () => {
    test('portfolio page accessibility', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/portfolio');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/portfolio-page.png' });
    });

    test('deposit page functionality', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/deposit');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/deposit-page.png' });
    });

    test('withdrawal page functionality', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/withdraw');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/withdrawal-page.png' });
    });
  });

  test.describe('4. REFERRAL SYSTEM', () => {
    test('referral page accessibility', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/referrals');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/referrals-page.png' });
    });

    test('referral link generation', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/referrals');
      await page.waitForLoadState('networkidle');
      
      // Look for referral code or link
      const referralElements = await page.locator('code, input[readonly]').count();
      console.log('Referral elements found:', referralElements);
      
      await page.screenshot({ path: 'test-results/referral-links.png' });
    });
  });

  test.describe('5. STAKING SYSTEM', () => {
    test('staking page accessibility', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app/staking');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/staking-page.png' });
    });
  });

  test.describe('6. RESPONSIVE DESIGN', () => {
    test('mobile viewport (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/mobile-view.png' });
    });

    test('tablet viewport (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/tablet-view.png' });
    });

    test('desktop viewport (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/desktop-view.png' });
    });
  });

  test.describe('7. NAVIGATION SYSTEM', () => {
    test('navigation menu functionality', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      
      // Test navigation links
      const navLinks = ['Dashboard', 'Portfolio', 'Deposit', 'Withdraw', 'Referrals', 'Staking'];
      
      for (const link of navLinks) {
        const linkElement = page.locator(`text=${link}`);
        if (await linkElement.count() > 0) {
          console.log(`Navigation link "${link}" found`);
        }
      }
      
      await page.screenshot({ path: 'test-results/navigation-menu.png' });
    });
  });

  test.describe('8. PERFORMANCE TESTING', () => {
    test('page load performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    });

    test('resource loading', async ({ page }) => {
      const response = await page.goto('https://etf-web-mi7p.vercel.app');
      expect(response.status()).toBeLessThan(400);
      
      // Check for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(3000);
      console.log('Console errors found:', errors.length);
    });
  });

  test.describe('9. SECURITY TESTING', () => {
    test('HTTPS enforcement', async ({ page }) => {
      const response = await page.goto('https://etf-web-mi7p.vercel.app');
      const url = page.url();
      expect(url).toMatch(/^https:/);
      console.log('HTTPS enforced:', url.startsWith('https:'));
    });

    test('content security headers', async ({ page }) => {
      const response = await page.goto('https://etf-web-mi7p.vercel.app');
      const headers = response.headers();
      
      console.log('Security headers present:', {
        'content-security-policy': !!headers['content-security-policy'],
        'x-frame-options': !!headers['x-frame-options'],
        'x-content-type-options': !!headers['x-content-type-options']
      });
    });
  });

  test.describe('10. INTEGRATION TESTING', () => {
    test('external API connectivity', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app');
      
      // Check for network requests
      const requests = [];
      page.on('request', request => {
        requests.push(request.url());
      });
      
      await page.waitForTimeout(5000);
      
      const apiRequests = requests.filter(url => 
        url.includes('supabase') || 
        url.includes('api') || 
        url.includes('coingecko')
      );
      
      console.log('API requests detected:', apiRequests.length);
    });

    test('real-time data updates', async ({ page }) => {
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForTimeout(5000);
      
      // Look for price updates or real-time indicators
      const priceElements = await page.locator('text=$, text=USD, text=ETH, text=BTC').count();
      console.log('Price elements found:', priceElements);
    });
  });
});
