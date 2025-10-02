# Auth & Email Setup Guide

This guide walks you through configuring Supabase Authentication, email confirmations, SMTP, and redirect URLs for both local and production.

## Prerequisites

- Supabase project created
- Access to Supabase Dashboard
- A transactional email provider (Resend, Postmark, SendGrid, Mailgun) with a verified domain (SPF/DKIM)

---

## 1) Redirect URLs

- Dashboard → Authentication → URL Configuration
- Set:
  - `http://localhost:5173/auth/callback`
  - `http://localhost:3000/auth/callback` (if you sometimes run on 3000)
  - Production: `https://your-domain.com/auth/callback`
- Save.

Frontend uses PKCE and handles the callback in `frontend/src/pages/AuthCallback.tsx`.

---

## 2) Enable Email Confirmations

- Dashboard → Authentication → Email
- Turn ON:
  - Enable email confirmations (Confirm signup)
  - (Optional) Double confirm changes
- Customize your email templates if desired (From name, Reply-to, Brand).

Local CLI config (`supabase/config.toml`) already sets:
```
[auth]
site_url = "http://localhost:5173"
additional_redirect_urls = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173/auth/callback",
  "http://localhost:3000/auth/callback"
]

[auth.email]
enable_confirmations = true
```
Note: The Dashboard settings control your hosted project; the TOML file only affects local CLI.

---

## 3) SMTP Provider

- Dashboard → Authentication → SMTP (or Email provider)
- Enter provider credentials (API key / SMTP username+password)
- Set a From address on your verified domain (avoid gmail.com/yahoo.com as From)
- Ensure DNS records are valid:
  - SPF
  - DKIM
  - DMARC (optional but recommended)
- Send a test email from Dashboard.

Troubleshooting:
- Check Dashboard → Logs → Email for bounces, rate limits, or suppressions.
- Try a different recipient domain to avoid spam filters.

---

## 4) Frontend SignUp and Resend

- `AuthContext.signUp()` includes:
  - `emailRedirectTo: ${window.location.origin}/auth/callback`
  - Metadata: `full_name`, `referred_by`
- Login page includes a “Resend verification” button calling `supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo } })`.

---

## 5) Common Pitfalls

- Wrong redirect URL → 400/invalid request or no session after click
- Email confirmations disabled → users never receive verification email
- SMTP not configured → unstable/blocked delivery
- Using free mailbox as From → increases spam and bounces

---

## 6) Verify End-to-End

1) Sign up with a new email
2) Receive verification email
3) Click link → `/auth/callback`
4) Land on dashboard without errors
5) If issues:
   - Check browser console
   - Check Supabase Auth logs (API & Email)
   - Confirm redirect URLs & SMTP settings

---

## 7) Production Checklist

- HTTPS on your domain
- Production callback URL added
- SMTP verified domain with positive reputation
- Sentry/monitoring enabled (see SENTRY_SETUP.md)
- Backups enabled on Supabase
