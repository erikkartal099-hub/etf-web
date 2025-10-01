import { useState } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { processDeposit } from '@/lib/api'
import { generateDepositAddress } from '@/lib/web3'
import { formatCurrency, generateMockTxHash, copyToClipboard } from '@/lib/utils'
import { ArrowDownToLine, Copy, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DepositPage() {
  const { user } = useAuth()
  const { prices } = useCryptoPrices()
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'BTC'>('ETH')
  const [amount, setAmount] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [txHash, setTxHash] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const cryptoOptions = [
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  ]

  const getPrice = (symbol: string) => {
    return prices.find((p) => p.symbol === symbol)?.price_usd || 0
  }

  const usdValue = parseFloat(amount || '0') * getPrice(selectedCrypto)

  const handleGenerateAddress = async () => {
    setLoading(true)
    try {
      const address = await generateDepositAddress(selectedCrypto)
      setDepositAddress(address)
      setStep(2)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(depositAddress)
    if (success) {
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirmDeposit = async () => {
    if (!txHash) {
      toast.error('Please enter transaction hash')
      return
    }

    setLoading(true)
    try {
      await processDeposit({
        userId: user!.id,
        cryptoType: selectedCrypto,
        amount: parseFloat(amount),
        txHash,
        walletAddress: depositAddress,
      })
      toast.success('Deposit processed successfully!')
      setStep(3)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowDownToLine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deposit Crypto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deposit cryptocurrency to mint CoinDesk Crypto 5 ETF tokens
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>Important:</strong> Only send {selectedCrypto} to this address. Sending other assets
            may result in permanent loss. This is a demo using testnet addresses.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {/* Step 1: Select Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Cryptocurrency
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.symbol}
                      onClick={() => setSelectedCrypto(crypto.symbol as 'ETH' | 'BTC')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCrypto === crypto.symbol
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{crypto.icon}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{crypto.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={`0.0 ${selectedCrypto}`}
                />
                {amount && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    ≈ {formatCurrency(usdValue)}
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateAddress}
                disabled={!amount || parseFloat(amount) <= 0 || loading}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <div className="spinner mx-auto"></div> : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2: Send Crypto */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedCrypto === 'ETH' ? '⟠' : '₿'}</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Send {amount} {selectedCrypto}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  ≈ {formatCurrency(usdValue)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deposit Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={depositAddress}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Next Steps:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>Copy the address above</li>
                    <li>Send {amount} {selectedCrypto} from your wallet</li>
                    <li>Enter the transaction hash below</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction Hash
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0x..."
                />
                <button
                  onClick={() => setTxHash(generateMockTxHash())}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                >
                  Use demo transaction (for testing)
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmDeposit}
                  disabled={!txHash || loading}
                  className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <div className="spinner mx-auto"></div> : 'Confirm Deposit'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Deposit Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your deposit is being processed. ETF tokens will be credited to your account shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setStep(1)
                  setAmount('')
                  setTxHash('')
                  setDepositAddress('')
                }}
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Make Another Deposit
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
