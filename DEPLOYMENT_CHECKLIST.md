# MAIA SSS Database Deployment Checklist

Use this checklist to ensure a successful database deployment to Supabase.

---

## Pre-Deployment Preparation

- [ ] **Review Requirements**
  - [ ] Read `DATABASE_DEPLOYMENT_SUMMARY.md`
  - [ ] Review `ATLAS_SSS_APP_IMPLEMENTATION_ROADMAP.md` (lines 30-320)
  - [ ] Check `MAIA_CLARIFICATION_RESPONSES.md` for Wendy's requirements

- [ ] **Verify Supabase Access**
  - [ ] Can access Supabase Dashboard: https://app.supabase.com/project/bexudrmrspbyhkcqrtse
  - [ ] Have project URL: `https://bexudrmrspbyhkcqrtse.supabase.co`
  - [ ] Have service role key (stored in `.env.local`)
  - [ ] Can access SQL Editor: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new

- [ ] **Backup Existing Data** (if any)
  - [ ] Export any existing tables
  - [ ] Document current schema (if any)
  - [ ] Save current RLS policies

---

## Deployment Execution

### Step 1: Deploy Schema

- [ ] **Option A: SQL Editor (Recommended)**
  - [ ] Open Supabase SQL Editor
  - [ ] Open file: `supabase/migrations/001_initial_schema.sql`
  - [ ] Copy entire file contents (Ctrl+A, Ctrl+C)
  - [ ] Paste into SQL Editor (Ctrl+V)
  - [ ] Click "Run" button or press Ctrl+Enter
  - [ ] Wait for "Success" message
  - [ ] Check for any error messages

- [ ] **Option B: Python Script (Alternative)**
  - [ ] Get database password from Supabase settings
  - [ ] Set environment variable: `SUPABASE_DB_PASSWORD`
  - [ ] Run: `python scripts/deploy_schema.py`
  - [ ] Review output for success confirmation

### Step 2: Verify Deployment

- [ ] **Run Verification Queries**
  - [ ] Open file: `supabase/migrations/002_verification_queries.sql`
  - [ ] Copy and paste into SQL Editor
  - [ ] Run all verification tests
  - [ ] Confirm all tests show "PASS" status

- [ ] **Check Table Creation**
  - [ ] Go to Table Editor: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor
  - [ ] Verify 16 tables are visible:
    - [ ] users
    - [ ] students
    - [ ] cases
    - [ ] interventions
    - [ ] sessions
    - [ ] evaluations
    - [ ] evaluation_steps
    - [ ] protocol_steps
    - [ ] parent_meetings
    - [ ] action_plan_items (NEW)
    - [ ] group_interventions
    - [ ] group_sessions
    - [ ] referrals
    - [ ] behavior_incidents
    - [ ] files
    - [ ] audit_log

- [ ] **Verify Critical New Fields**
  - [ ] `cases` table has `is_urgent` column
  - [ ] `parent_meetings` table has `action_plan` column (JSONB)
  - [ ] `parent_meetings` table has `meeting_status` column
  - [ ] `behavior_incidents` table has restorative process fields:
    - [ ] `restorative_process_completed`
    - [ ] `restorative_date`
    - [ ] `restorative_staff_id`
    - [ ] `restorative_notes`
  - [ ] `action_plan_items` table exists

- [ ] **Check RLS Policies**
  - [ ] Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/policies
  - [ ] Verify RLS is enabled on all tables
  - [ ] Confirm 50+ policies exist
  - [ ] Check policies for:
    - [ ] SSS_STAFF (full access)
    - [ ] TEACHER (read own students)
    - [ ] PRINCIPAL_ADMIN (read all)

- [ ] **Verify Indexes**
  - [ ] Run query: `SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';`
  - [ ] Confirm 40+ indexes created
  - [ ] Check critical indexes exist:
    - [ ] `idx_cases_is_urgent`
    - [ ] `idx_action_plan_items_due_date`
    - [ ] `idx_behavior_incidents_restorative_completed`

