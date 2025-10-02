// KYC Proxy Edge Function (scaffold)
// Purpose: Proxy KYC provider (e.g., Sumsub) with secure server-side key handling
// Endpoints (via query param `action`):
// - action=start (POST): begin KYC for a user
// - action=status (GET): check KYC status for a user
//
// Env Vars (set in Supabase Dashboard → Project Settings → Functions → Secrets):
// - KYC_API_BASE (e.g., https://api.sumsub.com)
// - KYC_API_KEY  (secret)
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

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

function getSupabaseAdmin() {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key)
}

async function startKyc(userId: string) {
  // TODO: call provider API here using KYC_API_KEY
  // Example placeholder response
  const applicationId = crypto.randomUUID()

  // Persist an application record (optional)
  const supabase = getSupabaseAdmin()
  await supabase.from('kyc_applications')
    .insert({ user_id: userId, provider: 'sumsub', application_id: applicationId, status: 'pending' })
    .select()

  return { applicationId, status: 'pending', provider: 'sumsub' }
}

async function getKycStatus(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('kyc_applications')
    .select('application_id,status,updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data || { status: 'unknown' }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders, status: 204 })

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'status'

    if (req.method === 'POST' && action === 'start') {
      const body = await req.json().catch(() => ({}))
      const userId = body.userId || url.searchParams.get('userId')
      if (!userId) return json({ error: 'userId required' }, 400)
      const result = await startKyc(userId)
      return json(result, 201)
    }

    if (req.method === 'GET' && action === 'status') {
      const userId = url.searchParams.get('userId')
      if (!userId) return json({ error: 'userId required' }, 400)
      const result = await getKycStatus(userId)
      return json(result)
    }

    return json({ error: 'Unsupported method or action' }, 405)
  } catch (e) {
    console.error('kyc-proxy error:', e)
    return json({ error: 'KYC proxy failed', message: (e as Error).message }, 500)
  }
})

/*
Example usage:

Start KYC:
fetch('https://<project>.supabase.co/functions/v1/kyc-proxy?action=start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '<uuid>' })
})

Check Status:
fetch('https://<project>.supabase.co/functions/v1/kyc-proxy?action=status&userId=<uuid>')
*/
