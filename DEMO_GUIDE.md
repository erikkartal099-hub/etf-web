# Demo Guide: Email Verification Flow (Local + Vercel)

This guide helps a non-technical operator run the sign up → email → callback → dashboard flow reliably.

## Prerequisites

- Supabase project (URL + anon key)
- SendGrid account with an API key (and verified sender/domain)
- Node 20+ installed

## One-time: Configure Supabase Auth via API (recommended)

You will be prompted for:
- `SUPABASE_PROJECT_REF` (e.g., abcd-efgh from your Supabase project URL)
- `SUPABASE_ACCESS_TOKEN` (Personal Access Token from Supabase account settings)
- `SENDGRID_API_KEY` (from SendGrid dashboard)
- `HOSTED_SITE_URL` (optional, e.g., https://etf-web.vercel.app)

Steps:
1) Make scripts executable
   ```bash
   chmod +x scripts/configure-supabase-smtp.sh scripts/smoke-auth.sh
   ```
2) Configure Auth SMTP + redirect URLs (uses Supabase Management API)
   ```bash
   export SUPABASE_PROJECT_REF=your-project-ref
   export SUPABASE_ACCESS_TOKEN=your-access-token
   export SENDGRID_API_KEY=your-sendgrid-api-key
   # Optional production site URL
   # export HOSTED_SITE_URL=https://etf-web.vercel.app

   ./scripts/configure-supabase-smtp.sh
   ```
   What this does:
   - SMTP: host smtp.sendgrid.net, port 587, username `apikey`, password = your key
   - Enables email sending for auth; leaves confirmations required (no autoconfirm)
   - Sets `site_url` to http://localhost:3000 and allows these redirect URLs:
     - http://localhost:3000 (+ /auth/callback)
     - http://localhost:5173 (+ /auth/callback)
     - If `HOSTED_SITE_URL` provided, adds it (+ /auth/callback)

If the API call is blocked by permissions, follow manual steps in `AUTH_EMAIL_SETUP.md` and try again.

## Configure local environment

1) Create `frontend/.env.local` using `frontend/.env.example` as reference:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   The app validates these on startup and will show a helpful error if they are missing.

## Run locally (port 3000)

```bash
npm run dev
# or
./start-dev.sh
```
- Vite serves at http://localhost:3000 (if busy, it will choose the next port and log it).

## End-to-end demo

1) Open http://localhost:3000
2) Sign up with a new email address
3) Receive the verification email (check spam if needed)
4) Click the link → it should hit `/auth/callback` and then redirect to `/dashboard`

## Troubleshooting

- Supabase Logs: Dashboard → Logs → Auth & Email
- If email lands in Spam:
  - Use a different recipient domain
  - Ensure SendGrid domain is verified (SPF/DKIM)
- Resend verification: The Login page includes a “Resend verification” button
- Health check
  ```bash
  ./scripts/smoke-auth.sh
  ```
- Errors on page: A global Error Boundary will display a friendly screen with a button to go home and reload.

## Vercel (optional)

- Add the same redirect URLs to Supabase with `HOSTED_SITE_URL`
- On Vercel, set env vars for the frontend:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Checklist

- [ ] Sign up
- [ ] Receive email
- [ ] Click link → `/auth/callback`
- [ ] Land on dashboard
