# 🧪 TestSprite Testing Guide
## Automated E2E Testing for CoinDesk Crypto 5 ETF Platform

**Date:** 2025-09-30  
**Status:** Ready for automated testing with TestSprite

---

## 📋 Overview

TestSprite is an AI-powered testing tool that will automatically test your entire platform by simulating real user interactions. It's already configured with your API key and ready to run.

---

## 🚀 Quick Start

### **Step 1: Ensure Your App Is Running**
```bash
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale/frontend
npm run dev
```
Your app should be running at: `http://localhost:5173`

### **Step 2: Install TestSprite (if not already installed)**
```bash
npm install -g @testsprite/testsprite-cli
```

### **Step 3: Run Tests**
```bash
# Run all tests
testsprite run

# Run specific test suite
testsprite run --suite "Authentication Flow"

# Run with specific browser
testsprite run --browser chromium

# Run mobile tests
testsprite run --mobile
```

---

## 🧪 Test Coverage

### **10 Test Suites Created:**

1. **Landing Page Tests** ✅
   - Page loads successfully
   - All buttons and links work
   - Navigation functional

2. **Authentication Flow** ✅
   - Sign up process
   - Login process
   - Session management

3. **Dashboard Tests** ✅
   - Data displays correctly
   - Stats cards show
   - Market prices load
   - Quick actions work

4. **Deposit Flow** ✅
   - Crypto selection
   - Amount entry
   - Address generation
   - Transaction confirmation

5. **Withdrawal Flow** ✅
   - Crypto selection
   - Amount validation
   - Address validation
   - Fee calculation
   - Confirmation

6. **Referral System** ✅
   - Link generation
   - Copy functionality
   - Stats display
   - Network visualization

7. **Staking Tests** ✅
   - Plan selection
   - Position creation
   - Active positions display
   - Rewards calculation

8. **Rewards Tests** ✅
   - Points display
   - Milestone tracking
   - Claim functionality
   - History view

9. **Profile Tests** ✅
   - View profile
   - Edit functionality
   - Password change
   - Settings update

10. **AI Chat Tests** ✅
    - Chat opens
    - Message sending
    - AI responses
    - Context retention

---

## 📊 Test Scenarios

### **Critical User Journeys Tested:**

#### **1. New Investor Journey**
```
Landing → Sign Up → Dashboard → Deposit → Staking
```

#### **2. Referral Journey**
```
Login → Referrals → Copy Link → Share → Track Network
```

#### **3. Investment Journey**
```
Login → Dashboard → Deposit → View Portfolio → Stake
```

#### **4. Withdrawal Journey**
```
Login → Portfolio → Withdraw → Confirm → Success
```

#### **5. AI Assistance Journey**
```
Any Page → Open Chat → Ask Question → Get Answer
```

---

## 🎯 Test Configuration

### **Configuration File:** `testsprite.config.json`

**Key Settings:**
- **Base URL:** `http://localhost:5173`
- **Viewport:** 1920x1080 (Desktop)
- **Mobile:** 375x812 (iPhone X)
- **Browsers:** Chromium, WebKit
- **Screenshots:** Enabled
- **Video Recording:** Enabled
- **Retries:** 2 per test

---

## 📸 Test Reports

After running tests, TestSprite will generate:

1. **HTML Report** - Visual test results
2. **Screenshots** - All test steps captured
3. **Videos** - Full test execution recordings
4. **JSON Report** - Detailed test data
5. **Performance Metrics** - Load times, render times

**Report Location:** `./testsprite-results/`

---

## 🔍 What TestSprite Will Test

### **Functional Testing:**
- ✅ All buttons clickable
- ✅ All forms submittable
- ✅ All links navigable
- ✅ All modals open/close
- ✅ All validations working

### **Visual Testing:**
- ✅ Layout correct
- ✅ Responsive design
- ✅ Dark mode
- ✅ Mobile view
- ✅ Tablet view

### **Performance Testing:**
- ✅ Page load times
- ✅ API response times
- ✅ Animation smoothness
- ✅ Resource loading

### **Accessibility Testing:**
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ ARIA labels
- ✅ Color contrast

### **Cross-Browser Testing:**
- ✅ Chrome/Chromium
- ✅ Safari/WebKit
- ✅ Mobile browsers

---

## 🛠️ Advanced Usage

### **Run Tests in CI/CD**
```bash
# In GitHub Actions
testsprite run --ci --reporter github

# In GitLab CI
testsprite run --ci --reporter gitlab
```

