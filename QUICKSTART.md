# Quick Start Guide - CoinDesk Crypto 5 ETF

Get the platform running locally in minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Git

## Step 1: Clone & Install

```bash
cd "CoinDesk ETF Grayscale"

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Supabase Setup

### Create Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details and wait for provisioning

### Apply Database Migrations

1. Open Supabase Dashboard → SQL Editor
2. Copy and run each migration file from `supabase/migrations/` in order:
   - `001_enable_extensions.sql`
   - `002_create_tables.sql`
   - `003_create_functions.sql`
   - `004_create_triggers.sql`
   - `005_row_level_security.sql`
   - `006_seed_data.sql` (optional - adds demo data)

### Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - Anon/Public Key

## Step 3: Configure Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_COINGECKO_API_KEY=demo  # Optional
VITE_ALCHEMY_API_KEY=demo    # Optional
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Step 5: Create Test Account

1. Click "Sign Up"
2. Enter email and password
3. Check Supabase Dashboard → Authentication to verify account
4. Sign in and explore!

## Common Issues

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure `.env.local` exists with correct values

### Issue: Database errors
**Solution:** Ensure all migration scripts ran successfully in Supabase

### Issue: Build errors
**Solution:** Delete `node_modules` and run `npm install` again

## Next Steps

- Read `README.md` for complete documentation
- Check `DEPLOYMENT.md` for production deployment
- Explore the dashboard at http://localhost:5173/dashboard
- Test deposits using demo transaction hashes
- Create referral links and test the pyramid system

## Demo Features

All crypto transactions are simulated for demo purposes:
- Deposits use mock transaction hashes
- Withdrawals are instant (no blockchain wait)
- Prices are fetched from CoinGecko API

For production, integrate real blockchain via Alchemy/Infura.

## Need Help?

- Check the console for errors
- Review Supabase logs in the dashboard
- See troubleshooting section in README.md

Happy coding! 🚀
