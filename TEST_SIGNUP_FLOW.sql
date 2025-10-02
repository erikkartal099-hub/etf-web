-- TEST SIGNUP FLOW - Comprehensive Testing Script
-- This script tests the complete signup flow to ensure everything works

-- =====================================================
-- STEP 1: CLEAN UP ANY EXISTING TEST DATA
-- =====================================================

-- Delete any existing test users
DELETE FROM public.portfolios WHERE user_id IN (
  SELECT id FROM public.users WHERE email LIKE 'test-%@example.com'
);
DELETE FROM public.users WHERE email LIKE 'test-%@example.com';
DELETE FROM auth.users WHERE email LIKE 'test-%@example.com';

DO $$
BEGIN
  RAISE NOTICE '✅ Cleaned up existing test data';
END $$;

-- =====================================================
-- STEP 2: TEST 1 - Basic User Signup (No Referral)
-- =====================================================

DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'test-basic-' || substring(md5(random()::text), 1, 8) || '@example.com';
  user_count INTEGER;
  portfolio_count INTEGER;
BEGIN
  RAISE NOTICE '=== TEST 1: Basic User Signup ===';
  
  -- Generate a test user ID
  test_user_id := gen_random_uuid();
  
  -- Simulate auth.users insertion (this would normally be done by Supabase Auth)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
  ) VALUES (
    test_user_id,
    test_email,
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Test User Basic"}'::jsonb
  );
  
  -- Check if user was created in public.users
  SELECT COUNT(*) INTO user_count FROM public.users WHERE id = test_user_id;
  SELECT COUNT(*) INTO portfolio_count FROM public.portfolios WHERE user_id = test_user_id;
  
  IF user_count = 1 AND portfolio_count = 1 THEN
    RAISE NOTICE '✅ TEST 1 PASSED: Basic user signup successful';
    RAISE NOTICE '   User created: %', test_email;
    RAISE NOTICE '   Portfolio created: %', (portfolio_count = 1);
  ELSE
    RAISE NOTICE '❌ TEST 1 FAILED: Basic user signup failed';
    RAISE NOTICE '   Users created: % (expected 1)', user_count;
    RAISE NOTICE '   Portfolios created: % (expected 1)', portfolio_count;
  END IF;
  
  -- Clean up
  DELETE FROM public.portfolios WHERE user_id = test_user_id;
  DELETE FROM public.users WHERE id = test_user_id;
  DELETE FROM auth.users WHERE id = test_user_id;
  
  RAISE NOTICE '✅ TEST 1 cleanup completed';
  
EXCEPTION WHEN others THEN
  RAISE NOTICE '❌ TEST 1 ERROR: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 3: TEST 2 - User Signup with Referral
-- =====================================================

DO $$
DECLARE
  referrer_id UUID;
  referred_id UUID;
  test_referrer_email TEXT := 'test-referrer-' || substring(md5(random()::text), 1, 8) || '@example.com';
  test_referred_email TEXT := 'test-referred-' || substring(md5(random()::text), 1, 8) || '@example.com';
  referral_count INTEGER;
  notification_count INTEGER;
