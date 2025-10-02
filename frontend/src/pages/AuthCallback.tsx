import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    handleAuthCallback()
  }, [])

  async function handleAuthCallback() {
    try {
      // Check for error in URL params
      const params = new URLSearchParams(window.location.search)
      const error = params.get('error')
      const errorDescription = params.get('error_description')
      const code = params.get('code')

      if (error) {
        throw new Error(errorDescription || error)
      }

      // If we have a PKCE code, try to exchange it explicitly (supabase-js v2)
      if (code && typeof (supabase.auth as any).exchangeCodeForSession === 'function') {
        const { error: exchangeError } = await (supabase.auth as any).exchangeCodeForSession({ code })
        if (exchangeError) throw exchangeError
      }

      // Get the session (after possible exchange)
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!data.session) {
        // No session found, try to exchange the code
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken) {
          // Set the session manually
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })

          if (setSessionError) {
            throw setSessionError
          }
        } else {
          // If still no session and no hash token, surface a clearer message
          throw new Error('No session found. If you arrived from email, the link may have expired or already been used. Try signing in again.')
        }
      }

      // Successfully authenticated
      setStatus('success')
      setMessage('Authentication successful! Redirecting...')
      toast.success('Welcome! Redirecting to dashboard...')

      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1500)
    } catch (error: any) {
      console.error('Auth callback error:', error)
      setStatus('error')
      setMessage(error.message || 'Authentication failed')
      toast.error(error.message || 'Authentication failed')

      // Redirect to login after error
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Status Icon */}
          {status === 'loading' && (
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-500" />
          )}

          {/* Status Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Authentication Failed'}
            </h1>
            <p className="text-gray-400">{message}</p>
          </div>

          {/* Loading Bar */}
          {status === 'loading' && (
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full animate-pulse" />
            </div>
          )}

          {/* Error Actions */}
          {status === 'error' && (
            <div className="w-full space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Return to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-700"
              >
                Create New Account
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              🔒 Secure authentication powered by Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
