# 🚀 Quick Start Guide

Get up and running with the QA Automation Framework in under 10 minutes!

---

## ⚡ Quick Setup (5 minutes)

### **1. Prerequisites Check**
```bash
# Check Node.js version (needs 18+)
node --version

# Check npm version (needs 9+)
npm --version
```

### **2. Install Dependencies**
```bash
# Install all packages
npm install

# Install Playwright browsers
npx playwright install
```

### **3. Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# At minimum, update:
# - BASE_URL=http://localhost:3000
# - TEST_USERNAME=your-username
# - TEST_PASSWORD=your-password
```

### **4. Run Your First Test**
```bash
# Run smoke tests
npm run test:smoke

# View the report
npm run report:html
```

✅ **You're ready to go!**

---

## 📖 Writing Your First Test (10 minutes)

### **Step 1: Create a Test File**

Create `tests/smoke/my-first-test.spec.ts`:

```typescript
import { test, expect } from '../../src/fixtures/auth.fixture';
import { LoginPage } from '../../src/pages/login.page';

test.describe('My First Test @smoke', () => {
  test('should display login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verify page is displayed
    await loginPage.assertLoginPageDisplayed();
    
    // Take a screenshot
    await page.screenshot({ path: 'screenshots/my-first-test.png' });
  });
});
```

### **Step 2: Run Your Test**
```bash
npm test tests/smoke/my-first-test.spec.ts
```

### **Step 3: View Results**
```bash
npm run report:html
```

---

## 🎯 Common Tasks

### **Run Different Test Types**
```bash
# Smoke tests (fast, critical paths)
npm run test:smoke

# E2E tests (complete user journeys)
npm run test:e2e

# Visual tests (UI regression)
npm run test:visual

# All tests
npm test
```

### **Run with Specific Browser**
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### **Debug Tests**
```bash
# Debug mode (opens inspector)
npm run test:debug

# UI Mode (interactive)
npm run test:ui

# Headed mode (see browser)
npm run test:headed
```

### **View Reports**
```bash
# Playwright HTML report
npm run report:html

# Allure report
npm run report:allure
```

---

## 📝 Creating Page Objects

### **Step 1: Create Page Class**

Create `src/pages/settings.page.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  readonly url = '/settings';
  
  // Locators
  readonly pageTitle: Locator;
  readonly saveButton: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.pageTitle = page.locator('[data-testid="settings-title"]');
    this.saveButton = page.locator('[data-testid="save-button"]');
  }
  
  // Actions
  async goto(): Promise<void> {
    await super.goto(this.url);
  }
  
  async saveSettings(): Promise<void> {
    await this.click(this.saveButton);
  }
}
```

### **Step 2: Use in Tests**

```typescript
import { SettingsPage } from '../../src/pages/settings.page';

test('should save settings', async ({ authenticatedPage }) => {
  const settingsPage = new SettingsPage(authenticatedPage);
  await settingsPage.goto();
  await settingsPage.saveSettings();
});
```

---

## 🔧 Using Test Data

### **Option 1: Static Data from JSON**
```typescript
import * as testData from '../../test-data/users.json';

test('login test', async ({ page }) => {
  const user = testData.validUsers[0];
  await loginPage.login(user.username, user.password);
});
```

### **Option 2: Dynamic Data with Faker**
```typescript
import { TestDataUtil } from '../../src/utils/test-data.util';

