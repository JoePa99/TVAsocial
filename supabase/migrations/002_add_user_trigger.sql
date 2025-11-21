-- Migration: Add automatic user profile creation trigger
-- This trigger creates a user profile in public.users when a new auth user signs up

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the user doesn't already exist (prevents duplicates)
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'agency'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: Create profiles for any existing auth users without profiles
-- This helps fix any users who registered before the trigger was created
INSERT INTO public.users (id, email, role, created_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'agency')::user_role,
  au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;
