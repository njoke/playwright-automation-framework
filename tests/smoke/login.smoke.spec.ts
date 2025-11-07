import { test, expect } from '../../src/fixtures/base.fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

/**
 * Login Test Suite - Smoke Tests
 * These are critical tests that verify basic login functionality
 * Tag: @smoke for quick validation of core features
 */

test.describe('Login Functionality - Smoke Tests', () => {
  // This runs before each test in this describe block
  test.beforeEach(async ({ loginPage }) => {
    // Navigate to login page before each test
    await loginPage.goto();
  });

  /**
   * Test: Successful login with valid credentials
   * Priority: Critical
   * Tags: @smoke, @login
   */
  test('@smoke Valid user can login successfully', async ({ loginPage, dashboardPage }) => {
    // Arrange - Get test data
    const credentials = TestDataHelper.getCredentialsFromEnv();

    // Act - Perform login
    await loginPage.login(credentials.username, credentials.password);

    // Assert - Verify login success
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyUserLoggedIn();
  });

  /**
   * Test: Login with invalid credentials shows error
   * Priority: High
   * Tags: @smoke, @login, @negative
   */
  test('@smoke Invalid credentials show error message', async ({ loginPage }) => {
    // Arrange
    const invalidUser = {
      username: 'invalid@qa.com',
      password: 'WrongPassword123',
    };

    // Act
    await loginPage.login(invalidUser.username, invalidUser.password);

    // Assert
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  /**
   * Test: Empty username shows validation error
   * Priority: Medium
   * Tags: @smoke, @login, @validation
   */
  test('@smoke Empty username shows validation error', async ({ loginPage }) => {
    // Act
    await loginPage.enterPassword('Test@123');
    await loginPage.clickLoginButton();

    // Assert
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  /**
   * Test: Empty password shows validation error
   * Priority: Medium
   * Tags: @smoke, @login, @validation
   */
  test('@smoke Empty password shows validation error', async ({ loginPage }) => {
    // Act
    await loginPage.enterUsername('testuser@qa.com');
    await loginPage.clickLoginButton();

    // Assert
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  /**
   * Test: Login page loads with all required elements
   * Priority: High
   * Tags: @smoke, @login, @ui
   */
  test('@smoke Login page loads correctly', async ({ loginPage }) => {
    // Assert - Verify all elements are present
    await loginPage.verifyLoginPageLoaded();
    const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
    expect(isLoginButtonEnabled).toBeTruthy();
  });
});
