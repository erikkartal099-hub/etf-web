// Alerts Edge Function (scaffold)
// Purpose: Evaluate saved price alerts and enqueue notifications
// Endpoint (POST): evaluate alerts for a user or all users
//
// Env Vars:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
//
// Tables (expected):
// - price_alerts(id, user_id, symbol, target_price, condition, is_active, triggered_at)
// - notifications(id, user_id, type, title, message, created_at)
//
// Types
interface EvaluateRequest {
  userId?: string
  dryRun?: boolean
}

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function admin() {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key)
}

async function getCurrentPrice(symbol: string): Promise<number> {
  // Preferred: read from crypto_prices table maintained by your feeders
  const sb = admin()
  const { data } = await sb
    .from('crypto_prices')
    .select('symbol, price_usd')
    .eq('symbol', symbol)
    .maybeSingle()
  if (data?.price_usd != null) return Number(data.price_usd)
  // Fallback static for demo
  const prices: Record<string, number> = { BTC: 43000, ETH: 2300, ETF: 1 }
  return prices[symbol] ?? 0
}

async function evaluateAlerts(req: EvaluateRequest) {
  const sb = admin()

  // Load active alerts (optionally for a single user)
  const query = sb
    .from('price_alerts')
    .select('id,user_id,symbol,target_price,condition,is_active,triggered_at')
    .eq('is_active', true)
  
  const { data: alerts, error } = req.userId ? await query.eq('user_id', req.userId) : await query
  if (error) throw error

  const triggers: Array<{ id: string; user_id: string; message: string }> = []

  for (const alert of alerts || []) {
    const price = await getCurrentPrice(String(alert.symbol))
    const op = String(alert.condition).toLowerCase() // 'above' | 'below'
    const threshold = Number(alert.target_price)

    let hit = false
    if (op === 'above') hit = price > threshold
    else if (op === 'below') hit = price < threshold

    if (hit) {
      triggers.push({
        id: alert.id,
        user_id: alert.user_id,
        message: `${String(alert.symbol)} is ${op} ${threshold} (now ${price})`,
      })
    }
  }

  // Enqueue notifications (or persist immediately)
  for (const t of triggers) {
    await sb.from('notifications').insert({
      user_id: t.user_id,
      type: 'price_alert',
      title: 'Price Alert Triggered',
      message: t.message,
    })
  }

  return { evaluated: alerts?.length || 0, triggered: triggers.length }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders, status: 204 })

  try {
    if (req.method !== 'POST') return json({ error: 'Only POST supported' }, 405)

    const body = (await req.json().catch(() => ({}))) as EvaluateRequest
    const result = await evaluateAlerts(body)
    return json(result, 200)
  } catch (e) {
    console.error('alerts error:', e)
    return json({ error: 'Alerts evaluation failed', message: (e as Error).message }, 500)
  }
})

/*
Example usage:

Evaluate all alerts:
fetch('https://<project>.supabase.co/functions/v1/alerts', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
})

Evaluate single user:
fetch('https://<project>.supabase.co/functions/v1/alerts', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: '<uuid>' })
})
*/
