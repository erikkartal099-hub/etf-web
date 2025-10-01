# 🔑 Vercel Environment Variables - Copy & Paste Ready

**For:** https://etf-web-mi7p.vercel.app/  
**Date:** 2025-10-01

---

## 📋 ENVIRONMENT VARIABLES (3 Required)

### Variable 1: Supabase URL
```
Name:
VITE_SUPABASE_URL

Value:
https://vovlsbesaapezkfggdba.supabase.co

Environments:
☑️ Production
☑️ Preview
☑️ Development
```

---

### Variable 2: Supabase Anon Key
```
Name:
VITE_SUPABASE_ANON_KEY

Value:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTQwNjgsImV4cCI6MjA1MTIzMDA2OH0.9cqL9p_Rx1fCEHQR3rEYEJJZqLm0g7JfJRcv8v6uYCU

Environments:
☑️ Production
☑️ Preview
☑️ Development
```

---

### Variable 3: App Environment
```
Name:
VITE_APP_ENV

Value:
production

Environments:
☑️ Production
☑️ Preview
☑️ Development
```

---

## 🚀 HOW TO ADD THESE TO VERCEL

### Step 1: Navigate to Environment Variables
1. Go to: **https://vercel.com/dashboard**
2. Click on your project: **etf-web-mi7p**
3. Click: **Settings** (top menu)
4. Click: **Environment Variables** (left sidebar)

---

### Step 2: Add Each Variable

#### For Variable 1 (Supabase URL):
1. Click: **"Add New"** button
2. In **"Name"** field, paste: `VITE_SUPABASE_URL`
3. In **"Value"** field, paste: `https://vovlsbesaapezkfggdba.supabase.co`
4. Under **"Environments"**, check all 3:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
5. Click: **"Save"**

#### For Variable 2 (Supabase Anon Key):
1. Click: **"Add New"** button
2. In **"Name"** field, paste: `VITE_SUPABASE_ANON_KEY`
3. In **"Value"** field, paste:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTQwNjgsImV4cCI6MjA1MTIzMDA2OH0.9cqL9p_Rx1fCEHQR3rEYEJJZqLm0g7JfJRcv8v6uYCU
   ```
4. Under **"Environments"**, check all 3:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
5. Click: **"Save"**

#### For Variable 3 (App Environment):
1. Click: **"Add New"** button
2. In **"Name"** field, paste: `VITE_APP_ENV`
3. In **"Value"** field, paste: `production`
4. Under **"Environments"**, check all 3:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
5. Click: **"Save"**

---

### Step 3: Redeploy
1. Go to: **Deployments** tab (top menu)
2. Find the latest deployment
3. Click: **⋯** (three dots) on the right
4. Click: **"Redeploy"**
5. Wait 2-3 minutes for deployment to complete
6. Visit: **https://etf-web-mi7p.vercel.app/**

**Result:** Site will load with full content! ✅

---

## 📋 COPY-PASTE READY FORMAT

**For quick copy-paste into Vercel:**

```env
# Variable 1
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co

# Variable 2
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTQwNjgsImV4cCI6MjA1MTIzMDA2OH0.9cqL9p_Rx1fCEHQR3rEYEJJZqLm0g7JfJRcv8v6uYCU

# Variable 3
VITE_APP_ENV=production
```

---

## ⚠️ IMPORTANT NOTES

### About the Anon Key:
- ✅ **Safe to expose** - It's called "anon" (anonymous) for a reason
- ✅ **Row Level Security** protects your data
- ✅ **Designed for client-side** use (frontend apps)
- ❌ **DO NOT use** the Service Role Key (that's secret)

### About the URL:
- This is your Supabase project URL
- It's public and safe to share
- Anyone can connect, but RLS policies protect your data

### About VITE_APP_ENV:
- Set to `production` for Vercel deployment
- Can be `development` for local testing
- Can be `preview` for preview deployments

---

## ✅ VERIFICATION

After adding env vars and redeploying:

### Check 1: Vercel Dashboard
- Go to: Settings → Environment Variables
- Should see: 3 variables listed
- Each should show: "Production, Preview, Development"

### Check 2: Live Site
- Visit: https://etf-web-mi7p.vercel.app/
- Should see: Professional landing page (not blank)
- Should see: CoinDesk branding, navigation, content

### Check 3: Browser Console
- Press F12 on the site
- Console tab should show: No red errors
- Should NOT see: "Missing Supabase environment variables"

---

## 🔍 TROUBLESHOOTING

### If site is still blank after adding:

#### Problem: Forgot to redeploy
**Solution:** Go to Deployments → Click ⋯ → Redeploy

#### Problem: Forgot to check all 3 environments
**Solution:** Edit each variable → Check all 3 boxes → Save → Redeploy

#### Problem: Typo in variable name
**Solution:** Variable names are CASE SENSITIVE
- Correct: `VITE_SUPABASE_URL`
- Wrong: `VITE_SUPABASE_url` or `vite_supabase_url`

#### Problem: Extra spaces in value
**Solution:** Make sure no spaces before/after the value

#### Problem: Still not working
**Solution:** 
1. Clear cache and redeploy (Deployments → ⋯ → Check "Clear cache" → Redeploy)
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check build logs (Deployments → Latest → View Logs)

---

## 📱 MOBILE ACCESS

Same steps work on mobile:
1. Open Vercel app or mobile browser
2. Navigate to project settings
3. Add environment variables
4. Redeploy

---

## 🎯 TIMELINE

| Step | Time |
|------|------|
| Add 3 env vars | 2 min |
| Trigger redeploy | 30 sec |
| Wait for build | 2-3 min |
| **Total** | **~5 min** |

---

## 🔐 SECURITY REMINDER

These credentials are:
- ✅ Anon key (safe for frontend)
- ✅ Protected by RLS policies
- ✅ Designed for public exposure
- ✅ Used by millions of apps

DO NOT add:
- ❌ Service Role Key (that's secret!)
- ❌ Database passwords
- ❌ Private API keys
- ❌ Personal credentials

---

## 📞 QUICK LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project URL:** https://etf-web-mi7p.vercel.app/
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Project:** https://vovlsbesaapezkfggdba.supabase.co

---

## ✅ SUCCESS CHECKLIST

- [ ] Added VITE_SUPABASE_URL
- [ ] Added VITE_SUPABASE_ANON_KEY
- [ ] Added VITE_APP_ENV
- [ ] Checked all 3 environments for each variable
- [ ] Saved each variable
- [ ] Triggered redeploy
- [ ] Waited 2-3 minutes
- [ ] Visited site
- [ ] Site shows content (not blank)

**When all checked:** 🎉 **SUCCESS!**

---

**Status:** Ready to add to Vercel  
**Action:** Follow steps above  
**Time:** 5 minutes total  
**Result:** Fully functional site
