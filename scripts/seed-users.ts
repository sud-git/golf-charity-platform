/**
 * Seed script to create test users in the database
 * Users will be ready to log in without signup
 * Run with: npx ts-node scripts/seed-users.ts
 */

import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../lib/db/client.js';

const testUsers = [
  {
    email: 'testuser@gmail.com',
    password: 'Test123!@',
    firstName: 'Test',
    lastName: 'User',
    charityId: null, // Will be populated from charities table
    charityName: 'Red Cross',
  },
  {
    email: 'admin@golfcharity.app',
    password: 'Admin123!@',
    firstName: 'Admin',
    lastName: 'User',
    charityId: null, // Will be populated from charities table
    charityName: 'World Wildlife Fund',
  },
];

async function seedUsers() {
  try {
    console.log('🌱 Starting user seed...');

    // Get charities to link users
    const { data: charities, error: charityError } = await supabaseAdmin
      .from('charities')
      .select('id, name')
      .in('name', testUsers.map((u) => u.charityName));

    if (charityError || !charities || charities.length === 0) {
      console.error(
        '❌ Error fetching charities. Make sure to seed charities first:',
        charityError
      );
      return;
    }

    console.log(`✅ Found ${charities.length} charities`);

    // Create charity map
    const charityMap: { [key: string]: string } = {};
    charities.forEach((c) => {
      charityMap[c.name] = c.id;
    });

    // Hash passwords and prepare users
    const usersToInsert = await Promise.all(
      testUsers.map(async (user) => {
        const passwordHash = await bcrypt.hash(user.password, 10);
        return {
          email: user.email,
          password_hash: passwordHash,
          first_name: user.firstName,
          last_name: user.lastName,
          selected_charity_id: charityMap[user.charityName],
          email_verified: true,
          email_verified_at: new Date().toISOString(),
        };
      })
    );

    // Check if users already exist
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('email')
      .in(
        'email',
        usersToInsert.map((u) => u.email)
      );

    if (existingUsers && existingUsers.length > 0) {
      console.log(
        '⚠️  Some users already exist. Skipping to avoid duplicates.'
      );
      existingUsers.forEach((u) => console.log(`   - ${u.email}`));
      return;
    }

    // Insert users
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert(usersToInsert);

    if (insertError) {
      console.error('❌ Error seeding users:', insertError);
      return;
    }

    console.log('✅ Successfully seeded users!');
    console.log('\n📝 Test Credentials:');
    testUsers.forEach((user) => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Charity: ${user.charityName}\n`);
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedUsers();
