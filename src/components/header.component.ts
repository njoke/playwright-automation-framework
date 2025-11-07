import { Page, Locator } from '@playwright/test';

/**
 * HeaderComponent - Reusable component for the site header
 * This component appears on multiple pages and contains common navigation elements
 * 
 * @example
 * const header = new HeaderComponent(page);
 * await header.navigateToSection('Projects');
 * await header.logout();
 */
export class HeaderComponent {
  readonly page: Page;

  // Locators
  readonly header: Locator;
  readonly logo: Locator;
  readonly navigationMenu: Locator;
  readonly userMenu: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly notificationIcon: Locator;
  readonly notificationBadge: Locator;
  readonly searchButton: Locator;
  readonly settingsIcon: Locator;
  readonly helpIcon: Locator;
  readonly logoutButton: Locator;

  // Dropdown menu items
  readonly profileMenuItem: Locator;
  readonly accountSettingsMenuItem: Locator;
  readonly preferencesMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.header = this.page.locator('[data-testid="header"]')
      .or(this.page.locator('header'))
      .first();

    this.logo = this.page.locator('[data-testid="logo"]')
      .or(this.page.locator('.logo'));

    this.navigationMenu = this.page.locator('[data-testid="nav-menu"]')
      .or(this.page.locator('nav'));

    this.userMenu = this.page.locator('[data-testid="user-menu"]')
      .or(this.page.locator('.user-menu'));

    this.userAvatar = this.page.locator('[data-testid="user-avatar"]')
      .or(this.page.locator('.user-avatar'));

    this.userName = this.page.locator('[data-testid="user-name"]')
      .or(this.page.locator('.user-name'));

    this.notificationIcon = this.page.locator('[data-testid="notification-icon"]')
      .or(this.page.locator('[aria-label="Notifications"]'));

    this.notificationBadge = this.page.locator('[data-testid="notification-badge"]')
      .or(this.page.locator('.notification-badge'));

    this.searchButton = this.page.locator('[data-testid="search-button"]')
      .or(this.page.getByRole('button', { name: /search/i }));

    this.settingsIcon = this.page.locator('[data-testid="settings-icon"]')
      .or(this.page.locator('[aria-label="Settings"]'));

    this.helpIcon = this.page.locator('[data-testid="help-icon"]')
      .or(this.page.locator('[aria-label="Help"]'));

    this.logoutButton = this.page.locator('[data-testid="logout-button"]')
      .or(this.page.getByRole('button', { name: /logout|sign out/i }));

    // Dropdown menu items (visible after clicking user menu)
    this.profileMenuItem = this.page.locator('[data-testid="menu-profile"]')
      .or(this.page.getByRole('menuitem', { name: /profile/i }));

    this.accountSettingsMenuItem = this.page.locator('[data-testid="menu-account"]')
      .or(this.page.getByRole('menuitem', { name: /account/i }));

    this.preferencesMenuItem = this.page.locator('[data-testid="menu-preferences"]')
      .or(this.page.getByRole('menuitem', { name: /preferences/i }));
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Click on logo to navigate to home page
   */
  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  /**
   * Navigate to a specific section using navigation menu
   * @param sectionName - Name of the section to navigate to
   */
  async navigateToSection(sectionName: string): Promise<void> {
    const navItem = this.page.locator(`[data-testid="nav-${sectionName.toLowerCase()}"]`)
      .or(this.page.getByRole('link', { name: new RegExp(sectionName, 'i') }));
    await navItem.click();
  }

  // ========================================
  // USER MENU ACTIONS
  // ========================================

  /**
   * Open user menu dropdown
   */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
    await this.profileMenuItem.waitFor({ state: 'visible' });
  }

  /**
   * Close user menu dropdown
   */
  async closeUserMenu(): Promise<void> {
    // Click outside the menu to close
    await this.page.mouse.click(0, 0);
  }

  /**
   * Navigate to user profile
   */
  async goToProfile(): Promise<void> {
    await this.openUserMenu();
    await this.profileMenuItem.click();
  }

  /**
   * Navigate to account settings
   */
  async goToAccountSettings(): Promise<void> {
    await this.openUserMenu();
    await this.accountSettingsMenuItem.click();
  }

  /**
   * Navigate to preferences
   */
  async goToPreferences(): Promise<void> {
    await this.openUserMenu();
    await this.preferencesMenuItem.click();
  }

  /**
   * Logout using header menu
   */
  async logout(): Promise<void> {
    // Try to find logout in user menu first
    try {
      await this.openUserMenu();
      await this.logoutButton.click({ timeout: 2000 });
    } catch {
      // If not in menu, try direct logout button
      await this.logoutButton.click();
    }
  }

  // ========================================
  // NOTIFICATION ACTIONS
  // ========================================

  /**
   * Click notification icon to open notifications
   */
  async openNotifications(): Promise<void> {
    await this.notificationIcon.click();
  }

  /**
   * Get notification count from badge
   */
  async getNotificationCount(): Promise<number> {
    if (!(await this.notificationBadge.isVisible())) {
      return 0;
    }
    const text = await this.notificationBadge.textContent();
    return parseInt(text || '0');
  }

  /**
   * Check if there are unread notifications
   */
  async hasUnreadNotifications(): Promise<boolean> {
    return await this.notificationBadge.isVisible();
  }

  // ========================================
  // SEARCH ACTIONS
  // ========================================

  /**
   * Open search modal/panel
   */
  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Perform search (if search input is in header)
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.openSearch();
    const searchInput = this.page.locator('[data-testid="search-input"]')
      .or(this.page.locator('input[type="search"]'));
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
  }

  // ========================================
  // OTHER ACTIONS
  // ========================================

  /**
   * Open settings
   */
  async openSettings(): Promise<void> {
    await this.settingsIcon.click();
  }

  /**
   * Open help/documentation
   */
  async openHelp(): Promise<void> {
    await this.helpIcon.click();
  }

  // ========================================
  // INFORMATION RETRIEVAL
  // ========================================

  /**
   * Get displayed username
   */
  async getUserName(): Promise<string> {
    return (await this.userName.textContent()) || '';
  }

  /**
   * Check if user is logged in (header shows user info)
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.userMenu.isVisible();
  }

  /**
   * Check if header is visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return await this.header.isVisible();
  }

  /**
   * Get all navigation menu items
   */
  async getNavigationMenuItems(): Promise<string[]> {
    const navItems = await this.navigationMenu.locator('a, button').all();
    return Promise.all(navItems.map(async (item) => (await item.textContent()) || ''));
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  /**
   * Verify header is displayed properly
   */
  async assertHeaderDisplayed(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  /**
   * Verify user is logged in
   */
  async assertUserLoggedIn(): Promise<void> {
    await this.userMenu.waitFor({ state: 'visible' });
  }

  /**
   * Verify notification badge shows specific count
   * @param expectedCount - Expected notification count
   */
  async assertNotificationCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getNotificationCount();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} notifications, but found ${actualCount}`);
    }
  }

  /**
   * Verify username is displayed
   * @param expectedUsername - Expected username
   */
  async assertUserName(expectedUsername: string): Promise<void> {
    const actualUsername = await this.getUserName();
    if (!actualUsername.includes(expectedUsername)) {
      throw new Error(`Expected username to contain "${expectedUsername}", but found "${actualUsername}"`);
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Wait for header to load completely
   */
  async waitForHeaderLoad(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
    await this.logo.waitFor({ state: 'visible' });
  }

  /**
   * Take screenshot of header
   */
  async takeHeaderScreenshot(name: string = 'header'): Promise<void> {
    await this.header.screenshot({ path: `screenshots/${name}.png` });
  }
}
