# Quick Setup Instructions

## Your Supabase Credentials

**Supabase URL:** `https://vovlsbesaapezkfggdba.supabase.co`  
**Project Reference:** `vovlsbesaapezkfggdba`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U`  
**Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI0MjA4MiwiZXhwIjoyMDc0ODE4MDgyfQ.CpJ93jDDVGEbwFxCuq6A0MeCyrxEFDlZvG9ZPK5xOdQ`

---

## Step 1: Update Frontend Environment Variables

Update your `frontend/.env.local` file:

```bash
# Navigate to frontend directory
cd frontend

# Edit .env.local (or create if it doesn't exist)
cat > .env.local << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U

# Environment
VITE_APP_ENV=development
VITE_APP_NAME=CoinDesk Crypto 5 ETF
VITE_APP_VERSION=1.0.0
EOF
```

---

## Step 2: Apply Database Migration

### Option A: Via Supabase Dashboard (Recommended)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/sql)
2. Create a new query
3. Copy the contents from `supabase/migrations/007_create_chats_table.sql`
4. Click "Run" to execute

### Option B: Via Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vovlsbesaapezkfggdba

# Apply all migrations
supabase db push
```

---

## Step 3: Configure Groq API Key

### Get FREE Groq API Key

1. Go to https://console.groq.com
2. Sign up (no credit card required)
3. Go to https://console.groq.com/keys
4. Create API Key (it will start with `gsk_...`)
5. **Copy the key** - you'll use it in the next step

### Set in Supabase Edge Functions

1. Go to [Edge Functions Settings](https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/settings/functions)
2. Click **"Add secret"**
3. **Name:** `GROQ_API_KEY`
4. **Value:** Your Groq API key (e.g., `gsk_...`)
5. Click **Save**

> **Note:** The documentation shows an example key, but you should generate your own free key from Groq.

---

## Step 4: Deploy Edge Function

```bash
# Navigate to project root
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale

# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Login
supabase login

# Link to your project
supabase link --project-ref vovlsbesaapezkfggdba

# Deploy the grok-chat function
supabase functions deploy grok-chat --no-verify-jwt

# Note: --no-verify-jwt allows guest users to use chat
# Remove this flag in production to require authentication
```

---

## Step 5: Install Dependencies & Run

```bash
# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The app should open at: http://localhost:5173

---

## Step 6: Test the Chat Widget

1. Open the app at http://localhost:5173
2. Click the chat bubble in the bottom-right corner
3. Try these test messages:
   - "Tell me about referrals"
   - "How do I deposit ETH?"
   - "What are the staking options?"
4. Verify:
   - Messages appear correctly
   - Sora responds intelligently
   - Loading states work
   - Chat persists (for logged-in users)

---

## Troubleshooting

### Chat returns error
- Verify GROQ_API_KEY is set in Supabase Edge Functions
- Check Edge Function logs in Supabase Dashboard
- Ensure grok-chat function is deployed

### Database errors
- Confirm migrations ran successfully
- Check RLS policies are enabled
- Verify user authentication works

### Frontend won't start
- Run `npm install` in frontend directory
- Check .env.local has correct values
- Clear cache: `rm -rf node_modules/.vite`

---

## Quick Commands Reference

```bash
# Start development
cd frontend && npm run dev

# Deploy Edge Function
supabase functions deploy grok-chat --no-verify-jwt

# View Edge Function logs
supabase functions logs grok-chat

# Run migrations
supabase db push

# Check project status
supabase status
```

---

## Next Steps After Setup

1. ✅ Test all features locally
2. ✅ Customize Sora's personality in `supabase/functions/grok-chat/index.ts`
3. ✅ Deploy to production (see DEPLOYMENT.md)
4. ✅ Set up monitoring and alerts
5. ✅ Gather user feedback

---

**Need Help?** Check AI_CHAT_SETUP.md for detailed documentation.
