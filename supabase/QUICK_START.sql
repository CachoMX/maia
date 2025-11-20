-- ============================================================================
-- MAIA SSS - QUICK START GUIDE
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor to get started
-- https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new
--
-- This will:
-- 1. Verify the schema is deployed
-- 2. Create sample SSS staff user
-- 3. Create sample students
-- 4. Create sample cases
-- 5. Show you how to query the data
-- ============================================================================

-- ============================================================================
-- STEP 1: VERIFY SCHEMA IS DEPLOYED
-- ============================================================================

-- This should show 16 tables
SELECT COUNT(*) as table_count, 'Expected: 16' as expected
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- STEP 2: CREATE YOUR FIRST SSS STAFF USER
-- ============================================================================

-- IMPORTANT: First, you need to create an auth user in Supabase Auth
-- 1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/users
-- 2. Click "Add User"
-- 3. Enter email: wendy@atlas.edu (or your email)
-- 4. Copy the user ID that gets created
-- 5. Replace 'YOUR_AUTH_USER_ID_HERE' below with that ID

-- Then run this:
/*
INSERT INTO users (id, email, first_name, last_name, role, sss_position)
VALUES (
  'YOUR_AUTH_USER_ID_HERE',  -- Replace with actual auth.users.id
  'wendy@atlas.edu',
  'Wendy',
  'Aragón',
  'SSS_STAFF',
  'SSS Team Lead'
);
*/

-- Verify user was created
SELECT id, email, first_name, last_name, role, sss_position
FROM users
WHERE role = 'SSS_STAFF';

-- ============================================================================
-- STEP 3: CREATE SAMPLE STUDENTS
-- ============================================================================

-- Create a few sample students for testing
INSERT INTO students (name, grade, date_of_birth, student_id)
VALUES
  ('Emma Johnson', '3rd Grade', '2015-03-15', 'STU-2024-001'),
  ('Lucas Martinez', '5th Grade', '2013-08-22', 'STU-2024-002'),
  ('Sophia Chen', '2nd Grade', '2016-11-30', 'STU-2024-003')
ON CONFLICT DO NOTHING;

-- Verify students were created
SELECT id, name, grade, student_id
FROM students
WHERE archived_at IS NULL
ORDER BY grade, name;

-- ============================================================================
-- STEP 4: CREATE SAMPLE CASES
-- ============================================================================

-- Create an SEL case for Emma
-- Replace 'YOUR_SSS_STAFF_ID' with your user ID from step 2
/*
INSERT INTO cases (
  student_id,
  case_type,
  tier,
  status,
  is_urgent,
  opened_date,
  case_manager_id,
  reason_for_referral,
  referral_source,
  created_by
)
SELECT
  s.id,
  'SEL',
  2,
  'OPEN',
  false,
  CURRENT_DATE,
  'YOUR_SSS_STAFF_ID',
  'Student showing signs of anxiety in classroom. Difficulty with transitions.',
  'TEACHER',
  'YOUR_SSS_STAFF_ID'
FROM students s
WHERE s.name = 'Emma Johnson';
*/

-- Create an urgent case for Lucas
/*
INSERT INTO cases (
  student_id,
  case_type,
  tier,
  status,
  is_urgent,
  opened_date,
  case_manager_id,
  reason_for_referral,
  referral_source,
  created_by
)
SELECT
  s.id,
  'URGENT',
  3,
  'OPEN',
  true,
  CURRENT_DATE,
  'YOUR_SSS_STAFF_ID',
  'Highly dysregulated episode - extreme anxiety, inconsolable crying in class',
  'TEACHER',
  'YOUR_SSS_STAFF_ID'
FROM students s
WHERE s.name = 'Lucas Martinez';
*/

-- Verify cases were created
SELECT
  c.id,
  s.name as student_name,
  c.case_type,
  c.tier,
  c.is_urgent,
  c.status,
  c.opened_date,
  c.reason_for_referral
FROM cases c
JOIN students s ON s.id = c.student_id
ORDER BY c.is_urgent DESC, c.opened_date DESC;

-- ============================================================================
-- STEP 5: TEST HELPER FUNCTIONS
-- ============================================================================

