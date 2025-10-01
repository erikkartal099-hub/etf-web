#!/bin/bash

# Simple script to start the CoinDesk ETF application
# Just double-click this file or run: ./START_APP.sh

echo "🚀 Starting CoinDesk Crypto 5 ETF..."
echo ""

# Set Node.js path
export PATH="/Users/odiadev/CoinDesk ETF Grayscale/frontend/node-v18.20.8-darwin-x64/bin:$PATH"

# Navigate to frontend
cd "/Users/odiadev/CoinDesk ETF Grayscale/frontend"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first time..."
    npm install --legacy-peer-deps
fi

# Start the app
echo "✨ Opening your app at http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev
