import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
const RATE_LIMIT_MAX = 50 // requests per minute
const RATE_LIMIT_WINDOW = 60000 // 1 minute in ms

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(clientId)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count < RATE_LIMIT_MAX) {
    record.count++
    return true
  }

  return false
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get client ID from auth header or IP
    const authHeader = req.headers.get('authorization')
    const clientId = authHeader || req.headers.get('x-forwarded-for') || 'anonymous'

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again in 1 minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request URL
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint') || '/coins/markets'
    const vs_currency = url.searchParams.get('vs_currency') || 'usd'
    const ids = url.searchParams.get('ids') || 'bitcoin,ethereum'
    const order = url.searchParams.get('order') || 'market_cap_desc'
    const per_page = url.searchParams.get('per_page') || '10'
    const page = url.searchParams.get('page') || '1'

    // Whitelist allowed endpoints
    const allowedEndpoints = [
      '/coins/markets',
      '/coins/bitcoin',
      '/coins/ethereum',
      '/simple/price',
      '/global',
    ]

    if (!allowedEndpoints.some((allowed) => endpoint.startsWith(allowed))) {
      return new Response(
        JSON.stringify({ error: 'Endpoint not allowed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build CoinGecko API URL
    let coinGeckoUrl = `${COINGECKO_API_URL}${endpoint}?vs_currency=${vs_currency}`

    if (endpoint.includes('markets')) {
      coinGeckoUrl += `&ids=${ids}&order=${order}&per_page=${per_page}&page=${page}`
    } else if (endpoint.includes('/simple/price')) {
      coinGeckoUrl += `&ids=${ids}&include_24hr_change=true&include_market_cap=true`
    }

    // Fetch from CoinGecko
    const response = await fetch(coinGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CoinDesk-ETF-Platform/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Cache control
    const cacheHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: cacheHeaders,
    })
  } catch (error: any) {
    console.error('CoinGecko proxy error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch crypto data',
        message: error.message,
        // Fallback mock data for development
        mock: [
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 43000,
            market_cap: 840000000000,
            price_change_percentage_24h: 2.5,
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            current_price: 2300,
            market_cap: 275000000000,
            price_change_percentage_24h: 1.8,
          },
        ],
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/* 
Usage Examples:

1. Get market data for multiple coins:
   GET /coingecko-proxy?endpoint=/coins/markets&ids=bitcoin,ethereum&per_page=5

2. Get simple price:
   GET /coingecko-proxy?endpoint=/simple/price&ids=bitcoin,ethereum

3. Get global market data:
   GET /coingecko-proxy?endpoint=/global

Rate Limiting:
- 50 requests per minute per client
- Clients identified by auth token or IP address
- Use Redis/Upstash in production for distributed rate limiting

Caching:
- Responses cached for 60 seconds
- Stale-while-revalidate for 30 seconds

Security:
- Endpoint whitelist to prevent abuse
- Rate limiting per client
- CORS enabled for frontend access
- No API key exposure to frontend
*/
