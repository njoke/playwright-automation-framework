import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * DashboardPage - Page Object for the Dashboard page
 * Represents the main landing page after successful login
 * 
 * @example
 * const dashboardPage = new DashboardPage(page);
 * await dashboardPage.assertDashboardDisplayed();
 */
export class DashboardPage extends BasePage {
  // Page URL
  readonly url = '/dashboard';

  // Locators
  readonly pageTitle: Locator;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly userProfileMenu: Locator;
  readonly userNameDisplay: Locator;
  readonly navigationMenu: Locator;
  readonly searchBar: Locator;
  readonly notificationIcon: Locator;
  readonly notificationBadge: Locator;
  readonly settingsButton: Locator;
  readonly helpButton: Locator;

  // Dashboard widgets/cards
  readonly statsCards: Locator;
  readonly quickActionsPanel: Locator;
  readonly recentActivityPanel: Locator;
  readonly chartContainer: Locator;

  // Navigation items
  readonly homeLink: Locator;
  readonly projectsLink: Locator;
  readonly reportsLink: Locator;
  readonly settingsLink: Locator;
  readonly usersLink: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageTitle = this.page.locator('[data-testid="dashboard-title"]')
      .or(this.page.locator('h1'))
      .first();

    this.welcomeMessage = this.page.locator('[data-testid="welcome-message"]')
      .or(this.page.locator('.welcome-message'));

    this.logoutButton = this.page.locator('[data-testid="logout-button"]')
      .or(this.page.getByRole('button', { name: /logout|sign out/i }));

    this.userProfileMenu = this.page.locator('[data-testid="user-profile-menu"]')
      .or(this.page.locator('.user-menu'))
      .or(this.page.locator('[aria-label="User menu"]'));

    this.userNameDisplay = this.page.locator('[data-testid="user-name"]')
      .or(this.page.locator('.user-name'));

    this.navigationMenu = this.page.locator('[data-testid="navigation-menu"]')
      .or(this.page.locator('nav'))
      .first();

    this.searchBar = this.page.locator('[data-testid="search-input"]')
      .or(this.page.locator('input[type="search"]'))
      .or(this.page.locator('[placeholder*="Search"]'));

    this.notificationIcon = this.page.locator('[data-testid="notifications-icon"]')
      .or(this.page.locator('[aria-label="Notifications"]'));

    this.notificationBadge = this.page.locator('[data-testid="notification-badge"]')
      .or(this.page.locator('.notification-badge'));

    this.settingsButton = this.page.locator('[data-testid="settings-button"]')
      .or(this.page.getByRole('button', { name: /settings/i }));

    this.helpButton = this.page.locator('[data-testid="help-button"]')
      .or(this.page.getByRole('button', { name: /help/i }));

    // Dashboard widgets
    this.statsCards = this.page.locator('[data-testid="stats-card"]')
      .or(this.page.locator('.stats-card'));

    this.quickActionsPanel = this.page.locator('[data-testid="quick-actions"]')
      .or(this.page.locator('.quick-actions'));

    this.recentActivityPanel = this.page.locator('[data-testid="recent-activity"]')
      .or(this.page.locator('.recent-activity'));

    this.chartContainer = this.page.locator('[data-testid="chart-container"]')
      .or(this.page.locator('.chart-container'));

    // Navigation links
    this.homeLink = this.page.locator('[data-testid="nav-home"]')
      .or(this.page.getByRole('link', { name: /home/i }));

    this.projectsLink = this.page.locator('[data-testid="nav-projects"]')
      .or(this.page.getByRole('link', { name: /projects/i }));

    this.reportsLink = this.page.locator('[data-testid="nav-reports"]')
      .or(this.page.getByRole('link', { name: /reports/i }));

    this.settingsLink = this.page.locator('[data-testid="nav-settings"]')
      .or(this.page.getByRole('link', { name: /settings/i }));

    this.usersLink = this.page.locator('[data-testid="nav-users"]')
      .or(this.page.getByRole('link', { name: /users/i }));
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Navigate to dashboard page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to specific section using navigation menu
   * @param section - Section name (home, projects, reports, etc.)
   */
  async navigateToSection(section: string): Promise<void> {
    const sectionLink = this.page.getByRole('link', { name: new RegExp(section, 'i') });
    await this.click(sectionLink);
    await this.waitForPageLoad();
  }

