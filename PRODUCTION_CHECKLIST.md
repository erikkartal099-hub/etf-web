# 📋 Production Deployment Checklist

**Project:** CoinDesk Crypto 5 ETF  
**Target:** Vercel + Supabase  
**Date:** Before going live

---

## 🔐 Security & Environment

### Environment Variables
- [ ] All secrets moved to Vercel environment variables
- [ ] `.env.local` added to `.gitignore`
- [ ] No API keys in frontend code
- [ ] `VITE_SUPABASE_URL` configured
- [ ] `VITE_SUPABASE_ANON_KEY` configured
- [ ] `VITE_APP_ENV` set to "production"
- [ ] Supabase secrets configured: `GROQ_API_KEY`

### Security Headers
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection enabled
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy set
- [ ] HTTPS enforced (automatic on Vercel)

### Supabase Security
- [ ] RLS policies enabled on all tables
- [ ] Anon key has minimal permissions
- [ ] Service role key only in Edge Functions
- [ ] Database backup strategy defined
- [ ] Rate limiting configured

---

## 🏗️ Build & Performance

### Code Quality
- [ ] TypeScript errors resolved: `npm run type-check`
- [ ] ESLint warnings fixed: `npm run lint`
- [ ] Tests passing: `npm run test`
- [ ] Build succeeds locally: `npm run build`

### Performance Optimization
- [ ] Code splitting configured (vendor chunks)
- [ ] Images optimized (WebP format preferred)
- [ ] Lazy loading implemented
- [ ] Console logs removed in production
- [ ] Source maps disabled in production
- [ ] Bundle size under 1MB

### Caching Strategy
- [ ] Static assets cached (31536000s = 1 year)
- [ ] API responses cached appropriately
- [ ] Service worker configured (optional)

---

## 🗄️ Database & Backend

### Supabase Setup
- [ ] Production project created
- [ ] All migrations run successfully
- [ ] Seed data loaded (if applicable)
- [ ] Database indexes created
- [ ] Backup schedule configured

### Edge Functions
- [ ] `grok-chat` deployed and tested
- [ ] `process-deposit` deployed (mock mode)
- [ ] `process-withdrawal` deployed (mock mode)
- [ ] `fetch-crypto-prices` deployed (optional)
- [ ] `send-notification` deployed (optional)
- [ ] All functions have proper error handling

### API Endpoints
- [ ] All endpoints return proper status codes
- [ ] Error responses are user-friendly
- [ ] Rate limiting configured
- [ ] CORS headers set correctly

---

## 🎨 Frontend

### UI/UX
- [ ] All pages load without errors
- [ ] Responsive design works on mobile
- [ ] Dark mode toggle functional
- [ ] Forms validate inputs
- [ ] Loading states implemented
- [ ] Error states handled gracefully

### Authentication
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Password reset works
- [ ] Email verification works
- [ ] Logout works
- [ ] Session persistence works

### Core Features
- [ ] Dashboard displays correctly
- [ ] Crypto prices update
- [ ] Charts render properly
- [ ] Deposit flow functional (mock)
- [ ] Withdrawal flow functional (mock)
- [ ] Referral system works
- [ ] AI chat responds
- [ ] Transaction history displays

---

## 📱 Testing

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Functional Testing
- [ ] Sign up → Login → Dashboard
- [ ] Deposit simulation
- [ ] Withdrawal simulation
- [ ] Referral link generation
- [ ] AI chat conversation
- [ ] Profile update
- [ ] Password reset end-to-end

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] Time to interactive < 5s
- [ ] No console errors
- [ ] No 404s on resources

---

## 📊 Monitoring & Analytics

### Vercel
- [ ] Analytics enabled
- [ ] Speed Insights configured
- [ ] Error tracking active
- [ ] Deployment notifications set up

### Supabase
- [ ] Database metrics monitored
- [ ] Edge Function logs reviewed
- [ ] Auth events tracked
- [ ] Alert emails configured

### External
- [ ] Google Analytics configured (optional)
- [ ] Sentry error tracking (optional)
- [ ] Uptime monitoring (optional)

---

## 📄 Documentation

### User Documentation
- [ ] README.md updated
- [ ] Getting started guide
- [ ] FAQ section
- [ ] Contact/support info

