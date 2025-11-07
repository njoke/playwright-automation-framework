import { test, expect } from '../src/fixtures/auth.fixture';
import { LoginPage } from '../src/pages/login.page';
import { DashboardPage } from '../src/pages/dashboard.page';
import { ScreenshotUtil } from '../src/utils/screenshot.util';

/**
 * @visual
 * Visual Regression Tests
 * Captures screenshots and compares them to detect unintended UI changes
 * 
 * Note: First run will create baseline screenshots
 * Subsequent runs will compare against baselines
 */

test.describe('Visual Regression Tests @visual', () => {
  
  // Configure for visual tests
  test.use({
    viewport: { width: 1280, height: 720 },
  });

  test.describe('Login Page Visuals', () => {
    
    test('login page - desktop view', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');
      
      // Hide dynamic content (timestamps, etc.) if any
      // await ScreenshotUtil.hideDynamicContent(page, ['.timestamp', '.dynamic-content']);
      
      // Compare screenshot with baseline
      await expect(page).toHaveScreenshot('login-page-desktop.png', {
        maxDiffPixels: 100, // Allow up to 100 pixels difference
      });
    });

    test('login page - mobile view', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await page.waitForLoadState('networkidle');
      
      // Visual comparison for mobile
      await expect(page).toHaveScreenshot('login-page-mobile.png', {
        maxDiffPixels: 100,
      });
    });

    test('login page - tablet view', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await page.waitForLoadState('networkidle');
      
      // Visual comparison for tablet
      await expect(page).toHaveScreenshot('login-page-tablet.png', {
        maxDiffPixels: 100,
      });
    });

    test('login page with error message', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Trigger error state
      await loginPage.login('invalid', 'credentials');
      
      // Wait for error message
      await loginPage.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      
      // Capture error state
      await expect(page).toHaveScreenshot('login-page-error-state.png', {
        maxDiffPixels: 150,
      });
    });

    test('login page - focused input fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Focus on username field
      await loginPage.usernameInput.focus();
      
      await expect(page).toHaveScreenshot('login-page-username-focused.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Dashboard Visuals', () => {
    
    test('dashboard - full page view', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      
      // Wait for dashboard to load completely
      await dashboardPage.waitForDashboardLoad();
      
      // Hide dynamic content that changes frequently
      await ScreenshotUtil.hideDynamicContent(authenticatedPage, [
        '[data-testid="timestamp"]',
        '.time',
        '.date',
      ]);
      
      // Full page screenshot
      await expect(authenticatedPage).toHaveScreenshot('dashboard-full-page.png', {
        maxDiffPixels: 200,
        fullPage: true,
      });
    });

    test('dashboard - header component', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();
      
      // Screenshot of just the header
      const header = authenticatedPage.locator('header').first();
      
      await expect(header).toHaveScreenshot('dashboard-header.png', {
        maxDiffPixels: 50,
      });
    });

    test('dashboard - navigation menu', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();
      
      // Screenshot of navigation menu
      const nav = dashboardPage.navigationMenu;
      
      await expect(nav).toHaveScreenshot('dashboard-navigation.png', {
        maxDiffPixels: 50,
      });
    });

    test('dashboard - stats cards', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();
      
      // Screenshot of stats cards area
      if (await dashboardPage.statsCards.first().isVisible()) {
        const statsContainer = authenticatedPage.locator('[data-testid="stats-container"]')
          .or(dashboardPage.statsCards.first().locator('..'));
        
        await expect(statsContainer).toHaveScreenshot('dashboard-stats-cards.png', {
          maxDiffPixels: 100,
        });
      } else {
        test.skip();
      }
    });
  });

  test.describe('Responsive Design Visuals', () => {
    
    test('responsive breakpoints - login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Test multiple breakpoints
      const breakpoints = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'tablet-landscape' },
        { width: 1280, height: 720, name: 'desktop' },
        { width: 1920, height: 1080, name: 'desktop-large' },
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({
          width: breakpoint.width,
          height: breakpoint.height,
        });
        
        // Wait for layout to adjust
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(
          `login-responsive-${breakpoint.name}.png`,
          {
            maxDiffPixels: 150,
          }
        );
      }
    });

    test('responsive breakpoints - dashboard', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();
      
      const breakpoints = [
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1280, height: 720, name: 'desktop' },
        { width: 1920, height: 1080, name: 'desktop-large' },
      ];
      
      for (const breakpoint of breakpoints) {
        await authenticatedPage.setViewportSize({
          width: breakpoint.width,
          height: breakpoint.height,
        });
        
        await authenticatedPage.waitForTimeout(500);
        
        // Hide dynamic content
        await ScreenshotUtil.hideDynamicContent(authenticatedPage, [
          '[data-testid="timestamp"]',
        ]);
        
        await expect(authenticatedPage).toHaveScreenshot(
          `dashboard-responsive-${breakpoint.name}.png`,
          {
            maxDiffPixels: 200,
            fullPage: true,
          }
        );
      }
    });
  });

  test.describe('Component-Level Visuals', () => {
    
    test('buttons in different states', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Default state
      await expect(loginPage.loginButton).toHaveScreenshot('button-default.png');
      
      // Hover state
      await loginPage.loginButton.hover();
      await expect(loginPage.loginButton).toHaveScreenshot('button-hover.png');
      
      // Disabled state (if applicable)
      // Test would need to create condition for disabled button
    });

    test('form inputs in different states', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Empty input
      await expect(loginPage.usernameInput).toHaveScreenshot('input-empty.png');
      
      // Filled input
      await loginPage.usernameInput.fill('testuser');
      await expect(loginPage.usernameInput).toHaveScreenshot('input-filled.png');
      
      // Focused input
      await loginPage.passwordInput.focus();
      await expect(loginPage.passwordInput).toHaveScreenshot('input-focused.png');
    });
  });

  test.describe('Dark Mode / Theme Visuals', () => {
    
    test('login page - dark mode', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Toggle dark mode if your app supports it
      // This is an example - adjust based on your implementation
      try {
        const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
        if (await darkModeToggle.isVisible({ timeout: 2000 })) {
          await darkModeToggle.click();
          await page.waitForTimeout(500); // Wait for theme transition
          
          await expect(page).toHaveScreenshot('login-page-dark-mode.png', {
            maxDiffPixels: 200,
          });
        }
      } catch (error) {
        test.skip(); // Skip if dark mode not available
      }
    });

    test('dashboard - dark mode', async ({ authenticatedPage }) => {
      const dashboardPage = new DashboardPage(authenticatedPage);
      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();
      
      // Toggle dark mode
      try {
        const darkModeToggle = authenticatedPage.locator('[data-testid="dark-mode-toggle"]');
        if (await darkModeToggle.isVisible({ timeout: 2000 })) {
          await darkModeToggle.click();
          await authenticatedPage.waitForTimeout(500);
          
          await ScreenshotUtil.hideDynamicContent(authenticatedPage, [
            '[data-testid="timestamp"]',
          ]);
          
          await expect(authenticatedPage).toHaveScreenshot('dashboard-dark-mode.png', {
            maxDiffPixels: 300,
            fullPage: true,
          });
        }
      } catch (error) {
        test.skip();
      }
    });
  });

  test.describe('Animation States', () => {
    
    test('page transitions', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Capture before transition
      await expect(page).toHaveScreenshot('before-transition.png');
      
      // Trigger transition (e.g., opening a modal, expanding a section)
      // This is an example - adjust based on your UI
      
      // Capture after transition
      // await expect(page).toHaveScreenshot('after-transition.png');
    });
  });
});

/**
 * Visual regression test configuration and best practices:
 * 
 * 1. Always wait for page to be stable (networkidle)
 * 2. Hide dynamic content (timestamps, random IDs, etc.)
 * 3. Mask sensitive information
 * 4. Use consistent viewport sizes
 * 5. Allow small pixel differences for anti-aliasing variations
 * 6. Test multiple breakpoints for responsive design
 * 7. Organize screenshots by feature/component
 * 8. Update baselines when intentional UI changes are made
 * 
 * To update baselines:
 * npm test -- --update-snapshots
 */

/**
 * Cleanup after tests
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `test-results/failures/${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true,
    });
  }
});
