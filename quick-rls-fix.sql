-- QUICK RLS FIX - Apply this in Supabase SQL Editor
-- This will immediately fix the signup issue

-- =====================================================
-- STEP 1: Enable RLS and add INSERT policies
-- =====================================================

-- First, ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "Allow user creation from auth" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Create INSERT policy for auth users (most important)
CREATE POLICY "Allow user creation from auth"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
  );

-- Create INSERT policy for service role (for triggers)
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- =====================================================
-- STEP 2: Create auth trigger function
-- =====================================================

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 3: Verification
-- =====================================================

DO $$
DECLARE
  policy_count INTEGER;
  trigger_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Count INSERT policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'users' 
  AND cmd = 'INSERT';
  
  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgrelid = 'auth.users'::regclass
    AND tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  -- Check if function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) INTO function_exists;
  
  RAISE NOTICE '=== RLS FIX VERIFICATION ===';
  RAISE NOTICE 'INSERT policies: % (should be 2)', policy_count;
  RAISE NOTICE 'Auth trigger: % (should be true)', trigger_exists;
  RAISE NOTICE 'Handle function: % (should be true)', function_exists;
  
  IF policy_count = 2 AND trigger_exists AND function_exists THEN
    RAISE NOTICE '🎉 RLS FIX SUCCESSFUL!';
    RAISE NOTICE 'User signup should now work correctly';
  ELSE
    RAISE NOTICE '❌ Some components failed - check above';
  END IF;
  
  RAISE NOTICE '===========================';
END $$;

-- =====================================================
-- STEP 4: Test user creation (optional)
-- =====================================================

-- Uncomment the following to test user creation
/*
DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'test-' || substring(md5(random()::text), 1, 8) || '@example.com';
BEGIN
  -- Generate a test user ID
  test_user_id := gen_random_uuid();
  
  -- Test inserting into public.users (should work now)
  INSERT INTO public.users (
    id,
    email,
    full_name,
    created_at
  ) VALUES (
    test_user_id,
    test_email,
    'Test User',
    NOW()
  );
  
  RAISE NOTICE '✅ Test user created successfully: %', test_email;
  
  -- Clean up test data
  DELETE FROM public.users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ Test completed and cleaned up';
  
EXCEPTION WHEN others THEN
  RAISE NOTICE '❌ Test failed: %', SQLERRM;
END $$;
*/
