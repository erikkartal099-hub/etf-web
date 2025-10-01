// Playwright Configuration for CoinDesk Crypto 5 ETF
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './tests',
  
  // Output directory for test results
  outputDir: './test-results',
  
  // Timeout settings
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  // Retry failed tests
  retries: 2,
  
  // Number of workers
  workers: 3,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Global setup and teardown (disabled for now)
  // globalSetup: './tests/global-setup.js',
  // globalTeardown: './tests/global-teardown.js',
  
  // Browser configuration
  use: {
    // Base URL for tests
    baseURL: 'https://etf-web-mi7p.vercel.app',
    
    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Timeout for actions
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },
  
  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...require('@playwright/test').devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...require('@playwright/test').devices['Desktop Safari'] },
    },
  ],
  
  // Web server configuration (for local testing)
  webServer: {
    command: 'cd frontend && npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
