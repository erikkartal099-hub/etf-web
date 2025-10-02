import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })

    // Log to external error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // window.Sentry?.captureException(error)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-white">
                Oops! Something went wrong
              </h1>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-300 text-lg">
                We've encountered an unexpected error. This has been logged and we'll look into it.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="bg-black/50 border border-red-900/30 rounded-lg p-4 overflow-auto max-h-64">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">Common causes:</h3>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Missing environment variables (check <code className="bg-black/50 px-1 rounded">.env.local</code>)</li>
                  <li>Network connectivity issues</li>
                  <li>Supabase service unavailable</li>
                  <li>Browser compatibility issues</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-700"
              >
                Reload Page
              </button>
            </div>

            <p className="text-gray-500 text-sm text-center mt-6">
              If this problem persists, please contact support with error code: <code className="bg-black/50 px-2 py-1 rounded">{Date.now()}</code>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
