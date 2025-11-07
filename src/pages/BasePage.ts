import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage class contains common methods that will be inherited by all page objects
 * This follows the DRY (Don't Repeat Yourself) principle
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to (can be relative or absolute)
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element with optional force click
   * @param locator - The element locator
   * @param force - Whether to force the click
   */
  async click(locator: Locator, force = false): Promise<void> {
    await locator.click({ force });
  }

  /**
   * Fill input field
   * @param locator - The input field locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Type text with delay (useful for simulating real user typing)
   * @param locator - The input field locator
   * @param text - Text to type
   * @param delay - Delay between keystrokes in milliseconds
   */
  async type(locator: Locator, text: string, delay = 100): Promise<void> {
    await locator.type(text, { delay });
  }

  /**
   * Get text content of an element
   * @param locator - The element locator
   * @returns The text content
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  /**
   * Check if element is visible
   * @param locator - The element locator
   * @returns True if visible, false otherwise
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if element is enabled
   * @param locator - The element locator
   * @returns True if enabled, false otherwise
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Take a screenshot
   * @param fileName - Name of the screenshot file
   */
  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${fileName}.png`,
      fullPage: true,
    });
  }

  /**
   * Wait for a specific amount of time (use sparingly!)
   * @param milliseconds - Time to wait in milliseconds
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Scroll to an element
   * @param locator - The element locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get current URL
   * @returns Current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Press a keyboard key
   * @param key - The key to press
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Hover over an element
   * @param locator - The element locator
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Select option from dropdown
   * @param locator - The select element locator
   * @param value - The value to select
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Check or uncheck a checkbox
   * @param locator - The checkbox locator
   * @param checked - True to check, false to uncheck
   */
  async setCheckbox(locator: Locator, checked: boolean): Promise<void> {
    if (checked) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  }

  /**
   * Get attribute value of an element
   * @param locator - The element locator
   * @param attributeName - Name of the attribute
   * @returns The attribute value
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * Verify element text contains expected text
   * @param locator - The element locator
   * @param expectedText - Expected text to be contained
   */
  async verifyTextContains(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Verify element is visible
   * @param locator - The element locator
   */
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Verify page title
   * @param expectedTitle - Expected page title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify current URL contains expected text
   * @param expectedUrlPart - Expected URL part
   */
  async verifyUrlContains(expectedUrlPart: string): Promise<void> {
    expect(this.page.url()).toContain(expectedUrlPart);
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}