test('create user test', async ({ page }) => {
  const user = TestDataUtil.generateUser();
  // user.email, user.firstName, user.password are all random
});
```

---

## 🎨 Visual Testing

### **Step 1: Create Visual Test**
```typescript
test('homepage visual test @visual', async ({ page }) => {
  await page.goto('/');
  
  // First run creates baseline
  // Subsequent runs compare against baseline
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### **Step 2: Run Visual Tests**
```bash
npm run test:visual
```

### **Step 3: Update Baselines (when UI changes intentionally)**
```bash
npx playwright test --update-snapshots
```

---

## 🔐 Authentication Shortcuts

### **Use Pre-authenticated Context**
```typescript
test('dashboard test', async ({ authenticatedPage }) => {
  // Already logged in!
  const dashboard = new DashboardPage(authenticatedPage);
  await dashboard.goto();
  await dashboard.assertDashboardDisplayed();
});
```

### **Use Admin Context**
```typescript
test('admin test', async ({ adminPage }) => {
  // Logged in as admin!
  // Has elevated permissions
});
```

---

## 🐛 Debugging

### **Interactive Debugging**
```typescript
test('debug test', async ({ page }) => {
  await page.goto('/');
  
  // Pause execution - opens Playwright Inspector
  await page.pause();
  
  // Continue from here...
});
```

### **UI Mode (Recommended)**
```bash
npm run test:ui
# Opens interactive test explorer
# Click through tests
# Time-travel debugging
```

### **Screenshots on Failure**
Automatic! Check `test-results/failures/` folder.

---

## 📊 Reports & Artifacts

### **Where to Find Stuff**

```
Reports:
├── playwright-report/      # HTML report
├── allure-report/          # Allure report
├── test-results/           # Raw results
│   ├── failures/           # Failure screenshots
│   └── visual/             # Visual test snapshots
└── screenshots/            # Manual screenshots
```

### **Open Reports**
```bash
# Playwright report
npm run report:html

# Allure report
npm run report:allure
```

---

## 💡 Tips & Tricks

### **1. Use Locator Strategies**
```typescript
// ✅ Good - Stable
page.locator('[data-testid="login-button"]')
page.getByRole('button', { name: 'Login' })

// ❌ Avoid - Fragile
page.locator('.btn-primary')
page.locator('div > div > button')
```

### **2. Wait for Elements**
```typescript
// ✅ Good - Auto-waits
await expect(locator).toBeVisible();
await locator.click();

// ❌ Avoid - Hard waits
await page.waitForTimeout(5000);
```

### **3. Use Fixtures**
```typescript
// ✅ Good - Clean and reusable
test('test', async ({ authenticatedPage }) => {
  // Page is already logged in
});

// ❌ Avoid - Repeating login in every test
test('test', async ({ page }) => {
  await loginPage.goto();
  await loginPage.login();
  // Now do actual test...
});
```

### **4. Organize Tests with Tags**
```typescript
test('critical flow @smoke @critical', async () => {});
test('edge case @regression', async () => {});
test('ui check @visual', async () => {});
```

Run specific tags:
```bash
npm run test:smoke      # Only @smoke tests
npm test -- --grep @critical  # Only @critical tests
```

---

## 🆘 Common Issues & Solutions

### **Issue: Tests timeout**
```typescript
// Solution: Increase timeout or add better waits
test.setTimeout(60000); // 60 seconds

// Or use proper waits
await page.waitForLoadState('networkidle');
```

### **Issue: Element not found**
```typescript
// Solution: Add wait or check locator
await page.locator('[data-testid="element"]').waitFor();
```

### **Issue: Tests are flaky**
```typescript
// Solution: Add auto-retrying assertions
await expect(locator).toBeVisible(); // Auto-retries

// Avoid:
const isVisible = await locator.isVisible(); // No retry
```

---

## 📞 Getting Help

### **Resources**
- **Framework Docs**: `docs/ARCHITECTURE.md`
- **Playwright Docs**: https://playwright.dev
- **Team Wiki**: [Your team wiki link]
- **Slack Channel**: #qa-automation

### **Before Asking for Help**
1. Check error message and stack trace
2. Review test in UI mode: `npm run test:ui`
3. Look at failure screenshot
4. Check if others had similar issues

---

## 🎓 Next Steps

1. ✅ Run your first test
2. ✅ Create a page object
3. ✅ Write a new test
4. ✅ Add visual regression test
5. ✅ Review reports
6. 📖 Read ARCHITECTURE.md for deeper understanding
7. 🚀 Start automating!

---

**Happy Testing! 🎉**

*Questions? Reach out to the QA team!*
