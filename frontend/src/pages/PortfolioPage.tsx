import Layout from '@/components/Layout'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useTransactions } from '@/hooks/useTransactions'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { formatCurrency, formatCrypto, formatDate, getTransactionStatusBadge } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function PortfolioPage() {
  const { portfolio, refresh, loading } = usePortfolio()
  const { transactions } = useTransactions()
  const { prices } = useCryptoPrices()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const getPrice = (symbol: string) => {
    return prices.find((p) => p.symbol === symbol)?.price_usd || 0
  }

  const balances = [
    {
      symbol: 'ETF',
      name: 'CoinDesk Crypto 5 ETF',
      balance: portfolio?.etf_token_balance || 0,
      price: getPrice('ETF'),
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: portfolio?.eth_balance || 0,
      price: getPrice('ETH'),
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: portfolio?.btc_balance || 0,
      price: getPrice('BTC'),
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your investments and performance</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Value</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(portfolio?.total_value_usd || 0)}
            </div>
            <div className="text-sm text-green-600">
              +{formatCurrency(portfolio?.all_time_profit_loss || 0)} all time
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Deposited</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(portfolio?.total_deposited_usd || 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Withdrawn: {formatCurrency(portfolio?.total_withdrawn_usd || 0)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Staked Amount</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCrypto(portfolio?.staked_amount || 0, 'ETF', 4)}
            </div>
            <div className="text-sm text-green-600">
              Rewards: {formatCrypto(portfolio?.staking_rewards || 0, 'ETF', 4)}
            </div>
          </div>
        </div>

        {/* Asset Balances */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asset Balances</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {balances.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {asset.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{asset.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCrypto(asset.balance, asset.symbol, 6)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(asset.balance * asset.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    TX Hash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-gray-900 dark:text-white">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {tx.type === 'withdrawal' ? '-' : '+'}
                        {formatCrypto(tx.crypto_amount, tx.crypto_type, 6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getTransactionStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tx.created_at, 'short')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tx.tx_hash ? (
                          <a
                            href={`https://etherscan.io/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            {tx.tx_hash.slice(0, 10)}...
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
