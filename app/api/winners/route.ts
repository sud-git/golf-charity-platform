export const dynamic = 'force-dynamic';

// API: GET winners, POST verify winner (admin)
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
    const isAdmin = req.headers.get('x-is-admin') === 'true';

    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase.from('winners').select('*');

    // Users see only their own, admins see all
    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('verification_status', status);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json(
      createSuccessResponse(data),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Winners GET]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch winners'),
      { status: 500 }
    );
  }
}
