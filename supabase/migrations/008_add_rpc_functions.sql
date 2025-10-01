-- Add PostgreSQL RPC Functions for CoinDesk Crypto 5 ETF
-- These functions power referrals, statistics, and bonuses

-- 1. Get User Statistics
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_referrals', (
      SELECT COUNT(*) 
      FROM users 
      WHERE referral_path <@ (SELECT referral_path FROM users WHERE id = p_user_id)
      AND id != p_user_id
    ),
    'direct_referrals', (
      SELECT COUNT(*) 
      FROM users 
      WHERE referrer_id = p_user_id
    ),
    'referral_earnings', COALESCE((
      SELECT SUM(amount) 
      FROM transactions 
      WHERE user_id = p_user_id 
      AND type = 'referral_bonus' 
      AND status = 'completed'
    ), 0),
    'total_deposited', COALESCE((
      SELECT SUM(usd_value) 
      FROM transactions 
      WHERE user_id = p_user_id 
      AND type = 'deposit' 
      AND status = 'completed'
    ), 0),
    'total_withdrawn', COALESCE((
      SELECT SUM(usd_value) 
      FROM transactions 
      WHERE user_id = p_user_id 
      AND type = 'withdrawal' 
      AND status = 'completed'
    ), 0)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Get Downline Referrals
