// Supabase client configuration

import { createClient } from '@supabase/supabase-js'

// Environment validation with detailed error messaging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  const errorMsg = `
    ❌ Missing required environment variables: ${missingVars.join(', ')}
    
    To fix this:
    1. Create a .env.local file in the frontend directory
    2. Copy contents from .env.example
    3. Add your Supabase credentials from https://app.supabase.com
    
    Example:
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
  `
  
  console.error(errorMsg)
  
  // In development, show a helpful error message
  if (import.meta.env.DEV) {
    throw new Error(errorMsg)
  }
}

// Create Supabase client with robust configuration
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Redirect URL for auth callback
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': 'coindesk-etf',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get user portfolio
export async function getUserPortfolio(userId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get crypto prices
export async function getCryptoPrices() {
  const { data, error } = await supabase
    .from('crypto_prices')
    .select('*')
  
  if (error) throw error
  return data
}

// Subscribe to real-time updates
export function subscribeToPortfolioUpdates(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`portfolio:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'portfolios',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToCryptoPrices(callback: (payload: any) => void) {
  return supabase
    .channel('crypto_prices')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'crypto_prices',
      },
      callback
    )
    .subscribe()
}
