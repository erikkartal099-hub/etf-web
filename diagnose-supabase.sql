-- Supabase Configuration Diagnostic
-- Run this in Supabase SQL Editor to verify your setup

-- =====================================================
-- STEP 1: Check Project Configuration
-- =====================================================

DO $$
DECLARE
  project_url TEXT;
  anon_key TEXT;
BEGIN
  -- Get project URL from settings
  -- Note: This is a diagnostic query to help identify configuration issues
  RAISE NOTICE '=== SUPABASE CONFIGURATION DIAGNOSTIC ===';
  RAISE NOTICE 'Project ID should be: vovlsbesaapezkfggdba';
  RAISE NOTICE 'Expected URL format: https://vovlsbesaapezkfggdba.supabase.co';
  RAISE NOTICE '';
  RAISE NOTICE 'If you see 404 errors, check these in your frontend:';
  RAISE NOTICE '1. VITE_SUPABASE_URL environment variable';
  RAISE NOTICE '2. VITE_SUPABASE_ANON_KEY environment variable';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 2: Check Database Tables
-- =====================================================

DO $$
DECLARE
  users_table_exists BOOLEAN;
  auth_users_exists BOOLEAN;
BEGIN
  -- Check if public.users table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'users' 
    AND table_schema = 'public'
  ) INTO users_table_exists;
  
  -- Check if auth.users table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'users' 
    AND table_schema = 'auth'
  ) INTO auth_users_exists;
  
  RAISE NOTICE '=== DATABASE TABLES STATUS ===';
  RAISE NOTICE 'public.users table: %', users_table_exists;
  RAISE NOTICE 'auth.users table: %', auth_users_exists;
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 3: Check RLS Policies
-- =====================================================

DO $$
DECLARE
  rls_enabled BOOLEAN;
  insert_policy_count INTEGER;
BEGIN
  -- Check if RLS is enabled
  SELECT relrowsecurity FROM pg_class 
  WHERE relname = 'users' 
  AND relnamespace = 'public'::regnamespace
  INTO rls_enabled;
  
  -- Count INSERT policies
  SELECT COUNT(*) INTO insert_policy_count
  FROM pg_policies 
  WHERE tablename = 'users' 
  AND cmd = 'INSERT';
  
  RAISE NOTICE '=== RLS POLICIES STATUS ===';
  RAISE NOTICE 'RLS enabled on users: %', COALESCE(rls_enabled, false);
  RAISE NOTICE 'INSERT policies: %', insert_policy_count;
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 4: Check Auth Trigger
-- =====================================================

DO $$
DECLARE
  trigger_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Check if auth trigger exists
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgrelid = 'auth.users'::regclass
    AND tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  -- Check if handle function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) INTO function_exists;
  
  RAISE NOTICE '=== AUTH TRIGGER STATUS ===';
  RAISE NOTICE 'Auth trigger exists: %', trigger_exists;
  RAISE NOTICE 'Handle function exists: %', function_exists;
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 5: Test Database Connection
-- =====================================================

SELECT 
  NOW() as current_time,
  current_database() as database_name,
  current_user as user_role,
  version() as postgres_version;

-- =====================================================
-- STEP 6: Show Project URL Format
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== EXPECTED CONFIGURATION ===';
  RAISE NOTICE 'VITE_SUPABASE_URL should be:';
  RAISE NOTICE 'https://vovlsbesaapezkfggdba.supabase.co';
  RAISE NOTICE '';
  RAISE NOTICE 'To get your VITE_SUPABASE_ANON_KEY:';
  RAISE NOTICE '1. Go to Supabase Dashboard → Settings → API';
  RAISE NOTICE '2. Copy the "anon" "public" key';
  RAISE NOTICE '3. Set it in Vercel Environment Variables';
  RAISE NOTICE '';
  RAISE NOTICE '=== DIAGNOSTIC COMPLETE ===';
END $$;
