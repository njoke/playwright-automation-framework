import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Playwright Test Configuration
 * This file contains all the configuration for running tests
 * Read more: https://playwright.dev/docs/test-configuration
 */

// Load environment variables from .env file
dotenv.config();

// Get base URL from environment or use default localhost
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run for (30 seconds)
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only is left in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 2 : 3, // Number of parallel workers

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'], // Console output
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'reports/allure-results',
        suiteTitle: true,
        categories: [
          {
            name: 'Smoke Tests',
            matchedStatuses: ['passed', 'failed']
          },
          {
            name: 'Regression Tests',
            matchedStatuses: ['passed', 'failed']
          }
        ],
        environmentInfo: {
          framework: 'Playwright',
          language: 'TypeScript',
          node_version: process.version,
          os: process.platform
        }
      }
    ]
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: BASE_URL,

    // Browser settings
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Context options
    contextOptions: {
      permissions: []
    }
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  // Output folders
  outputDir: 'test-results/',

  // Global setup/teardown
  // globalSetup: require.resolve('./config/global-setup.ts'),
  // globalTeardown: require.resolve('./config/global-teardown.ts'),

  // Web Server (if you want Playwright to start your app)
  // Uncomment if you want Playwright to automatically start the QA Portal
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
