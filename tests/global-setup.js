// TestSprite Global Setup
// This runs before all tests to set up the testing environment

const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting TestSprite Global Setup for CoinDesk Crypto 5 ETF');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test if the application is accessible
    console.log('📡 Testing application connectivity...');
    
    // Try production URL first
    try {
      await page.goto(config.baseUrl, { timeout: 10000 });
      console.log('✅ Production URL accessible:', config.baseUrl);
    } catch (error) {
      console.log('⚠️ Production URL not accessible, trying local...');
      
      // Try local URL
      try {
        await page.goto(config.localUrl, { timeout: 5000 });
        console.log('✅ Local URL accessible:', config.localUrl);
        // Update baseUrl to local for testing
        config.baseUrl = config.localUrl;
      } catch (localError) {
        console.log('❌ Neither production nor local URL accessible');
        throw new Error('Application not accessible for testing');
      }
    }
    
    // Check if Supabase connection is working
    console.log('🔗 Testing Supabase connection...');
    await page.evaluate(() => {
      if (typeof window !== 'undefined' && window.supabase) {
        console.log('✅ Supabase client available');
        return true;
      } else {
        console.log('❌ Supabase client not available');
        return false;
      }
    });
    
    // Set up test data
    console.log('📊 Setting up test data...');
    global.testData = {
      timestamp: Date.now(),
      testUser: {
        email: `test-${Date.now()}@coindesketf.com`,
        password: 'TestPassword123!',
        fullName: 'Test User',
        referralCode: `TEST${Date.now()}`
      },
      cleanup: []
    };
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
