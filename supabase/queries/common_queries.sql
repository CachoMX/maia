-- MAIA SSS Common Database Queries
-- Quick reference for frequently used queries

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Create a new SSS staff user (run after auth user is created)
INSERT INTO users (id, email, first_name, last_name, role, sss_position)
VALUES (
  'auth_user_id_here',  -- Replace with actual auth.users.id
  'wendy@atlas.edu',
  'Wendy',
  'Aragón',
  'SSS_STAFF',
  'SSS Team Lead'
);

-- Create a teacher user
INSERT INTO users (id, email, first_name, last_name, role)
VALUES (
  'auth_user_id_here',
  'teacher@atlas.edu',
  'John',
  'Doe',
  'TEACHER'
);

-- Create a principal/admin user
INSERT INTO users (id, email, first_name, last_name, role)
VALUES (
  'auth_user_id_here',
  'principal@atlas.edu',
  'Jane',
  'Smith',
  'PRINCIPAL_ADMIN'
);

-- List all users by role
SELECT
  role,
  COUNT(*) as user_count,
  STRING_AGG(first_name || ' ' || last_name, ', ') as users
FROM users
GROUP BY role
ORDER BY role;

-- ============================================================================
-- STUDENT MANAGEMENT
-- ============================================================================

-- Add a new student
INSERT INTO students (name, grade, date_of_birth, student_id, primary_teacher_id)
VALUES (
  'Student Name',
  '3rd Grade',
  '2015-06-15',
  'STU-2024-001',
  'teacher_user_id_here'
);

-- List all active students by grade
SELECT
  grade,
  COUNT(*) as student_count,
  STRING_AGG(name, ', ' ORDER BY name) as students
FROM students
WHERE archived_at IS NULL
GROUP BY grade
ORDER BY grade;

-- Find students without an assigned teacher
SELECT id, name, grade, student_id
FROM students
WHERE primary_teacher_id IS NULL
AND archived_at IS NULL;

-- ============================================================================
-- CASE MANAGEMENT
-- ============================================================================

-- Create a new case
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
) VALUES (
  'student_id_here',
  'SEL',  -- or ACADEMIC_SUPPORT, DISTINCTIONS, CONFLICT_RESOLUTION, BULLYING, CHILD_PROTECTION, URGENT
  2,
  'OPEN',
  false,
  CURRENT_DATE,
  'sss_staff_id_here',
  'Student showing signs of anxiety in class',
  'TEACHER',
  'sss_staff_id_here'
);

-- List all open cases
SELECT
  c.id,
  s.name as student_name,
  s.grade,
  c.case_type,
  c.tier,
  c.is_urgent,
  c.opened_date,
  u.first_name || ' ' || u.last_name as case_manager,
  c.status
FROM cases c
JOIN students s ON s.id = c.student_id
LEFT JOIN users u ON u.id = c.case_manager_id
WHERE c.status = 'OPEN'
ORDER BY c.is_urgent DESC, c.opened_date ASC;

-- List urgent cases (highest priority)
SELECT
  c.id,
  s.name as student_name,
  s.grade,
  c.case_type,
  c.opened_date,
  u.first_name || ' ' || u.last_name as case_manager
FROM cases c
JOIN students s ON s.id = c.student_id
LEFT JOIN users u ON u.id = c.case_manager_id
WHERE c.is_urgent = true
AND c.status IN ('OPEN', 'ON_HOLD')
ORDER BY c.opened_date DESC;

-- Get case details with all related information
SELECT
  c.*,
  s.name as student_name,
  s.grade,
  u.first_name || ' ' || u.last_name as case_manager_name,
  COUNT(DISTINCT i.id) as intervention_count,
  COUNT(DISTINCT sess.id) as session_count,
  COUNT(DISTINCT pm.id) as parent_meeting_count
FROM cases c
JOIN students s ON s.id = c.student_id
LEFT JOIN users u ON u.id = c.case_manager_id
LEFT JOIN interventions i ON i.case_id = c.id
LEFT JOIN sessions sess ON sess.intervention_id = i.id
LEFT JOIN parent_meetings pm ON pm.case_id = c.id
WHERE c.id = 'case_id_here'
GROUP BY c.id, s.name, s.grade, u.first_name, u.last_name;

