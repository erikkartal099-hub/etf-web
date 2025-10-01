/**
 * Mock Alchemy/Blockchain Integration
 * 
 * DEMO MODE: Simulates blockchain transactions
 * 
 * ⚠️ PRODUCTION UPGRADE (2-3 weeks):
 * Replace with real Alchemy SDK:
 * ```typescript
 * import { Alchemy, Network } from 'alchemy-sdk';
 * const alchemy = new Alchemy({
 *   apiKey: process.env.ALCHEMY_API_KEY,
 *   network: Network.ETH_MAINNET
 * });
 * const tx = await alchemy.core.getTransaction(txHash);
 * ```
 */

export interface MockTransaction {
  hash: string
  from: string
  to: string
  value: string
  confirmations: number
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  blockNumber?: number
}

// Generate realistic-looking transaction hash
export function generateMockTxHash(): string {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

// Generate mock Ethereum address
export function generateMockAddress(): string {
  return '0x' + Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

// Simulate transaction creation
export async function createMockTransaction(
  cryptoType: 'ETH' | 'BTC',
  amount: number,
  toAddress: string
): Promise<MockTransaction> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  return {
    hash: generateMockTxHash(),
    from: generateMockAddress(),
    to: toAddress,
    value: amount.toString(),
    confirmations: 0,
    status: 'pending',
    timestamp: Date.now(),
  }
}

// Simulate transaction verification
export async function verifyMockTransaction(txHash: string): Promise<MockTransaction> {
  // Simulate blockchain query delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))
  
  // 95% success rate
  const isSuccess = Math.random() > 0.05
  
  return {
    hash: txHash,
    from: generateMockAddress(),
    to: generateMockAddress(),
    value: (Math.random() * 10).toFixed(6),
    confirmations: isSuccess ? Math.floor(Math.random() * 12) + 1 : 0,
    status: isSuccess ? 'confirmed' : 'failed',
    timestamp: Date.now() - Math.random() * 3600000, // Within last hour
    blockNumber: isSuccess ? Math.floor(Math.random() * 1000000) + 18000000 : undefined,
  }
}

// Simulate getting current gas prices
export async function getMockGasPrices() {
  return {
    slow: { maxFee: 25, maxPriorityFee: 1 },
    standard: { maxFee: 35, maxPriorityFee: 2 },
    fast: { maxFee: 50, maxPriorityFee: 3 },
  }
}

// Simulate estimating transaction gas
export async function estimateMockGas(amount: number): Promise<number> {
  // Base gas + some randomness
  return 21000 + Math.floor(Math.random() * 5000)
}

// Calculate mock fee in USD
export function calculateMockFee(gasAmount: number, gasPrice: number, ethPrice: number): number {
  const feeInEth = (gasAmount * gasPrice) / 1e9 // Convert gwei to ETH
  return feeInEth * ethPrice
}

/**
 * UPGRADE PATH:
 * 
 * 1. Install Alchemy SDK:
 *    npm install alchemy-sdk
 * 
 * 2. Get API key from https://www.alchemy.com/
 * 
 * 3. Replace mock functions with real implementations:
 *    - verifyMockTransaction → alchemy.core.getTransaction()
 *    - getMockGasPrices → alchemy.core.getFeeData()
 *    - estimateMockGas → alchemy.core.estimateGas()
 * 
 * 4. Add transaction monitoring:
 *    - Use alchemy.ws.on() for real-time updates
 *    - Implement retry logic for failed queries
 *    - Add transaction receipt verification
 * 
 * 5. Security considerations:
 *    - Never expose API keys on frontend
 *    - Use Edge Functions for sensitive operations
 *    - Implement rate limiting
 *    - Add transaction signing via backend wallet
 * 
 * Estimated time: 2-3 weeks
 * Cost: Alchemy Growth plan $199/month
 */
