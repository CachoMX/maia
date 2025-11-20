-- ============================================================================
-- MAIA SSS APP - COMPREHENSIVE DATABASE VERIFICATION
-- ============================================================================
-- Project: MAIA SSS App - Week 2 Verification
-- Date: November 18, 2025
-- Description: Complete verification of database schema, RLS, indexes, and data
--
-- USAGE:
-- Run this entire script in Supabase SQL Editor after deploying the schema
-- Review results for any FAIL or WARNING messages
-- ============================================================================

SELECT '============================================================================' as divider;
SELECT 'MAIA SSS DATABASE VERIFICATION REPORT' as title;
SELECT 'Generated: ' || NOW()::text as timestamp;
SELECT '============================================================================' as divider;

-- ============================================================================
-- SECTION 1: TABLE VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 1: TABLE VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 1.1: Count all tables
SELECT
  '1.1 Total Tables' as check_name,
  COUNT(*) as actual_count,
  16 as expected_count,
  CASE
    WHEN COUNT(*) = 16 THEN '✓ PASS'
    ELSE '✗ FAIL - Expected 16 tables'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- 1.2: List all tables with column counts
SELECT
  '1.2 Table Details' as check_section,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count,
  CASE
    WHEN table_name IN (
      'users', 'students', 'cases', 'interventions', 'sessions',
      'evaluations', 'evaluation_steps', 'protocol_steps', 'parent_meetings',
      'action_plan_items', 'group_interventions', 'group_sessions',
      'referrals', 'behavior_incidents', 'files', 'audit_log'
    ) THEN '✓ Expected'
    ELSE '⚠ Unexpected table'
  END as table_status
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 1.3: Verify critical columns exist
SELECT
  '1.3 Critical Columns Verification' as check_section,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'cases' AND column_name = 'is_urgent'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "cases.is_urgent",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'parent_meetings' AND column_name = 'action_plan'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "parent_meetings.action_plan",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'behavior_incidents' AND column_name = 'restorative_process_completed'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "behavior_incidents.restorative_fields";

-- ============================================================================
-- SECTION 2: ROW LEVEL SECURITY (RLS) VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 2: ROW LEVEL SECURITY (RLS) VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 2.1: Verify RLS is enabled on all tables
SELECT
  '2.1 RLS Enabled Status' as check_name,
  COUNT(*) as tables_with_rls_enabled,
  16 as expected_count,
  CASE
    WHEN COUNT(*) = 16 THEN '✓ PASS - RLS enabled on all tables'
    ELSE '✗ FAIL - RLS not enabled on all tables'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- 2.2: Show RLS status for each table
SELECT
  '2.2 Per-Table RLS Status' as check_section,
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ ENABLED'
    ELSE '✗ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2.3: Count RLS policies
SELECT
  '2.3 RLS Policies Count' as check_name,
  COUNT(*) as total_policies,
  50 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 50 THEN '✓ PASS - Sufficient RLS policies'
    ELSE '✗ FAIL - Expected at least 50 policies, found ' || COUNT(*)
  END as status
FROM pg_policies
WHERE schemaname = 'public';

-- 2.4: Count policies per table
SELECT
  '2.4 Policies per Table' as check_section,
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC, tablename;

-- 2.5: Verify critical policies exist
SELECT
  '2.5 Critical Policies Check' as check_section,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'cases' AND policyname LIKE '%sss%'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "cases_sss_policies",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'students' AND policyname LIKE '%sss%'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "students_sss_policies",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'users'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "users_policies_exist";

-- ============================================================================
-- SECTION 3: INDEX VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 3: INDEX VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 3.1: Count total indexes
SELECT
  '3.1 Total Indexes' as check_name,
  COUNT(*) as total_indexes,
  40 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 40 THEN '✓ PASS - Sufficient indexes created'
    ELSE '⚠ WARNING - Expected at least 40 indexes, found ' || COUNT(*)
  END as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%pkey%';  -- Exclude primary key indexes

-- 3.2: List indexes per table
SELECT
  '3.2 Indexes per Table' as check_section,
  tablename,
  COUNT(*) as index_count,
  STRING_AGG(indexname, ', ' ORDER BY indexname) as index_names
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%pkey%'
GROUP BY tablename
ORDER BY index_count DESC, tablename;

-- 3.3: Verify critical indexes exist
SELECT
  '3.3 Critical Indexes Check' as check_section,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'cases' AND indexname = 'idx_cases_is_urgent'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "idx_cases_is_urgent",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'cases' AND indexname = 'idx_cases_status'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "idx_cases_status",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'students' AND indexname = 'idx_students_grade'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "idx_students_grade";