### Developer Documentation
- [ ] API documentation
- [ ] Environment setup guide
- [ ] Deployment guide
- [ ] Contributing guidelines

### Legal (REQUIRED for real users)
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] GDPR compliance notice
- [ ] Demo disclaimer visible

---

## 🚀 Deployment

### Pre-Deploy
- [ ] Code pushed to main branch
- [ ] GitHub repository clean
- [ ] No secrets in commits
- [ ] Deployment guide reviewed
- [ ] Rollback plan documented

### Vercel Setup
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### First Deploy
- [ ] Preview deployment successful
- [ ] Production deployment successful
- [ ] All pages accessible
- [ ] No 500 errors
- [ ] Database connected

### Post-Deploy
- [ ] DNS propagated (if custom domain)
- [ ] HTTPS working
- [ ] All features tested on live site
- [ ] Team notified
- [ ] Monitoring active

---

## ⚠️ Demo Mode Warnings

### Must Display to Users
- [ ] "DEMO MODE" banner on all pages
- [ ] "No real money" disclaimer
- [ ] "For demonstration only" modal
- [ ] Mock transaction warnings
- [ ] "Not financial advice" notice

### Must NOT Claim
- ❌ Real cryptocurrency transactions
- ❌ FDIC/SIPC insurance
- ❌ SEC/FINRA registration
- ❌ Financial advice
- ❌ Guaranteed returns

---

## 💰 Cost Review

### Monthly Costs
- [ ] Vercel: $0 (Hobby) or $20 (Pro)
- [ ] Supabase: $25 (Pro plan recommended)
- [ ] Groq API: $0 (free tier sufficient for demo)
- [ ] Domain: ~$10-15/year (optional)
- [ ] Total: ~$25-45/month

### Usage Limits
- [ ] Vercel bandwidth: 100GB (free) / 1TB (pro)
- [ ] Supabase database size: 500MB (free) / 8GB (pro)
- [ ] Groq API: Rate limits understood
- [ ] Monitoring costs: $0 (built-in)

---

## 🎯 Go-Live Criteria

### Must Have (Blockers)
- ✅ All security checks passed
- ✅ Database migrations complete
- ✅ Edge Functions deployed
- ✅ Environment variables set
- ✅ Demo disclaimers visible
- ✅ No critical errors

### Should Have (High Priority)
- ✅ Mobile responsive
- ✅ Performance optimized
- ✅ All features tested
- ✅ Monitoring active
- ✅ Documentation complete

### Nice to Have (Post-Launch)
- ⏳ Custom domain
- ⏳ Advanced analytics
- ⏳ Email notifications
- ⏳ Multi-language support

---

## 📞 Emergency Contacts

### If Something Breaks
1. **Vercel Issues:**
   - Dashboard: https://vercel.com/dashboard
   - Support: https://vercel.com/support
   - Status: https://www.vercel-status.com

2. **Supabase Issues:**
   - Dashboard: https://supabase.com/dashboard
   - Docs: https://supabase.com/docs
   - Discord: https://discord.supabase.com

3. **Rollback Plan:**
   - Go to Vercel → Deployments
   - Find last working version
   - Click "Promote to Production"
   - Instant rollback (no rebuild)

---

## ✅ Final Sign-Off

**Before marking complete, verify:**

```bash
# 1. Build locally
cd frontend
npm run build
# ✓ No errors

# 2. Test preview
npm run preview
# ✓ Works at localhost:4173

# 3. Check environment
cat .env.example
# ✓ All variables documented

# 4. Verify deployment
curl -I https://your-app.vercel.app
# ✓ Returns 200 OK

# 5. Test live site
# ✓ Sign up works
# ✓ Login works  
# ✓ Dashboard loads
# ✓ AI chat responds
```

---

## 📝 Deployment Log

| Date | Version | Deployed By | Notes |
|------|---------|-------------|-------|
| YYYY-MM-DD | 1.0.0 | [Name] | Initial production deploy |
| | | | |

---

**Status:** Ready to deploy when all checks pass ✅  
**Next Action:** Complete checklist then deploy to production  
**Time Estimate:** 2-3 hours for careful review
