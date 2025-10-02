import { useEffect, useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Gift, Coins, Filter, Download, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  user_id: string
  transaction_type: 'deposit' | 'withdrawal' | 'referral_bonus' | 'staking_reward' | 'airdrop' | 'bonus'
  currency: 'ETH' | 'BTC' | 'ETF'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  metadata?: {
    tx_hash?: string
    notes?: string
    referral_level?: number
  }
}

interface TransactionHistoryProps {
  userId: string
  limit?: number
}

export default function TransactionHistory({ userId, limit = 50 }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    loadTransactions()
  }, [userId])

  useEffect(() => {
    filterAndSearch()
  }, [transactions, searchQuery, filterType])

  async function loadTransactions() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      setTransactions(data || [])
    } catch (error: any) {
      console.error('Error loading transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  function filterAndSearch() {
    let filtered = [...transactions]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.transaction_type === filterType)
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.transaction_type.toLowerCase().includes(query) ||
          t.currency.toLowerCase().includes(query) ||
          t.amount.toString().includes(query) ||
          t.metadata?.tx_hash?.toLowerCase().includes(query)
      )
    }

    setFilteredTransactions(filtered)
    setPage(1)
  }

  function exportCSV() {
    const csv = [
      ['Date', 'Type', 'Currency', 'Amount', 'Status', 'TX Hash'],
      ...filteredTransactions.map((t) => [
        new Date(t.created_at).toLocaleString(),
        t.transaction_type,
        t.currency,
        t.amount,
        t.status,
        t.metadata?.tx_hash || 'N/A',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${Date.now()}.csv`
    a.click()
    toast.success('Transactions exported')
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="w-5 h-5 text-green-400" />
      case 'withdrawal':
        return <ArrowUpCircle className="w-5 h-5 text-red-400" />
      case 'referral_bonus':
        return <Gift className="w-5 h-5 text-blue-400" />
      case 'staking_reward':
        return <Coins className="w-5 h-5 text-yellow-400" />
      case 'airdrop':
      case 'bonus':
        return <Gift className="w-5 h-5 text-purple-400" />
      default:
        return <Coins className="w-5 h-5 text-gray-400" />
    }
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'deposit':
        return 'text-green-400'
      case 'withdrawal':
        return 'text-red-400'
      case 'referral_bonus':
        return 'text-blue-400'
      case 'staking_reward':
        return 'text-yellow-400'
      case 'airdrop':
      case 'bonus':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  )
  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-white">Transaction History</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="referral_bonus">Referral Bonuses</option>
            <option value="staking_reward">Staking Rewards</option>
            <option value="airdrop">Airdrops</option>
            <option value="bonus">Bonuses</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.transaction_type)}
                        <span className={`text-sm font-medium ${getTypeColor(tx.transaction_type)}`}>
                          {tx.transaction_type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${tx.transaction_type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.transaction_type === 'withdrawal' ? '-' : '+'}
                        {tx.amount.toFixed(4)} {tx.currency}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {tx.metadata?.tx_hash ? (
                        <a
                          href={`https://etherscan.io/tx/${tx.metadata.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {tx.metadata.tx_hash.substring(0, 10)}...
                        </a>
                      ) : tx.metadata?.notes ? (
                        <span>{tx.metadata.notes}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-900 text-white rounded">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
