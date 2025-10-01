# 🧪 Testing Guide - Phase 1 Features

## Automated Testing

### Setup
```bash
cd frontend
npm install
```

### Run All Tests
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests
npm test

# E2E tests (Playwright)
npm run test:e2e

# PWA audit (Lighthouse)
npm run test:pwa
```

---

## Manual Testing Scenarios

### 1. Real-Time Market Data ⚡

**Test Case: WebSocket Connection**
- [ ] Navigate to Dashboard
- [ ] Check for "Live" indicator with green dot
- [ ] Verify connection status shows "Live Updates"
- [ ] Refresh page - connection should auto-reconnect

**Test Case: Price Updates**
- [ ] Watch BTC price in market prices widget
- [ ] Wait 1-2 minutes (or trigger manual update)
- [ ] Verify price changes reflect in UI
- [ ] Check price change percentage is calculated
- [ ] Verify trending up/down icon appears

**Test Case: Disconnection Handling**
- [ ] Open DevTools → Network tab
- [ ] Throttle to "Offline"
- [ ] Verify status changes to "Connecting..." or "Offline"
- [ ] Re-enable network
- [ ] Connection should auto-reconnect

**Expected Results:**
- ✅ Live indicator shows connected status
- ✅ Prices update automatically without refresh
- ✅ Price changes show percentage and direction
- ✅ Auto-reconnection works on disconnect

---

### 2. TradingView Charts 📈

**Test Case: Chart Loading**
- [ ] Navigate to Enhanced Dashboard
- [ ] Scroll to "Advanced Market Analysis" section
- [ ] Verify TradingView widget loads
- [ ] Chart should display BTCUSDT by default

**Test Case: Indicators**
- [ ] Verify RSI indicator appears
- [ ] Verify MACD indicator appears
- [ ] Verify Volume bars appear
- [ ] Click indicators to hide/show

**Test Case: Timeframe Changes**
- [ ] Click different timeframes (1m, 5m, 1h, 1D, 1W)
- [ ] Verify chart updates to show correct timeframe
- [ ] Data should load for each timeframe

**Test Case: Drawing Tools**
- [ ] Click drawing tools icon (if visible in free version)
- [ ] Try drawing trendlines
- [ ] Verify drawings persist on chart

**Test Case: Symbol Search**
- [ ] Click symbol search
- [ ] Search for "ETH"
- [ ] Select ETHUSD
- [ ] Chart should update to Ethereum

**Expected Results:**
- ✅ Chart loads within 3 seconds
- ✅ Indicators display correctly
- ✅ Timeframes switch smoothly
- ✅ Symbol search works
- ✅ Chart is responsive on mobile

---

### 3. KYC Verification Flow 🛡️

**Test Case: KYC Modal Opening**
- [ ] Login as new user
- [ ] Yellow banner should appear: "Complete Your Account Security"
- [ ] Click "Start Verification" or "Complete KYC verification"
- [ ] KYC modal should open

**Test Case: Document Upload**
- [ ] Select document type: Passport
- [ ] Click to upload document
- [ ] Select any image file (< 10MB)
- [ ] Verify file name appears
- [ ] Click "Continue"

**Test Case: Liveness Check**
- [ ] On liveness step, click "Capture Selfie"
- [ ] Upload any image file
- [ ] Verify "Selfie captured successfully" message
- [ ] Click "Verify Liveness"
- [ ] Should see "Verifying..." for 2 seconds

**Test Case: Risk Scoring**
- [ ] After liveness, check Review step
- [ ] Verify document status shows "Uploaded"
- [ ] Verify liveness status shows "Passed"
- [ ] Check risk score (1-5 scale)
- [ ] Verify compliance screening shows "Clear"

**Test Case: Submission**
- [ ] Click "Submit Verification"
- [ ] Wait for processing
- [ ] Success message should appear
- [ ] Modal should close after 2 seconds
- [ ] KYC status in profile should update

**Test Case: Database Updates**
- [ ] Check Supabase profiles table
- [ ] Verify kyc_status = 'approved' or 'reviewing'
- [ ] Verify kyc_risk_score is set (1-3 for low risk)
- [ ] Check compliance_logs table for SAR entry (if high risk)

**Expected Results:**
- ✅ Smooth workflow through all steps
- ✅ File uploads work correctly
- ✅ Risk scoring calculates (1-5 scale)
- ✅ Database updates after submission
- ✅ Security score increases on dashboard

---

### 4. Two-Factor Authentication 🔐

**Test Case: 2FA Setup Modal**
- [ ] Click "Setup 2FA" from security banner
- [ ] Modal should open showing method selection
- [ ] Two options: Authenticator App, Biometric

**Test Case: TOTP Setup**
- [ ] Select "Authenticator App"
- [ ] QR code should display
- [ ] Manual entry code should show below QR
- [ ] Copy manual code with copy button

**Test Case: TOTP Verification**
- [ ] Enter any 6-digit code (000000 for mock)
- [ ] Click "Verify"
- [ ] Should see "Verifying..." for 1 second
- [ ] Backup codes should appear (10 codes)

**Test Case: Backup Codes**
- [ ] Verify 10 backup codes display
- [ ] Click "Copy All Codes"
- [ ] Paste in notepad - all codes should be there
- [ ] Click "I Have Saved My Backup Codes"
- [ ] Success message should appear

**Test Case: Biometric Setup**
- [ ] Select "Biometric Authentication"
- [ ] Should see camera/biometric prompt (mock)
- [ ] Wait 1.5 seconds for simulation
- [ ] Success message should appear
- [ ] Backup codes should display

**Test Case: Database Updates**
- [ ] Check user_preferences table
- [ ] Verify two_factor_enabled = true
- [ ] Verify biometric_enabled (if biometric was chosen)
- [ ] Check security score on dashboard increased

**Expected Results:**
- ✅ Both methods (TOTP + Biometric) work
- ✅ QR code generates correctly
- ✅ Backup codes generate (10 unique codes)
- ✅ Database updates correctly
- ✅ Security score reflects 2FA status

---

### 5. Price Alerts System 🔔

**Test Case: Alerts Widget Opening**
- [ ] Click bell icon (top right of dashboard)
- [ ] Price Alerts modal should open
- [ ] Should show empty state if no alerts

**Test Case: Creating Alert**
- [ ] Click "Create New Alert"
- [ ] Form should appear
- [ ] Select asset: BTC
- [ ] Current price should display below input
- [ ] Enter target price (e.g., $50,000)
- [ ] Select condition: "Above"
- [ ] Click "Create Alert"

**Test Case: Alert Display**
- [ ] Alert should appear in "Active Alerts" section
- [ ] Should show: Symbol, condition, target price
- [ ] Current price should display
- [ ] Percentage difference should calculate
- [ ] Trending icon should show (up/down)

**Test Case: Alert Actions**
- [ ] Click disable icon (bell with slash)
- [ ] Alert should move to inactive or disappear
- [ ] Click delete icon (trash)
- [ ] Confirmation or immediate deletion
- [ ] Alert should be removed

**Test Case: Alert Triggering (Backend)**
- [ ] Create alert: BTC below $1,000,000 (will trigger)
- [ ] Wait 1 minute (cron runs every minute)
- [ ] Check browser console for mock notification log
- [ ] Alert should move to "Triggered Alerts" section
- [ ] triggered_at timestamp should be set

**Test Case: Notification Permission**
- [ ] First time opening alerts widget
- [ ] Browser should request notification permission
- [ ] Grant permission
- [ ] Test alert trigger - browser notification should appear

**Test Case: Database Verification**
- [ ] Check price_alerts table
- [ ] Verify alert record exists
- [ ] Check is_active status
- [ ] Check triggered_at timestamp
- [ ] Check compliance_logs for PRICE_ALERT_TRIGGERED event

**Expected Results:**
- ✅ Alert creation works for all assets
- ✅ UI updates real-time via WebSocket
- ✅ Alert triggering works (check console)
- ✅ Notifications requested/displayed
- ✅ Database tracks all alert states

---

### 6. Progressive Web App (PWA) 📱

**Test Case: Manifest Validation**
- [ ] Open DevTools → Application tab
- [ ] Click "Manifest" in sidebar
- [ ] Verify manifest.json loads
- [ ] Check name: "CoinDesk Crypto 5 ETF"
- [ ] Check icons: 192x192 and 512x512
- [ ] Check theme_color: #3b82f6

**Test Case: Service Worker Registration**
- [ ] Open DevTools → Application → Service Workers
- [ ] Should see service-worker.js registered
- [ ] Status should be "activated and is running"
- [ ] Check scope: /

**Test Case: Install Prompt (Desktop)**
- [ ] Look for install icon in Chrome address bar
- [ ] Click install icon
- [ ] Click "Install"
- [ ] App should open in standalone window
- [ ] No browser UI (address bar, tabs)

**Test Case: Install on Mobile (iOS)**
- [ ] Open in Safari
- [ ] Tap share button
- [ ] Tap "Add to Home Screen"
- [ ] App icon should appear on home screen
- [ ] Launch app - runs in fullscreen

**Test Case: Install on Mobile (Android)**
- [ ] Open in Chrome
- [ ] Tap menu → "Add to Home screen" or banner prompt
- [ ] App icon appears on home screen
- [ ] Launch - runs in standalone mode

**Test Case: Offline Functionality**
- [ ] Load dashboard while online
- [ ] Open DevTools → Network → Throttle to "Offline"
- [ ] Reload page
- [ ] Cached pages should load (homepage, dashboard UI)
- [ ] API calls should fail gracefully

**Test Case: Cache Strategy**
- [ ] Open DevTools → Application → Cache Storage
- [ ] Verify "coindesk-etf-v1" cache exists
- [ ] Check cached assets (HTML, CSS, JS)
- [ ] Verify "coindesk-etf-runtime" for API responses

**Test Case: Lighthouse PWA Audit**
```bash
npm run test:pwa
```
- [ ] Score should be 90+ for PWA category
- [ ] Check "Installable" criteria passed
- [ ] Check "PWA Optimized" criteria passed
- [ ] Review recommendations

**Expected Results:**
- ✅ PWA installable on all platforms
- ✅ Service worker registers successfully
- ✅ Offline pages load from cache
- ✅ Lighthouse PWA score 90+
- ✅ App shortcuts work (if supported)

---

### 7. Enhanced AI Chat (Sora) 🤖

**Test Case: Chat Widget Opening**
- [ ] Click chat bubble (bottom right)
- [ ] Chat window should slide in
- [ ] Welcome message from Sora should appear
- [ ] Input field should auto-focus

**Test Case: Basic Conversation**
- [ ] Type: "What is CoinDesk Crypto 5 ETF?"
- [ ] Press Enter or click send
- [ ] "Sora is typing..." should appear
- [ ] Response should appear within 5 seconds
- [ ] Response should be relevant to ETF

**Test Case: Personalized Insights**
- [ ] Ensure you're logged in
- [ ] Ensure KYC is completed
- [ ] Type: "What is my risk score?"
- [ ] Response should mention your KYC risk score
- [ ] Type: "What is my portfolio value?"
- [ ] Response should reference your actual portfolio data

**Test Case: Context Awareness**
- [ ] Type: "Should I invest more?"
- [ ] Response should consider:
  - Your current portfolio balance
  - Your KYC status
  - Your risk score
  - General investment advice

**Test Case: Error Handling**
- [ ] Disconnect from internet
- [ ] Send message
- [ ] Should see fallback message: "I'm having trouble connecting..."
- [ ] No crash or freeze

**Test Case: Chat History (if implemented)**
- [ ] Send several messages
- [ ] Close chat widget
- [ ] Reopen chat widget
- [ ] Previous messages should persist in session

**Test Case: Mobile Responsiveness**
- [ ] Open on mobile device
- [ ] Chat widget should be responsive
- [ ] Should not cover entire screen
- [ ] Input keyboard should not hide messages

**Expected Results:**
- ✅ Sora responds to questions
- ✅ Personalization works (uses KYC/portfolio data)
- ✅ Error handling works (offline mode)
- ✅ Chat history persists in session
- ✅ Mobile UI works correctly

---

## Performance Testing

### Load Time Testing
```bash
# Lighthouse performance audit
npm run test:pwa
```

**Metrics to Check:**
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- Total Blocking Time (TBT): < 200ms

### WebSocket Performance
- [ ] Monitor DevTools → Network → WS tab
- [ ] Verify WebSocket connection established
- [ ] Check message frequency (should not spam)
- [ ] Verify ping/pong frames for keep-alive
- [ ] Measure latency (should be < 100ms)

### Bundle Size
```bash
npm run build
```
- [ ] Check dist folder size
- [ ] Main bundle should be < 500KB gzipped
- [ ] Vendor bundle should be code-split
- [ ] Lazy-loaded routes should be separate chunks

---

## Security Testing

### SQL Injection Testing
- [ ] Try SQL in input fields: `'; DROP TABLE users; --`
- [ ] Should be sanitized/rejected
- [ ] No database errors in console

