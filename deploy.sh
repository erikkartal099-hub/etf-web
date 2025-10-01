#!/bin/bash

# CoinDesk ETF Grayscale - Deployment Script
# This script helps you set up and deploy the project

set -e  # Exit on error

echo "🚀 CoinDesk Crypto 5 ETF - Deployment Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_REF="vovlsbesaapezkfggdba"
SUPABASE_URL="https://vovlsbesaapezkfggdba.supabase.co"

# Step 1: Check if Supabase CLI is installed
echo "📦 Step 1: Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing...${NC}"
    brew install supabase/tap/supabase
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI is installed${NC}"
fi
echo ""

# Step 2: Install frontend dependencies
echo "📦 Step 2: Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi
cd ..
echo ""

# Step 3: Configure environment variables
echo "🔧 Step 3: Configuring environment variables..."
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating .env.local..."
    cat > frontend/.env.local << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://vovlsbesaapezkfggdba.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmxzYmVzYWFwZXprZmdnZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIwODIsImV4cCI6MjA3NDgxODA4Mn0.rtswmFAUt7lprWXbQD0rPmvWvpLlXGnJJLcDNtAk14U

# Environment
VITE_APP_ENV=development
VITE_APP_NAME=CoinDesk Crypto 5 ETF
VITE_APP_VERSION=1.0.0
EOF
    echo -e "${GREEN}✅ .env.local created${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi
echo ""

# Step 4: Login to Supabase
echo "🔑 Step 4: Logging into Supabase..."
echo "Please follow the prompts to login to Supabase..."
supabase login
echo -e "${GREEN}✅ Logged in to Supabase${NC}"
echo ""

# Step 5: Link project
echo "🔗 Step 5: Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF
echo -e "${GREEN}✅ Project linked${NC}"
echo ""

# Step 6: Apply database migrations
echo "💾 Step 6: Applying database migrations..."
echo "This will create all necessary tables including the chats table..."
read -p "Press Enter to apply migrations or Ctrl+C to cancel..."
supabase db push
echo -e "${GREEN}✅ Migrations applied${NC}"
echo ""

# Step 7: Configure Groq API Key
echo "🤖 Step 7: Configure Groq API Key"
echo "================================================"
echo ""
echo "To enable the AI chat feature, you need a FREE Groq API key:"
echo ""
echo "1. Go to: https://console.groq.com"
echo "2. Sign up (no credit card required)"
echo "3. Go to: https://console.groq.com/keys"
echo "4. Click 'Create API Key'"
echo "5. Copy the key (starts with 'gsk_...')"
echo ""
read -p "Enter your Groq API key: " GROQ_API_KEY

if [ ! -z "$GROQ_API_KEY" ]; then
    echo "Setting GROQ_API_KEY secret..."
    supabase secrets set GROQ_API_KEY="$GROQ_API_KEY"
    echo -e "${GREEN}✅ Groq API key configured${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping Groq API key setup. You can set it later.${NC}"
fi
echo ""

# Step 8: Deploy Edge Functions
echo "⚡ Step 8: Deploying Edge Functions..."
echo "Deploying grok-chat function..."
supabase functions deploy grok-chat --no-verify-jwt
echo -e "${GREEN}✅ Edge functions deployed${NC}"
echo ""

# Step 9: Start development server
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo -e "${GREEN}✅ Environment configured${NC}"
echo -e "${GREEN}✅ Database migrations applied${NC}"
echo -e "${GREEN}✅ Edge functions deployed${NC}"
echo ""
echo "To start the development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "  - AI_CHAT_SETUP.md - AI chat widget setup"
echo "  - SETUP_INSTRUCTIONS.md - Quick setup guide"
echo "  - README.md - Complete documentation"
echo ""
echo "🧪 Testing the AI Chat:"
echo "  1. Click the chat bubble in bottom-right"
echo "  2. Try: 'Tell me about referrals'"
echo "  3. Try: 'How do I deposit ETH?'"
echo ""
echo "Happy coding! 🚀"
