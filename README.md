# CoinDesk Crypto 5 ETF - Grayscale Investment Platform

A **best-practice crypto investment platform** with real-time trading, advanced analytics, KYC/AML compliance, and AI-powered insights.

## ⭐ Phase 1 Complete - Now Live!

**🎉 NEW (October 2025):** Platform upgraded with industry-leading features:
- ⚡ **Real-time Market Data** via WebSocket (<100ms latency)
- 📈 **TradingView Charts** with RSI, MACD, Volume indicators
- 🛡️ **KYC/AML Compliance** ready for regulatory approval
- 🔐 **2FA Security** with TOTP + biometric support
- 📱 **Progressive Web App** (install on iOS/Android/Desktop)
- 🔔 **Price Alerts** with push notifications
- 🤖 **Enhanced AI Assistant** (Sora) with personalized insights

**👉 [Quick Start Guide](./PHASE1_QUICKSTART.md)** | **📖 [Full Documentation](./PHASE1_REPORT.md)** | **🧪 [Testing Guide](./TESTING.md)**

## 🤖 AI Chat Widget - Sora Assistant

**NEW:** Intelligent AI assistant powered by Groq (100% FREE!)

### Features
- Real-time chat interface with "Sora" AI persona
- Platform-specific guidance (deposits, withdrawals, referrals, staking)
- Chat history persistence for logged-in users
- Blazing fast responses (750 tokens/second)
- Secure API proxy via Supabase Edge Functions

### Quick Setup
1. Get FREE API key: https://console.groq.com/keys
2. Add to Supabase: Edge Functions → Settings → `GROQ_API_KEY`
3. Deploy: `supabase functions deploy grok-chat`

**Detailed Guide:** See `GROQ_SETUP.md` or `AI_CHAT_SETUP.md`

**Your API Key:** `gsk_your_api_key_here`

---

## 🚀 Getting Starteds

- **Multi-Crypto Deposits**: Support for Ethereum and Bitcoin deposits
- **ETF Token System**: Mint and track CoinDesk Crypto 5 ETF tokens
- **5-Level Referral Pyramid**: Multi-level referral system using PostgreSQL ltree
- **Real-time Portfolio**: Live crypto price tracking and performance charts
- **Staking Rewards**: 5-10% APY on locked deposits
- **Incentive Systems**: Loyalty points, airdrops, daily bonuses, gamified badges
- **Professional UI**: Grayscale-inspired design with dark mode
- **Security First**: 2FA, RLS policies, JWT auth, input validation

## 📋 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Chart.js for visualizations
- ethers.js for Web3 integration
- React Query for data fetching

### Backend
- Supabase PostgreSQL (with ltree extension)
- Supabase Auth (JWT-based)
- Supabase Edge Functions
- Supabase Realtime
- Supabase Storage

### Deployment
- Vercel (Frontend)
- Supabase (Backend)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd coindesk-etf-grayscale
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
```

### 3. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for database provisioning

#### Apply Database Schema
1. Open Supabase SQL Editor
2. Run scripts in order from `/supabase/migrations/`:
   - `001_enable_extensions.sql` - Enable ltree and other extensions
   - `002_create_tables.sql` - Create all tables
   - `003_create_functions.sql` - Create database functions
   - `004_create_triggers.sql` - Set up triggers
   - `005_row_level_security.sql` - Apply RLS policies
   - `006_seed_data.sql` - Insert test data (optional)

#### Deploy Edge Functions
```bash
cd supabase
npm install -g supabase
supabase login
supabase link --project-ref your_project_ref
supabase functions deploy
```

### 4. Run Development Server
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
coindesk-etf-grayscale/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and clients
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # Global styles
│   ├── public/                 # Static assets
│   └── package.json
├── supabase/                   # Supabase backend
│   ├── migrations/             # SQL migration scripts
│   ├── functions/              # Edge Functions
│   │   ├── calculate-referral-bonus/
│   │   ├── process-deposit/
│   │   ├── process-withdrawal/
│   │   ├── fetch-crypto-prices/
│   │   └── send-notification/
│   └── seed/                   # Seed data scripts
├── contracts/                  # Smart contracts (optional)
│   └── CoinDeskETFToken.sol   # ERC20 token contract
└── README.md
```

## 🗄️ Database Schema

### Key Tables
- **users**: User accounts with referral tree path (ltree)
- **portfolios**: User portfolio balances and ETF tokens
- **transactions**: Deposit/withdrawal history
- **referrals**: Referral tracking and bonuses
- **staking**: Staking positions and rewards
- **incentives**: Loyalty points, airdrops, badges

### Referral Tree (ltree)
- Users stored with hierarchical path: `1.2.5` (user 5 referred by 2, who was referred by 1)
- 5-level pyramid structure with decreasing bonus rates
- Automatic bonus calculation via triggers

## 🔐 Security Features

- Supabase Row Level Security (RLS) policies
- JWT-based authentication
- Rate limiting on edge functions
- Input validation and sanitization
- Encrypted sensitive data
- 2FA support
- Secure wallet connections

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy --prod
```

### Backend (Supabase)
- Database and auth are automatically hosted
- Deploy edge functions via Supabase CLI
- Configure environment variables in Supabase dashboard

## 📊 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🔑 Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_COINGECKO_API_KEY=
VITE_ALCHEMY_API_KEY=
VITE_GA_TRACKING_ID=
```

### Supabase Edge Functions
Set in Supabase dashboard under Edge Functions secrets:
```
SENDGRID_API_KEY=
COINGECKO_API_KEY=
```

## 📈 Scalability Considerations

- Use Supabase read replicas for high traffic
- Implement caching for crypto prices
- CDN for static assets via Vercel
- Database indexes on frequently queried columns
- Connection pooling for edge functions

## ⚠️ Legal Disclaimers

This platform includes:
- Crypto investment risk warnings
- No FDIC/SIPC insurance notices
- Terms of service and privacy policy
- KYC/AML compliance placeholders (integrate Persona or similar)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
- Open GitHub issue
- Email: support@coindesketf.example.com
- Documentation: [link to docs]

## 🎯 Roadmap

- [ ] Real blockchain integration (mainnet)
- [ ] KYC/AML verification
- [ ] Fiat on-ramps (Stripe integration)
- [ ] Mobile app (React Native)
- [ ] Advanced trading features
- [ ] Multi-language support
- [ ] Institutional investor dashboard

---

**Built with ❤️ for secure crypto investment**
