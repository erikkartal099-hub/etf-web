# 🚀 Vercel Deployment Guide - Production Ready

**Platform:** CoinDesk Crypto 5 ETF  
**Framework:** React + Vite + Supabase  
**Status:** ✅ Production-Ready Configuration

---

## 📋 Pre-Deployment Checklist

### ✅ Required Before Deploy

- [ ] **Supabase Project Created**
  - Dashboard: https://supabase.com/dashboard
  - Project URL obtained
  - Anon key obtained
  - Service role key obtained (for Edge Functions)

- [ ] **Groq API Key** (for AI Chat)
  - Sign up: https://console.groq.com
  - Get free API key
  - Configure in Supabase secrets (NOT in frontend env)

- [ ] **GitHub Repository**
  - Code pushed to: https://github.com/erikkartal099-hub/etf-web
  - All secrets excluded (.gitignore configured)
  - Latest commit includes optimizations

- [ ] **Domain Name** (Optional)
  - Purchase domain or use Vercel subdomain
  - DNS records ready if custom domain

---

## 🎯 Step-by-Step Deployment

### Step 1: Import Project to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository:**
   ```
   Repository: erikkartal099-hub/etf-web
   Branch: main
   Framework Preset: Vite
   Root Directory: frontend
   ```

3. **Build Settings** (Auto-detected):
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Development Command: npm run dev
   ```

---

### Step 2: Configure Environment Variables

**⚠️ CRITICAL: Add these in Vercel Dashboard → Settings → Environment Variables**

#### Production Environment Variables

```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=CoinDesk Crypto 5 ETF
VITE_APP_VERSION=1.0.0

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# External APIs (Optional - for future)
VITE_COINGECKO_API_KEY=your-coingecko-key
VITE_ALCHEMY_API_KEY=your-alchemy-key
```

**How to Add:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable individually
3. Select "Production", "Preview", "Development" for all
4. Click "Save"

**🔒 Security Note:** Never commit `.env.local` files to Git!

---

### Step 3: Deploy Supabase Edge Functions

**Edge Functions must be deployed separately:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vovlsbesaapezkfggdba

# Set secrets (REQUIRED for AI chat)
supabase secrets set GROQ_API_KEY="your-groq-api-key-here"

# Deploy all Edge Functions
supabase functions deploy grok-chat
supabase functions deploy process-deposit
supabase functions deploy process-withdrawal
supabase functions deploy fetch-crypto-prices
supabase functions deploy send-notification

# Verify deployment
supabase functions list
```

---

### Step 4: Run Database Migrations

**Set up database schema:**

```bash
# Option 1: Via Supabase CLI
supabase db push

# Option 2: Via Dashboard SQL Editor
# 1. Go to: https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/sql/new
# 2. Copy contents of: /supabase/RUN_THIS_IN_SUPABASE.sql
# 3. Click "Run"
# 4. Verify tables created in Table Editor
```

**Migrations to Run (in order):**
1. `001_enable_extensions.sql` - Enable pgcrypto, ltree
2. `002_create_tables.sql` - Users, portfolios, transactions, etc.
3. `003_create_functions.sql` - PostgreSQL functions
4. `004_create_triggers.sql` - Auto-update triggers
5. `005_row_level_security.sql` - RLS policies
6. `006_seed_data.sql` - Initial data
7. `007_create_chats_table.sql` - AI chat history
8. `008_add_rpc_functions.sql` - RPC endpoints

---

### Step 5: Test Deployment

**After first deploy, test these:**

1. **Visit Deployment URL:**
   ```
   https://your-project.vercel.app
   ```

2. **Check Landing Page:**
   - [ ] Page loads without errors
   - [ ] Images display correctly
   - [ ] Fonts load (Inter from Google Fonts)
   - [ ] Responsive on mobile

3. **Test Authentication:**
   - [ ] Sign up with test email
   - [ ] Check email for verification link
   - [ ] Log in with credentials
   - [ ] Password reset flow

4. **Test Dashboard:**
   - [ ] Dashboard loads after login
   - [ ] Crypto prices display
   - [ ] Charts render
   - [ ] Navigation works

5. **Test AI Chat:**
   - [ ] Chat widget appears
   - [ ] Can send messages
   - [ ] Receives responses
   - [ ] No CORS errors

6. **Check Browser Console:**
   ```javascript
   // Should see NO red errors
   // Check: F12 → Console tab
   ```

---

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Add Domain in Vercel:**
   - Settings → Domains → Add
   - Enter: `etf.yourdomain.com`

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: etf
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate:**
   - Auto-provisioned by Vercel
   - Wait 1-5 minutes for activation

---

### Performance Optimization

**Already configured in `vite.config.ts`:**
- ✅ Code splitting by vendor
- ✅ Tree shaking enabled
- ✅ Minification (terser)
- ✅ Console logs removed in production
- ✅ Source maps disabled in production

**Vercel Edge Network:**
- Global CDN with 100+ locations
- Automatic caching for static assets
- Edge Functions for API routes

---

### Monitoring & Analytics

**Vercel Analytics** (Recommended):
```bash
npm install @vercel/analytics

# Add to main.tsx:
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

**Vercel Speed Insights:**
```bash
npm install @vercel/speed-insights

