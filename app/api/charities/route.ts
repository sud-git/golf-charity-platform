import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET() {
  try {
    const { data: charities, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: error.message,
            statusCode: 500,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: charities,
    });
  } catch (error: any) {
    console.error('Charities fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error.message,
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}
