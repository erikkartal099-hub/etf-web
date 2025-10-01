-- Test script to verify RLS fix is working
-- Run this in Supabase SQL Editor after applying the migration

-- =====================================================
-- 1. Check if INSERT policies exist
-- =====================================================
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'users' 
AND cmd = 'INSERT'
ORDER BY policyname;

-- Expected: 2 policies
-- "Allow user creation from auth" | INSERT | true | {public}
-- "Service role can insert users" | INSERT | true | {service_role}

-- =====================================================
-- 2. Check if referred_by column exists
-- =====================================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'referred_by';

-- Expected: referred_by | uuid | YES | null

-- =====================================================
-- 3. Check if trigger function exists
-- =====================================================
SELECT 
  proname,
  proargtypes,
  prorettype::regtype
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Expected: handle_new_user |  | trigger

-- =====================================================
-- 4. Check if trigger exists on auth.users
-- =====================================================
SELECT 
  tgname,
  tgtype::regtype,
  tgenabled
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass
AND tgname = 'on_auth_user_created';

-- Expected: on_auth_user_created | trigger | O

-- =====================================================
-- 5. Test user creation (manual test)
-- =====================================================
-- This simulates what happens when a user signs up
-- Note: This will create a real user record

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
  
  -- Verify the user was created
  PERFORM 1 FROM public.users WHERE id = test_user_id;
  IF FOUND THEN
    RAISE NOTICE '✅ User record verified in database';
  END IF;
  
  -- Check if portfolio was created automatically
  PERFORM 1 FROM public.portfolios WHERE user_id = test_user_id;
  IF FOUND THEN
    RAISE NOTICE '✅ Portfolio created automatically';
  ELSE
    RAISE NOTICE '⚠️ Portfolio not created - check triggers';
  END IF;
  
  -- Clean up test data
  DELETE FROM public.portfolios WHERE user_id = test_user_id;
  DELETE FROM public.users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ Test completed and cleaned up';
  
EXCEPTION WHEN others THEN
  RAISE NOTICE '❌ Test failed: %', SQLERRM;
END $$;

-- =====================================================
-- 6. Check all user-related triggers
-- =====================================================
SELECT 
  tgname,
  tgtype::regtype,
  tgenabled,
  tgrelid::regclass
FROM pg_trigger 
WHERE tgrelid = 'public.users'::regclass
AND tgname IN (
  'set_user_referral_path',
  'create_portfolio_on_user_signup', 
  'create_referral_on_user_signup',
  'create_upline_referrals'
)
ORDER BY tgname;

-- Expected: 4 triggers, all enabled

-- =====================================================
-- 7. Summary
-- =====================================================
DO $$
DECLARE
  policy_count INTEGER;
  trigger_count INTEGER;
  column_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Count INSERT policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'users' 
  AND cmd = 'INSERT';
  
  -- Count user triggers
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger 
  WHERE tgrelid = 'public.users'::regclass
  AND tgname IN ('set_user_referral_path', 'create_portfolio_on_user_signup', 'create_referral_on_user_signup', 'create_upline_referrals');
  
  -- Check column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'referred_by'
  ) INTO column_exists;
  
  -- Check function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) INTO function_exists;
  
  RAISE NOTICE '=== RLS FIX VERIFICATION SUMMARY ===';
  RAISE NOTICE 'INSERT policies: % (should be 2)', policy_count;
  RAISE NOTICE 'User triggers: % (should be 4)', trigger_count;
  RAISE NOTICE 'referred_by column: % (should be true)', column_exists;
  RAISE NOTICE 'handle_new_user function: % (should be true)', function_exists;
  
  IF policy_count = 2 AND trigger_count = 4 AND column_exists AND function_exists THEN
    RAISE NOTICE '🎉 ALL CHECKS PASSED - RLS fix is working!';
    RAISE NOTICE 'User signup should now work correctly';
  ELSE
    RAISE NOTICE '❌ Some checks failed - review the output above';
  END IF;
  
  RAISE NOTICE '======================================';
END $$;
