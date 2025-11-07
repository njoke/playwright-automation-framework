# Framework Architecture Documentation

## 📐 Framework Design

### **Architecture Pattern**
This framework follows the **Page Object Model (POM)** design pattern with additional component-based architecture for reusable UI elements.

```
┌─────────────────────────────────────────────────────────────┐
│                      TEST LAYER                             │
│  (tests/smoke, tests/e2e, tests/visual)                   │
│  - Test specifications                                      │
│  - Test data consumption                                    │
│  - Assertions and validations                              │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│                   FIXTURE LAYER                             │
│  (src/fixtures/)                                            │
│  - Authentication fixtures                                  │
│  - Custom hooks and setup                                   │
│  - Test context management                                  │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              PAGE OBJECT LAYER                              │
│  (src/pages/)                                               │
│  - Page classes (LoginPage, DashboardPage)                  │
│  - Locator definitions                                      │
│  - Page-specific actions                                    │
│  - Page assertions                                          │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              COMPONENT LAYER                                │
│  (src/components/)                                          │
│  - Reusable UI components (Header, Modal, etc.)            │
│  - Shared component actions                                 │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│                BASE PAGE LAYER                              │
│  (src/pages/base.page.ts)                                   │
│  - Common page methods                                      │
│  - Generic element interactions                             │
│  - Wait strategies                                          │
│  - Screenshot utilities                                     │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│               UTILITY LAYER                                 │
│  (src/utils/)                                               │
│  - Test data generators (Faker)                             │
│  - Wait utilities                                           │
│  - Screenshot utilities                                     │
│  - Helper functions                                         │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              PLAYWRIGHT API                                 │
│  - Browser automation                                       │
│  - Network interception                                     │
│  - Context management                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Key Design Principles

### **1. Single Responsibility**
Each class has one clear purpose:
- **Pages**: Handle page-specific logic
- **Components**: Handle reusable UI elements
- **Utils**: Provide helper functions
- **Tests**: Define test scenarios only

### **2. DRY (Don't Repeat Yourself)**
- Common functionality in base classes
- Reusable components for shared UI elements
- Utility functions for repetitive tasks

### **3. Maintainability**
- Clear naming conventions
- Comprehensive documentation
- Logical folder structure
- Type safety with TypeScript

### **4. Scalability**
- Easy to add new pages and tests
- Modular architecture
- Parallel execution support
- Environment-based configuration

---

## 📁 Folder Structure Explained

### **/src/pages/**
Contains Page Object Model classes representing application pages.

**Structure:**
```
src/pages/
├── base.page.ts           # Base class with common methods
├── login.page.ts          # Login page object
├── dashboard.page.ts      # Dashboard page object
└── [feature].page.ts      # Add more pages as needed
```

**Best Practices:**
- One class per page
- Extend BasePage for common functionality
- Use data-testid for locators (most stable)
- Include assertion methods for cleaner tests
- Document all public methods

### **/src/components/**
Reusable UI components that appear across multiple pages.

**Examples:**
- Header/Navigation
- Modals/Dialogs
- Forms
- Cards/Lists

**Best Practices:**
- Keep components focused and reusable
- Independent from specific pages
- Clear, descriptive method names

### **/src/fixtures/**
Custom Playwright fixtures for test setup and teardown.

**Key Fixtures:**
- `authenticatedPage`: Pre-logged-in browser context
- `adminPage`: Pre-logged-in admin context
- Custom data fixtures

**Benefits:**
- Reduce test boilerplate
- Consistent setup across tests
- Better performance with reusable contexts

### **/src/utils/**
Helper utilities and functions.

**Utilities:**
- `TestDataUtil`: Generate test data with Faker
- `WaitUtil`: Advanced wait strategies
- `ScreenshotUtil`: Screenshot management
- `ApiUtil`: API helper methods (add as needed)

### **/tests/**
Test specifications organized by type.

**Organization:**
```
tests/
├── smoke/          # Critical path tests (fast)
├── e2e/            # Complete user journeys
├── regression/     # Comprehensive feature tests
└── visual/         # Visual regression tests
```

**Naming Convention:**
- `[feature].spec.ts` for test files
- Descriptive test names
- Use tags for filtering (@smoke, @e2e, @visual)

### **/test-data/**
Static test data files.

**Files:**
- `users.json`: User credentials
- `test-config.json`: Test configurations
- `.auth/`: Storage states (gitignored)

---

## 🔧 Configuration Files

### **playwright.config.ts**
Main Playwright configuration.

**Key Settings:**
- Browser projects (Chromium, Firefox, WebKit)
- Parallel execution (workers)
- Timeouts and retries
- Reporter configuration
- Base URL and environment setup

### **tsconfig.json**
TypeScript configuration.

**Features:**
- Path aliases (@pages, @utils, @components)
- Strict type checking
- ES modules support

### **.env**
Environment variables (not committed to git).

**Variables:**
- BASE_URL
- TEST_USERNAME/PASSWORD
- API endpoints
- Feature flags

---

## 🎭 Locator Strategy

### **Priority Order:**
1. **data-testid** (Highest priority - most stable)
   ```typescript
   this.loginButton = page.locator('[data-testid="login-button"]');
   ```

2. **Role-based selectors** (Accessible and semantic)
   ```typescript
   this.loginButton = page.getByRole('button', { name: 'Login' });
   ```

3. **CSS selectors** (Fallback)
   ```typescript
   this.loginButton = page.locator('.login-button');
   ```

4. **XPath** (Last resort - avoid if possible)

### **Locator Best Practices:**
- Use `.or()` for fallback strategies
- Avoid fragile selectors (e.g., nth-child, absolute paths)
- Prefer semantic HTML and ARIA attributes
- Keep locators in page objects only

---

## 🧪 Test Organization

### **Test Hierarchy:**
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Cleanup
  });
});
```

