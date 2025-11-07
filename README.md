# QA Portal Automation Framework

## 🎯 Overview
Comprehensive Playwright automation framework for QA Portal testing with UI and Visual Regression capabilities.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Reporting](#reporting)
- [CI/CD](#cicd)
- [Best Practices](#best-practices)

---

## 🔧 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Latest version
- **VS Code**: (Recommended) with Playwright extension

---

## 📦 Installation

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd qa-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment file
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your settings:
```
BASE_URL=http://localhost:3000
TEST_USERNAME=testuser
TEST_PASSWORD=testpass123
```

---

## 📁 Project Structure

```
qa-automation-framework/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│       └── playwright.yml
├── src/
│   ├── pages/                  # Page Object Models
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── components/             # Reusable UI components
│   │   └── header.component.ts
│   ├── fixtures/               # Custom test fixtures
│   │   └── auth.fixture.ts
│   └── utils/                  # Helper utilities
│       ├── test-data.util.ts
│       ├── wait.util.ts
│       └── screenshot.util.ts
├── tests/
│   ├── e2e/                    # End-to-end tests
│   ├── smoke/                  # Smoke tests
│   ├── visual/                 # Visual regression tests
│   └── auth/                   # Authentication tests
├── test-data/
│   ├── users.json              # Test user data
│   └── test-config.json        # Test configurations
├── config/
│   └── playwright.config.ts    # Playwright configuration
├── reports/                    # Test reports (git-ignored)
├── screenshots/                # Test screenshots (git-ignored)
├── test-results/              # Test results (git-ignored)
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Running Tests

### Local Execution

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npm test tests/smoke/login.spec.ts

# Run tests by tag
npm run test:smoke
npm run test:visual

# Run with specific browser
npm test -- --project=chromium
npm test -- --project=firefox

# Debug mode
npm run test:debug

# UI Mode (interactive)
npm run test:ui
```

### Test Reports

```bash
# Generate and open Allure report
npm run report:allure

# Open Playwright HTML report
npm run report:html

# Show last test report
npx playwright show-report
```

---

## ✍️ Writing Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('testuser', 'testpass123');
    
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Using Page Objects

```typescript
// Create page object
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.fillUsername('user@test.com');
await loginPage.fillPassword('password');
await loginPage.clickLogin();
```

### Visual Regression Testing

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## 📊 Reporting

### Allure Reports
- Detailed test execution reports
- Historical trends
- Test attachments (screenshots, videos)
- Categorized failures

### Playwright HTML Report
- Built-in HTML report
- Video recordings on failure
- Trace viewer for debugging

---

## 🔄 CI/CD (GitHub Actions)

Tests run automatically on:
- **Push** to main/develop branches
- **Pull Requests**
- **Scheduled** (daily at 2 AM)

Manual trigger:
- Go to Actions tab → Select workflow → Run workflow

---

## ✅ Best Practices

### 1. **Page Objects**
- Keep page objects simple and focused
- Use descriptive method names
- Return page objects for method chaining

### 2. **Test Organization**
- Group related tests in describe blocks
- Use meaningful test names
- Tag tests appropriately (@smoke, @regression)

### 3. **Assertions**
- Use Playwright's built-in assertions
- Wait for elements automatically
- Avoid hard waits (sleep)

### 4. **Test Data**
- Use JSON files for test data
- Don't hardcode credentials
- Generate dynamic data when needed

### 5. **Debugging**
- Use `await page.pause()` to debug
- Check screenshots on failures
- Use trace viewer for complex issues

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Write tests following the patterns
3. Run tests locally: `npm test`
4. Commit changes: `git commit -m "Add: your feature"`
5. Push and create PR

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Allure Reports](https://docs.qameta.io/allure/)
- [Team Wiki](link-to-your-wiki)

---

## 🆘 Troubleshooting

### Common Issues

**Tests failing locally?**
- Check if the app is running (http://localhost:3000)
- Verify `.env` configuration
- Clear browser cache: `npx playwright install --force`

**Allure reports not generating?**
- Install Allure: `npm install -g allure-commandline`
- Clean reports: `npm run report:clean`

**Need help?**
- Check existing issues
- Ask in team Slack channel
- Contact QA Lead

---

## 📝 Version History

- **v1.0.0** - Initial framework setup
  - Page Object Model implementation
  - Visual regression testing
  - Allure reporting
  - GitHub Actions CI/CD

---

**Maintained by:** QA Automation Team  
**Last Updated:** November 2025
