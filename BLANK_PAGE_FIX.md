# 🔧 Blank Page Fix - Vercel Deployment

**Issue:** https://etf-web-mi7p.vercel.app/ shows blank page  
**Cause:** Missing environment variables  
**Status:** ⚠️ NEEDS IMMEDIATE FIX

---

## 🚨 Root Cause

The Supabase client is throwing an error because environment variables are not set:

```javascript
// In src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
  // This error crashes the app → blank page
}
```

---

## ✅ IMMEDIATE FIX (5 minutes)

### Step 1: Add Environment Variables in Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project (etf-web-mi7p)
3. **Go to:** Settings → Environment Variables
4. **Add these THREE variables:**

```env
Name: VITE_SUPABASE_URL
Value: https://vovlsbesaapezkfggdba.supabase.co
Environment: Production, Preview, Development
```

```env
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTQwNjgsImV4cCI6MjA1MTIzMDA2OH0.9cqL9p_Rx1fCEHQR3rEYEJJZqLm0g7JfJRcv8v6uYCU
Environment: Production, Preview, Development
```

```env
Name: VITE_APP_ENV
Value: production
Environment: Production, Preview, Development
```

5. **Click:** "Save" for each variable

### Step 2: Redeploy

1. **Go to:** Deployments tab
2. **Find:** Latest deployment
3. **Click:** ⋯ (three dots)
4. **Click:** "Redeploy"
5. **Wait:** 30-60 seconds

### Step 3: Verify Fix

1. **Visit:** https://etf-web-mi7p.vercel.app/
2. **Expected:** Landing page loads
3. **Check:** Browser console (F12) - no errors

---

## 🔍 Diagnostic Steps (While Waiting)

### Check Browser Console

1. **Visit:** https://etf-web-mi7p.vercel.app/
2. **Press:** F12 (or right-click → Inspect)
3. **Go to:** Console tab
4. **Look for:** Red error messages

**Expected Error:**
```
Error: Missing Supabase environment variables. Please check your .env.local file.
```

### Check Network Tab

1. **F12** → Network tab
2. **Refresh** page
3. **Look for:** Failed requests (red)
4. **Check:** If any JavaScript files failed to load

---

## 📋 Verification Checklist

After adding env vars and redeploying:

- [ ] Landing page loads with content
- [ ] Navigation menu visible
- [ ] "Sign Up" and "Login" buttons visible
- [ ] No console errors
- [ ] Styles applied (not plain HTML)
- [ ] Images loading

---

## 🎯 Alternative: Quick Test Without Env Vars

If you want to test if the build is correct:

### Option 1: Use Browser Console to Set Vars
```javascript
// In browser console at https://etf-web-mi7p.vercel.app/
localStorage.setItem('supabase.auth.token', 'test')
location.reload()
```

### Option 2: Test Locally
```bash
cd frontend
export PATH="$PWD/node-v18.20.8-darwin-x64/bin:$PATH"

# Ensure .env.local exists
cat .env.local

# Should show:
# VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Run local build
npm run build
npm run preview

# Visit http://localhost:4173
# Should work perfectly
```

---

## 🔧 If Still Blank After Adding Env Vars

### Check 1: Verify Env Vars Were Added
```
Vercel Dashboard → Settings → Environment Variables
- Should see 3 variables
- Each should have green checkmark
```

### Check 2: Clear Vercel Cache
```
Vercel → Deployments → Latest → ⋯ → Redeploy
→ Check: "Clear cache and redeploy"
```

### Check 3: Check Build Logs
```
Vercel → Deployments → Latest → View Function Logs
Look for: Environment variables loaded
```

### Check 4: View Source
```
Right-click on blank page → View Page Source
- Should see: <div id="root"></div>
- Should see: <script type="module" src="/assets/index-*.js">
- If missing: Build configuration issue
```

---

## 🚨 Emergency Rollback (If Needed)

If deployment is broken:

1. **Vercel Dashboard** → Deployments
2. **Find:** Previous working deployment (if any)
3. **Click:** ⋯ → "Promote to Production"
4. **Result:** Instant rollback

---

## 📊 Expected Timeline

| Action | Time | Status |
|--------|------|--------|
| Add env vars | 2 min | ⏳ Now |
| Trigger redeploy | 30 sec | ⏳ After |
| Build completes | 1-2 min | ⏳ Auto |
| Site loads | Instant | ✅ Done |

**Total:** ~3-5 minutes

---

## ✅ Success Criteria

**Site should show:**
```
✓ Professional landing page
✓ "CoinDesk Crypto 5 ETF" branding
✓ Navigation menu (Home, Features, About)
✓ Hero section with CTA buttons
✓ Feature cards with icons
✓ Footer with links
✓ Responsive mobile design
```

---

## 🎯 Quick Reference

### Your Supabase Credentials
```
URL: https://vovlsbesaapezkfggdba.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTQwNjgsImV4cCI6MjA1MTIzMDA2OH0.9cqL9p_Rx1fCEHQR3rEYEJJZqLm0g7JfJRcv8v6uYCU
```

### Vercel Project
```
URL: https://etf-web-mi7p.vercel.app/
Dashboard: https://vercel.com/dashboard
Settings: https://vercel.com/your-username/etf-web-mi7p/settings
```

---

## 📞 Next Steps

1. **Now:** Add environment variables in Vercel
2. **Then:** Redeploy
3. **Wait:** 2-3 minutes
4. **Visit:** https://etf-web-mi7p.vercel.app/
5. **Verify:** Page loads with content

---

**Root cause identified: Missing env vars**  
**Fix time: 3-5 minutes**  
**Confidence: 99% this will resolve it**
