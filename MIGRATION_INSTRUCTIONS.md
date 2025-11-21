# Database Migration Instructions

## Problem Fixed
The consultant registration was failing because user profiles weren't being created in the `public.users` table after signup.

## Immediate Fix Applied
The signup page (`app/auth/signup/page.tsx`) has been updated to manually create user profiles. This fix works immediately without any database changes.

## Recommended: Apply Database Trigger

To ensure robustness and handle edge cases, you should also apply the database trigger by running the migration.

### Option 1: Using Supabase Dashboard (Recommended - Fastest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/002_add_user_trigger.sql`
5. Click **Run**

This will:
- Create a trigger that automatically creates user profiles
- Backfill any existing auth users who don't have profiles (fixes your current account!)

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:
```bash
supabase db push
```

If you don't have it installed:
```bash
npm install -g supabase
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Testing

After applying the fix:
1. Try registering a new consultant account
2. You should be redirected to `/consultant` dashboard
3. Check the database - you should see your user in `public.users` table

## What Was Changed

1. **app/auth/signup/page.tsx**: Now manually inserts user profile into database after signup
2. **supabase/migrations/002_add_user_trigger.sql**: Database trigger for automatic profile creation (belt and suspenders approach)
