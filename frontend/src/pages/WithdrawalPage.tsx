import { useState } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { processWithdrawal } from '@/lib/api'
import { isValidEthereumAddress, isValidBitcoinAddress } from '@/lib/web3'
import { formatCurrency, formatCrypto } from '@/lib/utils'
import { ArrowUpFromLine, AlertTriangle, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WithdrawalPage() {
  const { user } = useAuth()
  const { portfolio } = usePortfolio()
  const { prices } = useCryptoPrices()
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'BTC'>('ETH')
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const cryptoOptions = [
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  ]

  const getPrice = (symbol: string) => {
    return prices.find((p) => p.symbol === symbol)?.price_usd || 0
  }

  const getBalance = (symbol: string) => {
    if (!portfolio) return 0
    return symbol === 'ETH' ? portfolio.eth_balance : portfolio.btc_balance
  }

  const withdrawalFee = selectedCrypto === 'ETH' ? 0.005 : 0.0001
  const usdValue = parseFloat(amount || '0') * getPrice(selectedCrypto)
  const availableBalance = getBalance(selectedCrypto)
  const totalAmount = parseFloat(amount || '0') + withdrawalFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (totalAmount > availableBalance) {
      toast.error('Insufficient balance including fee')
      return
    }

    const isValid = selectedCrypto === 'ETH' 
      ? isValidEthereumAddress(walletAddress)
      : isValidBitcoinAddress(walletAddress)

    if (!isValid) {
      toast.error(`Invalid ${selectedCrypto} address`)
      return
    }

    setLoading(true)
    try {
      await processWithdrawal({
        userId: user!.id,
        cryptoType: selectedCrypto,
        amount: parseFloat(amount),
        walletAddress,
      })
      setSuccess(true)
      toast.success('Withdrawal processed successfully!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setAmount('')
    setWalletAddress('')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpFromLine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Withdraw Crypto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer your cryptocurrency to an external wallet
          </p>
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 dark:text-red-300">
            <strong>Warning:</strong> Please double-check the withdrawal address. Crypto transactions
            are irreversible and sending to the wrong address may result in permanent loss.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Crypto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Cryptocurrency
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.symbol}
                      type="button"
                      onClick={() => setSelectedCrypto(crypto.symbol as 'ETH' | 'BTC')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCrypto === crypto.symbol
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{crypto.icon}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{crypto.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Available: {formatCrypto(getBalance(crypto.symbol as 'ETH' | 'BTC'), crypto.symbol, 6)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    min="0"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={`0.0 ${selectedCrypto}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(String(Math.max(0, availableBalance - withdrawalFee)))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Max
                  </button>
                </div>
                {amount && (
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      ≈ {formatCurrency(usdValue)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Fee: {formatCrypto(withdrawalFee, selectedCrypto, 6)}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Total: {formatCrypto(totalAmount, selectedCrypto, 6)}
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdrawal Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder={selectedCrypto === 'ETH' ? '0x...' : 'bc1...'}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || totalAmount > availableBalance}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <div className="spinner mx-auto"></div>
                ) : (
                  `Withdraw ${amount || '0'} ${selectedCrypto}`
                )}
              </button>

              {totalAmount > availableBalance && (
                <div className="text-sm text-red-600 text-center">
                  Insufficient balance. You need {formatCrypto(totalAmount - availableBalance, selectedCrypto, 6)} more.
                </div>
              )}
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Withdrawal Initiated!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your withdrawal is being processed. You'll receive a confirmation email shortly.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Make Another Withdrawal
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
