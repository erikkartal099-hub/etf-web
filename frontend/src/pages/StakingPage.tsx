import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatCrypto, formatPercentage, formatDate } from '@/lib/utils'
import { Coins, Lock, TrendingUp, Unlock, Clock, Award } from 'lucide-react'
import toast from 'react-hot-toast'

interface StakingPosition {
  id: string
  amount: number
  apy: number
  start_date: string
  end_date: string | null
  lock_period_days: number | null
  rewards_earned: number
  status: string
  created_at: string
}

export default function EnhancedStakingPage() {
  const { user } = useAuth()
  const { portfolio } = usePortfolio()
  const [selectedPlan, setSelectedPlan] = useState<number>(0)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [activePositions, setActivePositions] = useState<StakingPosition[]>([])
  const [loadingPositions, setLoadingPositions] = useState(true)

  const stakingPlans = [
    { name: 'Flexible', days: 0, apy: 5.0, description: 'Unstake anytime', color: 'from-gray-500 to-gray-600' },
    { name: '30 Days', days: 30, apy: 7.5, description: 'Lock for 1 month', color: 'from-blue-500 to-blue-600' },
    { name: '90 Days', days: 90, apy: 10.0, description: 'Lock for 3 months', color: 'from-purple-500 to-purple-600' },
    { name: '180 Days', days: 180, apy: 12.5, description: 'Lock for 6 months', color: 'from-orange-500 to-orange-600' },
    { name: '365 Days', days: 365, apy: 15.0, description: 'Lock for 1 year', color: 'from-green-500 to-green-600' },
  ]

  const selectedPlanData = stakingPlans[selectedPlan]
  const availableBalance = portfolio?.etf_token_balance || 0
  const estimatedRewards = parseFloat(amount || '0') * (selectedPlanData.apy / 100) * (selectedPlanData.days / 365)

  useEffect(() => {
    if (user) {
      loadStakingPositions()
    }
  }, [user])

  const loadStakingPositions = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('staking')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setActivePositions(data || [])
    } catch (error: any) {
      console.error('Error loading staking positions:', error)
    } finally {
      setLoadingPositions(false)
    }
  }

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (parseFloat(amount) > availableBalance) {
      toast.error('Insufficient balance')
      return
    }
    setLoading(true)
    try {
      const endDate = selectedPlanData.days > 0 
        ? new Date(Date.now() + selectedPlanData.days * 24 * 60 * 60 * 1000).toISOString()
        : null

      await supabase.from('staking').insert({
        user_id: user!.id,
        amount: parseFloat(amount),
        apy: selectedPlanData.apy,
        lock_period_days: selectedPlanData.days || null,
        end_date: endDate,
        status: 'active',
      })
      
      toast.success('Staking position created successfully!')
      setAmount('')
      loadStakingPositions()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async (positionId: string) => {
    if (!confirm('Are you sure you want to unstake? You may lose rewards for early withdrawal.')) {
      return
    }

    setLoading(true)
    try {
      await supabase
        .from('staking')
        .update({ status: 'completed' })
        .eq('id', positionId)
      
      toast.success('Unstaked successfully!')
      loadStakingPositions()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateCurrentRewards = (position: StakingPosition) => {
    const startDate = new Date(position.start_date)
    const now = new Date()
    const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const yearlyReward = position.amount * (position.apy / 100)
    const currentReward = (yearlyReward / 365) * daysStaked
    return currentReward
  }

  const isPositionLocked = (position: StakingPosition) => {
    if (!position.end_date) return false
    return new Date(position.end_date) > new Date()
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Staking</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lock your ETF tokens and earn rewards up to 15% APY
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Available Balance</div>
              <Coins className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCrypto(availableBalance, 'ETF', 4)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Staked</div>
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCrypto(activePositions.filter(p => p.status === 'active').reduce((sum, p) => sum + p.amount, 0), 'ETF', 4)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Rewards</div>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCrypto(activePositions.reduce((sum, p) => sum + calculateCurrentRewards(p), 0), 'ETF', 4)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Positions</div>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {activePositions.filter(p => p.status === 'active').length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staking Plans */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Stake</h2>
            </div>
            <form onSubmit={handleStake} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Staking Plan
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {stakingPlans.map((plan, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPlan(idx)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPlan === idx
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${plan.color}`}></div>
                          <span className="font-bold text-gray-900 dark:text-white">{plan.name}</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{plan.apy}%</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.0000 ETF"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(String(availableBalance))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Max
                  </button>
                </div>
                {amount && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Estimated {selectedPlanData.days > 0 ? `${selectedPlanData.days}-day` : 'annual'} reward: {formatCrypto(estimatedRewards, 'ETF', 4)}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) > availableBalance}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Stake {amount || '0'} ETF</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Staking Positions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Staking Positions</h2>
            </div>
            <div className="p-6">
              {loadingPositions ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto"></div>
                </div>
              ) : activePositions.length > 0 ? (
                <div className="space-y-4">
                  {activePositions.map((position) => {
                    const currentRewards = calculateCurrentRewards(position)
                    const isLocked = isPositionLocked(position)
                    
                    return (
                      <div
                        key={position.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-transparent hover:border-primary-600 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-orange-500" />
                            ) : (
                              <Unlock className="w-4 h-4 text-green-500" />
                            )}
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatCrypto(position.amount, 'ETF', 4)}
                            </span>
                          </div>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium rounded">
                            {position.apy}% APY
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">Start Date</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatDate(position.start_date, 'short')}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">End Date</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {position.end_date ? formatDate(position.end_date, 'short') : 'Flexible'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Current Rewards</div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            +{formatCrypto(currentRewards, 'ETF', 6)}
                          </div>
                        </div>

                        {position.status === 'active' && (
                          <button
                            onClick={() => handleUnstake(position.id)}
                            disabled={loading}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                              isLocked
                                ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                          >
                            {isLocked ? 'Locked' : 'Unstake'}
                          </button>
                        )}

                        {isLocked && (
                          <div className="mt-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Unlocks in {Math.ceil((new Date(position.end_date!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Coins className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Staking Positions
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start staking to earn rewards on your ETF tokens
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
