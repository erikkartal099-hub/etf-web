#!/bin/bash

# Start CoinDesk Crypto 5 ETF Development Server
# This script sets up the PATH to use the local Node.js installation

cd "$(dirname "$0")/frontend"

echo "🚀 Starting CoinDesk Crypto 5 ETF Development Server..."
echo ""

# Set PATH to use local Node.js
export PATH="$PWD/node-v18.20.8-darwin-x64/bin:$PATH"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Start the dev server
echo "✅ Starting Vite dev server..."
echo ""
echo "🌐 App will be available at:"
echo "   http://localhost:3000 (default)"
echo "   If 3000 is in use, Vite will pick the next available port and log it."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
