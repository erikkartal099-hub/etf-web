// Supabase Edge Function: Process Withdrawal
// Handles crypto withdrawal requests

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalRequest {
  userId: string
  cryptoType: 'ETH' | 'BTC'
  amount: number
  walletAddress: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { userId, cryptoType, amount, walletAddress }: WithdrawalRequest = await req.json()

    // Validate input
    if (!userId || !cryptoType || !amount || !walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate wallet address format
    if (!isValidWalletAddress(walletAddress, cryptoType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's portfolio
    const { data: portfolio, error: portfolioError } = await supabaseClient
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (portfolioError) {
      throw new Error(`Failed to fetch portfolio: ${portfolioError.message}`)
    }

    // Check if user has sufficient balance
    const balanceField = cryptoType === 'ETH' ? 'eth_balance' : 'btc_balance'
    const currentBalance = portfolio[balanceField]

    if (currentBalance < amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          available: currentBalance,
          requested: amount
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get withdrawal fee from settings
    const { data: settings } = await supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'withdrawal_fee')
      .single()

    const withdrawalFee = settings?.value[cryptoType] || 0
    const totalAmount = amount + withdrawalFee

    if (currentBalance < totalAmount) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance including fee',
          available: currentBalance,
          requested: amount,
          fee: withdrawalFee,
          total: totalAmount
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current crypto price
    const { data: priceData } = await supabaseClient
      .from('crypto_prices')
      .select('price_usd')
      .eq('symbol', cryptoType)
      .single()

    const usdValue = amount * (priceData?.price_usd || 0)

    // Create withdrawal transaction (status: processing)
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'withdrawal',
        status: 'processing',
        crypto_type: cryptoType,
        crypto_amount: amount,
        usd_value: usdValue,
        wallet_address: walletAddress,
        fee_amount: withdrawalFee,
        fee_currency: cryptoType,
        metadata: {
          requested_at: new Date().toISOString(),
        }
      })
      .select()
      .single()

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`)
    }

    // In production, this would trigger actual blockchain transaction
    // For now, we'll simulate it and mark as completed
    const txHash = await processBlockchainWithdrawal(cryptoType, amount, walletAddress)

    // Update transaction with tx_hash and mark as completed
    await supabaseClient
      .from('transactions')
      .update({
        status: 'completed',
        tx_hash: txHash,
      })
      .eq('id', transaction.id)

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          ...transaction,
          tx_hash: txHash,
          status: 'completed'
        },
        message: `Withdrawal of ${amount} ${cryptoType} processed successfully`,
        fee: withdrawalFee,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Validate wallet address format
function isValidWalletAddress(address: string, cryptoType: string): boolean {
  if (cryptoType === 'ETH') {
    // Ethereum address validation (0x + 40 hex characters)
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  } else if (cryptoType === 'BTC') {
    // Bitcoin address validation (simplified)
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || 
           /^bc1[a-z0-9]{39,59}$/.test(address)
  }
  return false
}

// Process blockchain withdrawal (simulated)
async function processBlockchainWithdrawal(
  cryptoType: string,
  amount: number,
  walletAddress: string
): Promise<string> {
  // In production, use ethers.js with Alchemy/Infura to send actual transaction
  // For demo, generate a mock transaction hash
  
  console.log(`Processing withdrawal: ${amount} ${cryptoType} to ${walletAddress}`)
  
  // Simulate blockchain processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate mock tx hash
  const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  
  return mockTxHash
}

/* To deploy this function:
cd supabase
supabase functions deploy process-withdrawal
*/
