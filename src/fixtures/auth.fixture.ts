import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

/**
 * Custom fixtures for authentication
 * Provides pre-authenticated page contexts for tests that require login
 * 
 * @example
 * // Use in tests
 * test('dashboard test', async ({ authenticatedPage }) => {
 *   // Page is already logged in
 *   const dashboard = new DashboardPage(authenticatedPage);
 *   await dashboard.assertDashboardDisplayed();
 * });
 */

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

// ========================================
// AUTHENTICATION STATE STORAGE
// ========================================

const STORAGE_STATE_USER = 'test-data/.auth/user.json';
const STORAGE_STATE_ADMIN = 'test-data/.auth/admin.json';

// ========================================
// CUSTOM FIXTURES
// ========================================

export const test = base.extend<AuthFixtures>({
  /**
   * Fixture: authenticatedPage
   * Provides a page that is already logged in as regular test user
   * Uses storage state to persist authentication between tests for better performance
   */
  authenticatedPage: async ({ browser }, use) => {
    // Create a new browser context with authentication
    const context = await browser.newContext();
    const page = await context.newPage();

    // Perform login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    const username = process.env.TEST_USERNAME || 'testuser';
    const password = process.env.TEST_PASSWORD || 'testpass123';
    
    await loginPage.login(username, password);
    
    // Wait for successful login
    await page.waitForURL(/dashboard|home/, { timeout: 10000 });

    // Optional: Save authentication state for reuse
    // Uncomment to enable storage state (faster but may need cleanup)
    // await context.storageState({ path: STORAGE_STATE_USER });

    // Use the authenticated page
    await use(page);

    // Cleanup
    await context.close();
  },

  /**
   * Fixture: adminPage
   * Provides a page that is already logged in as admin user
   */
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Perform admin login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    await loginPage.login(adminUsername, adminPassword);
    
    // Wait for successful login
    await page.waitForURL(/dashboard|admin/, { timeout: 10000 });

    // Use the authenticated admin page
    await use(page);

    // Cleanup
    await context.close();
  },

  /**
   * Fixture: loginPage
   * Provides a LoginPage object instance
   * Useful for login-specific tests
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture: dashboardPage
   * Provides a DashboardPage object instance
   * Note: This doesn't auto-login; use with authenticatedPage if login is needed
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

// ========================================
// HELPER FUNCTIONS FOR SETUP/TEARDOWN
// ========================================

/**
 * Global setup function for authentication
 * Can be used in playwright.config.ts for one-time authentication setup
 */
export async function globalAuthSetup() {
  // This function can be called in global setup
  // to create auth state files before test run
  console.log('Setting up authentication state...');
}

/**
 * Global teardown function for authentication
 * Clean up any authentication-related resources
 */
export async function globalAuthTeardown() {
  console.log('Cleaning up authentication state...');
}

// ========================================
// STORAGE STATE UTILITIES
// ========================================

/**
 * Load authentication state from file
 * @param storageStatePath - Path to storage state file
 */
export async function loadAuthState(storageStatePath: string) {
  const fs = require('fs');
  if (fs.existsSync(storageStatePath)) {
    return JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
  }
  return null;
}

/**
 * Save authentication state to file
 * @param context - Browser context
 * @param storageStatePath - Path to save storage state
 */
export async function saveAuthState(context: any, storageStatePath: string) {
  const fs = require('fs');
  const path = require('path');
  
  // Ensure directory exists
  const dir = path.dirname(storageStatePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  await context.storageState({ path: storageStatePath });
}

// ========================================
// RE-EXPORT
// ========================================

export { expect } from '@playwright/test';
