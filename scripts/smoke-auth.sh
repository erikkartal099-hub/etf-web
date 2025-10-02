#!/usr/bin/env bash
set -euo pipefail

# Smoke test for Supabase Auth configuration
# - Validates required environment variables
# - Pings Supabase Auth health endpoint
# - Prints manual steps to complete the end-to-end demo

# Resolve project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load frontend .env.local if present (non-fatal)
if [ -f "$ROOT_DIR/frontend/.env.local" ]; then
  # shellcheck disable=SC2046
  export $(grep -E '^(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)=' "$ROOT_DIR/frontend/.env.local" | xargs -I{} echo {}) || true
fi

SUPABASE_URL="${VITE_SUPABASE_URL:-${SUPABASE_URL:-}}"
ANON_KEY="${VITE_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY:-}}"

missing=()
[ -z "${SUPABASE_URL:-}" ] && missing+=("VITE_SUPABASE_URL (or SUPABASE_URL)")
[ -z "${ANON_KEY:-}" ] && missing+=("VITE_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)")

if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ Missing required env vars: ${missing[*]}"
  echo "➡️  Populate frontend/.env.local or export these variables, then re-run."
  exit 1
fi

set +e
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SUPABASE_URL%/}/auth/v1/health")
set -e

if [ "$HEALTH_STATUS" = "200" ]; then
  echo "✅ Supabase Auth health check OK (${SUPABASE_URL%/}/auth/v1/health)"
else
  echo "⚠️  Supabase Auth health check returned status: $HEALTH_STATUS"
  echo "   Check project status and network connectivity."
fi

cat <<'EOF'

Next steps to smoke test manually:

1) Start the app
   - npm run dev   (or ./start-dev.sh)
   - Open http://localhost:3000

2) Sign up
   - Use an email you can access
   - Check inbox/spam for "Verify your email"

3) Click the verification link
   - Should land on /auth/callback and then redirect to /dashboard

Troubleshooting:
- Supabase Dashboard → Logs → Auth & Email for delivery errors
- Ensure redirect URLs include http://localhost:3000 and /auth/callback
- Resend verification from the Login page if needed
EOF
