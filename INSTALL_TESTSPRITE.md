# TestSprite Installation Guide

## 🚨 Current Status: Node.js Not Available

Since Node.js and npm are not currently installed on your system, here's how to install them and then run TestSprite:

---

## 📋 Prerequisites Installation

### **Option 1: Install Node.js via Official Website (Recommended)**

1. **Download Node.js**
   - Go to [nodejs.org](https://nodejs.org)
   - Download the LTS version (18.x or higher)
   - Choose the macOS installer (.pkg file)

2. **Install Node.js**
   - Double-click the downloaded .pkg file
   - Follow the installation wizard
   - Restart your terminal

3. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

### **Option 2: Install via Homebrew (if available)**

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### **Option 3: Install via Node Version Manager (NVM)**

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node.js
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

---

## 🚀 After Node.js Installation

Once Node.js is installed, run these commands:

### **1. Install TestSprite Dependencies**
```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
npm install
```

### **2. Install Playwright Browsers**
```bash
npx playwright install
```

### **3. Run Tests**
```bash
# Make script executable (if needed)
chmod +x run-tests.sh

# Run all tests
./run-tests.sh

# Or run specific test suites
./run-tests.sh smoke
./run-tests.sh auth
./run-tests.sh signup
```

### **4. View Test Results**
```bash
# Open HTML report
./run-tests.sh report

# Or manually
npx playwright show-report test-results/html
```

---

## 🔧 Alternative: Manual TestSprite Installation

If you prefer to install TestSprite manually:

### **1. Install TestSprite Globally**
```bash
npm install -g testsprite
```

### **2. Install Project Dependencies**
```bash
npm install @playwright/test
```

### **3. Run Tests Directly**
```bash
# Run all tests
testsprite

# Run specific test file
testsprite tests/auth/signup.spec.js

# Run with specific options
testsprite --headed --browser=chromium
```

---

## 🐛 Troubleshooting

### **Issue: "npm not found"**
**Solution:** Install Node.js first (see options above)

### **Issue: "Permission denied"**
**Solution:** 
```bash
sudo npm install -g testsprite
```

### **Issue: "Playwright browsers not found"**
**Solution:**
```bash
npx playwright install
```

### **Issue: "Tests fail to run"**
**Solution:**
1. Check if your application is running
2. Verify environment variables are set
3. Check database connection
4. Review test configuration

---

## 📊 Expected Test Results

After successful installation and running tests, you should see:

### **Test Output**
```
🚀 Starting TestSprite Test Suite for CoinDesk Crypto 5 ETF
==========================================================
[INFO] Checking TestSprite installation...
[SUCCESS] TestSprite is available
[INFO] Checking Playwright browsers...
[SUCCESS] Playwright browsers are ready
[INFO] Running Smoke Tests...
[SUCCESS] Smoke Tests completed successfully
[INFO] Running Authentication Tests...
[SUCCESS] Authentication Tests completed successfully
...
[SUCCESS] Test execution completed!
```

### **Test Reports**
- **HTML Report**: `test-results/html/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `test-results/screenshots/`

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js (18.x or higher)
- [ ] Verify npm is available
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Run `npx playwright install`
- [ ] Run `./run-tests.sh`
- [ ] View results with `./run-tests.sh report`

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Check npm version**: `npm --version`
3. **Verify project directory**: Make sure you're in the correct folder
4. **Check file permissions**: Ensure scripts are executable
5. **Review error messages**: Look for specific error details

---

## 🎉 Ready to Test!

Once Node.js is installed, your TestSprite test suite will be ready to comprehensively test your CoinDesk Crypto 5 ETF platform!

**Install Node.js first, then come back to run the tests!** 🚀

