import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { supabase } from '@/lib/supabase'
import { formatCrypto, formatDate } from '@/lib/utils'
import { Gift, Trophy, Zap, Star, TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Incentive {
  id: string
  type: string
  amount: number | null
  points: number | null
  description: string
  claimed: boolean
  created_at: string
}

export default function CompleteRewardsPage() {
  const { user } = useAuth()
  const { portfolio } = usePortfolio()
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  const milestoneBonuses = [
    { amount: 1000, bonus: 50, unlocked: (portfolio?.total_deposited_usd || 0) >= 1000 },
    { amount: 5000, bonus: 300, unlocked: (portfolio?.total_deposited_usd || 0) >= 5000 },
    { amount: 10000, bonus: 750, unlocked: (portfolio?.total_deposited_usd || 0) >= 10000 },
    { amount: 50000, bonus: 5000, unlocked: (portfolio?.total_deposited_usd || 0) >= 50000 },
  ]

  useEffect(() => {
    if (user) {
      loadIncentives()
    }
  }, [user])

  const loadIncentives = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('incentives')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setIncentives(data || [])
    } catch (error: any) {
      console.error('Error loading incentives:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (incentiveId: string) => {
    setClaiming(incentiveId)
    try {
      const { error } = await supabase
        .from('incentives')
        .update({ claimed: true })
        .eq('id', incentiveId)

      if (error) throw error
      
      toast.success('Reward claimed successfully!')
      loadIncentives()
    } catch (error: any) {
      toast.error('Failed to claim reward')
    } finally {
      setClaiming(null)
    }
  }

  const getIncentiveIcon = (type: string) => {
    switch (type) {
      case 'welcome_airdrop': return Gift
      case 'milestone_bonus': return Trophy
      case 'loyalty_points': return Star
      case 'daily_login': return Calendar
      default: return Award
    }
  }

  const getIncentiveColor = (type: string) => {
    switch (type) {
      case 'welcome_airdrop': return 'from-purple-500 to-pink-500'
      case 'milestone_bonus': return 'from-yellow-500 to-orange-500'
      case 'loyalty_points': return 'from-blue-500 to-cyan-500'
      case 'daily_login': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const totalPoints = incentives
    .filter(i => i.points && i.claimed)
    .reduce((sum, i) => sum + (i.points || 0), 0)

  const totalEarned = incentives
    .filter(i => i.amount && i.claimed)
    .reduce((sum, i) => sum + (i.amount || 0), 0)

  const unclaimedRewards = incentives.filter(i => !i.claimed)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rewards & Incentives</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your loyalty points, milestones, and special bonuses
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Loyalty Points</div>
              <Star className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-1">{totalPoints.toLocaleString()}</div>
            <div className="text-sm opacity-80">Lifetime earned</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Rewards Earned</div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCrypto(totalEarned, 'ETF', 4)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Claimed bonuses</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Unclaimed Rewards</div>
              <Gift className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {unclaimedRewards.length}
            </div>
            <div className="text-sm text-orange-600">Waiting to claim</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Referral Earnings</div>
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCrypto(portfolio?.referral_earnings || 0, 'ETF', 4)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">From network</div>
          </div>
        </div>

        {/* Milestone Bonuses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Milestone Bonuses</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Earn bonuses as you reach deposit milestones
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestoneBonuses.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    milestone.unlocked
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="text-center">
                    {milestone.unlocked ? (
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    ) : (
                      <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    )}
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ${milestone.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Deposit milestone
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      +{formatCrypto(milestone.bonus, 'ETF', 2)} ETF
                    </div>
                    {milestone.unlocked && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        ✓ UNLOCKED
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Progress:</strong> ${(portfolio?.total_deposited_usd || 0).toLocaleString()} deposited
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((portfolio?.total_deposited_usd || 0) / 50000) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rewards History</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto"></div>
              </div>
            ) : incentives.length > 0 ? (
              <div className="space-y-3">
                {incentives.map((incentive) => {
                  const Icon = getIncentiveIcon(incentive.type)
                  const colorClass = getIncentiveColor(incentive.type)
                  
                  return (
                    <div
                      key={incentive.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {incentive.description}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(incentive.created_at, 'relative')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {incentive.amount && (
                            <div className="font-bold text-gray-900 dark:text-white">
                              +{formatCrypto(incentive.amount, 'ETF', 4)}
                            </div>
                          )}
                          {incentive.points && (
                            <div className="text-sm text-purple-600 dark:text-purple-400">
                              {incentive.points} points
                            </div>
                          )}
                        </div>
                        {incentive.claimed ? (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm font-medium rounded">
                            Claimed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaim(incentive.id)}
                            disabled={claiming === incentive.id}
                            className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {claiming === incentive.id ? 'Claiming...' : 'Claim'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Rewards Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start investing, staking, and referring to earn rewards
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/deposit"
                    className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Make a Deposit
                  </a>
                  <a
                    href="/referrals"
                    className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    Invite Friends
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
