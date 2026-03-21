# 🚀 Golf Charity Platform - Deployment Readiness Checklist

**Last Updated:** March 21, 2026  
**Status:** ⚠️ IN PROGRESS  
**Build Status:** ✅ Compiles Successfully

---

## 📋 DEPLOYMENT PHASES

### ✅ **PHASE 1: Security Hardening** (COMPLETED)
- [x] Remove hardcoded admin email → use `ADMIN_EMAIL` env var
- [x] Remove unsafe NEXTAUTH_SECRET default → fail-fast in production
- [x] Add `force-dynamic` to all user-specific API routes
- [x] Create `.env.example` with all required variables
- [x] Fix TypeScript configuration issues

### 🔴 **PHASE 2: Critical Blocking Issues** (MUST DO BEFORE VERCEL DEPLOYMENT)

#### Environment Setup
- [ ] **Set up Supabase project**
  - [ ] Create Supabase project at https://supabase.com
  - [ ] Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Get `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] Create `.env.local` file (see `.env.example`)

- [ ] **Initialize Supabase database schema**
  - [ ] Copy SQL from [lib/db/schema.ts](lib/db/schema.ts)
  - [ ] Run in Supabase SQL Editor to create all tables
  - [ ] Verify tables created: users, subscriptions, scores, draws, winners, charities, etc.

- [ ] **Set up Auth0/NextAuth secrets**
  - [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
  - [ ] Set `NEXTAUTH_URL` to your production domain
  - [ ] Set `ADMIN_EMAIL` to your admin account email

- [ ] **Configure Stripe integration**
  - [ ] Create Stripe account at https://stripe.com
  - [ ] Get `STRIPE_SECRET_KEY` from https://dashboard.stripe.com/apikeys
  - [ ] Get `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] Store keys in Vercel secrets (NOT in .env)

- [ ] **Configure Email service (Resend)**
  - [ ] Create account at https://resend.com
  - [ ] Get `RESEND_API_KEY`
  - [ ] Verify sender domain

- [ ] **Configure Vercel deployment**
  - [ ] Connect GitHub repo to Vercel project
  - [ ] Add all environment variables in Vercel Settings > Environment Variables
  - [ ] Ensure `NODE_ENV=production` is set
  - [ ] Set production domain in `NEXTAUTH_URL`

#### API Routes Status
- [ ] **Missing Stripe webhook handler** → Implement in `/api/webhooks/stripe`
  - Needs: `payment_intent.succeeded`, `customer.subscription.updated` handlers
  
- [ ] **Missing email service implementation** → Use Resend in API routes
  - [ ] Password reset emails
  - [ ] Email verification
  - [ ] Winner notifications
  - [ ] Admin notifications

- [ ] **Missing draw system logic**
  - [ ] Draw simulation algorithm
  - [ ] Random winner selection
  - [ ] Prize pool calculation
  - [ ] Draw publication workflow

- [ ] **Admin dashboard functionality**
  - [ ] User management endpoints
  - [ ] Draw management endpoints
  - [ ] Analytics/stats endpoints
  - [ ] Winner verification interface

#### Middleware & Auth
- [ ] **Enhance middleware JWT validation**
  - [ ] Verify JWT signature (not just existence)
  - [ ] Check token expiration
  - [ ] Validate admin status server-side
  - [ ] Redirect expired tokens to login

- [ ] **Add rate limiting**
  - [ ] Install `rate-limit-next` or similar
  - [ ] Apply to `/api/auth/*` endpoints
  - [ ] Apply to scoring endpoints
  - [ ] Set reasonable limits (10 req/min for auth, 100/min for scores)

### 🟡 **PHASE 3: High Priority (Before Launch)**

Security & Headers
- [ ] Add security headers middleware
  - [ ] HSTS (Strict-Transport-Security)
  - [ ] CSP (Content-Security-Policy)
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options

API Validation
- [ ] Type verification for all request/response payloads
- [ ] Consistent error response format across all endpoints
- [ ] Input sanitization for user-generated content

Database
- [ ] Create indexes for frequently queried fields
- [ ] Set up database backups in Supabase
- [ ] Enable row-level security (RLS) policies

Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, or similar)
- [ ] Configure application logging
- [ ] Create monitoring dashboard

### 🟢 **PHASE 4: Medium Priority (Post-Launch)**

Feature Completion
- [ ] Implement file upload for proof images (Supabase Storage)
- [ ] Create subscription management portal
- [ ] Implement GDPR data export & deletion
- [ ] Payment retry logic for failed transactions
- [ ] Draw cancellation workflow

