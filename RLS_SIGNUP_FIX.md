# 🔧 RLS Signup Fix - Implementation Guide

**Issue:** "new row violates row-level security policy for table 'users'"  
**Status:** ✅ Fixed with migration `009_fix_user_signup_rls.sql`

---

## 🚨 Problem Analysis

### Root Cause:
```sql
-- In 005_row_level_security.sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- But NO INSERT policy exists!
-- Only SELECT and UPDATE policies were created
-- This blocks ALL inserts, including new user signups
```

### Why It Fails:
1. User signs up via `auth.signUp()`
2. Supabase creates record in `auth.users` ✅
3. Trigger tries to create record in `public.users` ❌
4. RLS blocks the insert (no policy allows it)
5. Error: "new row violates row-level security policy"

### Additional Issue Found:
```
Error: "Could not find the 'referred_by' column of 'users' in the schema cache"
```
- Schema cache issue where migrations weren't applied in correct order
- Functions referencing missing columns

---

## ✅ Solution Applied

### Migration Created: `009_fix_user_signup_rls.sql` (UPDATED)

**What It Does:**
1. **Handles schema cache issues** - Checks if `referred_by` column exists
2. **Adds missing column** if not present
3. **Recreates trigger functions** with `SECURITY DEFINER` (bypasses RLS)
4. **Adds robust error handling** - Gracefully handles missing functions/columns
5. **Adds INSERT policies** for user signup
6. **Creates `handle_new_user()` function** for auth triggers
7. **Adds trigger** on `auth.users` table
8. **Includes verification** - Shows policy count after applying

---

## 🚀 Deploy the Fix

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to:** https://supabase.com/dashboard
2. **Select:** Your project (vovlsbesaapezkfggdba)
3. **Go to:** SQL Editor
4. **Click:** "New query"
5. **Copy-paste** the entire content of `009_fix_user_signup_rls.sql`
6. **Click:** "Run" (▶️)
7. **Verify:** No errors shown
8. **Test:** Try signing up again

---

### Option B: Via Supabase CLI

```bash
# If you have Supabase CLI installed
cd "/Users/odiadev/CoinDesk ETF Grayscale"

# Apply migration to remote database
supabase db push

# Or manually apply
supabase db execute --file supabase/migrations/009_fix_user_signup_rls.sql
```

---

### Option C: Via psql (Direct Database Access)

```bash
# Connect to Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.vovlsbesaapezkfggdba.supabase.co:5432/postgres"

# Run migration
\i supabase/migrations/009_fix_user_signup_rls.sql

# Verify
\dp public.users
```

---

## 🧪 Test the Fix

### 1. Test Signup

```bash
# Via Supabase client
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'TestPassword123!'
})

# Should succeed without RLS error
# Should also create: portfolio, referral records, etc.
```

### 2. Check Database

```sql
-- Verify policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users';

-- Expected output:
-- "Allow user creation from auth" | INSERT
-- "Service role can insert users" | INSERT
-- "Users can view own profile" | SELECT
-- "Users can update own profile" | UPDATE
```

### 3. Check Triggers

```sql
-- Verify trigger exists on auth.users
SELECT tgname 
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass;

-- Should see: on_auth_user_created
```

### 4. Check Column Exists

```sql
-- Verify referred_by column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'referred_by';

-- Should show: referred_by | uuid
```

### 5. Check Migration Output

```sql
-- Migration should show these notices:
-- NOTICE:  RLS Fix Applied: 2 INSERT policies now exist for users table
-- NOTICE:  User signup should now work correctly
-- NOTICE:  Added missing referred_by column (if it was missing)
```

---

## 📋 What Was Fixed

### Before (BROKEN):
```sql
-- NO INSERT POLICY!
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT  -- Only SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE  -- Only UPDATE
  USING (auth.uid() = id);

-- MISSING: INSERT POLICY
```

