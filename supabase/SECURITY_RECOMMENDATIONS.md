# Database Security Recommendations

This document outlines the security policies implemented in your AI Guidebook application and provides best practices for maintaining and extending your database.

## Overview

Your database implements **Row Level Security (RLS)** on all tables to ensure users can only access their own data. RLS is enforced at the database level, making it effective even if API bugs or vulnerabilities exist in your application code.

## Security Model Summary

### 🔒 Highly Secured Tables

#### `audit_log` - Admin/Service Role Only
- **Access**: Service role and superusers only
- **Purpose**: Track security events and database operations
- **Why**: Prevents users from tampering with security logs
- **Usage**: Only accessible via backend/edge functions with service role credentials

#### `superusers` - Superuser Access Only
- **Access**: Superusers can view; service role can modify
- **Purpose**: Track administrative privileges
- **Why**: Prevents privilege escalation attacks

### 👤 User-Scoped Tables (Users Access Only Their Own Data)

#### `profiles`
- **Rules**: Users can SELECT, INSERT, UPDATE their own profile
- **Security**: Tied to `auth.uid()` - the authenticated user's ID
- **Auto-created**: Profile automatically created on signup via trigger

#### `chat_sessions`
- **Rules**: Full CRUD access to own sessions only
- **Security**: Filtered by `user_id = auth.uid()`
- **Cascading**: Deleting a session deletes all related messages

#### `chat_messages`
- **Rules**: Users can SELECT and INSERT messages in their own sessions
- **Security**: Two-level check - session ownership + user_id match
- **Cascading**: Messages deleted when parent session is deleted

#### `user_preferences`
- **Rules**: Full CRUD access to own preferences
- **Security**: One row per user, tied to user_id
- **Auto-created**: Default preferences created on signup

## Superuser Privileges

Superusers (configured during setup) have:
- ✅ Read access to all user data (for support/debugging)
- ✅ Access to audit logs
- ✅ Ability to grant superuser privileges to others
- ❌ Still bound by RLS for write operations (safety measure)

## What Should NOT Be Secured

Currently, all tables require authentication. However, you might want to create **public tables** for:

### Potential Public Content

1. **Public AI Tools Directory**
   ```sql
   CREATE TABLE public.ai_tools (
       id UUID PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       category TEXT,
       is_published BOOLEAN DEFAULT false
   );
   
   -- Allow anyone to read published tools
   CREATE POLICY "Anyone can view published tools"
       ON public.ai_tools FOR SELECT
       USING (is_published = true);
   
   -- Only authenticated users can suggest tools
   CREATE POLICY "Authenticated users can insert tools"
       ON public.ai_tools FOR INSERT
       TO authenticated
       WITH CHECK (true);
   ```

2. **Public Guidelines/Documentation**
   - Blog posts
   - Tutorial content
   - General AI guidelines (non-user-specific)

3. **Community Features**
   - Public comments
   - Ratings/reviews
   - Shared templates

## Best Practices

### ✅ DO

1. **Always enable RLS on new tables**
   ```sql
   CREATE TABLE new_table (...);
   ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
   ```

2. **Test RLS policies thoroughly**
   - Test as anonymous user
   - Test as different authenticated users
   - Verify users cannot access others' data

3. **Use the `auth.uid()` function**
   - This returns the currently authenticated user's ID
   - Forms the basis of most RLS policies

4. **Leverage CASCADE deletes**
   - Automatically clean up related data
   - Prevents orphaned records

5. **Use SECURITY DEFINER carefully**
   - Only for trusted functions
   - Always validate input
   - Check permissions explicitly

### ❌ DON'T

1. **Never bypass RLS in client code**
   - Don't use the service role key in frontend
   - Client should only use anon/authenticated keys

2. **Don't store sensitive data in public tables**
   - User emails, passwords, PII require RLS
   - Even with "published" flags

3. **Don't trust client-side validation**
   - RLS is your last line of defense
   - Always validate at database level

