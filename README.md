# Golf Charity Platform

> A modern, subscription-based platform that seamlessly integrates golf score tracking with charitable fundraising and prize draws. Designed for golf enthusiasts who want to engage with their community while supporting meaningful causes.

## Overview

Golf Charity Platform is a full-stack, production-grade web application built with cutting-edge technology. It provides a complete ecosystem for golf enthusiasts to track their scores, participate in monthly prize draws, and directly contribute to charitable organizations of their choice.

The platform combines competitive gameplay mechanics with social impact, enabling users to enjoy golf while making a measurable difference in their community.

## Key Features

- **Secure Authentication System** — JWT-based authentication with 15-minute access tokens and 7-day refresh tokens
- **Score Management** — Intelligent score tracking with automatic 5-score rolling window and real-time average calculations
- **Monthly Draw System** — Participate in algorithmic and randomized monthly prize draws with transparent verification
- **Charitable Giving** — Flexible contribution settings (10-100%) directed to charities of your choice
- **Winner Verification** — Comprehensive verification system for draw winners with audit trails
- **User Dashboard** — Intuitive interface for score history, winnings tracking, and charity selection
- **Admin Portal** — Powerful admin dashboard for user management, draw administration, and compliance
- **Responsive UI** — Mobile-first design optimized for desktop, tablet, and smartphone devices
- **Enterprise Security** — Type-safe implementation with full TypeScript support and secure password hashing

## Getting Started

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher  
- **Supabase**: Active PostgreSQL project
- **Git**: For version control

### Installation & Setup

#### 1. Clone Repository

```bash
git clone https://github.com/sud-git/golf-charity-platform.git
cd golf-charity-platform
```

#### 2. Install Dependencies

```bash
npm install
```

Verify installation:
```bash
npm run
# Should display all available npm scripts
```

#### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
ADMIN_EMAIL=admin@golfcharity.app

