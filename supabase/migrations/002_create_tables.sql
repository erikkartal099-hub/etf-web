-- Core database schema for CoinDesk Crypto 5 ETF Platform
-- Run after 001_enable_extensions.sql

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  wallet_address TEXT UNIQUE,
  
  -- Referral tree path using ltree
  -- Format: '1.2.5' means user 5 referred by 2, who was referred by 1
  referral_path LTREE,
  referral_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by UUID REFERENCES public.users(id),
  
  -- Profile information
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- User role
  role TEXT DEFAULT 'investor' CHECK (role IN ('investor', 'admin')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index on referral_path for efficient tree queries
CREATE INDEX idx_users_referral_path ON public.users USING GIST (referral_path);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);
CREATE INDEX idx_users_wallet ON public.users(wallet_address);

-- =====================================================
-- PORTFOLIOS TABLE
-- =====================================================
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- ETF Token balance
  etf_token_balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  
  -- Crypto deposits (in respective currencies)
  eth_balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  btc_balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  
  -- USD equivalent values (calculated)
  total_value_usd DECIMAL(20, 2) DEFAULT 0 NOT NULL,
  
  -- Staking
  staked_amount DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  staking_rewards DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  
  -- Referral earnings
  referral_earnings DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  
  -- Loyalty points
  loyalty_points INTEGER DEFAULT 0 NOT NULL,
  
  -- Performance tracking
  total_deposited_usd DECIMAL(20, 2) DEFAULT 0 NOT NULL,
  total_withdrawn_usd DECIMAL(20, 2) DEFAULT 0 NOT NULL,
  all_time_profit_loss DECIMAL(20, 2) DEFAULT 0 NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_portfolio UNIQUE(user_id)
);

CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_total_value ON public.portfolios(total_value_usd DESC);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'referral_bonus', 'staking_reward', 'airdrop', 'bonus')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Amounts
  crypto_type TEXT CHECK (crypto_type IN ('ETH', 'BTC', 'ETF')),
  crypto_amount DECIMAL(20, 8),
  usd_value DECIMAL(20, 2),
  
  -- Transaction identifiers
  tx_hash TEXT, -- Blockchain transaction hash
  wallet_address TEXT, -- External wallet for deposits/withdrawals
  
  -- Fees
  fee_amount DECIMAL(20, 8) DEFAULT 0,
  fee_currency TEXT,
  
  -- Metadata
  notes TEXT,
  metadata JSONB, -- Additional data (e.g., referral level, bonus type)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_tx_hash ON public.transactions(tx_hash);

-- =====================================================
-- REFERRALS TABLE
-- =====================================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Referral level (1-5 for 5-level pyramid)
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  
  -- Bonus details
  bonus_rate DECIMAL(5, 2) NOT NULL, -- e.g., 10.00 for 10%
  total_bonus_earned DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  
  -- Activity tracking
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_referral_pair UNIQUE(referrer_id, referred_id)
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX idx_referrals_level ON public.referrals(level);

-- =====================================================
-- STAKING TABLE
-- =====================================================
CREATE TABLE public.staking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Staking details
  amount DECIMAL(20, 8) NOT NULL,
  apy DECIMAL(5, 2) DEFAULT 7.50 NOT NULL, -- Annual Percentage Yield
  
  -- Duration
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ, -- NULL for flexible staking
  lock_period_days INTEGER, -- e.g., 30, 90, 180, 365
  
  -- Rewards
  accumulated_rewards DECIMAL(20, 8) DEFAULT 0 NOT NULL,
  last_reward_calculation TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'unstaked')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unstaked_at TIMESTAMPTZ
);

CREATE INDEX idx_staking_user_id ON public.staking(user_id);
CREATE INDEX idx_staking_status ON public.staking(status);
CREATE INDEX idx_staking_end_date ON public.staking(end_date);

-- =====================================================
-- INCENTIVES TABLE (Airdrops, Bonuses, Rewards)
-- =====================================================
CREATE TABLE public.incentives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Incentive details
  type TEXT NOT NULL CHECK (type IN ('airdrop', 'login_bonus', 'milestone_bonus', 'loyalty_reward', 'badge')),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Reward
  amount DECIMAL(20, 8), -- Token amount (NULL for badges)
  loyalty_points INTEGER DEFAULT 0,
  
  -- Gamification
  badge_name TEXT,
  badge_icon_url TEXT,
  
  -- Status
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incentives_user_id ON public.incentives(user_id);
CREATE INDEX idx_incentives_type ON public.incentives(type);
CREATE INDEX idx_incentives_claimed ON public.incentives(claimed);

-- =====================================================
-- CRYPTO PRICES TABLE (Cache for real-time prices)
-- =====================================================
CREATE TABLE public.crypto_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL UNIQUE,
  price_usd DECIMAL(20, 2) NOT NULL,
  price_change_24h DECIMAL(10, 2),
  market_cap DECIMAL(20, 2),
  volume_24h DECIMAL(20, 2),
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crypto_prices_symbol ON public.crypto_prices(symbol);
CREATE INDEX idx_crypto_prices_updated ON public.crypto_prices(updated_at DESC);

-- Insert initial crypto prices (will be updated by edge function)
INSERT INTO public.crypto_prices (symbol, price_usd, price_change_24h) VALUES
  ('ETH', 2000.00, 2.5),
  ('BTC', 40000.00, 1.8),
  ('ETF', 100.00, 0.5);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'referral', 'price_alert', 'security', 'promotion')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  link TEXT, -- Deep link to relevant page
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- SETTINGS TABLE (Platform settings)
-- =====================================================
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
  ('referral_bonus_rates', '{"1": 10, "2": 5, "3": 3, "4": 2, "5": 1}'::jsonb, 'Bonus rates for each referral level (%)'),
  ('max_referral_bonus_cap', '{"percentage": 50}'::jsonb, 'Maximum referral bonus as % of user deposits'),
  ('staking_apy_rates', '{"flexible": 5, "30_days": 7.5, "90_days": 10, "365_days": 15}'::jsonb, 'APY rates for different staking periods'),
  ('withdrawal_fee', '{"ETH": 0.005, "BTC": 0.0001}'::jsonb, 'Withdrawal fees per crypto'),
  ('min_deposit', '{"ETH": 0.01, "BTC": 0.001}'::jsonb, 'Minimum deposit amounts'),
  ('daily_login_bonus', '{"tokens": 1, "points": 10}'::jsonb, 'Daily login rewards');

COMMENT ON TABLE public.users IS 'Extended user profiles with referral tree paths';
COMMENT ON TABLE public.portfolios IS 'User portfolio balances and investment tracking';
COMMENT ON TABLE public.transactions IS 'All financial transactions (deposits, withdrawals, bonuses)';
COMMENT ON TABLE public.referrals IS 'Referral relationships and bonus tracking';
COMMENT ON TABLE public.staking IS 'Staking positions and rewards';
COMMENT ON TABLE public.incentives IS 'User rewards, airdrops, bonuses, and badges';
COMMENT ON TABLE public.crypto_prices IS 'Cached cryptocurrency prices';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.settings IS 'Platform-wide configuration settings';