-- ============================================================================
-- INTERVENTION TRACKING
-- ============================================================================

-- Create a new intervention
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
) VALUES (
  'case_id_here',
  'SEL',  -- or ACADEMIC, DISTINCTIONS
  2,
  'Social Skills Group',
  'Weekly group sessions focused on emotion regulation and social interaction',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '8 weeks',
  8,
  'Weekly',
  'sss_staff_id_here',
  true
);

-- List all active interventions
SELECT
  i.intervention_name,
  i.type,
  i.tier,
  s.name as student_name,
  u.first_name || ' ' || u.last_name as facilitator,
  i.start_date,
  i.estimated_end_date,
  COUNT(sess.id) as total_sessions
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
LEFT JOIN users u ON u.id = i.facilitator_id
LEFT JOIN sessions sess ON sess.intervention_id = i.id
WHERE i.is_active = true
GROUP BY i.id, i.intervention_name, i.type, i.tier, s.name, u.first_name, u.last_name, i.start_date, i.estimated_end_date
ORDER BY i.start_date DESC;

-- ============================================================================
-- SESSION DOCUMENTATION
-- ============================================================================

-- Add a new session
INSERT INTO sessions (
  intervention_id,
  session_date,
  session_time,
  duration,
  facilitator_id,
  student_attended,
  observation_notes,
  student_progress
) VALUES (
  'intervention_id_here',
  CURRENT_DATE,
  '10:00:00',
  45,  -- minutes
  'sss_staff_id_here',
  true,
  'Student participated well today. Showed improvement in emotion regulation.',
  'Good progress on identifying triggers. Still working on coping strategies.'
);

-- List recent sessions for a student
SELECT
  sess.session_date,
  i.intervention_name,
  u.first_name || ' ' || u.last_name as facilitator,
  sess.student_attended,
  sess.observation_notes,
  sess.student_progress
FROM sessions sess
JOIN interventions i ON i.id = sess.intervention_id
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
LEFT JOIN users u ON u.id = sess.facilitator_id
WHERE s.id = 'student_id_here'
ORDER BY sess.session_date DESC
LIMIT 10;

-- ============================================================================
-- PARENT MEETINGS
-- ============================================================================

-- Schedule a new parent meeting
INSERT INTO parent_meetings (
  student_id,
  case_id,
  meeting_date,
  meeting_time,
  sss_staff_id,
  is_scheduled,
  meeting_status,
  agenda
) VALUES (
  'student_id_here',
  'case_id_here',
  CURRENT_DATE + INTERVAL '3 days',
  '14:00:00',
  'sss_staff_id_here',
  true,
  'SCHEDULED',
  'Discuss progress on Tier 2 interventions and next steps'
);

-- List upcoming parent meetings
SELECT
  pm.meeting_date,
  pm.meeting_time,
  s.name as student_name,
  s.grade,
  u.first_name || ' ' || u.last_name as sss_staff,
  pm.agenda,
  pm.meeting_status
FROM parent_meetings pm
JOIN students s ON s.id = pm.student_id
LEFT JOIN users u ON u.id = pm.sss_staff_id
WHERE pm.meeting_date >= CURRENT_DATE
AND pm.meeting_status IN ('SCHEDULED', 'RESCHEDULED')
ORDER BY pm.meeting_date, pm.meeting_time;

-- Mark meeting as completed and add notes
UPDATE parent_meetings
SET
  meeting_status = 'COMPLETED',
  meeting_notes = 'Parent expressed concerns about... Agreed to implement home strategies...',
  next_steps = 'Follow up in 2 weeks. Parent to track behaviors at home.',
  next_meeting_date = CURRENT_DATE + INTERVAL '2 weeks',
  updated_at = NOW()
WHERE id = 'meeting_id_here';

-- ============================================================================
-- ACTION PLAN ITEMS
-- ============================================================================

