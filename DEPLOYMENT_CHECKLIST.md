# 🚀 Phase 1 Deployment Checklist

## Pre-Deployment Verification

### 1. Code Quality ✅
```bash
cd frontend

# TypeScript type checking
npm run type-check
# Expected: No errors (or only minor warnings to document)

# Linting
npm run lint
# Expected: No critical errors

# Build test
npm run build
# Expected: Successful build in dist/
```

### 2. Database Migration ✅
```bash
cd ../supabase

# Check migration status
supabase db diff

# Apply migrations
supabase db push

# Verify tables created
supabase db tables list
# Expected: price_alerts, compliance_logs, user_preferences, watchlists
```

### 3. Environment Variables ✅
```bash
# Frontend .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.com

# Supabase Edge Functions
GROQ_API_KEY=your-groq-key (if not using mock)
SUMSUB_API_KEY=your-sumsub-key (for production KYC)
```

### 4. Supabase Configuration ✅
- [ ] Enable Realtime in project settings
- [ ] Confirm RLS policies are active on all tables
- [ ] Set up custom SMTP (optional for emails)
- [ ] Configure storage buckets (for KYC documents)
- [ ] Set up database backups (daily recommended)

### 5. Edge Functions Deployment ✅
```bash
# Deploy price alerts checker
supabase functions deploy check-price-alerts

# Deploy Groq chat (if exists)
supabase functions deploy grok-chat

# Set up cron job for price alerts (every 1 minute)
# Add to supabase dashboard or via SQL:
SELECT cron.schedule(
  'check-price-alerts',
  '* * * * *',
  $$SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/check-price-alerts',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  )$$
);
```

---

## Deployment Steps

### Step 1: Frontend Deployment (Vercel)

```bash
cd frontend

# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or use npm script
npm run deploy:prod
```

**Vercel Configuration:**
1. Framework Preset: **Vite**
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Install Command: `npm install`
5. Node Version: **20.x**

**Environment Variables in Vercel:**
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`
- Add `VITE_APP_URL` (your production domain)

### Step 2: Custom Domain Setup

**In Vercel:**
1. Go to Project → Settings → Domains
2. Add your domain: `app.yourcompany.com`
3. Configure DNS records (A/CNAME as instructed)
4. Wait for SSL certificate (auto-provisioned)

**Update Environment:**
```bash
# Update VITE_APP_URL to production domain
VITE_APP_URL=https://app.yourcompany.com
```

### Step 3: PWA Configuration

**Verify PWA Assets:**
```bash
# Ensure these files exist in frontend/public/
ls -la public/manifest.json
ls -la public/service-worker.js
ls -la public/logo-192.png
ls -la public/logo-512.png
```

**Test PWA Installation:**
1. Open production URL in Chrome
2. Check DevTools → Application → Manifest
3. Verify service worker registers
4. Test install prompt

### Step 4: Monitoring Setup

**Sentry (Error Tracking):**
```bash
npm install @sentry/react @sentry/vite-plugin

# Add to vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default {
  plugins: [
    sentryVitePlugin({
      org: "your-org",
      project: "coindesk-etf"
    })
  ]
}
```

**Supabase Analytics:**
- Enable in Supabase Dashboard → Analytics
- Monitor API usage, database queries, edge function calls

---

## Post-Deployment Verification

### 1. Functional Testing ✅

**Real-Time Data:**
```bash
# Open production URL
# Navigate to Dashboard
# Verify "Live" indicator shows green
# Check console for WebSocket connection
# Expected: "✅ Service Worker registered" + WebSocket connected
```

**TradingView Charts:**
```bash
# Scroll to Advanced Market Analysis
# Verify chart loads within 3 seconds
# Change symbol to ETHUSD
# Expected: Chart updates to Ethereum
```

**KYC Flow:**
```bash
# Login as new user
# Click "Start Verification"
# Upload test document
# Complete liveness check
# Submit verification
# Expected: Success message, KYC status updated
```

**Price Alerts:**
```bash
# Click bell icon
# Create alert: BTC above $100,000
# Expected: Alert created, appears in active list
# Wait 1 minute
# Expected: Alert triggers (check console)
```

**PWA Installation:**
```bash
# Desktop Chrome: Look for install icon in address bar
# Mobile Safari: Share → Add to Home Screen
# Expected: App installs, launches standalone
```

### 2. Performance Testing ✅

**Lighthouse Audit:**
```bash
# Run Lighthouse in Chrome DevTools
# Or use CLI:
lighthouse https://app.yourcompany.com --view

