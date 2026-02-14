# Supabase Database Documentation

This directory contains all database migrations, security policies, and documentation for the AI Guidebook application.

## 📁 Directory Structure

```
supabase/
├── migrations/
│   ├── 20260214_initial_schema_with_rls.sql    # Core database schema
│   └── 20260214_create_superuser.sql           # Superuser setup
├── functions/
│   └── chat/                                    # Edge function for AI chat
├── MIGRATION_GUIDE.md                           # How to apply migrations
├── SECURITY_RECOMMENDATIONS.md                  # Security best practices
└── README.md                                    # This file
```

## 🗄️ Database Schema

### Tables Created

| Table | Purpose | RLS Enabled | Auto-Created |
|-------|---------|-------------|--------------|
| `profiles` | User profile information | ✅ | ✅ (on signup) |
| `chat_sessions` | Chat conversation history | ✅ | ❌ |
| `chat_messages` | Individual chat messages | ✅ | ❌ |
| `user_preferences` | User app settings | ✅ | ✅ (on signup) |
| `audit_log` | Security audit trail | ✅ | ❌ |
| `superusers` | Admin privileges tracking | ✅ | ❌ |

### Key Features

- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Automatic triggers** for profile/preferences creation
- ✅ **Cascade deletes** to maintain referential integrity
- ✅ **Performance indexes** on frequently queried columns
- ✅ **Superuser system** for administrative access
- ✅ **Audit logging** for security events

## 🚀 Quick Start

### 1. Apply Migrations

Follow the instructions in [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md)

**TL;DR**: Copy and run both migration files in the Supabase SQL Editor:
1. `20260214_initial_schema_with_rls.sql`
2. `20260214_create_superuser.sql`

### 2. Create Superuser Account

1. Sign up with: **your-email@example.com**
2. Run in SQL Editor:
   ```sql
   SELECT public.grant_superuser('your-email@example.com');
   ```

### 3. Update TypeScript Types

```bash
npx supabase gen types typescript --project-id nacnxjnjvwcgzqnpkcpw > src/integrations/supabase/types.ts
```

## 🔒 Security Overview

### What's Protected

All tables use RLS to ensure:
- Users can only access **their own data**
- Anonymous users cannot read/write any data
- Superusers have read access to all tables (for support)
- Audit logs are completely locked down

### Example RLS Policy

```sql
-- Users can only view their own chat sessions
CREATE POLICY "Users can view their own chat sessions" 
    ON public.chat_sessions FOR SELECT 
    USING (auth.uid() = user_id);
```

### Service Role (Edge Functions)

The `service_role` key bypasses RLS. Use it **only in backend/edge functions** and always implement manual authorization:

```typescript
// Always verify the user first
const { data: { user }, error } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')

// Then use user.id for queries
```

## 📖 Documentation

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Step-by-step migration instructions
- **[SECURITY_RECOMMENDATIONS.md](./SECURITY_RECOMMENDATIONS.md)** - Comprehensive security guide

## 🧪 Testing RLS Policies

### Via SQL Editor

```sql
-- Test as anonymous user (should return nothing)
SET request.jwt.claim.sub TO NULL;
SELECT * FROM profiles;

-- Test as specific user
SET request.jwt.claim.sub TO 'user-uuid-here';
SELECT * FROM profiles; -- Should see only this user's profile

-- Test as superuser (should see all)
SET request.jwt.claim.sub TO 'superuser-uuid-here';
SELECT * FROM profiles; -- Should see ALL profiles
```

### Via Application

1. Create two test accounts
2. Log in as User A, create some chat sessions
3. Log in as User B
4. Try to access User A's sessions (should fail)

## 📊 Database Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
├── chat_sessions (1:many)
│       ↓
│   chat_messages (1:many)
│
├── user_preferences (1:1)
│
└── audit_log (1:many)

superusers → profiles (many:1)
```

## 🔧 Common Operations

### Grant Superuser to Another User

```sql
-- As existing superuser
SELECT public.superuser_grant_access('new-admin@example.com');
```

### Check if User is Superuser

```sql
SELECT public.is_superuser('user-uuid-here');
```

### View Audit Logs (Superuser Only)

```sql
SELECT * FROM audit_log 
ORDER BY created_at DESC 
LIMIT 100;
```

## 🐛 Troubleshooting

### "permission denied for table"
- Check if RLS is enabled: `SELECT * FROM pg_tables WHERE tablename = 'your_table';`
- Verify you're authenticated
- Check if your RLS policies are correct

### "User not found" when granting superuser
- User must sign up first
- Email must match what you used to sign up
- Check: `SELECT * FROM auth.users;`

### Cannot access data via API
- Verify RLS policies using SQL Editor
- Check that `auth.uid()` matches expected user
- Ensure you're using the correct Supabase client (anon key, not service role)

## 📝 Migration Best Practices

1. ✅ **Always test locally first** (if using Supabase local dev)
2. ✅ **Use timestamped filenames** for ordering
3. ✅ **Make migrations idempotent** (`CREATE OR REPLACE`, `IF NOT EXISTS`)
4. ✅ **Commit migrations to version control**
5. ✅ **Document breaking changes**

## 🔗 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Dashboard](https://app.supabase.com/project/nacnxjnjvwcgzqnpkcpw)

## 📞 Support

For issues or questions:
1. Check `SECURITY_RECOMMENDATIONS.md` for common patterns
2. Review `MIGRATION_GUIDE.md` for setup instructions
3. Test RLS policies using the examples above
4. Check Supabase logs in the Dashboard

---

**Last Updated**: February 14, 2026  
**Database Version**: Initial schema with RLS  
**Superuser**: Set up during initial deployment