# Payment Processing (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Email Service (Optional)
RESEND_API_KEY=re_xxxxx
```

**Security Note**: Never commit `.env.local` to version control. This file is included in `.gitignore`.

#### 4. Initialize Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project credentials to `.env.local`
3. Execute the database schema in Supabase SQL Editor:
   - Open `lib/db/schema.ts` 
   - Copy the SQL contents
   - Paste into Supabase SQL Editor and execute

This creates all required tables:
- `users` — User accounts and authentication
- `subscriptions` — Subscription plans and billing
- `scores` — Golf score history
- `draws` — Monthly draw configurations
- `winners` — Draw results and prize tracking
- `charities` — Charity directory and metadata

#### 5. Launch Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

Default credentials for testing:
- **Admin Account**: Use email `admin@golfcharity.app` during signup
- **Regular Account**: Use any email with password

## Architecture & Project Structure

### Directory Organization

```
golf-charity-platform/
│
├── app/
│   ├── (auth)/                    # Authentication Pages & Routes
│   │   ├── login/page.tsx         # User login interface
│   │   ├── signup/page.tsx        # User registration interface
│   │   └── reset-password/page.tsx# Password recovery flow
│   │
│   ├── (dashboard)/               # Protected User Dashboard (requires auth)
│   │   ├── layout.tsx             # Dashboard layout wrapper
│   │   ├── scores/page.tsx        # Score tracking and management
│   │   ├── draws/page.tsx         # Draw participation and history
│   │   ├── winnings/page.tsx      # Prize and winnings tracking
│   │   ├── charities/page.tsx     # Charity selection and management
│   │   ├── profile/page.tsx       # User profile and account settings
│   │   └── subscription/page.tsx  # Subscription details and management
│   │
│   ├── (admin)/                   # Admin Portal (requires admin flag)
│   │   ├── layout.tsx             # Admin layout and navigation
│   │   └── dashboard/page.tsx     # Admin overview and analytics
│   │
│   ├── api/                       # Backend API Routes (REST endpoints)
│   │   ├── auth/
│   │   │   ├── login/route.ts     # POST: User authentication
│   │   │   └── signup/route.ts    # POST: User registration
│   │   ├── scores/
│   │   │   ├── route.ts           # GET: Fetch scores | POST: Add score
│   │   │   └── [id]/route.ts      # PUT/DELETE: Update/Delete score
│   │   ├── draws/route.ts         # GET: Fetch draws | POST: Create draw (admin)
│   │   ├── users/[userId]/route.ts# GET/PUT: User data management
│   │   ├── subscriptions/current/route.ts  # GET: Current subscription details
│   │   ├── winners/route.ts       # GET: Fetch winners | POST: Create winner
│   │   ├── winners/[id]/verify/route.ts   # POST: Winner verification (admin)
│   │   └── charities/route.ts     # GET: Available charities
│   │
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Landing page
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Login form component
│   │   └── SignupForm.tsx         # Signup form component
│   ├── dashboard/
│   │   ├── ScoreForm.tsx          # Score input form
│   │   ├── ScoresList.tsx         # Score history display
│   │   └── StatCard.tsx           # Metric display component
│   ├── shared/
│   │   ├── Navbar.tsx             # Navigation bar
│   │   └── Footer.tsx             # Footer component
│   └── ...                        # Additional components
│
├── lib/
│   ├── auth/
│   │   └── token.ts               # JWT creation, verification, password hashing
│   ├── db/
│   │   ├── schema.ts              # Database schema definitions
│   │   ├── client.ts              # Supabase client initialization
│   │   └── ...                    # Database utilities
│   └── utils/
│       ├── api-response.ts        # Standard API response builders
│       ├── fetch-client.ts        # Authenticated HTTP client
│       ├── validators.ts          # Zod validation schemas
│       └── helpers.ts             # Utility functions
│
├── types/
│   └── index.ts                   # TypeScript type definitions
│
├── styles/
│   └── globals.css                # Global CSS and Tailwind directives
│
├── middleware.ts                  # Route protection middleware
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── .env.local                     # Environment variables (not in git)
├── .env.local.example             # Example environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # Dependency lock file
└── README.md                      # This file
```

### Technology Stack

**Frontend Framework**
- Next.js 14.2.35 (React App Router)
- React 18.2+ with Server & Client Components
- TypeScript 5.x for type safety

**Styling & UI**
- Tailwind CSS 3.3+ for utility-first styling
- Responsive design patterns
- Custom component library

**Form Management & Validation**
- React Hook Form for performance optimization
- Zod for schema validation and type inference
- Real-time error handling

**State Management**
- React Context for application state
- localStorage for client-side persistence
- Zustand (prepared for complex scenarios)

**Backend & Database**
- Next.js API Routes (serverless)
- Supabase PostgreSQL for data persistence
- JWT authentication with jose library

**Security**
- bcryptjs for password hashing
- JWT tokens for session management
- Middleware-based route protection

**Development Tools**
- ESLint for code quality
- Prettier for code formatting
- TypeScript for compile-time type checking

## Authentication & Authorization

### JWT Implementation

Golf Charity Platform implements industry-standard JWT (JSON Web Token) authentication:

**Access Token**
- Duration: 15 minutes
- Purpose: Primary authentication credential
- Scope: User API requests

**Refresh Token**
- Duration: 7 days
- Purpose: Token renewal without re-authentication
- Scope: Obtaining new access tokens

**Token Generation Process**
```typescript
1. User submits email and password
2. Password verified against bcryptjs hash
3. Access token created with user claims (userId, email, isAdmin)
4. Refresh token created for future token renewal
5. Both tokens returned to client
6. Client stores tokens in localStorage
```

**Admin Identification**
Users are identified as administrators when their email matches the configured `ADMIN_EMAIL` environment variable (default: `admin@golfcharity.app`). This flag is included in the JWT payload and used throughout the application for access control.

### Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds (industry standard)
- **Token Signing**: HS256 algorithm with rotating secrets
- **Route Protection**: Middleware validates JWT on protected routes
- **Request Headers**: `x-user-id` and `x-is-admin` headers authenticate API requests
- **Session Management**: Automatic token refresh mechanism

## Database Schema

Golf Charity Platform uses PostgreSQL via Supabase for reliable, scalable data persistence.

### Core Tables

**users**
- Stores user account information and authentication credentials
- Fields: id, email, password_hash, first_name, last_name, created_at, updated_at
- Primary Key: id (UUID)
- Unique Index: email

**subscriptions**
- Manages user subscription plans and billing details
- Fields: id, user_id, plan_type, amount_cents, status, renewal_date, created_at
- Foreign Key: user_id → users.id
- Status Values: active, canceled, expired, paused

**scores**
- Tracks individual golf scores with timestamps
- Fields: id, user_id, score_value, created_at
- Score Range: 1-45 (Stableford format)
- Automatic Behavior: Maintains rolling 5-score window (oldest removed upon adding 6th score)

**draws**
- Defines monthly and ad-hoc prize draw configurations
- Fields: id, month, status, mode, pool_amount, created_at, updated_at
- Mode Options: random, algorithmic (score-weighted)
- Status Values: draft, pending, completed, cancelled

**winners**
- Records draw results and prize distributions
- Fields: id, draw_id, user_id, prize_amount, verification_status, created_at
- Foreign Keys: draw_id → draws.id, user_id → users.id
- Verification Status: pending, verified, rejected

**charities**
- Maintains directory of supported charitable organizations
- Fields: id, name, description, website_url, logo_url, impact_metrics, created_at
- Impact Metrics: recipients_helped, funds_raised, projects_completed

**charity_contributions**
- Maps user charity preferences and donation percentages
- Fields: id, user_id, charity_id, contribution_percent, created_at
- Contribution Range: 10-100%
- Foreign Keys: user_id → users.id, charity_id → charities.id

Complete schema with constraints and indexes available in [lib/db/schema.ts](lib/db/schema.ts)

## REST API Reference

All API endpoints follow RESTful conventions and return standardized JSON responses with the following structure:

```json
{
  "success": boolean,
  "data": {} or null,
  "error": string or null,
  "statusCode": number
}
```

**Request Authentication**: Include user ID and admin status via headers:
```
x-user-id: [USER_ID_UUID]
x-is-admin: [true|false]
Authorization: Bearer [JWT_TOKEN]
```

### Authentication Endpoints

**POST /api/auth/signup**
- Creates a new user account with subscription
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword",
    "firstName": "John",
    "lastName": "Doe",
    "charityId": "uuid",
    "charityContributionPercent": 20,
    "plan": "monthly" | "yearly"
  }
  ```
- Response: User object with JWT tokens
- Status: 201 (Created) | 409 (Email Already Exists)

**POST /api/auth/login**
- Authenticates user and returns session tokens
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- Response: User object with JWT tokens and admin status
- Status: 200 (OK) | 401 (Invalid Credentials)

### Score Management Endpoints

**GET /api/scores**
- Retrieves user's score history with statistics
- Query Parameters: limit, offset, sortBy
- Response: Array of scores + calculated average
- Status: 200 (OK) | 401 (Unauthorized)

**POST /api/scores**
- Creates a new score with automatic validation
- Request Body: `{ "scoreValue": 25 }`
- Validation: Score must be between 1-45
- Automatic Behavior: Removes oldest score if count exceeds 5
- Status: 201 (Created) | 400 (Invalid Score) | 401 (Unauthorized)

**PUT /api/scores/[id]**
- Updates an existing score
- Request Body: `{ "scoreValue": 30 }`
- Status: 200 (OK) | 404 (Not Found) | 401 (Unauthorized)

