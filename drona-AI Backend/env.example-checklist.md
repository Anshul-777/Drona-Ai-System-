# 📋 Drona AI Environment Variables — Quick Reference Checklist

## ✅ API Keys You Need to Collect

### **TIER 1: Absolutely Required**
- [ ] **Supabase Project**
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY (anon)
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] Database URL (postgresql://...)
  - Get from: https://app.supabase.com → Settings → API

- [ ] **LLM Provider (Pick ONE as primary)**
  - [ ] GEMINI_API_KEY (recommended for free tier)
    - Get from: https://aistudio.google.com/app/apikey
  - [ ] OR GROQ_API_KEY
    - Get from: https://console.groq.com
  - [ ] OR OPENAI_API_KEY
    - Get from: https://platform.openai.com/api-keys

- [ ] **Vector Database - Pinecone**
  - [ ] PINECONE_API_KEY
  - [ ] PINECONE_ENVIRONMENT
  - [ ] PINECONE_INDEX_NAME
  - Get from: https://app.pinecone.io

- [ ] **Secrets**
  - [ ] JWT_SECRET (generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
  - [ ] SECRET_KEY (min 32 random characters)

---

### **TIER 2: Highly Recommended**
- [ ] **Cache - Upstash Redis**
  - [ ] UPSTASH_REDIS_REST_URL
  - [ ] UPSTASH_REDIS_REST_TOKEN
  - Get from: https://console.upstash.com

- [ ] **Background Jobs - Upstash QStash**
  - [ ] UPSTASH_QSTASH_TOKEN
  - Get from: https://console.upstash.com

- [ ] **File Storage - Cloudflare R2**
  - [ ] CLOUDFLARE_ACCOUNT_ID
  - [ ] CLOUDFLARE_ACCESS_KEY_ID
  - [ ] CLOUDFLARE_SECRET_ACCESS_KEY
  - [ ] CLOUDFLARE_BUCKET_NAME
  - Get from: https://dash.cloudflare.com

- [ ] **Email - SendGrid**
  - [ ] SENDGRID_API_KEY
  - [ ] SENDGRID_FROM_EMAIL
  - Get from: https://app.sendgrid.com

---

### **TIER 3: Nice to Have**
- [ ] **OCR - Mathpix** (for math equation recognition)
  - [ ] MATHPIX_APP_ID
  - [ ] MATHPIX_APP_KEY
  - Get from: https://www.mathpix.com

- [ ] **Analytics - PostHog**
  - [ ] POSTHOG_API_KEY
  - Get from: https://app.posthog.com

- [ ] **Error Tracking - Sentry**
  - [ ] SENTRY_DSN
  - Get from: https://sentry.io

- [ ] **Payment - Razorpay**
  - [ ] RAZORPAY_KEY_ID
  - [ ] RAZORPAY_KEY_SECRET
  - Get from: https://dashboard.razorpay.com

---

## 📝 Configuration Values to Set

### **Development Settings**
```
APP_ENV = development
DEBUG_MODE = false
LOG_LEVEL = INFO
ENVIRONMENT = development
```

### **Database**
```
DB_POOL_SIZE = 20
DB_MAX_OVERFLOW = 40
DB_POOL_TIMEOUT = 30
```

### **Authentication**
```
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30
```

### **Vector Database**
```
PINECONE_DIMENSION = 768
PINECONE_NAMESPACES = platform-rag,user-rag,memory
EMBEDDINGS_PROVIDER = gemini
```

### **Rate Limiting**
```
RATE_LIMIT_PER_MINUTE = 60
RATE_LIMIT_PER_HOUR = 1000
RATE_LIMIT_FREE_PER_DAY = 50
RATE_LIMIT_PRO_PER_DAY = 500
```

### **Gamification**
```
XP_CORRECT_ANSWER = 10
XP_TEST_COMPLETION = 50
XP_STREAK_BONUS = 5
XP_MISSION_COMPLETION = 100
XP_BOSS_BATTLE_WIN = 200
MAX_LEVEL = 100
```

### **Subscription Pricing (INR)**
```
PRICING_PRO_PRICE_INR = 299
PRICING_ENTERPRISE_PRICE_INR = 799
```

### **Feature Flags**
```
FEATURE_IMAGE_SOLVER_ENABLED = true
FEATURE_VOICE_CHAT_ENABLED = false
FEATURE_MULTIPLAYER_BATTLES_ENABLED = true
FEATURE_PARENT_REPORTS_ENABLED = true
FEATURE_BYOK_ENABLED = true
```

---

## 🎨 Frontend Theme Colors

Copy these into NEXT_PUBLIC environment variables:
```
COLOR_MAIN_LEARNING = #2a5cff    (Blue)
COLOR_TEST = #e8362a              (Red)
COLOR_GAME = #c9a84c              (Gold)
COLOR_WORKSPACE = #00c896         (Green)
COLOR_RESOURCES = #9b5de5         (Purple)
COLOR_CAREER = #1a1a2e            (Navy)
```

---

## 🔄 LLM Provider Fallback Chain Priority

The system will try in this order:
1. User's BYOK key (if provided)
2. GEMINI_API_KEY
3. GROQ_API_KEY
4. OPENROUTER_API_KEY
5. Error (no LLM available)

**Best practice:** Set GEMINI_API_KEY at minimum

---

## 🧪 Quick Test Commands

### **Backend Connection Tests**
```bash
# Test Supabase connection
python -c "from supabase import create_client; print('✅ Supabase OK')"

# Test Pinecone connection
python -c "from pinecone import Pinecone; print('✅ Pinecone OK')"

# Test LLM API
python -c "from google import generativeai; print('✅ Gemini OK')"
```

### **Frontend Connection Tests**
```bash
# Check if NEXT_PUBLIC variables are accessible
npm run dev  # Should see env vars loaded in console
```

---

## 📊 Environment Variables by Category

### **Security (Never log)**
- JWT_SECRET
- SECRET_KEY
- SUPABASE_SERVICE_ROLE_KEY
- All API keys ending in _KEY or _SECRET

### **Infrastructure**
- SUPABASE_URL
- DATABASE_URL
- PINECONE_INDEX_NAME
- UPSTASH_REDIS_REST_URL

### **Configuration**
- APP_ENV
- DEBUG_MODE
- LOG_LEVEL
- All RATE_LIMIT_* vars
- All PRICING_* vars

### **Toggles (Feature Flags)**
- All FEATURE_* vars
- All AGENTS_ENABLED vars

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Don't** put LLM keys in frontend (use backend proxy)
2. ❌ **Don't** commit real `.env.local` files
3. ❌ **Don't** use weak JWT secrets
4. ❌ **Don't** expose `SUPABASE_SERVICE_ROLE_KEY` in frontend
5. ❌ **Don't** mix production and development keys
6. ✅ **DO** use separate keys for dev/staging/production
7. ✅ **DO** rotate keys monthly
8. ✅ **DO** use secret manager in production
9. ✅ **DO** test all connections before deployment

---

## 📌 Setup Wizard

### **Step 1: Create Supabase Project** (5 min)
```bash
# Go to https://app.supabase.com
# Create new project → Copy credentials
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="eyJhbGc..."
```

### **Step 2: Get LLM API Key** (2 min)
```bash
# For Gemini (recommended for free tier):
# Visit https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIzaSy..."
```

### **Step 3: Create Pinecone Index** (5 min)
```bash
# Go to https://app.pinecone.io
# Create index: name="drona-ai-knowledge", dimension=768
PINECONE_API_KEY="pcsk_..."
PINECONE_INDEX_NAME="drona-ai-knowledge"
```

### **Step 4: Generate Secrets** (1 min)
```bash
# Terminal commands:
JWT_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
echo "JWT_SECRET=$JWT_SECRET"
echo "SECRET_KEY=$SECRET_KEY"
```

### **Step 5: Configure Backend** (5 min)
```bash
cd "drona-AI Backend"
cp .env.example .env.local
# Paste all values from steps 1-4
```

### **Step 6: Configure Frontend** (5 min)
```bash
cd "drona-AI Frontend"
cp .env.example .env.local
# Add SUPABASE_URL, SUPABASE_ANON_KEY, API_URL
```

### **Step 7: Test Connection** (5 min)
```bash
# Backend
cd "drona-AI Backend" && python -c "from app.core.db import database; print('✅ DB OK')"

# Frontend
cd "drona-AI Frontend" && npm run dev
# Check browser console for no errors
```

**Total time: ~30 minutes** ⏱️

---

## 🔒 Production Deployment Checklist

Before going live:
- [ ] Rotate all API keys
- [ ] Set `APP_ENV=production`
- [ ] Set `DEBUG_MODE=false`
- [ ] Use secret manager (not .env files)
- [ ] Enable monitoring (Sentry, PostHog)
- [ ] Set up rate limiting
- [ ] Enable CORS restrictions
- [ ] Use HTTPS only
- [ ] Test payment processing
- [ ] Backup database credentials
- [ ] Set up automated key rotation
- [ ] Monitor API quota usage

---

**Generated**: May 9, 2026  
**For Questions**: Refer to ENV_SETUP_GUIDE.md for detailed explanations
