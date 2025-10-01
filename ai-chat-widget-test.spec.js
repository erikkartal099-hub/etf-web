// AI Chat Widget Test - Real-time Response Testing
const { test, expect } = require('@playwright/test');

test.describe('AI Chat Widget - Real-time Intelligence Testing', () => {
  
  test('should find and interact with AI chat widget', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Look for chat widget button
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await expect(chatButton).toBeVisible();
    
    console.log('✅ AI Chat widget found');
    
    // Click the chat button
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    // Check if chat interface opens
    const chatInterface = page.locator('[role="dialog"], .chat-widget, .chat-container, iframe');
    const chatVisible = await chatInterface.count() > 0;
    
    console.log('Chat interface opened:', chatVisible);
    
    await page.screenshot({ path: 'test-results/ai-chat-widget-test.png', fullPage: true });
  });

  test('should test chat widget responsiveness', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Test on different viewports
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const chatButton = page.locator('button:has-text("Chat with Sora")');
      const isVisible = await chatButton.isVisible();
      
      console.log(`Chat widget visible on ${viewport.name}:`, isVisible);
      
      if (isVisible) {
        await chatButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: `test-results/ai-chat-${viewport.name}.png`, 
          fullPage: true 
        });
      }
    }
  });

  test('should test chat widget network connectivity', async ({ page }) => {
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      if (request.url().includes('chat') || 
          request.url().includes('ai') || 
          request.url().includes('sora') ||
          request.url().includes('widget')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('chat') || 
          response.url().includes('ai') || 
          response.url().includes('sora') ||
          response.url().includes('widget')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
      }
    });
    
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Click chat widget
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    if (await chatButton.count() > 0) {
      await chatButton.click();
      await page.waitForTimeout(3000);
    }
    
    console.log('Chat-related requests:', requests.length);
    console.log('Chat-related responses:', responses.length);
    
    // Check for successful API calls
    const successfulResponses = responses.filter(resp => resp.status < 400);
    console.log('Successful chat responses:', successfulResponses.length);
    
    await page.screenshot({ path: 'test-results/ai-chat-network-test.png', fullPage: true });
  });

  test('should test chat widget real-time functionality', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Look for chat widget
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    
    if (await chatButton.count() > 0) {
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Look for chat input or message area
      const chatInputs = await page.locator('input[type="text"], textarea, [contenteditable="true"]').count();
      const messageAreas = await page.locator('.message, .chat-message, .conversation').count();
      
      console.log('Chat inputs found:', chatInputs);
      console.log('Message areas found:', messageAreas);
      
      // Test typing simulation if input is available
      if (chatInputs > 0) {
        const input = page.locator('input[type="text"], textarea, [contenteditable="true"]').first();
        await input.fill('Hello, can you help me with ETF information?');
        await page.waitForTimeout(1000);
        
        // Look for send button
        const sendButtons = await page.locator('button:has-text("Send"), button[type="submit"], .send-button').count();
        console.log('Send buttons found:', sendButtons);
        
        if (sendButtons > 0) {
          await page.locator('button:has-text("Send"), button[type="submit"], .send-button').first().click();
          await page.waitForTimeout(3000); // Wait for potential response
        }
      }
    }
    
    await page.screenshot({ path: 'test-results/ai-chat-realtime-test.png', fullPage: true });
  });

  test('should verify chat widget accessibility', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Check for chat widget accessibility
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    
    if (await chatButton.count() > 0) {
      // Check aria-label or accessibility attributes
      const ariaLabel = await chatButton.getAttribute('aria-label');
      const role = await chatButton.getAttribute('role');
      const title = await chatButton.getAttribute('title');
      
      console.log('Chat button aria-label:', ariaLabel);
      console.log('Chat button role:', role);
      console.log('Chat button title:', title);
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      
      const isFocused = await chatButton.evaluate(el => el === document.activeElement);
      console.log('Chat button focusable:', isFocused);
      
      if (isFocused) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
      }
    }
    
    await page.screenshot({ path: 'test-results/ai-chat-accessibility-test.png', fullPage: true });
  });

  test('should test chat widget performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log('Initial page load time:', loadTime, 'ms');
    
    // Test chat widget interaction performance
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    
    if (await chatButton.count() > 0) {
      const interactionStart = Date.now();
      await chatButton.click();
      await page.waitForTimeout(1000);
      const interactionTime = Date.now() - interactionStart;
      
      console.log('Chat widget interaction time:', interactionTime, 'ms');
      
      // Check for any performance issues
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(2000);
      console.log('Console errors during chat interaction:', errors.length);
    }
    
    await page.screenshot({ path: 'test-results/ai-chat-performance-test.png', fullPage: true });
  });
});
