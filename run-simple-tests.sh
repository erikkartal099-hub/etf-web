#!/bin/bash

# Simple TestSprite Test Runner
# This script runs tests without complex setup

set -e

echo "🚀 Running Simple TestSprite Tests"
echo "=================================="

# Set up Node.js path
export PATH="$PWD/node-v20.10.0-darwin-x64/bin:$PATH"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Test 1: Check Node.js installation
print_status "Testing Node.js installation..."
if node --version > /dev/null 2>&1; then
    print_success "Node.js $(node --version) is working"
else
    echo "❌ Node.js not working"
    exit 1
fi

# Test 2: Check npm installation
print_status "Testing npm installation..."
if npm --version > /dev/null 2>&1; then
    print_success "npm $(npm --version) is working"
else
    echo "❌ npm not working"
    exit 1
fi

# Test 3: Check Playwright installation
print_status "Testing Playwright installation..."
if npx playwright --version > /dev/null 2>&1; then
    print_success "Playwright is working"
else
    echo "❌ Playwright not working"
    exit 1
fi

# Test 4: Run a simple test
print_status "Running simple connectivity test..."
npx playwright test --grep "should connect to Supabase successfully" --project=chromium --max-failures=1 --reporter=list

print_success "Simple tests completed!"
print_status "Test reports available at: test-results/html"
print_status "To view reports: npx playwright show-report test-results/html"
