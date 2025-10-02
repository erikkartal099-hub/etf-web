# Vercel Environment Variables Setup Guide

## 🚨 CRITICAL: Environment Variables Configuration

The signup flow requires proper environment variables to be configured in Vercel. Here's how to fix the 404 errors:

---

## 📋 Required Environment Variables

### **1. Supabase Configuration (REQUIRED)**
```bash
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U
```

### **2. App Configuration (OPTIONAL)**
```bash
VITE_APP_ENV=production
VITE_APP_NAME=CoinDesk Crypto 5 ETF
VITE_APP_VERSION=1.0.0
```

### **3. External APIs (OPTIONAL)**
```bash
VITE_COINGECKO_API_KEY=demo
VITE_ALCHEMY_API_KEY=demo
```

---

## 🛠️ How to Set Environment Variables in Vercel

### **Method 1: Vercel Dashboard (Recommended)**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Find your project: `etf-web-mi7p`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the sidebar

3. **Add Each Variable**
   - Click **Add New**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://vovlsbesaapezkfggdba.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

   - Repeat for `VITE_SUPABASE_ANON_KEY` with the key value above

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or push a new commit to trigger redeploy

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set environment variables
vercel env add VITE_SUPABASE_URL
# Enter: https://vovlsbesaapezkfggdba.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U

# Redeploy
vercel --prod
```

---

## 🔍 Verification Steps

### **1. Check Environment Variables**
After setting the variables, verify they're working:

1. **Visit your site**: https://etf-web-mi7p.vercel.app
2. **Open browser console** (F12)
3. **Check for errors** - should see no "Missing Supabase environment variables" errors

### **2. Test Signup Flow**
1. **Go to signup page**: https://etf-web-mi7p.vercel.app/signup
2. **Fill out the form** with test data
3. **Submit** - should work without 404 errors

### **3. Check Network Tab**
1. **Open Developer Tools** → **Network** tab
2. **Try signup** - should see successful requests to Supabase
3. **No 404 errors** should appear

---

## 🚨 Common Issues & Solutions

### **Issue: Still getting 404 errors**
**Solution:**
- Make sure environment variables are set for **all environments** (Production, Preview, Development)
- **Redeploy** the application after setting variables
- Check that variable names start with `VITE_`

### **Issue: "Missing Supabase environment variables" error**
**Solution:**
- Verify the exact variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure there are no extra spaces or characters
- Redeploy after making changes

### **Issue: Variables not updating**
**Solution:**
- Environment variables require a **redeploy** to take effect
- Go to Deployments tab and click **Redeploy**
- Or push a new commit to trigger automatic redeploy

---

## 📊 Expected Results After Fix

### **✅ Working Signup Flow:**
1. User fills out signup form
2. Form submits successfully (no 404 errors)
3. User receives email verification
4. User can sign in after verification
5. Dashboard loads with user data

### **✅ No More Errors:**
- No "Missing Supabase environment variables" errors
- No 404 NOT_FOUND errors during signup
- No RLS violation errors (fixed by database script)

---

## 🎯 Quick Checklist

- [ ] Set `VITE_SUPABASE_URL` in Vercel
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Set variables for all environments (Production, Preview, Development)
- [ ] Redeploy the application
- [ ] Test signup flow at https://etf-web-mi7p.vercel.app/signup
- [ ] Verify no 404 errors in browser console
- [ ] Confirm successful signup and email verification

---

## 🆘 If Still Having Issues

1. **Check Vercel Logs**
   - Go to Vercel Dashboard → Functions tab
   - Look for any error logs

2. **Verify Supabase Connection**
   - Check Supabase Dashboard → Settings → API
   - Confirm URL and keys match

3. **Test Locally**
   - Run `npm run dev` locally
   - Test with `.env.local` file
   - Compare with production behavior

---

**Once environment variables are properly set, the signup flow should work perfectly!** 🚀
