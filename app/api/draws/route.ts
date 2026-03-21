// API: GET draws, POST create draw (admin)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

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

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '12');

    let query = supabase
      .from('draws')
      .select('*')
      .order('draw_month', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(
      createSuccessResponse(data),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Draws GET]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch draws'),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add admin role check
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { draw_month, mode } = body;

    if (!draw_month || !mode) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Missing required fields'),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('draws')
      .insert({
        draw_month,
        mode,
        status: 'pending',
        random_numbers: [],
        total_pool_amount_cents: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      createSuccessResponse(data),
      { status: 201 }
    );
  } catch (err) {
    console.error('[Draws POST]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to create draw'),
      { status: 500 }
    );
  }
}
