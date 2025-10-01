// Supabase Edge Function: Fetch Crypto Prices
// Updates crypto prices from CoinGecko API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Fetch prices for major cryptocurrencies
    const coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano']
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA']

    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
          ...(Deno.env.get('COINGECKO_API_KEY') && {
            'X-Cg-Pro-Api-Key': Deno.env.get('COINGECKO_API_KEY')
          })
        }
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const priceData = await response.json()

    // Update prices in database
    const updates = []
    
    for (let i = 0; i < coinIds.length; i++) {
      const coinId = coinIds[i]
      const symbol = symbols[i]
      const data = priceData[coinId]

      if (data) {
        const update = supabaseClient
          .from('crypto_prices')
          .upsert({
            symbol,
            price_usd: data.usd,
            price_change_24h: data.usd_24h_change || 0,
            market_cap: data.usd_market_cap || 0,
            volume_24h: data.usd_24h_vol || 0,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'symbol'
          })

        updates.push(update)
      }
    }

    // Calculate ETF token price (average of top 5 cryptos weighted)
    const etfPrice = calculateETFPrice(priceData)
    updates.push(
      supabaseClient
        .from('crypto_prices')
        .upsert({
          symbol: 'ETF',
          price_usd: etfPrice,
          price_change_24h: calculateWeightedChange(priceData),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'symbol'
        })
    )

    await Promise.all(updates)

    // Update all user portfolio values
    await updateAllPortfolioValues(supabaseClient)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Crypto prices updated successfully',
        prices: { ...priceData, ETF: etfPrice },
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Calculate ETF token price (weighted average of basket)
function calculateETFPrice(priceData: any): number {
  const weights = {
    bitcoin: 0.40,    // 40% BTC
    ethereum: 0.30,   // 30% ETH
    solana: 0.15,     // 15% SOL
    cardano: 0.10,    // 10% ADA
    // 5% cash/stablecoins
  }

  let totalValue = 0
  let totalWeight = 0

  for (const [coin, weight] of Object.entries(weights)) {
    if (priceData[coin]) {
      totalValue += priceData[coin].usd * weight
      totalWeight += weight
    }
  }

  // Normalize to ~$100 base price
  return totalWeight > 0 ? (totalValue / totalWeight) * 2.5 : 100
}

// Calculate weighted 24h price change for ETF
function calculateWeightedChange(priceData: any): number {
  const weights = {
    bitcoin: 0.40,
    ethereum: 0.30,
    solana: 0.15,
    cardano: 0.10,
  }

  let totalChange = 0
  let totalWeight = 0

  for (const [coin, weight] of Object.entries(weights)) {
    if (priceData[coin] && priceData[coin].usd_24h_change) {
      totalChange += priceData[coin].usd_24h_change * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? totalChange / totalWeight : 0
}

// Update all user portfolio values based on new prices
async function updateAllPortfolioValues(supabaseClient: any) {
  try {
    // Get all active users
    const { data: users } = await supabaseClient
      .from('users')
      .select('id')
      .eq('is_active', true)

    if (!users) return

    // Update each user's portfolio value
    const updates = users.map((user: any) =>
      supabaseClient.rpc('update_portfolio_value', { p_user_id: user.id })
    )

    await Promise.all(updates)
  } catch (error) {
    console.error('Error updating portfolio values:', error)
  }
}

/* To deploy this function:
cd supabase
supabase functions deploy fetch-crypto-prices --no-verify-jwt

Set up a cron job to run this every 5 minutes:
https://supabase.com/docs/guides/functions/schedule-functions
*/
