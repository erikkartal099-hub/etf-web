import { useState } from 'react'
import Layout from '@/components/Layout'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatCrypto, calculateStakingReturn } from '@/lib/utils'
import { Coins, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StakingPage() {
  const { user } = useAuth()
  const { portfolio } = usePortfolio()
  const [selectedPlan, setSelectedPlan] = useState<number>(0)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const stakingPlans = [
    { name: 'Flexible', days: 0, apy: 5.0 },
    { name: '30 Days', days: 30, apy: 7.5 },
    { name: '90 Days', days: 90, apy: 10.0 },
    { name: '365 Days', days: 365, apy: 15.0 },
  ]

  const selectedPlanData = stakingPlans[selectedPlan]
  const availableBalance = portfolio?.etf_token_balance || 0

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
      await supabase.from('staking').insert({
        user_id: user!.id,
        amount: parseFloat(amount),
        apy: selectedPlanData.apy,
        lock_period_days: selectedPlanData.days || null,
      })
      toast.success('Staking position created!')
      setAmount('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Staking</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <form onSubmit={handleStake}>
            <div className="space-y-4">
              {stakingPlans.map((plan, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPlan(idx)}
                  className={`w-full p-4 border-2 rounded-lg ${selectedPlan === idx ? 'border-primary-600' : 'border-gray-200'}`}
                >
                  {plan.name} - {plan.apy}% APY
                </button>
              ))}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Amount to stake"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-primary text-white rounded-lg"
              >
                {loading ? 'Staking...' : 'Stake Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
