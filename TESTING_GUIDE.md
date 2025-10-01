# 🧪 Testing Guide - CoinDesk Crypto 5 ETF

**Server Status:** ✅ RUNNING on http://localhost:5173

---

## Quick Start

### Option 1: Direct Access
```bash
# Server is already running!
# Open your browser to: http://localhost:5173
```

### Option 2: Restart Server (if needed)
```bash
# From project root:
./start-dev.sh
```

### Option 3: Manual Start
```bash
cd frontend
export PATH="$PWD/node-v18.20.8-darwin-x64/bin:$PATH"
npm run dev
```

---

## 🎯 Test Plan - New Password Reset Feature

### Test 1: Forgot Password Flow
1. **Open:** http://localhost:5173/login
2. **Click:** "Forgot password?" link
3. **Verify:** Redirected to `/forgot-password`
4. **Enter:** Your email address
5. **Click:** "Send Reset Link"
6. **Expected:** Success message + email sent confirmation

### Test 2: Reset Password Page
1. **Open:** http://localhost:5173/reset-password
2. **Expected:** Shows "Verifying reset link..." (then error without valid token)
3. **Note:** Full test requires clicking email link

### Test 3: Full Password Reset (Integration)
1. Sign up with a test account
2. Click "Forgot password?" on login
3. Enter email and submit
4. Check email for reset link
5. Click link in email
6. Enter new password (min 8 chars)
7. Confirm password (must match)
8. Submit form
9. Verify redirect to login
10. Login with new password

---

## 🎨 UI/UX Tests - Password Reset

### Visual Tests:
- [ ] Forgot password page matches app design (Grayscale theme)
- [ ] Reset password page has show/hide password toggles
- [ ] Success state shows checkmark icon
- [ ] Error messages are clear and helpful
- [ ] Mobile responsive (test on small screen)

### Functional Tests:
- [ ] Email validation (invalid format rejected)
- [ ] Password strength validation (min 8 chars)
- [ ] Password mismatch detection
- [ ] Loading states during submission
- [ ] Back to login link works
- [ ] Toast notifications appear

---

## 📋 Complete Feature Testing

### Authentication System ✅
- [x] **Sign Up:** http://localhost:5173/signup
  - Create account
  - Referral code support
  - Email verification
  
- [x] **Login:** http://localhost:5173/login
  - Email + password
  - Remember me checkbox
  - Forgot password link ⭐ NEW
  
- [x] **Forgot Password:** http://localhost:5173/forgot-password ⭐ NEW
  - Email input
  - Send reset link
  - Success confirmation
  
- [x] **Reset Password:** http://localhost:5173/reset-password ⭐ NEW
  - Token validation
  - Password entry with toggle
  - Confirmation matching

### Core Pages (Requires Login)

**Dashboard:** http://localhost:5173/dashboard
- [ ] Total value card
- [ ] ETF tokens display
- [ ] Market prices (BTC, ETH, etc.)
- [ ] Quick actions (Deposit, Withdraw)
- [ ] Recent transactions

**Deposit:** http://localhost:5173/deposit
- [ ] Crypto selection (BTC, ETH, etc.)
- [ ] Amount input
- [ ] Generate deposit address
- [ ] Important warning displayed

**Withdrawal:** http://localhost:5173/withdraw
- [ ] Crypto selection
- [ ] Amount input
- [ ] Withdrawal address
- [ ] Fee calculation
- [ ] Warning message

**Portfolio:** http://localhost:5173/portfolio
- [ ] Asset balances table
- [ ] Transaction history
- [ ] Total value
- [ ] Refresh button

**Referrals:** http://localhost:5173/referrals
- [ ] Personal referral link
- [ ] Copy button
- [ ] Share button
- [ ] 5-level bonus structure
- [ ] Network visualization

**Staking:** http://localhost:5173/staking
- [ ] 4 staking plans (Flexible, 30, 90, 365 days)
- [ ] APY rates displayed
- [ ] Available balance
- [ ] Create staking position
- [ ] Active positions table

**Rewards:** http://localhost:5173/rewards
- [ ] Loyalty points display
- [ ] Total rewards earned
- [ ] Milestone bonuses
- [ ] Rewards history
- [ ] Claim functionality

**Profile:** http://localhost:5173/profile
- [ ] Profile information
- [ ] Full name, email
- [ ] Edit button
- [ ] Change password section
- [ ] Security settings
- [ ] Notifications preferences

---

## 🤖 AI Chat Widget (Sora)

On any page (bottom right):
- [ ] Chat icon visible
- [ ] Click opens chat window
- [ ] Can send messages
- [ ] Receives AI responses (powered by Groq)
- [ ] Chat history persists

---

## 🔍 Automated Test Script

Run the comprehensive test suite:

```bash
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale
chmod +x test-investor-journey.sh
./test-investor-journey.sh
```

This tests:
- ✅ All page loads (200 status)
- ✅ Content verification
- ✅ Navigation links
- ✅ Performance
- ✅ Mobile viewport
- ✅ Supabase connection

---

## 🐛 Known Limitations (Demo Mode)

⚠️ **Mock Data - Not Production Ready:**
- Transactions are simulated (no real blockchain)
- Prices are from CoinGecko API (may have rate limits)
- Email notifications not implemented
- KYC/AML not integrated
- No real payment processing

✅ **Fully Functional:**
- All UI/UX flows
- Authentication (Supabase)
- Password reset ⭐ NEW
- AI chat (Groq)
- Database operations
- Responsive design

---

## 📊 Test Results Documentation

### Quick Health Check:
```bash
# Test landing page
curl -s http://localhost:5173/ | grep -o "<title>[^<]*"
# Expected: CoinDesk Crypto 5 ETF | Grayscale Investment

# Test server is responding
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
# Expected: 200
```

### Browser Console Check:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors (should be minimal)
4. Network tab - verify API calls to Supabase

---

## 🎯 Priority Testing Order

### Today (New Features):
1. ⭐ Password reset flow (complete integration test)
2. ⭐ Forgot password page UI
3. ⭐ Reset password page validation

### This Week (Existing Features):
1. Sign up + Login flow
2. Dashboard overview
3. Deposit flow
4. Referral system
5. AI chat functionality

### Before Production:
1. All pages load without errors
2. All forms validate correctly
3. All navigation links work
4. Mobile responsive on all pages
5. Cross-browser testing (Chrome, Safari, Firefox)

---

## 🚀 Next Steps After Testing

Based on test results, prioritize:

1. **If all tests pass:** Deploy demo version
2. **If issues found:** Document and fix
3. **Enhancement suggestions:** 
   - Complete staking page
   - Enhance rewards page
   - Add profile editing

---

## 📞 Support

**Current Status:**
- ✅ Server running on http://localhost:5173
- ✅ All dependencies installed
- ✅ Password reset feature added
- ✅ Ready for testing

**Need Help?**
- Check browser console for errors
- Verify Supabase credentials in `.env`
- Ensure port 5173 is not blocked
- Check `FINAL_STATUS_AND_FIXES.md` for known issues

---

**Happy Testing! 🎉**
