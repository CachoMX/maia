-- ============================================================================
-- MAIA SSS APP - TEST DATA FOR WEEK 2 VERIFICATION
-- ============================================================================
-- Project: MAIA SSS App
-- Date: November 18, 2025
-- Description: Comprehensive test data for database verification
--
-- PREREQUISITES:
-- 1. Schema deployed (001_initial_schema.sql)
-- 2. Wendy Aragon user created in Supabase Auth
-- 3. User profile exists in users table
--
-- USAGE:
-- 1. Copy the Wendy Aragon user UUID from Supabase Auth dashboard
-- 2. Replace 'WENDY_USER_ID_HERE' with the actual UUID
-- 3. Run this script in Supabase SQL Editor
-- 4. Verify using verification queries below
-- ============================================================================

-- ============================================================================
-- STEP 0: VERIFY WENDY'S USER EXISTS
-- ============================================================================
-- First, let's check if Wendy's user exists
-- If this returns no rows, create the user in Supabase Auth first!

SELECT
  id,
  email,
  first_name,
  last_name,
  role
FROM users
WHERE email = 'wendy.aragon@atlas.es';

-- If the query above returns no rows, you need to:
-- 1. Go to Supabase Auth dashboard
-- 2. Create user: wendy.aragon@atlas.es
-- 3. Copy the UUID
-- 4. Replace WENDY_USER_ID_HERE below with that UUID

-- ============================================================================
-- CONFIGURATION - REPLACE THIS WITH WENDY'S ACTUAL USER ID
-- ============================================================================

-- ⚠️ IMPORTANT: Replace this with Wendy's actual user ID from Supabase Auth
DO $$
DECLARE
  wendy_user_id UUID;
BEGIN
  -- Try to get Wendy's existing user ID
  SELECT id INTO wendy_user_id
  FROM users
  WHERE email = 'wendy.aragon@atlas.es';

  IF wendy_user_id IS NULL THEN
    RAISE EXCEPTION 'ERROR: Wendy user not found! Create user in Supabase Auth first.';
  END IF;

  RAISE NOTICE 'Found Wendy user with ID: %', wendy_user_id;
END $$;

-- ============================================================================
-- STEP 1: CREATE TEST STUDENTS (5 students, different grades)
-- ============================================================================

-- Clean up existing test students first (for re-running this script)
DELETE FROM students WHERE student_id LIKE 'TEST-%';

-- PreK Student
INSERT INTO students (
  name,
  grade,
  date_of_birth,
  student_id,
  nationality,
  mother_tongue,
  start_date_at_atlas
) VALUES (
  'Sofia Martinez',
  'PreK',
  '2020-03-15',
  'TEST-PREK-001',
  'Spanish',
  'Spanish',
  '2024-09-01'
);

-- K1 Student
INSERT INTO students (
  name,
  grade,
  date_of_birth,
  student_id,
  nationality,
  mother_tongue,
  start_date_at_atlas
) VALUES (
  'Lucas Chen',
  'K1',
  '2019-07-22',
  'TEST-K1-001',
  'Chinese',
  'Mandarin',
  '2024-09-01'
);

-- Grade 3 Student
INSERT INTO students (
  name,
  grade,
  date_of_birth,
  student_id,
  nationality,
  mother_tongue,
  start_date_at_atlas
) VALUES (
  'Emma Johnson',
  'G3',
  '2015-11-08',
  'TEST-G3-001',
  'American',
  'English',
  '2022-09-01'
);

-- Grade 5 Student
INSERT INTO students (
  name,
  grade,
  date_of_birth,
  student_id,
  nationality,
  mother_tongue,
  start_date_at_atlas
) VALUES (
  'Ahmed Al-Rashid',
  'G5',
  '2013-05-20',
  'TEST-G5-001',
  'Saudi Arabian',
  'Arabic',
  '2021-09-01'
);

-- Middle School Student
INSERT INTO students (
  name,
  grade,
  date_of_birth,
  student_id,
  nationality,
  mother_tongue,
  start_date_at_atlas
) VALUES (
  'Isabella Rodriguez',
  'MS',
  '2011-09-12',
  'TEST-MS-001',
  'Mexican',
  'Spanish',
  '2020-09-01'
);

