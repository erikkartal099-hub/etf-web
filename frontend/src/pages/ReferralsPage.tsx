import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { getDownlineReferrals, getUserStatistics } from '@/lib/api'
import { generateReferralLink, copyToClipboard, formatCurrency, formatDate } from '@/lib/utils'
import { Users, Copy, Check, TrendingUp, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ReferralTreeNode, UserStatistics } from '@/types'

export default function ReferralsPage() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState<any[]>([])
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const referralLink = user ? generateReferralLink(user.referral_code) : ''

  const bonusRates = [
    { level: 1, rate: 10, color: 'bg-green-500' },
    { level: 2, rate: 5, color: 'bg-blue-500' },
    { level: 3, rate: 3, color: 'bg-purple-500' },
    { level: 4, rate: 2, color: 'bg-yellow-500' },
    { level: 5, rate: 1, color: 'bg-gray-500' },
  ]

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    try {
      const [referralData, statsData] = await Promise.all([
        getDownlineReferrals(user.id),
        getUserStatistics(user.id),
      ])
      setReferrals(referralData)
      setStats(statsData)
    } catch (error: any) {
      toast.error('Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink)
    if (success) {
      setCopied(true)
      toast.success('Referral link copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join CoinDesk Crypto 5 ETF',
          text: 'Invest in cryptocurrency ETFs with me and earn rewards!',
          url: referralLink,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }

  const getReferralsByLevel = (level: number) => {
    return referrals.filter((r) => r.level === level)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Referral Program</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Earn up to 10% bonus on referral deposits across 5 levels
          </p>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-primary text-white rounded-xl shadow p-6">
            <div className="text-sm opacity-80 mb-2">Total Referrals</div>
            <div className="text-4xl font-bold mb-1">{stats?.total_referrals || 0}</div>
            <div className="text-sm opacity-80">
              {stats?.direct_referrals || 0} direct referrals
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Referral Earnings</div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.referral_earnings.toFixed(4) || '0.0000'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ETF Tokens</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Network Value</div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(stats?.total_deposited || 0)}
            </div>
            <div className="text-sm text-green-600 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Total deposits</span>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Referral Link</h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <strong>Your Referral Code:</strong> <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{user?.referral_code}</code>
          </div>
        </div>

        {/* Bonus Structure */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bonus Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {bonusRates.map((bonus) => (
              <div key={bonus.level} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-12 h-12 ${bonus.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                  L{bonus.level}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{bonus.rate}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getReferralsByLevel(bonus.level).length} referrals
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Earn bonuses up to 5 levels deep. Maximum bonus capped at 50% of your own deposits.
          </div>
        </div>

        {/* Referral Tree */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Network</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto"></div>
              </div>
            ) : referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div
                    key={ref.referred_id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    style={{ marginLeft: `${(ref.level - 1) * 20}px` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${bonusRates[ref.level - 1]?.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        L{ref.level}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ref.full_name || ref.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {formatDate(ref.created_at, 'relative')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(ref.total_deposited)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">deposited</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No referrals yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Share your referral link to start earning bonuses
                </p>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Share Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
