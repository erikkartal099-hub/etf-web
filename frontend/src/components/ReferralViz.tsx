import { useEffect, useState } from 'react'
import { Users, TrendingUp, Award, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface ReferralNode {
  id: string
  full_name: string
  email: string
  referral_code: string
  created_at: string
  level: number
  total_referrals: number
  total_earnings: number
  children?: ReferralNode[]
  expanded?: boolean
}

interface ReferralVizProps {
  userId: string
}

export default function ReferralViz({ userId }: ReferralVizProps) {
  const [treeData, setTreeData] = useState<ReferralNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    levelCounts: {} as Record<number, number>,
  })

  useEffect(() => {
    loadReferralTree()
  }, [userId])

  async function loadReferralTree() {
    try {
      setLoading(true)

      // Fetch user's referral tree using ltree path
      const { data: referrals, error } = await supabase
        .from('users')
        .select('id, full_name, email, referral_code, created_at, referral_path, total_referral_earnings')
        .or(`referral_path~*.${userId}.*,id.eq.${userId}`)
        .order('referral_path')

      if (error) throw error

      if (referrals && referrals.length > 0) {
        // Build tree structure
        const tree = buildTree(referrals, userId)
        setTreeData(tree)

        // Calculate stats
        const totalReferrals = referrals.length - 1 // Exclude self
        const totalEarnings = referrals.reduce((sum, r) => sum + (r.total_referral_earnings || 0), 0)
        const levelCounts: Record<number, number> = {}

        referrals.forEach((r) => {
          if (r.id !== userId) {
            const level = calculateLevel(r.referral_path, userId)
            levelCounts[level] = (levelCounts[level] || 0) + 1
          }
        })

        setStats({ totalReferrals, totalEarnings, levelCounts })
      }
    } catch (error: any) {
      console.error('Error loading referral tree:', error)
      toast.error('Failed to load referral tree')
    } finally {
      setLoading(false)
    }
  }

  function buildTree(referrals: any[], rootId: string): ReferralNode {
    const root = referrals.find((r) => r.id === rootId)
    if (!root) throw new Error('Root user not found')

    const children = referrals
      .filter((r) => {
        const path = r.referral_path || ''
        const parentPath = path.split('.').slice(0, -1).join('.')
        return parentPath === (root.referral_path || rootId)
      })
      .map((child) => buildTree(referrals, child.id))

    return {
      id: root.id,
      full_name: root.full_name,
      email: root.email,
      referral_code: root.referral_code,
      created_at: root.created_at,
      level: calculateLevel(root.referral_path, rootId),
      total_referrals: children.length,
      total_earnings: root.total_referral_earnings || 0,
      children: children.length > 0 ? children : undefined,
      expanded: true,
    }
  }

  function calculateLevel(path: string | null, rootId: string): number {
    if (!path) return 0
    const parts = path.split('.')
    const rootIndex = parts.indexOf(rootId)
    if (rootIndex === -1) return 0
    return parts.length - rootIndex - 1
  }

  function toggleNode(nodeId: string) {
    setTreeData((prev) => {
      if (!prev) return prev
      return toggleNodeRecursive(prev, nodeId)
    })
  }

  function toggleNodeRecursive(node: ReferralNode, targetId: string): ReferralNode {
    if (node.id === targetId) {
      return { ...node, expanded: !node.expanded }
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => toggleNodeRecursive(child, targetId)),
      }
    }
    return node
  }

  function renderNode(node: ReferralNode, depth: number = 0) {
    const hasChildren = node.children && node.children.length > 0
    const levelColor = ['blue', 'green', 'yellow', 'orange', 'red'][node.level] || 'gray'

    return (
      <div key={node.id} className="relative">
        {/* Node Card */}
        <div
          className={`ml-${depth * 8} mb-3 bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-${levelColor}-500/50 transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Expand/Collapse Button */}
              {hasChildren && (
                <button
                  onClick={() => toggleNode(node.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {node.expanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* User Icon */}
              <div className={`w-10 h-10 rounded-full bg-${levelColor}-500/20 flex items-center justify-center`}>
                <Users className={`w-5 h-5 text-${levelColor}-400`} />
              </div>

              {/* User Info */}
              <div>
                <h4 className="text-white font-semibold">{node.full_name}</h4>
                <p className="text-sm text-gray-400">{node.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${levelColor}-500/20 text-${levelColor}-400`}>
                    Level {node.level}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(node.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">${node.total_earnings.toFixed(2)}</span>
              </div>
              {hasChildren && (
                <p className="text-sm text-gray-400 mt-1">
                  {node.total_referrals} referral{node.total_referrals !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && node.expanded && (
          <div className="ml-6 border-l-2 border-gray-800 pl-4">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!treeData) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No referral data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Active Levels</p>
              <p className="text-2xl font-bold text-white">{Object.keys(stats.levelCounts).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Level Breakdown</h3>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="text-center">
              <p className="text-sm text-gray-400">Level {level}</p>
              <p className="text-xl font-bold text-white">{stats.levelCounts[level] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Referral Network</h3>
        <div className="max-h-[600px] overflow-y-auto">
          {renderNode(treeData)}
        </div>
      </div>
    </div>
  )
}
