# Install Node.js on macOS Intel for TestSprite

## 🎯 Quick Installation Guide

Based on the latest information from the internet, here are the exact steps to install Node.js on your macOS Intel system:

---

## 📥 **Method 1: Official Node.js Installer (Recommended)**

### **Step 1: Download Node.js LTS**
1. **Visit the official Node.js website**: https://nodejs.org/en/download/
2. **Click on "macOS Installer (.pkg)"** for the LTS version (currently Node.js 20.x)
3. **Download the file** (it will be named something like `node-v20.x.x.pkg`)

### **Step 2: Install Node.js**
1. **Open the downloaded .pkg file**
2. **Follow the installation wizard**:
   - Click "Continue"
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Click "Install"
   - Enter your password when prompted
   - Wait for installation to complete

### **Step 3: Verify Installation**
Open Terminal and run:
```bash
node --version
npm --version
```

You should see output like:
```
v20.10.0
10.2.3
```

---

## 🍺 **Method 2: Using Homebrew (Alternative)**

### **Step 1: Install Homebrew**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### **Step 2: Install Node.js**
```bash
brew install node
```

### **Step 3: Verify Installation**
```bash
node --version
npm --version
```

---

## 🔄 **Method 3: Using NVM (Node Version Manager)**

### **Step 1: Install NVM**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### **Step 2: Reload Shell**
```bash
source ~/.zshrc
```

### **Step 3: Install Node.js LTS**
```bash
nvm install --lts
nvm use --lts
nvm alias default lts/*
```

### **Step 4: Verify Installation**
```bash
node --version
npm --version
```

---

## 🚀 **After Node.js Installation**

Once Node.js is installed, follow these steps to set up TestSprite:

### **Step 1: Navigate to Project Directory**
```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
```

### **Step 2: Install TestSprite Dependencies**
```bash
npm install
```

### **Step 3: Install Playwright Browsers**
```bash
npx playwright install
```

### **Step 4: Verify TestSprite Setup**
```bash
./verify-test-setup.sh
```

### **Step 5: Run Tests**
```bash
./run-tests.sh
```

### **Step 6: View Test Results**
```bash
./run-tests.sh report
```

---

## 🔧 **Troubleshooting**

### **Issue: "node: command not found"**
**Solution**: 
1. Restart Terminal
2. Check if Node.js is in PATH: `echo $PATH`
3. Try reinstalling Node.js

### **Issue: "npm: command not found"**
**Solution**: 
1. npm comes with Node.js, so reinstall Node.js
2. Check if npm is in PATH: `which npm`

### **Issue: Permission denied during npm install**
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

## 📋 **Installation Checklist**

- [ ] Download Node.js LTS from nodejs.org
- [ ] Install Node.js using the .pkg installer
- [ ] Verify installation: `node --version` and `npm --version`
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Run `npx playwright install`
- [ ] Run `./verify-test-setup.sh`
- [ ] Run `./run-tests.sh`

---

## 🎯 **Expected Results**

After successful installation, you should see:

### **Node.js Version**
```
v20.10.0 (or similar LTS version)
```

### **npm Version**
```
10.2.3 (or similar version)
```

### **TestSprite Verification**
```
✅ TestSprite setup verification PASSED!
✅ All test files and configuration are properly set up
✅ Ready to run tests! Execute: ./run-tests.sh
```

### **Test Execution**
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

## 🌐 **Direct Download Links**

### **Node.js LTS (Recommended)**
- **Official Download**: https://nodejs.org/en/download/
- **LTS Version**: Node.js 20.x (Long Term Support)
- **File Type**: macOS Installer (.pkg)
- **Architecture**: Intel x64

### **Alternative Downloads**
- **Node.js Current**: https://nodejs.org/en/download/current/
- **All Downloads**: https://nodejs.org/en/download/

---

## 📞 **Need Help?**

If you encounter any issues:

1. **Check Node.js Installation**: `node --version`
2. **Check npm Installation**: `npm --version`
3. **Verify Project Directory**: `pwd`
4. **Check File Permissions**: `ls -la run-tests.sh`
5. **Review Error Messages**: Look for specific error details

---

## 🎉 **Ready to Test!**

Once Node.js is installed, your TestSprite test suite will be ready to comprehensively test your CoinDesk Crypto 5 ETF platform!

**Install Node.js first, then run the tests!** 🚀

