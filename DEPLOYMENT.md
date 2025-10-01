# Deployment Guide - CoinDesk Crypto 5 ETF

Complete guide for deploying the application to production.

## Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for frontend)
- Git
- MetaMask or similar Web3 wallet

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project details:
   - Name: `coindesk-etf-prod`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
4. Wait for project provisioning (~2 minutes)

### 1.2 Get API Credentials

1. Go to Project Settings > API
2. Copy:
   - Project URL: `https://xxx.supabase.co`
   - Anon/Public Key: `eyJxxx...`
   - Service Role Key: `eyJxxx...` (keep secret!)

### 1.3 Apply Database Migrations

1. Open SQL Editor in Supabase Dashboard
2. Run migration scripts in order:
   ```sql
   -- Run each file from /supabase/migrations/ in order:
   001_enable_extensions.sql
   002_create_tables.sql
   003_create_functions.sql
   004_create_triggers.sql
   005_row_level_security.sql
   006_seed_data.sql (optional, for demo data)
   ```

### 1.4 Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all edge functions
cd supabase
supabase functions deploy process-deposit
supabase functions deploy process-withdrawal
supabase functions deploy fetch-crypto-prices
supabase functions deploy send-notification
```

### 1.5 Set Edge Function Secrets

In Supabase Dashboard > Edge Functions > Settings:

```
SENDGRID_API_KEY=your_sendgrid_api_key
COINGECKO_API_KEY=your_coingecko_pro_api_key
```

### 1.6 Configure Auth

1. Go to Authentication > Settings
2. Site URL: `https://your-domain.vercel.app`
3. Redirect URLs: Add `https://your-domain.vercel.app/**`
4. Enable Email provider
5. Configure email templates (welcome, password reset, etc.)

## Step 2: Frontend Deployment to Vercel

### 2.1 Prepare Frontend

1. Update environment variables:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   VITE_COINGECKO_API_KEY=your_api_key
   VITE_ALCHEMY_API_KEY=your_alchemy_key
   VITE_GA_TRACKING_ID=your_ga_id
   ```

3. Test locally:
   ```bash
   npm install
   npm run dev
   ```

### 2.2 Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from /frontend directory)
cd frontend
vercel

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables (from .env.local)
6. Click "Deploy"

### 2.3 Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

## Step 3: Smart Contract Deployment (Optional)

For real blockchain integration:

```bash
cd contracts

# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Step 4: Configure External Services

### 4.1 CoinGecko API

1. Sign up at [coingecko.com](https://www.coingecko.com/en/api)
2. Get Pro API key (free tier available)
3. Add to Supabase Edge Function secrets

### 4.2 Alchemy (for Web3)

1. Sign up at [alchemy.com](https://www.alchemy.com)
2. Create app for Ethereum Mainnet/Sepolia
3. Get API key
4. Add to frontend environment variables

### 4.3 SendGrid (for emails)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key with Mail Send permissions
3. Verify sender email/domain
4. Add to Supabase Edge Function secrets

### 4.4 Google Analytics

1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to frontend environment variables

## Step 5: Scheduled Tasks

Set up cron jobs for background tasks:

### 5.1 Price Updates (via Supabase Cron)

In Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule price updates every 5 minutes
SELECT cron.schedule(
  'fetch-crypto-prices',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/fetch-crypto-prices',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

### 5.2 Staking Rewards Calculation

```sql
-- Update staking rewards daily
SELECT cron.schedule(
  'update-staking-rewards',
  '0 0 * * *',
  $$
  UPDATE staking
  SET accumulated_rewards = accumulated_rewards + calculate_staking_rewards(id),
      last_reward_calculation = NOW()
  WHERE status = 'active';
  $$
);
```

## Step 6: Security Checklist

- [ ] Enable Supabase Row Level Security (RLS) on all tables
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS on custom domain
- [ ] Configure CORS properly
- [ ] Set up rate limiting on Edge Functions
- [ ] Enable 2FA for admin accounts
- [ ] Regular backup schedule configured
- [ ] Monitor error logs
- [ ] Set up alerting for critical errors

## Step 7: Monitoring & Analytics

### 7.1 Supabase Dashboard

- Monitor database performance
- Check API usage
- Review auth logs
- Track function invocations

### 7.2 Vercel Analytics

- Enable Web Analytics
- Monitor Core Web Vitals
- Track deployment logs

### 7.3 Google Analytics

- Track user behavior
- Monitor conversion funnels
- Analyze traffic sources

## Step 8: Testing in Production

1. Create test account
2. Test full user flow:
   - Sign up
   - Deposit (use testnet)
   - View portfolio
   - Create referral
   - Stake tokens
   - Withdraw
3. Test all notifications
4. Verify RLS policies
5. Load test with multiple users

## Rollback Plan

If deployment issues occur:

```bash
# Vercel - rollback to previous deployment
vercel rollback

# Supabase - restore from backup
# Go to Database > Backups > Restore

# Edge Functions - redeploy previous version
supabase functions deploy FUNCTION_NAME --import-map ./import_map.json
```

## Maintenance

### Daily
- Check error logs
- Monitor uptime
- Review suspicious activity

### Weekly
- Update crypto prices accuracy
- Review user feedback
- Check performance metrics

### Monthly
- Security audit
- Backup verification
- Dependency updates
- Performance optimization

## Support

For issues:
- Check Supabase logs
- Review Vercel deployment logs
- Test locally with production env vars
- Contact support@coindesketf.example.com

---

**Deployment Completed!** 🎉

Your CoinDesk Crypto 5 ETF platform is now live at:
- Frontend: https://your-domain.vercel.app
- API: https://YOUR_PROJECT_REF.supabase.co

Remember to:
1. Add legal disclaimers
2. Implement KYC/AML if required
3. Consult legal counsel for compliance
4. Regular security audits
