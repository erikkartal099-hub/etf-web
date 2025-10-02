# n8n Sora Chat Integration - Setup Guide

## Test Results ✅

All infrastructure is **WORKING**:
- ✅ Vercel proxy deployed and healthy (`/api/n8n-proxy`)
- ✅ n8n webhook endpoint reachable
- ✅ CORS configured properly
- ✅ Response times acceptable (<1s)

**Status:** Ready for n8n workflow import

---

## What's Working Right Now

### 1. Frontend Chat Widget
**File:** `frontend/src/components/ChatWidget.tsx`
- Posts user messages to `/api/n8n-proxy`
- Displays AI responses in real-time
- Handles errors gracefully
- 15-second timeout protection

### 2. Vercel Serverless Proxy
**File:** `api/n8n-proxy.js`
- Same-origin endpoint: `https://etf-web-mi7p.vercel.app/api/n8n-proxy`
- Forwards requests to n8n webhook
- Handles CORS automatically
- Health check: `GET /api/n8n-proxy` → `{"ok":true}`

### 3. n8n Webhook Endpoint
**URL:** `https://n8n.odia.dev/webhook/7ea0ea7f-d542-4f94-ba78-c496b762abf2`
- Receives POST requests
- Currently returns: `{"message":"Workflow was started"}`
- **Needs:** Import production workflow to return AI responses

---

## Final Step: Import n8n Workflow

### Option A: Import via n8n UI (Recommended)

1. **Open n8n:** https://n8n.odia.dev
2. **Import workflow:**
   - Click **Workflows** → **Import from File**
   - Select: `n8n-sora-production.json`
3. **Configure Groq credential:**
   - Click the **"Groq Chat Model"** node
   - Re-select your Groq credential (IDs are instance-specific)
   - Model: `llama3-70b-8192` (already set)
4. **Activate:**
   - Click **Save**
   - Toggle **Active** (top-right)
5. **Verify:**
   ```bash
   ./scripts/test-n8n-workflow.sh
   ```
   Expected: All tests pass with real AI responses

### Option B: Manual Configuration

If you prefer to update your existing workflow:

1. **Webhook node:**
   - Method: POST
   - Path: `7ea0ea7f-d542-4f94-ba78-c496b762abf2`
   - **Response Mode:** `Using 'Respond to Webhook' Node` ⚠️ CRITICAL

2. **AI Agent node:**
   - **Text (Expression):** `={{ $json.message || $json.chatInput || 'Hello' }}`
   - System Message: (your Sora prompt - already configured)

3. **Groq Chat Model node:**
   - Model: `llama3-70b-8192` (or `llama-3.1-8b-instant` for speed)
   - Credential: Your Groq API key

4. **Chat Memory node:**
   - Type: Buffer Window
   - Context Window: 10 messages

5. **Respond to Webhook node:**
   - Respond With: JSON
   - Response Body (Expression):
     ```
     {{ { "message": $json.output || $json.text || $json.response || "I'm having trouble right now, please try again! 🙏" } }}
     ```
   - Headers:
     - `Access-Control-Allow-Origin: *`
     - `Access-Control-Allow-Headers: content-type`
     - `Content-Type: application/json`

6. **Connections:**
   - Webhook → AI Agent → Respond to Webhook
   - Groq Model → AI Agent (ai_languageModel)
   - Memory → AI Agent (ai_memory)

---

## Testing

### Automated Test Suite
```bash
./scripts/test-n8n-workflow.sh
```

**Tests:**
1. Proxy health check (GET)
2. Direct n8n webhook (POST)
3. Full stack (Proxy → n8n)
4. CORS headers
5. Response time (<15s)

### Manual Tests

**Direct webhook:**
```bash
curl -X POST https://n8n.odia.dev/webhook/7ea0ea7f-d542-4f94-ba78-c496b762abf2 \
  -H "Content-Type: application/json" \
  -d '{"message":"tell me about staking"}'
```

**Through proxy:**
```bash
curl -X POST https://etf-web-mi7p.vercel.app/api/n8n-proxy \
  -H "Content-Type: application/json" \
  -d '{"message":"tell me about staking"}'
```

**Expected response:**
```json
{"message":"Join the crypto revolution—stake your tokens for 7% APY! 🚀..."}
```

**In-app test:**
1. Open: https://etf-web-mi7p.vercel.app
3. Send: "tell me about staking"
4. Should see AI response (not "Workflow was started")

---

## Arc**Chat Widget → Proxy → Chat Trigger**

```
Browser (Chat Widget)
    ↓ POST /api/n8n-chat
Vercel Serverless Function (api/n8n-chat.js)
    ↓ POST https://n8n.odia.dev/chat/<chatWebhookId>
n8n Workflow (Chat Trigger)
    ├─ chatTrigger (receives message)
    ├─ Sora AI Agent (LangChain Agent)
    │   ├─ Groq Chat Model (llama-3.1-8b-instant)
    │   └─ Chat Memory (10-message window)
    └─ chatRespond (returns JSON)
    ↓ {"message": "AI response"}
Back to Browser
## Files Reference

| File | Purpose |
|------|---------|
| `n8n-sora-production.json` | Webhook-based workflow (legacy) |
| `n8n-sora-working.json` | Chat-trigger workflow (`chatTrigger` + `chatRespond`) |
| `api/n8n-chat.js` | Vercel proxy for chat trigger |
| `api/n8n-proxy.js` | Legacy webhook proxy (optional) |
| `frontend/src/components/ChatWidget.tsx` | Chat UI (posts to `/api/n8n-chat`) |
| `scripts/test-n8n-workflow.sh` | Automated test suite |
| `N8N_SETUP_GUIDE.md` | This guide |

---

## Troubleshooting

### Still seeing "Workflow was started"?
- Webhook node **Response Mode** must be `Using 'Respond to Webhook' Node`
- Ensure "Respond to Webhook" node is connected in the main path
- Check n8n Executions tab for errors

### AI not responding?
- Verify Groq credential is valid
- Check AI Agent has `text` parameter set to `={{ $json.message }}`
- Model name must be valid: `llama3-70b-8192` or `llama-3.1-8b-instant`

### Timeout errors?
- Use faster model: `llama-3.1-8b-instant`
- Reduce system prompt length
- Check n8n server performance

### CORS errors in browser?
- Use the proxy (`/api/n8n-proxy`) instead of direct webhook
- Verify proxy is deployed on Vercel

---

## Production Checklist

- [ ] Import `n8n-sora-production.json` into n8n
- [ ] Configure Groq credential
- [ ] Activate workflow
- [ ] Run `./scripts/test-n8n-workflow.sh` (all tests pass)
- [ ] Test in browser chat widget
- [ ] Monitor n8n Executions for errors
- [ ] Optional: Set up error notifications (Slack/Email)
- [ ] Optional: Add rate limiting
- [ ] Optional: Add shared secret for webhook security

---

## Support

- **n8n Docs:** https://docs.n8n.io/
- **Groq Models:** https://console.groq.com/docs/models
- **Test Script:** `./scripts/test-n8n-workflow.sh`
- **Workflow JSON:** `n8n-sora-production.json`

---

**Status:** Infrastructure complete. Import workflow to activate AI responses. 🚀
