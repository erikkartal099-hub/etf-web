# 🔍 Invalid API Key Error - Investigation

**Error:** "Invalid API key" when creating account  
**Site:** https://etf-web-mi7p.vercel.app/  
**Date:** 2025-10-01 13:29 PM  
**Status:** 🔴 CRITICAL ISSUE

---

## 🚨 Problem Identified

**Error Message:** "Invalid API key"  
**When:** User tries to create an account  
**Where:** Sign up form  

---

## 🔍 Root Cause Analysis

### Issue 1: Incorrect Supabase Anon Key ⚠️
**Likelihood:** HIGH (90%)

The anon key I provided earlier might be:
- ❌ Incorrect/typo
- ❌ Expired
- ❌ From wrong project
- ❌ Malformed

**Let me verify the correct key from your local environment...**

---

## 🔑 CORRECT SUPABASE CREDENTIALS

Based on your local `.env.local` file:

### ✅ VERIFIED SUPABASE URL
```
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
```
**Status:** ✅ This is correct

---

### ⚠️ SUPABASE ANON KEY - NEEDS VERIFICATION

**Where to find the correct key:**

1. **Go to:** https://supabase.com/dashboard
2. **Select:** Your project (vovlsbesaapezkfggdba)
3. **Go to:** Settings → API
4. **Find:** "Project API keys" section
5. **Copy:** The **"anon" "public"** key (NOT the service_role key)

**The key should:**
- Start with: `eyJhbGci...`
- Be very long (300+ characters)
- Have two dots (.) in it (JWT format)
- Look like: `eyJhbGci...xxxxx.yyyyy.zzzzz`

---

## 🎯 IMMEDIATE FIX

### Step 1: Get Correct Anon Key from Supabase

1. **Login:** https://supabase.com/dashboard
2. **Project:** vovlsbesaapezkfggdba
3. **Settings → API**
4. **Copy:** "anon" "public" key

**Screenshot reference:**
```
┌─────────────────────────────────────┐
│ Project API keys                    │
├─────────────────────────────────────┤
│ anon public                         │
│ eyJhbGci...                  [Copy] │ ← Copy this one!
│                                     │
│ service_role secret                 │
│ eyJhbGci...                  [Copy] │ ← NOT this one
└─────────────────────────────────────┘
```

---

### Step 2: Update Vercel Environment Variable

1. **Go to:** https://vercel.com/dashboard
2. **Project:** etf-web-mi7p
3. **Settings → Environment Variables**
4. **Find:** `VITE_SUPABASE_ANON_KEY`
5. **Click:** "Edit" (pencil icon)
6. **Replace** with the NEW key from Supabase
7. **Ensure** all 3 environments checked:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
8. **Click:** "Save"

---

### Step 3: Redeploy

1. **Deployments** tab
2. **Latest deployment** → ⋯
3. **Check:** ☑️ "Clear cache and redeploy"
4. **Click:** "Redeploy"
5. **Wait:** 2-3 minutes

---

### Step 4: Test Sign Up

1. **Visit:** https://etf-web-mi7p.vercel.app/signup
2. **Fill form:**
   - Email: test@example.com
   - Password: Test123456!
3. **Click:** "Sign Up"
4. **Expected:** Account created successfully ✅

---

## 🔍 Additional Checks

### Issue 2: Wrong Variable Name
**Check Vercel has EXACT name:**
```
✅ Correct: VITE_SUPABASE_ANON_KEY
❌ Wrong: VITE_SUPABASE_KEY
❌ Wrong: SUPABASE_ANON_KEY
❌ Wrong: VITE_SUPABASE_ANON_KEY_ (extra underscore)
```

---

### Issue 3: Extra Spaces or Line Breaks
**The key should be:**
- One continuous line
- No spaces at start/end
- No line breaks in the middle

**Bad (has line break):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJzdXBhYmFzZSI...
```

**Good (one line):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

---

### Issue 4: Using Service Role Key Instead of Anon Key
**Common mistake:**
```
❌ service_role key (secret, never use in frontend!)
✅ anon key (public, safe for frontend)
```

**Verify in Supabase dashboard:**
- The key you copied says **"anon"** next to it
- NOT "service_role"

---

## 🧪 Test Current Configuration

### Browser Console Test

1. **Visit:** https://etf-web-mi7p.vercel.app/
2. **Press:** F12 (Developer Tools)
3. **Console tab**
4. **Paste this:**
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Anon Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20))
```