-- Test tier distribution (will be empty initially)
SELECT * FROM get_tier_distribution_by_grade();

-- Test weekly action items (will be empty initially)
SELECT * FROM get_weekly_action_items();

-- Test staff case load (replace with your user ID)
-- SELECT * FROM get_staff_case_load('YOUR_SSS_STAFF_ID');

-- ============================================================================
-- STEP 6: VERIFY RLS POLICIES
-- ============================================================================

-- Count RLS policies
SELECT
  COUNT(*) as total_policies,
  'Expected: 50+' as expected
FROM pg_policies
WHERE schemaname = 'public';

-- List policies per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC;

-- ============================================================================
-- STEP 7: CREATE A SAMPLE INTERVENTION
-- ============================================================================

-- Create a Tier 2 SEL intervention for Emma's case
-- Replace YOUR_SSS_STAFF_ID and YOUR_CASE_ID with actual IDs
/*
INSERT INTO interventions (
  case_id,
  type,
  tier,
  intervention_name,
  description,
  start_date,
  estimated_end_date,
  duration_weeks,
  frequency,
  facilitator_id,
  is_active
)
VALUES (
  'YOUR_CASE_ID',  -- Emma's case ID from step 4
  'SEL',
  2,
  'Zones of Regulation - Individual Sessions',
  'Weekly 1:1 sessions to help student identify emotions and develop coping strategies',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '8 weeks',
  8,
  'Weekly',
  'YOUR_SSS_STAFF_ID',
  true
);
*/

-- View interventions
SELECT
  i.intervention_name,
  i.type,
  i.tier,
  s.name as student_name,
  i.start_date,
  i.frequency,
  i.is_active
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
ORDER BY i.start_date DESC;

-- ============================================================================
-- STEP 8: CREATE A SAMPLE SESSION
-- ============================================================================

-- Document a session for the intervention
-- Replace YOUR_INTERVENTION_ID and YOUR_SSS_STAFF_ID
/*
INSERT INTO sessions (
  intervention_id,
  session_date,
  session_time,
  duration,
  facilitator_id,
  student_attended,
  observation_notes,
  student_progress
)
VALUES (
  'YOUR_INTERVENTION_ID',
  CURRENT_DATE,
  '10:00:00',
  45,  -- minutes
  'YOUR_SSS_STAFF_ID',
  true,
  'Student participated well. Identified feeling "blue" during math transition. Used deep breathing strategy successfully.',
  'Good progress on emotion identification. Still working on self-regulation strategies.'
);
*/

-- View sessions
SELECT
  s.name as student_name,
  i.intervention_name,
  sess.session_date,
  sess.student_attended,
  sess.observation_notes
FROM sessions sess
JOIN interventions i ON i.id = sess.intervention_id
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
ORDER BY sess.session_date DESC;

-- ============================================================================
-- STEP 9: SCHEDULE A PARENT MEETING
-- ============================================================================

-- Schedule a parent meeting for next week
-- Replace YOUR_STUDENT_ID, YOUR_CASE_ID, YOUR_SSS_STAFF_ID
/*
INSERT INTO parent_meetings (
  student_id,
  case_id,
  meeting_date,
  meeting_time,
  sss_staff_id,
  is_scheduled,
  meeting_status,
  agenda
)
VALUES (
  'YOUR_STUDENT_ID',
  'YOUR_CASE_ID',
  CURRENT_DATE + INTERVAL '5 days',
  '14:00:00',
  'YOUR_SSS_STAFF_ID',
  true,
  'SCHEDULED',
  'Discuss Tier 2 intervention progress and strategies to support at home'
);
*/

-- View upcoming meetings
SELECT
  s.name as student_name,
  pm.meeting_date,
  pm.meeting_time,
  pm.meeting_status,
  pm.agenda
FROM parent_meetings pm
JOIN students s ON s.id = pm.student_id
WHERE pm.meeting_date >= CURRENT_DATE
ORDER BY pm.meeting_date;

-- ============================================================================
-- STEP 10: CREATE ACTION PLAN ITEMS
-- ============================================================================

