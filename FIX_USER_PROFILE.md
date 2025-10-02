# 🔧 Fix: "Failed to Load User Profile"

## Problem Identified

**Error:** "Failed to load user profile" after signup/login  
**Root Cause:** RLS policy missing - users couldn't SELECT their own profile  

---

## ✅ Fixes Applied

### **1. Database Migration** (20250102_fix_user_profile_rls.sql)
- ✅ Added "Users can view own profile" RLS policy
- ✅ Added "Users can update own profile" RLS policy
- ✅ Fixed referral downline policy to not block self-view
- ✅ Ensured `handle_new_user()` trigger exists
- ✅ Created profiles for existing auth users

### **2. AuthContext Enhancement**
- ✅ Auto-creates profile if missing (graceful recovery)
- ✅ Better error messages
- ✅ Handles PGRST116 (not found) errors
- ✅ Handles PGRST301 (permission) errors

---

## 🚀 Apply the Fix

### **Option 1: Using Supabase CLI** (Recommended)

```bash
cd supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push

# Verify
supabase db diff
```

### **Option 2: Manual SQL Execution**

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor**
4. Copy content from `supabase/migrations/20250102_fix_user_profile_rls.sql`
5. Paste and click **Run**
6. Check output for success message

---

## 🧪 Test the Fix

### **Test 1: Existing User Login**

```bash
1. Visit http://localhost:5173/login
2. Login with existing credentials
3. Should redirect to dashboard
4. ✅ No "Failed to load user profile" error
```

### **Test 2: New User Signup**

```bash
1. Visit http://localhost:5173/signup
2. Enter: email, password, name
3. Submit
4. Check email and verify
5. Login
6. ✅ Profile loads successfully
```

### **Test 3: Profile Update**

```bash
1. Go to /profile page
2. Update name or phone
3. Click Save
4. ✅ Should save without permission errors
```

---

## 🔍 Verify Database

Run this in Supabase SQL Editor:

```sql
-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Expected policies:
-- ✅ "Users can view own profile" (SELECT)
-- ✅ "Users can update own profile" (UPDATE)
-- ✅ "Users can view referral downline" (SELECT)
-- ✅ "Admins can view all users" (SELECT)
-- ✅ "Allow user creation from auth" (INSERT)
-- ✅ "Service role can insert users" (INSERT)

-- Check if all auth users have profiles
SELECT 
  'Auth Users' as type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Public Users' as type,
  COUNT(*) as count
FROM public.users;

-- Should be equal!

-- Find any orphaned auth users
SELECT 
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Should return 0 rows
```

---

## 🛠️ Troubleshooting

### **Still seeing "Failed to load user profile"?**

#### **Check 1: Migration Applied?**

```sql
-- Check if migration ran
SELECT * FROM supabase_migrations.schema_migrations
WHERE version = '20250102_fix_user_profile_rls';

-- If not found, run the migration manually
```

#### **Check 2: Profile Exists?**

```sql
-- Replace YOUR_USER_ID with actual ID from error logs
SELECT * FROM public.users WHERE id = 'YOUR_USER_ID';

-- If empty, create profile:
INSERT INTO public.users (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE id = 'YOUR_USER_ID';
```

#### **Check 3: RLS Enabled?**

```sql
-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'users';

-- rowsecurity should be TRUE
```

#### **Check 4: Test Policy Directly**

```sql
-- As authenticated user, can you see your profile?
SET request.jwt.claim.sub = 'YOUR_USER_ID';

SELECT * FROM public.users WHERE id = 'YOUR_USER_ID';

-- Should return 1 row
```

---

## 🔄 Rollback (If Needed)

If this fix causes issues:

```sql
-- Remove the new policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Restore old behavior (not recommended)
-- Contact support for assistance
```

---

## 📊 Before vs After

| Scenario | Before ❌ | After ✅ |
|----------|-----------|---------|
| **Login** | Failed to load profile | Profile loads |
| **Signup** | Profile not created | Profile auto-created |
| **View Profile** | Permission denied | Can view own |
| **Edit Profile** | No policy | Can update own |
| **Missing Profile** | Hard error | Auto-creates |

---

## 🎓 What Was Wrong

### **Original Issue:**

The `005_row_level_security.sql` only had:
```sql
CREATE POLICY "Users can view referral downline" ...
```

This complex policy checked referral paths but **didn't allow simple self-view**.

### **The Fix:**

Added explicit policy:
```sql
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);
```

Simple, clear, and works! ✅

---

## 📝 Additional Enhancements

### **AuthContext Improvements:**

1. **Auto-Recovery**: If profile missing, creates one
2. **Better Errors**: Distinguishes between "not found" and "permission denied"
3. **User Feedback**: Shows helpful toast messages
4. **Graceful Degradation**: Doesn't crash the app

---

## ✅ Verification Checklist

Run through this after applying the fix:

- [ ] Migration applied successfully
- [ ] Can login without errors
- [ ] Can view dashboard
- [ ] Can edit profile
- [ ] New signups work
- [ ] All auth users have profiles
- [ ] No console errors
- [ ] RLS policies correct

---

## 📞 Still Having Issues?

### **Get Detailed Logs:**

```typescript
// In browser console after login error
localStorage.getItem('supabase.auth.token')

// Check Supabase logs
// Dashboard → Logs → API
// Look for 403 or 404 errors
```

### **Enable Debug Mode:**

```typescript
// In frontend/src/lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true, // Add this
    ...
  }
})
```

### **Test RLS Directly:**

Use Supabase Dashboard → Table Editor → users table  
Try to view/edit your own row while logged in

---

## 🎉 Success!

Once fixed, you should see:

```
✅ User logged in successfully
✅ Profile loaded
✅ Dashboard displayed
✅ No errors in console
```

---

**Migration File:** `supabase/migrations/20250102_fix_user_profile_rls.sql`  
**Updated File:** `frontend/src/contexts/AuthContext.tsx`  
**Status:** ✅ READY TO APPLY

**Apply with:** `cd supabase && supabase db push`
