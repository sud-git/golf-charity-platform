// API: GET scores, POST new score
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreSchema } from '@/lib/utils/validators';
import { createSuccessResponse, createErrorResponse, ErrorCodes, getHttpStatus } from '@/lib/utils/api-response';

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

    // Fetch last 5 scores
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .limit(5);

    if (error) throw error;

    const average = data && data.length > 0 
      ? Math.round((data.reduce((sum, s) => sum + s.score_value, 0) / data.length) * 100) / 100
      : 0;

    return NextResponse.json(
      createSuccessResponse({ scores: data, average }),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Scores GET]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch scores'),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { score_value, score_date, course_name } = validation.data;

    // Check how many scores user has
    const { data: existingScores, error: fetchError } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('score_date', { ascending: true });

    if (fetchError) throw fetchError;

    // Delete oldest score if count >= 5
    if (existingScores && existingScores.length >= 5) {
      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .eq('id', existingScores[0].id);
      if (deleteError) throw deleteError;
    }

    // Insert new score
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: userId,
        score_value,
        score_date,
        course_name: course_name || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Fetch updated scores
    const { data: updatedScores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .limit(5);

    const average = updatedScores && updatedScores.length > 0
      ? Math.round((updatedScores.reduce((sum, s) => sum + s.score_value, 0) / updatedScores.length) * 100) / 100
      : 0;

    return NextResponse.json(
      createSuccessResponse({ score: data, scores: updatedScores, average }),
      { status: 201 }
    );
  } catch (err) {
    console.error('[Scores POST]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to create score'),
      { status: 500 }
    );
  }
}