-- Create action plan items for the parent meeting
-- Replace YOUR_MEETING_ID, YOUR_STUDENT_ID, YOUR_CASE_ID
/*
INSERT INTO action_plan_items (
  parent_meeting_id,
  student_id,
  case_id,
  description,
  due_date,
  assigned_to
)
VALUES
  (
    'YOUR_MEETING_ID',
    'YOUR_STUDENT_ID',
    'YOUR_CASE_ID',
    'Parent to implement visual emotion chart at home',
    CURRENT_DATE + INTERVAL '1 week',
    'Parent'
  ),
  (
    'YOUR_MEETING_ID',
    'YOUR_STUDENT_ID',
    'YOUR_CASE_ID',
    'Teacher to provide 5-minute warning before transitions',
    CURRENT_DATE + INTERVAL '2 days',
    'Teacher'
  );
*/

-- View action plan items
SELECT
  s.name as student_name,
  api.description,
  api.due_date,
  api.assigned_to,
  api.is_completed
FROM action_plan_items api
JOIN students s ON s.id = api.student_id
WHERE api.is_completed = false
ORDER BY api.due_date;

-- ============================================================================
-- STEP 11: RECORD A BEHAVIOR INCIDENT
-- ============================================================================

-- Record a behavior incident
-- Replace YOUR_STUDENT_ID
/*
INSERT INTO behavior_incidents (
  student_id,
  incident_date,
  incident_time,
  incident_location,
  incident_description,
  reported_by,
  severity,
  category
)
VALUES (
  'YOUR_STUDENT_ID',
  CURRENT_DATE,
  '11:30:00',
  'Classroom 3A',
  'Student had difficulty with transition to lunch. Became upset and threw materials.',
  'Ms. Johnson',
  'MODERATE',
  'Emotional dysregulation'
);
*/

-- View behavior incidents needing restorative process
SELECT
  s.name as student_name,
  bi.incident_date,
  bi.incident_description,
  bi.severity,
  bi.restorative_process_completed
FROM behavior_incidents bi
JOIN students s ON s.id = bi.student_id
WHERE bi.restorative_process_completed = false
ORDER BY bi.incident_date DESC;

-- ============================================================================
-- STEP 12: VIEW DASHBOARD STATISTICS
-- ============================================================================

-- Total cases by type
SELECT
  case_type,
  COUNT(*) as case_count
FROM cases
WHERE status IN ('OPEN', 'ON_HOLD')
GROUP BY case_type
ORDER BY case_count DESC;

-- Total cases by tier
SELECT
  tier,
  COUNT(*) as case_count
FROM cases
WHERE status IN ('OPEN', 'ON_HOLD')
GROUP BY tier
ORDER BY tier;

-- Urgent cases count
SELECT
  COUNT(*) as urgent_cases
FROM cases
WHERE is_urgent = true
AND status IN ('OPEN', 'ON_HOLD');

-- Students with active cases
SELECT
  s.name,
  s.grade,
  COUNT(c.id) as case_count,
  COUNT(c.id) FILTER (WHERE c.is_urgent = true) as urgent_cases
FROM students s
JOIN cases c ON c.student_id = s.id
WHERE c.status IN ('OPEN', 'ON_HOLD')
AND s.archived_at IS NULL
GROUP BY s.id, s.name, s.grade
ORDER BY urgent_cases DESC, case_count DESC;

-- ============================================================================
-- CONGRATULATIONS!
-- ============================================================================
-- You've successfully set up the MAIA SSS database and created sample data.
--
-- NEXT STEPS:
-- 1. Create your real SSS staff users
-- 2. Import your actual student data
-- 3. Start creating real cases and interventions
-- 4. Explore the common_queries.sql file for more examples
--
-- HELPFUL RESOURCES:
-- - Common Queries: supabase/queries/common_queries.sql
-- - Deployment Summary: DATABASE_DEPLOYMENT_SUMMARY.md
-- - Full Documentation: ATLAS_SSS_APP_IMPLEMENTATION_ROADMAP.md
--
-- NEED HELP?
-- - Check the verification queries: supabase/migrations/002_verification_queries.sql
-- - Review the deployment instructions: scripts/DEPLOYMENT_INSTRUCTIONS.md
-- - Contact vixi.agency support
-- ============================================================================