**Expected output:**
```
Supabase URL: https://vovlsbesaapezkfggdba.supabase.co
Anon Key (first 20 chars): eyJhbGciOiJIUzI1NiIs
```

**If you see:**
- `undefined` → Environment variables not loaded
- Different URL → Wrong configuration
- Wrong key prefix → Wrong key format

---

## 📋 Checklist to Fix

- [ ] Login to Supabase dashboard
- [ ] Go to project settings → API
- [ ] Copy the "anon" "public" key (the correct one)
- [ ] Go to Vercel dashboard
- [ ] Edit VITE_SUPABASE_ANON_KEY variable
- [ ] Paste the correct key (one line, no spaces)
- [ ] Check all 3 environments
- [ ] Save
- [ ] Redeploy with cache clear
- [ ] Wait 2-3 minutes
- [ ] Test sign up again

---

## 🔐 Security Note

**The anon key is public and safe to share because:**
- It's designed for client-side use
- Row Level Security (RLS) policies protect your data
- It has limited permissions
- You can regenerate it anytime in Supabase

**NEVER use or expose:**
- ❌ Service Role Key (has admin access!)
- ❌ Database password
- ❌ JWT secret

---

## 🎯 Alternative: Verify Key is Valid

### Test the Key Directly

1. **Get your anon key** from Supabase dashboard
2. **Open terminal** and run:

```bash
# Replace YOUR_ANON_KEY with the actual key
curl -X GET 'https://vovlsbesaapezkfggdba.supabase.co/rest/v1/' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected response:**
```json
{"message": "ok"} or similar
```

**If you get:**
- ✅ 200 OK → Key is valid
- ❌ 401 Unauthorized → Key is invalid
- ❌ 404 Not Found → URL is wrong

---

## 🔄 If Still Getting "Invalid API Key"

### Check Supabase Project Status

1. **Go to:** https://supabase.com/dashboard
2. **Select:** Your project
3. **Check:** Project is not paused
4. **Check:** No service degradation warnings

### Check RLS Policies

1. **Supabase Dashboard** → Authentication → Policies
2. **Ensure:** Sign up is allowed
3. **Check:** `auth.users` table has proper policies

### Check Auth Settings

1. **Supabase Dashboard** → Authentication → Settings
2. **Enable email auth:** Should be ON
3. **Email confirmations:** Can be ON or OFF for testing
4. **Site URL:** Should include your Vercel URL

---

## 📊 Common Error Messages & Meanings

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid API key" | Wrong/expired anon key | Get new key from Supabase |
| "Invalid JWT" | Malformed key | Copy key carefully, one line |
| "Project not found" | Wrong URL | Verify Supabase URL |
| "Unauthorized" | Using wrong key type | Use anon, not service_role |
| "Auth is disabled" | Auth not enabled | Enable in Supabase settings |

---

## 🚀 Expected Working Flow

**After fixing the API key:**

1. **User visits** signup page
2. **Enters** email and password
3. **Clicks** Sign Up
4. **Supabase** creates user account
5. **Email sent** (if confirmations enabled)
6. **User redirected** to dashboard
7. **Success!** ✅

---

## 📞 Next Steps

### Immediate:
1. **Get correct anon key** from Supabase dashboard
2. **Update Vercel** environment variable
3. **Redeploy**
4. **Test signup**

### If Still Fails:
1. **Check browser console** for specific error
2. **Check Supabase logs** (Dashboard → Logs)
3. **Verify RLS policies** are not blocking
4. **Test with curl** to verify key

---

## 💡 Quick Test Script

**To test if your Supabase credentials work:**

```javascript
// Paste this in browser console at your site
async function testSupabase() {
  const { createClient } = supabase
  const client = createClient(
    'https://vovlsbesaapezkfggdba.supabase.co',
    'YOUR_ANON_KEY_HERE' // Replace with actual key
  )
  
  const { data, error } = await client.auth.signUp({
    email: 'test@example.com',
    password: 'TestPassword123!'
  })
  
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Success!', data)
  }
}

testSupabase()
```

---

## ✅ Success Indicators

**You'll know it's fixed when:**
- No "Invalid API key" error
- Sign up form submits successfully
- User receives confirmation email (if enabled)
- User is redirected to dashboard
- Account appears in Supabase Auth → Users

---

**Status:** Waiting for correct anon key from Supabase  
**Action Required:** Copy anon key from Supabase Dashboard → Update Vercel  
**Expected Resolution:** 5 minutes after using correct key
