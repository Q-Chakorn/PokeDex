#!/bin/bash

# Modern Pokédex - CI Test Pipeline Script
set -e

echo "🧪 Running Modern Pokédex CI test pipeline..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}🔍 $1${NC}"
    echo "----------------------------------------"
}

# Initialize counters
TOTAL_STEPS=0
PASSED_STEPS=0
FAILED_STEPS=0

# Function to run a test step
run_step() {
    local step_name="$1"
    local command="$2"
    local required="${3:-true}"
    
    TOTAL_STEPS=$((TOTAL_STEPS + 1))
    
    print_info "Running: $step_name"
    
    if eval "$command"; then
        print_status "$step_name passed"
        PASSED_STEPS=$((PASSED_STEPS + 1))
        return 0
    else
        if [ "$required" = "true" ]; then
            print_error "$step_name failed (required)"
            FAILED_STEPS=$((FAILED_STEPS + 1))
            return 1
        else
            print_warning "$step_name failed (optional)"
            return 0
        fi
    fi
}

# Parse command line arguments
SKIP_E2E=false
SKIP_BUILD=false
COVERAGE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-e2e)
            SKIP_E2E=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-e2e       Skip E2E tests"
            echo "  --skip-build     Skip build verification"
            echo "  --coverage       Generate coverage reports"
            echo "  --verbose        Verbose output"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Start CI pipeline
print_section "Starting CI Pipeline"
print_info "Node.js version: $(node --version)"
print_info "npm version: $(npm --version)"

# Step 1: Install dependencies
print_section "Installing Dependencies"
if ! run_step "Install dependencies" "npm ci"; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Lint code
print_section "Code Quality Checks"
run_step "ESLint check" "npm run lint"
run_step "Prettier check" "npx prettier --check ." "false"

# Step 3: Type checking
print_section "Type Checking"
run_step "TypeScript check" "npx tsc --noEmit"

# Step 4: Unit tests
print_section "Unit Tests"
if [ "$COVERAGE" = "true" ]; then
    run_step "Unit tests with coverage" "npm run test:coverage"
else
    run_step "Unit tests" "npm run test:run"
fi

# Step 5: Build verification
if [ "$SKIP_BUILD" = "false" ]; then
    print_section "Build Verification"
    run_step "Production build" "npm run build"
    
    # Check if build artifacts exist
    if [ -d "dist" ]; then
        print_status "Build artifacts created successfully"
        
        # Analyze bundle size
        if [ -f "scripts/build/analyze-bundle.js" ]; then
            run_step "Bundle analysis" "node scripts/build/analyze-bundle.js" "false"
        fi
    else
        print_error "Build artifacts not found"
        FAILED_STEPS=$((FAILED_STEPS + 1))
    fi
fi

# Step 6: E2E tests
if [ "$SKIP_E2E" = "false" ]; then
    print_section "End-to-End Tests"
    
    # Check if Playwright is installed
    if command -v npx playwright &> /dev/null; then
        # Install browsers if needed
        run_step "Install Playwright browsers" "npx playwright install --with-deps" "false"
        
        # Run E2E tests
        run_step "E2E tests" "npm run test:e2e"
    else
        print_warning "Playwright not found, skipping E2E tests"
    fi
fi

# Step 7: Security audit
print_section "Security Audit"
run_step "npm audit" "npm audit --audit-level=moderate" "false"

# Final report
print_section "Test Results Summary"
echo ""
echo "📊 Pipeline Results:"
echo "   Total steps: $TOTAL_STEPS"
echo "   Passed: $PASSED_STEPS"
echo "   Failed: $FAILED_STEPS"

if [ $FAILED_STEPS -eq 0 ]; then
    print_status "All tests passed! 🎉"
    echo ""
    echo "✅ Ready for deployment"
    exit 0
else
    print_error "$FAILED_STEPS test(s) failed"
    echo ""
    echo "❌ Pipeline failed - please fix the issues above"
    exit 1
fi