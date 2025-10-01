# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                               │
│  - TailwindCSS (Styling)                                    │
│  - React Router (Navigation)                                │
│  - React Query (Data fetching)                              │
│  - ethers.js (Web3 integration)                             │
│  - Chart.js (Visualizations)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth (JWT)   │  │  Database    │  │ Realtime     │      │
│  │ - Email/Pass │  │  PostgreSQL  │  │ - WebSockets │      │
│  │ - Wallet     │  │  + ltree ext │  │ - Live data  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Edge Funcs   │  │  Storage     │  │   RLS        │      │
│  │ - Deposits   │  │  - Files     │  │  - Policies  │      │
│  │ - Withdrawals│  │  - Images    │  │  - Security  │      │
│  │ - Prices     │  └──────────────┘  └──────────────┘      │
│  │ - Notify     │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│  - CoinGecko API (Crypto prices)                            │
│  - Alchemy/Infura (Blockchain RPC)                          │
│  - SendGrid (Email notifications)                           │
│  - Google Analytics (Usage tracking)                        │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

**users**
- Extends Supabase auth.users
- Contains referral_path (ltree) for pyramid structure
- Stores KYC status and profile data

**portfolios**
- One-to-one with users
- Tracks all balances and earnings
- Calculated total_value_usd

**transactions**
- Records all financial operations
- Triggers update portfolio on completion
- Immutable audit trail

**referrals**
- Tracks referral relationships
- Stores bonus rates by level (1-5)
- Auto-created via triggers

**staking**
- Active staking positions
- APY calculations via function
- Automatic reward accrual

### ltree Referral Tree

```
User A (1)
  ├─ User B (1.2)
  │   ├─ User C (1.2.3)  [Level 2 from A, Level 1 from B]
  │   └─ User D (1.2.4)
  └─ User E (1.3)
      └─ User F (1.3.5)
```

Bonus distribution when User C deposits:
- User B gets 10% (Level 1)
- User A gets 5% (Level 2)

## Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with sidebar
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── PortfolioContext.tsx # Portfolio data
├── hooks/              # Custom React hooks
│   ├── useCryptoPrices.ts
│   ├── useTransactions.ts
│   └── useNotifications.ts
├── lib/                # Utility libraries
│   ├── supabase.ts    # Supabase client
│   ├── api.ts         # Edge function calls
│   ├── web3.ts        # Web3 integration
│   └── utils.ts       # Helper functions
├── pages/              # Route components
│   ├── LandingPage.tsx
│   ├── DashboardPage.tsx
│   ├── DepositPage.tsx
│   └── ...
├── types/              # TypeScript definitions
│   └── index.ts
└── styles/             # Global styles
    └── index.css
```

## Data Flow

### User Deposit Flow

1. User initiates deposit on DepositPage
2. Generate deposit address (simulated)
3. User sends crypto from wallet
4. User enters transaction hash
5. Frontend calls `process-deposit` Edge Function
6. Edge Function:
   - Verifies transaction (mock)
   - Creates transaction record
   - Updates portfolio (via trigger)
   - Calculates referral bonuses (via trigger)
   - Distributes bonuses to upline (5 levels)
7. Portfolio updates in real-time via Supabase Realtime
8. User receives notification

### Referral Bonus Calculation

```sql
-- Triggered on deposit completion
FOR EACH upline_user IN get_upline_referrers(user_path, 5) LOOP
  bonus = deposit_usd * upline_user.bonus_rate / 100
  bonus = MIN(bonus, user_total_deposits * 0.50) -- Cap at 50%
  
  UPDATE portfolios SET referral_earnings += bonus
  INSERT INTO transactions (type='referral_bonus', ...)
  INSERT INTO notifications (...)
END LOOP
```

## Security Architecture

### Defense Layers

1. **Frontend Validation**
   - React form validation
   - Zod schema validation
   - Input sanitization

2. **Network Security**
   - HTTPS only
   - CORS policies
   - CSP headers

3. **Authentication**
   - JWT tokens (Supabase Auth)
   - Secure session storage
   - Optional 2FA

4. **Database Security**
   - Row Level Security (RLS)
   - Parameterized queries
   - Encrypted at rest

5. **Edge Function Security**
   - Service role key (server-side only)
   - Rate limiting
   - Input validation

## State Management

### Global State (Context)
- User authentication state
- Portfolio data
- Notification state

### Server State (React Query)
- Crypto prices
- Transaction history
- Referral data

### Local State (useState)
- Form inputs
- UI state (modals, menus)
- Temporary data

## Performance Optimizations

- **Code Splitting**: Dynamic imports for routes
- **Lazy Loading**: Images and components
- **Caching**: React Query with stale-while-revalidate
- **Database Indexes**: On frequently queried columns
- **CDN**: Static assets via Vercel Edge Network
- **Realtime**: Only subscribe to user's own data

## Scalability Considerations

- **Database**: Supabase scales automatically
- **Edge Functions**: Auto-scaling serverless
- **Frontend**: Static files on CDN
- **Read Replicas**: For high read loads
- **Connection Pooling**: PgBouncer enabled
- **Caching**: Redis layer (future enhancement)

## Monitoring & Observability

- **Application**: Vercel Analytics
- **Database**: Supabase Dashboard metrics
- **Errors**: Console logging + alerts
- **Usage**: Google Analytics
- **Performance**: Core Web Vitals

## Deployment Pipeline

```
Local Dev → Git Push → GitHub
                 ↓
            [CI/CD Checks]
                 ↓
         ┌───────┴───────┐
         ↓               ↓
    Vercel Deploy   Supabase Edge
    (Frontend)      Functions Deploy
         ↓               ↓
    Production URL   Live Functions
```

## Technology Stack

### Frontend
- React 18.2
- TypeScript 5.3
- Vite 5.0
- TailwindCSS 3.3
- React Router 6.20
- React Query 5.13
- ethers.js 6.9
- Chart.js 4.4

### Backend
- Supabase (PostgreSQL 15)
- Deno (Edge Functions)
- ltree extension
- pg_cron (scheduled jobs)

### DevOps
- Vercel (hosting)
- GitHub (version control)
- npm (package management)

### External APIs
- CoinGecko (crypto prices)
- Alchemy (blockchain data)
- SendGrid (emails)

Last Updated: 2025-09-30
