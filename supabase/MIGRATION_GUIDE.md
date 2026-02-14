# Database Migration Guide

This guide explains how to apply the database migrations to your Supabase project.

## Prerequisites

- Supabase account with project ID: `nacnxjnjvwcgzqnpkcpw`
- Access to Supabase Dashboard or CLI

## Option 1: Using Supabase Dashboard (Recommended)

1. **Navigate to SQL Editor**
   - Go to: https://app.supabase.com/project/nacnxjnjvwcgzqnpkcpw/sql
   - Or: Dashboard → SQL Editor

2. **Run Migration 1: Initial Schema**
   - Copy the contents of `supabase/migrations/20260214_initial_schema_with_rls.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`
   - ✅ You should see: "Success. No rows returned"

3. **Run Migration 2: Superuser Setup**
   - Copy the contents of `supabase/migrations/20260214_create_superuser.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - ✅ You should see: "Success. No rows returned"

4. **Verify Tables Created**
   - Go to: Dashboard → Database → Tables
   - You should see:
     - `profiles`
     - `chat_sessions`
     - `chat_messages`
     - `user_preferences`
     - `audit_log`
     - `superusers`

4. **Verify RLS Enabled**
   - Go to: Dashboard → Database → Policies
   - Each table should have multiple policies listed

5. **Run Migration 3: Anonymous Chat Usage**
   - Copy the contents of `supabase/migrations/20260214_anonymous_chat_usage.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - ✅ You should see: "Success. No rows returned"

## Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref nacnxjnjvwcgzqnpkcpw

# Apply migrations
npx supabase db push
```

## Setting Up Your Superuser Account

After running the migrations:

### Step 1: Sign Up
1. Go to your app or use Supabase dashboard
2. Sign up with email: **your-email@example.com**
3. Verify your email

### Step 2: Grant Superuser Privileges
1. Go to SQL Editor in Supabase Dashboard
2. Run this command:
   ```sql
   SELECT public.grant_superuser('your-email@example.com');
   ```
3. ✅ You should see: "Superuser privileges granted to your-email@example.com"

### Step 3: Verify Superuser Status
```sql
-- Check if you're in the superusers table
SELECT * FROM public.superusers;

-- Test superuser access (should see all profiles)
SELECT * FROM public.profiles;
```

## Troubleshooting

### "relation already exists"
- Tables might already exist
- Either drop them manually or skip to next migration
- SQL to drop all: (⚠️ WARNING: This deletes all data!)
  ```sql
  DROP TABLE IF EXISTS public.audit_log CASCADE;
  DROP TABLE IF EXISTS public.superusers CASCADE;
  DROP TABLE IF EXISTS public.user_preferences CASCADE;
  DROP TABLE IF EXISTS public.chat_messages CASCADE;
  DROP TABLE IF EXISTS public.chat_sessions CASCADE;
  DROP TABLE IF EXISTS public.profiles CASCADE;
  DROP TYPE IF EXISTS message_role CASCADE;
  ```

### "extension uuid-ossp does not exist"
- Extensions might not be enabled
- Run manually:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  ```

### "User not found" when granting superuser
- Make sure you've signed up first
- Check that email matches what you used to sign up
- Verify user exists:
  ```sql
  SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
  ```

### RLS prevents access
- When testing, remember RLS is active
- Use service role key for admin operations
- Or grant yourself superuser access

## Next Steps

After successful migration:

1. ✅ **Test Authentication**
   - Sign up with your admin email
   - Verify profile auto-created
   - Check preferences auto-created

2. ✅ **Update TypeScript Types**
   - Generate new types from database
   - Update `src/integrations/supabase/types.ts`

3. ✅ **Test RLS Policies**
   - Try accessing data as different users
   - Verify isolation between users

4. ✅ **Read Security Recommendations**
   - Review `supabase/SECURITY_RECOMMENDATIONS.md`
   - Understand what's secured and why

## Generating TypeScript Types

To keep your TypeScript types in sync:

```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id nacnxjnjvwcgzqnpkcpw > src/integrations/supabase/types.ts
```

Or manually from the Supabase Dashboard:
1. Go to: Dashboard → API Docs → TypeScript
2. Copy the generated types
3. Replace contents of `src/integrations/supabase/types.ts`

## Migration Files Reference

- **20260214_initial_schema_with_rls.sql**
  - Creates all tables
  - Enables RLS
  - Adds indexes
  - Sets up triggers

- **20260214_create_superuser.sql**
  - Superuser functions
  - RLS bypass policies for admins
  - Setup instructions

- **20260214_anonymous_chat_usage.sql**
  - Anonymous usage tracking table
  - Rate limiting logic (3 questions/day)
  - Automatic cleanup function