Performance
- [ ] Database query optimization
- [ ] Image optimization and CDN setup
- [ ] API response caching strategy
- [ ] Bundle size analysis and optimization

User Experience  
- [ ] 404 and error pages
- [ ] Email template styling
- [ ] Mobile responsiveness testing
- [ ] Accessibility (a11y) audit

---

## 📋 REQUIRED ENVIRONMENT VARIABLES

### Production (Vercel)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Auth
NEXTAUTH_SECRET=<generate-with-openssl>
NEXTAUTH_URL=https://your-domain.vercel.app
ADMIN_EMAIL=admin@yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email
RESEND_API_KEY=re_...

# Environment
NODE_ENV=production
```

### Local Development (.env.local)
```env
# Use same structure as above with test credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@golfcharity.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_test_...
NODE_ENV=development
```

---

## 🔍 PRE-DEPLOYMENT VERIFICATION CHECKLIST

### Before Pushing to Vercel
- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes (if configured)
- [ ] All environment variables documented
- [ ] Database schema initialized
- [ ] Test authentication flow locally
- [ ] Test scoring endpoint locally
- [ ] Verify middleware auth checks work

### After Vercel Deployment
- [ ] Deployment completes successfully
- [ ] Check Vercel build logs for warnings
- [ ] Test login flow on production
- [ ] Test API endpoints respond correctly
- [ ] Check middleware routes requests correctly
- [ ] Verify environment variables are set
- [ ] Test stripe/payment flow
- [ ] Monitor error logs in Sentry/LogRocket

---

## 📊 API ROUTES IMPLEMENTATION STATUS

| Route | Status | Notes |
|-------|--------|-------|
| POST `/api/auth/login` | ✅ Complete | Auth implemented |
| POST `/api/auth/signup` | ✅ Complete | User creation + subscription |
| GET `/api/charities` | ✅ Complete | Lists active charities |
| GET `/api/draws` | ✅ Complete | Draw listing |
| GET `/api/scores` | ✅ Complete | User scores |
| POST `/api/scores` | ✅ Complete | Add score (keep last 5) |
| PUT `/api/scores/[id]` | ✅ Complete | Update score |
| GET `/api/subscriptions/current` | ✅ Complete | Active subscription |
| GET `/api/users/[userId]` | ✅ Complete | User profile |
| GET `/api/winners` | ✅ Complete | Winners list |
| POST `/api/winners/[id]/verify` | ✅ Complete | Admin verification |
| POST `/api/webhooks/stripe` | ❌ Missing | Payment webhooks |
| GET `/api/admin/users` | ❌ Missing | User management |
| GET `/api/admin/draws/stats` | ❌ Missing | Analytics |
| POST `/api/draws/[id]/simulate` | ❌ Missing | Draw simulation |
| POST `/api/draws/[id]/publish` | ❌ Missing | Publish draw results |
| DELETE `/api/scores/[id]` | ⚠️ Partial | Check implementation |

---

## 🔐 SECURITY CHECKLIST

- [x] Admin email environment-based (not hardcoded)
- [x] NEXTAUTH_SECRET enforced in production
- [x] No default secrets in code
- [ ] JWT expiration validated
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection enabled
- [ ] SQL injection protection verified
- [ ] XSS prevention in templates
- [ ] CORS properly configured
- [ ] Security headers set

---

## 📞 SUPPORT & RESOURCES

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Stripe Integration:** https://stripe.com/docs/stripe-js
- **Resend Email:** https://resend.com/docs
- **NextAuth.js:** https://next-auth.js.org

---

## ⏱️ TIMELINE ESTIMATE

- **Phase 1 (Security):** ✅ 2 days (DONE)
- **Phase 2 (Critical):** 5-7 days
  - Supabase setup: 1 day
  - Environment config: 1 day
  - Stripe integration: 2-3 days
  - Remaining APIs: 1-2 days
- **Phase 3 (High Priority):** 5-7 days
- **Phase 4 (Medium Priority):** Ongoing post-launch

**Total Estimated Time to Production:** 2-3 weeks

---

## 📝 NOTES

- Database schema must be initialized manually via Supabase SQL editor
- Environment variables must be set in Vercel project settings (not hardcoded)
- Test Stripe webhook delivery with Stripe CLI before production
- Set up monitoring/error tracking before launch
- Plan post-launch tasks (file uploads, GDPR, advanced features)

---

**Last Updated:** March 21, 2026  
**Next Review:** Before pushing to production
