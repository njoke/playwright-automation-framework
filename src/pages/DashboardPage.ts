import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage class represents the main dashboard/home page after login
 * This is where users land after successful authentication
 */
export class DashboardPage extends BasePage {
  // Page URL
  private readonly dashboardUrl = '/dashboard';

  // Locators
  readonly pageTitle: Locator;
  readonly welcomeMessage: Locator;
  readonly userProfileMenu: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;
  readonly notificationIcon: Locator;
  readonly searchBar: Locator;

  // Navigation menu items
  readonly homeLink: Locator;
  readonly profileLink: Locator;
  readonly settingsLink: Locator;
  readonly reportsLink: Locator;

  /**
   * Constructor initializes all locators
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageTitle = page.locator('[data-testid="dashboard-title"]');
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.userProfileMenu = page.locator('[data-testid="user-profile-menu"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.navigationMenu = page.locator('[data-testid="navigation-menu"]');
    this.notificationIcon = page.locator('[data-testid="notification-icon"]');
    this.searchBar = page.locator('[data-testid="search-bar"]');

    // Navigation links
    this.homeLink = page.locator('[data-testid="nav-home"]');
    this.profileLink = page.locator('[data-testid="nav-profile"]');
    this.settingsLink = page.locator('[data-testid="nav-settings"]');
    this.reportsLink = page.locator('[data-testid="nav-reports"]');

    // Alternative selectors (if data-testid is not available)
    // this.pageTitle = page.locator('h1').first();
    // this.logoutButton = page.locator('button:has-text("Logout")');
  }

  /**
   * Navigate to the dashboard page
   */
  async goto(): Promise<void> {
    await this.navigate(this.dashboardUrl);
    await this.waitForPageLoad();
  }

  /**
   * Get welcome message text
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Get page title text
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Click on user profile menu
   */
  async openUserProfileMenu(): Promise<void> {
    await this.click(this.userProfileMenu);
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await this.openUserProfileMenu();
    await this.click(this.logoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a specific section using the navigation menu
   * @param section - Section name (home, profile, settings, reports)
   */
  async navigateToSection(section: 'home' | 'profile' | 'settings' | 'reports'): Promise<void> {
    const sectionMap = {
      home: this.homeLink,
      profile: this.profileLink,
      settings: this.settingsLink,
      reports: this.reportsLink,
    };

    await this.click(sectionMap[section]);
    await this.waitForPageLoad();
  }

  /**
   * Perform a search
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.fill(this.searchBar, searchTerm);
    await this.pressKey('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Click notification icon
   */
  async openNotifications(): Promise<void> {
    await this.click(this.notificationIcon);
  }

  /**
   * Verify dashboard is loaded successfully
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.verifyElementVisible(this.pageTitle);
    await this.verifyElementVisible(this.navigationMenu);
    await this.verifyUrlContains('/dashboard');
  }

  /**
   * Verify user is logged in (check for user profile menu)
   */
  async verifyUserLoggedIn(): Promise<void> {
    await this.verifyElementVisible(this.userProfileMenu);
  }

  /**
   * Verify welcome message contains username
   * @param username - Expected username in welcome message
   */
  async verifyWelcomeMessageContains(username: string): Promise<void> {
    await this.verifyTextContains(this.welcomeMessage, username);
  }

  /**
   * Check if user is on dashboard page
   * @returns True if on dashboard, false otherwise
   */
  async isOnDashboard(): Promise<boolean> {
    return this.getCurrentUrl().includes('/dashboard');
  }

  /**
   * Wait for dashboard to be fully loaded
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    await this.waitForElement(this.navigationMenu);
    await this.waitForPageLoad();
  }
}
