/**
 * Price Alerts Checker - Supabase Edge Function
 * 
 * Runs on a cron schedule to check active price alerts and trigger notifications
 * 
 * Schedule: Every 1 minute via Supabase Cron
 * Setup: supabase functions deploy check-price-alerts
 * Cron: Add to supabase/functions/_shared/cron.ts
 * 
 * Features:
 * - Checks all active price alerts
 * - Triggers alerts when conditions are met
 * - Sends push notifications (mock)
 * - Logs alert triggers for compliance
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PriceAlert {
  id: string
  user_id: string
  symbol: string
  target_price: number
  condition: 'above' | 'below'
  is_active: boolean
  triggered_at: string | null
}

interface CryptoPrice {
  symbol: string
  price_usd: number
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting price alerts check...')

    // Fetch all active alerts
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('price_alerts')
      .select('*')
      .eq('is_active', true)
      .is('triggered_at', null)

    if (alertsError) {
      throw alertsError
    }

    if (!alerts || alerts.length === 0) {
      console.log('No active alerts to check')
      return new Response(
        JSON.stringify({ message: 'No active alerts', checked: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Checking ${alerts.length} active alerts`)

    // Fetch current prices for all symbols
    const symbols = [...new Set(alerts.map((a: PriceAlert) => a.symbol))]
    const { data: prices, error: pricesError } = await supabaseClient
      .from('crypto_prices')
      .select('symbol, price_usd')
      .in('symbol', symbols)

    if (pricesError) {
      throw pricesError
    }

    const priceMap = new Map<string, number>()
    prices?.forEach((p: CryptoPrice) => {
      priceMap.set(p.symbol, p.price_usd)
    })

    let triggeredCount = 0

    // Check each alert
    for (const alert of alerts as PriceAlert[]) {
      const currentPrice = priceMap.get(alert.symbol)
      
      if (!currentPrice) {
        console.log(`No price data for ${alert.symbol}`)
        continue
      }

      let shouldTrigger = false

      if (alert.condition === 'above' && currentPrice >= alert.target_price) {
        shouldTrigger = true
      } else if (alert.condition === 'below' && currentPrice <= alert.target_price) {
        shouldTrigger = true
      }

      if (shouldTrigger) {
        console.log(`Triggering alert ${alert.id}: ${alert.symbol} ${alert.condition} ${alert.target_price}`)

        // Mark alert as triggered
        const { error: updateError } = await supabaseClient
          .from('price_alerts')
          .update({
            triggered_at: new Date().toISOString(),
            is_active: false,
          })
          .eq('id', alert.id)

        if (updateError) {
          console.error('Error updating alert:', updateError)
          continue
        }

        // Log the trigger event
        await supabaseClient.from('compliance_logs').insert({
          user_id: alert.user_id,
          event_type: 'PRICE_ALERT_TRIGGERED',
          details: {
            alert_id: alert.id,
            symbol: alert.symbol,
            target_price: alert.target_price,
            current_price: currentPrice,
            condition: alert.condition,
          },
        })

        // Send push notification (mock)
        // Production: Use Web Push API, FCM, or OneSignal
        await sendPushNotification(alert, currentPrice)

        triggeredCount++
      }
    }

    console.log(`Checked ${alerts.length} alerts, triggered ${triggeredCount}`)

    return new Response(
      JSON.stringify({
        message: 'Price alerts checked successfully',
        checked: alerts.length,
        triggered: triggeredCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error checking price alerts:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendPushNotification(alert: PriceAlert, currentPrice: number) {
  // Mock push notification
  // Production implementation would:
  // 1. Fetch user's push subscription from database
  // 2. Send notification via Web Push API, FCM, or OneSignal
  // 3. Handle delivery failures and retries

  console.log('📱 Push Notification (Mock):', {
    userId: alert.user_id,
    title: 'Price Alert Triggered',
    body: `${alert.symbol} is ${alert.condition} $${alert.target_price.toLocaleString()}`,
    data: {
      alertId: alert.id,
      symbol: alert.symbol,
      currentPrice,
      targetPrice: alert.target_price,
    },
  })

  // Production: Uncomment and configure
  /*
  const webPushConfig = {
    endpoint: 'user_push_endpoint',
    keys: {
      p256dh: 'user_p256dh_key',
      auth: 'user_auth_key',
    },
  }

  await webpush.sendNotification(
    webPushConfig,
    JSON.stringify({
      title: 'Price Alert Triggered',
      body: `${alert.symbol} is ${alert.condition} $${alert.target_price.toLocaleString()}`,
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      data: {
        url: '/dashboard',
        alertId: alert.id,
      },
    })
  )
  */
}
