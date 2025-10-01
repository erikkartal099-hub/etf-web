-- Database functions for CoinDesk Crypto 5 ETF Platform
-- Run after 002_create_tables.sql

-- =====================================================
-- FUNCTION: Calculate referral level based on ltree path
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_referral_level(referrer_path LTREE, referred_path LTREE)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER;
BEGIN
  -- Calculate depth difference between paths
  level := nlevel(referred_path) - nlevel(referrer_path);
  
  -- Ensure level is within 1-5 range
  IF level < 1 THEN
    RETURN NULL;
  ELSIF level > 5 THEN
    RETURN NULL;
  ELSE
    RETURN level;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- FUNCTION: Get referral bonus rate for a level
-- =====================================================
CREATE OR REPLACE FUNCTION get_referral_bonus_rate(ref_level INTEGER)
RETURNS DECIMAL AS $$
DECLARE
  rates JSONB;
  rate DECIMAL;
BEGIN
  -- Get rates from settings
  SELECT value INTO rates 
  FROM public.settings 
  WHERE key = 'referral_bonus_rates';
  
  -- Extract rate for the level
  rate := (rates->>ref_level::TEXT)::DECIMAL;
  
  RETURN COALESCE(rate, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Get all upline referrers for a user
-- =====================================================
CREATE OR REPLACE FUNCTION get_upline_referrers(user_path LTREE, max_levels INTEGER DEFAULT 5)
RETURNS TABLE (
  referrer_id UUID,
  level INTEGER,
  bonus_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    (nlevel(user_path) - nlevel(u.referral_path))::INTEGER AS level,
    get_referral_bonus_rate((nlevel(user_path) - nlevel(u.referral_path))::INTEGER) AS bonus_rate
  FROM public.users u
  WHERE 
    user_path ~ (u.referral_path::TEXT || '.*')::LQUERY
    AND u.referral_path IS NOT NULL
    AND nlevel(user_path) - nlevel(u.referral_path) BETWEEN 1 AND max_levels
  ORDER BY level;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Get all downline referrals for a user
-- =====================================================
CREATE OR REPLACE FUNCTION get_downline_referrals(user_path LTREE, max_levels INTEGER DEFAULT 5)
RETURNS TABLE (
  referred_id UUID,
  full_name TEXT,
  email TEXT,
  level INTEGER,
  total_deposited DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name,
    u.email,
    (nlevel(u.referral_path) - nlevel(user_path))::INTEGER AS level,
    COALESCE(p.total_deposited_usd, 0) AS total_deposited,
    u.created_at
  FROM public.users u
  LEFT JOIN public.portfolios p ON u.id = p.user_id
  WHERE 
    u.referral_path ~ (user_path::TEXT || '.*')::LQUERY
    AND u.referral_path != user_path
    AND nlevel(u.referral_path) - nlevel(user_path) BETWEEN 1 AND max_levels
  ORDER BY level, u.created_at;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Calculate staking rewards
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_staking_rewards(
  staking_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  stake_record RECORD;
  time_elapsed INTERVAL;
  days_elapsed DECIMAL;
  reward DECIMAL;
BEGIN
  -- Get staking record
  SELECT * INTO stake_record
  FROM public.staking
  WHERE id = staking_id;
  
  IF stake_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate time elapsed since last reward calculation
  time_elapsed := NOW() - stake_record.last_reward_calculation;
  days_elapsed := EXTRACT(EPOCH FROM time_elapsed) / 86400.0;
  
  -- Calculate reward: (amount * APY * days) / 365
  reward := (stake_record.amount * stake_record.apy / 100.0 * days_elapsed) / 365.0;
  
  RETURN reward;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Update portfolio total value
-- =====================================================
CREATE OR REPLACE FUNCTION update_portfolio_value(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  eth_price DECIMAL;
  btc_price DECIMAL;
  etf_price DECIMAL;
  total_usd DECIMAL;
BEGIN
  -- Get current prices
  SELECT price_usd INTO eth_price FROM public.crypto_prices WHERE symbol = 'ETH';
  SELECT price_usd INTO btc_price FROM public.crypto_prices WHERE symbol = 'BTC';
  SELECT price_usd INTO etf_price FROM public.crypto_prices WHERE symbol = 'ETF';
  
  -- Calculate total value
  SELECT 
    (eth_balance * COALESCE(eth_price, 0)) +
    (btc_balance * COALESCE(btc_price, 0)) +
    (etf_token_balance * COALESCE(etf_price, 0)) +
    (staked_amount * COALESCE(etf_price, 0)) +
    (referral_earnings * COALESCE(etf_price, 0))
  INTO total_usd
  FROM public.portfolios
  WHERE user_id = p_user_id;
  
  -- Update portfolio
  UPDATE public.portfolios
  SET 
    total_value_usd = COALESCE(total_usd, 0),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Process referral bonuses for a deposit
-- =====================================================
CREATE OR REPLACE FUNCTION process_referral_bonuses(
  p_user_id UUID,
  p_deposit_amount_usd DECIMAL
)
RETURNS VOID AS $$
DECLARE
  user_path LTREE;
  referrer RECORD;
  bonus_amount DECIMAL;
  max_bonus_cap DECIMAL;
  user_total_deposits DECIMAL;
BEGIN
  -- Get user's referral path
  SELECT referral_path INTO user_path
  FROM public.users
  WHERE id = p_user_id;
  
  IF user_path IS NULL THEN
    RETURN;
  END IF;
  
  -- Get max bonus cap percentage
  SELECT (value->>'percentage')::DECIMAL INTO max_bonus_cap
  FROM public.settings
  WHERE key = 'max_referral_bonus_cap';
  
  -- Process bonuses for each upline referrer
  FOR referrer IN 
    SELECT * FROM get_upline_referrers(user_path, 5)
  LOOP
    -- Calculate bonus amount
    bonus_amount := p_deposit_amount_usd * (referrer.bonus_rate / 100.0);
    
    -- Get referrer's total deposits
    SELECT total_deposited_usd INTO user_total_deposits
    FROM public.portfolios
    WHERE user_id = referrer.referrer_id;
    
    -- Apply cap: bonus cannot exceed 50% of referrer's own deposits
    IF user_total_deposits > 0 THEN
      bonus_amount := LEAST(bonus_amount, user_total_deposits * (max_bonus_cap / 100.0));
    ELSE
      bonus_amount := 0;
    END IF;
    
    -- Add bonus to referrer's portfolio
    UPDATE public.portfolios
    SET 
      referral_earnings = referral_earnings + (bonus_amount / 100.0), -- Convert USD to ETF tokens
      updated_at = NOW()
    WHERE user_id = referrer.referrer_id;
    
    -- Update referral record
    UPDATE public.referrals
    SET 
      total_bonus_earned = total_bonus_earned + (bonus_amount / 100.0),
      last_activity_at = NOW()
    WHERE referrer_id = referrer.referrer_id
      AND referred_id = p_user_id;
    
    -- Create transaction record
    INSERT INTO public.transactions (
      user_id,
      type,
      status,
      crypto_type,
      crypto_amount,
      usd_value,
      metadata
    ) VALUES (
      referrer.referrer_id,
      'referral_bonus',
      'completed',
      'ETF',
      bonus_amount / 100.0,
      bonus_amount,
      jsonb_build_object(
        'level', referrer.level,
        'referred_user_id', p_user_id,
        'deposit_amount', p_deposit_amount_usd
      )
    );
    
    -- Create notification
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message
    ) VALUES (
      referrer.referrer_id,
      'referral',
      'Referral Bonus Earned',
      format('You earned %s ETF tokens (Level %s bonus)', 
        ROUND(bonus_amount / 100.0, 4), 
        referrer.level)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Check and award daily login bonus
-- =====================================================
CREATE OR REPLACE FUNCTION check_daily_login_bonus(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_bonus_date DATE;
  bonus_settings JSONB;
  token_amount DECIMAL;
  points_amount INTEGER;
BEGIN
  -- Check if user already got bonus today
  SELECT DATE(created_at) INTO last_bonus_date
  FROM public.incentives
  WHERE user_id = p_user_id
    AND type = 'login_bonus'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_bonus_date = CURRENT_DATE THEN
    RETURN FALSE;
  END IF;
  
  -- Get bonus settings
  SELECT value INTO bonus_settings
  FROM public.settings
  WHERE key = 'daily_login_bonus';
  
  token_amount := (bonus_settings->>'tokens')::DECIMAL;
  points_amount := (bonus_settings->>'points')::INTEGER;
  
  -- Award bonus
  INSERT INTO public.incentives (
    user_id,
    type,
    title,
    description,
    amount,
    loyalty_points,
    claimed
  ) VALUES (
    p_user_id,
    'login_bonus',
    'Daily Login Bonus',
    'Thanks for logging in today!',
    token_amount,
    points_amount,
    TRUE
  );
  
  -- Update portfolio
  UPDATE public.portfolios
  SET 
    etf_token_balance = etf_token_balance + token_amount,
    loyalty_points = loyalty_points + points_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Get user statistics
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  user_path LTREE;
  direct_referrals INTEGER;
  total_referrals INTEGER;
BEGIN
  SELECT referral_path INTO user_path
  FROM public.users
  WHERE id = p_user_id;
  
  -- Count direct referrals (level 1)
  SELECT COUNT(*) INTO direct_referrals
  FROM public.users
  WHERE referral_path ~ (user_path::TEXT || '.*{1}')::LQUERY;
  
  -- Count all referrals (levels 1-5)
  SELECT COUNT(*) INTO total_referrals
  FROM public.users
  WHERE referral_path ~ (user_path::TEXT || '.*')::LQUERY
    AND referral_path != user_path;
  
  -- Build statistics JSON
  SELECT jsonb_build_object(
    'direct_referrals', COALESCE(direct_referrals, 0),
    'total_referrals', COALESCE(total_referrals, 0),
    'portfolio_value', COALESCE(p.total_value_usd, 0),
    'total_deposited', COALESCE(p.total_deposited_usd, 0),
    'referral_earnings', COALESCE(p.referral_earnings, 0),
    'staking_rewards', COALESCE(p.staking_rewards, 0),
    'loyalty_points', COALESCE(p.loyalty_points, 0)
  ) INTO stats
  FROM public.portfolios p
  WHERE p.user_id = p_user_id;
  
  RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION calculate_referral_level IS 'Calculate referral level between two users based on ltree paths';
COMMENT ON FUNCTION get_upline_referrers IS 'Get all upline referrers for a user (up to 5 levels)';
COMMENT ON FUNCTION get_downline_referrals IS 'Get all downline referrals for a user';
COMMENT ON FUNCTION process_referral_bonuses IS 'Process and distribute referral bonuses after a deposit';
COMMENT ON FUNCTION update_portfolio_value IS 'Recalculate portfolio value based on current crypto prices';
COMMENT ON FUNCTION check_daily_login_bonus IS 'Check and award daily login bonus if eligible';
