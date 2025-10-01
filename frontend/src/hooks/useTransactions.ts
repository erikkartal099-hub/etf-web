// Hook for fetching user transactions

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Transaction } from '@/types'

export function useTransactions(limit?: number) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user, limit])

  async function loadTransactions() {
    if (!user) return

    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setTransactions(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  return { transactions, loading, error, refresh: loadTransactions }
}
