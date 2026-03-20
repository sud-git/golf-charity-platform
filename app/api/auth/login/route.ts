import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { loginSchema } from '@/lib/utils/validators';
import { verifyPassword, createToken, createRefreshToken } from '@/lib/auth/token';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = loginSchema.parse(body);

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', validated.email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password'),
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validated.password,
      user.password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password'),
        { status: 401 }
      );
    }

    // Check account status
    if (user.account_status === 'suspended') {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.ACCOUNT_SUSPENDED, 'Your account has been suspended'),
        { status: 403 }
      );
    }

    // Get subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Check if admin
    const isAdmin = user.email === 'admin@golfcharity.app';

    // Create tokens
    const accessToken = createToken({
      userId: user.id,
      email: user.email,
      isAdmin,
    });

    const refreshToken = createRefreshToken({
      userId: user.id,
      email: user.email,
      isAdmin,
    });

    return NextResponse.json(
      createSuccessResponse({
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin,
        accessToken,
        refreshToken,
        subscription: subscription ? {
          id: subscription.id,
          plan: subscription.plan_type,
          status: subscription.status,
        } : null,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.INTERNAL_SERVER_ERROR, error.message || 'Login failed'),
      { status: 500 }
    );
  }
}