**DELETE /api/scores/[id]**
- Permanently removes a score from history
- Status: 204 (No Content) | 404 (Not Found) | 401 (Unauthorized)

### Draw Endpoints

**GET /api/draws**
- Lists all draws with optional filtering
- Query Parameters: status (pending|completed), limit, offset
- Response: Array of draw objects with metadata
- Status: 200 (OK)

**POST /api/draws** *(Admin Only)*
- Creates a new draw with configuration
- Request Body:
  ```json
  {
    "month": "March 2026",
    "status": "pending",
    "mode": "random|algorithmic",
    "poolAmount": 5000
  }
  ```
- Status: 201 (Created) | 403 (Forbidden) | 401 (Unauthorized)

### User Profile Endpoints

**GET /api/users/[userId]**
- Retrieves complete user profile
- Response: User object with all fields
- Status: 200 (OK) | 404 (Not Found) | 401 (Unauthorized)

**PUT /api/users/[userId]**
- Updates user profile information
- Request Body:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "charityId": "uuid",
    "charityContributionPercent": 30
  }
  ```
- Status: 200 (OK) | 400 (Invalid Data) | 401 (Unauthorized)

### Subscription Endpoints

**GET /api/subscriptions/current**
- Retrieves active subscription for authenticated user
- Response: Subscription object with renewal details
- Status: 200 (OK) | 404 (No Active Subscription) | 401 (Unauthorized)

### Winners & Prize Endpoints

**GET /api/winners**
- Retrieves winners list
- Behavior: Regular users see their own winnings; admins see all
- Query Parameters: status (pending|verified|rejected), limit
- Response: Array of winner objects
- Status: 200 (OK) | 401 (Unauthorized)

**POST /api/winners/[id]/verify** *(Admin Only)*
- Verifies or rejects a winner claim
- Request Body:
  ```json
  {
    "status": "verified|rejected",
    "rejectionReason": "Optional reason if rejected"
  }
  ```
- Status: 200 (OK) | 400 (Invalid Status) | 403 (Forbidden) | 401 (Unauthorized)

### Charity Endpoints

**GET /api/charities**
- Lists all available charities
- Query Parameters: limit, offset, search
- Response: Array of charity objects with impact metrics
- Status: 200 (OK)

## User Interface

### Public Pages

**Landing Page** (`/`)
- Product overview and value proposition
- Call-to-action buttons for signup/login
- Feature highlights and testimonials

**Login** (`/login`)
- Email and password authentication
- Password recovery link
- Signup redirect for new users

**Sign Up** (`/signup`)
- Multi-step registration form
- Charity selection and contribution percentage
- Subscription plan selection
- Email address verification

### User Dashboard

Accessible only to authenticated users. Automatically redirects to `/login` if not authenticated.

**Scores** (`/scores`)
- Display of last 5 scores with running average
- Score input form with validation
- Score history with delete capability
- Statistical metrics (min, max, average)

**Draws** (`/draws`)
- Current active draw information
- Historical draw results and payouts
- Draw mode details (algorithmic vs. random)
- User eligibility and participation status

**Winnings** (`/winnings`)
- Total winnings summary
- Segmented view: Pending Verification vs. Verified Wins
- Prize details and draw information
- Verification timeline

**Charities** (`/charities`)
- Browsable charity directory with impact metrics
- Interactive contribution percentage slider (10-100%)
- Real-time monthly contribution calculation
- Selected charity highlight and confirmation

**Profile** (`/profile`)
- User personal information editing
- First name, last name, email display
- Account settings and preferences
- Save and confirmation feedback

**Subscription** (`/subscription`)
- Current plan details and status
- Monthly cost and auto-renewal date
- Payment method management (future)
- Plan upgrade/downgrade options (future)

### Admin Dashboard

Accessible only to users with admin flag. Protected by authentication middleware.

**Admin Dashboard** (`/admin`)
- Key performance indicator cards
- User statistics and activity metrics
- Recent draws and winner activity
- System health and performance indicators

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env.local` (included in `.gitignore`)
- **Secrets Management**: Use Vercel secrets or platform-specific secret managers in production
- **Input Validation**: All user inputs validated server-side using Zod schemas
- **Password Security**: Passwords hashed with bcryptjs (10 salt rounds), never stored as plaintext
- **JWT Security**: Tokens signed with HS256 algorithm, include expiration times
- **HTTPS Only**: Always use HTTPS in production (Vercel enforces this)
- **CORS**: Configure appropriately for your domain
- **Rate Limiting**: Implement rate limiting on auth endpoints to prevent brute force
- **SQL Injection**: Using Supabase parameterized queries prevents SQL injection
- **XSS Protection**: React auto-escapes values, CSP headers recommended

## 📦 Building for Production

```bash
# Build optimization
npm run build

# Analyze bundle size
npm run build -- --analyze

# Test production build locally
npm run build
npm start
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm test:integration

# E2E tests
npm test:e2e
```

## Troubleshooting Guide

### Build & Dependency Issues

#### Error: "Cannot find module"

**Cause**: Missing or corrupted node_modules

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

#### Error: "ENOSPC: no space left on device"

**Cause**: Insufficient disk space

**Solution**:
```bash
# Check disk space
df -h

# Clean temporary files
npm cache clean --force

# Remove .next directory (rebuilds on next run)
rm -rf .next
```

#### TypeScript Compilation Errors

**Cause**: Type mismatches or missing type definitions

**Solution**:
```bash
# Run type checker
npm run type-check

# Review errors in output
# Fix type issues in source files
# Rebuild
npm run build
```

### Authentication & Session Issues

#### Error: "401 Unauthorized" on Protected Routes

**Cause**: Missing or expired authentication token

