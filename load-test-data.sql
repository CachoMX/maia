-- ============================================================================
-- MAIA SSS APP - TEST DATA (WORKING VERSION)
-- ============================================================================

-- STEP 1: CREATE TEST STUDENTS
DELETE FROM students WHERE student_id LIKE 'TEST-%';

INSERT INTO students (name, grade, date_of_birth, student_id, nationality, mother_tongue, start_date_at_atlas) VALUES
('Sofia Martinez', 'PreK', '2020-03-15', 'TEST-PREK-001', 'Spanish', 'Spanish', '2024-09-01'),
('Lucas Chen', 'K1', '2019-07-22', 'TEST-K1-001', 'Chinese', 'Mandarin', '2024-09-01'),
('Emma Johnson', 'G3', '2015-11-08', 'TEST-G3-001', 'American', 'English', '2022-09-01'),
('Ahmed Al-Rashid', 'G5', '2013-05-20', 'TEST-G5-001', 'Saudi Arabian', 'Arabic', '2021-09-01'),
('Isabella Rodriguez', 'MS', '2011-09-12', 'TEST-MS-001', 'Mexican', 'Spanish', '2020-09-01');

-- STEP 2: CREATE TEST CASES
WITH wendy AS (
  SELECT id FROM users WHERE email = 'wendy.aragon@atlas.es' LIMIT 1
),
sofia AS (SELECT id FROM students WHERE student_id = 'TEST-PREK-001'),
lucas AS (SELECT id FROM students WHERE student_id = 'TEST-K1-001'),
emma AS (SELECT id FROM students WHERE student_id = 'TEST-G3-001'),
ahmed AS (SELECT id FROM students WHERE student_id = 'TEST-G5-001'),
isabella AS (SELECT id FROM students WHERE student_id = 'TEST-MS-001')

INSERT INTO cases (student_id, case_type, tier, status, is_urgent, opened_date, expected_closure_date, case_manager_id, reason_for_referral, referral_source, internal_notes, created_by, intervention_types)
SELECT sofia.id, 'SEL', 2, 'OPEN', true, '2025-11-10'::date, '2025-12-15'::date, wendy.id, 'Student showing severe separation anxiety. Crying for extended periods.', 'PARENT', 'URGENT: Immediate Tier 2 intervention needed.', wendy.id, ARRAY['Individual counseling', 'Parent consultation']
FROM wendy, sofia
UNION ALL
SELECT lucas.id, 'ACADEMIC_SUPPORT', 1, 'OPEN', true, '2025-11-15'::date, '2026-01-30'::date, wendy.id, 'Student struggling with phonics and letter recognition.', 'BEHAVIOR_FORM', 'URGENT: Fast-track evaluation needed.', wendy.id, ARRAY['Reading intervention']
FROM wendy, lucas
UNION ALL
SELECT emma.id, 'ACADEMIC_SUPPORT', 2, 'OPEN', false, '2025-10-01'::date, '2025-12-20'::date, wendy.id, 'Student struggling with math concepts.', 'BEHAVIOR_FORM', 'Tier 2 small group instruction.', wendy.id, ARRAY['Math small group']
FROM wendy, emma
UNION ALL
SELECT ahmed.id, 'ACADEMIC_SUPPORT', 3, 'OPEN', false, '2025-09-15'::date, '2026-06-15'::date, wendy.id, 'Student has documented dyslexia.', 'ADMIN', 'IEP in place.', wendy.id, ARRAY['Wilson Reading Program']
FROM wendy, ahmed
UNION ALL
SELECT emma.id, 'SEL', 1, 'OPEN', false, '2025-11-01'::date, '2025-12-01'::date, wendy.id, 'Student having difficulty making friends.', 'BEHAVIOR_FORM', 'Started lunch bunch group.', wendy.id, ARRAY['Social skills group']
FROM wendy, emma
UNION ALL
SELECT isabella.id, 'SEL', 2, 'OPEN', false, '2025-10-15'::date, '2026-02-15'::date, wendy.id, 'Student showing signs of anxiety and perfectionism.', 'SELF', 'Weekly check-ins established.', wendy.id, ARRAY['Individual counseling']
FROM wendy, isabella
UNION ALL
SELECT lucas.id, 'BULLYING', 2, 'OPEN', false, '2025-11-12'::date, '2025-12-10'::date, wendy.id, 'Student reported being excluded by peers.', 'BEHAVIOR_FORM', 'Following bullying protocol.', wendy.id, ARRAY['Restorative practices']
FROM wendy, lucas
UNION ALL
SELECT ahmed.id, 'CHILD_PROTECTION', 3, 'OPEN', false, '2025-11-05'::date, NULL, wendy.id, 'Student disclosed concerning information.', 'ADMIN', 'CONFIDENTIAL: Report filed.', wendy.id, ARRAY['Safety planning']
FROM wendy, ahmed
UNION ALL
SELECT isabella.id, 'CONFLICT_RESOLUTION', 1, 'OPEN', false, '2025-11-14'::date, '2025-11-25'::date, wendy.id, 'Conflict with peer in group project.', 'BEHAVIOR_FORM', 'Mediation scheduled.', wendy.id, ARRAY['Peer mediation']
FROM wendy, isabella;

