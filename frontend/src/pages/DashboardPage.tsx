import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatCrypto, formatPercentage, formatDate } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Users,
  Gift,
  ArrowUpRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { prices } = useCryptoPrices()
  const { transactions } = useTransactions(5)

  const stats = [
    {
      name: 'Total Value',
      value: portfolio ? formatCurrency(portfolio.total_value_usd) : '$0.00',
      change: portfolio?.all_time_profit_loss || 0,
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      name: 'ETF Tokens',
      value: portfolio ? formatCrypto(portfolio.etf_token_balance, 'ETF', 4) : '0 ETF',
      change: 0,
      icon: Wallet,
      color: 'bg-purple-500',
    },
    {
      name: 'Referral Earnings',
      value: portfolio ? formatCrypto(portfolio.referral_earnings, 'ETF', 4) : '0 ETF',
      change: 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Loyalty Points',
      value: portfolio?.loyalty_points || 0,
      change: 0,
      icon: Gift,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <Layout>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.full_name || 'Investor'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your investments today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.change !== 0 && (
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatPercentage(Math.abs(stat.change), 2)}</span>
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crypto Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Prices</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
          </div>

          <div className="space-y-4">
            {prices.slice(0, 5).map((price) => (
              <div key={price.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{price.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(price.price_usd)}
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    price.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercentage(price.price_change_24h, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
            <Link
              to="/portfolio"
              className="text-sm text-primary-600 hover:text-primary-500 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {tx.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(tx.created_at, 'relative')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tx.type === 'withdrawal' ? '-' : '+'}
                      {formatCrypto(tx.crypto_amount, tx.crypto_type, 4)}
                    </div>
                    <div className={`text-xs badge ${
                      tx.status === 'completed'
                        ? 'badge-success'
                        : tx.status === 'pending'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/deposit"
          className="bg-gradient-primary text-white rounded-xl p-6 text-center hover:opacity-90 transition-opacity"
        >
          <div className="text-2xl mb-2">💰</div>
          <div className="font-semibold">Deposit</div>
        </Link>
        <Link
          to="/withdraw"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl mb-2">💸</div>
          <div className="font-semibold text-gray-900 dark:text-white">Withdraw</div>
        </Link>
        <Link
          to="/staking"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl mb-2">🔒</div>
          <div className="font-semibold text-gray-900 dark:text-white">Stake</div>
        </Link>
        <Link
          to="/referrals"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl mb-2">🤝</div>
          <div className="font-semibold text-gray-900 dark:text-white">Refer</div>
        </Link>
      </div>
    </Layout>
  )
}
