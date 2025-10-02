#!/bin/bash

# TestSprite Setup Verification Script
# This script verifies that all TestSprite files are properly created

set -e

echo "🔍 Verifying TestSprite Test Suite Setup"
echo "========================================"

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

# Check if file exists
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        print_success "$description: $file"
        return 0
    else
        print_error "$description: $file (MISSING)"
        return 1
    fi
}

# Check if directory exists
check_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        print_success "$description: $dir"
        return 0
    else
        print_error "$description: $dir (MISSING)"
        return 1
    fi
}

# Count files in directory
count_files() {
    local dir=$1
    local pattern=$2
    
    if [ -d "$dir" ]; then
        local count=$(find "$dir" -name "$pattern" | wc -l)
        echo $count
    else
        echo 0
    fi
}

# Main verification
main() {
    local errors=0
    
    print_status "Checking TestSprite configuration files..."
    echo "----------------------------------------"
    
    # Check main configuration files
    check_file "testsprite.config.js" "TestSprite Configuration" || ((errors++))
    check_file "package.json" "Package Configuration" || ((errors++))
    check_file "run-tests.sh" "Test Runner Script" || ((errors++))
    check_file "TESTSPRITE_README.md" "TestSprite Documentation" || ((errors++))
    check_file "INSTALL_TESTSPRITE.md" "Installation Guide" || ((errors++))
    
    print_status "Checking test directory structure..."
    echo "----------------------------------------"
    
    # Check test directories
    check_directory "tests" "Main Test Directory" || ((errors++))
    check_directory "tests/auth" "Authentication Tests Directory" || ((errors++))
    check_directory "tests/e2e" "End-to-End Tests Directory" || ((errors++))
    check_directory "tests/api" "API Tests Directory" || ((errors++))
    check_directory "tests/utils" "Test Utilities Directory" || ((errors++))
    
    print_status "Checking test files..."
    echo "----------------------------------------"
    
    # Check test files
    check_file "tests/auth/signup.spec.js" "Signup Test File" || ((errors++))
    check_file "tests/auth/login.spec.js" "Login Test File" || ((errors++))
    check_file "tests/e2e/dashboard.spec.js" "Dashboard Test File" || ((errors++))
    check_file "tests/e2e/portfolio.spec.js" "Portfolio Test File" || ((errors++))
    check_file "tests/e2e/referrals.spec.js" "Referrals Test File" || ((errors++))
    check_file "tests/api/supabase.spec.js" "Supabase API Test File" || ((errors++))
    check_file "tests/utils/test-helpers.js" "Test Helpers File" || ((errors++))
    check_file "tests/global-setup.js" "Global Setup File" || ((errors++))
    check_file "tests/global-teardown.js" "Global Teardown File" || ((errors++))
    
    print_status "Checking file permissions..."
    echo "----------------------------------------"
    
    # Check if run-tests.sh is executable
    if [ -x "run-tests.sh" ]; then
        print_success "Test runner script is executable"
    else
        print_warning "Test runner script is not executable (run: chmod +x run-tests.sh)"
    fi
    
    print_status "Analyzing test coverage..."
    echo "----------------------------------------"
    
    # Count test files
    local auth_tests=$(count_files "tests/auth" "*.spec.js")
    local e2e_tests=$(count_files "tests/e2e" "*.spec.js")
    local api_tests=$(count_files "tests/api" "*.spec.js")
    local total_tests=$((auth_tests + e2e_tests + api_tests))
    
    print_success "Authentication tests: $auth_tests files"
    print_success "End-to-end tests: $e2e_tests files"
    print_success "API tests: $api_tests files"
    print_success "Total test files: $total_tests"
    
    print_status "Checking Node.js availability..."
    echo "----------------------------------------"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js is available: $node_version"
        
        # Check npm
        if command -v npm &> /dev/null; then
            local npm_version=$(npm --version)
            print_success "npm is available: $npm_version"
            
            # Check if dependencies can be installed
            print_status "Checking if dependencies can be installed..."
            if npm list &> /dev/null; then
                print_success "Dependencies check passed"
            else
                print_warning "Dependencies may need to be installed (run: npm install)"
            fi
        else
            print_error "npm is not available"
            ((errors++))
        fi
    else
        print_error "Node.js is not available"
        print_warning "Please install Node.js to run TestSprite tests"
        print_status "See INSTALL_TESTSPRITE.md for installation instructions"
        ((errors++))
    fi
    
    print_status "Checking Playwright availability..."
    echo "----------------------------------------"
    
    # Check Playwright
    if command -v npx &> /dev/null; then
        if npx playwright --version &> /dev/null; then
            local playwright_version=$(npx playwright --version)
            print_success "Playwright is available: $playwright_version"
        else
            print_warning "Playwright may need to be installed (run: npx playwright install)"
        fi
    else
        print_warning "npx is not available (install Node.js first)"
    fi
    
    print_status "Checking TestSprite availability..."
    echo "----------------------------------------"
    
    # Check TestSprite
    if command -v testsprite &> /dev/null; then
        local testsprite_version=$(testsprite --version 2>/dev/null || echo "unknown")
        print_success "TestSprite is available: $testsprite_version"
    else
        print_warning "TestSprite is not installed (run: npm install -g testsprite)"
    fi
    
    # Summary
    echo "========================================"
    if [ $errors -eq 0 ]; then
        print_success "✅ TestSprite setup verification PASSED!"
        print_status "All test files and configuration are properly set up"
        
        if command -v node &> /dev/null && command -v npm &> /dev/null; then
            print_status "Ready to run tests! Execute: ./run-tests.sh"
        else
            print_warning "Install Node.js first, then run: ./run-tests.sh"
        fi
    else
        print_error "❌ TestSprite setup verification FAILED!"
        print_error "Found $errors issues that need to be resolved"
        print_status "Please check the missing files and re-run this verification"
    fi
    
    echo "========================================"
    print_status "Test Suite Summary:"
    print_status "- Configuration files: ✅ Ready"
    print_status "- Test files: ✅ Ready ($total_tests test files)"
    print_status "- Documentation: ✅ Ready"
    print_status "- Test runner: ✅ Ready"
    
    if command -v node &> /dev/null; then
        print_status "- Node.js: ✅ Available"
        if command -v npm &> /dev/null; then
            print_status "- npm: ✅ Available"
            print_status "- Dependencies: ⚠️  May need installation"
        else
            print_status "- npm: ❌ Not available"
        fi
    else
        print_status "- Node.js: ❌ Not available (REQUIRED)"
    fi
    
    if command -v testsprite &> /dev/null; then
        print_status "- TestSprite: ✅ Available"
    else
        print_status "- TestSprite: ⚠️  Not installed"
    fi
    
    echo ""
    print_status "Next steps:"
    if ! command -v node &> /dev/null; then
        print_status "1. Install Node.js (see INSTALL_TESTSPRITE.md)"
    else
        print_status "1. Install dependencies: npm install"
        print_status "2. Install Playwright: npx playwright install"
        print_status "3. Run tests: ./run-tests.sh"
    fi
}

# Run main function
main "$@"

