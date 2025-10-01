// Portfolio context for managing user portfolio data

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, subscribeToPortfolioUpdates } from '@/lib/supabase'
import { updatePortfolioValue } from '@/lib/api'
import { useAuth } from './AuthContext'
import type { Portfolio, PortfolioContextType } from '@/types'

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPortfolio()
      
      // Subscribe to real-time updates
      const subscription = subscribeToPortfolioUpdates(user.id, (payload) => {
        console.log('Portfolio updated:', payload)
        setPortfolio(payload.new)
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      setPortfolio(null)
      setLoading(false)
    }
  }, [user])

  async function loadPortfolio() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setPortfolio(data)
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  async function refresh() {
    if (!user) return

    try {
      // Update portfolio value based on current prices
      await updatePortfolioValue(user.id)
      
      // Reload portfolio
      await loadPortfolio()
    } catch (error) {
      console.error('Error refreshing portfolio:', error)
      throw error
    }
  }

  const value: PortfolioContextType = {
    portfolio,
    loading,
    refresh,
  }

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