**Solution**:
1. **Check localStorage (Browser Console)**:
```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User ID:', localStorage.getItem('userId'));
console.log('Is Admin:', localStorage.getItem('is-admin'));
```

2. **Clear and retry login**:
```javascript
localStorage.clear();
// Manually navigate to /login
```

3. **Verify token not expired**:
```javascript
// Tokens are valid for 15 minutes
// If expired, refresh token should request new one
```

#### Admin Features Not Appearing

**Cause**: `isAdmin` flag not set correctly

**Solution**:
1. **Verify ADMIN_EMAIL environment variable**:
   - Check `.env.local` contains: `ADMIN_EMAIL=admin@golfcharity.app`
   - Update to your desired admin email

2. **Sign up with admin email**:
   - Account is flagged as admin only during signup
   - Recreate account with matching email

3. **Check is-admin flag in localStorage**:
```javascript
localStorage.getItem('is-admin') === 'true'
```

#### Token Refresh Not Working

**Cause**: Refresh token expired or invalid

**Solution**:
```bash
# Logout completely
localStorage.clear();

# Restart dev server (if using local tokens)
npm run dev

# Login again
```

### Database Connection Issues

#### Error: "Connection refused" or "ECONNREFUSED"

**Cause**: Supabase credentials invalid or database down