-- ============================================================================
-- STEP 2: CREATE TEST CASES (10 cases with variety)
-- ============================================================================

-- Clean up existing test cases first
DELETE FROM cases WHERE id IN (
  SELECT c.id FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id LIKE 'TEST-%'
);

-- Get Wendy's user ID for case assignment
DO $$
DECLARE
  wendy_id UUID;
  sofia_id UUID;
  lucas_id UUID;
  emma_id UUID;
  ahmed_id UUID;
  isabella_id UUID;
BEGIN
  -- Get Wendy's user ID
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';

  -- Get student IDs
  SELECT id INTO sofia_id FROM students WHERE student_id = 'TEST-PREK-001';
  SELECT id INTO lucas_id FROM students WHERE student_id = 'TEST-K1-001';
  SELECT id INTO emma_id FROM students WHERE student_id = 'TEST-G3-001';
  SELECT id INTO ahmed_id FROM students WHERE student_id = 'TEST-G5-001';
  SELECT id INTO isabella_id FROM students WHERE student_id = 'TEST-MS-001';

  -- CASE 1: URGENT - Sofia (PreK) - SEL issue
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    sofia_id,
    'SEL',
    2,
    'OPEN',
    true,
    '2025-11-10',
    '2025-12-15',
    wendy_id,
    'Student showing severe separation anxiety. Crying for extended periods, refusing to participate in activities. Parent reports similar behavior started after family emergency.',
    'PARENT',
    'URGENT: Immediate Tier 2 intervention needed. Parent meeting scheduled for this week.',
    wendy_id,
    ARRAY['Individual counseling', 'Parent consultation']
  );

  -- CASE 2: URGENT - Lucas (K1) - ACADEMIC_SUPPORT
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    lucas_id,
    'ACADEMIC_SUPPORT',
    1,
    'OPEN',
    true,
    '2025-11-15',
    '2026-01-30',
    wendy_id,
    'Student struggling significantly with phonics and letter recognition. Far below grade level expectations. Teacher concerned about possible learning disability.',
    'BEHAVIOR_FORM',
    'URGENT: Fast-track evaluation needed. Parent consent form sent.',
    wendy_id,
    ARRAY['Reading intervention', 'Evaluation pending']
  );

  -- CASE 3: ACADEMIC_SUPPORT - Emma (G3) - Tier 2
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    emma_id,
    'ACADEMIC_SUPPORT',
    2,
    'OPEN',
    false,
    '2025-10-01',
    '2025-12-20',
    wendy_id,
    'Student struggling with math concepts, particularly multiplication and division. Making limited progress with Tier 1 supports.',
    'BEHAVIOR_FORM',
    'Tier 1 interventions showed minimal progress. Moving to Tier 2 small group instruction.',
    wendy_id,
    ARRAY['Math small group', 'Progress monitoring']
  );

  -- CASE 4: ACADEMIC_SUPPORT - Ahmed (G5) - Tier 3
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    ahmed_id,
    'ACADEMIC_SUPPORT',
    3,
    'OPEN',
    false,
    '2025-09-15',
    '2026-06-15',
    wendy_id,
    'Student has documented dyslexia. Requires intensive reading intervention and accommodations.',
    'ADMIN',
    'IEP in place. Receiving specialized reading instruction 5x/week.',
    wendy_id,
    ARRAY['Wilson Reading Program', 'Assistive technology', 'Accommodations']
  );

  -- CASE 5: SEL - Emma (G3) - Tier 1
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    emma_id,
    'SEL',
    1,
    'OPEN',
    false,
    '2025-11-01',
    '2025-12-01',
    wendy_id,
    'Student having difficulty making friends. Often alone at recess. Teacher reports some social anxiety.',
    'BEHAVIOR_FORM',
    'Started lunch bunch group this week. Monitoring progress.',
    wendy_id,
    ARRAY['Social skills group', 'Lunch bunch']
  );

  -- CASE 6: SEL - Isabella (MS) - Tier 2
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    isabella_id,
    'SEL',
    2,
    'OPEN',
    false,
    '2025-10-15',
    '2026-02-15',
    wendy_id,
    'Student showing signs of anxiety and perfectionism. Reports significant stress about grades. Some evidence of anxiety attacks.',
    'SELF',
    'Student self-referred through wellness form. Good insight. Weekly check-ins established.',
    wendy_id,
    ARRAY['Individual counseling', 'Mindfulness group', 'Parent collaboration']
  );

  -- CASE 7: BULLYING - Lucas (K1)
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    lucas_id,
    'BULLYING',
    2,
    'OPEN',
    false,
    '2025-11-12',
    '2025-12-10',
    wendy_id,
    'Student reported being excluded by peers during play. Another student told him "we dont want to play with you". Multiple incidents observed.',
    'BEHAVIOR_FORM',
    'Following bullying protocol. Parent meeting completed. Classroom intervention planned.',
    wendy_id,
    ARRAY['Restorative practices', 'Social skills support']
  );

  -- CASE 8: CHILD_PROTECTION - Ahmed (G5)
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
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    ahmed_id,
    'CHILD_PROTECTION',
    3,
    'OPEN',
    false,
    '2025-11-05',
    wendy_id,
    'Student disclosed concerning information about home environment. Mandatory reporting filed.',
    'ADMIN',
    'CONFIDENTIAL: Report filed with local authorities. Following child protection protocol. Admin and legal team involved.',
    wendy_id,
    ARRAY['Safety planning', 'External services coordination']
  );

  -- CASE 9: CONFLICT_RESOLUTION - Isabella (MS)
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    isabella_id,
    'CONFLICT_RESOLUTION',
    1,
    'OPEN',
    false,
    '2025-11-14',
    '2025-11-25',
    wendy_id,
    'Conflict with peer in group project. Both students escalated situation. Need mediation.',
    'BEHAVIOR_FORM',
    'Both students agree to mediation. Session scheduled for Friday.',
    wendy_id,
    ARRAY['Peer mediation', 'Restorative circle']
  );

  -- CASE 10: ACADEMIC_SUPPORT - Sofia (PreK) - CLOSED (completed successfully)
  INSERT INTO cases (
    student_id,
    case_type,
    tier,
    status,
    is_urgent,
    opened_date,
    closed_date,
    expected_closure_date,
    case_manager_id,
    reason_for_referral,
    referral_source,
    closure_reason,
    internal_notes,
    created_by,
    intervention_types
  ) VALUES (
    sofia_id,
    'ACADEMIC_SUPPORT',
    1,
    'CLOSED',
    false,
    '2025-09-15',
    '2025-10-30',
    '2025-11-01',
    wendy_id,
    'Student needed support with fine motor skills for writing activities.',
    'BEHAVIOR_FORM',
    'Goals achieved. Student now performing at grade level expectations. Intervention successful.',
    'Tier 1 fine motor activities implemented. Great progress. Parent very pleased with results.',
    wendy_id,
    ARRAY['Fine motor activities', 'OT consultation']
  );

  RAISE NOTICE 'Successfully created 10 test cases';