### **Test Tags:**
```typescript
test('login test @smoke @critical', async ({ page }) => {
  // Tagged test
});
```

**Run tagged tests:**
```bash
npm run test:smoke     # Run smoke tests
npm run test:visual    # Run visual tests
```

---

## 🔄 Test Execution Flow

### **1. Setup Phase**
- Read configuration
- Start browser instances
- Setup fixtures
- Load test data

### **2. Execution Phase**
- Navigate to pages
- Interact with elements
- Perform actions
- Make assertions

### **3. Reporting Phase**
- Capture screenshots (on failure)
- Generate reports
- Save artifacts

### **4. Teardown Phase**
- Close browsers
- Clean up resources
- Archive results

---

## 📊 Reporting

### **Built-in Reports:**
1. **HTML Report**: Interactive report with screenshots
2. **Allure Report**: Detailed analytics and trends
3. **JSON Report**: Machine-readable results
4. **JUnit Report**: CI/CD integration

### **Accessing Reports:**
```bash
# Playwright HTML
npm run report:html

# Allure
npm run report:allure

# Last run
npx playwright show-report
```

---

## 🚀 CI/CD Integration

### **GitHub Actions Workflow:**
- Runs on push, PR, and schedule
- Parallel execution across browsers
- Automatic report generation
- Artifact upload
- GitHub Pages deployment

### **Pipeline Stages:**
1. Lint and type check
2. Smoke tests (quick validation)
3. E2E tests (full coverage)
4. Visual tests
5. Report generation
6. Notifications

---

## 🔐 Authentication Strategy

### **Options:**
1. **Login in each test**: Slowest but most isolated
2. **Fixture-based auth**: Login once, reuse context
3. **Storage state**: Save auth, reuse across tests

### **Current Implementation:**
Uses custom fixtures (`authenticatedPage`) for optimal balance of speed and isolation.

---

## 🎨 Visual Testing

### **Strategy:**
- Baseline screenshots on first run
- Pixel-by-pixel comparison
- Configurable threshold
- Responsive breakpoint testing

### **Best Practices:**
- Hide dynamic content (timestamps)
- Mask sensitive data
- Test multiple viewports
- Update baselines intentionally

---

## 📈 Scaling the Framework

### **Adding New Pages:**
1. Create page class extending `BasePage`
2. Define locators
3. Add page-specific methods
4. Document public API

### **Adding New Tests:**
1. Choose appropriate folder (smoke/e2e/visual)
2. Import required page objects
3. Use fixtures for setup
4. Add descriptive names and tags

### **Adding Utilities:**
1. Create utility class in `/src/utils/`
2. Make methods static
3. Document with JSDoc
4. Add unit tests if complex

---

## 🐛 Debugging Tips

### **Tools:**
- `await page.pause()`: Interactive debugging
- UI Mode: `npm run test:ui`
- Trace viewer: Analyze failed tests
- Screenshots: Automatic on failure

### **Common Issues:**
- **Timeouts**: Increase timeout or improve waits
- **Flaky tests**: Add proper wait conditions
- **Selector issues**: Use better locator strategies

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Maintained by:** QA Automation Team  
**Version:** 1.0.0  
**Last Updated:** November 2025