CREATE OR REPLACE FUNCTION get_downline_referrals(user_path LTREE, max_levels INT DEFAULT 5)
RETURNS TABLE (
  referred_id UUID,
  full_name TEXT,
  email TEXT,
  level INT,
  total_deposited DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as referred_id,
    u.full_name,
    u.email,
    nlevel(u.referral_path) - nlevel(user_path) as level,
    COALESCE(SUM(t.usd_value), 0) as total_deposited,
    u.created_at
  FROM users u
  LEFT JOIN transactions t ON t.user_id = u.id AND t.type = 'deposit' AND t.status = 'completed'
  WHERE u.referral_path <@ user_path 
    AND u.referral_path != user_path
    AND nlevel(u.referral_path) - nlevel(user_path) <= max_levels
  GROUP BY u.id, u.full_name, u.email, u.referral_path, u.created_at
  ORDER BY level, u.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Check Daily Login Bonus
CREATE OR REPLACE FUNCTION check_daily_login_bonus(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_login TIMESTAMPTZ;
  bonus_amount DECIMAL := 0.1;
BEGIN
  SELECT MAX(created_at) INTO last_login
  FROM incentives
  WHERE user_id = p_user_id AND type = 'daily_login';
  
  -- If no login today, give bonus
  IF last_login IS NULL OR last_login::date < CURRENT_DATE THEN
    INSERT INTO incentives (user_id, type, amount, description, claimed)
    VALUES (p_user_id, 'daily_login', bonus_amount, 'Daily login bonus', FALSE);
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update Portfolio Value
CREATE OR REPLACE FUNCTION update_portfolio_value(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE portfolios p
  SET 
    usd_value = (
      (p.eth_balance * COALESCE((SELECT price_usd FROM crypto_prices WHERE symbol = 'ETH' ORDER BY updated_at DESC LIMIT 1), 2500)) +
      (p.btc_balance * COALESCE((SELECT price_usd FROM crypto_prices WHERE symbol = 'BTC' ORDER BY updated_at DESC LIMIT 1), 45000)) +
      (p.etf_tokens * 1.0)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Calculate Referral Level
CREATE OR REPLACE FUNCTION calculate_referral_level(referrer_path LTREE, referred_path LTREE)
RETURNS INT AS $$
BEGIN
  IF referred_path <@ referrer_path THEN
    RETURN nlevel(referred_path) - nlevel(referrer_path);
  END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Get Referral Bonus Rate
CREATE OR REPLACE FUNCTION get_referral_bonus_rate(level INT)
RETURNS DECIMAL AS $$
BEGIN
  RETURN CASE level
    WHEN 1 THEN 0.10
    WHEN 2 THEN 0.05
    WHEN 3 THEN 0.03
    WHEN 4 THEN 0.02
    WHEN 5 THEN 0.01
    ELSE 0.00
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 7. Process Referral Bonuses (Trigger Function)
CREATE OR REPLACE FUNCTION process_referral_bonuses()
RETURNS TRIGGER AS $$
DECLARE
  upline_user RECORD;
  bonus_amount DECIMAL;
  ref_level INT;
BEGIN
  -- Only process for completed deposits
  IF NEW.type = 'deposit' AND NEW.status = 'completed' THEN
    -- Get all upline referrers (up to 5 levels)
    FOR upline_user IN
      SELECT 
        u.id,
        nlevel(NEW.referral_path) - nlevel(u.referral_path) as level
      FROM users u
      WHERE NEW.referral_path <@ u.referral_path
        AND NEW.referral_path != u.referral_path
        AND nlevel(NEW.referral_path) - nlevel(u.referral_path) <= 5
    LOOP
      ref_level := upline_user.level;
      bonus_amount := NEW.usd_value * get_referral_bonus_rate(ref_level);
      
      -- Create referral bonus transaction
      INSERT INTO transactions (
        user_id,
        type,
        asset,
        amount,
        usd_value,
        status,
        created_at
      ) VALUES (
        upline_user.id,
        'referral_bonus',
        'ETF',
        bonus_amount,
        bonus_amount,
        'completed',
        NOW()
      );
      
      -- Update referral record
      UPDATE referrals
      SET total_earned = total_earned + bonus_amount
      WHERE referrer_id = upline_user.id AND referred_id = NEW.user_id;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-process referral bonuses
DROP TRIGGER IF EXISTS trigger_process_referral_bonuses ON transactions;
CREATE TRIGGER trigger_process_referral_bonuses
  AFTER INSERT OR UPDATE OF status ON transactions
  FOR EACH ROW
  WHEN (NEW.type = 'deposit' AND NEW.status = 'completed')
  EXECUTE FUNCTION process_referral_bonuses();

-- 8. Calculate Staking Rewards
CREATE OR REPLACE FUNCTION calculate_staking_rewards(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_rewards DECIMAL := 0;
  staking_record RECORD;
  days_staked INT;
  reward DECIMAL;
BEGIN
  FOR staking_record IN
    SELECT * FROM staking 
    WHERE user_id = p_user_id AND status = 'active'
  LOOP
    days_staked := EXTRACT(DAY FROM (NOW() - staking_record.start_date));
    reward := (staking_record.amount * (staking_record.apy / 100) * days_staked) / 365;
    total_rewards := total_rewards + reward;
  END LOOP;
  
  RETURN total_rewards;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant Milestone Bonus
CREATE OR REPLACE FUNCTION grant_milestone_bonus(p_user_id UUID, milestone_amount INT, bonus_amount DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
  total_deposited DECIMAL;
  already_granted BOOLEAN;
BEGIN
  -- Check total deposits
  SELECT COALESCE(SUM(usd_value), 0) INTO total_deposited
  FROM transactions
  WHERE user_id = p_user_id AND type = 'deposit' AND status = 'completed';
  
  -- Check if bonus already granted
  SELECT EXISTS(
    SELECT 1 FROM incentives
    WHERE user_id = p_user_id 
    AND type = 'milestone_bonus'
    AND description LIKE '%$' || milestone_amount || '%'
  ) INTO already_granted;
  
  IF total_deposited >= milestone_amount AND NOT already_granted THEN
    INSERT INTO incentives (user_id, type, amount, description, claimed)
    VALUES (
      p_user_id,
      'milestone_bonus',
      bonus_amount,
      'Milestone bonus for $' || milestone_amount || ' deposit',
      FALSE
    );
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION get_user_statistics IS 'Returns comprehensive user statistics including referrals and earnings';
COMMENT ON FUNCTION get_downline_referrals IS 'Returns all downline referrals up to specified levels';
COMMENT ON FUNCTION check_daily_login_bonus IS 'Checks and grants daily login bonus if eligible';
COMMENT ON FUNCTION update_portfolio_value IS 'Updates portfolio USD value based on current crypto prices';
COMMENT ON FUNCTION calculate_referral_level IS 'Calculates referral level between two users';
COMMENT ON FUNCTION get_referral_bonus_rate IS 'Returns bonus rate for given referral level';
COMMENT ON FUNCTION process_referral_bonuses IS 'Automatically processes referral bonuses for completed deposits';
COMMENT ON FUNCTION calculate_staking_rewards IS 'Calculates total accrued staking rewards for user';
COMMENT ON FUNCTION grant_milestone_bonus IS 'Grants milestone bonus when user reaches deposit threshold';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_downline_referrals TO authenticated, anon;
GRANT EXECUTE ON FUNCTION check_daily_login_bonus TO authenticated;
GRANT EXECUTE ON FUNCTION update_portfolio_value TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_staking_rewards TO authenticated;
GRANT EXECUTE ON FUNCTION grant_milestone_bonus TO authenticated;
