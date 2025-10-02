# Supabase Auth Setup (Phase 1)

Follow these steps to enable email verification via SendGrid and complete the auth flow.

## 1) Configure SMTP (SendGrid) in Supabase
- Project → Authentication → SMTP Settings
- Provider: Custom SMTP
- Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: Your SendGrid API Key (starts with `SG.`)
- Secure: STARTTLS (recommended)
- Sender name: `CoinDesk Crypto 5 ETF`
- Sender email: your verified sender (e.g., `noreply@yourdomain.com` or the SendGrid single sender you verified)

Click Save.

## 2) Auth URL Settings
- Project → Authentication → URL Configuration
- Site URL: `https://etf-web-mi7p.vercel.app`
- Additional Redirect URLs:
  - `http://localhost:5173/auth/callback`
  - `https://etf-web-mi7p.vercel.app/auth/callback`

Enable "Confirm email" if not already enabled.

## 3) Email Templates (Optional but recommended)
- Project → Authentication → Templates
- Confirmation email → Paste the content of `emails/verify_email.html`
- Reset password email → Paste the content of `emails/reset_password.html`
- Ensure the template includes `{{ .ConfirmationURL }}` placeholder

Save templates.

## 4) Frontend callback route
Already present:
- Route: `/auth/callback` in `frontend/src/App.tsx`
- Page handler: `frontend/src/pages/AuthCallback.tsx` (handles `#access_token` and PKCE `code`)

No change required here.

## 5) Sign Up flow (frontend)
`frontend/src/contexts/AuthContext.tsx` → `signUp()` sets:
- `emailRedirectTo: ${window.location.origin}/auth/callback`

This ensures Supabase sends users back to your app after confirming their email.

## 6) Test the Flow
1. Deploy the app (or run locally `npm run dev` inside `frontend/`)
2. Go to Sign Up, create an account
3. Check your inbox (should arrive within 30 seconds on SendGrid)
4. Click the verification link
5. You should be redirected to `/auth/callback` then to `/dashboard`

## 7) Troubleshooting
- If emails are not arriving:
  - Check SendGrid sender verification (single sender or domain authenticated)
  - Check Supabase SMTP settings (typos, port, TLS)
  - Check spam folder
  - Supabase logs → Authentication → Emails
- If callback errors:
  - Confirm URLs in step 2
  - Inspect console for `Auth callback error` from `AuthCallback.tsx`
  - Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `frontend/.env.local`

## Environment Variables
Copy `frontend/.env.example` to `frontend/.env.local` and fill in:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

SendGrid API Key is used only in the Supabase dashboard (not in the frontend env).