END $$;

-- ============================================================================
-- STEP 3: CREATE INTERVENTIONS FOR SOME CASES
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  case_id_temp UUID;
BEGIN
  -- Get Wendy's user ID
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';

  -- Intervention for Emma's Academic Support case
  SELECT c.id INTO case_id_temp
  FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-G3-001' AND c.case_type = 'ACADEMIC_SUPPORT';

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
    case_id_temp,
    'ACADEMIC',
    2,
    'Math Facts Fluency Group',
    'Small group instruction focusing on multiplication and division strategies using concrete manipulatives and visual models.',
    '2025-10-08',
    '2025-12-20',
    10,
    '3x per week, 30 minutes',
    wendy_id,
    true
  );

  -- Intervention for Isabella's SEL case
  SELECT c.id INTO case_id_temp
  FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-MS-001' AND c.case_type = 'SEL' AND c.tier = 2;

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
    case_id_temp,
    'SEL',
    2,
    'Anxiety Management - Individual Counseling',
    'Weekly individual sessions focusing on anxiety management strategies, perfectionism, and stress reduction techniques.',
    '2025-10-20',
    '2026-02-15',
    16,
    'Weekly, 45 minutes',
    wendy_id,
    true
  );

  -- Intervention for Ahmed's Academic Support case (Tier 3)
  SELECT c.id INTO case_id_temp
  FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-G5-001' AND c.case_type = 'ACADEMIC_SUPPORT';

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
    case_id_temp,
    'ACADEMIC',
    3,
    'Wilson Reading System - Intensive',
    'Structured, systematic, and intensive phonics-based reading program for students with dyslexia.',
    '2025-09-20',
    '2026-06-15',
    36,
    'Daily, 60 minutes',
    wendy_id,
    true
  );

  RAISE NOTICE 'Successfully created test interventions';
