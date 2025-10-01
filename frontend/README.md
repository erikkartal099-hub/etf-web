# CoinDesk Crypto 5 ETF Platform - Frontend

Professional crypto investment platform with Grayscale-inspired design, built with React, TypeScript, Vite, and Supabase.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start dev server
npm run dev
# Visit http://localhost:5173
```

### Deploy to Vercel
```bash
# See: /DEPLOY_NOW.md for 15-minute deployment guide
```

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS
- **Charts:** Chart.js + react-chartjs-2
- **Backend:** Supabase (Auth + Database + Edge Functions)
- **Hosting:** Vercel
- **AI Chat:** Groq (LLaMA 3.1 70B)

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ChatWidget.tsx
│   │   ├── Layout.tsx
│   │   └── WalletMock.tsx
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx
│   │   └── PortfolioContext.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useCryptoPrices.ts
│   │   ├── useNotifications.ts
│   │   └── useTransactions.ts
│   ├── lib/              # Utilities
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── web3.ts
│   ├── pages/            # Page components
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── DepositPage.tsx
│   │   ├── WithdrawalPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ReferralsPage.tsx
│   │   ├── StakingPage.tsx
│   │   ├── RewardsPage.tsx
│   │   └── ProfilePage.tsx
│   ├── utils/            # Mock utilities
│   │   └── mockAlchemy.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .env.example          # Environment template
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel config
└── package.json          # Dependencies
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run preview          # Preview production build

# Build
npm run build            # Production build
npm run type-check       # TypeScript type checking

# Quality
npm run lint             # ESLint
npm run test             # Jest tests
npm run test:e2e         # Playwright E2E tests

# Deployment
npm run deploy:preview   # Deploy to Vercel preview
npm run deploy:prod      # Deploy to Vercel production
```

---

## 🌐 Environment Variables

Required in `.env.local`:

```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Config
VITE_APP_ENV=development
VITE_APP_NAME=CoinDesk Crypto 5 ETF
VITE_APP_VERSION=1.0.0

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Security:** Never commit `.env.local` - already in `.gitignore`

---

## 🎨 Features

### ✅ Implemented
- Complete authentication (signup, login, password reset)
- Professional dashboard with charts
- Real-time crypto prices
- Portfolio management
- 5-level referral system
- Staking simulator
- Rewards & incentives
- AI chat assistant (Sora)
- Responsive design
- Dark mode

### ⚠️ Demo Mode (Mock)
- Blockchain transactions (simulated)
- Wallet connection (mock addresses)
- Deposit/withdrawal (no real crypto)

### 🔄 Coming Soon
- Real blockchain integration (Alchemy)
- MetaMask wallet connection
- KYC verification
- Email notifications
- Multi-language (i18n)

---

## 🔒 Security

- ✅ RLS policies on all tables
- ✅ Environment variables for secrets
- ✅ HTTPS enforced (Vercel)
- ✅ XSS protection headers
- ✅ CSRF protection
- ✅ Input validation
- ⚠️ Demo mode warnings visible

**Production Note:** Requires security audit before handling real funds.

---

## 📈 Performance

### Optimizations
- Code splitting (React, Charts, Supabase vendors)
- Lazy loading components
- Image optimization
- Console logs removed in production
- Minification (terser)
- CDN caching (31536000s for assets)

### Benchmarks (Lighthouse)
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## 🧪 Testing

```bash
# Run all tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Lint
npm run lint
```

**Coverage:** Auth flows, forms, API calls, edge cases

---

## 📚 Documentation

- [Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)
- [Quick Deploy](../DEPLOY_NOW.md)
- [Production Checklist](../PRODUCTION_CHECKLIST.md)
- [Fixes Report](../WINDSURF_FIXES_REPORT.md)
- [Production Audit](../PRODUCTION_READINESS_AUDIT.md)

---

## 🛠️ Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Supabase Errors
- Check `.env.local` has correct URL and anon key
- Verify RLS policies allow operations
- Check Supabase dashboard for errors

### Blank Screen
- Open browser console (F12)
- Check for env variable errors
- Verify all imports resolve

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing`
5. Open Pull Request

**Code Style:** ESLint + Prettier (auto-format on save)

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

## 🔗 Links

- **Live Demo:** https://your-project.vercel.app
- **GitHub:** https://github.com/erikkartal099-hub/etf-web
- **Supabase:** https://supabase.com/dashboard
- **Vercel:** https://vercel.com/dashboard

---

## 💬 Support

- **Issues:** https://github.com/erikkartal099-hub/etf-web/issues
- **Discussions:** https://github.com/erikkartal099-hub/etf-web/discussions
- **Email:** support@yourdomain.com

---

**Built with ❤️ for the crypto community**