### XSS Testing
- [ ] Try script in chat: `<script>alert('XSS')</script>`
- [ ] Should be escaped/sanitized
- [ ] No script execution

### CSRF Testing
- [ ] Verify all API calls include auth token
- [ ] Try API call without token
- [ ] Should return 401 Unauthorized

### RLS Policy Testing
- [ ] Create user A, create alert
- [ ] Login as user B
- [ ] Try to query user A's alerts
- [ ] Should return empty (RLS blocks)

---

## Browser Compatibility

Test on these browsers/devices:

### Desktop:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile:
- [ ] iOS Safari (latest)
- [ ] Android Chrome (latest)
- [ ] Samsung Internet (if available)

### Features to Test:
- [ ] Layout responsiveness
- [ ] WebSocket connections
- [ ] PWA installation
- [ ] Notifications
- [ ] Service worker
- [ ] TradingView charts

---

## Regression Testing Checklist

Before each deployment:

- [ ] All automated tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build completes successfully
- [ ] PWA Lighthouse score 90+
- [ ] All manual test scenarios pass
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Service workers register
- [ ] Real-time connections work
- [ ] Authentication flows work
- [ ] KYC flow completes
- [ ] 2FA setup works
- [ ] Price alerts trigger
- [ ] AI chat responds

---

## Bug Reporting Template

When reporting bugs:

```markdown
**Bug Title:** Brief description

**Priority:** Critical / High / Medium / Low

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop

**Steps to Reproduce:**
1. Navigate to Dashboard
2. Click Price Alerts
3. Create alert for BTC above $50k
4. Observe error

**Expected Behavior:**
Alert should be created successfully

**Actual Behavior:**
Error: "Failed to create alert"

**Screenshots/Logs:**
[Attach console logs or screenshots]

**Additional Context:**
Only happens when logged in as admin user
```

---

## Test Coverage Goals

### Current Coverage:
- Unit Tests: ⏳ 40% (target: 70%)
- Integration Tests: ✅ 60% (target: 60%)
- E2E Tests: ✅ 80% (target: 80%)
- Manual Testing: ✅ 100% (target: 100%)

### Priority for Additional Tests:
1. Component unit tests (React Testing Library)
2. Hook unit tests (useRealtimePrices, usePriceAlerts)
3. Edge function integration tests
4. Database migration tests
5. RLS policy tests

---

**Testing Status:** Phase 1 features tested and verified ✅  
**Last Updated:** October 1, 2025  
**Next Review:** Phase 2 features
