# 🚀 Quick Start: Database Security Setup

## Apply Your Database Migrations

### 1. Open Supabase SQL Editor
👉 https://app.supabase.com/project/nacnxjnjvwcgzqnpkcpw/sql

### 2. Run First Migration
Copy and paste the contents of:
```
supabase/migrations/20260214_initial_schema_with_rls.sql
```
Click **RUN** ▶️

### 3. Run Second Migration
Copy and paste the contents of:
```
supabase/migrations/20260214_create_superuser.sql
```
Click **RUN** ▶️

### 4. Sign Up with Your Email
**Email**: your-email@example.com

### 5. Grant Yourself Superuser
In SQL Editor, run:
```sql
SELECT public.grant_superuser('your-email@example.com');
```

### 6. Verify Everything Works
```sql
-- See your superuser status
SELECT * FROM superusers;

-- See all tables
SELECT * FROM profiles;
SELECT * FROM chat_sessions;
SELECT * FROM user_preferences;
```

## ✅ You're Done!

Your database now has:
- ✅ 6 secured tables with RLS
- ✅ Superuser account (you!)
- ✅ Automatic profile creation
- ✅ Complete security policies

## 📚 Need More Info?

- **Step-by-Step Guide**: `supabase/MIGRATION_GUIDE.md`
- **Security Details**: `supabase/SECURITY_RECOMMENDATIONS.md`
- **Full Walkthrough**: See the walkthrough artifact
- **Quick Reference**: `supabase/README.md`

## 🔧 Update TypeScript Types (Optional)

```bash
npx supabase gen types typescript --project-id nacnxjnjvwcgzqnpkcpw > src/integrations/supabase/types.ts
```

---

**Questions?** Check the troubleshooting section in `MIGRATION_GUIDE.md`
