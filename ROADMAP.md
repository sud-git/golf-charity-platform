# Development Roadmap & Checklist

## 🎯 Project Status: Phase 1 Complete ✅

Bootstrap phase is **100% complete**. All foundational files created and ready for development.

---

## 📦 Phase 2: API Routes (Next Priority)

### Scores API (`/api/scores/`)
- [ ] `POST /api/scores/route.ts` - Create new score
  - Validates score (1-45 range)
  - Handles rolling 5-score window
  - Returns updated score list
- [ ] `GET /api/scores/route.ts` - Fetch user's scores
  - Returns last 5 scores (ordered by date DESC)
  - Includes calculated average
- [ ] `PUT /api/scores/[id]/route.ts` - Update score
- [ ] `DELETE /api/scores/[id]/route.ts` - Delete score

### Draws API (`/api/draws/`)
- [ ] `GET /api/draws/route.ts` - Fetch all draws
  - Filters by status (pending/published/completed)
- [ ] `POST /api/draws/route.ts` - Create draw (admin only)
  - Sets draw month, mode, status
  - Initialize random_numbers array
- [ ] `POST /api/draws/[id]/simulate/route.ts` - Simulate draw
  - Run algorithm (random or weighted)
  - Calculate prize pools
  - Don't publish yet
- [ ] `POST /api/draws/[id]/publish/route.ts` - Publish draw
  - Mark as published
  - Notify winners
  - Create winner records

### Winners API (`/api/winners/`)
- [ ] `GET /api/winners/route.ts` - Fetch winners
  - User: get own wins
  - Admin: get unverified wins
- [ ] `POST /api/winners/[id]/upload-proof/route.ts` - Submit verification
  - Accept screenshot upload
  - Store in Supabase Storage
  - Update status to 'pending_review'
- [ ] `POST /api/winners/[id]/verify/route.ts` - Approve/reject (admin)
  - Verify screenshot legitimacy
  - Create Stripe payout if approved
  - Send notification
- [ ] `POST /api/winners/[id]/payout/route.ts` - Process payment
  - Calculate final amount
  - Create Stripe transfer
  - Update status

### Users API (`/api/users/`)
- [ ] `GET /api/users/[userId]/route.ts` - Fetch user profile
  - Returns user data + subscription status
- [ ] `PUT /api/users/[userId]/route.ts` - Update profile
  - Update personal info
  - Change charity selection
  - Update contribution percentage
- [ ] `GET /api/users/[userId]/stats/route.ts` - Fetch user statistics
  - Total scores entered
  - Average score
  - Total winnings
  - Charity contributions total

### Subscriptions API (`/api/subscriptions/`)
- [ ] `GET /api/subscriptions/current/route.ts` - Fetch active subscription
- [ ] `POST /api/subscriptions/upgrade-plan/route.ts` - Change plan
  - Switch monthly ↔ yearly
  - Pro-rata billing logic
- [ ] `POST /api/subscriptions/update-payment/route.ts` - Update payment method
- [ ] `POST /api/subscriptions/cancel/route.ts` - Cancel subscription
  - Mark as 'cancelled'
  - Set cancellation date
  - Prevent future charges

### Admin API (`/api/admin/`)
- [ ] `GET /api/admin/users/route.ts` - List all users (paginated)
- [ ] `POST /api/admin/users/[userId]/suspend/route.ts` - Suspend user
- [ ] `GET /api/admin/draws/stats/route.ts` - Draw statistics
- [ ] `GET /api/admin/revenue/route.ts` - Revenue dashboard
- [ ] `GET /api/admin/charities/report/route.ts` - Charity contributions report

### Webhooks (`/api/webhooks/`)
- [ ] `POST /api/webhooks/stripe/route.ts` - Stripe events
  - Handle `payment_intent.succeeded`
  - Handle `customer.subscription.updated`
  - Handle `customer.subscription.deleted`
  - Send email notifications

---

## 📱 Phase 3: Dashboard Pages

### User Dashboard (`/app/dashboard/`)
- [ ] `/scores/page.tsx` - Score management
  - Table of last 5 scores
  - Add score form (with validation)
  - Edit/delete buttons
  - Average score display
  - Quick stats cards
- [ ] `/draws/page.tsx` - Draw information
  - Current month draw details
  - Your participation status
  - Past draw results
  - Prediction/algorithm explanation
- [ ] `/winnings/page.tsx` - Prize tracking
  - Verified wins + amounts
  - Pending verification wins
  - Historical winnings (table)
  - Total winnings card
  - Payout status
- [ ] `/charities/page.tsx` - Charity management
  - Directory of all charities
  - Your current selection highlight
  - Monthly contribution preview
  - Impact statistics per charity
  - Modal to change selection
- [ ] `/profile/page.tsx` - Account settings
  - Personal information form
  - Email change
  - Password change
  - Delete account option
  - Activity log
- [ ] `/subscription/page.tsx` - Plan management
  - Current plan display
  - Monthly/yearly toggle
  - Upgrade/downgrade options
  - Billing history table
  - Payment method management
  - Cancel subscription button

