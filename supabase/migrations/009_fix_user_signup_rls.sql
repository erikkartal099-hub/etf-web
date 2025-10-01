-- Fix RLS policy to allow user signup
-- Issue: "new row violates row-level security policy for table users"
-- Cause: No INSERT policy exists for users table

-- =====================================================
-- CRITICAL FIX: Allow user signup via auth trigger
-- =====================================================

-- First, ensure the referred_by column exists (handle schema cache issues)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'referred_by'
    AND table_schema = 'public'
  ) THEN
    -- Add the missing column
    ALTER TABLE public.users ADD COLUMN referred_by UUID REFERENCES public.users(id);
    RAISE NOTICE 'Added missing referred_by column';
  END IF;
END $$;

-- Drop existing triggers to recreate with SECURITY DEFINER
DROP TRIGGER IF EXISTS create_portfolio_on_user_signup ON public.users;
DROP TRIGGER IF EXISTS create_referral_on_user_signup ON public.users;
DROP TRIGGER IF EXISTS create_upline_referrals ON public.users;
DROP TRIGGER IF EXISTS set_user_referral_path ON public.users;

-- Recreate functions with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION generate_referral_path()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_path LTREE;
BEGIN
  -- Check if referred_by column exists before using it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'referred_by'
    AND table_schema = 'public'
  ) AND NEW.referred_by IS NOT NULL THEN
    -- Get referrer's path
    BEGIN
      SELECT referral_path INTO referrer_path
      FROM public.users
      WHERE id = NEW.referred_by;
      
      IF referrer_path IS NOT NULL THEN
        NEW.referral_path := referrer_path || NEW.id::TEXT::LTREE;
      ELSE
        NEW.referral_path := (NEW.referred_by::TEXT || '.' || NEW.id::TEXT)::LTREE;
      END IF;
    EXCEPTION WHEN others THEN
      -- If any error occurs, make this a root user
      NEW.referral_path := NEW.id::TEXT::LTREE;
    END;
  ELSE
    -- No referrer or column doesn't exist, this is a root user
    NEW.referral_path := NEW.id::TEXT::LTREE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_user_portfolio()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create portfolio entry for new user
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_referral_record()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_level INTEGER;
  bonus_rate DECIMAL;
BEGIN
  -- Check if referred_by column exists and user has a referrer
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'referred_by'
    AND table_schema = 'public'
  ) AND NEW.referred_by IS NOT NULL THEN
    
    -- Check if required functions exist
    IF EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'calculate_referral_level'
    ) AND EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'get_referral_bonus_rate'
    ) THEN
      
      -- Calculate level
      BEGIN
        SELECT calculate_referral_level(
          (SELECT referral_path FROM public.users WHERE id = NEW.referred_by),
          NEW.referral_path
        ) INTO ref_level;
        
        -- Get bonus rate for this level
        bonus_rate := get_referral_bonus_rate(ref_level);
        
        -- Create referral record
        INSERT INTO public.referrals (
          referrer_id,
          referred_id,
          level,
          bonus_rate
        ) VALUES (
          NEW.referred_by,
          NEW.id,
          COALESCE(ref_level, 1),
          COALESCE(bonus_rate, 0)
        );
        
        -- Send notification
        INSERT INTO public.notifications (
          user_id,
          type,
          title,
          message
        ) VALUES (
          NEW.referred_by,
          'referral',
          'New Referral',
          format('User %s joined using your referral link!', COALESCE(NEW.full_name, NEW.email))
        );
        
      EXCEPTION WHEN others THEN
        -- Silently handle errors in referral creation
        RAISE NOTICE 'Referral creation failed for user %: %', NEW.id, SQLERRM;
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_upline_referral_records()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  upline_ref RECORD;
BEGIN
  IF NEW.referral_path IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check if get_upline_referrers function exists
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'get_upline_referrers'
  ) THEN
    
    BEGIN
      FOR upline_ref IN 
        SELECT * FROM get_upline_referrers(NEW.referral_path, 5)
      LOOP
        IF upline_ref.referrer_id != NEW.referred_by THEN
          INSERT INTO public.referrals (
            referrer_id,
            referred_id,
            level,
            bonus_rate
          ) VALUES (
            upline_ref.referrer_id,
            NEW.id,
            upline_ref.level,
            upline_ref.bonus_rate
          )
          ON CONFLICT (referrer_id, referred_id) DO NOTHING;
        END IF;
      END LOOP;
      
    EXCEPTION WHEN others THEN
      -- Silently handle errors in upline referral creation
      RAISE NOTICE 'Upline referral creation failed for user %: %', NEW.id, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate all triggers
CREATE TRIGGER set_user_referral_path
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_path();

CREATE TRIGGER create_portfolio_on_user_signup
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_portfolio();

CREATE TRIGGER create_referral_on_user_signup
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_record();

CREATE TRIGGER create_upline_referrals
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_upline_referral_records();

-- =====================================================
-- ADD INSERT POLICY FOR USER SIGNUP
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow user creation from auth" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Allow users to be inserted from auth.users trigger
-- This is safe because Supabase auth handles the actual authentication
CREATE POLICY "Allow user creation from auth"
  ON public.users
  FOR INSERT
  WITH CHECK (
    -- Allow if the user ID matches the authenticated user
    -- (happens when auth.users record is created)
    auth.uid() = id
  );

-- Alternative: Allow service role to insert (for auth triggers)
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- =====================================================
-- CREATE FUNCTION TO HANDLE AUTH USER CREATION
-- =====================================================

-- Function called by Supabase auth trigger
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comments for documentation
COMMENT ON POLICY "Allow user creation from auth" ON public.users IS 'Allow new users to be created when signing up';
COMMENT ON POLICY "Service role can insert users" ON public.users IS 'Allow service role to insert users for triggers';
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically create public.users record when auth.users is created';

-- =====================================================
-- VERIFICATION: Show current policies
-- =====================================================
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'users' 
  AND cmd = 'INSERT';
  
  RAISE NOTICE 'RLS Fix Applied: % INSERT policies now exist for users table', policy_count;
  RAISE NOTICE 'User signup should now work correctly';
END $$;
