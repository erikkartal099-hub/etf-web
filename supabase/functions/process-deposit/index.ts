// Supabase Edge Function: Process Deposit
// Handles crypto deposit verification and portfolio updates

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DepositRequest {
  userId: string
  cryptoType: 'ETH' | 'BTC'
  amount: number
  txHash: string
  walletAddress: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get request body
    const { userId, cryptoType, amount, txHash, walletAddress }: DepositRequest = await req.json()

    // Validate input
    if (!userId || !cryptoType || !amount || !txHash || !walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current crypto price
    const { data: priceData, error: priceError } = await supabaseClient
      .from('crypto_prices')
      .select('price_usd')
      .eq('symbol', cryptoType)
      .single()

    if (priceError) {
      throw new Error(`Failed to fetch crypto price: ${priceError.message}`)
    }

    const usdValue = amount * priceData.price_usd

    // Check for duplicate transaction
    const { data: existingTx } = await supabaseClient
      .from('transactions')
      .select('id')
      .eq('tx_hash', txHash)
      .single()

    if (existingTx) {
      return new Response(
        JSON.stringify({ error: 'Transaction already processed' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify transaction on blockchain (simplified - in production, use Web3 provider)
    // This is a placeholder - actual implementation should verify tx_hash on blockchain
    const isValidTransaction = await verifyBlockchainTransaction(txHash, cryptoType, amount, walletAddress)
    
    if (!isValidTransaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create transaction record (triggers will handle portfolio update and referral bonuses)
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        status: 'completed', // Set as completed after verification
        crypto_type: cryptoType,
        crypto_amount: amount,
        usd_value: usdValue,
        tx_hash: txHash,
        wallet_address: walletAddress,
      })
      .select()
      .single()

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`)
    }

    // Check for milestone achievements
    await checkMilestones(supabaseClient, userId, usdValue)

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        message: `Deposit of ${amount} ${cryptoType} processed successfully`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing deposit:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Verify blockchain transaction (simplified)
async function verifyBlockchainTransaction(
  txHash: string,
  cryptoType: string,
  amount: number,
  walletAddress: string
): Promise<boolean> {
  // In production, use Alchemy/Infura to verify the transaction on blockchain
  // For now, we'll simulate verification
  
  // Check if tx_hash format is valid
  if (!txHash.startsWith('0x') || txHash.length !== 66) {
    return false
  }

  // In real implementation:
  // - Use ethers.js with Alchemy/Infura provider
  // - Verify transaction exists and is confirmed
  // - Check amount and recipient address match
  
  console.log(`Verifying transaction ${txHash} for ${amount} ${cryptoType}`)
  
  // Simulate successful verification for demo
  return true
}

// Check for milestone achievements and award bonuses
async function checkMilestones(supabaseClient: any, userId: string, depositUsd: number) {
  try {
    // Get user's total deposits
    const { data: portfolio } = await supabaseClient
      .from('portfolios')
      .select('total_deposited_usd')
      .eq('user_id', userId)
      .single()

    if (!portfolio) return

    const totalDeposited = portfolio.total_deposited_usd

    // Milestone thresholds and rewards
    const milestones = [
      { threshold: 1000, reward: 10, title: 'First $1K Milestone' },
      { threshold: 5000, reward: 50, title: 'High Roller - $5K' },
      { threshold: 10000, reward: 150, title: 'Whale Status - $10K' },
      { threshold: 50000, reward: 500, title: 'Diamond Hands - $50K' },
    ]

    // Check if any milestone was just crossed
    for (const milestone of milestones) {
      const previousTotal = totalDeposited - depositUsd
      if (previousTotal < milestone.threshold && totalDeposited >= milestone.threshold) {
        // Award milestone bonus
        await supabaseClient
          .from('incentives')
          .insert({
            user_id: userId,
            type: 'milestone_bonus',
            title: milestone.title,
            description: `Congratulations on reaching $${milestone.threshold} in deposits!`,
            amount: milestone.reward,
            loyalty_points: milestone.reward * 10,
            claimed: true,
          })

        // Update portfolio
        await supabaseClient
          .from('portfolios')
          .update({
            etf_token_balance: supabaseClient.rpc('increment', { amount: milestone.reward }),
            loyalty_points: supabaseClient.rpc('increment', { amount: milestone.reward * 10 }),
          })
          .eq('user_id', userId)
      }
    }
  } catch (error) {
    console.error('Error checking milestones:', error)
  }
}

/* To deploy this function:
cd supabase
supabase functions deploy process-deposit --no-verify-jwt
*/