-- Create action plan items after a parent meeting
INSERT INTO action_plan_items (
  parent_meeting_id,
  student_id,
  case_id,
  description,
  due_date,
  assigned_to
) VALUES
  (
    'meeting_id_here',
    'student_id_here',
    'case_id_here',
    'Parent to implement visual schedule at home',
    CURRENT_DATE + INTERVAL '1 week',
    'Parent'
  ),
  (
    'meeting_id_here',
    'student_id_here',
    'case_id_here',
    'Teacher to provide daily behavior chart',
    CURRENT_DATE + INTERVAL '3 days',
    'Teacher'
  );

-- Get weekly action items (due this week)
SELECT * FROM get_weekly_action_items();

-- Mark action item as completed
UPDATE action_plan_items
SET
  is_completed = true,
  completed_date = CURRENT_DATE,
  notes = 'Parent sent photos of visual schedule in use at home',
  evidence_urls = ARRAY['https://storage.supabase.co/..../visual_schedule.jpg'],
  updated_at = NOW()
WHERE id = 'action_item_id_here';

-- List incomplete action items by student
SELECT
  s.name as student_name,
  api.description,
  api.due_date,
  api.assigned_to,
  CURRENT_DATE - api.due_date as days_overdue
FROM action_plan_items api
JOIN students s ON s.id = api.student_id
WHERE api.is_completed = false
ORDER BY api.due_date;

-- ============================================================================
-- BEHAVIOR INCIDENTS
-- ============================================================================

-- Record a behavior incident
INSERT INTO behavior_incidents (
  student_id,
  incident_date,
  incident_time,
  incident_location,
  incident_description,
  reported_by,
  severity,
  category
) VALUES (
  'student_id_here',
  CURRENT_DATE,
  '11:30:00',
  'Playground',
  'Student pushed another student during recess',
  'Teacher Name',
  'MODERATE',
  'Physical aggression'
);

-- Mark restorative process as completed
UPDATE behavior_incidents
SET
  restorative_process_completed = true,
  restorative_date = CURRENT_DATE,
  restorative_staff_id = 'sss_staff_id_here',
  restorative_notes = 'Student participated in restorative conversation. Showed understanding of impact. Apologized to other student.',
  updated_at = NOW()
WHERE id = 'incident_id_here';

-- List incidents without completed restorative process
SELECT
  bi.incident_date,
  s.name as student_name,
  s.grade,
  bi.incident_description,
  bi.severity,
  bi.reported_by
FROM behavior_incidents bi
JOIN students s ON s.id = bi.student_id
WHERE bi.restorative_process_completed = false
ORDER BY bi.incident_date DESC;

-- Get incident history for a student
SELECT
  incident_date,
  incident_time,
  incident_location,
  incident_description,
  severity,
  restorative_process_completed,
  restorative_date
FROM behavior_incidents
WHERE student_id = 'student_id_here'
ORDER BY incident_date DESC;

-- ============================================================================
-- REFERRALS
-- ============================================================================

-- Create a teacher referral
INSERT INTO referrals (
  student_id,
  referral_type,
  incident_date,
  incident_time,
  incident_location,
  incident_description,
  reported_by,
  incident_severity,
  incident_category,
  frequency_in_week
) VALUES (
  'student_id_here',
  'BEHAVIOR_FORM',
  CURRENT_DATE,
  '09:45:00',
  'Classroom 3A',
  'Student had difficulty focusing and was disruptive during math lesson',
  'Ms. Johnson',
  'MODERATE',
  'Attention/Focus',
  3  -- 3 times this week
);

-- List unprocessed referrals
SELECT
  r.referral_type,
  s.name as student_name,
  s.grade,
  r.incident_date,
  r.incident_description,
  r.reported_by,
  r.incident_severity
FROM referrals r
JOIN students s ON s.id = r.student_id
WHERE r.referral_processed = false
ORDER BY r.incident_severity DESC, r.incident_date DESC;

-- Process a referral and create a case
BEGIN;
  -- Create the case
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    opened_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    created_by
  )
  SELECT
    r.student_id,
    'SEL',
    2,
    'OPEN',
    CURRENT_DATE,
    'sss_staff_id_here',
    r.incident_description,
    r.referral_type,
    'sss_staff_id_here'
  FROM referrals r
  WHERE r.id = 'referral_id_here'
  RETURNING id AS new_case_id;

  -- Mark referral as processed
  UPDATE referrals
  SET
    referral_processed = true,
    processed_date = CURRENT_DATE,
    processed_by = 'sss_staff_id_here',
    created_case_id = 'new_case_id_from_above',
    updated_at = NOW()
  WHERE id = 'referral_id_here';
