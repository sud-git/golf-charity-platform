// API: PUT update score, DELETE score
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreSchema } from '@/lib/utils/validators';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = scoreSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.VALIDATION_ERROR, validation.error.message),
        { status: 400 }
      );
    }

    // Verify score belongs to user
    const { data: score, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !score) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.RECORD_NOT_FOUND, 'Score not found'),
        { status: 404 }
      );
    }

    const { score_value, score_date, course_name } = validation.data;

    // Update score
    const { data, error } = await supabase
      .from('scores')
      .update({
        score_value,
        score_date,
        course_name: course_name || null,
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
    console.error('[Score PUT]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to update score'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    // Verify score belongs to user
    const { data: score, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !score) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.RECORD_NOT_FOUND, 'Score not found'),
        { status: 404 }
      );
    }

    // Delete score
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json(
      createSuccessResponse({ message: 'Score deleted' }),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Score DELETE]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to delete score'),
      { status: 500 }
    );
  }
}