4. **Don't create overly permissive policies**
   ```sql
   -- BAD: Too permissive
   CREATE POLICY "bad_policy" ON my_table
       FOR SELECT USING (true);
   
   -- GOOD: Scoped to user
   CREATE POLICY "good_policy" ON my_table
       FOR SELECT USING (auth.uid() = user_id);
   ```

## Edge Functions & Service Role

Your chat function (`supabase/functions/chat/index.ts`) uses the service role, which **bypasses RLS**. You must implement authorization checks manually:

```typescript
import { createClient } from '@supabase/supabase-js'

export async function handler(req: Request) {
    // Get authenticated user from request
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
    )
    
    // Verify user authentication
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    if (error || !user) {
        return new Response('Unauthorized', { status: 401 })
    }
    
    // Now you can safely use user.id for authorization
    // ...
}
```

## Testing RLS Policies

### Via Supabase Dashboard SQL Editor

1. **Test as anonymous user**:
   ```sql
   SET request.jwt.claim.sub TO NULL;
   SELECT * FROM profiles; -- Should return 0 rows
   ```

2. **Test as specific user**:
   ```sql
   -- Get a user ID first
   SELECT id FROM auth.users LIMIT 1;
   
   -- Impersonate that user
   SET request.jwt.claim.sub TO 'user-uuid-here';
   SELECT * FROM profiles; -- Should return only that user's profile
   ```

3. **Test superuser access**:
   ```sql
   -- After granting superuser to your admin account
   SET request.jwt.claim.sub TO 'your-superuser-uuid';
   SELECT * FROM profiles; -- Should return ALL profiles
   ```

## Common RLS Patterns

### 1. Simple User Ownership
```sql
CREATE POLICY "policy_name" ON table_name
    FOR SELECT
    USING (auth.uid() = user_id);
```

### 2. Related Table Access
```sql
CREATE POLICY "policy_name" ON child_table
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM parent_table
            WHERE parent_table.id = child_table.parent_id
            AND parent_table.user_id = auth.uid()
        )
    );
```

### 3. Public Read, Authenticated Write
```sql
CREATE POLICY "public_read" ON table_name
    FOR SELECT
    USING (true);

CREATE POLICY "authenticated_write" ON table_name
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
```

### 4. Time-Based Access
```sql
CREATE POLICY "published_content" ON articles
    FOR SELECT
    USING (
        is_published = true 
        AND published_at <= NOW()
    );
```

## Monitoring & Auditing

The `audit_log` table captures important events. Consider logging:
- Profile changes
- Sensitive data access
- Failed authentication attempts
- Privilege escalations

To log events from triggers:
```sql
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (
        NEW.id,
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        row_to_json(OLD),
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_profile_updates
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_changes();
```

## Storage Bucket Security

If you add file uploads, apply RLS to storage buckets:

```typescript
// In Supabase Dashboard > Storage > Policies

// Allow users to upload to their own folder
{
  "name": "Users can upload to own folder",
  "definition": "bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text"
}

// Allow users to read their own files
{
  "name": "Users can read own files",
  "definition": "bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text"
}
```

## Migration Best Practices

1. **Use timestamped filenames**: `YYYYMMDD_description.sql`
2. **Make migrations idempotent**: Use `IF NOT EXISTS`, `CREATE OR REPLACE`
3. **Test locally first**: Use Supabase local development
4. **Version control**: Commit all migrations to git
5. **Rollback plan**: Always have a way to undo changes

## Summary

✅ **What IS Secured**:
- All user data (profiles, chats, preferences)
- Audit logs (superuser/service role only)
- Superuser privileges

⚠️ **What's NOT Secured** (currently):
- No public tables exist yet
- All content requires authentication

🔐 **Security Layers**:
1. RLS policies (database level)
2. Authentication (Supabase Auth)
3. Application logic (your frontend/backend)
4. Edge function authorization (manual checks)

Remember: **Defense in depth** - each layer provides protection even if others fail!
