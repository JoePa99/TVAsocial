import { createClient } from './supabase/server';
import type { UserRole } from '@/types';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Try to get user data from database
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // If database query fails (e.g., RLS not set up), use metadata as fallback
  if (!userData && user.user_metadata?.role) {
    return {
      id: user.id,
      email: user.email!,
      role: user.user_metadata.role as UserRole,
      created_at: user.created_at,
    };
  }

  return userData;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function canAccessClient(clientId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Consultants can access all clients
  if (user.role === 'consultant') return true;

  // Agencies can access assigned clients
  if (user.role === 'agency') {
    return user.assigned_clients?.includes(clientId) || false;
  }

  // Clients can access their own data
  if (user.role === 'client') {
    return user.client_id === clientId;
  }

  return false;
}
