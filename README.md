# Golf Charity Platform

A full-stack web application that enables golf enthusiasts to track scores, participate in charitable draws, and contribute to selected charities through subscription-based gameplay.

## 🎯 Features

- **User Authentication**: Secure signup/login with JWT tokens (15-min access, 7-day refresh)
- **Score Tracking**: Track golf scores with automatic rolling 5-score window and average calculations
- **Charitable Draws**: Participate in monthly draws with potential prize winnings
- **Charity Selection**: Choose preferred charities and set contribution percentages (10-100%)
- **Winner Management**: Track winnings status with pending verification and verified wins
- **User Profiles**: Comprehensive user information and subscription management
- **Admin Dashboard**: Protected admin access for winner verification and draw management
- **Responsive Design**: Full mobile and desktop support with Tailwind CSS
- **Type-Safe Code**: Built with TypeScript for reliability and maintainability

## 📋 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Supabase account
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/golf-charity.git
cd golf-charity
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT
JWT_SECRET=your-jwt-secret-key

# Admin Email
ADMIN_EMAIL=admin@golfcharity.app

# Optional: Stripe & Email integrations
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
RESEND_API_KEY=
```

4. **Setup Supabase Database**
   - Create a new project on https://supabase.com
   - Execute the SQL schema from `lib/db/schema.ts` in your Supabase SQL editor
   - This creates all required tables (users, subscriptions, scores, draws, winners, charities)

5. **Run development server**
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
golf-charity/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/            # Protected user dashboard pages
│   │   ├── layout.tsx
│   │   ├── scores/page.tsx
│   │   ├── draws/page.tsx
│   │   ├── winnings/page.tsx
│   │   ├── charities/page.tsx
│   │   ├── profile/page.tsx
│   │   └── subscription/page.tsx
│   ├── (admin)/                # Admin-only pages
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── api/                    # Backend API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── scores/
│   │   │   └── route.ts & [id]/route.ts
│   │   ├── draws/route.ts
│   │   ├── users/[userId]/route.ts
│   │   ├── subscriptions/current/route.ts
│   │   ├── winners/route.ts & [id]/verify/route.ts
│   │   └── charities/route.ts
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   │   ├── ScoreForm.tsx
│   │   ├── ScoresList.tsx
│   │   └── StatCard.tsx
│   └── navigation/
├── lib/
│   ├── auth/
│   │   └── token.ts            # JWT creation/verification, password hashing
│   ├── db/
│   │   ├── schema.ts           # Database schema SQL
│   │   └── supabase.ts         # Supabase client
│   └── utils/
│       ├── api-response.ts     # Standard response builders
│       ├── fetch-client.ts     # Authenticated fetch helper
│       └── validators.ts       # Zod validation schemas
├── types/
│   └── index.ts                # TypeScript interfaces
├── middleware.ts               # Route protection middleware
├── .env.local                  # Environment variables (local)
├── tsconfig.json               # TypeScript config
├── .eslintrc.js                # ESLint rules
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
└── README.md (this file)
```

## 🔐 Authentication

- **JWT-based**: Access tokens (15 min) + Refresh tokens (7 days)
- **Password hashing**: bcryptjs with 10 salt rounds
- **Admin detection**: Determined by email check (admin@golfcharity.app)
- **Session management**: Tokens stored in localStorage  
- **Protected routes**: Middleware validates JWT on each request
- **Response includes**: userId, email, firstName, lastName, isAdmin flags

## 💾 Database Schema

### Core Tables
- **users** - User accounts (id, email, password_hash, first_name, last_name, created_at)
- **subscriptions** - Subscription plans (id, user_id, plan, status, auto_renew, created_at)
- **scores** - Golf scores (id, user_id, score_value: 1-45, created_at) - rolling 5-score window
- **draws** - Monthly draw configurations (id, month, status, mode, pool_amount, created_at)
- **winners** - Draw results (id, user_id, draw_id, prize_amount, verification_status, created_at)
- **charities** - Charity directory (id, name, description, url, impact_metrics, created_at)
- **charity_contributions** - User charity selections (id, user_id, charity_id, contribution_percent, created_at)

See `lib/db/schema.ts` for complete table definitions with all columns and constraints.

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account with email, password, name, charity, plan
- `POST /api/auth/login` - Sign in with email/password, returns JWT tokens + user data

### Scores  
- `GET /api/scores` - Get user's last 5 scores with average
- `POST /api/scores` - Add new score (validates 1-45 range, auto-deletes oldest if 5+ exist)
- `PUT /api/scores/[id]` - Update existing score
- `DELETE /api/scores/[id]` - Delete score