END $$;

-- ============================================================================
-- STEP 4: CREATE SAMPLE SESSIONS
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  intervention_id_temp UUID;
BEGIN
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';

  -- Get intervention ID for Emma's math intervention
  SELECT i.id INTO intervention_id_temp
  FROM interventions i
  JOIN cases c ON c.id = i.case_id
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-G3-001' AND i.intervention_name = 'Math Facts Fluency Group';

  -- Create 3 sessions for Emma
  INSERT INTO sessions (intervention_id, session_date, session_time, duration, facilitator_id, student_attended, observation_notes, student_progress)
  VALUES
    (intervention_id_temp, '2025-10-08', '10:00:00', 30, wendy_id, true, 'First session. Emma engaged well. Introduced multiplication strategies using arrays.', 'Good baseline. Knows some facts automatically.'),
    (intervention_id_temp, '2025-10-10', '10:00:00', 30, wendy_id, true, 'Continued with array models. Emma starting to see patterns.', 'Progress noted. Can solve 2x and 5x facts more quickly.'),
    (intervention_id_temp, '2025-10-15', '10:00:00', 30, wendy_id, false, 'Emma absent due to illness.', 'N/A');

  -- Get intervention ID for Isabella's SEL intervention
  SELECT i.id INTO intervention_id_temp
  FROM interventions i
  JOIN cases c ON c.id = i.case_id
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-MS-001' AND i.type = 'SEL';

  -- Create 2 sessions for Isabella
  INSERT INTO sessions (intervention_id, session_date, session_time, duration, facilitator_id, student_attended, observation_notes, student_progress)
  VALUES
    (intervention_id_temp, '2025-10-20', '14:00:00', 45, wendy_id, true, 'Initial session. Built rapport. Isabella very open about anxiety and perfectionism.', 'Good insight into triggers. Identified main stressors: tests, presentations, parent expectations.'),
    (intervention_id_temp, '2025-10-27', '14:00:00', 45, wendy_id, true, 'Introduced breathing exercises and thought challenging. Practiced in session.', 'Isabella practiced breathing daily. Reports it helped before math test.');

  RAISE NOTICE 'Successfully created test sessions';
END $$;

-- ============================================================================
-- STEP 5: CREATE PARENT MEETINGS
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  student_id_temp UUID;
  case_id_temp UUID;
BEGIN
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';

  -- Parent meeting for Sofia (urgent case)
  SELECT id INTO student_id_temp FROM students WHERE student_id = 'TEST-PREK-001';
  SELECT c.id INTO case_id_temp FROM cases c WHERE c.student_id = student_id_temp AND c.is_urgent = true AND c.case_type = 'SEL';

  INSERT INTO parent_meetings (
    student_id,
    case_id,
    meeting_date,
    meeting_time,
    sss_staff_id,
    is_scheduled,
    meeting_status,
    agenda,
    meeting_notes,
    next_steps
  ) VALUES (
    student_id_temp,
    case_id_temp,
    '2025-11-13',
    '15:30:00',
    wendy_id,
    true,
    'COMPLETED',
    'Discuss Sofia separation anxiety. Review home and school strategies. Create action plan.',
    'Parents report Sofia very anxious at drop-off. Family emergency last month triggered regression. Parents committed to consistent drop-off routine. Agreed to visual schedule at home.',
    'Parents will implement morning routine visual schedule. Daily check-in with teacher at drop-off. Follow-up meeting in 2 weeks.'
  );

  -- Upcoming parent meeting for Emma
  SELECT id INTO student_id_temp FROM students WHERE student_id = 'TEST-G3-001';
  SELECT c.id INTO case_id_temp FROM cases c WHERE c.student_id = student_id_temp AND c.case_type = 'ACADEMIC_SUPPORT';

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
    student_id_temp,
    case_id_temp,
    '2025-11-22',
    '16:00:00',
    wendy_id,
    true,
    'SCHEDULED',
    'Review progress in math intervention. Discuss home practice strategies. Review progress monitoring data.'
  );

  RAISE NOTICE 'Successfully created test parent meetings';
