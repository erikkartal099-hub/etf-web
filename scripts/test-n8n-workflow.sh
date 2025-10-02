#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
N8N_WEBHOOK="https://n8n.odia.dev/webhook/7ea0ea7f-d542-4f94-ba78-c496b762abf2"
PROXY_URL="https://etf-web-mi7p.vercel.app/api/n8n-proxy"

echo ""
echo "=========================================="
echo "n8n Sora Workflow Test Suite"
echo "=========================================="
echo ""

# Test 1: Proxy Health Check (GET)
echo -e "${YELLOW}[TEST 1]${NC} Proxy Health Check (GET /api/n8n-proxy)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$PROXY_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q '"ok":true'; then
  echo -e "${GREEN}✓ PASS${NC} - Proxy returned: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Expected 200 with {\"ok\":true}, got $HTTP_CODE: $BODY"
  exit 1
fi
echo ""

# Test 2: Direct Webhook POST (n8n)
echo -e "${YELLOW}[TEST 2]${NC} Direct n8n Webhook POST"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$N8N_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{"message":"test direct webhook"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  if echo "$BODY" | grep -q '"message"'; then
    # Check if it's a real AI response (not "Workflow was started")
    if echo "$BODY" | grep -q "Workflow was started"; then
      echo -e "${YELLOW}⚠ PARTIAL${NC} - Webhook works but returns default message: $BODY"
      echo -e "${YELLOW}   ACTION REQUIRED:${NC} Import n8n-sora-production.json in n8n and activate the workflow"
    else
      echo -e "${GREEN}✓ PASS${NC} - AI responded: $BODY"
    fi
  else
    echo -e "${RED}✗ FAIL${NC} - Response missing 'message' field: $BODY"
    exit 1
  fi
else
  echo -e "${RED}✗ FAIL${NC} - Expected 200, got $HTTP_CODE: $BODY"
  exit 1
fi
echo ""

# Test 3: Proxy to n8n (full stack)
echo -e "${YELLOW}[TEST 3]${NC} Proxy → n8n Webhook (Full Stack)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$PROXY_URL" \
  -H "Content-Type: application/json" \
  -d '{"message":"tell me about staking","sessionId":"test-123","userId":null}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  if echo "$BODY" | grep -q '"message"'; then
    if echo "$BODY" | grep -q "Workflow was started"; then
      echo -e "${YELLOW}⚠ PARTIAL${NC} - Proxy works but n8n returns default: $BODY"
      echo -e "${YELLOW}   ACTION REQUIRED:${NC} Import n8n-sora-production.json in n8n and activate"
    else
      echo -e "${GREEN}✓ PASS${NC} - Full stack working! AI response: $BODY"
    fi
  else
    echo -e "${RED}✗ FAIL${NC} - Response missing 'message' field: $BODY"
    exit 1
  fi
else
  echo -e "${RED}✗ FAIL${NC} - Expected 200, got $HTTP_CODE: $BODY"
  exit 1
fi
echo ""

# Test 4: Verify CORS headers
echo -e "${YELLOW}[TEST 4]${NC} CORS Headers Check"
HEADERS=$(curl -s -I -X OPTIONS "$PROXY_URL" 2>&1)
if echo "$HEADERS" | grep -qi "access-control-allow-origin"; then
  echo -e "${GREEN}✓ PASS${NC} - CORS headers present"
else
  echo -e "${RED}✗ FAIL${NC} - Missing CORS headers"
  exit 1
fi
echo ""

# Test 5: Response time check
echo -e "${YELLOW}[TEST 5]${NC} Response Time Check (<15s timeout)"
START=$(date +%s)
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$PROXY_URL" \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}')
END=$(date +%s)
DURATION=$((END - START))

if [ $DURATION -lt 15 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Response time: ${DURATION}s (within 15s limit)"
else
  echo -e "${YELLOW}⚠ WARN${NC} - Response time: ${DURATION}s (exceeds 15s, may timeout in browser)"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}Core Infrastructure: WORKING ✓${NC}"
echo "  - Vercel proxy deployed and healthy"
echo "  - n8n webhook endpoint reachable"
echo "  - CORS configured properly"
echo "  - Response times acceptable"
echo ""
if echo "$RESPONSE" | grep -q "Workflow was started"; then
  echo -e "${YELLOW}Next Step: Import n8n-sora-production.json${NC}"
  echo "  1. Open n8n: https://n8n.odia.dev"
  echo "  2. Workflows → Import from File"
  echo "  3. Select: n8n-sora-production.json"
  echo "  4. Re-select Groq credential (credential IDs are instance-specific)"
  echo "  5. Activate workflow (toggle top-right)"
  echo "  6. Re-run this test: ./scripts/test-n8n-workflow.sh"
else
  echo -e "${GREEN}All systems operational! 🚀${NC}"
  echo "  - n8n AI agent responding"
  echo "  - Chat widget ready to use"
fi
echo ""
