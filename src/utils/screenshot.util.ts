import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ScreenshotUtil - Utility class for taking and managing screenshots
 * Provides advanced screenshot capabilities for visual testing and debugging
 * 
 * @example
 * await ScreenshotUtil.captureFullPage(page, 'homepage');
 * await ScreenshotUtil.captureElement(locator, 'login-button');
 */
export class ScreenshotUtil {
  private static readonly SCREENSHOT_DIR = 'screenshots';
  private static readonly VISUAL_DIR = 'test-results/visual';
  private static readonly FAILURE_DIR = 'test-results/failures';

  // ========================================
  // DIRECTORY MANAGEMENT
  // ========================================

  /**
   * Ensure screenshot directory exists
   * @param dir - Directory path
   */
  private static ensureDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Get screenshot path
   * @param name - Screenshot name
   * @param dir - Directory (default: screenshots)
   */
  private static getScreenshotPath(name: string, dir: string = this.SCREENSHOT_DIR): string {
    this.ensureDirectory(dir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    return path.join(dir, filename);
  }

  // ========================================
  // PAGE SCREENSHOTS
  // ========================================

  /**
   * Capture full page screenshot
   * @param page - Playwright page
   * @param name - Screenshot name
   * @param options - Screenshot options
   */
  static async captureFullPage(
    page: Page,
    name: string,
    options?: {
      dir?: string;
      quality?: number;
    }
  ): Promise<string> {
    const screenshotPath = this.getScreenshotPath(name, options?.dir);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png',
    });

