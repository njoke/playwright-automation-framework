import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage class represents the login page of the QA Portal
 * It contains all elements and actions related to the login functionality
 */
export class LoginPage extends BasePage {
  // Page URL
  private readonly loginUrl = '/login';

  // Locators - Define all elements on the login page
  // Using data-testid is recommended for stable selectors
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginTitle: Locator;

  /**
   * Constructor initializes all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);

    // Initialize locators
    // Note: Adjust these selectors based on your actual application
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me-checkbox"]');
    this.loginTitle = page.locator('h1, h2').filter({ hasText: 'Login' });

    // Alternative selectors (if data-testid is not available)
    // this.usernameInput = page.locator('input[name="username"]');
    // this.passwordInput = page.locator('input[name="password"]');
    // this.loginButton = page.locator('button[type="submit"]');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigate(this.loginUrl);
    await this.waitForPageLoad();
  }

  /**
   * Perform login with username and password
   * @param username - User's username
   * @param password - User's password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Fill username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Fill password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Check or uncheck "Remember Me" checkbox
   * @param check - True to check, false to uncheck
   */
  async toggleRememberMe(check: boolean): Promise<void> {
    await this.setCheckbox(this.rememberMeCheckbox, check);
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Get success message text
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return await this.getText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if login button is enabled
   * @returns True if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.loginTitle);
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }

  /**
   * Verify login was successful (checks URL change)
   * @param expectedUrl - Expected URL after successful login
   */
  async verifyLoginSuccess(expectedUrl: string): Promise<void> {
    await this.waitForPageLoad();
    await this.verifyUrlContains(expectedUrl);
  }

  /**
   * Verify error message is displayed
   * @param expectedError - Expected error message text
   */
  async verifyErrorMessage(expectedError: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyTextContains(this.errorMessage, expectedError);
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Perform complete login flow and wait for navigation
   * @param username - User's username
   * @param password - User's password
   */
  async loginAndWait(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.waitForPageLoad();
  }
}
