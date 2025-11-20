# Supabase Setup Guide

## Prerequisites
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API

## Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Update the following variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

## Database Setup

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI
1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

## What This Sets Up

### Tables
- **users**: Extended user profiles with roles (consultant, agency, client)
- **clients**: Client organizations
- **strategies**: Social media strategies per client
- **series**: Recurring content series/themes
- **posts**: Individual social media posts
- **comments**: Comments on posts for collaboration

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- **Consultants**: Full access to all data
- **Agencies**: Access to assigned clients only
- **Clients**: Access to their own data only

### Storage Buckets
- **documents**: For company OS uploads (private)
- **images**: For generated social media images (public)

## Authentication Setup

### Email/Password Auth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable "Email" provider
3. Configure email templates if desired

### Creating Users
Users can be created through:
1. The Supabase dashboard (Authentication > Users)
2. The application's auth endpoints (once implemented)
3. Direct SQL inserts (for development)

Example SQL to create a test consultant user:
```sql
-- First, create the auth user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  uuid_generate_v4(),
  'consultant@example.com',
  crypt('password123', gen_salt('bf')),
  now()
);

-- Then, create the public user profile
INSERT INTO public.users (id, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'consultant@example.com'),
  'consultant@example.com',
  'consultant'
);
```

## Realtime Setup
For real-time features (comments, status updates):
1. Go to Database > Replication
2. Enable replication for the tables you want to subscribe to:
   - `comments`
   - `posts` (for status updates)

## Troubleshooting

### "relation does not exist" errors
- Make sure migrations have been run successfully
- Check that you're connected to the correct database

### RLS policy errors
- Verify that the authenticated user has a matching record in `public.users`
- Check that the user's role is set correctly
- Review policy conditions in the migration file

### Storage errors
- Ensure storage buckets are created
- Verify storage policies allow the operation
- Check file size limits in Supabase settings
