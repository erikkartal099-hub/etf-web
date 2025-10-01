// TypeScript type definitions for CoinDesk Crypto 5 ETF Platform

export interface User {
  id: string
  email: string
  full_name?: string
  wallet_address?: string
  referral_path?: string
  referral_code: string
  referred_by?: string
  avatar_url?: string
  phone?: string
  country?: string
  kyc_status: 'pending' | 'verified' | 'rejected'
  two_factor_enabled: boolean
  role: 'investor' | 'admin'
  created_at: string
  updated_at: string
  last_login_at?: string
  is_active: boolean
}

export interface Portfolio {
  id: string
  user_id: string
  etf_token_balance: number
  eth_balance: number
  btc_balance: number
  total_value_usd: number
  staked_amount: number
  staking_rewards: number
  referral_earnings: number
  loyalty_points: number
  total_deposited_usd: number
  total_withdrawn_usd: number
  all_time_profit_loss: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'referral_bonus' | 'staking_reward' | 'airdrop' | 'bonus'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  crypto_type: 'ETH' | 'BTC' | 'ETF'
  crypto_amount: number
  usd_value: number
  tx_hash?: string
  wallet_address?: string
  fee_amount: number
  fee_currency?: string
  notes?: string
  metadata?: Record<string, any>
  created_at: string
  completed_at?: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  level: number
  bonus_rate: number
  total_bonus_earned: number
  is_active: boolean
  last_activity_at?: string
  created_at: string
}

export interface ReferralTreeNode {
  id: string
  full_name?: string
  email: string
  level: number
  total_deposited: number
  created_at: string
  children?: ReferralTreeNode[]
}

export interface Staking {
  id: string
  user_id: string
  amount: number
  apy: number
  start_date: string
  end_date?: string
  lock_period_days?: number
  accumulated_rewards: number
  last_reward_calculation: string
  status: 'active' | 'completed' | 'unstaked'
  created_at: string
  unstaked_at?: string
}

export interface Incentive {
  id: string
  user_id: string
  type: 'airdrop' | 'login_bonus' | 'milestone_bonus' | 'loyalty_reward' | 'badge'
  title: string
  description?: string
  amount?: number
  loyalty_points: number
  badge_name?: string
  badge_icon_url?: string
  claimed: boolean
  claimed_at?: string
  expires_at?: string
  created_at: string
}

export interface CryptoPrice {
  symbol: string
  price_usd: number
  price_change_24h: number
  market_cap?: number
  volume_24h?: number
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'referral' | 'price_alert' | 'security' | 'promotion'
  title: string
  message: string
  read: boolean
  read_at?: string
  link?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface UserStatistics {
  direct_referrals: number
  total_referrals: number
  portfolio_value: number
  total_deposited: number
  referral_earnings: number
  staking_rewards: number
  loyalty_points: number
}

export interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
}

export interface DepositFormData {
  cryptoType: 'ETH' | 'BTC'
  amount: number
  walletAddress: string
}

export interface WithdrawalFormData {
  cryptoType: 'ETH' | 'BTC'
  amount: number
  walletAddress: string
}

export interface StakingFormData {
  amount: number
  lockPeriodDays: number
  apy: number
}

export interface Settings {
  referral_bonus_rates: Record<string, number>
  max_referral_bonus_cap: { percentage: number }
  staking_apy_rates: Record<string, number>
  withdrawal_fee: Record<string, number>
  min_deposit: Record<string, number>
  daily_login_bonus: { tokens: number; points: number }
}

export interface AuthContextType {
  user: User | null
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

export interface PortfolioContextType {
  portfolio: Portfolio | null
  loading: boolean
  refresh: () => Promise<void>
}

// Utility types
export type CryptoType = 'ETH' | 'BTC' | 'ETF'
export type TransactionType = 'deposit' | 'withdrawal' | 'referral_bonus' | 'staking_reward' | 'airdrop' | 'bonus'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
