-- Row Level Security (RLS) Policies for CoinDesk Crypto 5 ETF Platform
-- Run after 004_create_triggers.sql

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (excluding referral fields)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND referral_path = (SELECT referral_path FROM public.users WHERE id = auth.uid())
    AND referred_by = (SELECT referred_by FROM public.users WHERE id = auth.uid())
  );

-- Users can view other users in their downline (for referral tree)
CREATE POLICY "Users can view downline referrals"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND referral_path @> (SELECT referral_path FROM public.users WHERE id = users.id)
    )
  );

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- PORTFOLIOS TABLE POLICIES
-- =====================================================

-- Users can view their own portfolio
CREATE POLICY "Users can view own portfolio"
  ON public.portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own portfolio (limited fields)
CREATE POLICY "Users can update own portfolio"
  ON public.portfolios
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all portfolios
CREATE POLICY "Admins can view all portfolios"
  ON public.portfolios
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own transactions (deposits/withdrawals)
CREATE POLICY "Users can create own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update transaction status
CREATE POLICY "Admins can update transactions"
  ON public.transactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- REFERRALS TABLE POLICIES
-- =====================================================

-- Users can view their own referrals (where they are the referrer)
CREATE POLICY "Users can view own referrals"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_id);

-- Users can view referrals where they are referred (to see who referred them)
CREATE POLICY "Users can view own referrer"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referred_id);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
  ON public.referrals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STAKING TABLE POLICIES
-- =====================================================

-- Users can view their own staking positions
CREATE POLICY "Users can view own staking"
  ON public.staking
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own staking positions
CREATE POLICY "Users can create own staking"
  ON public.staking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own staking (e.g., unstake)
CREATE POLICY "Users can update own staking"
  ON public.staking
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all staking positions
CREATE POLICY "Admins can view all staking"
  ON public.staking
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- INCENTIVES TABLE POLICIES
-- =====================================================

-- Users can view their own incentives
CREATE POLICY "Users can view own incentives"
  ON public.incentives
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own incentives (e.g., claim)
CREATE POLICY "Users can claim own incentives"
  ON public.incentives
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all incentives
CREATE POLICY "Admins can manage all incentives"
  ON public.incentives
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CRYPTO_PRICES TABLE POLICIES
-- =====================================================

-- Everyone can read crypto prices (public data)
CREATE POLICY "Anyone can view crypto prices"
  ON public.crypto_prices
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins/system can update prices
CREATE POLICY "Admins can update crypto prices"
  ON public.crypto_prices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- SETTINGS TABLE POLICIES
-- =====================================================

-- Everyone can read settings
CREATE POLICY "Anyone can view settings"
  ON public.settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update settings"
  ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- SERVICE ROLE POLICIES
-- Allow service role (edge functions) to bypass RLS
-- =====================================================

-- Service role can do everything (used by edge functions)
-- This is handled automatically by Supabase for service_role key

COMMENT ON POLICY "Users can view own profile" ON public.users IS 'Users can only view their own profile';
COMMENT ON POLICY "Users can view own portfolio" ON public.portfolios IS 'Users can only view their own portfolio';
COMMENT ON POLICY "Anyone can view crypto prices" ON public.crypto_prices IS 'Crypto prices are public data';
