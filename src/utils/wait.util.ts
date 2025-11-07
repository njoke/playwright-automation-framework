import { Page, Locator, expect } from '@playwright/test';

/**
 * WaitUtil - Utility class for custom wait conditions
 * Provides advanced waiting strategies beyond Playwright's built-in waits
 * 
 * @example
 * await WaitUtil.waitForElementToDisappear(page, locator);
 * await WaitUtil.waitForTextToChange(locator, 'Loading...');
 */
export class WaitUtil {
  // Default timeout in milliseconds
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly POLL_INTERVAL = 500;

  // ========================================
  // ELEMENT VISIBILITY WAITS
  // ========================================

  /**
   * Wait for element to disappear/be removed from DOM
   * @param page - Playwright page
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementToDisappear(
    page: Page,
    locator: Locator,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Wait for element to be visible and enabled
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementToBeClickable(
    locator: Locator,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Wait for element to be stable (not animating)
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementToBeStable(
    locator: Locator,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    // Wait for element to be stable by checking it's in stable position
    await locator.waitFor({ state: 'visible', timeout });
    await locator.evaluate((el) => {
      return new Promise<void>((resolve) => {
        // Wait for animations to complete
        const animations = el.getAnimations();
        Promise.all(animations.map((anim) => anim.finished))
          .then(() => resolve())
          .catch(() => resolve());
      });
    });
  }

  // ========================================
  // TEXT CONTENT WAITS
  // ========================================

  /**
   * Wait for element text to change from a specific value
   * @param locator - Element locator
   * @param initialText - Initial text to wait to change from
   * @param timeout - Timeout in milliseconds
   */
  static async waitForTextToChange(
    locator: Locator,
    initialText: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const currentText = await locator.textContent();
      if (currentText !== initialText) {
        return;
      }
      await this.sleep(this.POLL_INTERVAL);
    }
    
