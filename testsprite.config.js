// TestSprite Configuration for CoinDesk Crypto 5 ETF
// This configuration sets up comprehensive testing for the investment platform

module.exports = {
  // Test environment configuration
  testEnvironment: 'web',
  
  // Base URL for testing
  baseUrl: 'https://etf-web-mi7p.vercel.app',
  
  // Local development URL (fallback)
  localUrl: 'http://localhost:5173',
  
  // Test timeout settings
  timeout: 30000, // 30 seconds
  pageTimeout: 10000, // 10 seconds
  
  // Browser configuration
  browsers: ['chromium', 'firefox', 'webkit'],
  
  // Test directories
  testDir: './tests',
  outputDir: './test-results',
  
  // Screenshot and video settings
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  
  // Test data configuration
  testData: {
    // Test user credentials
    testUser: {
      email: 'test@coindesketf.com',
      password: 'TestPassword123!',
      fullName: 'Test User',
      referralCode: 'TEST123'
    },
    
    // Test crypto data
    testCrypto: {
      eth: { amount: '0.1', expectedValue: 200 },
      btc: { amount: '0.01', expectedValue: 400 }
    },
    
    // Test referral data
    testReferral: {
      referrerCode: 'REF123',
      referredEmail: 'referred@test.com'
    }
  },
  
  // Environment variables for testing
  env: {
    VITE_SUPABASE_URL: 'https://vovlsbesaapezkfggdba.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U'
  },
  
  // Test suites configuration
  suites: {
    smoke: {
      description: 'Smoke tests for critical functionality',
      tests: ['auth.spec.js', 'signup.spec.js', 'dashboard.spec.js']
    },
    
    regression: {
      description: 'Full regression test suite',
      tests: ['**/*.spec.js']
    },
    
    api: {
      description: 'API and backend testing',
      tests: ['api/**/*.spec.js']
    },
    
    e2e: {
      description: 'End-to-end user journeys',
      tests: ['e2e/**/*.spec.js']
    }
  },
  
  // Retry configuration
  retries: 2,
  
  // Parallel execution
  workers: 3,
  
  // Global setup and teardown
  globalSetup: './tests/global-setup.js',
  globalTeardown: './tests/global-teardown.js',
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Test execution settings
  expect: {
    timeout: 5000,
    toHaveScreenshot: { threshold: 0.2 }
  },
  
  // Web server configuration (for local testing)
  webServer: {
    command: 'cd frontend && npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
};
