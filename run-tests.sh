#!/bin/bash

# TestSprite Test Runner for CoinDesk Crypto 5 ETF
# This script runs comprehensive tests for the investment platform

set -e

echo "🚀 Starting TestSprite Test Suite for CoinDesk Crypto 5 ETF"
echo "=========================================================="

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

# Check if TestSprite is installed
check_testsprite() {
    print_status "Checking TestSprite installation..."
    
    if ! command -v testsprite &> /dev/null; then
        print_error "TestSprite is not installed!"
        print_status "Installing TestSprite..."
        
        if command -v npm &> /dev/null; then
            npm install -g testsprite
        else
            print_error "npm is not available. Please install Node.js and npm first."
            exit 1
        fi
    fi
    
    print_success "TestSprite is available"
}

# Check if Playwright browsers are installed
check_playwright() {
    print_status "Checking Playwright browsers..."
    
    if ! npx playwright --version &> /dev/null; then
        print_warning "Playwright browsers not installed. Installing..."
        npx playwright install
    fi
    
    print_success "Playwright browsers are ready"
}

# Clean up previous test results
cleanup() {
    print_status "Cleaning up previous test results..."
    rm -rf test-results/
    mkdir -p test-results/screenshots
    print_success "Cleanup completed"
}

# Run specific test suite
run_suite() {
    local suite=$1
    local description=$2
    
    print_status "Running $description..."
    echo "----------------------------------------"
    
    if testsprite --suite=$suite; then
        print_success "$description completed successfully"
    else
        print_error "$description failed"
        return 1
    fi
}

# Run individual test
run_test() {
    local test_file=$1
    local description=$2
    
    print_status "Running $description..."
    echo "----------------------------------------"
    
    if testsprite $test_file; then
        print_success "$description completed successfully"
    else
        print_error "$description failed"
        return 1
    fi
}

# Main test execution
main() {
    local test_type=${1:-"all"}
    
    print_status "Starting test execution: $test_type"
    echo "=========================================================="
    
    # Pre-flight checks
    check_testsprite
    check_playwright
    cleanup
    
    # Run tests based on type
    case $test_type in
        "smoke")
            run_suite "smoke" "Smoke Tests"
            ;;
        "auth")
            run_test "tests/auth/" "Authentication Tests"
            ;;
        "signup")
            run_test "tests/auth/signup.spec.js" "Signup Flow Tests"
            ;;
        "login")
            run_test "tests/auth/login.spec.js" "Login Flow Tests"
            ;;
        "dashboard")
            run_test "tests/e2e/dashboard.spec.js" "Dashboard Tests"
            ;;
        "portfolio")
            run_test "tests/e2e/portfolio.spec.js" "Portfolio Tests"
            ;;
        "referrals")
            run_test "tests/e2e/referrals.spec.js" "Referral System Tests"
            ;;
        "api")
            run_suite "api" "API Integration Tests"
            ;;
        "e2e")
            run_suite "e2e" "End-to-End Tests"
            ;;
        "regression")
            run_suite "regression" "Full Regression Tests"
            ;;
        "all"|*)
            print_status "Running complete test suite..."
            
            # Run smoke tests first
            run_suite "smoke" "Smoke Tests"
            
            # Run authentication tests
            run_test "tests/auth/" "Authentication Tests"
            
            # Run API tests
            run_suite "api" "API Integration Tests"
            
            # Run E2E tests
            run_suite "e2e" "End-to-End Tests"
            
            # Run full regression
            run_suite "regression" "Full Regression Tests"
            ;;
    esac
    
    # Generate test report
    print_status "Generating test report..."
    if [ -d "test-results/html" ]; then
        print_success "HTML report generated: test-results/html/index.html"
        print_status "To view the report, run: npx playwright show-report test-results/html"
    fi
    
    # Show summary
    echo "=========================================================="
    print_success "Test execution completed!"
    print_status "Test results saved in: test-results/"
    print_status "Screenshots saved in: test-results/screenshots/"
    
    if [ -f "test-results/results.json" ]; then
        print_status "JSON results: test-results/results.json"
    fi
    
    if [ -f "test-results/junit.xml" ]; then
        print_status "JUnit results: test-results/junit.xml"
    fi
}

# Show help
show_help() {
    echo "TestSprite Test Runner for CoinDesk Crypto 5 ETF"
    echo ""
    echo "Usage: $0 [test_type]"
    echo ""
    echo "Test Types:"
    echo "  all        - Run complete test suite (default)"
    echo "  smoke      - Run smoke tests only"
    echo "  auth       - Run authentication tests"
    echo "  signup     - Run signup flow tests"
    echo "  login      - Run login flow tests"
    echo "  dashboard  - Run dashboard tests"
    echo "  portfolio  - Run portfolio tests"
    echo "  referrals  - Run referral system tests"
    echo "  api        - Run API integration tests"
    echo "  e2e        - Run end-to-end tests"
    echo "  regression - Run full regression tests"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests"
    echo "  $0 smoke             # Run smoke tests"
    echo "  $0 auth              # Run authentication tests"
    echo "  $0 signup            # Run signup tests"
    echo ""
    echo "Additional Commands:"
    echo "  $0 help              # Show this help"
    echo "  $0 install           # Install TestSprite and dependencies"
    echo "  $0 clean             # Clean test results"
    echo "  $0 report            # Show test report"
}

# Handle special commands
case ${1:-"all"} in
    "help"|"-h"|"--help")
        show_help
        exit 0
        ;;
    "install")
        print_status "Installing TestSprite and dependencies..."
        npm install
        npx playwright install
        print_success "Installation completed"
        exit 0
        ;;
    "clean")
        cleanup
        print_success "Test results cleaned"
        exit 0
        ;;
    "report")
        if [ -d "test-results/html" ]; then
            print_status "Opening test report..."
            npx playwright show-report test-results/html
        else
            print_error "No test report found. Run tests first."
            exit 1
        fi
        exit 0
        ;;
esac

# Run main function
main "$1"

