#!/bin/bash

# Node.js and TestSprite Installation Script for macOS Intel
# This script helps install Node.js and set up TestSprite for the CoinDesk ETF project

set -e

echo "🚀 Node.js and TestSprite Installation Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is already installed
check_nodejs() {
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js is already installed: $node_version"
        
        if command -v npm &> /dev/null; then
            local npm_version=$(npm --version)
            print_success "npm is already installed: $npm_version"
            return 0
        else
            print_error "npm is not available (this shouldn't happen)"
            return 1
        fi
    else
        print_warning "Node.js is not installed"
        return 1
    fi
}

# Install Node.js using Homebrew
install_nodejs_homebrew() {
    print_status "Installing Node.js using Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_status "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    # Install Node.js
    print_status "Installing Node.js..."
    brew install node
    
    print_success "Node.js installed successfully"
}

# Install Node.js using NVM
install_nodejs_nvm() {
    print_status "Installing Node.js using NVM..."
    
    # Install NVM
    print_status "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Reload shell
    source ~/.zshrc
    
    # Install Node.js LTS
    print_status "Installing Node.js LTS..."
    nvm install --lts
    nvm use --lts
    nvm alias default lts/*
    
    print_success "Node.js installed successfully"
}

# Install TestSprite dependencies
install_testsprite() {
    print_status "Installing TestSprite dependencies..."
    
    # Navigate to project directory
    cd "/Users/odiadev/CoinDesk ETF Grayscale"
    
    # Install dependencies
    print_status "Running npm install..."
    npm install
    
    # Install Playwright browsers
    print_status "Installing Playwright browsers..."
    npx playwright install
    
    print_success "TestSprite dependencies installed successfully"
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js: $node_version"
    else
        print_error "Node.js verification failed"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_success "npm: $npm_version"
    else
        print_error "npm verification failed"
        return 1
    fi
    
    # Check TestSprite
    if command -v npx &> /dev/null; then
        print_success "npx is available"
    else
        print_error "npx verification failed"
        return 1
    fi
    
    return 0
}

# Run TestSprite verification
run_testsprite_verification() {
    print_status "Running TestSprite verification..."
    
    if [ -f "./verify-test-setup.sh" ]; then
        ./verify-test-setup.sh
    else
        print_warning "TestSprite verification script not found"
    fi
}

# Main installation function
main() {
    local install_method=${1:-"homebrew"}
    
    print_status "Starting Node.js and TestSprite installation..."
    echo "=============================================="
    
    # Check if Node.js is already installed
    if check_nodejs; then
        print_status "Node.js is already installed, proceeding to TestSprite setup..."
    else
        print_status "Installing Node.js using method: $install_method"
        
        case $install_method in
            "homebrew")
                install_nodejs_homebrew
                ;;
            "nvm")
                install_nodejs_nvm
                ;;
            *)
                print_error "Unknown installation method: $install_method"
                print_status "Available methods: homebrew, nvm"
                exit 1
                ;;
        esac
    fi
    
    # Verify Node.js installation
    if ! verify_installation; then
        print_error "Installation verification failed"
        exit 1
    fi
    
    # Install TestSprite dependencies
    install_testsprite
    
    # Run TestSprite verification
    run_testsprite_verification
    
    # Final summary
    echo "=============================================="
    print_success "✅ Installation completed successfully!"
    print_status "Node.js and TestSprite are ready to use"
    print_status ""
    print_status "Next steps:"
    print_status "1. Run tests: ./run-tests.sh"
    print_status "2. View results: ./run-tests.sh report"
    print_status ""
    print_status "Test commands available:"
    print_status "- ./run-tests.sh smoke      # Quick smoke tests"
    print_status "- ./run-tests.sh auth       # Authentication tests"
    print_status "- ./run-tests.sh signup     # Signup flow tests"
    print_status "- ./run-tests.sh dashboard  # Dashboard tests"
    print_status "- ./run-tests.sh portfolio  # Portfolio tests"
    print_status "- ./run-tests.sh referrals  # Referral system tests"
    print_status "- ./run-tests.sh api        # API integration tests"
    print_status "- ./run-tests.sh e2e        # End-to-end tests"
    print_status "- ./run-tests.sh regression # Full regression tests"
}

# Show help
show_help() {
    echo "Node.js and TestSprite Installation Script"
    echo ""
    echo "Usage: $0 [method]"
    echo ""
    echo "Installation Methods:"
    echo "  homebrew  - Install using Homebrew (default)"
    echo "  nvm       - Install using Node Version Manager"
    echo ""
    echo "Examples:"
    echo "  $0                # Install using Homebrew"
    echo "  $0 homebrew       # Install using Homebrew"
    echo "  $0 nvm            # Install using NVM"
    echo ""
    echo "This script will:"
    echo "1. Install Node.js and npm"
    echo "2. Install TestSprite dependencies"
    echo "3. Install Playwright browsers"
    echo "4. Verify the installation"
    echo "5. Run TestSprite verification"
}

# Handle help
if [ "${1:-}" = "help" ] || [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main "$@"