    throw new Error(`Text did not change from "${initialText}" within ${timeout}ms`);
  }

  /**
   * Wait for element to contain specific text
   * @param locator - Element locator
   * @param text - Text to wait for
   * @param timeout - Timeout in milliseconds
   */
  static async waitForTextToContain(
    locator: Locator,
    text: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toContainText(text, { timeout });
  }

  /**
   * Wait for element text to not be empty
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForTextToAppear(
    locator: Locator,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const text = await locator.textContent();
      if (text && text.trim().length > 0) {
        return;
      }
      await this.sleep(this.POLL_INTERVAL);
    }
    
    throw new Error(`Text did not appear within ${timeout}ms`);
  }

  // ========================================
  // COUNT/QUANTITY WAITS
  // ========================================

  /**
   * Wait for element count to be a specific number
   * @param locator - Element locator
   * @param expectedCount - Expected count
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementCount(
    locator: Locator,
    expectedCount: number,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count === expectedCount) {
        return;
      }
      await this.sleep(this.POLL_INTERVAL);
    }
    
    const actualCount = await locator.count();
    throw new Error(
      `Expected ${expectedCount} elements, but found ${actualCount} within ${timeout}ms`
    );
  }

  /**
   * Wait for at least N elements to appear
   * @param locator - Element locator
   * @param minCount - Minimum expected count
   * @param timeout - Timeout in milliseconds
   */
  static async waitForMinimumElementCount(
    locator: Locator,
    minCount: number,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count >= minCount) {
        return;
      }
      await this.sleep(this.POLL_INTERVAL);
    }
    
    const actualCount = await locator.count();
    throw new Error(
      `Expected at least ${minCount} elements, but found ${actualCount} within ${timeout}ms`
    );
  }

  // ========================================
  // ATTRIBUTE WAITS
  // ========================================

  /**
   * Wait for element attribute to have specific value
   * @param locator - Element locator
   * @param attribute - Attribute name
   * @param value - Expected value
   * @param timeout - Timeout in milliseconds
   */
  static async waitForAttributeValue(
    locator: Locator,
    attribute: string,
    value: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value, { timeout });
  }

  /**
   * Wait for element class to contain specific value
   * @param locator - Element locator
   * @param className - Class name to wait for
   * @param timeout - Timeout in milliseconds
   */
  static async waitForClass(
    locator: Locator,
    className: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await expect(locator).toHaveClass(new RegExp(className), { timeout });
  }

  // ========================================
  // PAGE STATE WAITS
  // ========================================

  /**
   * Wait for page URL to match pattern
   * @param page - Playwright page
   * @param pattern - URL pattern (string or regex)
   * @param timeout - Timeout in milliseconds
   */
  static async waitForURL(
    page: Page,
    pattern: string | RegExp,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await page.waitForURL(pattern, { timeout });
  }

  /**
   * Wait for page to be fully loaded
   * @param page - Playwright page
   * @param timeout - Timeout in milliseconds
   */
  static async waitForPageLoad(
    page: Page,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for all network requests to complete
   * @param page - Playwright page
   * @param timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(
    page: Page,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  // ========================================
  // CONDITION-BASED WAITS
  // ========================================

  /**
   * Wait for a custom condition to be true
   * @param condition - Function that returns boolean
   * @param timeout - Timeout in milliseconds
   * @param errorMessage - Custom error message
   */
  static async waitForCondition(
    condition: () => Promise<boolean> | boolean,
    timeout: number = this.DEFAULT_TIMEOUT,
    errorMessage: string = 'Condition not met'
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.sleep(this.POLL_INTERVAL);
    }
    
    throw new Error(`${errorMessage} within ${timeout}ms`);
  }

  /**
   * Wait for console log message
   * @param page - Playwright page
   * @param expectedMessage - Expected message (string or regex)
   * @param timeout - Timeout in milliseconds
   */
  static async waitForConsoleMessage(
    page: Page,
    expectedMessage: string | RegExp,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        page.off('console', handler);
        reject(new Error(`Console message "${expectedMessage}" not found within ${timeout}ms`));
      }, timeout);

      const handler = (msg: any) => {
        const text = msg.text();
        const matches =
          typeof expectedMessage === 'string'
            ? text.includes(expectedMessage)
            : expectedMessage.test(text);

        if (matches) {
          clearTimeout(timer);
          page.off('console', handler);
          resolve();
        }
      };

      page.on('console', handler);
    });
  }

  // ========================================
  // LOADING/SPINNER WAITS
  // ========================================

  /**
   * Wait for loading spinner to disappear
   * @param page - Playwright page
   * @param spinnerSelector - Selector for loading spinner
   * @param timeout - Timeout in milliseconds
   */
  static async waitForSpinnerToDisappear(
    page: Page,
    spinnerSelector: string = '.loading, .spinner, [data-testid="loading"]',
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const spinner = page.locator(spinnerSelector).first();
    try {
      await spinner.waitFor({ state: 'hidden', timeout });
    } catch {
      // Spinner might not exist, which is fine
    }
  }

  /**
   * Wait for all loaders to disappear
   * @param page - Playwright page
   * @param timeout - Timeout in milliseconds
   */
  static async waitForAllLoadersToDisappear(
    page: Page,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const loaders = page.locator('.loading, .spinner, .loader, [data-loading="true"]');
    await expect(loaders).toHaveCount(0, { timeout });
  }

  // ========================================
  // API/NETWORK WAITS
  // ========================================

  /**
   * Wait for specific API call to complete
   * @param page - Playwright page
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Timeout in milliseconds
   */
  static async waitForAPICall(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await page.waitForResponse(
      (response) => {
        const url = response.url();
        return typeof urlPattern === 'string'
          ? url.includes(urlPattern)
          : urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Wait for multiple API calls to complete
   * @param page - Playwright page
   * @param urlPatterns - Array of URL patterns
   * @param timeout - Timeout in milliseconds
   */
  static async waitForMultipleAPICalls(
    page: Page,
    urlPatterns: (string | RegExp)[],
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    const promises = urlPatterns.map((pattern) => this.waitForAPICall(page, pattern, timeout));
    await Promise.all(promises);
  }

  // ========================================
  // FILE/DOWNLOAD WAITS
  // ========================================

  /**
   * Wait for file download to start
   * @param page - Playwright page
   * @param timeout - Timeout in milliseconds
   */
  static async waitForDownload(page: Page, timeout: number = this.DEFAULT_TIMEOUT): Promise<any> {
    return page.waitForEvent('download', { timeout });
  }

  // ========================================
  // ANIMATION WAITS
  // ========================================

  /**
   * Wait for CSS animations to complete
   * @param locator - Element locator
   */
  static async waitForAnimationsToComplete(locator: Locator): Promise<void> {
    await locator.evaluate((element) => {
      return Promise.all(
        element.getAnimations().map((animation) => animation.finished)
      );
    });
  }

  // ========================================
  // BASIC WAIT
  // ========================================

  /**
   * Simple sleep/wait
   * @param ms - Milliseconds to wait
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for specified number of seconds
   * @param seconds - Seconds to wait
   */
  static async waitSeconds(seconds: number): Promise<void> {
    await this.sleep(seconds * 1000);
  }

  // ========================================
  // RETRY UTILITIES
  // ========================================

  /**
   * Retry an action until it succeeds or timeout
   * @param action - Action to retry
   * @param maxAttempts - Maximum number of attempts
   * @param delayMs - Delay between attempts in ms
   */
  static async retryUntilSuccess<T>(
    action: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await this.sleep(delayMs);
        }
      }
    }
    
    throw new Error(
      `Action failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
  }
}
