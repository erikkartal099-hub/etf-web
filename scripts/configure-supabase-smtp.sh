#!/usr/bin/env bash
set -euo pipefail

# Configure Supabase Auth SMTP (SendGrid) and Redirect URLs via Management API
# Requires:
# - SUPABASE_PROJECT_REF (e.g., abcd-efgh)
# - SUPABASE_ACCESS_TOKEN (Personal Access Token)
# - SENDGRID_API_KEY (SendGrid API Key)
# - HOSTED_SITE_URL (optional, e.g., https://etf-web.vercel.app)
# - SUPABASE_SMTP_FROM (optional, e.g., no-reply@yourdomain.com)

# Usage:
#   export SUPABASE_PROJECT_REF=...
#   export SUPABASE_ACCESS_TOKEN=...
#   export SENDGRID_API_KEY=...
#   export HOSTED_SITE_URL=...   # optional
#   export SUPABASE_SMTP_FROM=... # optional
#   ./scripts/configure-supabase-smtp.sh

REQUIRED=(SUPABASE_PROJECT_REF SUPABASE_ACCESS_TOKEN SENDGRID_API_KEY)
missing=()
for var in "${REQUIRED[@]}"; do
  if [ -z "${!var:-}" ]; then
    missing+=("$var")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables: ${missing[*]}"
  echo "➡️  Please set them and re-run."
  exit 1
fi

# Resolve project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Construct allow list for redirect URLs
LOCAL_ORIGIN_3000="http://localhost:3000"
LOCAL_ORIGIN_5173="http://localhost:5173"
CALLBACK_SUFFIX="/auth/callback"

URI_LIST=(
  "$LOCAL_ORIGIN_3000"
  "$LOCAL_ORIGIN_3000$CALLBACK_SUFFIX"
  "$LOCAL_ORIGIN_5173"
  "$LOCAL_ORIGIN_5173$CALLBACK_SUFFIX"
)

if [ -n "${HOSTED_SITE_URL:-}" ]; then
  # Normalize trailing slash
  HOSTED_BASE="${HOSTED_SITE_URL%/}"
  URI_LIST+=("$HOSTED_BASE" "$HOSTED_BASE$CALLBACK_SUFFIX")
fi

# The Management API expects a single string for uri_allow_list
# We join with commas (API also accepts newline-delimited values)
URI_ALLOW_LIST=$(printf ",%s" "${URI_LIST[@]}")
URI_ALLOW_LIST=${URI_ALLOW_LIST:1}

API_BASE="https://api.supabase.com"
ENDPOINT="/v1/projects/${SUPABASE_PROJECT_REF}/config/auth"
AUTH_HEADER="Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}"
CT_HEADER="Content-Type: application/json"

# Optional From email and confirmation template
SMTP_FROM="${SUPABASE_SMTP_FROM:-}"
TEMPLATE_FILE="$ROOT_DIR/supabase/config/email_templates/confirmation.html"
TEMPLATE_JSON_FRAGMENT=""
if [ -f "$TEMPLATE_FILE" ]; then
  # Escape quotes and strip newlines for JSON safety
  TEMPLATE_CONTENT=$(sed 's/"/\\"/g' "$TEMPLATE_FILE" | tr -d '\n')
  if [ -n "$TEMPLATE_CONTENT" ]; then
    TEMPLATE_JSON_FRAGMENT=", \"mailer_templates_confirmation_content\": \"$TEMPLATE_CONTENT\""
  fi
fi

# Optional smtp_admin_email fragment
SMTP_FROM_JSON_FRAGMENT=""
if [ -n "$SMTP_FROM" ]; then
  SMTP_FROM_JSON_FRAGMENT=", \"smtp_admin_email\": \"$SMTP_FROM\""
fi

# Build payload (mailer_autoconfirm=false to REQUIRE email confirmations)
read -r -d '' PAYLOAD <<JSON || true
{
  "site_url": "${LOCAL_ORIGIN_3000}",
  "uri_allow_list": "${URI_ALLOW_LIST}",
  "smtp_host": "smtp.sendgrid.net",
  "smtp_port": "587",
  "smtp_user": "apikey",
  "smtp_pass": "${SENDGRID_API_KEY}",
  "smtp_sender_name": "CoinDesk Crypto 5 ETF",
  "external_email_enabled": true,
  "mailer_autoconfirm": false
  ${SMTP_FROM_JSON_FRAGMENT}${TEMPLATE_JSON_FRAGMENT}
}
JSON

echo "Configuring Supabase Auth for project: ${SUPABASE_PROJECT_REF}"
set +e
HTTP_CODE=$(curl -s -o /tmp/sb_auth_resp.json -w "%{http_code}" \
  -X PATCH "${API_BASE}${ENDPOINT}" \
  -H "$AUTH_HEADER" -H "$CT_HEADER" \
  -d "$PAYLOAD")
set -e

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Auth config updated successfully."
  echo "   - site_url: ${LOCAL_ORIGIN_3000}"
  echo "   - uri_allow_list: ${URI_ALLOW_LIST}"
  echo "   - SMTP: SendGrid (host=smtp.sendgrid.net, port=587, user=apikey)"
else
  echo "⚠️  Management API returned HTTP $HTTP_CODE. Response:"
  cat /tmp/sb_auth_resp.json || true
  echo ""
  echo "If this operation is not permitted by your token or org policy, follow manual steps in AUTH_EMAIL_SETUP.md."
  exit 1
fi

rm -f /tmp/sb_auth_resp.json 2>/dev/null || true
