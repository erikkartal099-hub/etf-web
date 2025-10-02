// AI Intelligence Test - Advanced Real-time Response Testing
const { test, expect } = require('@playwright/test');

test.describe('AI Intelligence - Advanced Real-time Testing', () => {
  
  test('should test AI chat widget deep interaction', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Find and click chat widget
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    // Look for iframe or external chat service
    const iframes = await page.locator('iframe').count();
    const chatContainers = await page.locator('.chat-container, .chat-widget, .sora-chat, [data-chat]').count();
    
    console.log('Iframes found:', iframes);
    console.log('Chat containers found:', chatContainers);
    
    // Check for external chat service integration
    if (iframes > 0) {
      const iframe = page.locator('iframe').first();
      const src = await iframe.getAttribute('src');
      console.log('Chat iframe source:', src);
      
      // Try to interact with iframe content
      try {
        const iframeContent = await iframe.contentFrame();
        if (iframeContent) {
          console.log('✅ Chat iframe accessible');
          
          // Look for input elements in iframe
          const iframeInputs = await iframeContent.locator('input, textarea, [contenteditable]').count();
          console.log('Inputs in iframe:', iframeInputs);
        }
      } catch (error) {
        console.log('Iframe access restricted:', error.message);
      }
    }
    
    await page.screenshot({ path: 'test-results/ai-deep-interaction-test.png', fullPage: true });
  });

  test('should test AI response intelligence', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Monitor network requests for AI/chat services
    const aiRequests = [];
    const aiResponses = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('openai') || 
          url.includes('anthropic') || 
          url.includes('claude') ||
          url.includes('gpt') ||
          url.includes('ai') ||
          url.includes('chat') ||
          url.includes('sora')) {
        aiRequests.push({
          url: url,
          method: request.method(),
          headers: request.headers()
        });
      }
    });
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('openai') || 
          url.includes('anthropic') || 
          url.includes('claude') ||
          url.includes('gpt') ||
          url.includes('ai') ||
          url.includes('chat') ||
          url.includes('sora')) {
        aiResponses.push({
          url: url,
          status: response.status(),
          headers: response.headers()
        });
      }
    });
    
    // Interact with chat widget
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await chatButton.click();
    await page.waitForTimeout(3000);
    
    // Try to send a message
    const inputs = page.locator('input, textarea, [contenteditable]');
    if (await inputs.count() > 0) {
      const input = inputs.first();
      await input.fill('What is the CoinDesk Crypto 5 ETF?');
      await page.waitForTimeout(1000);
      
      // Look for send button
      const sendButton = page.locator('button:has-text("Send"), button[type="submit"], .send-button');
      if (await sendButton.count() > 0) {
        await sendButton.first().click();
        await page.waitForTimeout(5000); // Wait for AI response
      }
    }
    
    console.log('AI-related requests detected:', aiRequests.length);
    console.log('AI-related responses detected:', aiResponses.length);
    
    // Check for streaming responses
    const streamingResponses = aiResponses.filter(resp => 
      resp.headers['content-type']?.includes('stream') ||
      resp.headers['transfer-encoding'] === 'chunked'
    );
    console.log('Streaming responses detected:', streamingResponses.length);
    
    await page.screenshot({ path: 'test-results/ai-intelligence-response-test.png', fullPage: true });
  });

  test('should test real-time chat performance', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Test chat widget load time
    const chatLoadStart = Date.now();
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await chatButton.click();
    await page.waitForTimeout(2000);
    const chatLoadTime = Date.now() - chatLoadStart;
    
    console.log('Chat widget load time:', chatLoadTime, 'ms');
    
    // Test message sending performance
    const inputs = page.locator('input, textarea, [contenteditable]');
    if (await inputs.count() > 0) {
      const messageStart = Date.now();
      const input = inputs.first();
      await input.fill('Hello, I need help with ETF investments');
      await page.waitForTimeout(500);
      const messageTime = Date.now() - messageStart;
      
      console.log('Message input time:', messageTime, 'ms');
      
      // Look for send button and test send performance
      const sendButton = page.locator('button:has-text("Send"), button[type="submit"], .send-button');
      if (await sendButton.count() > 0) {
        const sendStart = Date.now();
        await sendButton.first().click();
        await page.waitForTimeout(3000);
        const sendTime = Date.now() - sendStart;
        
        console.log('Message send time:', sendTime, 'ms');
      }
    }
    
    await page.screenshot({ path: 'test-results/ai-realtime-performance-test.png', fullPage: true });
  });

  test('should test chat widget error handling', async ({ page }) => {
    // Test with slow network to simulate connection issues
    await page.route('**/*', route => {
      // Simulate slow network for chat requests
      if (route.request().url().includes('chat') || route.request().url().includes('ai')) {
        setTimeout(() => route.continue(), 2000);
      } else {
        route.continue();
      }
    });
    
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await chatButton.click();
    await page.waitForTimeout(5000);
    
    // Check for error messages or fallbacks
    const errorMessages = await page.locator('.error, .error-message, [data-error]').count();
    const loadingIndicators = await page.locator('.loading, .spinner, [data-loading]').count();
    
    console.log('Error messages found:', errorMessages);
    console.log('Loading indicators found:', loadingIndicators);
    
    await page.screenshot({ path: 'test-results/ai-error-handling-test.png', fullPage: true });
  });

  test('should test chat widget accessibility and usability', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    const isFocused = await chatButton.evaluate(el => el === document.activeElement);
    
    if (!isFocused) {
      // Try multiple tabs to find chat button
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        const focused = await chatButton.evaluate(el => el === document.activeElement);
        if (focused) break;
      }
    }
    
    console.log('Chat button keyboard accessible:', isFocused);
    
    // Test screen reader compatibility
    const ariaLabel = await chatButton.getAttribute('aria-label');
    const ariaDescribedBy = await chatButton.getAttribute('aria-describedby');
    const role = await chatButton.getAttribute('role');
    
    console.log('Chat button aria-label:', ariaLabel);
    console.log('Chat button aria-describedby:', ariaDescribedBy);
    console.log('Chat button role:', role);
    
    // Test with Enter key
    if (isFocused) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      
      // Check if chat opened
      const chatOpen = await page.locator('[role="dialog"], .chat-container, iframe').count() > 0;
      console.log('Chat opened with keyboard:', chatOpen);
    }
    
    await page.screenshot({ path: 'test-results/ai-accessibility-test.png', fullPage: true });
  });

  test('should test chat widget integration with main app', async ({ page }) => {
    await page.goto('https://etf-web-mi7p.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Test chat widget doesn't interfere with main app functionality
    const navigationLinks = page.locator('a[href]');
    const navCount = await navigationLinks.count();
    console.log('Navigation links available:', navCount);
    
    // Open chat
    const chatButton = page.locator('button:has-text("Chat with Sora")');
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    // Test that main navigation still works
    const navStillWorking = await navigationLinks.count() === navCount;
    console.log('Navigation still functional with chat open:', navStillWorking);
    
    // Test page scrolling with chat open
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    console.log('Page scrolling works with chat open:', scrollPosition > 0);
    
    await page.screenshot({ path: 'test-results/ai-integration-test.png', fullPage: true });
  });
});