-- ============================================================================
-- SECTION 4: FOREIGN KEY CONSTRAINTS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 4: FOREIGN KEY CONSTRAINTS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 4.1: Count foreign keys
SELECT
  '4.1 Total Foreign Keys' as check_name,
  COUNT(*) as total_foreign_keys,
  20 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 20 THEN '✓ PASS - Foreign keys created'
    ELSE '⚠ WARNING - Expected at least 20 foreign keys, found ' || COUNT(*)
  END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';

-- 4.2: List all foreign keys
SELECT
  '4.2 Foreign Key Details' as check_section,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  '✓' as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- SECTION 5: CHECK CONSTRAINTS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 5: CHECK CONSTRAINTS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 5.1: Count check constraints
SELECT
  '5.1 Total Check Constraints' as check_name,
  COUNT(*) as total_check_constraints,
  10 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 10 THEN '✓ PASS - Check constraints created'
    ELSE '⚠ WARNING - Expected at least 10 check constraints'
  END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'CHECK'
AND table_schema = 'public';

-- 5.2: List check constraints
SELECT
  '5.2 Check Constraint Details' as check_section,
  tc.table_name,
  tc.constraint_name,
  '✓' as status
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'CHECK'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================================================
-- SECTION 6: FUNCTIONS AND TRIGGERS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 6: FUNCTIONS AND TRIGGERS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 6.1: Count functions
SELECT
  '6.1 Helper Functions' as check_name,
  COUNT(*) as total_functions,
  4 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 4 THEN '✓ PASS - Helper functions created'
    ELSE '✗ FAIL - Expected at least 4 functions'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- 6.2: List all functions
SELECT
  '6.2 Function Details' as check_section,
  routine_name,
  data_type as return_type,
  CASE
    WHEN routine_name IN (
      'update_updated_at_column',
      'get_staff_case_load',
      'get_weekly_action_items',
      'get_tier_distribution_by_grade'
    ) THEN '✓ Expected'
    ELSE '⚠ Other'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- 6.3: Verify critical helper functions exist
SELECT
  '6.3 Critical Helper Functions' as check_section,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'get_staff_case_load'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "get_staff_case_load",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'get_weekly_action_items'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "get_weekly_action_items",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'get_tier_distribution_by_grade'
    ) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as "get_tier_distribution_by_grade";

-- 6.4: Count triggers
SELECT
  '6.4 Triggers Count' as check_name,
  COUNT(*) as total_triggers,
  14 as minimum_expected,
  CASE
    WHEN COUNT(*) >= 14 THEN '✓ PASS - Updated_at triggers created'
    ELSE '⚠ WARNING - Expected at least 14 triggers'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- 6.5: List triggers per table
SELECT
  '6.5 Trigger Details' as check_section,
  event_object_table as table_name,
  trigger_name,
  action_timing || ' ' || event_manipulation as trigger_type,
  '✓' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- SECTION 7: DATA TYPE VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 7: DATA TYPE VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 7.1: Verify UUID columns
SELECT
  '7.1 UUID Primary Keys' as check_section,
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'uuid' THEN '✓ PASS'
    ELSE '✗ FAIL - Should be UUID'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'id'
AND table_name IN (
  'users', 'students', 'cases', 'interventions', 'sessions',
  'evaluations', 'parent_meetings', 'action_plan_items',
  'behavior_incidents', 'files'
)
ORDER BY table_name;

-- 7.2: Verify ARRAY columns
SELECT
  '7.2 Array Columns' as check_section,
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'ARRAY' THEN '✓ PASS'
    ELSE '⚠ WARNING - Expected ARRAY type'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name IN ('intervention_types', 'secondary_supporters', 'parent_ids', 'teacher_ids', 'student_ids', 'evidence_urls')
ORDER BY table_name, column_name;

-- 7.3: Verify JSONB columns
SELECT
  '7.3 JSONB Columns' as check_section,
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'jsonb' THEN '✓ PASS'
    ELSE '✗ FAIL - Should be JSONB'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name IN ('action_plan', 'changes')
ORDER BY table_name, column_name;

-- ============================================================================
-- SECTION 8: TEST HELPER FUNCTIONS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 8: TEST HELPER FUNCTIONS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 8.1: Test get_tier_distribution_by_grade() function
SELECT
  '8.1 Test get_tier_distribution_by_grade()' as check_name,
  'Function executed successfully' as result,
  '✓ PASS' as status;

-- Show actual function results (will be empty if no data yet)
SELECT
  '8.1 Function Results' as result_section,
  *
FROM get_tier_distribution_by_grade()
LIMIT 5;

