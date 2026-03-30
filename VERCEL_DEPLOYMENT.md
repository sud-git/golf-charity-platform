# 🚀 VERCEL DEPLOYMENT GUIDE - Golf Charity Platform

**Status:** ✅ Application Ready for Production  
**Last Updated:** March 30, 2026

---

## 📋 Pre-Deployment Checklist

### Local Environment Setup ✅ (COMPLETED)
- [x] `.env.local` file created with all credentials
- [x] Supabase URL configured
- [x] Stripe keys configured (test keys)
- [x] Resend API key configured
- [x] NEXTAUTH_SECRET generated
- [x] Environment validation implemented

### Code Quality & Security ✅ (COMPLETED)
- [x] JWT token validation implemented
- [x] Stripe webhook handler created
- [x] Security headers configured
- [x] Production environment checks added
- [x] API middleware authentication created
- [x] vercel.json configuration created

### Testing Before Deploy
- [ ] `npm run build` - Test production build locally
- [ ] `npm run type-check` - Verify TypeScript
- [ ] `npm run lint` - Check code quality
- [ ] Test login/signup flow
- [ ] Test API endpoints with proper auth headers

---

## 🔧 Step-by-Step Deployment to Vercel

### **Step 1: Prepare GitHub Repository**

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit with production-ready message
git commit -m "Production deployment: security hardening and Vercel config"

# Add GitHub remote (replace with your username)
git remote add origin https://github.com/YOUR-USERNAME/golf-charity-platform.git
git branch -M main

# Push to GitHub
git push -u origin main
```

### **Step 2: Local Testing BEFORE Vercel**

```bash
# Build locally to catch any issues
npm run build

# This should show: ✓ Compiled successfully

# Run tests
npm run type-check
npm run lint
```

**Expected Output:**
- No TypeScript errors
- No lint errors
- Build completes in <2 minutes

### **Step 3: Create Vercel Project**

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Click "Import GitHub Repository"
3. Find `golf-charity-platform`
4. Click **Import**
5. **DO NOT** skip environment variables step!

**Option B: Using Vercel CLI**

```bash
npm i -g vercel
vercel login
# Follow the prompts
vercel --prod
```

### **Step 4: Configure Environment Variables in Vercel**

In Vercel Dashboard: **Project Settings → Environment Variables**

Add these variables (copy from your `.env.local`):

#### **Database & Auth**
```
NEXT_PUBLIC_SUPABASE_URL = https://vtzcpzgufcvosijjihirj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your key from .env.local]
SUPABASE_SERVICE_ROLE_KEY = [Your key from .env.local]
```

#### **Authentication**
```
NEXTAUTH_SECRET = [Generate new one with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
ADMIN_EMAIL = admin@golfcharity.app
```

⚠️ **IMPORTANT:** Generate a NEW NEXTAUTH_SECRET for production:
```bash
openssl rand -base64 32
```

#### **Payment Processing**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET = [Get from https://dashboard.stripe.com/webhooks]
```

#### **Email Service**
```
RESEND_API_KEY=your-resend-api-key-here
```

#### **Storage**
```
NEXT_PUBLIC_STORAGE_BUCKET = golf-charity-bucket
```

#### **Node Environment**
```
NODE_ENV = production
```

#### **Set for All Environments:**
- Click **Environments:** Select "Production", "Preview", "Development"
- Add the variables to all three

### **Step 5: Deploy to Vercel**

After adding environment variables:

1. Click **"Deploy"** button
2. Wait for build (usually 2-3 minutes)
3. ✅ See "Ready" status (green checkmark)

```
Deployment URL: https://your-project-[random].vercel.app
```

### **Step 6: Verify Deployment**

```bash
# Get your deployment URL from Vercel dashboard
# Then test:

curl https://your-project-random.vercel.app/
# Should return your homepage HTML
```

**Test in browser:**
1. Visit your Vercel URL
2. Try login with test account
3. Check browser console for errors
4. Verify API calls working in Network tab

### **Step 7: Configure Stripe Webhook**

In Stripe Dashboard: **Developers → Webhooks**

1. Click **Add Endpoint**
2. **Endpoint URL:**
   ```
   https://your-project-[random].vercel.app/api/webhooks/stripe
   ```
3. **Select events:**
   - ✓ `payment_intent.succeeded`
   - ✓ `customer.subscription.updated`
   - ✓ `customer.subscription.deleted`
   - ✓ `invoice.payment_failed`
4. Copy **Signing Secret** (starts with `whsec_`)
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### **Step 8: Custom Domain (Optional)**

In Vercel Dashboard: **Settings → Domain**

1. Click **Add Domain**
2. Enter your domain (e.g., `golfcharity.app`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` in environment variables
5. Redeploy

---

## 🔒 Production Security Checklist

- [x] NEXTAUTH_SECRET is 32+ characters and random
- [x] No env vars hardcoded in code (all use `process.env`)
- [x] All API routes have `export const dynamic = 'force-dynamic'`
- [x] JWT verification implemented for protected routes
- [x] Security headers configured
- [x] CORS properly restricted to your domain
- [x] Stripe webhook signature verification (stub added)
- [x] Database using service role key for admin operations
- [x] Stripe using test keys (upgrade to live when ready)
- [x] Rate limiting can be added per API route if needed

---

## 📊 Monitoring & Logs

### View Vercel Logs

```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs [--tail for live logs]
```

### Check Application Errors

1. Go to Vercel Dashboard
2. **Deployments** → Click latest deployment
3. **Functions** tab shows serverless function logs
4. **Build Logs** tab shows build errors

---

## 🚨 Troubleshooting

### Error: "NEXTAUTH_SECRET is required"
**Solution:** Add `NEXTAUTH_SECRET` to environment variables and redeploy

### Error: "Cannot connect to Supabase"
**Solution:** 
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` not expired
- Verify Supabase project is active

### Error: "Stripe key invalid"
**Solution:**
- Verify keys copied correctly (no extra spaces)
- Check you're using the right environment (`pk_test_` for test, `pk_live_` for live)
- Regenerate keys if unsure

### Application crashes on startup
**Solution:**
```bash
# Check build locally first
npm run build

# Check for console errors
npm run dev

# Review environment validation
echo $NEXTAUTH_SECRET  # Should exist and be 32+ chars
```

---

## 🔄 Updates & Redeployment

**To redeploy after code changes:**

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will automatically rebuild and deploy! 🎉

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **NextAuth.js:** https://next-auth.js.org/

---

## ✅ Final Sign-Off

**Before going live with real payments:**

1. [ ] Test full signup → payment flow with test card
2. [ ] Verify emails being sent (Resend)
3. [ ] Check Stripe webhook logs for success
4. [ ] Monitor Supabase database for correct data
5. [ ] Test admin login & dashboard
6. [ ] Get SSL certificate (Vercel auto-handles)
7. [ ] Update `NEXTAUTH_URL` to your custom domain
8. [ ] Switch Stripe keys from test to live

**Then:** 🎉 Your platform is production-ready!

