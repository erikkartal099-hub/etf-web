# 🚀 Phase 1 Quick Start Guide
## Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 20+ installed
- Supabase account
- Git

### 1. Clone & Install
```bash
git clone https://github.com/erikkartal099-hub/etf-web.git
cd etf-web/frontend
npm install
```

### 2. Environment Setup
```bash
# Create .env.local file
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
EOF
```

### 3. Database Migration
```bash
# Run Phase 1 migrations
cd ../supabase
supabase db push
```

### 4. Start Development Server
```bash
cd ../frontend
npm run dev
```

Open http://localhost:5173 in your browser! 🎉

---

## 🧪 Test Phase 1 Features

### 1. Real-Time Market Data
- ✅ Navigate to **Dashboard**
- ✅ Watch for "Live" indicator (green dot)
- ✅ Prices update automatically without refresh

### 2. TradingView Charts
- ✅ Scroll to "Advanced Market Analysis" section
- ✅ Interact with chart (zoom, indicators, drawing tools)
- ✅ Change timeframes (1D, 1W, 1M)

### 3. KYC Verification
- ✅ Look for yellow banner: "Complete Your Account Security"
- ✅ Click "Start Verification"
- ✅ Upload mock document (any image file)
- ✅ Capture selfie (any image)
- ✅ Review and submit

**Expected Result:** KYC status updates to "approved" or "reviewing"

### 4. Two-Factor Authentication
- ✅ Click "Setup 2FA" button in security banner
- ✅ Choose authenticator app or biometric
- ✅ Follow setup wizard
- ✅ Save backup codes

**Expected Result:** 2FA enabled, security score increases

### 5. Price Alerts
- ✅ Click bell icon (top right of dashboard)
- ✅ Click "Create New Alert"
- ✅ Select asset (e.g., BTC)
- ✅ Set target price
- ✅ Choose condition (above/below)
- ✅ Create alert

**Expected Result:** Alert appears in active list

### 6. PWA Installation
**Mobile:**
- ✅ Open site in Safari (iOS) or Chrome (Android)
- ✅ Tap share button → "Add to Home Screen"
- ✅ Launch app from home screen

**Desktop:**
- ✅ Look for install icon in address bar
- ✅ Click "Install CoinDesk ETF"
- ✅ Launch as standalone app

### 7. AI Chat (Sora)
- ✅ Click chat bubble (bottom right)
- ✅ Ask: "What is my portfolio value?"
- ✅ Ask: "How does KYC verification work?"
- ✅ Notice personalized responses based on your data

---

## 🔧 Troubleshooting

### Issue: Real-time not working
**Solution:** Check Supabase Realtime is enabled in project settings

### Issue: TradingView chart not loading
**Solution:** Ensure you have internet connection (chart loads from TradingView CDN)

### Issue: KYC modal not appearing
**Solution:** Ensure database migration ran successfully: `supabase db push`

### Issue: Service Worker errors
**Solution:** Clear browser cache and reload. Ensure service-worker.js is in /public

### Issue: TypeScript errors
**Solution:** Run `npm run type-check` to see all errors. Check types/index.ts is updated

---

## 📊 Verify Installation

Run these commands to ensure everything is working:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# E2E tests
npm run test:e2e

# PWA audit (requires Chrome)
npm run test:pwa
```

All should pass without critical errors.

---

## 🎯 What's Next?

1. **Customize Branding:** Update colors in tailwind.config.js
2. **Add Real KYC:** Integrate Sumsub SDK (see PHASE1_REPORT.md)
3. **Enable Push Notifications:** Configure FCM or OneSignal
4. **Deploy to Production:** Follow deployment guide in PHASE1_REPORT.md
5. **Monitor Performance:** Set up Sentry or similar

---

## 📚 Documentation

- **Full Report:** [PHASE1_REPORT.md](./PHASE1_REPORT.md)
- **Testing Guide:** [TESTING.md](./TESTING.md)
- **Deployment:** See PHASE1_REPORT.md → Deployment Guide

---

**Need Help?** Review inline code comments or check PHASE1_REPORT.md for detailed explanations.