- [ ] **Test Helper Functions**
  - [ ] Run: `SELECT * FROM get_tier_distribution_by_grade();` (should not error)
  - [ ] Run: `SELECT * FROM get_weekly_action_items();` (should not error)
  - [ ] Verify functions exist in Database Functions list

---

## Post-Deployment Setup

### Step 3: Create Initial Users

- [ ] **Create SSS Staff Users**
  - [ ] Go to Auth Users: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/users
  - [ ] Click "Add User"
  - [ ] Create Wendy Aragón (wendy@atlas.edu)
  - [ ] Copy user ID
  - [ ] Run INSERT into `users` table with role 'SSS_STAFF'
  - [ ] Create other SSS team members (Lindsey, etc.)

- [ ] **Create Test Teacher User**
  - [ ] Create auth user for a teacher
  - [ ] Add to `users` table with role 'TEACHER'
  - [ ] Test RLS: Teacher should only see own students

- [ ] **Create Admin User**
  - [ ] Create auth user for principal
  - [ ] Add to `users` table with role 'PRINCIPAL_ADMIN'
  - [ ] Test RLS: Admin should have read-only access to all

### Step 4: Add Sample Data

- [ ] **Create Test Students**
  - [ ] Use `supabase/QUICK_START.sql` for examples
  - [ ] Add 3-5 sample students across different grades
  - [ ] Verify students appear in Table Editor

- [ ] **Create Sample Cases**
  - [ ] Create at least one case per type:
    - [ ] ACADEMIC_SUPPORT
    - [ ] SEL
    - [ ] URGENT (with is_urgent = true)
  - [ ] Test filtering by is_urgent
  - [ ] Test filtering by case_type

- [ ] **Test Interventions & Sessions**
  - [ ] Create a Tier 2 intervention for one case
  - [ ] Document a session for that intervention
  - [ ] Verify updated_at timestamps work

- [ ] **Test Parent Meetings & Action Plans**
  - [ ] Schedule a parent meeting
  - [ ] Create 2-3 action plan items
  - [ ] Test: `SELECT * FROM get_weekly_action_items();`

- [ ] **Test Behavior Incidents**
  - [ ] Create a behavior incident
  - [ ] Mark restorative process as completed
  - [ ] Verify restorative fields populate correctly

---

## Testing & Validation

### Step 5: Functional Testing

- [ ] **Test Case Management**
  - [ ] Create new case
  - [ ] Update case status
  - [ ] Close case
  - [ ] Verify audit log captures changes

- [ ] **Test Interventions**
  - [ ] Create intervention
  - [ ] Add multiple sessions
  - [ ] End intervention
  - [ ] Check reason_for_ending is captured

- [ ] **Test Action Plan Workflow**
  - [ ] Create parent meeting
  - [ ] Add action plan items
  - [ ] Mark items as completed
  - [ ] Add evidence URLs
  - [ ] Check weekly reminder query

- [ ] **Test Behavior Incident Workflow**
  - [ ] Create incident
  - [ ] List incidents without restorative process
  - [ ] Complete restorative process
  - [ ] Verify incident no longer appears in incomplete list

- [ ] **Test Analytics Functions**
  - [ ] Run tier distribution report
  - [ ] Check staff case load function
  - [ ] Verify weekly action items query
  - [ ] Test filters and grouping

### Step 6: Performance Testing

- [ ] **Check Query Performance**
  - [ ] Run complex queries from `common_queries.sql`
  - [ ] Verify queries execute in < 1 second
  - [ ] Check EXPLAIN ANALYZE for index usage

- [ ] **Test with Bulk Data** (if time permits)
  - [ ] Create 50+ students
  - [ ] Create 100+ cases
  - [ ] Test dashboard queries still perform well

### Step 7: Security Testing

