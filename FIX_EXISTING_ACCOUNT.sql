-- ============================================
-- FIX FOR EXISTING ACCOUNTS
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- This will create user profiles for any auth users who don't have them yet
-- It will automatically detect your role from the auth metadata

INSERT INTO public.users (id, email, role, created_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'consultant')::user_role,
  au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix worked - you should see your user(s) here
SELECT id, email, role, created_at FROM public.users ORDER BY created_at DESC;
