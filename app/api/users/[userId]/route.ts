// API: GET user profile, PUT update profile
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Unauthorized'),
        { status: 401 }
      );
    }

    // Users can only fetch their own profile
    if (userId !== params.userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.FORBIDDEN, 'Cannot access other user profiles'),
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.userId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.USER_NOT_FOUND, 'User not found'),
        { status: 404 }
      );
    }

    // Remove password hash
    const { password_hash, ...userWithoutPassword } = data;

    return NextResponse.json(
      createSuccessResponse(userWithoutPassword),
      { status: 200 }
    );
  } catch (err) {
    console.error('[User GET]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch user'),
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId || userId !== params.userId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.FORBIDDEN, 'Cannot update other users'),
        { status: 403 }
      );
    }

    const body = await req.json();
    const { first_name, last_name, selected_charity_id, charity_contribution_percent } = body;

    const updateData: any = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (selected_charity_id !== undefined) updateData.selected_charity_id = selected_charity_id;
    if (charity_contribution_percent !== undefined) {
      if (charity_contribution_percent < 10 || charity_contribution_percent > 100) {
        return NextResponse.json(
          createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Contribution must be 10-100%'),
          { status: 400 }
        );
      }
      updateData.charity_contribution_percent = charity_contribution_percent;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', params.userId)
      .select()
      .single();

    if (error) throw error;

    const { password_hash, ...userWithoutPassword } = data;

    return NextResponse.json(
      createSuccessResponse(userWithoutPassword),
      { status: 200 }
    );
  } catch (err) {
    console.error('[User PUT]', err);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to update user'),
      { status: 500 }
    );
  }
}
