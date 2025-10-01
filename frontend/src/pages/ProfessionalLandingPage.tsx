// Professional Banking-Grade Landing Page
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Lock,
  CheckCircle,
  ArrowRight,
  FileText,
  Activity,
  Building2,
  Smartphone,
  Clock,
} from 'lucide-react'

export default function ProfessionalLandingPage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Diversified ETF Portfolio',
      description: 'Institutional-grade exposure to top 5 digital assets through a single investment vehicle',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, multi-signature custody, and cold storage infrastructure',
    },
    {
      icon: Activity,
      title: 'Real-Time Analytics',
      description: 'Professional-grade portfolio tracking with comprehensive performance metrics',
    },
    {
      icon: Lock,
      title: 'Staking Programs',
      description: 'Flexible staking options with competitive yields from 5% to 15% APY',
    },
    {
      icon: Users,
      title: 'Referral Network',
      description: 'Multi-tier referral program with structured incentives up to 21%',
    },
    {
      icon: FileText,
      title: 'Tax Reporting',
      description: 'Comprehensive tax documentation and reporting tools for compliance',
    },
  ]

  const stats = [
    { value: '$2.5B', label: 'Assets Under Management', change: '+12.4% YoY' },
    { value: '150,284', label: 'Active Accounts', change: '+8.2% MoM' },
    { value: '99.97%', label: 'Uptime SLA', change: 'Exceeds Target' },
    { value: '$180M', label: 'Distributed Rewards', change: 'YTD 2025' },
  ]

  const capabilities = [
    'Instant settlement and liquidity',
    'Transparent 1.5% management fee',
    'Real-time portfolio valuation',
    'Multi-factor authentication',
    'Dedicated account management',
    'Advanced tax optimization',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-900 dark:bg-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-base tracking-tight">
                  CoinDesk Crypto 5
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Grayscale Investment</div>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-blue-900 dark:bg-blue-600 text-white text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
              >
                Open Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>SEC-Registered Digital Asset Exchange-Traded Fund</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Institutional Digital Asset<br />Investment Platform
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Access diversified cryptocurrency exposure through our professionally managed ETF.
              Built on institutional-grade infrastructure with comprehensive risk management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/signup"
                className="px-8 py-3 bg-blue-900 dark:bg-blue-600 text-white font-medium hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Open Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Regulated & Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-600" />
                <span>Institutional Custody</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span>24/7 Trading</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xs font-medium text-green-600 dark:text-green-500">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Investment Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools and infrastructure designed for serious investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-900 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Getting Started
          </h2>

          <div className="space-y-8">
            {[
              {
                number: '01',
                title: 'Account Registration',
                description:
                  'Complete secure account registration with KYC verification. Typically processed within 24 hours.',
                icon: Users,
              },
              {
                number: '02',
                title: 'Fund Your Account',
                description:
                  'Deposit via bank transfer, cryptocurrency (BTC, ETH), or wire transfer. Funds available immediately.',
                icon: TrendingUp,
              },
              {
                number: '03',
                title: 'Invest & Monitor',
                description:
                  'Purchase ETF tokens and monitor performance through our professional dashboard with real-time analytics.',
                icon: BarChart3,
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gray-900 dark:bg-gray-100 flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Built for Professional Investors
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Access institutional-grade digital asset investment infrastructure with retail
                accessibility. Minimum investment: $100.
              </p>
              <div className="space-y-3">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lock, label: 'Cold Storage', desc: '95% Assets' },
                { icon: Shield, label: 'Insurance', desc: 'Up to $500M' },
                { icon: Smartphone, label: 'Mobile Access', desc: 'iOS & Android' },
                { icon: Clock, label: 'Support', desc: '24/7/365' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900 dark:bg-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 150,000+ investors who trust CoinDesk Crypto 5 ETF for their digital asset
            allocation. Open an account in minutes.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            <span>Open Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-sm text-gray-400">
            Minimum investment: $100 • No credit card required • Full liquidity
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">CoinDesk Crypto 5 ETF</h4>
              <p className="text-sm leading-relaxed">
                Institutional digital asset investment platform managed by Grayscale Investment.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>ETF Tokens</li>
                <li>Staking Programs</li>
                <li>Referral Network</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Leadership</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Risk Disclosure</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 text-sm">
            <p className="text-white font-medium mb-2">
              © 2025 CoinDesk Crypto 5 ETF. All rights reserved.
            </p>
            <p className="text-xs leading-relaxed max-w-4xl">
              Investment in digital assets involves substantial risk of loss and may not be suitable
              for all investors. Past performance is not indicative of future results. Not FDIC
              insured. Please read the full risk disclosure before investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
