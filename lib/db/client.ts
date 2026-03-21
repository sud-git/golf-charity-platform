// Supabase Client Setup

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Note: Empty strings are used as fallbacks so the module loads during build.
// The Supabase client will fail gracefully at runtime if env vars are not set.

// Client-side client (use anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client (use service role key for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

export type SupabaseClient = typeof supabase;
