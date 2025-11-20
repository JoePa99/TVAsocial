import { createClient } from './supabase/server';
import type { UserRole } from '@/types';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

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
