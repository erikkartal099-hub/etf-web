-- Database triggers for CoinDesk Crypto 5 ETF Platform
-- Run after 003_create_functions.sql

-- =====================================================
-- TRIGGER: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Auto-generate referral path for new users
-- =====================================================
CREATE OR REPLACE FUNCTION generate_referral_path()
RETURNS TRIGGER AS $$
DECLARE
  referrer_path LTREE;
BEGIN
  -- If user has a referrer, build path
  IF NEW.referred_by IS NOT NULL THEN
    -- Get referrer's path
    SELECT referral_path INTO referrer_path
    FROM public.users
    WHERE id = NEW.referred_by;
    
    -- Build new path by appending user's ID
    IF referrer_path IS NOT NULL THEN
      NEW.referral_path := referrer_path || NEW.id::TEXT::LTREE;
    ELSE
      -- Referrer has no path, make this user a root with their referrer
      NEW.referral_path := (NEW.referred_by::TEXT || '.' || NEW.id::TEXT)::LTREE;
    END IF;
  ELSE
    -- No referrer, this is a root user
    NEW.referral_path := NEW.id::TEXT::LTREE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_referral_path
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_path();

-- =====================================================
-- TRIGGER: Create portfolio for new user
-- =====================================================
CREATE OR REPLACE FUNCTION create_user_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  -- Create portfolio entry for new user
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_portfolio_on_user_signup
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_portfolio();

-- =====================================================
-- TRIGGER: Create referral record for new user
-- =====================================================
CREATE OR REPLACE FUNCTION create_referral_record()
RETURNS TRIGGER AS $$
DECLARE
  ref_level INTEGER;
  bonus_rate DECIMAL;
BEGIN
  -- Only create if user has a referrer
  IF NEW.referred_by IS NOT NULL THEN
    -- Calculate level
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
    
    -- Create notification for referrer
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_referral_on_user_signup
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_record();

-- =====================================================
-- TRIGGER: Create all upline referral records
-- =====================================================
CREATE OR REPLACE FUNCTION create_upline_referral_records()
RETURNS TRIGGER AS $$
DECLARE
  upline_ref RECORD;
BEGIN
  -- Only process if user has referral path
  IF NEW.referral_path IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Create referral records for all upline referrers (levels 1-5)
  FOR upline_ref IN 
    SELECT * FROM get_upline_referrers(NEW.referral_path, 5)
  LOOP
    -- Skip if already exists or if it's the direct referrer (already created)
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_upline_referrals
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_upline_referral_records();

-- =====================================================
-- TRIGGER: Update portfolio on completed deposit
-- =====================================================
CREATE OR REPLACE FUNCTION process_completed_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    
    -- Handle deposits
    IF NEW.type = 'deposit' THEN
      -- Update portfolio balances
      IF NEW.crypto_type = 'ETH' THEN
        UPDATE public.portfolios
        SET 
          eth_balance = eth_balance + NEW.crypto_amount,
          etf_token_balance = etf_token_balance + NEW.crypto_amount, -- Mint equivalent ETF tokens
          total_deposited_usd = total_deposited_usd + NEW.usd_value
        WHERE user_id = NEW.user_id;
        
      ELSIF NEW.crypto_type = 'BTC' THEN
        UPDATE public.portfolios
        SET 
          btc_balance = btc_balance + NEW.crypto_amount,
          etf_token_balance = etf_token_balance + (NEW.crypto_amount * 10), -- BTC worth more, adjust ratio
          total_deposited_usd = total_deposited_usd + NEW.usd_value
        WHERE user_id = NEW.user_id;
      END IF;
      
      -- Process referral bonuses
      PERFORM process_referral_bonuses(NEW.user_id, NEW.usd_value);
      
      -- Update portfolio value
      PERFORM update_portfolio_value(NEW.user_id);
      
      -- Create notification
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message
      ) VALUES (
        NEW.user_id,
        'deposit',
        'Deposit Confirmed',
        format('Your deposit of %s %s has been confirmed!', 
          NEW.crypto_amount, 
          NEW.crypto_type)
      );
      
    -- Handle withdrawals
    ELSIF NEW.type = 'withdrawal' THEN
      -- Update portfolio balances
      IF NEW.crypto_type = 'ETH' THEN
        UPDATE public.portfolios
        SET 
          eth_balance = eth_balance - NEW.crypto_amount,
          total_withdrawn_usd = total_withdrawn_usd + NEW.usd_value
        WHERE user_id = NEW.user_id;
        
      ELSIF NEW.crypto_type = 'BTC' THEN
        UPDATE public.portfolios
        SET 
          btc_balance = btc_balance - NEW.crypto_amount,
          total_withdrawn_usd = total_withdrawn_usd + NEW.usd_value
        WHERE user_id = NEW.user_id;
      END IF;
      
      -- Update portfolio value
      PERFORM update_portfolio_value(NEW.user_id);
      
      -- Create notification
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message
      ) VALUES (
        NEW.user_id,
        'withdrawal',
        'Withdrawal Processed',
        format('Your withdrawal of %s %s has been sent!', 
          NEW.crypto_amount, 
          NEW.crypto_type)
      );
    END IF;
    
    -- Set completed timestamp
    NEW.completed_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_transaction_completion
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION process_completed_transaction();

-- =====================================================
-- TRIGGER: Update staking rewards periodically
-- =====================================================
CREATE OR REPLACE FUNCTION update_staking_reward()
RETURNS TRIGGER AS $$
DECLARE
  new_rewards DECIMAL;
BEGIN
  -- Calculate accumulated rewards
  new_rewards := calculate_staking_rewards(NEW.id);
  
  -- Update rewards
  NEW.accumulated_rewards := NEW.accumulated_rewards + new_rewards;
  NEW.last_reward_calculation := NOW();
  
  -- If staking period ended, mark as completed
  IF NEW.end_date IS NOT NULL AND NEW.end_date <= NOW() THEN
    NEW.status := 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_staking_rewards
  BEFORE UPDATE ON public.staking
  FOR EACH ROW
  WHEN (OLD.last_reward_calculation < NOW() - INTERVAL '1 hour')
  EXECUTE FUNCTION update_staking_reward();

-- =====================================================
-- TRIGGER: Update user last login
-- =====================================================
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login_at := NOW();
  
  -- Check for daily login bonus
  PERFORM check_daily_login_bonus(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger should be called from application code on login
-- CREATE TRIGGER set_last_login
--   BEFORE UPDATE ON public.users
--   FOR EACH ROW
--   WHEN (OLD.last_login_at IS DISTINCT FROM NEW.last_login_at)
--   EXECUTE FUNCTION update_last_login();

COMMENT ON FUNCTION update_updated_at_column IS 'Automatically update updated_at timestamp';
COMMENT ON FUNCTION generate_referral_path IS 'Auto-generate ltree path for new users based on referrer';
COMMENT ON FUNCTION create_user_portfolio IS 'Create portfolio entry when user signs up';
COMMENT ON FUNCTION create_referral_record IS 'Create referral record when user signs up with referrer';
COMMENT ON FUNCTION process_completed_transaction IS 'Process portfolio updates when transaction completes';
COMMENT ON FUNCTION update_staking_reward IS 'Calculate and update staking rewards';
