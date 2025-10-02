# 🚀 Quick Install Guide: Node.js + TestSprite for macOS Intel

## 📋 **Step-by-Step Installation**

### **Option 1: Automated Installation (Recommended)**

Run this single command to install everything automatically:

```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
./install-nodejs-and-testsprite.sh
```

This script will:
- ✅ Install Node.js and npm
- ✅ Install TestSprite dependencies
- ✅ Install Playwright browsers
- ✅ Verify everything is working
- ✅ Set up your test environment

---

### **Option 2: Manual Installation**

If you prefer to install manually, follow these steps:

#### **Step 1: Install Node.js**

**Method A: Download from Official Website**
1. Go to: https://nodejs.org/en/download/
2. Click "macOS Installer (.pkg)" for LTS version
3. Download and run the installer
4. Follow the installation wizard

**Method B: Using Homebrew**
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Method C: Using NVM**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

#### **Step 2: Verify Installation**
```bash
node --version
npm --version
```

You should see output like:
```
v20.10.0
10.2.3
```

#### **Step 3: Install TestSprite Dependencies**
```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
npm install
npx playwright install
```

#### **Step 4: Verify TestSprite Setup**
```bash
./verify-test-setup.sh
```

#### **Step 5: Run Tests**
```bash
./run-tests.sh
```

#### **Step 6: View Results**
```bash
./run-tests.sh report
```

---

## 🎯 **Quick Commands Reference**

### **Installation Commands**
```bash
# Automated installation
./install-nodejs-and-testsprite.sh

# Manual installation
npm install
npx playwright install
```

### **Test Commands**
```bash
# Run all tests
./run-tests.sh

# Run specific test suites
./run-tests.sh smoke        # Quick smoke tests
./run-tests.sh auth         # Authentication tests
./run-tests.sh signup       # Signup flow tests
./run-tests.sh dashboard    # Dashboard tests
./run-tests.sh portfolio    # Portfolio tests
./run-tests.sh referrals    # Referral system tests
./run-tests.sh api          # API integration tests
./run-tests.sh e2e          # End-to-end tests
./run-tests.sh regression   # Full regression tests

# View test results
./run-tests.sh report
```

### **Verification Commands**
```bash
# Check Node.js installation
node --version
npm --version

# Verify TestSprite setup
./verify-test-setup.sh

# Check if everything is working
./run-tests.sh smoke
```

---

## 🔧 **Troubleshooting**

### **Issue: "node: command not found"**
**Solution**: 
1. Restart Terminal
2. Try reinstalling Node.js
3. Check PATH: `echo $PATH`

### **Issue: "npm: command not found"**
**Solution**: 
1. npm comes with Node.js, so reinstall Node.js
2. Check if npm is in PATH: `which npm`

### **Issue: Permission denied**
**Solution**:
```bash
sudo npm install -g npm@latest
```

### **Issue: Playwright browsers not installing**
**Solution**:
```bash
npx playwright install --with-deps
```

---

## 📊 **Expected Results**

### **After Node.js Installation**
```
$ node --version
v20.10.0

$ npm --version
10.2.3
```

### **After TestSprite Setup**
```
✅ TestSprite setup verification PASSED!
✅ All test files and configuration are properly set up
✅ Ready to run tests! Execute: ./run-tests.sh
```

### **After Running Tests**
```
🚀 Starting TestSprite Test Suite for CoinDesk Crypto 5 ETF
[SUCCESS] TestSprite is available
[SUCCESS] Playwright browsers are ready
[SUCCESS] Smoke Tests completed successfully
[SUCCESS] Authentication Tests completed successfully
...
[SUCCESS] Test execution completed!
```

---

## 🎉 **Ready to Test!**

Once you've completed the installation:

1. **Run the automated installer**: `./install-nodejs-and-testsprite.sh`
2. **Or follow the manual steps** above
3. **Run your tests**: `./run-tests.sh`
4. **View results**: `./run-tests.sh report`

Your TestSprite test suite will then comprehensively test your CoinDesk Crypto 5 ETF platform! 🚀

---

## 📞 **Need Help?**

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Run the verification script**: `./verify-test-setup.sh`
3. **Check the detailed guides**:
   - `INSTALL_NODEJS_MACOS.md` - Detailed Node.js installation
   - `TESTSPRITE_README.md` - Complete TestSprite guide
   - `INSTALL_TESTSPRITE.md` - TestSprite installation guide

**Happy Testing!** 🎯

