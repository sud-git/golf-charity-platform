import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signupSchema } from '@/lib/utils/validators';
import { hashPassword, createToken, createRefreshToken } from '@/lib/auth/token';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = signupSchema.parse(body);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.USER_EXISTS, 'Email already registered'),
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: validated.email,
          password_hash: passwordHash,
          first_name: validated.firstName,
          last_name: validated.lastName,
          selected_charity_id: validated.charityId,
          charity_contribution_percent: validated.charityContributionPercent,
          account_status: 'active',
        },
      ])
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.INTERNAL_SERVER_ERROR, 'Failed to create user'),
        { status: 500 }
      );
    }

    // Create subscription
    const subscriptionAmount = validated.plan === 'monthly' ? 999 : 9999;
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: newUser.id,
          plan_type: validated.plan,
          amount_cents: subscriptionAmount,
          status: 'active',
          current_period_start: new Date().toISOString().split('T')[0],
          renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ])
      .select()
      .single();

    if (subError) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.INTERNAL_SERVER_ERROR, 'Failed to create subscription'),
        { status: 500 }
      );
    }

    // Create tokens
    const accessToken = createToken({
      userId: newUser.id,
      email: newUser.email,
      isAdmin: false,
    });

    const refreshToken = createRefreshToken({
      userId: newUser.id,
      email: newUser.email,
      isAdmin: false,
    });

    return NextResponse.json(
      createSuccessResponse({
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        isAdmin: false,
        accessToken,
        refreshToken,
        subscription: {
          id: subscription.id,
          plan: validated.plan,
          status: 'active',
        },
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.INTERNAL_SERVER_ERROR, error.message || 'Signup failed'),
      { status: 500 }
    );
  }
}