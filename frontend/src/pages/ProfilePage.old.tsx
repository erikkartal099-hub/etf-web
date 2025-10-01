import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={user?.email} readOnly className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={user?.full_name || ''} readOnly className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