# Add to main.tsx:
import { SpeedInsights } from '@vercel/speed-insights/react';

<App />
<SpeedInsights />
```

---

### Environment Variables Best Practices

**Production vs Preview vs Development:**

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `VITE_SUPABASE_URL` | Prod URL | Prod URL | Prod URL |
| `VITE_SUPABASE_ANON_KEY` | Prod Key | Prod Key | Prod Key |
| `VITE_APP_ENV` | production | preview | development |
| `VITE_GA_TRACKING_ID` | Real ID | Test ID | (empty) |

**How to Set Per Environment:**
1. Add variable in Vercel
2. Check "Production" for prod values
3. Check "Preview" for staging values
4. Check "Development" for dev values

---

## 🚨 Common Issues & Solutions

### Issue 1: "Supabase URL is required" Error

**Cause:** Environment variables not set  
**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy: Deployments → ⋯ → Redeploy

---

### Issue 2: AI Chat Not Working

**Cause:** Edge Function not deployed or GROQ_API_KEY missing  
**Fix:**
```bash
# Set secret
supabase secrets set GROQ_API_KEY="gsk_..."

# Redeploy function
supabase functions deploy grok-chat

# Test in browser console:
fetch('https://vovlsbesaapezkfggdba.supabase.co/functions/v1/grok-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] })
})
```

---

### Issue 3: 404 on Refresh

**Cause:** SPA routing not configured  
**Fix:** Already configured in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Issue 4: Build Fails

**Check:**
```bash
# Test build locally first:
cd frontend
npm install
npm run build

# Check for TypeScript errors:
npm run lint
```

**Common fixes:**
- Fix TypeScript errors
- Update outdated dependencies
- Check `vite.config.ts` syntax

---

### Issue 5: Slow Load Times

**Optimizations:**
1. Enable Vercel Image Optimization
2. Add `loading="lazy"` to images
3. Use code splitting (already configured)
4. Enable Gzip/Brotli (automatic on Vercel)
5. Preload critical fonts

---

## 📊 Deployment Scripts

**Add to `package.json`:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "deploy:preview": "vercel",
    "deploy:prod": "vercel --prod"
  }
}
```

**Usage:**
```bash
# Deploy to preview (staging)
npm run deploy:preview

# Deploy to production
npm run deploy:prod
```

---

## 🔐 Security Checklist

### Before Going Live:

- [ ] **Environment Variables**
  - All secrets in Vercel env vars (NOT in code)
  - `.env.local` in `.gitignore`
  - No API keys exposed in frontend

- [ ] **Supabase Security**
  - RLS policies enabled on all tables
  - Anon key has limited permissions
  - Service role key only in Edge Functions

- [ ] **Headers** (Already configured)
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection enabled
  - Referrer-Policy set

- [ ] **HTTPS**
  - Enforced automatically by Vercel
  - SSL certificate auto-renewed

- [ ] **CORS**
  - Supabase CORS configured
  - Edge Functions allow your domain

---

## 📈 Post-Deployment

### Monitor Performance

**Vercel Dashboard:**
- Analytics: Track visits, page views
- Speed Insights: Core Web Vitals
- Logs: Check for errors

**Supabase Dashboard:**
- Database: Monitor query performance
- Edge Functions: Check invocations
- Auth: Track signups/logins

---

### Continuous Deployment

**Automatic deploys on:**
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview deployments

**Disable auto-deploy:**
```bash
# In Vercel settings
Settings → Git → Ignored Build Step
```

---

### Rollback if Needed

**Instant rollback:**
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click ⋯ → "Promote to Production"
4. Instant rollback (no rebuild)

---

## 💰 Vercel Pricing

### Free Tier (Hobby)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ⚠️ Single user only
- ⚠️ No team features

### Pro Tier ($20/month)
- All Free features +
- Team collaboration
- Password protection
- Advanced analytics
- 1TB bandwidth
- Priority support

**Recommendation:** Start with Free, upgrade when needed

---

## 🎯 Quick Deploy Checklist

**Before first deploy:**
```bash
# 1. Verify code
git status
git pull origin main

# 2. Test build
cd frontend
npm run build

# 3. Check env example
cat .env.example

# 4. Push to GitHub
git push origin main

# 5. Import to Vercel
# Go to: https://vercel.com/new

# 6. Add env vars in Vercel dashboard

# 7. Deploy Supabase functions
supabase functions deploy grok-chat

# 8. Run database migrations
# Via Supabase dashboard SQL editor

# 9. Test deployment
# Visit Vercel URL

# 10. Configure custom domain (optional)
```

---

## 📞 Support Resources

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://www.vercel-status.com/

**Supabase:**
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

**Project:**
- GitHub: https://github.com/erikkartal099-hub/etf-web
- Issues: https://github.com/erikkartal099-hub/etf-web/issues

---

## ✅ Deployment Complete!

**Your app will be live at:**
```
https://your-project-name.vercel.app
```

**Custom domain (if configured):**
```
https://etf.yourdomain.com
```

**Next steps:**
1. Share URL with users
2. Monitor analytics
3. Collect feedback
4. Iterate and improve

---

**Status:** ✅ Production-ready  
**Deployment Time:** ~10-15 minutes  
**Cost:** $0 (Free tier) or $20/month (Pro)
