// TestSprite Global Teardown
// This runs after all tests to clean up the testing environment

async function globalTeardown(config) {
  console.log('🧹 Starting TestSprite Global Teardown');
  
  try {
    // Clean up test data if needed
    if (global.testData && global.testData.cleanup.length > 0) {
      console.log('🗑️ Cleaning up test data...');
      
      // Here you could add cleanup logic for test users, transactions, etc.
      // For now, we'll just log what would be cleaned up
      console.log(`📋 Cleanup items: ${global.testData.cleanup.length}`);
      
      // In a real scenario, you might:
      // - Delete test users from Supabase
      // - Clean up test transactions
      // - Remove test portfolios
      // - Clear test notifications
    }
    
    // Generate test summary
    console.log('📊 Test Summary:');
    console.log(`⏰ Test run completed at: ${new Date().toISOString()}`);
    console.log(`🔧 Test environment: ${config.baseUrl}`);
    
    if (global.testData) {
      console.log(`👤 Test user created: ${global.testData.testUser.email}`);
    }
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

module.exports = globalTeardown;
