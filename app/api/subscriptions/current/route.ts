export const dynamic = 'force-dynamic';

// API: GET current subscription
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.SUBSCRIPTION_NOT_FOUND, 'No active subscription'),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(data),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Subscription GET]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch subscription'),
      { status: 500 }
    );
  }
}