COMMIT;

-- ============================================================================
-- WORKLOAD & ANALYTICS
-- ============================================================================

-- Get case load for all staff members
SELECT
  u.first_name || ' ' || u.last_name as staff_name,
  (SELECT total_cases FROM get_staff_case_load(u.id)) as total_cases,
  (SELECT open_cases FROM get_staff_case_load(u.id)) as open_cases,
  (SELECT tier_1_cases FROM get_staff_case_load(u.id)) as tier_1,
  (SELECT tier_2_cases FROM get_staff_case_load(u.id)) as tier_2,
  (SELECT tier_3_cases FROM get_staff_case_load(u.id)) as tier_3,
  (SELECT urgent_cases FROM get_staff_case_load(u.id)) as urgent
FROM users u
WHERE u.role = 'SSS_STAFF'
ORDER BY total_cases DESC;

-- Get tier distribution by grade
SELECT * FROM get_tier_distribution_by_grade();

-- Count cases by type and status
SELECT
  case_type,
  status,
  COUNT(*) as case_count
FROM cases
GROUP BY case_type, status
ORDER BY case_type, status;

-- Monthly case statistics
SELECT
  DATE_TRUNC('month', opened_date) as month,
  COUNT(*) as cases_opened,
  COUNT(*) FILTER (WHERE status = 'CLOSED') as cases_closed,
  AVG(EXTRACT(EPOCH FROM (COALESCE(closed_date, CURRENT_DATE) - opened_date)) / 86400) as avg_duration_days
FROM cases
WHERE opened_date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', opened_date)
ORDER BY month DESC;

-- ============================================================================
-- AUDIT & COMPLIANCE
-- ============================================================================

-- Record an audit log entry (usually done via triggers, but manual example)
INSERT INTO audit_log (user_id, action, table_name, record_id, changes)
VALUES (
  'user_id_here',
  'UPDATE',
  'cases',
  'case_id_here',
  '{"status": {"old": "OPEN", "new": "CLOSED"}}'::jsonb
);

-- View recent audit logs
SELECT
  al.created_at,
  u.first_name || ' ' || u.last_name as user_name,
  al.action,
  al.table_name,
  al.record_id,
  al.changes
FROM audit_log al
LEFT JOIN users u ON u.id = al.user_id
ORDER BY al.created_at DESC
LIMIT 50;

-- View audit trail for a specific case
SELECT
  al.created_at,
  u.first_name || ' ' || u.last_name as user_name,
  al.action,
  al.changes
FROM audit_log al
LEFT JOIN users u ON u.id = al.user_id
WHERE al.table_name = 'cases'
AND al.record_id = 'case_id_here'
ORDER BY al.created_at DESC;

-- ============================================================================
-- CLEANUP & MAINTENANCE
-- ============================================================================

-- Archive old cases (keep them but mark as closed)
UPDATE cases
SET
  status = 'CLOSED',
  closed_date = CURRENT_DATE,
  closure_reason = 'Archived due to student graduation/transfer',
  updated_at = NOW()
WHERE student_id IN (
  SELECT id FROM students WHERE archived_at IS NOT NULL
)
AND status != 'CLOSED';

-- Archive students who have left the school
UPDATE students
SET archived_at = CURRENT_DATE
WHERE id = 'student_id_here';

-- Find students with no active cases
SELECT
  s.id,
  s.name,
  s.grade,
  COUNT(c.id) as total_cases,
  COUNT(c.id) FILTER (WHERE c.status IN ('OPEN', 'ON_HOLD')) as active_cases
FROM students s
LEFT JOIN cases c ON c.student_id = s.id
WHERE s.archived_at IS NULL
GROUP BY s.id, s.name, s.grade
HAVING COUNT(c.id) FILTER (WHERE c.status IN ('OPEN', 'ON_HOLD')) = 0;