-- STEP 3: CREATE INTERVENTIONS
WITH wendy AS (SELECT id FROM users WHERE email = 'wendy.aragon@atlas.es' LIMIT 1)
INSERT INTO interventions (case_id, type, tier, intervention_name, description, start_date, estimated_end_date, duration_weeks, frequency, facilitator_id, is_active)
SELECT c.id, 'ACADEMIC', 2, 'Math Facts Fluency Group', 'Small group multiplication instruction', '2025-10-08'::date, '2025-12-20'::date, 10, '3x per week', w.id, true
FROM cases c
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-G3-001' AND c.case_type = 'ACADEMIC_SUPPORT'
UNION ALL
SELECT c.id, 'SEL', 2, 'Anxiety Management', 'Weekly individual counseling sessions', '2025-10-20'::date, '2026-02-15'::date, 16, 'Weekly, 45 min', w.id, true
FROM cases c
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-MS-001' AND c.case_type = 'SEL' AND c.tier = 2
UNION ALL
SELECT c.id, 'ACADEMIC', 3, 'Wilson Reading System', 'Intensive phonics-based reading program', '2025-09-20'::date, '2026-06-15'::date, 36, 'Daily, 60 min', w.id, true
FROM cases c
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-G5-001' AND c.case_type = 'ACADEMIC_SUPPORT';

-- STEP 4: CREATE SESSIONS
WITH wendy AS (SELECT id FROM users WHERE email = 'wendy.aragon@atlas.es' LIMIT 1)
INSERT INTO sessions (intervention_id, session_date, session_time, duration, facilitator_id, student_attended, observation_notes, student_progress)
SELECT i.id, '2025-10-08'::date, '10:00:00'::time, 30, w.id, true, 'First session. Emma engaged well.', 'Good baseline.'
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-G3-001' AND i.intervention_name = 'Math Facts Fluency Group'
UNION ALL
SELECT i.id, '2025-10-10'::date, '10:00:00'::time, 30, w.id, true, 'Continued with array models.', 'Progress noted.'
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-G3-001' AND i.intervention_name = 'Math Facts Fluency Group'
UNION ALL
SELECT i.id, '2025-10-20'::date, '14:00:00'::time, 45, w.id, true, 'Initial session. Built rapport.', 'Good insight into triggers.'
FROM interventions i
JOIN cases c ON c.id = i.case_id
JOIN students s ON s.id = c.student_id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-MS-001' AND i.type = 'SEL';

-- STEP 5: CREATE PARENT MEETINGS
WITH wendy AS (SELECT id FROM users WHERE email = 'wendy.aragon@atlas.es' LIMIT 1)
INSERT INTO parent_meetings (student_id, case_id, meeting_date, meeting_time, sss_staff_id, is_scheduled, meeting_status, agenda, meeting_notes, next_steps)
SELECT s.id, c.id, '2025-11-13'::date, '15:30:00'::time, w.id, true, 'COMPLETED', 'Discuss Sofia separation anxiety', 'Parents committed to routine.', 'Daily check-in with teacher.'
FROM students s
JOIN cases c ON c.student_id = s.id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-PREK-001' AND c.is_urgent = true AND c.case_type = 'SEL'
UNION ALL
SELECT s.id, c.id, '2025-11-22'::date, '16:00:00'::time, w.id, true, 'SCHEDULED', 'Review progress in math intervention', NULL, NULL
FROM students s
JOIN cases c ON c.student_id = s.id
CROSS JOIN wendy w
WHERE s.student_id = 'TEST-G3-001' AND c.case_type = 'ACADEMIC_SUPPORT';

-- VERIFICATION QUERY
SELECT
  'Students' as item, COUNT(*) as count
FROM students WHERE student_id LIKE 'TEST-%'
UNION ALL
SELECT 'Cases', COUNT(*) FROM cases c JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT 'Interventions', COUNT(*) FROM interventions i JOIN cases c ON c.id = i.case_id JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT 'Sessions', COUNT(*) FROM sessions sess JOIN interventions i ON i.id = sess.intervention_id JOIN cases c ON c.id = i.case_id JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT 'Meetings', COUNT(*) FROM parent_meetings pm JOIN students s ON s.id = pm.student_id WHERE s.student_id LIKE 'TEST-%';