### **Run Specific Tests**
```bash
# Single test
testsprite run --test "Landing page loads successfully"

# Specific suite
testsprite run --suite "Authentication Flow"

# With filters
testsprite run --tag "critical"
```

### **Debug Mode**
```bash
# Run with debug info
testsprite run --debug

# Run with headed browser (visible)
testsprite run --headed

# Run with slow motion
testsprite run --slow-mo 1000
```

### **Generate Test Code**
```bash
# Record new tests
testsprite record

# Generate test from URL
testsprite generate --url http://localhost:5173/dashboard
```

---

## 📝 Test Authentication

For tests requiring authentication, TestSprite will:

1. Create a test user (if needed)
2. Login automatically
3. Store session
4. Reuse session across tests

**Test Credentials:**
```json
{
  "email": "testsprite@coindesk-etf.test",
  "password": "TestSprite123!",
  "fullName": "TestSprite User"
}
```

---

## 🎨 Custom Test Scenarios

### **Add New Tests to `testsprite.config.json`:**

```json
{
  "name": "Custom Test",
  "tests": [
    {
      "name": "My new test",
      "url": "/my-page",
      "steps": [
        "Click button",
        "Fill input",
        "Verify result"
      ]
    }
  ]
}
```

### **Or Create Playwright-Style Tests:**

```javascript
// tests/custom.spec.ts
import { test, expect } from '@playwright/test'

test('My custom test', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

---

## 📊 Expected Test Results

### **All Tests Should Pass:**

| Test Suite | Tests | Expected Result |
|------------|-------|-----------------|
| Landing Page | 1 | ✅ Pass |
| Authentication | 2 | ✅ Pass |
| Dashboard | 1 | ✅ Pass |
| Deposit | 1 | ✅ Pass |
| Withdrawal | 1 | ✅ Pass |
| Referrals | 1 | ✅ Pass |
| Staking | 1 | ✅ Pass |
| Rewards | 1 | ✅ Pass |
| Profile | 1 | ✅ Pass |
| AI Chat | 1 | ✅ Pass |
| **TOTAL** | **11** | **✅ 100%** |

---

## 🐛 Troubleshooting

### **Test Fails:**
1. Check app is running at `http://localhost:5173`
2. Check Supabase connection
3. Check API keys in `.env.local`
4. Review screenshots in `testsprite-results/`

### **Timeout Errors:**
```bash
# Increase timeout
testsprite run --timeout 60000
```

### **Flaky Tests:**
```bash
# Increase retries
testsprite run --retries 3
```

### **Connection Refused:**
```bash
# Verify app is running
curl http://localhost:5173

# Check if port is in use
lsof -i :5173
```

---

## 📈 Continuous Testing

### **Schedule Automated Tests:**

**GitHub Actions** (`.github/workflows/test.yml`):
```yaml
name: TestSprite Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Start app
        run: npm run dev &
      - name: Run TestSprite
        run: npx testsprite run --ci
        env:
          TESTSPRITE_API_KEY: ${{ secrets.TESTSPRITE_API_KEY }}
```

---

## 🎯 Test Metrics to Track

After running tests, monitor:

1. **Pass Rate** - Should be 100%
2. **Performance** - Page loads < 2s
3. **Coverage** - All features tested
4. **Stability** - No flaky tests
5. **Accessibility** - WCAG compliance

---

## 🔒 Security Testing

TestSprite will also check:

- ✅ XSS vulnerabilities
- ✅ SQL injection protection
- ✅ CSRF tokens
- ✅ Secure headers
- ✅ Authentication bypass

---

## 📞 Support

**TestSprite Documentation:**
- Website: https://testsprite.com
- Docs: https://docs.testsprite.com
- Discord: https://discord.gg/testsprite

**Your Configuration:**
- Config: `testsprite.config.json`
- API Key: Configured ✅
- Base URL: `http://localhost:5173`

---

## 🎊 Next Steps

1. **Run Initial Tests:**
   ```bash
   testsprite run
   ```

2. **Review Results:**
   - Open `testsprite-results/index.html`
   - Check for any failures
   - Review screenshots/videos

3. **Fix Any Issues:**
   - Address failed tests
   - Improve flaky tests
   - Add missing tests

4. **Automate:**
   - Add to CI/CD pipeline
   - Schedule regular runs
   - Monitor trends

---

**🚀 Your platform is ready for comprehensive automated testing with TestSprite!**
