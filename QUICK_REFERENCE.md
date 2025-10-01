# 📋 Quick Reference Card

## 🔗 Important Links

### Your Supabase Project
- **Dashboard:** https://supabase.com/dashboard/project/vovlsbesaapezkfggdba
- **SQL Editor:** https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/sql
- **Edge Functions:** https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/functions
- **Settings:** https://supabase.com/dashboard/project/vovlsbesaapezkfggdba/settings/functions

### Get Groq API Key
- **Sign up:** https://console.groq.com
- **Get Key:** https://console.groq.com/keys

---

## 🚀 Quick Commands

### Start the app
```bash
cd "/Users/odiadev/CoinDesk ETF Grayscale"
./START_APP.sh
```

OR double-click `START_APP.sh` file

### Stop the app
Press `Ctrl + C` in terminal

---

## ✅ Setup Checklist

- [ ] Step 1: Run SQL in Supabase SQL Editor
- [ ] Step 2: Get Groq API key from console.groq.com
- [ ] Step 3: Add GROQ_API_KEY to Supabase Edge Functions settings
- [ ] Step 4: Deploy grok-chat Edge Function
- [ ] Step 5: Run ./START_APP.sh

---

## 🎯 Where to Find Things

### Configuration Files
- Environment: `frontend/.env.local` ✅ (already configured)
- Database setup: `supabase/RUN_THIS_IN_SUPABASE.sql`
- Edge Function: `supabase/functions/grok-chat/index.ts`

### Documentation
- **SIMPLE_STEPS.md** - Easy step-by-step guide
- **SETUP_INSTRUCTIONS.md** - Detailed setup
- **AI_CHAT_SETUP.md** - AI chat widget guide
- **README.md** - Full project documentation

---

## 🧪 Testing

### Test Messages for AI Chat
1. "Tell me about referrals"
2. "How do I deposit ETH?"
3. "What are the staking options?"
4. "Explain the referral system"
5. "What is the CoinDesk Crypto 5 ETF?"

---

## 🔧 Troubleshooting

### App won't start?
```bash
cd frontend
export PATH="/Users/odiadev/CoinDesk ETF Grayscale/frontend/node-v18.20.8-darwin-x64/bin:$PATH"
npm install --legacy-peer-deps
npm run dev
```

### Chat not working?
1. Check GROQ_API_KEY is set in Supabase
2. Verify grok-chat function is deployed
3. Check browser console (F12) for errors

### Database errors?
1. Verify SQL script ran successfully in Supabase
2. Check tables exist in Table Editor
3. Verify RLS policies are enabled

---

## 📞 Your Project Details

**Project Reference:** `vovlsbesaapezkfggdba`  
**Supabase URL:** `https://vovlsbesaapezkfggdba.supabase.co`  
**Local App URL:** `http://localhost:5173`

---

## 🎨 Features to Explore

1. **Dashboard** - Overview of portfolio
2. **Deposit** - Add crypto (ETH/BTC)
3. **Withdraw** - Cash out
4. **Referrals** - Invite friends (5-level pyramid!)
5. **Staking** - Earn rewards (5-15% APY)
6. **Rewards** - Check bonuses
7. **AI Chat** - Ask Sora anything! 🤖

---

## 💡 Pro Tips

- Use the chat widget for instant help
- Check referral tree to see your network
- Try different staking plans for best APY
- Earn bonuses at $1K, $5K, $10K milestones
- 5-level referral: 10%, 5%, 3%, 2%, 1%

---

**Last Updated:** 2025-09-30  
**Status:** ✅ Ready to deploy  
**Version:** 1.0.0
