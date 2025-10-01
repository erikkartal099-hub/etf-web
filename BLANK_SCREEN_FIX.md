# 🔧 Blank Screen Fix

## Current Issue
The website is showing a blank screen. This is typically caused by:

1. **Missing Supabase environment variables**
2. **Build errors in browser console**
3. **Vite not serving files correctly**

---

## Quick Fix Steps

### Step 1: Check Environment Variables

Your project needs a `.env.local` file with Supabase credentials.

**Create/update** `/Users/odiadev/CoinDesk ETF Grayscale/frontend/.env.local`:

```bash
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale/frontend

# Create .env.local from example
cp .env.example .env.local

# Edit with your Supabase credentials
nano .env.local
```

**Required variables:**
```env
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### Step 2: Restart Dev Server

```bash
# Kill existing server
pkill -f "node.*vite"

# Start fresh
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale/frontend
export PATH="$PWD/node-v18.20.8-darwin-x64/bin:$PATH"
npm run dev
```

### Step 3: Check Browser Console

1. Open http://localhost:5173 in your browser
2. Press **F12** (or Cmd+Option+I on Mac)
3. Go to **Console** tab
4. Look for errors (likely Supabase connection errors)

---

## Common Issues & Solutions

### Issue 1: "Supabase URL is required"
**Solution:** Add `VITE_SUPABASE_URL` to `.env.local`

### Issue 2: "Invalid API key"
**Solution:** Get correct anon key from Supabase dashboard → Settings → API

### Issue 3: Build errors in console
**Solution:** Check browser console for specific error messages

### Issue 4: White screen, no errors
**Solution:** 
```bash
# Clear cache
rm -rf .vite node_modules/.vite dist

# Reinstall and restart
npm install
npm run dev
```

---

## Quick Diagnostic

Run this to check your setup:

```bash
cd /Users/odiadev/CoinDesk\ ETF\ Grayscale/frontend

# Check if .env.local exists
echo "Checking .env.local..."
if [ -f .env.local ]; then
  echo "✅ .env.local exists"
  grep -c "VITE_SUPABASE_URL" .env.local && echo "✅ Has Supabase URL" || echo "❌ Missing Supabase URL"
else
  echo "❌ .env.local not found - CREATE IT!"
fi

# Check if server is running
echo ""
echo "Checking dev server..."
lsof -i :5173 && echo "✅ Server running on :5173" || echo "❌ Server not running"

# Test server response
echo ""
echo "Testing server..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:5173/
```

---

## Expected Working State

When working correctly, you should see:

**Browser Console (No Errors):**
- No red error messages
- May see INFO logs from Supabase

**Visual:**
- Landing page with CoinDesk branding
- Navigation menu
- "Start Investing Now" button
- Grayscale Investment logo

---

## Next Steps

1. **Verify .env.local has correct Supabase credentials**
2. **Restart server after adding environment variables**
3. **Check browser console for specific errors**
4. **Report any errors you see for further debugging**

---

**Server Status Check:**
```bash
curl -s http://localhost:5173/ | grep -o "<title>[^<]*"
# Expected: <title>CoinDesk Crypto 5 ETF | Grayscale Investment
```
