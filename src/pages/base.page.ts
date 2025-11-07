import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage class - Parent class for all Page Objects
 * Contains common methods and utilities used across all pages
 * 
 * @example
 * class LoginPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page);
 *   }
 * }
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Navigate to a specific URL
   * @param url - Relative or absolute URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // ========================================
  // ELEMENT INTERACTION METHODS
  // ========================================

  /**
   * Click on an element
   * @param locator - Playwright locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Double click on an element
   * @param locator - Playwright locator
   */
  async doubleClick(locator: Locator): Promise<void> {
    await locator.dblclick();
  }

  /**
   * Right click on an element
   * @param locator - Playwright locator
   */
  async rightClick(locator: Locator): Promise<void> {
    await locator.click({ button: 'right' });
  }

  /**
   * Fill text into an input field
   * @param locator - Playwright locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Type text into an input field with delay
   * @param locator - Playwright locator
   * @param text - Text to type
   * @param delay - Delay between keystrokes in ms
   */
  async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await locator.pressSequentially(text, { delay });
  }

  /**
   * Clear input field
   * @param locator - Playwright locator
   */
  async clear(locator: Locator): Promise<void> {
    await locator.clear();
  }

  /**
   * Select option from dropdown by value
   * @param locator - Playwright locator
   * @param value - Option value
   */
  async selectByValue(locator: Locator, value: string): Promise<void> {
    await locator.selectOption({ value });
  }

  /**
   * Select option from dropdown by label
   * @param locator - Playwright locator
   * @param label - Option label
   */
  async selectByLabel(locator: Locator, label: string): Promise<void> {
    await locator.selectOption({ label });
  }

  /**
   * Check a checkbox or radio button
   * @param locator - Playwright locator
   */
  async check(locator: Locator): Promise<void> {
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   * @param locator - Playwright locator
   */
  async uncheck(locator: Locator): Promise<void> {
    await locator.uncheck();
  }

  /**
   * Hover over an element
   * @param locator - Playwright locator
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Focus on an element
   * @param locator - Playwright locator
   */
  async focus(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Press a key
   * @param key - Key to press (e.g., 'Enter', 'Escape')
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  // ========================================
  // ELEMENT STATE METHODS
  // ========================================

  /**
   * Get text content of an element
   * @param locator - Playwright locator
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  /**
   * Get attribute value of an element
   * @param locator - Playwright locator
   * @param attribute - Attribute name
   */
  async getAttribute(locator: Locator, attribute: string): Promise<string> {
    return (await locator.getAttribute(attribute)) || '';
  }

  /**
   * Get value of an input element
   * @param locator - Playwright locator
   */
  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  /**
   * Check if element is visible
   * @param locator - Playwright locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if element is hidden
   * @param locator - Playwright locator
   */
  async isHidden(locator: Locator): Promise<boolean> {
    return await locator.isHidden();
  }

  /**
   * Check if element is enabled
   * @param locator - Playwright locator
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check if element is disabled
   * @param locator - Playwright locator
   */
  async isDisabled(locator: Locator): Promise<boolean> {
    return await locator.isDisabled();
  }

  /**
   * Check if checkbox or radio is checked
   * @param locator - Playwright locator
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Get count of elements matching locator
   * @param locator - Playwright locator
   */
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // ========================================
  // WAIT METHODS
  // ========================================

  /**
   * Wait for element to be visible
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific timeout
   * @param ms - Milliseconds to wait
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Wait for URL to match pattern
   * @param pattern - URL pattern (string or regex)
   */
  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  // ========================================
  // ASSERTION HELPERS
  // ========================================

  /**
   * Assert element is visible
   * @param locator - Playwright locator
   */
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element is hidden
   * @param locator - Playwright locator
   */
  async assertHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  /**
   * Assert element has text
   * @param locator - Playwright locator
   * @param text - Expected text
   */
  async assertHasText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  /**
   * Assert element contains text
   * @param locator - Playwright locator
   * @param text - Expected text
   */
  async assertContainsText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert element has value
   * @param locator - Playwright locator
   * @param value - Expected value
   */
  async assertHasValue(locator: Locator, value: string | RegExp): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  /**
   * Assert element is enabled
   * @param locator - Playwright locator
   */
  async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert element is disabled
   * @param locator - Playwright locator
   */
  async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert URL matches pattern
   * @param pattern - URL pattern (string or regex)
   */
  async assertUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Assert page title
   * @param title - Expected title (string or regex)
   */
  async assertTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // ========================================
  // SCREENSHOT & DEBUGGING
  // ========================================

  /**
   * Take screenshot of the page
   * @param name - Screenshot filename
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Take screenshot of an element
   * @param locator - Playwright locator
   * @param name - Screenshot filename
   */
  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    await locator.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Pause test execution for debugging
   */
  async pause(): Promise<void> {
    await this.page.pause();
  }

  // ========================================
  // ALERT & DIALOG HANDLING
  // ========================================

  /**
   * Accept browser alert/dialog
   */
  async acceptAlert(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  /**
   * Dismiss browser alert/dialog
   */
  async dismissAlert(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  // ========================================
  // WINDOW & TAB HANDLING
  // ========================================

  /**
   * Get all open pages/tabs
   */
  async getAllPages(): Promise<Page[]> {
    return this.page.context().pages();
  }

  /**
   * Switch to new tab/window
   * @param index - Tab index (0-based)
   */
  async switchToTab(index: number): Promise<Page> {
    const pages = await this.getAllPages();
    return pages[index];
  }

  /**
   * Close current page
   */
  async closePage(): Promise<void> {
    await this.page.close();
  }

  // ========================================
  // SCROLL METHODS
  // ========================================

  /**
   * Scroll to element
   * @param locator - Playwright locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