### Draws
- `GET /api/draws` - Get all draws with optional status filter (pending/completed)
- `POST /api/draws` - Create new draw (admin only)

### Users
- `GET /api/users/[userId]` - Get user profile (email, name, charity, contribution %)
- `PUT /api/users/[userId]` - Update user profile details

### Subscriptions
- `GET /api/subscriptions/current` - Get active subscription with status, plan, renewal date

### Winners
- `GET /api/winners` - Get user's winnings or all winners (if admin)
- `POST /api/winners/[id]/verify` - Verify/reject winner with status (admin only)

**Response Format**: All endpoints return:
```json
{
  "success": true,
  "data": {...},
  "error": null,
  "statusCode": 200
}
```

**Authorization**: Routes use `x-user-id` header for identification, `x-is-admin` header for admin checks

## 📱 Dashboard Pages

### Public Pages
- `/` - Landing page with app overview
- `/login` - User login form
- `/signup` - User registration form

### Protected Dashboard Pages (Require Authentication)
- `/scores` - Score management (view last 5, add new, delete, see average)
- `/draws` - View current/past draws with details and pool amounts
- `/winnings` - Track prize winnings (pending vs. verified status)
- `/charities` - Browse charities and set contribution % (10-100%)
- `/profile` - Edit user name and account details
- `/subscription` - View current subscription plan and auto-renewal status

### Admin Panel (Requires Admin Flag)
- `/admin` - Admin dashboard with KPI cards

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

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Database Connection Issues
- Verify Supabase URL and API keys in `.env.local`
- Check that Supabase project is active
- Ensure database tables exist (run schema.sql)
- Test connection from Supabase dashboard SQL editor

### Authentication Issues
- Clear localStorage: `localStorage.clear()` in browser console
- Verify JWT_SECRET is set and consistent
- Check token expiration times in lib/auth/token.ts
- Ensure admin email matches in .env.local

### API Request Failures
- Check Network tab in browser DevTools
- Verify auth headers are sent (Authorization: Bearer token)
- Confirm x-user-id header is included for protected routes
- Review server logs in Vercel dashboard

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

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. **Push to GitHub**
```bash
git remote add origin https://github.com/your-username/golf-charity.git
git branch -M main
git push -u origin main
```

2. **Deploy with Vercel**
   - Go to https://vercel.com and sign in
   - Click "Add New" → "Project" → Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Set Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     JWT_SECRET
     ADMIN_EMAIL
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (optional)
     STRIPE_SECRET_KEY (optional)
     RESEND_API_KEY (optional)
     ```

4. **Deploy**
   - Vercel automatically deploys when you push to `main`
   - View live at `https://[your-project].vercel.app`

### Local Production Build Testing

```bash
npm run build
npm start
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint checks
npm run format           # Format code with Prettier
```

### Tech Stack Details

**Frontend Framework**
- Next.js 14.2.35 with App Router
- React 18.2+ with Server Components
- TypeScript 5.x for type safety

**Styling**
- Tailwind CSS 3.3+ for utility-first CSS
- Custom responsive breakpoints
- Dark/light mode support ready

**Form Handling & Validation**
- React Hook Form for performant form management
- Zod for type-safe schema validation
- Built-in error messages and feedback

**State Management**
- Zustand for lightweight global state (if needed)
- React Context for auth state
- localStorage for persistence

**Authentication**
- JWT tokens (jose library v4.15.0)
- bcryptjs for password hashing
- Automatic token refresh flow

**API Communication**
- fetch API with custom enhanced client
- Automatic auth header injection
- Consistent error handling

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

## 🔒 Security

- HTTPS enforced (Vercel)
- CSRF protection via tokens
- SQL injection prevention (Supabase parameterized queries)
- XSS protection (React escaping)
- Rate limiting on API routes
- Secure password hashing (bcryptjs)
- JWT token validation on protected routes

## 📝 Testing Checklist

- [ ] User signup & login flow
- [ ] Subscription creation (monthly & yearly)
- [ ] Score entry (5-score rolling logic)
- [ ] Draw simulation & publication
- [ ] Charity selection & contribution
- [ ] Winner verification & payment
- [ ] Admin controls functionality
- [ ] Mobile responsiveness
- [ ] Error handling & edge cases
- [ ] Email notifications

## 🤝 Contributing

This is an internship project. For improvements:
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit for review

## 📄 License

MIT License - © 2026 Golf Charity Platform

## 📞 Support

For issues or questions:
- Email: support@golfcharity.app
- Docs: See COMPLETE_PRODUCT_SOLUTION.md for detailed architecture

---

**Ready to build?** Start with:
```bash
npm run dev
```

Then visit http://localhost:3000 🎯
