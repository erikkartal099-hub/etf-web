#!/bin/bash

# Quick Fix Script for ERR_EMPTY_RESPONSE
# Run this to diagnose and fix common issues

set -e

echo "🔧 CoinDesk ETF - Quick Fix Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
  echo -e "${RED}❌ Error: Run this script from the project root directory${NC}"
  exit 1
fi

echo "📂 Checking project structure..."
if [ -d "frontend/src" ]; then
  echo -e "${GREEN}✅ Frontend directory found${NC}"
else
  echo -e "${RED}❌ Frontend source directory not found${NC}"
  exit 1
fi

# Check for .env.local
echo ""
echo "🔍 Checking environment variables..."
if [ -f "frontend/.env.local" ]; then
  echo -e "${GREEN}✅ .env.local exists${NC}"
  
  # Check if it has required variables
  if grep -q "VITE_SUPABASE_URL" frontend/.env.local && grep -q "VITE_SUPABASE_ANON_KEY" frontend/.env.local; then
    echo -e "${GREEN}✅ Required environment variables found${NC}"
  else
    echo -e "${YELLOW}⚠️  .env.local exists but missing required variables${NC}"
    echo ""
    echo "Add these to frontend/.env.local:"
    echo "  VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "  VITE_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    read -p "Open .env.local now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      ${EDITOR:-nano} frontend/.env.local
    fi
  fi
else
  echo -e "${YELLOW}⚠️  .env.local not found${NC}"
  
  if [ -f "frontend/.env.example" ]; then
    echo "Creating .env.local from .env.example..."
    cp frontend/.env.example frontend/.env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  You need to add your Supabase credentials:${NC}"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Go to Settings → API"
    echo "  4. Copy URL and anon key"
    echo "  5. Paste into frontend/.env.local"
    echo ""
    read -p "Open .env.local now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      ${EDITOR:-nano} frontend/.env.local
    fi
  else
    echo -e "${RED}❌ .env.example not found${NC}"
    echo "Creating minimal .env.local..."
    cat > frontend/.env.local << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Get these from: https://app.supabase.com → Settings → API
EOF
    echo -e "${GREEN}✅ Created .env.local template${NC}"
    echo -e "${YELLOW}⚠️  Edit it with your Supabase credentials${NC}"
    ${EDITOR:-nano} frontend/.env.local
  fi
fi

# Check Node.js version
echo ""
echo "🔍 Checking Node.js version..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✅ Node.js ${NODE_VERSION} installed${NC}"
  
  # Check if version is >= 18
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js 18+ recommended (you have ${NODE_VERSION})${NC}"
  fi
else
  echo -e "${RED}❌ Node.js not found${NC}"
  echo "Install from: https://nodejs.org"
  exit 1
fi

# Check for node_modules
echo ""
echo "📦 Checking dependencies..."
cd frontend
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠️  Dependencies not installed${NC}"
  echo "Installing dependencies..."
  npm install
  echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Check for port conflicts
echo ""
echo "🔍 Checking port availability..."
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
  PID=$(lsof -Pi :5173 -sTCP:LISTEN -t)
  echo -e "${YELLOW}⚠️  Port 5173 is in use by process ${PID}${NC}"
  read -p "Kill process and continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill -9 $PID
    echo -e "${GREEN}✅ Killed process ${PID}${NC}"
  fi
else
  echo -e "${GREEN}✅ Port 5173 available${NC}"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
  echo -e "${YELLOW}⚠️  Port 3000 is in use by process ${PID}${NC}"
else
  echo -e "${GREEN}✅ Port 3000 available${NC}"
fi

# Run type check
echo ""
echo "🔍 Running TypeScript type check..."
if npm run type-check 2>/dev/null; then
  echo -e "${GREEN}✅ No type errors${NC}"
else
  echo -e "${YELLOW}⚠️  Type check failed (not critical)${NC}"
fi

# Summary
echo ""
echo "=================================="
echo "📋 Diagnosis Summary"
echo "=================================="
echo ""

# Check all critical items
CRITICAL_PASS=true

if [ ! -f ".env.local" ]; then
  echo -e "${RED}❌ Missing .env.local${NC}"
  CRITICAL_PASS=false
else
  if ! grep -q "VITE_SUPABASE_URL" .env.local || ! grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
    echo -e "${RED}❌ .env.local missing credentials${NC}"
    CRITICAL_PASS=false
  fi
fi

if [ ! -d "node_modules" ]; then
  echo -e "${RED}❌ Dependencies not installed${NC}"
  CRITICAL_PASS=false
fi

if [ "$CRITICAL_PASS" = true ]; then
  echo -e "${GREEN}✅ All critical checks passed!${NC}"
  echo ""
  echo "🚀 Ready to start development server"
  echo ""
  echo "Run:"
  echo "  cd frontend"
  echo "  npm run dev"
  echo ""
  echo "Then open: http://localhost:5173"
  echo ""
  read -p "Start dev server now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting server... (Press Ctrl+C to stop)"
    echo ""
    npm run dev
  fi
else
  echo ""
  echo -e "${RED}❌ Critical issues found${NC}"
  echo ""
  echo "Fix the issues above and run this script again:"
  echo "  ./QUICK_FIX.sh"
  echo ""
  echo "Or read the full guide:"
  echo "  cat ERR_EMPTY_RESPONSE_FIXES.md"
  exit 1
fi
