import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useRealtimePrices } from '@/hooks/useRealtimePrices'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatCrypto, formatPercentage, formatDate } from '@/lib/utils'
import TradingViewChart from '@/components/TradingViewChart'
import KycModal from '@/components/KycModal'
import TwoFactorSetup from '@/components/TwoFactorSetup'
import PriceAlertsWidget from '@/components/PriceAlertsWidget'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Users,
  Gift,
  ArrowUpRight,
  Shield,
  Bell,
  Lock,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

/**
 * Enhanced Dashboard - Phase 1 Best Practices
 * 
 * New Features:
 * - Real-time price updates via WebSockets
 * - TradingView advanced charts
 * - KYC/AML verification prompts
 * - 2FA security setup
 * - Price alerts management
 * - Live connection status
 * - Enhanced security indicators
 */
export default function EnhancedDashboardPage() {
  const { user } = useAuth()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { prices, connected, getPriceChange } = useRealtimePrices()
  const { transactions } = useTransactions(5)
  
  const [kycModalOpen, setKycModalOpen] = useState(false)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false)
  const [alertsModalOpen, setAlertsModalOpen] = useState(false)
  const [kycStatus, setKycStatus] = useState<string>('pending')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  useEffect(() => {
    loadUserSecurityStatus()
  }, [user])

  const loadUserSecurityStatus = async () => {
    if (!user) return

    try {
      // Load KYC status
      const { data: profile } = await supabase
        .from('profiles')
        .select('kyc_status')
        .eq('id', user.id)
        .single()

      if (profile) {
        setKycStatus(profile.kyc_status || 'pending')
      }

      // Load 2FA status
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('two_factor_enabled')
        .eq('user_id', user.id)
        .single()

      if (preferences) {
        setTwoFactorEnabled(preferences.two_factor_enabled || false)
      }
    } catch (error) {
      console.error('Error loading security status:', error)
    }
  }

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

  const securityScore = () => {
    let score = 0
    if (kycStatus === 'approved') score += 40
    if (twoFactorEnabled) score += 40
    if (user?.email_confirmed_at) score += 20
    return score
  }

  const getSecurityColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Layout>
      {/* Security Alerts Banner */}
      {(kycStatus !== 'approved' || !twoFactorEnabled) && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-200 mb-2">
                Complete Your Account Security
              </h3>
              <div className="space-y-2">
                {kycStatus !== 'approved' && (
                  <button
                    onClick={() => setKycModalOpen(true)}
                    className="text-sm text-yellow-300 hover:text-yellow-200 underline block"
                  >
                    ⚠️ Complete KYC verification to unlock full platform features
                  </button>
                )}
                {!twoFactorEnabled && (
                  <button
                    onClick={() => setTwoFactorModalOpen(true)}
                    className="text-sm text-yellow-300 hover:text-yellow-200 underline block"
                  >
                    🔒 Enable 2FA to secure your account (blocks 99% of phishing)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Real-time Status */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Investor'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            Here's what's happening with your investments today
            <span className="flex items-center gap-1">
              <Activity className={`w-4 h-4 ${connected ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ${connected ? 'text-green-500' : 'text-red-500'}`}>
                {connected ? 'Live' : 'Connecting...'}
              </span>
            </span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlertsModalOpen(true)}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            title="Price Alerts"
          >
            <Bell className="w-5 h-5 text-white" />
          </button>
          <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getSecurityColor(securityScore())}`} />
              <div>
                <div className="text-xs text-gray-400">Security Score</div>
                <div className={`text-lg font-bold ${getSecurityColor(securityScore())}`}>
                  {securityScore()}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
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

      {/* TradingView Chart */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Advanced Market Analysis
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time charts with technical indicators (RSI, MACD, Volume)
            </p>
          </div>
          <div className="h-[500px]">
            <TradingViewChart
              symbol="BINANCE:BTCUSDT"
              interval="D"
              theme="dark"
              height={500}
              autosize={true}
              studies={['RSI@tv-basicstudies', 'MACD@tv-basicstudies', 'Volume@tv-basicstudies']}
              showToolbar={true}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Crypto Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Prices</h2>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${connected ? 'text-green-500 animate-pulse' : 'text-gray-500'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {connected ? 'Live Updates' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {prices.slice(0, 5).map((price) => {
              const priceChange = getPriceChange(price.symbol)
              return (
                <div
                  key={price.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{price.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{price.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{price.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(price.price_usd)}
                    </div>
                    {priceChange !== 0 && (
                      <div
                        className={`text-sm flex items-center justify-end gap-1 ${
                          priceChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {priceChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercentage(Math.abs(priceChange), 2)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link
              to="/portfolio"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white capitalize">
                      {tx.transaction_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(tx.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCrypto(tx.amount, tx.currency, 4)}
                    </div>
                    <div className={`text-sm ${
                      tx.status === 'completed' ? 'text-green-600' :
                      tx.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {kycStatus !== 'approved' && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Complete KYC Verification</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Verify your identity to unlock deposits, withdrawals, and full platform features.
                  Required for regulatory compliance.
                </p>
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Start Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {!twoFactorEnabled && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-purple-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Enable Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Add an extra layer of security to your account. CISA recommends 2FA to block 99% of phishing attacks.
                </p>
                <button
                  onClick={() => setTwoFactorModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Setup 2FA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <KycModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onComplete={() => {
          loadUserSecurityStatus()
          toast.success('KYC verification completed!')
        }}
      />

      <TwoFactorSetup
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        onComplete={() => {
          loadUserSecurityStatus()
          toast.success('2FA enabled successfully!')
        }}
      />

      <PriceAlertsWidget
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
      />
    </Layout>
  )
}
