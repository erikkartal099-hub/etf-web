// Hook for fetching and subscribing to crypto prices

import { useEffect, useState } from 'react'
import { supabase, subscribeToCryptoPrices } from '@/lib/supabase'
import type { CryptoPrice } from '@/types'

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPrices()

    // Subscribe to real-time price updates
    const subscription = subscribeToCryptoPrices((payload) => {
      setPrices((prev) =>
        prev.map((p) => (p.symbol === payload.new.symbol ? payload.new : p))
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadPrices() {
    try {
      const { data, error } = await supabase
        .from('crypto_prices')
        .select('*')
        .order('symbol')

      if (error) throw error
      setPrices(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading crypto prices:', err)
    } finally {
      setLoading(false)
    }
  }

  function getPrice(symbol: string): CryptoPrice | undefined {
    return prices.find((p) => p.symbol === symbol)
  }

  return { prices, loading, error, getPrice, refresh: loadPrices }
}
