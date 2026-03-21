// API: POST verify winner (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = req.headers.get('x-is-admin') === 'true';
    if (!isAdmin) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.FORBIDDEN, 'Admin only'),
        { status: 403 }
      );
    }

    const body = await req.json();
    const { approved, rejection_reason } = body;

    if (approved === undefined) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Missing approved field'),
        { status: 400 }
      );
    }

    const status = approved ? 'verified' : 'rejected';

    const { data, error } = await supabase
      .from('winners')
      .update({
        verification_status: status,
        rejection_reason: !approved ? rejection_reason : null,
        verified_at: approved ? new Date().toISOString() : null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      createSuccessResponse(data),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Winner Verify]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to verify winner'),
      { status: 500 }
    );
  }
}
