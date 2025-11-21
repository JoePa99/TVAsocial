import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This endpoint backfills user profiles for auth users who don't have them
// TEMPORARY FIX - Remove this after fixing all accounts
export async function POST() {
  try {
    // Create admin client (bypasses RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch auth users: ${authError.message}`);
    }

    // Get existing user profiles
    const { data: existingUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id');

    if (usersError) {
      throw new Error(`Failed to fetch existing users: ${usersError.message}`);
    }

    const existingUserIds = new Set(existingUsers?.map(u => u.id) || []);

    // Find users who need profiles created
    const usersToCreate = authUsers.users
      .filter(au => !existingUserIds.has(au.id))
      .map(au => ({
        id: au.id,
        email: au.email || '',
        role: (au.user_metadata?.role || 'consultant') as 'consultant' | 'agency' | 'client',
        created_at: au.created_at,
      }));

    if (usersToCreate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All auth users already have profiles',
        fixed: 0,
      });
    }

    // Insert missing profiles
    const { data: insertedUsers, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(usersToCreate)
      .select();

    if (insertError) {
      throw new Error(`Failed to create user profiles: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${insertedUsers?.length || 0} user profile(s)`,
      fixed: insertedUsers?.length || 0,
      users: insertedUsers?.map(u => ({
        email: u.email,
        role: u.role,
      })),
    });
  } catch (error: any) {
    console.error('Error fixing user profiles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fix user profiles',
      },
      { status: 500 }
    );
  }
}