### After (FIXED):
```sql
-- Added INSERT policies
CREATE POLICY "Allow user creation from auth"
  ON public.users
  FOR INSERT  -- ✅ NOW ALLOWED
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT  -- ✅ FOR TRIGGERS
  TO service_role
  WITH CHECK (true);

-- Functions now run with SECURITY DEFINER
CREATE OR REPLACE FUNCTION create_user_portfolio()
RETURNS TRIGGER
SECURITY DEFINER  -- ✅ BYPASSES RLS
SET search_path = public
AS $$
...
```

---

## 🔍 Verification Commands

### Check if policies are active:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd;
```

### Test user creation:
```sql
-- Should work now
INSERT INTO public.users (id, email, full_name)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User'
);
```

### Check trigger functions:
```sql
SELECT 
  tgname AS trigger_name,
  tgtype AS trigger_type,
  proname AS function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.users'::regclass;
```

---

## ⚠️ Important Notes

### 1. SECURITY DEFINER Functions
```
- Allow bypassing RLS
- Must be carefully reviewed
- Only use for trusted operations
- Our use case: Creating user records on signup (safe)
```

### 2. Service Role Policy
```
- Allows service_role key to insert users
- Used by Edge Functions and triggers
- Does NOT affect frontend (uses anon key)
```

### 3. Schema Cache Handling
```
- Migration checks if columns exist before using them
- Adds missing columns automatically
- Gracefully handles missing functions
- Prevents errors due to migration order issues
```

### 4. Auth Flow
```
1. User fills signup form
2. Frontend calls: supabase.auth.signUp()
3. Supabase creates: auth.users record
4. Trigger fires: on_auth_user_created
5. Function creates: public.users record (with SECURITY DEFINER)
6. Other triggers fire: portfolio, referrals, etc.
7. Success! User can now login
```

---

## 🐛 Troubleshooting

### Still getting RLS error?

**Check 1: Is migration applied?**
```sql
SELECT * FROM supabase_migrations.schema_migrations
WHERE version = '009_fix_user_signup_rls';
```

**Check 2: Are policies active?**
```sql
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT';
-- Should return 2
```

**Check 3: Is trigger function created?**
```sql
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
-- Should return 1 row
```

**Check 4: Is trigger attached?**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- Should return 1 row
```

**Check 5: Does referred_by column exist?**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'referred_by';
-- Should return 1 row
```

### Manual Fix (If migration fails):

```sql
-- 1. Add missing column if needed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.users(id);

-- 2. Add INSERT policies
CREATE POLICY IF NOT EXISTS "Allow user creation from auth"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3. Create auth trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Test signup again
```

---

## ✅ Success Indicators

**You'll know it's fixed when:**
- ✅ Signup completes without errors
- ✅ User record created in `public.users`
- ✅ Portfolio automatically created
- ✅ Referral records created (if referred)
- ✅ Notifications sent (if referred)
- ✅ User can login
- ✅ Dashboard loads with data
- ✅ All triggers fire successfully

**Test account:**
```
Email: test@example.com
Password: TestPassword123!
```

**Migration output should show:**
```
NOTICE:  RLS Fix Applied: 2 INSERT policies now exist for users table
NOTICE:  User signup should now work correctly
NOTICE:  Added missing referred_by column (if it was missing)
```

---

## 📞 Next Steps After Fix

1. **Test signup flow** end-to-end
2. **Verify** all triggers working (portfolio, referrals)
3. **Check** email confirmations (if enabled)
4. **Test** login after signup
5. **Verify** dashboard data loads
6. **Deploy** to production (Supabase)
7. **Update** Vercel with correct anon key
8. **Test** live site signup

---

**Status:** ✅ Fix ready to deploy  
**Migration File:** `supabase/migrations/009_fix_user_signup_rls.sql`  
**Action Required:** Run migration in Supabase Dashboard  
**Expected Result:** Signup works perfectly!