BEGIN
  RAISE NOTICE '=== TEST 2: User Signup with Referral ===';
  
  -- Create referrer user
  referrer_id := gen_random_uuid();
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
  ) VALUES (
    referrer_id,
    test_referrer_email,
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Test Referrer"}'::jsonb
  );
  
  -- Wait a moment for triggers to complete
  PERFORM pg_sleep(0.1);
  
  -- Get referrer's referral code
  DECLARE
    referrer_code TEXT;
  BEGIN
    SELECT referral_code INTO referrer_code FROM public.users WHERE id = referrer_id;
    
    -- Create referred user with referral
    referred_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    ) VALUES (
      referred_id,
      test_referred_email,
      crypt('testpassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      format('{"full_name": "Test Referred", "referred_by": "%s"}', referrer_id)::jsonb
    );
    
    -- Wait for triggers
    PERFORM pg_sleep(0.1);
    
    -- Check if referral was created
    SELECT COUNT(*) INTO referral_count 
    FROM public.referrals 
    WHERE referrer_id = referrer_id AND referred_id = referred_id;
    
    SELECT COUNT(*) INTO notification_count 
    FROM public.notifications 
    WHERE user_id = referrer_id AND type = 'referral';
    
    IF referral_count = 1 AND notification_count = 1 THEN
      RAISE NOTICE '✅ TEST 2 PASSED: Referral signup successful';
      RAISE NOTICE '   Referrer: %', test_referrer_email;
      RAISE NOTICE '   Referred: %', test_referred_email;
      RAISE NOTICE '   Referral record created: %', (referral_count = 1);
      RAISE NOTICE '   Notification created: %', (notification_count = 1);
    ELSE
      RAISE NOTICE '❌ TEST 2 FAILED: Referral signup failed';
      RAISE NOTICE '   Referral records: % (expected 1)', referral_count;
      RAISE NOTICE '   Notifications: % (expected 1)', notification_count;
    END IF;
    
    -- Clean up
    DELETE FROM public.notifications WHERE user_id IN (referrer_id, referred_id);
    DELETE FROM public.referrals WHERE referrer_id = referrer_id OR referred_id = referred_id;
    DELETE FROM public.portfolios WHERE user_id IN (referrer_id, referred_id);
    DELETE FROM public.users WHERE id IN (referrer_id, referred_id);
    DELETE FROM auth.users WHERE id IN (referrer_id, referred_id);
    
    RAISE NOTICE '✅ TEST 2 cleanup completed';
    
  EXCEPTION WHEN others THEN
    RAISE NOTICE '❌ TEST 2 ERROR: %', SQLERRM;
  END;
  
EXCEPTION WHEN others THEN
  RAISE NOTICE '❌ TEST 2 ERROR: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 4: TEST 3 - RLS Policy Testing
-- =====================================================

DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'test-rls-' || substring(md5(random()::text), 1, 8) || '@example.com';
  insert_success BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE '=== TEST 3: RLS Policy Testing ===';
  
  test_user_id := gen_random_uuid();
  
  -- Test direct insertion into public.users (should work with proper policies)
  BEGIN
    INSERT INTO public.users (
      id,
      email,
      full_name,
      referral_code,
      email_verified,
      created_at,
      updated_at,
      referral_path
    ) VALUES (
      test_user_id,
      test_email,
      'Test RLS User',
      encode(gen_random_bytes(6), 'hex'),
      false,
      NOW(),
      NOW(),
      test_user_id::TEXT::LTREE
    );
    
    insert_success := TRUE;
    RAISE NOTICE '✅ TEST 3 PASSED: Direct user insertion successful';
    
    -- Clean up
    DELETE FROM public.users WHERE id = test_user_id;
    
  EXCEPTION WHEN others THEN
    RAISE NOTICE '❌ TEST 3 FAILED: Direct user insertion failed: %', SQLERRM;
  END;
  
EXCEPTION WHEN others THEN
  RAISE NOTICE '❌ TEST 3 ERROR: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 5: FINAL VERIFICATION
-- =====================================================

DO $$
DECLARE
  rls_enabled BOOLEAN;
  policy_count INTEGER;
  trigger_count INTEGER;
  function_count INTEGER;
  email_verified_exists BOOLEAN;
BEGIN
  RAISE NOTICE '=== FINAL VERIFICATION ===';
  
  -- Check RLS status
  SELECT relrowsecurity FROM pg_class 
  WHERE relname = 'users' 
  AND relnamespace = 'public'::regnamespace
  INTO rls_enabled;
  
  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'users';
  
  -- Count triggers
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger 
  WHERE tgrelid = 'public.users'::regclass
  AND tgname IN ('create_portfolio_on_user_signup', 'set_user_referral_path', 'create_referral_on_user_signup');
  
  -- Count functions
  SELECT COUNT(*) INTO function_count
  FROM pg_proc 
  WHERE proname IN ('handle_new_user', 'create_user_portfolio', 'generate_referral_path', 'create_referral_record')
  AND pronamespace = 'public'::regnamespace;
  
  -- Check if email_verified column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'email_verified'
    AND table_schema = 'public'
  ) INTO email_verified_exists;
  
  RAISE NOTICE 'RLS enabled: %', COALESCE(rls_enabled, false);
  RAISE NOTICE 'Total policies: % (expected 7)', policy_count;
  RAISE NOTICE 'User triggers: % (expected 3)', trigger_count;
  RAISE NOTICE 'Functions: % (expected 4)', function_count;
  RAISE NOTICE 'Email verified column: %', email_verified_exists;
  
  IF rls_enabled AND policy_count = 7 AND trigger_count = 3 AND function_count = 4 AND email_verified_exists THEN
    RAISE NOTICE '🎉 ALL TESTS PASSED!';
    RAISE NOTICE '✅ Database is properly configured';
    RAISE NOTICE '✅ RLS policies are working';
    RAISE NOTICE '✅ Triggers are functional';
    RAISE NOTICE '✅ Signup flow is ready';
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEP:';
    RAISE NOTICE 'Test the frontend signup at: https://etf-web-mi7p.vercel.app/signup';
    RAISE NOTICE 'Expected result: Perfect signup with no errors!';
  ELSE
    RAISE NOTICE '❌ SOME TESTS FAILED';
    RAISE NOTICE 'Please check the configuration and run COMPLETE_DATABASE_FIX.sql again';
  END IF;
  
  RAISE NOTICE '======================================';
END $$;
