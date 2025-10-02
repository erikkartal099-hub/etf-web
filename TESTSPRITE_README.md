# TestSprite Test Suite for CoinDesk Crypto 5 ETF

## 🎯 Overview

This comprehensive TestSprite test suite provides automated testing for the CoinDesk Crypto 5 ETF investment platform. It covers all major functionality including authentication, portfolio management, referral system, and API integration.

## 📋 Test Coverage

### **Authentication Tests**
- ✅ User signup flow
- ✅ User login flow
- ✅ Form validation
- ✅ Error handling
- ✅ Email verification
- ✅ Password reset

### **Dashboard Tests**
- ✅ Dashboard display
- ✅ Navigation functionality
- ✅ Real-time data updates
- ✅ Responsive design
- ✅ Quick actions

### **Portfolio Tests**
- ✅ Portfolio overview
- ✅ Asset allocation
- ✅ Performance metrics
- ✅ Transaction history
- ✅ Export functionality

### **Referral System Tests**
- ✅ 5-level referral pyramid
- ✅ Referral link generation
- ✅ Bonus structure display
- ✅ Network visualization
- ✅ Referral statistics

### **API Integration Tests**
- ✅ Supabase connection
- ✅ User authentication
- ✅ Database operations
- ✅ Real-time updates
- ✅ Error handling

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
# Install TestSprite and dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### **2. Run Tests**
```bash
# Run all tests
./run-tests.sh

# Run specific test suite
./run-tests.sh smoke
./run-tests.sh auth
./run-tests.sh signup
./run-tests.sh dashboard
./run-tests.sh portfolio
./run-tests.sh referrals
./run-tests.sh api
./run-tests.sh e2e
```

### **3. View Results**
```bash
# Open HTML report
./run-tests.sh report

# Or manually
npx playwright show-report test-results/html
```

## 📁 Test Structure

```
tests/
├── auth/                    # Authentication tests
│   ├── signup.spec.js      # User signup flow
│   └── login.spec.js       # User login flow
├── e2e/                    # End-to-end tests
│   ├── dashboard.spec.js   # Dashboard functionality
│   ├── portfolio.spec.js   # Portfolio management
│   └── referrals.spec.js   # Referral system
├── api/                    # API integration tests
│   └── supabase.spec.js    # Supabase API tests
├── utils/                  # Test utilities
│   └── test-helpers.js     # Helper functions
├── global-setup.js         # Global test setup
└── global-teardown.js      # Global test cleanup
```

## ⚙️ Configuration

### **TestSprite Configuration**
The `testsprite.config.js` file contains:
- Test environment settings
- Browser configuration
- Timeout settings
- Test data configuration
- Reporter settings

### **Environment Variables**
Tests use the following environment variables:
```bash
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Test Data**
Test data is automatically generated for each test run:
- Unique email addresses
- Test user credentials
- Test transaction hashes
- Test wallet addresses

## 🧪 Test Suites

### **Smoke Tests**
Quick tests for critical functionality:
```bash
./run-tests.sh smoke
```

### **Authentication Tests**
Complete auth flow testing:
```bash
./run-tests.sh auth
```

### **API Tests**
Backend integration testing:
```bash
./run-tests.sh api
```

### **E2E Tests**
Full user journey testing:
```bash
./run-tests.sh e2e
```

### **Regression Tests**
Complete test suite:
```bash
./run-tests.sh regression
```

## 📊 Test Reports

### **HTML Report**
- Interactive test results
- Screenshots and videos
- Test timeline
- Error details

### **JSON Report**
- Machine-readable results
- CI/CD integration
- Custom reporting

### **JUnit Report**
- XML format
- CI/CD compatibility
- Test metrics

## 🔧 Advanced Usage

### **Run Tests in Headed Mode**
```bash
testsprite --headed
```

### **Run Tests in Debug Mode**
```bash
testsprite --debug
```

### **Run Tests with UI**
```bash
testsprite --ui
```

### **Run Specific Test File**
```bash
testsprite tests/auth/signup.spec.js
```

### **Run Tests in Specific Browser**
```bash
testsprite --project=chromium
testsprite --project=firefox
testsprite --project=webkit
```

## 🛠️ Customization

### **Adding New Tests**
1. Create test file in appropriate directory
2. Use test helpers from `utils/test-helpers.js`
3. Follow existing test patterns
4. Add to test suites in config

### **Test Helpers**
Available helper functions:
- `generateTestUser()` - Create test user data
- `loginUser()` - Login user
- `signUpUser()` - Sign up user
- `waitForElement()` - Wait for element
- `takeScreenshot()` - Take screenshot
- `cleanupTestData()` - Clean up test data

### **Custom Test Data**
Modify test data in `testsprite.config.js`:
```javascript
testData: {
  testUser: {
    email: 'custom@test.com',
    password: 'CustomPass123!',
    fullName: 'Custom User'
  }
}
```

## 🐛 Troubleshooting

### **Common Issues**

#### **TestSprite Not Found**
```bash
npm install -g testsprite
```

#### **Playwright Browsers Missing**
```bash
npx playwright install
```

#### **Environment Variables Missing**
Check `.env.local` file in frontend directory

#### **Tests Failing**
1. Check application is running
2. Verify database connection
3. Check test data setup
4. Review error logs

### **Debug Mode**
Run tests in debug mode to see detailed execution:
```bash
testsprite --debug
```

### **Verbose Output**
Enable verbose logging:
```bash
testsprite --verbose
```

## 📈 CI/CD Integration

### **GitHub Actions**
```yaml
name: TestSprite Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: ./run-tests.sh
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### **Jenkins**
```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
                sh './run-tests.sh'
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results/html',
                reportFiles: 'index.html',
                reportName: 'TestSprite Report'
            ])
        }
    }
}
```

## 📝 Best Practices

### **Test Writing**
1. Use descriptive test names
2. Test one thing at a time
3. Use page object pattern
4. Clean up test data
5. Handle async operations properly

### **Test Organization**
1. Group related tests
2. Use before/after hooks
3. Share common setup
4. Keep tests independent
5. Use meaningful assertions

### **Performance**
1. Use appropriate timeouts
2. Minimize test data
3. Clean up resources
4. Run tests in parallel
5. Use efficient selectors

## 🎯 Test Scenarios

### **Critical User Journeys**
1. **New User Onboarding**
   - Sign up → Email verification → Login → Dashboard

2. **Investment Flow**
   - Login → Deposit → Portfolio → Withdraw

3. **Referral Flow**
   - Login → Generate referral → Share → Track referrals

4. **Portfolio Management**
   - Login → View portfolio → Check performance → Export data

### **Edge Cases**
- Invalid credentials
- Network failures
- Database errors
- Browser compatibility
- Mobile responsiveness

## 📞 Support

### **Documentation**
- [TestSprite Documentation](https://testsprite.dev)
- [Playwright Documentation](https://playwright.dev)
- [Supabase Documentation](https://supabase.com/docs)

### **Issues**
Report issues in the project repository or contact the development team.

### **Contributing**
1. Fork the repository
2. Create feature branch
3. Add tests
4. Submit pull request

---

## 🎉 Ready to Test!

Your TestSprite test suite is now ready to comprehensively test the CoinDesk Crypto 5 ETF platform. Run the tests to ensure everything works perfectly!

```bash
./run-tests.sh
```

**Happy Testing!** 🚀

