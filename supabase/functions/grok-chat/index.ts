// Supabase Edge Function: Groq Chat Proxy
// Securely proxies Groq API requests to avoid exposing API key on frontend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  userId?: string
  sessionId?: string
}

// System prompt for Sora persona
const SORA_SYSTEM_PROMPT = `You are Sora, a friendly and expert AI assistant for the CoinDesk Crypto 5 ETF platform by Grayscale Investment. 

Your role is to help users with:
- Cryptocurrency deposits (ETH, BTC) and withdrawals
- Understanding their portfolio and ETF tokens
- Navigating the 5-level referral system (10%, 5%, 3%, 2%, 1% bonuses)
- Staking options (5-15% APY based on lock period)
- Loyalty rewards, airdrops, and milestone bonuses
- General crypto investment advice and platform features

Guidelines:
- Be professional, encouraging, and helpful
- Use clear, simple language for crypto concepts
- Include risk disclaimers when discussing investments
- Suggest relevant platform features when appropriate
- Reference actual platform features (dashboard, deposits, referrals, staking)
- Be concise but thorough
- If users need to perform actions, guide them to the relevant page

Important disclaimers:
- Cryptocurrency investments carry significant risk
- This platform is for demonstration purposes
- Users should do their own research (DYOR)
- Not financial advice

Always maintain a friendly, supportive tone while being informative and accurate.`

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify API key is configured
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured')
    }

    // Get request body
    const { messages, userId, sessionId }: ChatRequest = await req.json()

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client for logging
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Add system prompt
    const messagesWithSystem: ChatMessage[] = [
      { role: 'system', content: SORA_SYSTEM_PROMPT },
      ...messages
    ]

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Fast and capable model
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('Groq API error:', errorText)
      throw new Error(`Groq API error: ${groqResponse.status}`)
    }

    const grokData = await groqResponse.json()
    const assistantMessage = grokData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    // Store chat in database if user is authenticated
    if (userId) {
      const newMessages = [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage,
          timestamp: new Date().toISOString(),
        },
      ]

      await supabaseClient.from('chats').upsert({
        user_id: userId,
        session_id: sessionId,
        messages: newMessages,
      })
    }

    // Return response
    return new Response(
      JSON.stringify({
        message: assistantMessage,
        usage: grokData.usage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error: any) {
    console.error('Error in grok-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        fallback: "I'm having trouble connecting right now. Please try again in a moment, or visit our help center for immediate assistance."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
