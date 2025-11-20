# MAIA Database Schema Deployment Instructions

## Overview
This document provides step-by-step instructions to deploy the complete MAIA SSS database schema to Supabase.

## Files Created
- **Migration File**: `supabase/migrations/001_initial_schema.sql`
- **Deployment Scripts**:
  - `scripts/deploy_schema.py` (requires DB password)
  - `scripts/deploy_schema_api.py` (deployment guide)

## Deployment Method 1: Supabase SQL Editor (RECOMMENDED - EASIEST)

### Steps:

1. **Open Supabase SQL Editor**
   - Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new

2. **Copy the Migration SQL**
   - Open file: `c:\Projects\maia\supabase\migrations\001_initial_schema.sql`
   - Select all content (Ctrl+A)
   - Copy (Ctrl+C)

3. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor (Ctrl+V)
   - Click "Run" button or press Ctrl+Enter
   - Wait for execution to complete

4. **Verify Success**
   - Check for success message in the SQL Editor
   - Go to Table Editor: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor
   - Confirm all 16 tables are visible

## Deployment Method 2: Using Python Script with Database Password

### Prerequisites:
- Python 3.7+
- psycopg2 library (auto-installed by script)

### Steps:

1. **Get Database Password**
   - Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/settings/database
   - Find "Database Password" section
   - Copy the password

2. **Set Environment Variable**
   ```bash
   # On Windows (PowerShell)
   $env:SUPABASE_DB_PASSWORD = "your_password_here"

   # On Windows (CMD)
   set SUPABASE_DB_PASSWORD=your_password_here

   # On Mac/Linux
   export SUPABASE_DB_PASSWORD='your_password_here'
   ```

3. **Run Deployment Script**
   ```bash
   cd c:\Projects\maia
   python scripts/deploy_schema.py
   ```

4. **Review Output**
   - Script will show connection status
   - Display list of created tables
   - Show RLS status for each table
   - Report policy, index, and function counts

## Deployment Method 3: Using Supabase CLI

### Prerequisites:
```bash
npm install -g supabase
```

### Steps:

1. **Login to Supabase**
   ```bash
   supabase login
   ```

2. **Link Project**
   ```bash
   cd c:\Projects\maia
   supabase link --project-ref bexudrmrspbyhkcqrtse
   ```

3. **Push Migration**
   ```bash
   supabase db push
   ```

## What Gets Deployed

### Tables (16 total):
1. `users` - User accounts linked to auth.users
2. `students` - Student information
3. `cases` - Case management (with `is_urgent` field)
4. `interventions` - Academic/SEL/Distinctions interventions
5. `sessions` - Session documentation
6. `evaluations` - SNAP and other evaluations
7. `evaluation_steps` - Evaluation workflow steps
8. `protocol_steps` - Bullying/Child Protection/Conflict Resolution steps
9. `parent_meetings` - Parent meeting tracking (with `action_plan` JSONB field)
10. `action_plan_items` - **NEW** Action plan follow-up tracking
11. `group_interventions` - Group-based interventions
12. `group_sessions` - Group session documentation
13. `referrals` - KID Talk and behavior referrals
14. `behavior_incidents` - Google Forms synced incidents (with restorative process fields)
15. `files` - File attachments
16. `audit_log` - Compliance and security audit trail

### Critical New Fields Added:
- **cases.is_urgent** (BOOLEAN) - Flag for urgent/safeguarding cases
- **parent_meetings.action_plan** (JSONB) - Action plan storage
- **parent_meetings.meeting_status** (TEXT) - Track meeting status
- **behavior_incidents.restorative_process_completed** (BOOLEAN)
- **behavior_incidents.restorative_date** (DATE)
- **behavior_incidents.restorative_staff_id** (UUID)
- **behavior_incidents.restorative_notes** (TEXT)

### Indexes Created (40+):
- Performance indexes on all foreign keys
- Indexes on frequently queried fields (status, dates, types)
- Composite indexes for common query patterns

### RLS Policies (50+):
- **SSS_STAFF**: Full access to all cases and data
- **TEACHER**: Read access to own students' cases and referrals
- **PRINCIPAL_ADMIN**: Read-only access to all data
- **PARENT**: No access yet (future feature)

### Helper Functions (3):
1. `get_staff_case_load(staff_id)` - Get case load statistics per staff member
2. `get_weekly_action_items()` - Get upcoming action plan items for the week
3. `get_tier_distribution_by_grade()` - Calculate tier distribution by grade level

### Triggers:
- `updated_at` auto-update triggers on all tables

## Verification Steps

After deployment, verify the following:

### 1. Check All Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected result: 16 tables

### 2. Verify RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`

### 3. Check RLS Policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Expected result: 50+ policies

### 4. Test Helper Functions
```sql
-- Test tier distribution
SELECT * FROM get_tier_distribution_by_grade();

-- Test weekly action items (will be empty initially)
SELECT * FROM get_weekly_action_items();
```

### 5. Verify Foreign Keys
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### 6. Test INSERT with RLS
```sql
-- This should work for SSS_STAFF role
-- Will fail without proper auth context
INSERT INTO students (name, grade)
VALUES ('Test Student', '1st Grade');
```

## Troubleshooting

### Error: "relation already exists"
- Some tables may already exist
- Solution: Drop existing tables or modify migration to use `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"
- Check that you're using the service role key or database password
- Verify RLS policies allow your user role to access the data

### Error: "foreign key constraint"
- Ensure referenced tables are created first
- Check that auth.users table exists in Supabase

### Error: "syntax error"
- Check for copy-paste issues
- Ensure entire SQL file was copied
- Try executing in smaller chunks

## Next Steps After Deployment

1. **Create Initial Users**
   - Add SSS Staff users
   - Add test teacher accounts
   - Add admin accounts

2. **Test RLS Policies**
   - Login as different user roles
   - Verify data access restrictions work

3. **Populate Reference Data**
   - Add school information
   - Import existing students (if any)
   - Set up user roles and permissions

4. **Test Database Functions**
   - Run tier distribution report
   - Test action plan reminders
   - Verify case load calculations

5. **Configure Supabase Auth**
   - Enable Google OAuth
   - Set up email templates
   - Configure redirect URLs

## Support

If you encounter issues:
1. Check Supabase Dashboard logs: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/logs
2. Review error messages carefully
3. Verify credentials and permissions
4. Contact vixi.agency support

---

**Deployment prepared by**: DatabaseArchitectAgent
**Date**: November 18, 2025
**Project**: MAIA SSS (Student Support Services)
