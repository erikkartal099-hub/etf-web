// TestSprite Test Helpers
// Utility functions for testing the CoinDesk Crypto 5 ETF platform

const { expect } = require('@playwright/test');

/**
 * Generate a unique test email
 */
function generateTestEmail(prefix = 'test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@coindesketf.com`;
}

/**
 * Generate a unique test user
 */
function generateTestUser(prefix = 'test') {
  return {
    email: generateTestEmail(prefix),
    password: 'TestPassword123!',
    fullName: `Test User ${Date.now()}`,
    referralCode: `TEST${Date.now()}`
  };
}

/**
 * Wait for element to be visible with custom timeout
 */
async function waitForElement(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
  return page.locator(selector);
}

/**
 * Wait for text to be visible
 */
async function waitForText(page, text, timeout = 10000) {
  await page.waitForSelector(`text=${text}`, { timeout });
  return page.locator(`text=${text}`);
}

/**
 * Login a user
 */
async function loginUser(page, email, password) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
}

/**
 * Sign up a new user
 */
async function signUpUser(page, user) {
  await page.goto('/signup');
  await page.fill('input[placeholder="John Doe"]', user.fullName);
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]:first-of-type', user.password);
  await page.fill('input[type="password"]:last-of-type', user.password);
  
  if (user.referralCode) {
    await page.fill('input[placeholder="Enter referral code"]', user.referralCode);
  }
  
  await page.click('button[type="submit"]');
  
  // Wait for success message
  await waitForText(page, 'Account created successfully');
}

/**
 * Create a test user and login
 */
async function createAndLoginUser(page, userPrefix = 'test') {
  const user = generateTestUser(userPrefix);
  await signUpUser(page, user);
  await loginUser(page, user.email, user.password);
  return user;
}

/**
 * Navigate to a page and wait for it to load
 */
async function navigateToPage(page, path, expectedTitle) {
  await page.goto(path);
  
  if (expectedTitle) {
    await waitForText(page, expectedTitle);
  }
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
}

/**
 * Take a screenshot with timestamp
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/screenshots/${filename}` });
  return filename;
}

/**
 * Check if element exists without throwing error
 */
async function elementExists(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get text content safely
 */
async function getTextContent(page, selector) {
  try {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      return await element.textContent();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fill form field safely
 */
async function fillField(page, selector, value) {
  try {
    const field = page.locator(selector);
    if (await field.isVisible()) {
      await field.fill(value);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Click element safely
 */
async function clickElement(page, selector) {
  try {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      await element.click();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Wait for API response
 */
async function waitForApiResponse(page, urlPattern, timeout = 10000) {
  return page.waitForResponse(response => 
    response.url().includes(urlPattern) && response.status() === 200,
    { timeout }
  );
}

/**
 * Check if user is logged in
 */
async function isUserLoggedIn(page) {
  try {
    await page.waitForURL(/.*\/(dashboard|portfolio|deposit|withdraw|referrals|staking|rewards|profile)/, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Logout user
 */
async function logoutUser(page) {
  // Look for logout button in various possible locations
  const logoutSelectors = [
    'text=Sign Out',
    'text=Logout',
    'text=Log out',
    '[data-testid="logout"]',
    'button:has-text("Sign Out")',
    'a:has-text("Sign Out")'
  ];
  
  for (const selector of logoutSelectors) {
    if (await elementExists(page, selector)) {
      await clickElement(page, selector);
      await page.waitForURL(/.*\/(login|signup)/, { timeout: 5000 });
      return true;
    }
  }
  
  return false;
}

/**
 * Check for error messages
 */
async function checkForErrors(page) {
  const errorSelectors = [
    'text=Error',
    'text=Failed',
    'text=Invalid',
    '.error',
    '[data-testid="error"]',
    '.alert-error',
    '.toast-error'
  ];
  
  for (const selector of errorSelectors) {
    if (await elementExists(page, selector)) {
      const errorText = await getTextContent(page, selector);
      return errorText;
    }
  }
  
  return null;
}

/**
 * Wait for loading to complete
 */
async function waitForLoading(page, timeout = 10000) {
  // Wait for spinners to disappear
  const spinnerSelectors = [
    '.spinner',
    '.loading',
    '[data-testid="loading"]',
    '.animate-spin'
  ];
  
  for (const selector of spinnerSelectors) {
    try {
      await page.waitForSelector(selector, { state: 'hidden', timeout: 1000 });
    } catch {
      // Spinner might not exist, continue
    }
  }
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Generate test transaction hash
 */
function generateTestTxHash() {
  return '0x' + Math.random().toString(16).substr(2, 64);
}

/**
 * Generate test wallet address
 */
function generateTestWalletAddress() {
  return '0x' + Math.random().toString(16).substr(2, 40);
}

/**
 * Check responsive design
 */
async function testResponsiveDesign(page, viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' }
]) {
  const results = [];
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500);
    
    // Take screenshot
    const screenshot = await takeScreenshot(page, `responsive-${viewport.name}`);
    
    results.push({
      viewport,
      screenshot,
      timestamp: new Date().toISOString()
    });
  }
  
  return results;
}

/**
 * Clean up test data
 */
async function cleanupTestData(page, testData) {
  if (!testData || !testData.cleanup) return;
  
  console.log(`🧹 Cleaning up ${testData.cleanup.length} test items...`);
  
  for (const item of testData.cleanup) {
    try {
      if (item.type === 'user') {
        // Clean up user data
        await page.evaluate(async (email) => {
          if (window.supabase) {
            // Delete user portfolio
            const { data: user } = await window.supabase
              .from('users')
              .select('id')
              .eq('email', email)
              .single();
            
            if (user) {
              await window.supabase
                .from('portfolios')
                .delete()
                .eq('user_id', user.id);
              
              await window.supabase
                .from('users')
                .delete()
                .eq('id', user.id);
            }
          }
        }, item.email);
      }
    } catch (error) {
      console.log(`⚠️ Failed to cleanup ${item.type}: ${error.message}`);
    }
  }
  
  console.log('✅ Cleanup completed');
}

module.exports = {
  generateTestEmail,
  generateTestUser,
  waitForElement,
  waitForText,
  loginUser,
  signUpUser,
  createAndLoginUser,
  navigateToPage,
  takeScreenshot,
  elementExists,
  getTextContent,
  fillField,
  clickElement,
  waitForApiResponse,
  isUserLoggedIn,
  logoutUser,
  checkForErrors,
  waitForLoading,
  generateTestTxHash,
  generateTestWalletAddress,
  testResponsiveDesign,
  cleanupTestData
};