    console.log(`Full page screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Capture viewport screenshot (visible area only)
   * @param page - Playwright page
   * @param name - Screenshot name
   * @param options - Screenshot options
   */
  static async captureViewport(
    page: Page,
    name: string,
    options?: {
      dir?: string;
      quality?: number;
    }
  ): Promise<string> {
    const screenshotPath = this.getScreenshotPath(name, options?.dir);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
      type: 'png',
    });

    console.log(`Viewport screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Capture screenshot with specific dimensions
   * @param page - Playwright page
   * @param name - Screenshot name
   * @param width - Viewport width
   * @param height - Viewport height
   */
  static async captureWithDimensions(
    page: Page,
    name: string,
    width: number,
    height: number
  ): Promise<string> {
    await page.setViewportSize({ width, height });
    return await this.captureFullPage(page, `${name}_${width}x${height}`);
  }

  // ========================================
  // ELEMENT SCREENSHOTS
  // ========================================

  /**
   * Capture screenshot of a specific element
   * @param locator - Element locator
   * @param name - Screenshot name
   * @param options - Screenshot options
   */
  static async captureElement(
    locator: Locator,
    name: string,
    options?: {
      dir?: string;
      padding?: number;
    }
  ): Promise<string> {
    const screenshotPath = this.getScreenshotPath(name, options?.dir);
    
    await locator.screenshot({
      path: screenshotPath,
      type: 'png',
    });

    console.log(`Element screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Capture multiple elements as separate screenshots
   * @param locators - Array of element locators
   * @param baseName - Base name for screenshots
   */
  static async captureMultipleElements(
    locators: Locator[],
    baseName: string
  ): Promise<string[]> {
    const paths: string[] = [];
    
    for (let i = 0; i < locators.length; i++) {
      const path = await this.captureElement(locators[i], `${baseName}_${i + 1}`);
      paths.push(path);
    }
    
    return paths;
  }

  // ========================================
  // VISUAL REGRESSION TESTING
  // ========================================

  /**
   * Capture screenshot for visual regression testing
   * @param page - Playwright page
   * @param name - Screenshot name
   */
  static async captureForVisualTest(page: Page, name: string): Promise<void> {
    // Wait for page to be stable
    await page.waitForLoadState('networkidle');
    await this.waitForAnimationsToComplete(page);
    
    // Take screenshot in the visual test directory
    await this.captureFullPage(page, name, {
      dir: this.VISUAL_DIR,
    });
  }

  /**
   * Capture element for visual regression testing
   * @param locator - Element locator
   * @param name - Screenshot name
   */
  static async captureElementForVisualTest(locator: Locator, name: string): Promise<void> {
    await this.captureElement(locator, name, {
      dir: this.VISUAL_DIR,
    });
  }

  // ========================================
  // FAILURE/DEBUG SCREENSHOTS
  // ========================================

  /**
   * Capture screenshot on test failure
   * @param page - Playwright page
   * @param testName - Test name
   */
  static async captureOnFailure(page: Page, testName: string): Promise<string> {
    console.log(`Capturing failure screenshot for: ${testName}`);
    return await this.captureFullPage(page, `FAILURE_${testName}`, {
      dir: this.FAILURE_DIR,
    });
  }

  /**
   * Capture debug screenshot with timestamp
   * @param page - Playwright page
   * @param debugLabel - Debug label
   */
  static async captureDebug(page: Page, debugLabel: string): Promise<string> {
    return await this.captureFullPage(page, `DEBUG_${debugLabel}`);
  }

  // ========================================
  // RESPONSIVE SCREENSHOTS
  // ========================================

  /**
   * Capture screenshots at different viewport sizes
   * @param page - Playwright page
   * @param name - Base screenshot name
   * @param viewports - Array of viewport configurations
   */
  static async captureResponsive(
    page: Page,
    name: string,
    viewports: Array<{ width: number; height: number; name: string }> = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ]
  ): Promise<string[]> {
    const paths: string[] = [];
    
    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      
      // Wait for layout to adjust
      await page.waitForTimeout(500);
      
      const path = await this.captureFullPage(page, `${name}_${viewport.name}`);
      paths.push(path);
    }
    
    return paths;
  }

  /**
   * Common responsive breakpoints
   */
  static readonly BREAKPOINTS = {
    MOBILE_SMALL: { width: 320, height: 568, name: 'mobile-small' },
    MOBILE: { width: 375, height: 667, name: 'mobile' },
    MOBILE_LARGE: { width: 414, height: 896, name: 'mobile-large' },
    TABLET: { width: 768, height: 1024, name: 'tablet' },
    TABLET_LARGE: { width: 1024, height: 1366, name: 'tablet-large' },
    DESKTOP: { width: 1280, height: 800, name: 'desktop' },
    DESKTOP_LARGE: { width: 1920, height: 1080, name: 'desktop-large' },
    DESKTOP_XL: { width: 2560, height: 1440, name: 'desktop-xl' },
  };

  // ========================================
  // SCREENSHOT COMPARISON
  // ========================================

  /**
   * Compare two screenshots (basic pixel comparison)
   * Note: For production, consider using dedicated image comparison libraries
   * @param screenshot1Path - Path to first screenshot
   * @param screenshot2Path - Path to second screenshot
   */
  static async compareScreenshots(
    screenshot1Path: string,
    screenshot2Path: string
  ): Promise<boolean> {
    // This is a basic implementation
    // For production, integrate with image comparison library like pixelmatch
    const buffer1 = fs.readFileSync(screenshot1Path);
    const buffer2 = fs.readFileSync(screenshot2Path);
    
    return buffer1.equals(buffer2);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Wait for all animations to complete before taking screenshot
   * @param page - Playwright page
   */
  private static async waitForAnimationsToComplete(page: Page): Promise<void> {
    await page.evaluate(() => {
      return Promise.all(
        document.getAnimations().map((animation) => animation.finished)
      );
    });
  }

  /**
   * Hide dynamic content before screenshot (e.g., timestamps, cursors)
   * @param page - Playwright page
   * @param selectors - Array of selectors to hide
   */
  static async hideDynamicContent(page: Page, selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        elements.forEach((el) => {
          (el as HTMLElement).style.visibility = 'hidden';
        });
      }, selector);
    }
  }

  /**
   * Mask sensitive information before screenshot
   * @param page - Playwright page
   * @param selectors - Array of selectors to mask
   */
  static async maskSensitiveInfo(page: Page, selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        elements.forEach((el) => {
          (el as HTMLElement).textContent = '***MASKED***';
        });
      }, selector);
    }
  }

  /**
   * Clean up old screenshots
   * @param dir - Directory to clean
   * @param daysOld - Delete screenshots older than X days
   */
  static async cleanupOldScreenshots(dir: string = this.SCREENSHOT_DIR, daysOld: number = 7): Promise<void> {
    if (!fs.existsSync(dir)) {
      return;
    }

    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000;

    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old screenshot: ${filePath}`);
      }
    }
  }

  /**
   * Get list of all screenshots in directory
   * @param dir - Directory to list
   */
  static getScreenshots(dir: string = this.SCREENSHOT_DIR): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    return fs.readdirSync(dir)
      .filter((file) => file.endsWith('.png'))
      .map((file) => path.join(dir, file));
  }

  /**
   * Delete all screenshots in directory
   * @param dir - Directory to clean
   */
  static deleteAllScreenshots(dir: string = this.SCREENSHOT_DIR): void {
    if (!fs.existsSync(dir)) {
      return;
    }
    
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      fs.unlinkSync(path.join(dir, file));
    });
    
    console.log(`Deleted all screenshots from: ${dir}`);
  }
}
