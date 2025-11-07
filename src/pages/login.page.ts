import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage - Page Object for the Login page
 * Handles all login-related interactions
 * 
 * @example
 * const loginPage = new LoginPage(page);
 * await loginPage.goto();
 * await loginPage.login('username', 'password');
 */
export class LoginPage extends BasePage {
  // Page URL
  readonly url = '/login';

  // Locators - Using data-testid for stability (recommended practice)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly pageTitle: Locator;
  readonly logo: Locator;
  readonly showPasswordButton: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    // Using multiple strategies: data-testid (preferred), then fallback to other selectors
    this.usernameInput = this.page.locator('[data-testid="username-input"]')
      .or(this.page.locator('input[name="username"]'))
      .or(this.page.locator('#username'));

    this.passwordInput = this.page.locator('[data-testid="password-input"]')
      .or(this.page.locator('input[name="password"]'))
      .or(this.page.locator('#password'));

    this.loginButton = this.page.locator('[data-testid="login-button"]')
      .or(this.page.locator('button[type="submit"]'))
      .or(this.page.getByRole('button', { name: /login|sign in/i }));

    this.rememberMeCheckbox = this.page.locator('[data-testid="remember-checkbox"]')
      .or(this.page.locator('input[type="checkbox"]'));

    //this.forgotPasswordLink = this.page.locator('[data-testid="forgot-password"]')
     // .or(this.page.getByText(/forgot password/i));

    this.errorMessage = this.page.locator('[data-testid="error-message"]')
      .or(this.page.locator('.error-message'))
      .or(this.page.locator('.alert-error'));

    this.successMessage = this.page.locator('[data-testid="success-message"]')
      .or(this.page.locator('.success-message'))
      .or(this.page.locator('.alert-success'));

    this.pageTitle = this.page.locator('h1, h2')
      .or(this.page.locator('[data-testid="page-title"]'));

    this.logo = this.page.locator('[data-testid="logo"]')
      .or(this.page.locator('.logo'));

    this.showPasswordButton = this.page.locator('[data-testid="show-password"]')
      .or(this.page.locator('button[aria-label="Show password"]'));

    this.signUpLink = this.page.locator('[data-testid="signup-link"]')
      .or(this.page.getByText(/sign up|register/i));
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
    await this.waitForPageLoad();
  }

  // ========================================
  // LOGIN ACTIONS
  // ========================================

  /**
   * Fill username field
   * @param username - Username to enter
   */
  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Fill password field
   * @param password - Password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Complete login with username and password
   * @param username - Username
   * @param password - Password
   * @param rememberMe - Check remember me checkbox (optional)
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.check(this.rememberMeCheckbox);
    }
    
    await this.clickLogin();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Quick login method using environment variables
   * Useful for tests that need to be logged in as precondition
   */
  async quickLogin(): Promise<void> {
    const username = process.env.TEST_USERNAME || 'testuser';
    const password = process.env.TEST_PASSWORD || 'testpass123';
    await this.login(username, password);
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(): Promise<void> {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    await this.login(adminUsername, adminPassword);
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.click(this.showPasswordButton);
  }

  /**
   * Check "Remember Me" checkbox
   */
  async checkRememberMe(): Promise<void> {
    await this.check(this.rememberMeCheckbox);
  }

  /**
   * Click "Forgot Password" link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click "Sign Up" link
   */
  async clickSignUp(): Promise<void> {
    await this.click(this.signUpLink);
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.usernameInput) && 
           await this.isVisible(this.passwordInput) &&
           await this.isVisible(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForVisible(this.successMessage);
    return await this.getText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  /**
   * Check if username field has value
   */
  async getUsernameValue(): Promise<string> {
    return await this.getValue(this.usernameInput);
  }

  /**
   * Check if password field has value
   */
  async getPasswordValue(): Promise<string> {
    return await this.getValue(this.passwordInput);
  }

  /**
   * Check if Remember Me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.isChecked(this.rememberMeCheckbox);
  }

  // ========================================
  // ASSERTION METHODS (For cleaner tests)
  // ========================================

  /**
   * Assert login page is displayed
   */
  async assertLoginPageDisplayed(): Promise<void> {
    await this.assertVisible(this.usernameInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.loginButton);
  }

  /**
   * Assert error message is displayed
   * @param expectedMessage - Expected error message (optional)
   */
  async assertErrorDisplayed(expectedMessage?: string | RegExp): Promise<void> {
    await this.assertVisible(this.errorMessage);
    if (expectedMessage) {
      await this.assertHasText(this.errorMessage, expectedMessage);
    }
  }

  /**
   * Assert login button is disabled
   */
  async assertLoginButtonDisabled(): Promise<void> {
    await this.assertDisabled(this.loginButton);
  }

  /**
   * Assert successful navigation after login
   * @param expectedUrl - Expected URL pattern after login
   */
  async assertLoginSuccessful(expectedUrl: string | RegExp = /dashboard|home/): Promise<void> {
    await this.assertUrl(expectedUrl);
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.clear(this.usernameInput);
    await this.clear(this.passwordInput);
  }

  /**
   * Submit form using Enter key
   */
  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  /**
   * Wait for login button to be clickable
   */
  async waitForLoginButton(): Promise<void> {
    await this.waitForVisible(this.loginButton);
    await this.assertEnabled(this.loginButton);
  }

  /**
   * Get all validation errors (if multiple errors exist)
   */
  async getAllErrors(): Promise<string[]> {
    const errorElements = await this.page.locator('.error, .error-message, [role="alert"]').all();
    return Promise.all(errorElements.map(async (el) => (await el.textContent()) || ''));
  }
}
