/**
 * Mock Wallet Connection Component
 * 
 * DEMO MODE: Simulates MetaMask/WalletConnect
 * 
 * ⚠️ PRODUCTION UPGRADE (1-2 weeks):
 * Integrate real wallet via Web3Modal:
 * ```typescript
 * import { Web3Modal } from '@web3modal/react'
 * import { WagmiConfig } from 'wagmi'
 * ```
 */

import { useState } from 'react'
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react'
import { generateMockAddress } from '@/utils/mockAlchemy'

interface WalletMockProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}

export default function WalletMock({ onConnect, onDisconnect }: WalletMockProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const mockConnect = async () => {
    setIsConnecting(true)
    
    // Simulate wallet popup delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockAddress = generateMockAddress()
    setAddress(mockAddress)
    setIsConnected(true)
    setIsConnecting(false)
    
    onConnect?.(mockAddress)
  }

  const mockDisconnect = () => {
    setAddress(null)
    setIsConnected(false)
    onDisconnect?.()
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold">Wallet Connection</h3>
        </div>
        
        {isConnected && (
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            Connected
          </span>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mb-4">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>DEMO MODE:</strong> This simulates wallet connection. 
            Real implementation requires MetaMask integration.
          </p>
        </div>
      </div>

      {!isConnected ? (
        <button
          onClick={mockConnect}
          disabled={isConnecting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet (Mock)'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected Address</p>
            <p className="font-mono text-sm font-semibold">{address && formatAddress(address)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 break-all">{address}</p>
          </div>
          
          <button
            onClick={mockDisconnect}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs">
        <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Production Upgrade Path:</p>
        <ul className="space-y-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
          <li>Install: npm install @web3modal/react wagmi viem</li>
          <li>Integrate MetaMask + WalletConnect</li>
          <li>Add network switching (Mainnet/Testnet)</li>
          <li>Real balance checking from blockchain</li>
          <li>Transaction signing with user's wallet</li>
        </ul>
        <p className="mt-2 text-gray-500">Time: 1-2 weeks | Cost: $0 (open source)</p>
      </div>
    </div>
  )
}

/**
 * REAL IMPLEMENTATION GUIDE:
 * 
 * 1. Install dependencies:
 * ```bash
 * npm install @web3modal/react wagmi viem @wagmi/core @wagmi/connectors
 * ```
 * 
 * 2. Configure Web3Modal:
 * ```typescript
 * import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
 * import { mainnet, sepolia } from 'wagmi/chains'
 * 
 * const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'
 * 
 * const metadata = {
 *   name: 'CoinDesk Crypto 5 ETF',
 *   description: 'Professional crypto investment platform',
 *   url: 'https://your-domain.com',
 *   icons: ['https://your-domain.com/icon.png']
 * }
 * 
 * const chains = [mainnet, sepolia]
 * const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
 * 
 * createWeb3Modal({ wagmiConfig, projectId, chains })
 * ```
 * 
 * 3. Use in component:
 * ```typescript
 * import { useWeb3Modal } from '@web3modal/wagmi/react'
 * import { useAccount, useDisconnect } from 'wagmi'
 * 
 * const { open } = useWeb3Modal()
 * const { address, isConnected } = useAccount()
 * const { disconnect } = useDisconnect()
 * ```
 * 
 * 4. Add transaction signing:
 * ```typescript
 * import { useWriteContract } from 'wagmi'
 * 
 * const { writeContract } = useWriteContract()
 * await writeContract({
 *   address: contractAddress,
 *   abi: contractABI,
 *   functionName: 'transfer',
 *   args: [to, amount]
 * })
 * ```
 */
