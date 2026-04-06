import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Starting charity seed...');
    console.log('Supabase connection:', supabaseAdmin ? 'OK' : 'FAILED');

    const charities = [
      {
        name: 'Red Cross',
        description: 'International humanitarian organization providing disaster relief and medical assistance',
        slug: 'red-cross',
        category: 'Healthcare',
        featured: true,
        status: 'active',
      },
      {
        name: 'World Wildlife Fund',
        description: 'Conserving nature, wildlife, and natural resources globally',
        slug: 'wwf',
        category: 'Environment',
        featured: true,
        status: 'active',
      },
      {
        name: 'Doctors Without Borders',
        description: 'International medical humanitarian organization providing emergency aid',
        slug: 'doctors-without-borders',
        category: 'Healthcare',
        featured: false,
        status: 'active',
      },
      {
        name: 'Local Food Bank',
        description: 'Community-based food assistance and hunger relief program',
        slug: 'local-food-bank',
        category: 'Social',
        featured: false,
        status: 'active',
      },
      {
        name: 'Childrens Cancer Research Fund',
        description: 'Funding innovative research to combat childhood cancer',
        slug: 'childrens-cancer-fund',
        category: 'Healthcare',
        featured: true,
        status: 'active',
      },
      {
        name: 'Ocean Cleanup Initiative',
        description: 'Protecting oceans and marine life from plastic pollution',
        slug: 'ocean-cleanup',
        category: 'Environment',
        featured: false,
        status: 'active',
      },
    ];

    // Check if charities already exist
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('charities')
      .select('count')
      .single();

    console.log('Existing charities check:', checkError?.message || `Count: ${existing}`);

    // Insert charities
    const { data, error } = await supabaseAdmin
      .from('charities')
      .insert(charities)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INSERT_ERROR',
            message: error.message,
            details: error,
          },
        },
        { status: 500 }
      );
    }

    console.log('Successfully inserted charities:', data?.length);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || 0} charities`,
      data,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEED_ERROR',
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}
