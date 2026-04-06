/**
 * Seed script to populate charities table with test data
 * Run with: npx ts-node scripts/seed-charities.ts
 */

import { supabaseAdmin } from '@/lib/db/client';

const testCharities = [
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
    name: 'Children\'s Cancer Research Fund',
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

async function seedCharities() {
  try {
    console.log('🌱 Starting charity seed...');

    // Check if charities already exist
    const { data: existingCharities, error: fetchError } = await supabaseAdmin
      .from('charities')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error checking existing charities:', fetchError);
      return;
    }

    if (existingCharities && existingCharities.length > 0) {
      console.log('⚠️  Charities already exist. Skipping seed.');
      return;
    }

    // Insert charities
    const { error: insertError } = await supabaseAdmin
      .from('charities')
      .insert(testCharities);

    if (insertError) {
      console.error('❌ Error seeding charities:', insertError);
      return;
    }

    console.log('✅ Successfully seeded charities!');
    console.log(`📊 Added ${testCharities.length} charities`);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedCharities();