- [ ] **Test RLS Policies**
  - [ ] Login as SSS_STAFF → can see all cases
  - [ ] Login as TEACHER → can only see own students
  - [ ] Login as PRINCIPAL_ADMIN → read-only access
  - [ ] Verify unauthorized access is blocked

- [ ] **Test Audit Logging**
  - [ ] Make changes to cases
  - [ ] Verify audit_log captures:
    - [ ] User ID
    - [ ] Action type
    - [ ] Changes (JSONB)
    - [ ] Timestamp

---

## Documentation

### Step 8: Document Deployment

- [ ] **Record Deployment Details**
  - [ ] Deployment date and time
  - [ ] Who deployed (your name)
  - [ ] Schema version: 1.0.0
  - [ ] Any issues encountered
  - [ ] Any deviations from plan

- [ ] **Update Project Documentation**
  - [ ] Mark deployment as complete in project tracker
  - [ ] Update README with database status
  - [ ] Document any customizations made

- [ ] **Share Access Information**
  - [ ] Share Supabase project URL with team
  - [ ] Provide appropriate credentials (service role for backend only)
  - [ ] Share common queries reference

---

## Training & Handoff

### Step 9: Team Training (if applicable)

- [ ] **SSS Team Training**
  - [ ] Demo how to access Supabase Dashboard
  - [ ] Show Table Editor for viewing data
  - [ ] Explain RLS and data access
  - [ ] Provide `common_queries.sql` reference

- [ ] **Developer Training**
  - [ ] Share connection details
  - [ ] Explain RLS policy structure
  - [ ] Show helper functions
  - [ ] Provide schema documentation

---

## Final Verification

### Step 10: Production Readiness

- [ ] **Schema Completeness**
  - [ ] All 16 tables created
  - [ ] All new fields from Wendy's feedback implemented
  - [ ] All helper functions working
  - [ ] All triggers active

- [ ] **Security Checklist**
  - [ ] RLS enabled on all tables
  - [ ] Policies tested for all roles
  - [ ] Audit logging functional
  - [ ] Service role key secured

- [ ] **Performance Checklist**
  - [ ] All indexes created
  - [ ] Queries optimized
  - [ ] Functions tested
  - [ ] No slow queries identified

- [ ] **Documentation Checklist**
  - [ ] Deployment summary complete
  - [ ] Verification tests passed
  - [ ] Common queries documented
  - [ ] Quick start guide available

---

## Issue Tracking

### Problems Encountered

Document any issues here:

1. **Issue**: _____________________________
   - **Error**: _____________________________
   - **Solution**: _____________________________
   - **Status**: ☐ Resolved ☐ Pending

2. **Issue**: _____________________________
   - **Error**: _____________________________
   - **Solution**: _____________________________
   - **Status**: ☐ Resolved ☐ Pending

---

## Sign-Off

- [ ] **Database Administrator Sign-Off**
  - Name: _____________________________
  - Date: _____________________________
  - Signature: _____________________________

- [ ] **Project Manager Sign-Off**
  - Name: _____________________________
  - Date: _____________________________
  - Signature: _____________________________

- [ ] **SSS Team Lead Sign-Off** (Wendy Aragón)
  - Name: _____________________________
  - Date: _____________________________
  - Signature: _____________________________

---

## Next Steps After Deployment

1. [ ] Begin application development against this schema
2. [ ] Set up Google Forms → behavior_incidents integration
3. [ ] Configure email notifications for weekly action item reminders
4. [ ] Set up scheduled jobs for re-evaluation reminders
5. [ ] Import historical data (if any exists)
6. [ ] Configure Supabase Storage for file uploads
7. [ ] Set up Google OAuth for authentication
8. [ ] Deploy Next.js application
9. [ ] Conduct user acceptance testing (UAT)
10. [ ] Go live with MVP

---

**Deployment Status**: ☐ Not Started ☐ In Progress ☐ Complete

**Final Notes**:
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

---

*Checklist Version: 1.0*
*Last Updated: November 18, 2025*
*Prepared by: DatabaseArchitectAgent*
