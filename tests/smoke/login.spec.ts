import { test, expect } from '../src/fixtures/auth.fixture';
import { LoginPage } from '../src/pages/login.page';
import { DashboardPage } from '../src/pages/dashboard.page';
import * as testData from '../test-data/users.json';

/**
 * @smoke
 * Login Smoke Tests
 * Critical path tests that must pass before any other tests run
 */

test.describe('Login - Smoke Tests @smoke', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('should display login page elements', async () => {
    // Verify all essential elements are visible
    await loginPage.assertLoginPageDisplayed();
    
    // Additional checks
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Get valid user from test data
    const validUser = testData.validUsers[0];
    
    // Perform login
    await loginPage.fillUsername(validUser.username);
    await loginPage.fillPassword(validUser.password);
    await loginPage.clickLogin();
    
    // Verify successful login
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 10000 });
    
    // Verify dashboard is displayed
    await dashboardPage.assertDashboardDisplayed();
  });

  test('should show error with invalid credentials', async () => {
    // Get invalid user from test data
    const invalidUser = testData.invalidUsers[0];
    
    // Attempt login with invalid credentials
    await loginPage.fillUsername(invalidUser.username);
    await loginPage.fillPassword(invalidUser.password);
    await loginPage.clickLogin();
    
    // Verify error message is displayed
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
    
    // Verify we're still on login page
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should logout successfully', async ({ authenticatedPage }) => {
    // Start with authenticated page
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.goto();
    
    // Verify logged in
    await dashboard.assertDashboardDisplayed();
    
    // Logout
    await dashboard.logout();
    
    // Verify redirected to login
    await expect(authenticatedPage).toHaveURL(/login/);
    
    // Verify login page is displayed
    const login = new LoginPage(authenticatedPage);
    await login.assertLoginPageDisplayed();
  });

  test('should handle empty username validation', async () => {
    // Try to login with empty username
    await loginPage.fillPassword('password123');
    await loginPage.clickLogin();
    
    // Should either show error or button disabled
    const buttonDisabled = await loginPage.isLoginButtonEnabled();
    const errorVisible = await loginPage.isErrorDisplayed();
    
    expect(buttonDisabled === false || errorVisible === true).toBeTruthy();
  });

  test('should handle empty password validation', async () => {
    // Try to login with empty password
    await loginPage.fillUsername('testuser');
    await loginPage.clickLogin();
    
    // Should either show error or button disabled
    const buttonDisabled = await loginPage.isLoginButtonEnabled();
    const errorVisible = await loginPage.isErrorDisplayed();
    
    expect(buttonDisabled === false || errorVisible === true).toBeTruthy();
  });

  test('should allow login with Enter key', async ({ page }) => {
    const validUser = testData.validUsers[0];
    
    // Fill credentials
    await loginPage.fillUsername(validUser.username);
    await loginPage.fillPassword(validUser.password);
    
    // Press Enter
    await loginPage.submitWithEnter();
    
    // Verify successful login
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 10000 });
  });

  test('should clear login form', async () => {
    // Fill form
    await loginPage.fillUsername('testuser');
    await loginPage.fillPassword('password');
    
    // Verify fields have values
    expect(await loginPage.getUsernameValue()).toBeTruthy();
    expect(await loginPage.getPasswordValue()).toBeTruthy();
    
    // Clear form
    await loginPage.clearLoginForm();
    
    // Verify fields are empty
    expect(await loginPage.getUsernameValue()).toBe('');
    expect(await loginPage.getPasswordValue()).toBe('');
  });
});

/**
 * Test hooks and cleanup
 */
test.afterEach(async ({ page }, testInfo) => {
  // Take screenshot on failure
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `test-results/failures/${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true,
    });
  }
});
