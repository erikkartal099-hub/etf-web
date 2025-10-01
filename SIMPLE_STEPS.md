# 🚀 Simple Setup Steps - No Technical Skills Needed!

## ✅ What I've Done For You:

1. ✅ **Configured your Supabase credentials** in the project
2. ✅ **Installing all dependencies** (in progress...)
3. ✅ **Created setup scripts** ready to use

---

## 📝 What You Need To Do (3 Simple Steps):

### **STEP 1: Setup Database** (2 minutes)

1. **Open this link in your browser:**
   👉 https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/sql

2. **Click the "New query" button** (top left)

3. **Copy and paste this file:**
   - Open: `supabase/RUN_THIS_IN_SUPABASE.sql`
   - Select ALL text (Cmd+A)
   - Copy it (Cmd+C)
   - Paste it in the Supabase query editor (Cmd+V)

4. **Click "Run"** button (bottom right)

5. **Wait for success message** ✅

---

### **STEP 2: Get FREE Groq API Key** (1 minute)

1. **Go to:** https://console.groq.com

2. **Click "Sign up"** (use Google/GitHub - no credit card needed!)

3. **Go to:** https://console.groq.com/keys

4. **Click "Create API Key"**

5. **COPY the key** (it starts with `gsk_...`)

6. **Add it to Supabase:**
   - Go to: https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/settings/functions
   - Click "Add secret"
   - Name: `GROQ_API_KEY`
   - Value: Paste your key
   - Click "Save"

---

### **STEP 3: Deploy Edge Function** (30 seconds)

#### Option A: Via Supabase Dashboard (Easiest)
1. Go to: https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/functions
2. Click "Deploy a new function"
3. Upload folder: `supabase/functions/grok-chat`

#### Option B: Via Terminal (If you're comfortable)
Run in terminal:
```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
./deploy.sh
```

---

## 🎉 That's It! Now Start The App:

Open Terminal and run:

```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale/frontend"
export PATH="/Users/odiadev/CoinDesk ETF Grayscale/frontend/node-v18.20.8-darwin-x64/bin:$PATH"
npm run dev
```

**Your app will open at:** http://localhost:5173

---

## 🧪 Test The AI Chat:

1. Look for the **chat bubble** in bottom-right corner
2. Click it to open
3. Type: **"Tell me about referrals"**
4. Watch Sora respond! 🤖✨

---

## ❓ Having Issues?

### Database won't run?
- Make sure you copied the ENTIRE SQL file
- Try running it in smaller chunks

### Edge Function won't deploy?
- Verify GROQ_API_KEY is set correctly
- Check the key starts with `gsk_`

### App won't start?
- Make sure dependencies finished installing
- Run: `npm install --legacy-peer-deps`

---

## 📞 Need Help?

Send me:
1. Which step you're on
2. Any error messages you see
3. Screenshot if possible

I'll guide you through! 🚀