### Components for Dashboard (`/components/dashboard/`)
- [ ] `ScoreCard.tsx` - Individual score card component
- [ ] `ScoreForm.tsx` - Add/edit score form
- [ ] `ScoreTable.tsx` - Score history table
- [ ] `DrawWidget.tsx` - Current draw info widget
- [ ] `WinnerCard.tsx` - Winner status card
- [ ] `ProofUpload.tsx` - Screenshot upload component
- [ ] `CharitySelector.tsx` - Charity selection modal
- [ ] `SubscriptionCard.tsx` - Plan selector
- [ ] `StatCard.tsx` - Metric card component
- [ ] `Charts.tsx` - Score/winnings charts (using Recharts)

---

## 🔐 Phase 4: Admin Panel

### Admin Dashboard (`/app/(admin)/`)
- [ ] `/page.tsx` - Admin overview
  - KPI cards (users, revenue, wins, payouts due)
  - Revenue chart
  - User growth chart
  - Top charities
  - Recent activity log
- [ ] `/users/page.tsx` - User management
  - Sortable/filterable user table
  - Search by email/name
  - Status badges (active, suspended, cancelled)
  - Bulk actions
  - View user details button
  - Suspend/unsuspend user
- [ ] `/draws/page.tsx` - Draw management
  - Draw configuration form
  - Past draws list with details
  - Simulate button
  - Preview results before publish
  - Publish button
  - Manual winner input (edge cases)
- [ ] `/winners/page.tsx` - Verification queue
  - Table of pending wins
  - Proof image viewer
  - Approve/reject buttons
  - Rejection reason input
  - Payment status tracking
  - Bulk verification
- [ ] `/charities/page.tsx` - Charity management
  - Charity CRUD forms
  - Logo upload
  - Featured toggle
  - Deactivate/activate
  - Raised amount tracking
  - User count per charity
- [ ] `/analytics/page.tsx` - Reports & insights
  - Revenue by plan (pie chart)
  - Charity distribution (pie chart)
  - User retention rate
  - Score submission rate
  - Win distribution by match type
  - Average winnings per user
  - Export data buttons

### Components for Admin (`/components/admin/`)
- [ ] `UserTable.tsx` - User management table
- [ ] `DrawConfigForm.tsx` - Draw setup form
- [ ] `VerificationQueue.tsx` - Pending wins list
- [ ] `ProofViewer.tsx` - Image viewer modal
- [ ] `CharityForm.tsx` - Charity CRUD form
- [ ] `RevenueChart.tsx` - Revenue visualization
- [ ] `StatsDashboard.tsx` - KPI cards
- [ ] `ActivityLog.tsx` - Action audit log

---

## 🎲 Phase 5: Business Logic & Algorithms

### Draw Engine (`/lib/draws/engine.ts`)
- [ ] `simulateRandomDraw(pool, drawCount)` - Lottery mode
  - Generate random numbers
  - Match against player scores
  - Assign prizes
  - Calculate rollovers
- [ ] `simulateAlgorithmicDraw(pool, scores)` - Weighted mode
  - Weight players by submission frequency
  - Frequency-biased selection
  - Match calculation
  - Prize assignment

### Score Processing (`/lib/scores/processor.ts`)
- [ ] `addScore(userId, score)`
  - Validate score (1-45)
  - Get user's last 5 scores
  - Insert new score
  - Auto-remove oldest if >5
  - Return updated list
- [ ] `calculateRollingAverage(scores)` - 5-score average

### Prize Calculation (`/lib/prizes/calculator.ts`)
- [ ] `calculatePrizeDistribution(pool, winners)` - Distribute by match type
  - 5-match: 40%
  - 4-match: 35%
  - 3-match: 25%
  - Handle rollovers
- [ ] `calculatePayoutAmount(userId, prizeAmount)` - Deduct charity %
  - Apply user's charity contribution %
  - Calculate net payout
  - Track charity contribution

### Charity Tracking (`/lib/charities/tracker.ts`)
- [ ] `recordCharityContribution(userId, amount, charityId)`
  - Track monthly contributions
  - Update charity totals
  - Send impact notification
- [ ] `calculateCharityImpact(charityId)` - Annual impact stats

### Email Notifications (`/lib/services/email.ts`)
- [ ] `sendWelcomeEmail(user)` - New signup
- [ ] `sendWinnerNotification(winner, amount)` - Draw winner
- [ ] `sendCharityReport(user, amount)` - Monthly impact summary
- [ ] `sendVerificationResult(winner, approved)` - Proof decision
- [ ] `sendPayoutConfirmation(winner, amount)` - Payment sent
- [ ] `sendSubscriptionReceipt(subscription)` - Invoice/receipt

---

## 🔌 Phase 6: Third-Party Integrations

