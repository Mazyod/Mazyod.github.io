/**
 * Playwright Configuration for Cross-Browser Testing
 * Tests the blog across Chrome, Firefox, Safari, and Edge
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './tests/browser',
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Maximum time expect() should wait for the condition to be met
  expect: {
    timeout: 5000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like await page.goto('/')
    baseURL: 'http://localhost:8000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot after each test failure
    screenshot: 'only-on-failure',
    
    // Record video only when retrying a test for the first time
    video: 'retain-on-failure',
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Test modern Chrome features
        contextOptions: {
          // Enable modern JS features
          hasTouch: false,
        }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Test Firefox-specific behaviors
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Test Safari-specific behaviors and WebKit engine
      },
    },
    
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        // Test Edge-specific behaviors
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
    
    // Legacy browser simulation
    {
      name: 'legacy-ie11',
      use: {
        ...devices['Desktop Chrome'],
        // Simulate IE11 limitations
        javaScriptEnabled: true,
        contextOptions: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
        }
      },
    },
    
    // High contrast mode testing
    {
      name: 'high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        contextOptions: {
          forcedColors: 'active',
        }
      },
    },
    
    // Reduced motion testing
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          reducedMotion: 'reduce',
        }
      },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: {
    command: 'uv run invoke livereload',
    port: 8000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});