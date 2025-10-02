#!/usr/bin/env bash
set -euo pipefail

# Configure Supabase Auth without SMTP by enabling auto-confirmation
# This removes the need to click a verification email (good for demos).
#
# Requires:
# - SUPABASE_PROJECT_REF (e.g., abcd-efgh)
# - SUPABASE_ACCESS_TOKEN (Personal Access Token)
# - HOSTED_SITE_URL (optional, e.g., https://etf-web.vercel.app)

REQUIRED=(SUPABASE_PROJECT_REF SUPABASE_ACCESS_TOKEN)
missing=()
for var in "${REQUIRED[@]}"; do
  if [ -z "${!var:-}" ]; then
    missing+=("$var")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ Missing required env vars: ${missing[*]}"
  exit 1
fi

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
  HOSTED_BASE="${HOSTED_SITE_URL%/}"
  URI_LIST+=("$HOSTED_BASE" "$HOSTED_BASE$CALLBACK_SUFFIX")
fi

URI_ALLOW_LIST=$(printf ",%s" "${URI_LIST[@]}")
URI_ALLOW_LIST=${URI_ALLOW_LIST:1}

SITE_URL=${HOSTED_SITE_URL:-$LOCAL_ORIGIN_3000}

API_BASE="https://api.supabase.com"
ENDPOINT="/v1/projects/${SUPABASE_PROJECT_REF}/config/auth"
AUTH_HEADER="Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}"
CT_HEADER="Content-Type: application/json"

read -r -d '' PAYLOAD <<JSON || true
{
  "site_url": "${SITE_URL}",
  "uri_allow_list": "${URI_ALLOW_LIST}",
  "mailer_autoconfirm": true
}
JSON

echo "Configuring: site_url=${SITE_URL}"
echo "Allow list: ${URI_ALLOW_LIST}"

set +e
HTTP_CODE=$(curl -s -o /tmp/sb_auth_autoconfirm_resp.json -w "%{http_code}" \
  -X PATCH "${API_BASE}${ENDPOINT}" \
  -H "$AUTH_HEADER" -H "$CT_HEADER" \
  -d "$PAYLOAD")
set -e

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Auth config updated: auto-confirm ENABLED. No email verification required."
else
  echo "⚠️  API returned HTTP $HTTP_CODE"
  cat /tmp/sb_auth_autoconfirm_resp.json || true
  exit 1
fi

rm -f /tmp/sb_auth_autoconfirm_resp.json 2>/dev/null || true