# Expected Scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
# PWA: 90+
```

**WebSocket Latency:**
```bash
# Open DevTools → Network → WS tab
# Monitor price update messages
# Expected: <100ms between server send and client receive
```

**Page Load Times:**
```bash
# First Contentful Paint (FCP): < 2s
# Largest Contentful Paint (LCP): < 2.5s
# Time to Interactive (TTI): < 3.5s
# Cumulative Layout Shift (CLS): < 0.1
```

### 3. Security Verification ✅

**HTTPS:**
```bash
# Check SSL certificate
curl -I https://app.yourcompany.com
# Expected: HTTP/2 200, valid SSL

# Verify security headers
curl -I https://app.yourcompany.com | grep -i "strict-transport-security"
# Expected: HSTS header present
```

**RLS Policies:**
```bash
# Test with different users
# User A creates price alert
# Login as User B
# Try to query User A's alerts via Supabase client
# Expected: Empty result (RLS blocks)
```

**Authentication:**
```bash
# Try accessing /dashboard without login
# Expected: Redirect to /login

# Try API call without auth token
# Expected: 401 Unauthorized
```

### 4. Database Health ✅

```sql
-- Check table row counts
SELECT 'profiles' as table, COUNT(*) FROM profiles
UNION ALL
SELECT 'price_alerts', COUNT(*) FROM price_alerts
UNION ALL
SELECT 'compliance_logs', COUNT(*) FROM compliance_logs;

-- Verify RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
ORDER BY abs(correlation) DESC;
```

---

## Rollback Plan

### If Issues Occur:

**Frontend Rollback (Vercel):**
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

**Database Rollback:**
```bash
# Restore from backup
supabase db restore <backup-id>

# Or revert specific migration
# Edit migration file, remove changes, push again
```

**Edge Functions Rollback:**
```bash
# Redeploy previous version
git checkout <previous-commit>
supabase functions deploy check-price-alerts
```

---

## Monitoring Dashboard

### Key Metrics to Track

**Daily:**
- [ ] Error rate (Sentry)
- [ ] API latency (Supabase)
- [ ] WebSocket connections
- [ ] User registrations
- [ ] KYC completions

**Weekly:**
- [ ] Lighthouse scores
- [ ] Page load times
- [ ] Database query performance
- [ ] Storage usage
- [ ] Bandwidth usage

**Monthly:**
- [ ] User retention rate
- [ ] Feature adoption (2FA, alerts)
- [ ] Cost analysis
- [ ] Security audit

---

## Support Resources

### Documentation
- [PHASE1_REPORT.md](./PHASE1_REPORT.md) - Full implementation details
- [PHASE1_QUICKSTART.md](./PHASE1_QUICKSTART.md) - Quick setup
- [TESTING.md](./TESTING.md) - Testing scenarios
- [PHASE1_SUMMARY.md](./PHASE1_SUMMARY.md) - Executive summary

### External Resources
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **PWA Checklist:** https://web.dev/pwa-checklist/

### Emergency Contacts
- **Frontend Issues:** Check Vercel logs
- **Backend Issues:** Check Supabase logs
- **Database Issues:** Supabase support
- **SSL Issues:** Vercel support

---

## Production Checklist Summary

### Pre-Launch ✅
- [x] Code quality verified (type-check, lint, build)
- [x] Database migrations applied
- [x] Environment variables configured
- [x] Supabase Realtime enabled
- [x] Edge functions deployed
- [x] Cron job configured (price alerts)

### Launch ✅
- [x] Frontend deployed to Vercel
- [x] Custom domain configured
- [x] SSL certificate active
- [x] PWA assets verified
- [x] Service worker registered

### Post-Launch ✅
- [x] Functional testing complete
- [x] Performance metrics meet targets
- [x] Security verification passed
- [x] Monitoring configured
- [x] Backup strategy in place
- [x] Rollback plan documented

---

## Next Steps After Deployment

### Week 1
1. **Monitor Closely:** Check error rates hourly
2. **Gather Feedback:** 5-10 beta users
3. **Hot Fixes:** Address critical issues immediately
4. **Performance Tuning:** Optimize based on real data

### Week 2-4
1. **Feature Refinement:** Based on user feedback
2. **Production KYC:** Integrate real Sumsub (if ready)
3. **Push Notifications:** Enable for price alerts
4. **Analytics Review:** User behavior, conversion rates

### Month 2+
1. **Phase 2 Planning:** Prioritize features
2. **User Onboarding:** Wider beta rollout
3. **Marketing Materials:** Screenshots, videos
4. **Community Building:** Discord, Twitter, blog

---

## ✅ Deployment Complete!

Once all items are checked, your Phase 1 implementation is **LIVE IN PRODUCTION** 🎉

**Status Page:** https://app.yourcompany.com  
**Admin Panel:** https://app.supabase.com/project/your-project  
**Monitoring:** https://vercel.com/your-team/your-project  

---

**Last Updated:** October 1, 2025  
**Next Review:** Weekly for first month  
**Version:** Phase 1.0.0
