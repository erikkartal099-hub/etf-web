// Real Application Test - Production Ready
const { test, expect } = require('@playwright/test');

test.describe('Real Application Testing', () => {
  test('check root page', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    console.log('Root page title:', await page.title());
    console.log('Root page URL:', page.url());
    
    const bodyText = await page.locator('body').textContent();
    console.log('Root page text length:', bodyText ? bodyText.length : 0);
    
    // Check if it's a React app
    const hasReact = bodyText && bodyText.includes('React');
    console.log('Contains React:', hasReact);
    
    // Check for common app elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on root page:', allElements);
    
    await page.screenshot({ path: 'test-results/root-page.png', fullPage: true });
  });

  test('test navigation and routing', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Look for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], a[href]').count();
    console.log('Navigation elements found:', navElements);
    
    // Look for links
    const links = await page.locator('a').count();
    console.log('Links found:', links);
    
    // Try clicking on any links found
    const linkElements = page.locator('a');
    const linkCount = await linkElements.count();
    
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = linkElements.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`Link ${i + 1}: "${text}" -> "${href}"`);
      }
    }
    
    await page.screenshot({ path: 'test-results/navigation-test.png', fullPage: true });
  });

  test('test form functionality', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Look for any interactive elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();
    const forms = await page.locator('form').count();
    
    console.log('Inputs found:', inputs);
    console.log('Buttons found:', buttons);
    console.log('Forms found:', forms);
    
    // Try to interact with any found elements
    if (inputs > 0) {
      console.log('Testing input interaction...');
      const firstInput = page.locator('input').first();
      await firstInput.fill('test@example.com');
      await page.waitForTimeout(1000);
    }
    
    if (buttons > 0) {
      console.log('Testing button interaction...');
      const firstButton = page.locator('button').first();
      const buttonText = await firstButton.textContent();
      console.log('First button text:', buttonText);
    }
    
    await page.screenshot({ path: 'test-results/form-test.png', fullPage: true });
  });

  test('test responsive design', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('https://etf-web-mi7p.vercel.app');
      await page.waitForLoadState('networkidle');
      
      console.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      const elements = await page.locator('*').count();
      console.log(`Elements in ${viewport.name}:`, elements);
      
      await page.screenshot({ 
        path: `test-results/${viewport.name}-viewport.png`, 
        fullPage: true 
      });
    }
  });

  test('test API connectivity', async ({ page }) => {
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });
    
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForTimeout(5000);
    
    console.log('Total requests made:', requests.length);
    console.log('Total responses received:', responses.length);
    
    // Check for API calls
    const apiRequests = requests.filter(req => 
      req.url.includes('api') || 
      req.url.includes('supabase') ||
      req.url.includes('coingecko')
    );
    
    console.log('API requests found:', apiRequests.length);
    
    // Check response statuses
    const errorResponses = responses.filter(resp => resp.status >= 400);
    console.log('Error responses:', errorResponses.length);
    
    await page.screenshot({ path: 'test-results/api-test.png', fullPage: true });
  });
});
