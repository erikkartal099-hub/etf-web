// Landing page for non-authenticated users

import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart3,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C5</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">CoinDesk Crypto 5 ETF</div>
              <div className="text-xs text-gray-500">by Grayscale Investment</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Invest in the Future of
            <span className="block text-gradient mt-2">Digital Assets</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            CoinDesk Crypto 5 ETF provides diversified exposure to the top 5 cryptocurrencies,
            professionally managed by Grayscale Investment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <span>Start Investing</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-gradient mb-2">$1B+</div>
              <div className="text-gray-600 dark:text-gray-400">Assets Under Management</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Investors</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-gradient mb-2">12.5%</div>
              <div className="text-gray-600 dark:text-gray-400">Average Annual Return</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Why Choose CoinDesk Crypto 5 ETF?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              Professional crypto investment made simple, secure, and rewarding
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Diversified Portfolio
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Exposure to top 5 cryptocurrencies in one investment vehicle
                </p>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Secure & Compliant
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enterprise-grade security with regulatory compliance
                </p>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Referral Rewards
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn up to 10% bonus on referral deposits across 5 levels
                </p>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Staking Rewards
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn up to 15% APY by staking your ETF tokens
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              How It Works
            </h2>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sign up in minutes with email or connect your crypto wallet
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Deposit Crypto
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Deposit ETH or BTC to mint CoinDesk Crypto 5 ETF tokens
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Earn & Grow
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track performance, earn rewards, and grow your investment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of investors building wealth with cryptocurrency ETFs
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-4">CoinDesk Crypto 5 ETF</h4>
                <p className="text-sm">
                  Professional cryptocurrency investment platform managed by Grayscale Investment.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Products</h4>
                <ul className="space-y-2 text-sm">
                  <li>ETF Tokens</li>
                  <li>Staking</li>
                  <li>Referrals</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Risk Disclosure</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-sm text-center">
              <p>© 2025 CoinDesk Crypto 5 ETF. All rights reserved.</p>
              <p className="mt-2 text-xs">
                ⚠️ Cryptocurrency investments carry risk. Not FDIC insured. See full risk disclosure.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
