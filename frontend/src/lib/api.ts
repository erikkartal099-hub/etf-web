// API helper functions for interacting with Supabase Edge Functions

import { supabase } from './supabase'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace('/rest/v1', '/functions/v1')

// Process deposit
export async function processDeposit(data: {
  userId: string
  cryptoType: 'ETH' | 'BTC'
  amount: number
  txHash: string
  walletAddress: string
}) {
  const { data: session } = await supabase.auth.getSession()
  
  const response = await fetch(`${FUNCTIONS_URL}/process-deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.session?.access_token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process deposit')
  }

  return response.json()
}

// Process withdrawal
export async function processWithdrawal(data: {
  userId: string
  cryptoType: 'ETH' | 'BTC'
  amount: number
  walletAddress: string
}) {
  const { data: session } = await supabase.auth.getSession()
  
  const response = await fetch(`${FUNCTIONS_URL}/process-withdrawal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.session?.access_token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process withdrawal')
  }

  return response.json()
}

// Fetch crypto prices
export async function fetchCryptoPrices() {
  const response = await fetch(`${FUNCTIONS_URL}/fetch-crypto-prices`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices')
  }

  return response.json()
}

// Send notification
export async function sendNotification(data: {
  userId: string
  type: 'email' | 'push' | 'sms'
  subject?: string
  message: string
  template?: string
  data?: Record<string, any>
}) {
  const { data: session } = await supabase.auth.getSession()
  
  const response = await fetch(`${FUNCTIONS_URL}/send-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.session?.access_token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to send notification')
  }

  return response.json()
}

// Get user statistics
export async function getUserStatistics(userId: string) {
  const { data, error } = await supabase.rpc('get_user_statistics', {
    p_user_id: userId,
  })

  if (error) throw error
  return data
}

// Get downline referrals
export async function getDownlineReferrals(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('referral_path')
    .eq('id', userId)
    .single()

  if (!user?.referral_path) return []

  const { data, error } = await supabase.rpc('get_downline_referrals', {
    user_path: user.referral_path,
    max_levels: 5,
  })

  if (error) throw error
  return data
}

// Check daily login bonus
export async function checkDailyLoginBonus(userId: string) {
  const { data, error } = await supabase.rpc('check_daily_login_bonus', {
    p_user_id: userId,
  })

  if (error) throw error
  return data
}

// Update portfolio value
export async function updatePortfolioValue(userId: string) {
  const { data, error } = await supabase.rpc('update_portfolio_value', {
    p_user_id: userId,
  })

  if (error) throw error
  return data
}