END $$;

-- ============================================================================
-- STEP 6: CREATE ACTION PLAN ITEMS
-- ============================================================================

DO $$
DECLARE
  student_id_temp UUID;
  case_id_temp UUID;
  meeting_id_temp UUID;
BEGIN
  -- Get Sofia's meeting ID
  SELECT s.id INTO student_id_temp FROM students WHERE student_id = 'TEST-PREK-001';
  SELECT pm.id INTO meeting_id_temp FROM parent_meetings pm WHERE pm.student_id = student_id_temp;
  SELECT c.id INTO case_id_temp FROM cases c WHERE c.student_id = student_id_temp AND c.case_type = 'SEL';

  -- Create action items from Sofia's parent meeting
  INSERT INTO action_plan_items (parent_meeting_id, student_id, case_id, description, due_date, assigned_to, is_completed)
  VALUES
    (meeting_id_temp, student_id_temp, case_id_temp, 'Create and implement morning routine visual schedule at home', '2025-11-20', 'Parent', false),
    (meeting_id_temp, student_id_temp, case_id_temp, 'Practice separation routine at home (role play)', '2025-11-18', 'Parent', true),
    (meeting_id_temp, student_id_temp, case_id_temp, 'Daily brief check-in at drop-off with teacher', '2025-11-18', 'Teacher', false);

  RAISE NOTICE 'Successfully created test action plan items';
END $$;

-- ============================================================================
-- STEP 7: CREATE BEHAVIOR INCIDENTS
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  lucas_id UUID;
BEGIN
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';
  SELECT id INTO lucas_id FROM students WHERE student_id = 'TEST-K1-001';

  -- Create behavior incidents for Lucas (related to bullying case)
  INSERT INTO behavior_incidents (
    student_id,
    incident_date,
    incident_time,
    incident_location,
    incident_description,
    reported_by,
    severity,
    category,
    restorative_process_completed,
    restorative_date,
    restorative_staff_id,
    restorative_notes
  ) VALUES
    (
      lucas_id,
      '2025-11-10',
      '10:30:00',
      'Playground',
      'Lucas excluded from group play. Two students told him "you cant play with us" when he tried to join soccer.',
      'Ms. Thompson (Recess Monitor)',
      'MODERATE',
      'Exclusion/Social',
      true,
      '2025-11-11',
      wendy_id,
      'Facilitated restorative circle with involved students. Students apologized and agreed to include Lucas. Will monitor closely.'
    ),
    (
      lucas_id,
      '2025-11-12',
      '12:15:00',
      'Cafeteria',
      'Lucas sitting alone at lunch. When asked why, said "nobody wants to sit with me".',
      'Ms. Garcia (Lunch Monitor)',
      'MINOR',
      'Social Isolation',
      false,
      NULL,
      NULL,
      NULL
    );

  RAISE NOTICE 'Successfully created test behavior incidents';
END $$;

-- ============================================================================
-- STEP 8: CREATE PROTOCOL STEPS (for Bullying and Child Protection cases)
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  case_id_bullying UUID;
  case_id_cp UUID;