### Stripe Integration (`/lib/services/stripe.ts`)
- [ ] `createCustomer(user)` - Create Stripe customer
- [ ] `createSubscription(customer, plan)` - Setup recurring billing
- [ ] `processPayment(amount, customerId)` - One-time payout
- [ ] `updatePaymentMethod(customer, token)` - Update card
- [ ] `cancelSubscription(subscription)` - End recurring
- [ ] `validateWebhook(signature, body)` - Verify webhook authentic

### Email Service (`/lib/services/email.ts`)
- [ ] `sendEmail(to, template, data)` - Generic sender
- [ ] Email templates:
  - Welcome email
  - Win notification
  - Payment receipt
  - Charity impact report
  - Password reset
  - Account verification
  - Suspension notice

### File Upload (`/lib/services/storage.ts`)
- [ ] `uploadProofImage(userId, file)` - Supabase Storage
  - Validate image format
  - Generate unique filename
  - Store in `/proofs/{userId}/`
  - Return public URL
- [ ] `deleteProofImage(userId, filename)` - Clean up storage
- [ ] `getSignedUrl(filename)` - Private image access

---

## 🧪 Phase 7: Testing

### Unit Tests (`/__tests__/unit/`)
- [ ] `lib/utils/helpers.test.ts`
- [ ] `lib/draws/engine.test.ts`
- [ ] `lib/prizes/calculator.test.ts`
- [ ] `lib/utils/validators.test.ts`

### Integration Tests (`/__tests__/integration/`)
- [ ] Authentication flow (signup→login→dashboard)
- [ ] Score submission (add→edit→delete)
- [ ] Draw simulation & publication
- [ ] Winner verification & payout
- [ ] Subscription change & cancellation

### E2E Tests (`/__tests__/e2e/`)
- [ ] Complete user journey
- [ ] Admin draw management
- [ ] Payment processing
- [ ] Email notifications

---

## 🚀 Phase 8: Deployment & Production

### Pre-Launch Checklist
- [ ] All API endpoints tested
- [ ] Database schema migrated to Supabase
- [ ] Stripe webhooks configured
- [ ] Resend API email verified
- [ ] Environment variables set in Vercel
- [ ] Storage bucket created in Supabase
- [ ] Charity seed data loaded
- [ ] Admin account created
- [ ] Analytics tracking setup (Google Analytics)

### Vercel Deployment
- [ ] Connect GitHub repository
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure custom domain
- [ ] Enable automatic deployments
- [ ] Setup monitoring/alerts

### Database Seeding
- [ ] Run schema SQL in Supabase
- [ ] Seed 10-15 charities
- [ ] Create test admin account
- [ ] Initialize draw calendar
- [ ] Setup RLS policies

### Launch Tasks
- [ ] Create landing page marketing copy
- [ ] Setup email domain verification
- [ ] Configure analytics dashboard
- [ ] Create support/feedback form
- [ ] Setup monitoring (error tracking, logs)
- [ ] Create user onboarding guide

---

## ⏱️ Time Estimates

| Phase | Tasks | Est. Hours | Status |
|-------|-------|-----------|--------|
| 1: Bootstrap | Config, Types, Components, Pages | 4-5 | ✅ **DONE** |
| 2: API Routes | 20+ endpoints | 12-16 | ⏳ Next |
| 3: Dashboard Pages | 6 pages + 10 components | 10-12 | ⏳ After Phase 2 |
| 4: Admin Panel | 6 pages + 8 components | 10-12 | ⏳ After Phase 3 |
| 5: Business Logic | Draw engine, calculations, email | 8-10 | ⏳ Parallel with Phase 3 |
| 6: Integrations | Stripe, Resend, Supabase Storage | 6-8 | ⏳ During Phase 5 |
| 7: Testing | Unit, Integration, E2E tests | 8-10 | ⏳ Final phase |
| 8: Deployment | Vercel, Supabase, Launch | 4-6 | ⏳ Final |
| **TOTAL** | **59 Complete Features** | **60-70 hours** | 🚀 |

---

## 🎯 Quick Reference: What's Done

✅ **Completed:**
- Project structure & configuration
- TypeScript types & database schema
- Authentication system (login/signup/JWT)
- Landing page with pricing & features
- Protected dashboard layout
- 4 API routes (auth + charities)
- Global styling system
- Shared components (Navbar, Footer)

⏳ **In Queue:**
- 20+ API endpoints
- 11+ dashboard/admin pages
- 18+ reusable components
- Draw engine & algorithms
- Stripe & email integration
- Testing suite
- Production deployment

---

## 🚦 How to Proceed

**Option 1: API Routes First** (Recommended)
- Build all endpoints simultaneously
- Dashboard pages depend on these
- Estimated: 12-16 hours
- Command: Ask for "Build Phase 2 API routes"

**Option 2: Dashboard Pages First**
- Mock API responses initially
- Build UI in parallel with real APIs
- Estimated: 10-12 hours
- Command: Ask for "Build Phase 3 dashboard pages"

**Option 3: Specific Feature**
- Implement single feature end-to-end
- Verify working before next
- Command: Ask for "Build score management feature"

---

**Ready for Phase 2?** Let me know which approach you prefer! 🎯
