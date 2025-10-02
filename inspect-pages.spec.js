// Page Inspection Test - Production Ready
const { test, expect } = require('@playwright/test');

test.describe('Page Content Inspection', () => {
  test('inspect signup page content', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app/signup');
    await page.waitForLoadState('networkidle');
    
    // Get page content
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Look for any elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on signup page:', allElements);
    
    // Look for specific elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();
    const forms = await page.locator('form').count();
    const divs = await page.locator('div').count();
    
    console.log('Inputs:', inputs);
    console.log('Buttons:', buttons);
    console.log('Forms:', forms);
    console.log('Divs:', divs);
    
    // Look for text content
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains text:', bodyText ? 'Yes' : 'No');
    console.log('Text length:', bodyText ? bodyText.length : 0);
    
    // Check for specific text
    const hasSignupText = bodyText && bodyText.toLowerCase().includes('signup');
    const hasCreateText = bodyText && bodyText.toLowerCase().includes('create');
    const hasAccountText = bodyText && bodyText.toLowerCase().includes('account');
    
    console.log('Contains "signup":', hasSignupText);
    console.log('Contains "create":', hasCreateText);
    console.log('Contains "account":', hasAccountText);
    
    await page.screenshot({ path: 'test-results/signup-inspection.png', fullPage: true });
  });

  test('inspect login page content', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app/login');
    await page.waitForLoadState('networkidle');
    
    // Get page content
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Look for any elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on login page:', allElements);
    
    // Look for specific elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();
    const forms = await page.locator('form').count();
    const divs = await page.locator('div').count();
    
    console.log('Inputs:', inputs);
    console.log('Buttons:', buttons);
    console.log('Forms:', forms);
    console.log('Divs:', divs);
    
    // Look for text content
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains text:', bodyText ? 'Yes' : 'No');
    console.log('Text length:', bodyText ? bodyText.length : 0);
    
    // Check for specific text
    const hasLoginText = bodyText && bodyText.toLowerCase().includes('login');
    const hasSignInText = bodyText && bodyText.toLowerCase().includes('sign in');
    const hasEmailText = bodyText && bodyText.toLowerCase().includes('email');
    
    console.log('Contains "login":', hasLoginText);
    console.log('Contains "sign in":', hasSignInText);
    console.log('Contains "email":', hasEmailText);
    
    await page.screenshot({ path: 'test-results/login-inspection.png', fullPage: true });
  });

  test('inspect dashboard page content', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Get page content
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Look for any elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on dashboard page:', allElements);
    
    // Look for text content
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains text:', bodyText ? 'Yes' : 'No');
    console.log('Text length:', bodyText ? bodyText.length : 0);
    
    // Check for specific text
    const hasDashboardText = bodyText && bodyText.toLowerCase().includes('dashboard');
    const hasWelcomeText = bodyText && bodyText.toLowerCase().includes('welcome');
    const hasPortfolioText = bodyText && bodyText.toLowerCase().includes('portfolio');
    
    console.log('Contains "dashboard":', hasDashboardText);
    console.log('Contains "welcome":', hasWelcomeText);
    console.log('Contains "portfolio":', hasPortfolioText);
    
    await page.screenshot({ path: 'test-results/dashboard-inspection.png', fullPage: true });
  });
});