BEGIN
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';

  -- Get bullying case ID (Lucas)
  SELECT c.id INTO case_id_bullying
  FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-K1-001' AND c.case_type = 'BULLYING';

  -- Create protocol steps for bullying case
  INSERT INTO protocol_steps (case_id, protocol_type, step_sequence, step_type, step_status, start_date, completed_date, assigned_to, step_description, findings)
  VALUES
    (case_id_bullying, 'BULLYING', 1, 'Initial Report', 'COMPLETED', '2025-11-12', '2025-11-12', wendy_id, 'Document initial report from teacher/parent', 'Multiple incidents of exclusion documented. Student distressed.'),
    (case_id_bullying, 'BULLYING', 2, 'Investigation', 'COMPLETED', '2025-11-12', '2025-11-13', wendy_id, 'Gather information from all parties involved', 'Interviewed Lucas, two other students, and teacher. Pattern of exclusion confirmed.'),
    (case_id_bullying, 'BULLYING', 3, 'Parent Notification', 'COMPLETED', '2025-11-13', '2025-11-13', wendy_id, 'Notify parents of all students involved', 'All parents notified. Parent meeting scheduled.'),
    (case_id_bullying, 'BULLYING', 4, 'Parent Meeting', 'COMPLETED', '2025-11-14', '2025-11-14', wendy_id, 'Meet with parents to discuss situation and next steps', 'Parents cooperative. Agreed to support at home.'),
    (case_id_bullying, 'BULLYING', 5, 'Intervention Plan', 'IN_PROGRESS', '2025-11-15', NULL, wendy_id, 'Implement classroom and individual interventions', 'Social skills group started. Classroom lessons on inclusion planned.'),
    (case_id_bullying, 'BULLYING', 6, 'Follow-up Monitoring', 'PENDING', NULL, NULL, wendy_id, 'Monitor situation for 4 weeks', NULL);

  -- Get child protection case ID (Ahmed)
  SELECT c.id INTO case_id_cp
  FROM cases c
  JOIN students s ON s.id = c.student_id
  WHERE s.student_id = 'TEST-G5-001' AND c.case_type = 'CHILD_PROTECTION';

  -- Create protocol steps for child protection case
  INSERT INTO protocol_steps (case_id, protocol_type, step_sequence, step_type, step_status, start_date, completed_date, assigned_to, step_description, findings)
  VALUES
    (case_id_cp, 'CHILD_PROTECTION', 1, 'Initial Concern', 'COMPLETED', '2025-11-05', '2025-11-05', wendy_id, 'Document initial concern or disclosure', 'Student disclosed concerning information. Immediate action required.'),
    (case_id_cp, 'CHILD_PROTECTION', 2, 'Mandatory Report Filed', 'COMPLETED', '2025-11-05', '2025-11-05', wendy_id, 'File mandatory report with authorities', 'Report filed with local child protective services. Case number received.'),
    (case_id_cp, 'CHILD_PROTECTION', 3, 'Admin Notification', 'COMPLETED', '2025-11-05', '2025-11-05', wendy_id, 'Notify school administration', 'Principal and head of school notified immediately.'),
    (case_id_cp, 'CHILD_PROTECTION', 4, 'Safety Assessment', 'COMPLETED', '2025-11-06', '2025-11-06', wendy_id, 'Assess immediate safety needs', 'Student safe at school. Authorities conducting investigation.'),
    (case_id_cp, 'CHILD_PROTECTION', 5, 'Ongoing Monitoring', 'IN_PROGRESS', '2025-11-06', NULL, wendy_id, 'Continue to monitor and support student', 'Daily check-ins established. Coordinating with external services.'),
    (case_id_cp, 'CHILD_PROTECTION', 6, 'External Services Coordination', 'IN_PROGRESS', '2025-11-07', NULL, wendy_id, 'Coordinate with external agencies', 'In contact with assigned case worker.');

  RAISE NOTICE 'Successfully created protocol steps';
END $$;

-- ============================================================================
-- STEP 9: CREATE A REFERRAL
-- ============================================================================

DO $$
DECLARE
  wendy_id UUID;
  emma_id UUID;
BEGIN
  SELECT id INTO wendy_id FROM users WHERE email = 'wendy.aragon@atlas.es';
  SELECT id INTO emma_id FROM students WHERE student_id = 'TEST-G3-001';

  -- Create an unprocessed referral
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
    frequency_in_week,
    referral_processed
  ) VALUES (
    emma_id,
    'BEHAVIOR_FORM',
    '2025-11-17',
    '13:45:00',
    'Classroom 3B',
    'Emma has been increasingly withdrawn this week. Not participating in group work. Teacher noticed she seems sad.',
    'Mr. Peterson',
    'MODERATE',
    'Social-Emotional',
    2,
    false
  );

  RAISE NOTICE 'Successfully created test referral';
END $$;

-- ============================================================================
-- VERIFICATION QUERIES - RUN THESE TO CONFIRM DATA WAS CREATED
-- ============================================================================

SELECT '========================================' as separator;
SELECT 'TEST DATA VERIFICATION RESULTS' as title;
SELECT '========================================' as separator;

