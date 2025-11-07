import { test, expect } from '../../src/fixtures/base.fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

/**
 * End-to-End Test Suite
 * These tests cover complete user journeys from login to logout
 * Tag: @e2e for comprehensive flow testing
 */

test.describe('E2E User Journey Tests', () => {
  /**
   * Test: Complete user login to logout journey
   * Priority: Critical
   * Tags: @e2e, @regression
   */
  test('@regression @e2e User can login, navigate dashboard, and logout', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Step 1: Navigate to login page
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();

    // Step 2: Login with valid credentials
    const credentials = TestDataHelper.getCredentialsFromEnv();
    await loginPage.login(credentials.username, credentials.password);

    // Step 3: Verify dashboard is loaded
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyUserLoggedIn();

    // Step 4: Verify welcome message (optional - adjust based on your app)
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();

    // Step 5: Logout
    await dashboardPage.logout();

    // Step 6: Verify redirect to login page
    await loginPage.verifyLoginPageLoaded();
  });

  /**
   * Test: User can navigate between different sections
   * Priority: High
   * Tags: @e2e, @regression, @navigation
   */
  test('@regression @e2e User can navigate between sections', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Login first
    await loginPage.goto();
    const credentials = TestDataHelper.getCredentialsFromEnv();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.verifyDashboardLoaded();

    // Navigate to different sections
    // Note: Adjust these based on your actual application sections
    await dashboardPage.navigateToSection('profile');
    await dashboardPage.waitForPageLoad();
    expect(dashboardPage.getCurrentUrl()).toContain('profile');

    await dashboardPage.navigateToSection('settings');
    await dashboardPage.waitForPageLoad();
    expect(dashboardPage.getCurrentUrl()).toContain('settings');

    await dashboardPage.navigateToSection('home');
    await dashboardPage.waitForPageLoad();
  });

  /**
   * Test: Search functionality works correctly
   * Priority: Medium
   * Tags: @e2e, @regression, @search
   */
  test('@regression @e2e User can perform search', async ({ loginPage, dashboardPage }) => {
    // Login
    await loginPage.goto();
    const credentials = TestDataHelper.getCredentialsFromEnv();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.verifyDashboardLoaded();

    // Perform search
    const searchTerm = 'test query';
    await dashboardPage.search(searchTerm);

    // Verify search was performed (URL should contain search parameter)
    // Adjust this assertion based on your application's behavior
    await dashboardPage.waitForPageLoad();
  });
});

/**
 * Data-Driven Login Tests
 * Demonstrates how to run the same test with multiple data sets
 */
test.describe('Data-Driven Login Tests', () => {
  // Get test data from JSON file
  const invalidUsers = TestDataHelper.getInvalidUsers();

  // Run test for each invalid user
  invalidUsers.forEach((user: any) => {
    test(`@regression Login fails for user: ${user.username || 'empty'}`, async ({
      loginPage,
    }) => {
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      // Verify error message is shown
      const isErrorVisible = await loginPage.isErrorMessageVisible();
      expect(isErrorVisible).toBeTruthy();
    });
  });
});

/**
 * Session Management Tests
 * Tests related to session handling and "Remember Me" functionality
 */
test.describe('Session Management', () => {
  /**
   * Test: Remember Me checkbox functionality
   * Priority: Medium
   * Tags: @regression
   */
  test('@regression Remember Me checkbox can be toggled', async ({ loginPage }) => {
    await loginPage.goto();

    // Toggle Remember Me on
    await loginPage.toggleRememberMe(true);

    // Toggle Remember Me off
    await loginPage.toggleRememberMe(false);

    // This test verifies the checkbox can be interacted with
    // Additional assertions can be added to verify persistence
  });
});
