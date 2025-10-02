-- Fix: "Failed to load user profile"
-- Issue: No RLS policy allowing users to SELECT their own profile
-- Critical fix for user authentication flow

-- =====================================================
-- FIX USER PROFILE SELECT POLICY
-- =====================================================

-- Drop the overly complex referral-based policy
DROP POLICY IF EXISTS "Users can view referral downline" ON public.users;

-- Add simple policy: Users can view their own profile
-- This is CRITICAL for the auth flow to work
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING ((SELECT auth.uid()) = id);

-- Re-add the referral downline policy (but not blocking self-view)
CREATE POLICY "Users can view referral downline"
  ON public.users
  FOR SELECT
  USING (
    -- Can always view own profile
    (SELECT auth.uid()) = id
    OR
    -- Can view users in referral downline
    EXISTS (
      SELECT 1 FROM public.users AS u
      WHERE u.id = (SELECT auth.uid())
        AND u.referral_path @> public.users.referral_path
    )
  );

-- Add policy for users to UPDATE their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- =====================================================
-- ENSURE HANDLE_NEW_USER TRIGGER EXISTS
-- =====================================================

-- Verify and recreate if needed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (
    id,
    email,
    full_name,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail auth
  RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FIX FOR EXISTING USERS WITHOUT PROFILES
-- =====================================================

-- Create profiles for any auth users missing a public.users entry
INSERT INTO public.users (id, email, full_name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
DECLARE
  policy_count INTEGER;
  user_count INTEGER;
  auth_user_count INTEGER;
BEGIN
  -- Count SELECT policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'users' 
  AND cmd = 'SELECT';
  
  -- Count users
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO auth_user_count FROM auth.users;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'User Profile RLS Fix Applied Successfully';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SELECT policies on users table: %', policy_count;
  RAISE NOTICE 'Public users: %', user_count;
  RAISE NOTICE 'Auth users: %', auth_user_count;
  
  IF user_count < auth_user_count THEN
    RAISE WARNING 'Some auth users are missing profiles! Run sync above.';
  ELSE
    RAISE NOTICE '✅ All auth users have profiles';
  END IF;
  
  RAISE NOTICE '==============================================';
END $$;

-- Add helpful comments
COMMENT ON POLICY "Users can view own profile" ON public.users 
IS 'CRITICAL: Allows users to view their own profile after signup';

COMMENT ON POLICY "Users can update own profile" ON public.users 
IS 'Allows users to update their own profile information';

COMMENT ON FUNCTION public.handle_new_user() 
IS 'Auto-creates public.users profile when auth.users is created. Uses ON CONFLICT for idempotency.';