-- Verify students created
SELECT
  'Students Created' as verification_item,
  COUNT(*) as count,
  STRING_AGG(name || ' (' || grade || ')', ', ' ORDER BY grade) as details
FROM students
WHERE student_id LIKE 'TEST-%';

-- Verify cases created
SELECT
  'Cases Created' as verification_item,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'OPEN') as open_cases,
  COUNT(*) FILTER (WHERE status = 'CLOSED') as closed_cases,
  COUNT(*) FILTER (WHERE is_urgent = true) as urgent_cases
FROM cases c
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify cases by type
SELECT
  'Cases by Type' as verification_item,
  case_type,
  tier,
  COUNT(*) as count,
  CASE WHEN is_urgent THEN 'URGENT' ELSE 'Normal' END as urgency
FROM cases c
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%'
GROUP BY case_type, tier, is_urgent
ORDER BY case_type, tier;

-- Verify interventions created
SELECT
  'Interventions Created' as verification_item,
  COUNT(*) as count,
  STRING_AGG(intervention_name, ', ') as intervention_names
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify sessions created
SELECT
  'Sessions Created' as verification_item,
  COUNT(*) as count
FROM sessions sess
JOIN interventions i ON i.id = sess.intervention_id
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify parent meetings
SELECT
  'Parent Meetings Created' as verification_item,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE meeting_status = 'COMPLETED') as completed,
  COUNT(*) FILTER (WHERE meeting_status = 'SCHEDULED') as scheduled
FROM parent_meetings pm
JOIN students s ON s.id = pm.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify action plan items
SELECT
  'Action Plan Items Created' as verification_item,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_completed = true) as completed,
  COUNT(*) FILTER (WHERE is_completed = false) as pending
FROM action_plan_items api
JOIN students s ON s.id = api.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify behavior incidents
SELECT
  'Behavior Incidents Created' as verification_item,
  COUNT(*) as count
FROM behavior_incidents bi
JOIN students s ON s.id = bi.student_id
WHERE s.student_id LIKE 'TEST-%';

-- Verify protocol steps
SELECT
  'Protocol Steps Created' as verification_item,
  protocol_type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE step_status = 'COMPLETED') as completed,
  COUNT(*) FILTER (WHERE step_status = 'IN_PROGRESS') as in_progress
FROM protocol_steps ps
JOIN cases c ON c.id = ps.case_id
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%'
GROUP BY protocol_type;

-- Verify referrals
SELECT
  'Referrals Created' as verification_item,
  COUNT(*) as count
FROM referrals r
JOIN students s ON s.id = r.student_id
WHERE s.student_id LIKE 'TEST-%';

SELECT '========================================' as separator;
SELECT 'VERIFICATION COMPLETE!' as message;
SELECT '========================================' as separator;

-- ============================================================================
-- WENDY'S CASELOAD SUMMARY
-- ============================================================================

SELECT
  'WENDY CASELOAD SUMMARY' as report_title,
  (SELECT COUNT(*) FROM cases c
   JOIN students s ON s.id = c.student_id
   WHERE s.student_id LIKE 'TEST-%' AND c.status = 'OPEN') as total_open_cases,
  (SELECT COUNT(*) FROM cases c
   JOIN students s ON s.id = c.student_id
   WHERE s.student_id LIKE 'TEST-%' AND c.is_urgent = true AND c.status = 'OPEN') as urgent_cases,
  (SELECT COUNT(*) FROM cases c
   JOIN students s ON s.id = c.student_id
   WHERE s.student_id LIKE 'TEST-%' AND c.tier = 1 AND c.status = 'OPEN') as tier_1,
  (SELECT COUNT(*) FROM cases c
   JOIN students s ON s.id = c.student_id
   WHERE s.student_id LIKE 'TEST-%' AND c.tier = 2 AND c.status = 'OPEN') as tier_2,
  (SELECT COUNT(*) FROM cases c
   JOIN students s ON s.id = c.student_id
   WHERE s.student_id LIKE 'TEST-%' AND c.tier = 3 AND c.status = 'OPEN') as tier_3;

-- ============================================================================
-- END OF TEST DATA SCRIPT
-- ============================================================================
