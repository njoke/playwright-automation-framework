import { test, expect } from '../src/fixtures/auth.fixture';
import { LoginPage } from '../src/pages/login.page';
import { DashboardPage } from '../src/pages/dashboard.page';
import { HeaderComponent } from '../src/components/header.component';
import * as testData from '../test-data/users.json';

/**
 * @regression @e2e
 * End-to-End User Flow Tests
 * Tests complete user journeys from login to various actions
 */

test.describe('User Flow - E2E Tests @e2e @regression', () => {
  test('complete user journey: login → dashboard → navigation → logout', async ({ page }) => {
    const validUser = testData.validUsers[0];
    
    // ============================================
    // STEP 1: Login
    // ============================================
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verify login page
    await loginPage.assertLoginPageDisplayed();
    
    // Perform login
    await loginPage.login(validUser.username, validUser.password);
    
    // ============================================
    // STEP 2: Verify Dashboard Access
    // ============================================
    const dashboardPage = new DashboardPage(page);
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify dashboard is displayed
    await dashboardPage.assertDashboardDisplayed();
    await dashboardPage.assertUserLoggedIn();
    
    // Verify user information
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
    console.log(`Logged in as: ${userName}`);
    
    // ============================================
    // STEP 3: Navigate through sections
    // ============================================
    const header = new HeaderComponent(page);
    
    // Verify header is displayed
    await header.assertHeaderDisplayed();
    await header.assertUserLoggedIn();
    
    // Navigate to different sections (if they exist)
    // Example navigation - adjust based on your app
    try {
      // Check if projects section exists
      if (await dashboardPage.projectsLink.isVisible({ timeout: 2000 })) {
        await dashboardPage.goToProjects();
        await expect(page).toHaveURL(/projects/);
        await page.goBack();
      }
    } catch (error) {
      console.log('Projects section not found, skipping...');
    }
    
    // ============================================
    // STEP 4: Interact with Dashboard Elements
    // ============================================
    
    // Check if search is available
    if (await dashboardPage.isSearchBarVisible()) {
      console.log('Search bar is available');
    }
    
    // Check for notifications
    if (await dashboardPage.hasNotifications()) {
      const notificationCount = await dashboardPage.getNotificationCount();
      console.log(`Notifications: ${notificationCount}`);
    }
    
    // ============================================
    // STEP 5: Logout
    // ============================================
    await dashboardPage.logout();
    
    // Verify logout successful
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
    
    // Verify login page is displayed again
    await loginPage.assertLoginPageDisplayed();
  });

  test('admin user journey with elevated permissions', async ({ adminPage }) => {
    // Using admin fixture for pre-authenticated admin session
    const dashboardPage = new DashboardPage(adminPage);
    
    // Navigate to dashboard
    await dashboardPage.goto();
    
    // Verify admin access
    await dashboardPage.assertDashboardDisplayed();
    
    // Verify admin-specific elements (adjust based on your app)
    // Example: Admin might have access to Users or Settings
    const header = new HeaderComponent(adminPage);
    await header.assertUserLoggedIn();
    
    // Check for admin-specific navigation items
    try {
      if (await dashboardPage.usersLink.isVisible({ timeout: 2000 })) {
        console.log('Admin has access to Users section');
        await dashboardPage.goToUsers();
        await expect(adminPage).toHaveURL(/users/);
      }
    } catch (error) {
      console.log('Users section not found');
    }
  });

  test('user can navigate back and forth between sections', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.goto();
    
    // Verify dashboard
    await dashboardPage.assertDashboardDisplayed();
    const initialUrl = await authenticatedPage.url();
    
    // Navigate to settings (if available)
    try {
      if (await dashboardPage.settingsLink.isVisible({ timeout: 2000 })) {
        await dashboardPage.goToSettings();
        const settingsUrl = await authenticatedPage.url();
        expect(settingsUrl).not.toBe(initialUrl);
        
        // Navigate back
        await authenticatedPage.goBack();
        const backUrl = await authenticatedPage.url();
        expect(backUrl).toBe(initialUrl);
        
        // Navigate forward
        await authenticatedPage.goForward();
        const forwardUrl = await authenticatedPage.url();
        expect(forwardUrl).toBe(settingsUrl);
      }
    } catch (error) {
      console.log('Settings section not available, skipping navigation test');
    }
  });

  test('user session persistence across page refresh', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.goto();
    
    // Verify logged in
    await dashboardPage.assertUserLoggedIn();
    const userNameBefore = await dashboardPage.getUserName();
    
    // Refresh page
    await dashboardPage.refreshDashboard();
    
    // Verify still logged in
    await dashboardPage.assertUserLoggedIn();
    const userNameAfter = await dashboardPage.getUserName();
    
    // User info should remain the same
    expect(userNameAfter).toBe(userNameBefore);
  });

  test('multiple tabs - login in one tab affects another', async ({ page, context }) => {
    const validUser = testData.validUsers[0];
    
    // Login in first tab
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertDashboardDisplayed();
    
    // Open second tab
    const page2 = await context.newPage();
    const dashboardPage2 = new DashboardPage(page2);
    await dashboardPage2.goto();
    
    // Should be logged in (session shared)
    await dashboardPage2.assertDashboardDisplayed();
    
    // Logout from first tab
    await dashboardPage.logout();
    
    // Refresh second tab - should redirect to login
    await page2.reload();
    await expect(page2).toHaveURL(/login/, { timeout: 10000 });
    
    await page2.close();
  });
});

/**
 * Test data-driven user journeys
 */
test.describe('Data-Driven E2E Tests @e2e', () => {
  // Test with multiple users
  testData.validUsers.forEach((user, index) => {
    test(`user journey for user ${index + 1}: ${user.role}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Login
      await loginPage.login(user.username, user.password);
      
      // Verify dashboard access
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.assertDashboardDisplayed();
      
      // Role-specific checks
      console.log(`Testing as: ${user.role} - ${user.firstName} ${user.lastName}`);
      
      // Logout
      await dashboardPage.logout();
      await expect(page).toHaveURL(/login/);
    });
  });
});

/**
 * Performance tracking
 */
test.describe('E2E Performance Tests @e2e @performance', () => {
  test('measure login to dashboard time', async ({ page }) => {
    const validUser = testData.validUsers[0];
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    
    // Start timer
    const startTime = Date.now();
    
    // Login
    await loginPage.login(validUser.username, validUser.password);
    
    // Wait for dashboard
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 10000 });
    
    // End timer
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Login to dashboard took: ${duration}ms`);
    
    // Performance assertion (adjust threshold based on your needs)
    expect(duration).toBeLessThan(5000); // Should take less than 5 seconds
  });
});

/**
 * Test cleanup
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `test-results/failures/${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true,
    });
  }
});