  // ========================================
  // USER ACTIONS
  // ========================================

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await this.page.waitForURL(/login/);
  }

  /**
   * Open user profile menu
   */
  async openUserProfileMenu(): Promise<void> {
    await this.click(this.userProfileMenu);
  }

  /**
   * Search using search bar
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.fill(this.searchBar, searchTerm);
    await this.pressKey('Enter');
  }

  /**
   * Click notifications icon
   */
  async openNotifications(): Promise<void> {
    await this.click(this.notificationIcon);
  }

  /**
   * Open settings
   */
  async openSettings(): Promise<void> {
    await this.click(this.settingsButton);
  }

  /**
   * Open help
   */
  async openHelp(): Promise<void> {
    await this.click(this.helpButton);
  }

  // ========================================
  // NAVIGATION SHORTCUTS
  // ========================================

  /**
   * Navigate to Projects
   */
  async goToProjects(): Promise<void> {
    await this.click(this.projectsLink);
    await this.waitForUrl(/projects/);
  }

  /**
   * Navigate to Reports
   */
  async goToReports(): Promise<void> {
    await this.click(this.reportsLink);
    await this.waitForUrl(/reports/);
  }

  /**
   * Navigate to Settings
   */
  async goToSettings(): Promise<void> {
    await this.click(this.settingsLink);
    await this.waitForUrl(/settings/);
  }

  /**
   * Navigate to Users
   */
  async goToUsers(): Promise<void> {
    await this.click(this.usersLink);
    await this.waitForUrl(/users/);
  }

  // ========================================
  // INFORMATION RETRIEVAL
  // ========================================

  /**
   * Get displayed username
   */
  async getUserName(): Promise<string> {
    return await this.getText(this.userNameDisplay);
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    const badgeText = await this.getText(this.notificationBadge);
    return parseInt(badgeText) || 0;
  }

  /**
   * Get page title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get stats card values
   * Returns array of stat values displayed on dashboard
   */
  async getStatsCardValues(): Promise<string[]> {
    const cards = await this.statsCards.all();
    return Promise.all(cards.map(async (card) => (await card.textContent()) || ''));
  }

  /**
   * Get count of stats cards
   */
  async getStatsCardCount(): Promise<number> {
    return await this.getCount(this.statsCards);
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  /**
   * Check if dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    return await this.isVisible(this.pageTitle) && 
           await this.isVisible(this.navigationMenu);
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userProfileMenu) &&
           await this.isVisible(this.logoutButton);
  }

  /**
   * Check if notifications are available
   */
  async hasNotifications(): Promise<boolean> {
    return await this.isVisible(this.notificationBadge);
  }

  /**
   * Check if search bar is visible
   */
  async isSearchBarVisible(): Promise<boolean> {
    return await this.isVisible(this.searchBar);
  }

  /**
   * Check if specific widget/panel is displayed
   * @param widgetName - Name of the widget
   */
  async isWidgetDisplayed(widgetName: string): Promise<boolean> {
    const widget = this.page.locator(`[data-testid="${widgetName}"]`)
      .or(this.page.getByText(widgetName));
    return await this.isVisible(widget);
  }

  // ========================================
  // ASSERTION METHODS
  // ========================================

  /**
   * Assert dashboard is displayed
   */
  async assertDashboardDisplayed(): Promise<void> {
    await this.assertVisible(this.pageTitle);
    await this.assertVisible(this.navigationMenu);
  }

  /**
   * Assert welcome message contains username
   * @param username - Expected username
   */
  async assertWelcomeMessageContains(username: string): Promise<void> {
    await this.assertContainsText(this.welcomeMessage, username);
  }

  /**
   * Assert user is logged in
   */
  async assertUserLoggedIn(): Promise<void> {
    await this.assertVisible(this.userProfileMenu);
    await this.assertVisible(this.logoutButton);
  }

  /**
   * Assert dashboard title
   * @param expectedTitle - Expected dashboard title
   */
  async assertDashboardTitle(expectedTitle: string): Promise<void> {
    await this.assertHasText(this.pageTitle, expectedTitle);
  }

  /**
   * Assert notification count
   * @param expectedCount - Expected notification count
   */
  async assertNotificationCount(expectedCount: number): Promise<void> {
    await this.assertHasText(this.notificationBadge, expectedCount.toString());
  }

  /**
   * Assert stats cards are displayed
   * @param expectedCount - Expected number of stats cards (optional)
   */
  async assertStatsCardsDisplayed(expectedCount?: number): Promise<void> {
    await this.assertVisible(this.statsCards.first());
    if (expectedCount) {
      const actualCount = await this.getStatsCardCount();
      if (actualCount !== expectedCount) {
        throw new Error(`Expected ${expectedCount} stats cards, but found ${actualCount}`);
      }
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Wait for dashboard to load completely
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForVisible(this.pageTitle);
    await this.waitForVisible(this.navigationMenu);
    await this.waitForPageLoad();
  }

  /**
   * Refresh dashboard data
   */
  async refreshDashboard(): Promise<void> {
    await this.reload();
    await this.waitForDashboardLoad();
  }

  /**
   * Take dashboard screenshot
   */
  async takeDashboardScreenshot(name: string = 'dashboard'): Promise<void> {
    await this.takeScreenshot(name);
  }
}
