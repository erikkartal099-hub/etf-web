// Modern Landing Page - Grayscale Investment Inspired Design
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Wallet,
  Lock,
  Globe,
  Star,
  Target,
  Award,
  MessageCircle,
} from 'lucide-react'

export default function NewLandingPage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Diversified Portfolio',
      description: 'Gain exposure to top 5 cryptocurrencies through a single, professionally managed ETF',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Institutional Grade Security',
      description: 'Bank-level encryption with multi-signature wallets and cold storage protocols',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Users,
      title: '5-Level Referral System',
      description: 'Earn up to 21% (10%+5%+3%+2%+1%) on referral deposits across multiple tiers',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'High-Yield Staking',
      description: 'Lock tokens and earn 5-15% APY with flexible staking plans',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Wallet,
      title: 'Instant Deposits',
      description: 'Deposit ETH or BTC and receive ETF tokens instantly in your wallet',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Target,
      title: 'Milestone Bonuses',
      description: 'Unlock rewards at $1K, $5K, $10K, and $50K investment milestones',
      gradient: 'from-rose-500 to-red-500',
    },
  ]

  const stats = [
    { value: '$1.2B+', label: 'Assets Under Management' },
    { value: '75K+', label: 'Active Investors' },
    { value: '14.8%', label: 'Avg. Annual Return' },
    { value: '99.9%', label: 'Uptime Guarantee' },
  ]

  const benefits = [
    'No lockup periods on deposits',
    'Transparent fee structure (1.5% management)',
    'Real-time portfolio tracking',
    '24/7 AI-powered support',
    'Mobile & desktop apps',
    'Tax reporting tools',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white dark:text-gray-900 font-bold text-xl">C5</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">CoinDesk Crypto 5</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">by Grayscale Investment</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
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
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full mb-8">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                #1 Crypto ETF Platform | Trusted by 75,000+ Investors
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Institutional-Grade
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                Crypto Investment
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Diversified exposure to Bitcoin, Ethereum, and top cryptocurrencies.
              <br className="hidden md:block" />
              Professionally managed by Grayscale. Built for serious investors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Start Investing Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CoinDesk Crypto 5?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Professional cryptocurrency investment made simple, secure, and highly rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-950 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-700 transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
