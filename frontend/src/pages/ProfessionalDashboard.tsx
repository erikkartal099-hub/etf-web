import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatCrypto, formatPercentage, formatDate } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  Coins,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfessionalDashboard() {
  const { user } = useAuth()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { prices } = useCryptoPrices()
  const { transactions } = useTransactions(5)

  const stats = [
    {
      name: 'Portfolio Value',
      value: portfolio ? formatCurrency(portfolio.total_value_usd) : '$0.00',
      change: portfolio?.all_time_profit_loss || 0,
      icon: DollarSign,
      color: 'bg-blue-600',
    },
    {
      name: 'ETF Token Balance',
      value: portfolio ? formatCrypto(portfolio.etf_token_balance, 'ETF', 4) : '0.0000 ETF',
      change: 0,
      icon: Coins,
      color: 'bg-gray-600',
    },
    {
      name: 'Referral Earnings',
      value: portfolio ? formatCrypto(portfolio.referral_earnings, 'ETF', 4) : '0.0000 ETF',
      change: 0,
      icon: Users,
      color: 'bg-green-600',
    },
    {
      name: 'Loyalty Points',
      value: portfolio?.loyalty_points || 0,
      change: 0,
      icon: BarChart3,
      color: 'bg-amber-600',
    },
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              Portfolio Overview
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back, {user?.full_name || 'Investor'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center justify-end space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-10 h-10 flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.change !== 0 && (
                <div
                  className={`flex items-center space-x-1 text-xs font-medium ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{formatPercentage(Math.abs(stat.change), 2)}</span>
                </div>
              )}
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Prices */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Market Prices</h2>
            <span className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-medium">
              LIVE
            </span>
          </div>

          <div className="p-5">
            <div className="space-y-4">
              {prices.slice(0, 5).map((price) => (
                <div key={price.symbol} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {price.symbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(price.price_usd)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`text-xs font-medium px-2 py-1 ${
                        price.price_change_24h >= 0
                          ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {formatPercentage(price.price_change_24h, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              to="/portfolio"
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5">
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                        {tx.type.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(tx.created_at, 'relative')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {tx.type === 'withdrawal' ? '-' : '+'}
                        {formatCrypto(tx.crypto_amount, tx.crypto_type, 4)}
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-0.5 inline-block ${
                          tx.status === 'completed'
                            ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400'
                            : tx.status === 'pending'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/deposit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-5 transition-colors text-center"
          >
            <div className="text-2xl mb-2">+</div>
            <div className="font-medium text-sm">Deposit</div>
          </Link>
          <Link
            to="/withdraw"
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 p-5 transition-colors text-center"
          >
            <div className="text-2xl mb-2 text-gray-900 dark:text-white">−</div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">Withdraw</div>
          </Link>
          <Link
            to="/staking"
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 p-5 transition-colors text-center"
          >
            <div className="text-2xl mb-2 text-gray-900 dark:text-white">%</div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">Stake</div>
          </Link>
          <Link
            to="/referrals"
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 p-5 transition-colors text-center"
          >
            <div className="text-2xl mb-2 text-gray-900 dark:text-white">→</div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">Refer</div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
