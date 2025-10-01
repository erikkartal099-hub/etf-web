// Professional Banking Landing Page
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Lock,
  Globe,
  CheckCircle,
  ArrowRight,
  Clock,
  FileText,
  Activity,
} from 'lucide-react'

export default function ModernLandingPage2025() {
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
    { value: '$2.5B', label: 'Assets Under Management', change: '+12.4%' },
    { value: '150,284', label: 'Active Accounts', change: '+8.2%' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CoinDesk</div>
                <div className="text-xs text-gray-400">Crypto 5 ETF</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 backdrop-blur-xl rounded-full mb-8">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-sm font-medium text-white">
                #1 Institutional-Grade Crypto ETF Platform
              </span>
              <div className="h-1 w-1 rounded-full bg-purple-400 animate-ping" />
              <span className="text-sm text-purple-300">Trusted by 150K+ Investors</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-gradient">
                Your Wealth,
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Multiplied by Crypto
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4 leading-relaxed">
              Diversified exposure to <span className="text-purple-400 font-semibold">Bitcoin, Ethereum,</span> and top cryptocurrencies.
              <br className="hidden md:block" />
              Professionally managed by <span className="text-pink-400 font-semibold">Grayscale Investment</span> standards.
              Built for serious wealth builders.
            </p>
            
            <p className="text-base md:text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Earn <span className="text-purple-400 font-bold">5-15% APY</span> through staking +
              <span className="text-pink-400 font-bold"> 21% referral bonuses</span> across 5 levels.
              Your gateway to institutional-grade crypto investment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-pink-500/70 flex items-center space-x-3"
              >
                <span>Start Investing Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-semibold text-lg border-2 border-purple-500/30 hover:border-purple-400 hover:bg-white/20 transition-all duration-300"
              >
                See How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>SEC Registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Instant Withdrawals</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group hover:scale-110 transition-transform duration-300 text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Investment Features
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                That Actually Pay
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced crypto investment tools designed for maximum returns and minimum hassle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Get Started in 3 Simple Steps
          </h2>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Create Your Account',
                description: 'Sign up in under 2 minutes with email or social login. Complete quick KYC verification.',
                icon: Users,
              },
              {
                number: '02',
                title: 'Deposit Crypto or Fiat',
                description: 'Add funds via ETH, BTC, bank transfer, or credit card. Mint ETF tokens instantly.',
                icon: Wallet,
              },
              {
                number: '03',
                title: 'Earn & Grow',
                description: 'Track your portfolio in real-time. Stake for rewards. Refer friends for bonuses.',
                icon: TrendingUp,
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-2xl flex items-center justify-center text-white dark:text-gray-900 font-bold text-2xl shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Built for Modern Investors
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Experience institutional-grade cryptocurrency investment with retail accessibility.
                No minimum investment. Start with as little as $100.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Lock, label: 'Secure Storage', color: 'from-blue-500 to-cyan-500' },
                { icon: Globe, label: 'Global Access', color: 'from-emerald-500 to-teal-500' },
                { icon: Award, label: 'Best Rated', color: 'from-purple-500 to-pink-500' },
                { icon: MessageCircle, label: '24/7 Support', color: 'from-amber-500 to-orange-500' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-950 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-700 transition-all hover:shadow-lg"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-700 mb-10 max-w-2xl mx-auto">
              Join 75,000+ investors building generational wealth with cryptocurrency ETFs.
              Get started in less than 2 minutes.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-600">
              No credit card required • Start with just $100 • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 dark:text-gray-600 py-12 border-t border-gray-800 dark:border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white dark:text-gray-300 font-bold mb-4 text-lg">CoinDesk Crypto 5 ETF</h4>
              <p className="text-sm leading-relaxed">
                Institutional-grade cryptocurrency investment platform managed by Grayscale Investment.
              </p>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-bold mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">ETF Tokens</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Staking</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Referral Program</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Press Kit</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white dark:text-gray-300 font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Risk Disclosure</li>
                <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-sm text-center">
            <p className="text-white dark:text-gray-300 font-medium mb-2">
              © 2025 CoinDesk Crypto 5 ETF. All rights reserved.
            </p>
            <p className="text-xs max-w-4xl mx-auto leading-relaxed">
              ⚠️ Cryptocurrency investments carry significant risk and may not be suitable for all investors. 
              Past performance does not guarantee future results. Not FDIC insured. See full risk disclosure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
