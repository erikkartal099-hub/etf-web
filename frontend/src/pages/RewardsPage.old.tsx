import Layout from '@/components/Layout'
import { Gift } from 'lucide-react'

export default function RewardsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-3xl font-bold mb-4">Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400">View your loyalty points, airdrops, and badges</p>
        </div>
      </div>
    </Layout>
  )
}