**Solution**:
1. **Verify Supabase Connection**:
   - Open [https://app.supabase.com](https://app.supabase.com)
   - Select your project
   - Check Status → All systems operational?

2. **Validate Environment Variables**:
```bash
# Check .env.local
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

3. **Test Connection via Supabase**:
   - Dashboard → SQL Editor
   - Run: `SELECT 1;`
   - Should return `1`

#### Error: "Relation 'users' does not exist"

**Cause**: Database schema not initialized

**Solution**:
1. **Run Database Schema**:
   - Open Supabase Dashboard → SQL Editor
   - Copy schema from `lib/db/schema.ts`
   - Paste and execute

2. **Verify Tables Created**:
   - In Supabase → Database → Tables
   - Should see: users, subscriptions, scores, draws, winners, charities, charity_contributions

#### Slow Database Queries

**Cause**: Missing indexes or inefficient queries

**Solution**:
```sql
-- Check indexes in Supabase SQL Editor
SELECT indexname FROM pg_indexes WHERE tablename = 'users';

-- Add missing indexes for performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_scores_user_id ON scores(user_id);
CREATE INDEX CONCURRENTLY idx_draws_status ON draws(status);
```

### API Request Issues

#### Error: "Failed to fetch" or Network Errors

**Diagnosis Steps**:
1. **Check Network Tab (DevTools → Network)**:
   - Look for failed requests
   - Check status code (4xx, 5xx)
   - Review Response tab for error messages

2. **Verify API Endpoint Exists**:
```bash
# Test locally
curl -X GET http://localhost:3000/api/scores \
  -H "x-user-id: [user-uuid]" \
  -H "Authorization: Bearer [token]"
```

3. **Check CORS Headers** (if calling from different domain):
   - Review Response Headers for `Access-Control-Allow-Origin`

#### Error: "403 Forbidden" on Admin Endpoints

**Cause**: User doesn't have admin privileges

**Solution**:
1. Ensure user was created with admin email
2. Verify `x-is-admin` header is true
3. Check JWT token contains `isAdmin` claim

#### Inconsistent API Responses

**Cause**: Format mismatch or missing error handling

**Solution**:
- All endpoints should return:
```json
{
  "success": boolean,
  "data": {} | null,
  "error": string | null,
  "statusCode": number
}
```

### Development Server Issues

#### Port 3000 Already in Use

**Solution**:
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
PORT=3001 npm run dev
```

#### Hot Reload Not Working

**Solution**:
```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next

# Verify file changes are being saved
# Check file permissions
```

### Performance Issues

#### Slow Page Load Times

**Diagnosis**:
```javascript
// In browser console
// Check performance metrics
window.performance.timing
```

**Solutions**:
1. Clear `.next/` cache: `rm -rf .next`
2. Check Lighthouse scores: DevTools → Lighthouse
3. Review bundle size: `npm run build -- --analyze`
4. Optimize images: Use Next.js Image component

#### High Memory Usage

**Solution**:
```bash
# Rebuild project (reclaims memory)
npm run build

# Restart development server
npm run dev

# Close unused browser tabs/applications
```

### Deployment Issues

#### Vercel Build Failure

**Diagnosis**:
1. Check Vercel Logs: Dashboard → Deployments → Select Deployment → Logs
2. Common causes: Missing environment variables, TypeScript errors, build script failures

**Solution**:
```
1. Verify all env variables in Vercel Settings
2. Run npm run build locally and confirm success
3. Check NEXT_PUBLIC_SUPABASE_URL is public URL
4. Ensure all imports use correct paths
```

#### "Module not found" in Production

**Cause**: Relative path imports or missing files

**Solution**:
```typescript
// Use absolute imports with tsconfig.json alias
import { helper } from '@/lib/utils/helpers';

// NOT relative paths in production
import { helper } from '../../../lib/utils/helpers';
```

#### Timeout during Build

**Cause**: Long-running operations in build phase

**Solution**:
- Increase Vercel timeout in vercel.json:
```json
{
  "buildCommand": "npm run build",
  "env": {
    "NODE_OPTIONS": "--max-old-space-size=3008"
  }
}
```

### Debug Mode

Enable detailed logging for troubleshooting:

```javascript
// Enable debug logging
localStorage.setItem('DEBUG', 'golf-charity:*');

// Log all API request/responses
// Implement logging middleware in fetch-client.ts
```

### Getting Support

If troubleshooting doesn't resolve the issue:

1. **Check GitHub Issues**: [github.com/sud-git/golf-charity-platform/issues](https://github.com/sud-git/golf-charity-platform/issues)
2. **Review Logs**: 
   - Browser Console (F12 → Console)
   - Vercel Dashboard (for production)
   - Supabase Logs
3. **Create Issue**: Include error logs, steps to reproduce, environment details

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)
- [Jose JWT Library](https://github.com/panva/jose)

## 🗺️ Roadmap

- [ ] **Payment Integration**: Stripe checkout and subscription management
- [ ] **Email Notifications**: Resend integration for draw results and payment confirmations
- [ ] **Advanced Draw Algorithms**: Weighted draw system based on user scores
- [ ] **Charity Impact Dashboard**: Real-time impact metrics and fund tracking
- [ ] **Leaderboards**: User rankings by scores and winnings
- [ ] **Social Features**: Friend invites, team golf tournaments
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Push Notifications**: Real-time draw result notifications
- [ ] **Two-Factor Authentication**: Enhanced security with 2FA
- [ ] **Analytics Dashboard**: Detailed user engagement and revenue analytics

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
```bash
git clone https://github.com/your-username/golf-charity.git
cd golf-charity
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Follow existing code patterns
   - Update types as needed
   - Add comments for complex logic
   - Test thoroughly

4. **Commit your changes**
```bash
git add .
git commit -m "Add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
   - Describe the changes
   - Link any related issues
   - Include before/after screenshots if UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ❓ FAQs

**Q: Can I use this for production?**
A: Yes! After setting up Supabase, Stripe (optional), and deploying to Vercel, you're ready for production.

**Q: How do I become an admin?**
A: Sign up with the email configured in `ADMIN_EMAIL` environment variable (default: admin@golfcharity.app).

**Q: What payment provider is used?**
A: Stripe integration is prepared in the codebase but not fully active yet. See roadmap for timeline.

**Q: How often do draws occur?**
A: Monthly draws are configured in the database. Frequency can be customized by modifying the draws table.

**Q: Can users change their selected charity?**
A: Yes, users can update their charity preference in `/profile` page at any time.

---

## 📞 Support & Contact

- GitHub Issues: [Report bugs or request features](https://github.com/your-username/golf-charity/issues)
- Email: support@golfcharity.app
- Documentation: See inline comments in code and `lib/db/schema.ts` for detailed info

---

**Built with ❤️ for golf enthusiasts and charity supporters**

*Last updated: March 2026*

## Deployment Guide

### Prerequisites for Production Deployment

Before deploying to any production environment, ensure:
- [ ] All environment variables configured and secured
- [ ] Supabase project created and database initialized
- [ ] Production database migration completed
- [ ] SSL/TLS certificates configured
- [ ] Domain name acquired and DNS configured
- [ ] Email service provider credentials ready (Resend)
- [ ] Payment processor configured (Stripe)
- [ ] Backup strategy implemented

### Vercel Deployment (Recommended)

Vercel is the recommended platform for Next.js applications and provides seamless integration with the Golf Charity Platform.

#### Step 1: Prepare GitHub Repository

```bash
# Ensure all code is committed
git status

# Push to main branch
git push origin main
```

#### Step 2: Connect Vercel Project

1. Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in with GitHub account
3. Click "Add New" → "Project"
4. Select your GitHub organization and repository
5. Vercel auto-detects Next.js configuration

#### Step 3: Configure Environment Variables

In Vercel Dashboard, navigate to **Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL        = [your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY   = [your-anon-key]
SUPABASE_SERVICE_ROLE_KEY       = [your-service-role-key]
JWT_SECRET                       = [generate-secure-32-char-string]
ADMIN_EMAIL                      = admin@golfcharity.app
NEXT_PUBLIC_STRIPE_KEY          = [your-stripe-publishable-key]
STRIPE_SECRET_KEY                = [your-stripe-secret-key]
RESEND_API_KEY                   = [your-resend-api-key]
```

**Security Note**: Use Vercel's encrypted environment variables. Never commit `.env.local` files.

#### Step 4: Deploy

```bash
# Trigger deployment
git push origin main
```

Vercel automatically:
- Installs dependencies
- Runs build process (`npm run build`)
- Performs optimizations
- Deploys to CDN globally
- Assigns project URL: `https://[project-name].vercel.app`

**Build Status**: Monitor progress in Vercel Dashboard → Deployments

#### Step 5: Configure Custom Domain

1. In Vercel Dashboard, go to **Settings → Domains**
2. Enter your custom domain
3. Update DNS records per Vercel instructions
4. Wait for DNS propagation (5-60 minutes)

Example DNS configuration for `golfcharity.app`:
```
CNAME: www.golfcharity.app → golfcharity.vercel.app
A:    golfcharity.app → 76.76.19.21
```

### Alternative: Docker & Container Registry

For advanced deployment scenarios or multi-region deployments:

#### Create Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY public/ ./public/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

#### Build & Push to Registry

```bash
# Build image
docker build -t golfcharity:latest .

# Tag for registry (e.g., Docker Hub)
docker tag golfcharity:latest username/golfcharity:latest

# Push to registry
docker push username/golfcharity:latest
```

### Environment Variables Management

**Production Best Practices**

| Variable | Visibility | Example | Notes |
|----------|-----------|---------|-------|
| `NEXT_PUBLIC_*` | Public | `NEXT_PUBLIC_SUPABASE_URL` | Exposed to browser, safe for public URLs |
| Private Keys | Secret | `SUPABASE_SERVICE_ROLE_KEY` | Never expose to client |
| Credentials | Secret | `STRIPE_SECRET_KEY` | Use platform secret managers |
| Secrets | Encrypted | `JWT_SECRET` | Generate cryptographically secure strings |

**Generating Secure JWT_SECRET**

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Continuous Integration/Deployment (CI/CD)

#### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Production Build Verification

Always test the production build locally before pushing:

```bash
# Build
npm run build

# Start production server
npm start

# Test endpoints
curl http://localhost:3000
curl http://localhost:3000/api/health
```

### Monitoring & Health Checks

**Add Health Check Endpoint**

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

Monitor in Vercel:
- **Settings → Functions** for performance metrics
- **Analytics** for traffic and errors
- **Projects → Deployments** for deployment history

### Rollback Procedure

If deployment has critical issues:

```bash
# Revert to previous commit
git revert [commit-hash]

# Or restore from previous deployment
# In Vercel Dashboard: Deployments → Select Previous → Promote
```

### Database Migrations

For production database schema changes:

1. Test migrations in development Supabase project
2. Create migration script in `lib/db/migrations/`
3. Execute migration on production database before deploying code
4. Verify data integrity
5. Deploy updated application code

## Development

### Local Development Workflow

#### Starting Development Server

```bash
npm run dev
```

Launches the Next.js development server with:
- Hot module reloading (HMR) for instant code changes
- Server-side compilation with detailed error reporting
- API route hot reloading
- Automatic TypeScript checking

The application will be available at `http://localhost:3000`

#### Building for Production

```bash
npm run build
```

Creates optimized production build:
- Next.js static optimization
- Automatic code splitting
- Asset minification and compression
- TypeScript compilation
- ESLint validation
- Build artifacts in `.next/` directory

#### Production Server Execution

```bash
npm start
```

Starts the production server using optimized build artifacts. This should only be used after running `npm run build`. Use for local production testing before deployment to Vercel or other hosting platforms.

#### Code Quality & Validation

**ESLint Analysis**
```bash
npm run lint
```
Runs ESLint on the entire codebase enforcing code quality rules. Checks for:
- Unused variables and imports
- React best practices compliance
- TypeScript type issues
- Formatting violations
- Security concerns

**Code Formatting**
```bash
npm run format
```
Applies Prettier formatting standards to ensure consistent code style across the project. Formats:
- JavaScript/TypeScript files
- JSX/TSX components
- JSON configuration files

Recommended workflow: Run `npm run format` before committing to maintain consistency.

**Type Checking**
```bash
npm run type-check
```
Performs standalone TypeScript compilation without emitting JavaScript. Useful for catching type errors without building the entire project. Equivalent to `tsc --noEmit`.

#### Development Environment Setup

**Required Environment Variables for Development**

Create `.env.local` with a minimum of:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_secure_secret_minimum_32_chars
ADMIN_EMAIL=admin@golfcharity.app
```

**Hot Reload Behavior**

The development server automatically reloads when:
- JavaScript, TypeScript, or JSX files are modified
- CSS stylesheets change (live CSS injection)
- HTML or configuration files are updated
- Environment variables in `.env.local` are modified (requires manual refresh)

**Debugging**

Enable debug logging in browser console:
```javascript
// Enable API request logging
localStorage.setItem('DEBUG', 'golf-charity:*');

// Clear auth tokens for fresh login
localStorage.clear();

// View current session
console.log(localStorage.getItem('accessToken'));
```

### Technology Stack Reference

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.35+ | React meta-framework with App Router |
| **Library** | React | 18.2+ | UI component framework |
| **Language** | TypeScript | 5.x | Static type checking |
| **Styling** | Tailwind CSS | 3.3+ | Utility-first CSS framework |
| **Forms** | React Hook Form | Latest | Performant form management |
| **Validation** | Zod | Latest | Type-safe schema validation |
| **State** | React Context | Built-in | Application state management |
| **JWT** | jose | 4.15.0 | Token signing and verification |
| **Hashing** | bcryptjs | 10.0.0 | Password hashing and verification |
| **Database** | Supabase | Latest | PostgreSQL with REST API |
| **Linting** | ESLint | Latest | Code quality enforcement |
| **Formatting** | Prettier | Latest | Code style consistency |

### IDE Configuration

**VS Code Recommended Extensions**
- ES7+ React/Redux/React-Native snippets
- ESLint - Microsoft
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- REST Client
- Thunder Client or Postman API testing

**Recommended Settings for `.vscode/settings.json`**
```json
{
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 📊 Core Implementation Details

### Score Rolling Window Logic
```
Max 5 scores per user
When user adds 6th score:
  1. New score is added
  2. Oldest score is automatically deleted
  3. Average is recalculated
```

### JWT Token Flow
```
1. User logs in → Verify password
2. Generate access token (15 min expiry)
3. Generate refresh token (7 day expiry)
4. Store both in localStorage
5. Include accessToken in Authorization header for API requests
6. On token expiry → Use refresh token to get new access token
```

### Admin Detection
```
During login/signup:
  if (user.email === 'admin@golfcharity.app')
    isAdmin = true
  else
    isAdmin = false
  
Stored as 'is-admin' in localStorage
Checked on admin routes before rendering
```

### Response Standardization
All API routes return:
```json
{
  "success": boolean,
  "data": {...} or null,
  "error": string or null,
  "statusCode": number
}
```

This ensures consistent error handling across the frontend

## 🔄 User Flows

### Signup Flow
1. User fills email, password, name, charity preference, plan
2. Backend validates inputs using Zod schemas
3. Password hashed with bcryptjs (10 rounds)
4. User record created in Supabase
5. Subscription record auto-created
6. JWT tokens generated
7. User redirected to dashboard

### Login Flow
1. User enters email and password
2. Backend queries user by email
3. Password verified against hash
4. Admin status determined (email check)
5. JWT tokens generated
6. Tokens + user data returned to frontend
7. Frontend stores in localStorage
8. User redirected to dashboard

### Score Tracking Flow
1. User navigates to /scores page
2. Component fetches last 5 scores on mount
3. Form allows score input (1-45)
4. On submit: POST to /api/scores
5. Backend validates range, checks 5-score limit
6. If 6+ scores exist, deletes oldest
7. New score saved
8. Component re-fetches scores
9. Average auto-updates

### Draw Participation
1. User views current draw on /draws page
2. Draw shows pool amount, mode, status
3. If status = 'pending', user is in current draw
4. Results shown after draw completion
5. Users can view past draws with dates
- 4-match: 35% of pool
- 3-match: 25% of pool
- Equal split among multiple winners per tier

### Charity Contribution
- Minimum: 10% of subscription
- User-selectable percentage
- Auto-calculated and tracked monthly
- Direct impact reporting

## Testing & Quality Assurance

### Manual Testing Checklist

#### Authentication (Critical Path)

- [ ] **Signup Flow**
  - [ ] Create new account with valid email
  - [ ] Verify email validation (invalid format rejected)
  - [ ] Verify password requirements enforced
  - [ ] Select charity and contribution percentage
  - [ ] Choose subscription plan (monthly/yearly)
  - [ ] Account created successfully
  - [ ] Redirected to dashboard
  - [ ] Tokens stored in localStorage

- [ ] **Login Flow**
  - [ ] Login with valid credentials
  - [ ] Verify invalid email shows error
  - [ ] Verify wrong password shows error
  - [ ] Verify admin status detected correctly
  - [ ] Tokens stored and accessible
  - [ ] Redirected to dashboard

- [ ] **Session Management**
  - [ ] Access token valid for 15 minutes
  - [ ] Refresh token extends session to 7 days
  - [ ] Expired token shows 401 Unauthorized
  - [ ] Logout clears tokens

#### Score Management

- [ ] **Score Entry**
  - [ ] Add score between 1-45
  - [ ] Reject scores <1 or >45
  - [ ] Display confirmation message
  - [ ] Score appears in history immediately
  - [ ] Average updates correctly

- [ ] **Score History**
  - [ ] Show last 5 scores in reverse chronological order
  - [ ] Calculate and display average correctly
  - [ ] Delete old scores when 6th score added (rolling window)
  - [ ] Display min/max scores

- [ ] **Edit/Delete**
  - [ ] Update existing score
  - [ ] Delete score from history
  - [ ] Confirm operations completed

#### Dashboard Navigation

- [ ] Navbar links functional from all pages
- [ ] Protected pages redirect to login if logged out
- [ ] User profile displays correct information
- [ ] Sidebar navigation highlights current page
- [ ] Mobile responsive on small screens

#### Charity & Contribution

- [ ] Browse available charities
- [ ] Adjust contribution percentage slider
- [ ] Verify 10-100% range enforced
- [ ] Save charity preferences
- [ ] Display selected charity on dashboard

### Automated Testing (Future Implementation)

```bash
# Unit tests
npm test

# Integration tests  
npm test:integration

# E2E tests
npm test:e2e

# Coverage report
npm test -- --coverage
```

**Recommended Testing Framework**: Jest + React Testing Library

### Performance Testing

#### Lighthouse Audit

```bash
# Generate report
npm run build

# Use Chrome DevTools Lighthouse tab
# Or use CLI:
npm install -g lighthouse
lighthouse http://localhost:3000
```

**Performance Targets**:
- Performance Score: > 90
- Accessibility Score: > 95
- Best Practices Score: > 90
- SEO Score: > 90

#### Bundle Analysis

```bash
npm run build -- --analyze
```

Review and optimize:
- Large dependencies
- Unused CSS
- Duplicate modules

### Code Quality Standards

#### ESLint Compliance

All code must pass ESLint:
```bash
npm run lint
```

**Standards Enforced**:
- No unused variables or imports
- React hooks correct usage
- TypeScript strict mode compliance
- Security best practices
- Accessibility requirements

#### TypeScript Strict Mode

All files must compile without errors:
```bash
npm run type-check
```

**Project TypeScript Settings** (`tsconfig.json`):
- `strict: true` — Enables all strict type checking
- `noImplicitAny: true` — Forbid implicit any types
- `strictNullChecks: true` — Strict null/undefined checking
- `moduleResolution: bundler` — Next.js compatible resolution

### Test Scenarios by Feature

| Feature | Scenario | Expected Result |
|---------|----------|-----------------|
| Auth | Valid signup | Account created, logged in |
| Auth | Duplicate email | Error shown, account not created |
| Scores | Add valid score | Score saved, average updated |
| Scores | Add invalid score | Error message, not saved |
| Dashboard | Load without auth | Redirected to login |
| API | Valid request | Returns success response |
| API | Missing headers | Returns 401 error |
| Admin | Non-admin access | 403 Forbidden response |

## Contributing Guidelines

We welcome contributions from the community! This project is maintained as both a professional platform and an educational resource.

### Development Workflow

#### 1. Fork the Repository

```bash
git clone https://github.com/your-username/golf-charity-platform.git
cd golf-charity-platform
git remote add upstream https://github.com/sud-git/golf-charity-platform.git
```

#### 2. Create Feature Branch

```bash
git checkout -b feature/feature-name
```

**Branch Naming Convention**:
- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation updates
- `refactor/` — Code refactoring
- `test/` — Test additions

#### 3. Make Changes

**Code Standards**:
- Follow existing code patterns and style
- Update TypeScript types as needed
- Add comments for complex logic
- Ensure all tests pass
- Run ESLint: `npm run lint`
- Format code: `npm run format`

**Commit Message Format**:
```
[TYPE]: Brief description (50 chars max)

Detailed explanation of changes (wrap at 72 chars)
- List any major changes
- Reference related issues

Fixes #123
```

**Commit Types**: 
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation change
- `style:` Code formatting (no functional change)
- `refactor:` Code restructuring
- `test:` Adding or updating tests
- `chore:` Build process, dependencies

#### 4. Keep Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

#### 5. Push to Your Fork

```bash
git push origin feature/feature-name
```

#### 6. Submit Pull Request

1. Go to [GitHub Repository](https://github.com/sud-git/golf-charity-platform)
2. Click "New Pull Request"
3. Select your branch
4. Provide detailed PR description:
   - Description of changes
   - Related issues (`Fixes #123`)
   - Screenshots (if UI changes)
   - Testing instructions

### PR Review Process

- Code review by maintainers
- CI/CD pipeline must pass
- All tests must pass
- Merge once approved

### Reporting Bugs

Create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error logs/screenshots

### Feature Requests

Describe:
- Use case and value
- Proposed implementation (optional)
- Related issues/PRs

## Roadmap

### Phase 1 (In Progress)
- ✅ Core platform and authentication
- ✅ Score tracking system
- ✅ User dashboard
- 🔄 Testing and bug fixes

### Phase 2 (Planned)
- [ ] **Payment Integration** — Stripe checkout and subscription management
- [ ] **Email Notifications** — Resend integration for draw results and notifications
- [ ] **Advanced Draw Algorithms** — Weighted draw system based on scores
- [ ] **Analytics Dashboard** — User engagement and revenue metrics

### Phase 3 (Future)
- [ ] **Charity Impact Dashboard** — Real-time impact metrics and fund tracking
- [ ] **Leaderboards** — User rankings by scores and winnings
- [ ] **Social Features** — Friend invites and golf tournaments
- [ ] **Mobile Application** — React Native iOS/Android app
- [ ] **Push Notifications** — Real-time draw result notifications
- [ ] **Two-Factor Authentication** — Enhanced security with 2FA

### Phase 4 (Long-term)
- [ ] Advanced analytics and reporting
- [ ] Machine learning for draw optimization
- [ ] International expansion
- [ ] Multiple charity ecosystems

## Resources & Documentation

### Official Documentation

- [Next.js Official Docs](https://nextjs.org/docs) 
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### Related Tools & Libraries

- [Zod Validation Library](https://zod.dev)
- [Jose JWT Library](https://github.com/panva/jose)
- [React Hook Form](https://react-hook-form.com/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

### Community

- **GitHub Discussions**: [Ask questions and discuss ideas](https://github.com/sud-git/golf-charity-platform/discussions)
- **GitHub Issues**: [Report bugs](https://github.com/sud-git/golf-charity-platform/issues)

## FAQ

**Q: Can I use this platform for production?**
A: Yes! After completing setup with Supabase and deploying to Vercel, the platform is production-ready. Consider implementing additional features from the roadmap based on your needs.

**Q: How do I become an administrator?**
A: During signup, use the email address configured in the `ADMIN_EMAIL` environment variable (default: `admin@golfcharity.app`). Admin status is automatically assigned at account creation.

**Q: What payment options are supported?**
A: Stripe integration is prepared in the codebase and can be enabled. See the Roadmap section for planned payment system timeline.

**Q: How often do prize draws occur?**
A: Monthly draws are the default configuration. Frequency and draw algorithms can be customized by modifying the `draws` table schema or implementing additional draw services.

**Q: Can users change their selected charity?**
A: Yes, users can update their charity preference and contribution percentage at any time through the `/charities` page.

**Q: Is the data secure?**
A: Yes, we implement:
- JWT-based authentication with secure tokens
- bcryptjs password hashing (10 salt rounds)
- Supabase row-level security (RLS) for database access
- HTTPS/TLS encryption in transit
- Parameterized queries to prevent SQL injection

**Q: How are scores rolled/reset?**
A: The system maintains the last 5 scores per user. When a 6th score is added, the oldest automatically deletes. Scores are not reset monthly—they persist until deleted by the user.

**Q: What happens if I forget my password?**
A: Password recovery functionality is planned for Phase 2. Currently, contact support to reset credentials.

**Q: Can I export my data?**
A: Data export functionality is not yet implemented. Users can manually export from their dashboard (screenshot or download as PDF future feature).

**Q: How do I report a security vulnerability?**
A: Please email security@golfcharity.app with details. Do not create public issues for security vulnerabilities.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

MIT License grants you the freedom to:
- Use the software for any purpose
- Modify and distribute the software
- Include the software in proprietary applications

With the condition that:
- Include a copy of the license
- Include the original copyright notice

## Support & Contact

### Getting Help

**Documentation**: Review the comprehensive [README.md](README.md) and inline code comments

**GitHub Issues**: [Report bugs or request features](https://github.com/sud-git/golf-charity-platform/issues)

**Email Support**: support@golfcharity.app

**Discord Community**: [Join our community](https://discord.gg/golfcharity) (if available)

### Reporting Issues

Include in your report:
- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error logs
- Environment (OS, Node version, browser)
- Search existing issues first to avoid duplicates

## Version History

**v1.0.0** (2026-03-15)
- Initial release
- Core authentication system
- Golf score tracking
- Monthly draw system
- User dashboard
- Admin portal

---

## Acknowledgments

This platform was developed with modern web development best practices, combining React, Next.js, TypeScript, and Supabase for a robust, type-safe, and scalable solution.

**Special Thanks To**:
- Next.js team for excellent framework
- Supabase for reliable backend
- Contributors and community members

---

**Built with ❤️ for golf enthusiasts and charity supporters**

*Last Updated*: March 2026  
*Current Version*: 1.0.0  
*Status*: Active Development

---

**Ready to get started?**

```bash
# Clone repository
git clone https://github.com/sud-git/golf-charity-platform.git
cd golf-charity-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

Questions? Open an issue or reach out to [support@golfcharity.app](mailto:support@golfcharity.app)
