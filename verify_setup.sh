#!/bin/bash
# DRONA AI Assessment System - Quick Verification Script
# Run this to verify your setup is complete and working

set -e

echo "════════════════════════════════════════════════════════════"
echo "   DRONA AI Assessment System - Quick Verification"
echo "════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FAILED=0

# Test 1: Check Python is installed
echo -e "${BLUE}[1/7]${NC} Checking Python installation..."
if command -v python3 &> /dev/null; then
    PY_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python found: $PY_VERSION"
else
    echo -e "${RED}✗${NC} Python not found. Please install Python 3.10+"
    FAILED=1
fi

# Test 2: Check backend directory
echo -e "${BLUE}[2/7]${NC} Checking backend directory..."
if [ -d "drona-AI Backend" ]; then
    echo -e "${GREEN}✓${NC} Backend directory exists"
    cd "drona-AI Backend"
    
    # Check for main.py
    if [ -f "app/main.py" ]; then
        echo -e "${GREEN}✓${NC} app/main.py found"
    else
        echo -e "${RED}✗${NC} app/main.py not found"
        FAILED=1
    fi
    
    cd ..
else
    echo -e "${RED}✗${NC} Backend directory not found"
    FAILED=1
fi

# Test 3: Check frontend directory
echo -e "${BLUE}[3/7]${NC} Checking frontend directory..."
if [ -d "drona-AI Frontend" ]; then
    echo -e "${GREEN}✓${NC} Frontend directory exists"
    cd "drona-AI Frontend"
    
    # Check for AssessmentEngine.tsx
    if [ -f "src/components/onboarding/AssessmentEngine.tsx" ]; then
        BASELINE_COUNT=$(grep -c "const BASELINE_QUESTIONS" src/components/onboarding/AssessmentEngine.tsx || echo 0)
        if [ "$BASELINE_COUNT" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} AssessmentEngine.tsx has baseline questions"
        fi
    else
        echo -e "${RED}✗${NC} AssessmentEngine.tsx not found"
        FAILED=1
    fi
    
    cd ..
else
    echo -e "${RED}✗${NC} Frontend directory not found"
    FAILED=1
fi

# Test 4: Check GEMINI_API_KEY
echo -e "${BLUE}[4/7]${NC} Checking GEMINI_API_KEY..."
if [ -z "$GEMINI_API_KEY" ]; then
    if [ -f "drona-AI Backend/.env" ]; then
        if grep -q "GEMINI_API_KEY" "drona-AI Backend/.env"; then
            echo -e "${GREEN}✓${NC} GEMINI_API_KEY found in .env file"
        else
            echo -e "${YELLOW}⚠${NC}  GEMINI_API_KEY not in .env file"
        fi
    else
        echo -e "${YELLOW}⚠${NC}  No .env file found. Create one with: echo \"GEMINI_API_KEY=your-key\" > \"drona-AI Backend/.env\""
    fi
else
    echo -e "${GREEN}✓${NC} GEMINI_API_KEY environment variable is set"
fi

# Test 5: Check requirements.txt
echo -e "${BLUE}[5/7]${NC} Checking backend dependencies..."
if [ -f "drona-AI Backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} requirements.txt found"
    
    # Check for key dependencies
    if grep -q "fastapi" "drona-AI Backend/requirements.txt"; then
        echo -e "${GREEN}✓${NC} FastAPI dependency listed"
    else
        echo -e "${RED}✗${NC} FastAPI not in requirements.txt"
        FAILED=1
    fi
    
    if grep -q "google-generativeai" "drona-AI Backend/requirements.txt"; then
        echo -e "${GREEN}✓${NC} Gemini SDK dependency listed"
    else
        echo -e "${RED}✗${NC} google-generativeai not in requirements.txt"
        FAILED=1
    fi
else
    echo -e "${RED}✗${NC} requirements.txt not found"
    FAILED=1
fi

# Test 6: Check documentation files
echo -e "${BLUE}[6/7]${NC} Checking documentation files..."
DOCS_FOUND=0

if [ -f "drona-AI Backend/ASSESSMENT_ARCHITECTURE.md" ]; then
    echo -e "${GREEN}✓${NC} ASSESSMENT_ARCHITECTURE.md exists"
    ((DOCS_FOUND++))
fi

if [ -f "drona-AI Backend/SETUP_TROUBLESHOOTING.md" ]; then
    echo -e "${GREEN}✓${NC} SETUP_TROUBLESHOOTING.md exists"
    ((DOCS_FOUND++))
fi

if [ -f "ASSESSMENT_IMPLEMENTATION_SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} ASSESSMENT_IMPLEMENTATION_SUMMARY.md exists"
    ((DOCS_FOUND++))
fi

if [ "$DOCS_FOUND" -lt 3 ]; then
    echo -e "${YELLOW}⚠${NC}  Some documentation files missing (found $DOCS_FOUND/3)"
fi

# Test 7: Check test script
echo -e "${BLUE}[7/7]${NC} Checking test script..."
if [ -f "drona-AI Backend/test_assessment_api.py" ]; then
    echo -e "${GREEN}✓${NC} test_assessment_api.py found"
else
    echo -e "${YELLOW}⚠${NC}  test_assessment_api.py not found"
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All verification checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install backend dependencies:"
    echo "   cd \"drona-AI Backend\""
    echo "   pip install -r requirements.txt"
    echo ""
    echo "2. Start backend:"
    echo "   python -m uvicorn app.main:app --reload --port 8000"
    echo ""
    echo "3. In another terminal, start frontend:"
    echo "   cd \"drona-AI Frontend\""
    echo "   pnpm dev"
    echo ""
    echo "4. Run tests:"
    echo "   cd \"drona-AI Backend\""
    echo "   python test_assessment_api.py"
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "For detailed help, see:"
    echo "- drona-AI Backend/SETUP_TROUBLESHOOTING.md"
    echo "- ASSESSMENT_IMPLEMENTATION_SUMMARY.md"
fi

echo "════════════════════════════════════════════════════════════"
