-- Seed data for testing CoinDesk Crypto 5 ETF Platform
-- Run this after all other migrations (OPTIONAL - for development only)

-- =====================================================
-- SEED USERS (Test accounts with referral tree)
-- =====================================================

-- Note: These are test users. In production, users are created via Supabase Auth
-- You'll need to create these users via Supabase Auth first, then run this to add profile data

-- Root user (no referrer)
-- INSERT INTO public.users (id, email, full_name, role, wallet_address) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@coindesketf.com', 'Admin User', 'admin', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

-- Level 1 users (referred by root)
-- INSERT INTO public.users (id, email, full_name, referred_by, wallet_address) VALUES
--   ('00000000-0000-0000-0000-000000000002', 'alice@example.com', 'Alice Johnson', '00000000-0000-0000-0000-000000000001', '0x123...'),
--   ('00000000-0000-0000-0000-000000000003', 'bob@example.com', 'Bob Smith', '00000000-0000-0000-0000-000000000001', '0x456...');

-- Level 2 users (referred by Alice)
-- INSERT INTO public.users (id, email, full_name, referred_by, wallet_address) VALUES
--   ('00000000-0000-0000-0000-000000000004', 'charlie@example.com', 'Charlie Brown', '00000000-0000-0000-0000-000000000002', '0x789...'),
--   ('00000000-0000-0000-0000-000000000005', 'david@example.com', 'David Lee', '00000000-0000-0000-0000-000000000002', '0xabc...');

-- =====================================================
-- SEED CRYPTO PRICES (Real-time data, will be updated by edge function)
-- =====================================================

-- Update existing prices with more realistic values
UPDATE public.crypto_prices SET 
  price_usd = 2247.50,
  price_change_24h = 3.24,
  market_cap = 270000000000,
  volume_24h = 15000000000,
  updated_at = NOW()
WHERE symbol = 'ETH';

UPDATE public.crypto_prices SET 
  price_usd = 43250.00,
  price_change_24h = 1.85,
  market_cap = 850000000000,
  volume_24h = 25000000000,
  updated_at = NOW()
WHERE symbol = 'BTC';

UPDATE public.crypto_prices SET 
  price_usd = 105.25,
  price_change_24h = 0.75,
  market_cap = 1000000000,
  volume_24h = 5000000,
  updated_at = NOW()
WHERE symbol = 'ETF';

-- Add more crypto prices for the ETF basket
INSERT INTO public.crypto_prices (symbol, price_usd, price_change_24h, market_cap, volume_24h) VALUES
  ('SOL', 98.50, 5.2, 42000000000, 2000000000),
  ('ADA', 0.52, -1.3, 18000000000, 500000000)
ON CONFLICT (symbol) DO UPDATE SET
  price_usd = EXCLUDED.price_usd,
  price_change_24h = EXCLUDED.price_change_24h,
  updated_at = NOW();

-- =====================================================
-- SEED SAMPLE TRANSACTIONS (for demo purposes)
-- =====================================================

-- This requires actual user IDs from auth.users
-- Example:
-- INSERT INTO public.transactions (user_id, type, status, crypto_type, crypto_amount, usd_value, tx_hash) VALUES
--   ('user-uuid-here', 'deposit', 'completed', 'ETH', 1.5, 3371.25, '0x123abc...');

-- =====================================================
-- SEED SAMPLE INCENTIVES (welcome bonuses, etc.)
-- =====================================================

-- Welcome airdrop for all new users (handled by trigger or edge function)
-- Example:
-- INSERT INTO public.incentives (user_id, type, title, description, amount, loyalty_points) VALUES
--   ('user-uuid-here', 'airdrop', 'Welcome Bonus', 'Welcome to CoinDesk Crypto 5 ETF!', 10, 100);

-- =====================================================
-- VERIFY SEED DATA
-- =====================================================

-- Check users and their referral paths
SELECT 
  id,
  email,
  full_name,
  referral_path,
  nlevel(referral_path) as path_depth,
  referral_code
FROM public.users
ORDER BY referral_path;

-- Check crypto prices
SELECT * FROM public.crypto_prices ORDER BY symbol;

-- Check settings
SELECT * FROM public.settings ORDER BY key;

-- =====================================================
-- HELPFUL QUERIES FOR TESTING
-- =====================================================

-- Get referral tree for a user
-- SELECT * FROM get_downline_referrals('1'::LTREE, 5);

-- Get upline referrers for a user
-- SELECT * FROM get_upline_referrers('1.2.3'::LTREE, 5);

-- Get user statistics
-- SELECT get_user_statistics('user-uuid-here');

-- Test referral bonus calculation
-- SELECT process_referral_bonuses('user-uuid-here', 1000.00);

COMMENT ON TABLE public.crypto_prices IS 'Cached cryptocurrency prices (seeded with initial values)';
