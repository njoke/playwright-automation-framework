import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TestDataHelper } from '../utils/TestDataHelper';

/**
 * Custom fixtures extend Playwright's test object with additional functionality
 * This makes tests cleaner and more maintainable
 */

// Define the types for our fixtures
type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page; // Page object with user already logged in
};

/**
 * Extend the base test with custom fixtures
 */
export const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture - automatically creates a LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * DashboardPage fixture - automatically creates a DashboardPage instance
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  /**
   * AuthenticatedPage fixture - provides a page with user already logged in
   * This is useful for tests that don't need to test the login functionality
   * and want to start from a logged-in state
   */
  authenticatedPage: async ({ page }, use) => {
    // Get credentials from environment or test data
    const credentials = TestDataHelper.getCredentialsFromEnv();

    // Navigate to login page and perform login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.waitForPageLoad();

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test completes
    // This ensures clean state for next test
    try {
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.logout();
    } catch (error) {
      // Ignore logout errors (user might have already logged out)
      console.log('Logout cleanup skipped or failed');
    }
  },
});

/**
 * Export expect from Playwright test
 */
export { expect } from '@playwright/test';