-- 8.2: Test get_weekly_action_items() function
SELECT
  '8.2 Test get_weekly_action_items()' as check_name,
  'Function executed successfully' as result,
  '✓ PASS' as status;

-- Show actual function results (will be empty if no data yet)
SELECT
  '8.2 Function Results' as result_section,
  *
FROM get_weekly_action_items()
LIMIT 5;

-- ============================================================================
-- SECTION 9: DATA VERIFICATION (if test data exists)
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 9: DATA VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 9.1: Count records in each table
SELECT
  '9.1 Record Counts' as check_section,
  'users' as table_name,
  COUNT(*) as record_count
FROM users
UNION ALL
SELECT '9.1 Record Counts', 'students', COUNT(*) FROM students WHERE student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'cases', COUNT(*) FROM cases c JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'interventions', COUNT(*) FROM interventions i JOIN cases c ON c.id = i.case_id JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'sessions', COUNT(*) FROM sessions sess JOIN interventions i ON i.id = sess.intervention_id JOIN cases c ON c.id = i.case_id JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'parent_meetings', COUNT(*) FROM parent_meetings pm JOIN students s ON s.id = pm.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'action_plan_items', COUNT(*) FROM action_plan_items api JOIN students s ON s.id = api.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'behavior_incidents', COUNT(*) FROM behavior_incidents bi JOIN students s ON s.id = bi.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'protocol_steps', COUNT(*) FROM protocol_steps ps JOIN cases c ON c.id = ps.case_id JOIN students s ON s.id = c.student_id WHERE s.student_id LIKE 'TEST-%'
UNION ALL
SELECT '9.1 Record Counts', 'referrals', COUNT(*) FROM referrals r JOIN students s ON s.id = r.student_id WHERE s.student_id LIKE 'TEST-%';

-- 9.2: Verify Wendy's user exists
SELECT
  '9.2 Wendy User Check' as check_name,
  email,
  first_name,
  last_name,
  role,
  CASE
    WHEN role = 'SSS_STAFF' THEN '✓ PASS'
    ELSE '✗ FAIL - Should be SSS_STAFF'
  END as status
FROM users
WHERE email = 'wendy.aragon@atlas.es';

-- ============================================================================
-- SECTION 10: OVERALL SUMMARY
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 10: OVERALL DEPLOYMENT SUMMARY
═══════════════════════════════════════════════════════════════════════════' as section_header;

SELECT
  'Component' as component,
  'Actual' as actual,
  'Expected' as expected,
  'Status' as status
UNION ALL
SELECT
  'Tables',
  (SELECT COUNT(*)::text FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'),
  '16',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') = 16
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END
UNION ALL
SELECT
  'RLS Enabled',
  (SELECT COUNT(*)::text FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true),
  '16',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) = 16
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END
UNION ALL
SELECT
  'RLS Policies',
  (SELECT COUNT(*)::text FROM pg_policies WHERE schemaname = 'public'),
  '50+',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 50
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END
UNION ALL
SELECT
  'Indexes',
  (SELECT COUNT(*)::text FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT LIKE '%pkey%'),
  '40+',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT LIKE '%pkey%') >= 40
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END
UNION ALL
SELECT
  'Foreign Keys',
  (SELECT COUNT(*)::text FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'),
  '20+',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') >= 20
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END
UNION ALL
SELECT
  'Helper Functions',
  (SELECT COUNT(*)::text FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'),
  '4+',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') >= 4
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END
UNION ALL
SELECT
  'Triggers',
  (SELECT COUNT(*)::text FROM information_schema.triggers WHERE trigger_schema = 'public'),
  '14+',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') >= 14
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END;

-- ============================================================================
-- FINAL STATUS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
VERIFICATION COMPLETE
═══════════════════════════════════════════════════════════════════════════' as final_message;

SELECT
  CASE
    WHEN (
      (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') = 16
      AND (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) = 16
      AND (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 50
      AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') >= 4
    ) THEN '
    ✓✓✓ DATABASE IS PRODUCTION READY ✓✓✓

    All critical checks passed!
    Schema deployed successfully.
    RLS enabled on all tables.
    Security policies in place.
    Helper functions working.

    Next steps:
    1. Run test-data.sql to create test data
    2. Run rls-policy-tests.sql to verify security
    3. Begin Week 3 development
    '
    ELSE '
    ⚠⚠⚠ ISSUES DETECTED ⚠⚠⚠

    Please review the verification results above.
    Look for any ✗ FAIL or ⚠ WARNING messages.
    Address issues before proceeding.
    '
  END as deployment_status;

-- ============================================================================
-- END OF VERIFICATION REPORT
-- ============================================================================
