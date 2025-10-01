// Web3 integration with ethers.js for wallet connections

import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

// Connect wallet
export async function connectWallet(): Promise<{
  address: string
  provider: ethers.BrowserProvider
  signer: ethers.Signer
}> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()

    return { address, provider, signer }
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Please connect to MetaMask')
    }
    throw error
  }
}

// Get current connected wallet
export async function getCurrentWallet(): Promise<string | null> {
  if (!isMetaMaskInstalled()) {
    return null
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.listAccounts()
    return accounts.length > 0 ? accounts[0].address : null
  } catch (error) {
    console.error('Error getting current wallet:', error)
    return null
  }
}

// Switch to correct network (Sepolia testnet for development)
export async function switchToNetwork(chainId: number): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      await addNetwork(chainId)
    } else {
      throw error
    }
  }
}

// Add network to MetaMask
async function addNetwork(chainId: number): Promise<void> {
  const networks: Record<number, any> = {
    11155111: { // Sepolia testnet
      chainId: '0xaa36a7',
      chainName: 'Sepolia Testnet',
      nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    },
  }

  const network = networks[chainId]
  if (!network) {
    throw new Error('Unsupported network')
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [network],
  })
}

// Get ETH balance
export async function getEthBalance(address: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const balance = await provider.getBalance(address)
  return ethers.formatEther(balance)
}

// Verify transaction
export async function verifyTransaction(txHash: string): Promise<any> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const receipt = await provider.getTransactionReceipt(txHash)
  return receipt
}

// Sign message
export async function signMessage(message: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return await signer.signMessage(message)
}

// Listen for account changes
export function onAccountsChanged(callback: (accounts: string[]) => void): void {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback)
  }
}

// Listen for chain changes
export function onChainChanged(callback: (chainId: string) => void): void {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback)
  }
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address)
}

// Validate Bitcoin address (simplified)
export function isValidBitcoinAddress(address: string): boolean {
  // Basic validation for Bitcoin addresses
  const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  const segwit = /^bc1[a-z0-9]{39,59}$/
  return legacy.test(address) || segwit.test(address)
}

// Generate deposit address (simulated for demo)
export async function generateDepositAddress(cryptoType: 'ETH' | 'BTC'): Promise<string> {
  // In production, this would call backend to generate a unique deposit address
  // For demo, return platform wallet address
  if (cryptoType === 'ETH') {
    return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // Example platform address
  } else {
    return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' // Example BTC address
  }
}
