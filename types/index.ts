// Global type definitions

export type UserRole = 'user' | 'admin';

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'paused';

export type AccountStatus = 'active' | 'suspended' | 'deleted';

export type DrawMode = 'random' | 'algorithmic';

export type DrawStatus = 'pending' | 'running' | 'completed' | 'published';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name: string | null;
  last_name: string | null;
  handicap: number | null;
  profile_picture_url: string | null;
  selected_charity_id: string | null;
  charity_contribution_percentage: number;
  account_status: AccountStatus;
  email_verified: boolean;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  amount_cents: number;
  currency: string;
  status: SubscriptionStatus;
  current_period_start: Date | null;
  current_period_end: Date | null;
  renewal_date: Date | null;
  canceled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Score {
  id: string;
  user_id: string;
  score_value: number;
  score_date: Date;
  course_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Draw {
  id: string;
  draw_month: Date;
  draw_mode: DrawMode;
  status: DrawStatus;
  random_numbers: number[];
  total_participants: number | null;
  total_pool_cents: number | null;
  simulated_at: Date | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: 3 | 4 | 5;
  prize_amount_cents: number;
  proof_image_url: string | null;
  verification_status: VerificationStatus;
  payment_status: PaymentStatus;
  stripe_payout_id: string | null;
  verified_by_admin_id: string | null;
  verified_at: Date | null;
  paid_at: Date | null;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  category: string | null;
  featured: boolean;
  status: 'active' | 'inactive';
  total_raised_cents: number;
  user_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CharityEvent {
  id: string;
  charity_id: string;
  title: string;
  description: string | null;
  event_date: Date | null;
  event_type: string;
  location: string | null;
  image_url: string | null;
  created_at: Date;
}

export interface CharityContribution {
  id: string;
  subscription_id: string;
  charity_id: string;
  contribution_cents: number;
  contribution_date: Date;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: Record<string, any> | null;
  ip_address: string | null;
  created_at: Date;
}

// API Request/Response Types

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  selectedCharityId: string;
  charityContributionPercentage: number;
  plan: SubscriptionPlan;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    userId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    subscription: {
      id: string;
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
    };
  };
}

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

export interface APISuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export type APIResponse<T = any> = APISuccessResponse<T> | APIErrorResponse;

// Session Types

export interface SessionPayload {
  userId: string;
  email: string;
  role?: UserRole;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}
