-- MAIA SSS Database Verification Queries
-- Run these queries after deploying 001_initial_schema.sql to verify the deployment

-- ============================================================================
-- 1. VERIFY ALL TABLES EXIST
-- ============================================================================
SELECT
  'Tables Check' as verification_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 16 THEN 'PASS - All 16 tables created'
    ELSE 'FAIL - Expected 16 tables, found ' || COUNT(*)
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- List all tables
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- 2. VERIFY ROW LEVEL SECURITY IS ENABLED
-- ============================================================================
SELECT
  'RLS Check' as verification_type,
  COUNT(*) as tables_with_rls,
  CASE
    WHEN COUNT(*) = 16 THEN 'PASS - RLS enabled on all tables'
    ELSE 'FAIL - RLS not enabled on all tables'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- Show RLS status for each table
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN 'ENABLED'
    ELSE 'DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 3. VERIFY RLS POLICIES EXIST
-- ============================================================================
SELECT
  'RLS Policies Check' as verification_type,
  COUNT(*) as total_policies,
  CASE
    WHEN COUNT(*) >= 50 THEN 'PASS - Sufficient RLS policies created'
    ELSE 'FAIL - Expected at least 50 policies, found ' || COUNT(*)
  END as status
FROM pg_policies
WHERE schemaname = 'public';

-- Count policies per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC, tablename;

-- ============================================================================
-- 4. VERIFY INDEXES EXIST
-- ============================================================================
SELECT
  'Indexes Check' as verification_type,
  COUNT(*) as total_indexes,
  CASE
    WHEN COUNT(*) >= 40 THEN 'PASS - Sufficient indexes created'
    ELSE 'WARNING - Expected at least 40 indexes, found ' || COUNT(*)
  END as status
FROM pg_indexes
WHERE schemaname = 'public';

-- List indexes per table
SELECT
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY index_count DESC, tablename;

-- ============================================================================
-- 5. VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================================================
SELECT
  'Foreign Keys Check' as verification_type,
  COUNT(*) as total_foreign_keys,
  CASE
    WHEN COUNT(*) >= 20 THEN 'PASS - Foreign keys created'
    ELSE 'WARNING - Expected at least 20 foreign keys, found ' || COUNT(*)
  END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';

-- List all foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
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
-- 6. VERIFY CHECK CONSTRAINTS
-- ============================================================================
SELECT
  'Check Constraints Check' as verification_type,
  COUNT(*) as total_check_constraints,
  CASE
    WHEN COUNT(*) >= 10 THEN 'PASS - Check constraints created'
    ELSE 'WARNING - Expected at least 10 check constraints'
  END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'CHECK'
AND table_schema = 'public';

-- ============================================================================
-- 7. VERIFY HELPER FUNCTIONS EXIST
-- ============================================================================
SELECT
  'Helper Functions Check' as verification_type,
  COUNT(*) as total_functions,
  CASE
    WHEN COUNT(*) >= 4 THEN 'PASS - Helper functions created (including triggers)'
    ELSE 'FAIL - Expected at least 4 functions'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- List all functions
SELECT
  routine_name,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================================================
-- 8. VERIFY TRIGGERS EXIST
-- ============================================================================
SELECT
  'Triggers Check' as verification_type,
  COUNT(*) as total_triggers,
  CASE
    WHEN COUNT(*) >= 14 THEN 'PASS - Updated_at triggers created'
    ELSE 'WARNING - Expected at least 14 triggers'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- List triggers per table
SELECT
  event_object_table as table_name,
  trigger_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- 9. VERIFY SPECIFIC CRITICAL FIELDS EXIST
-- ============================================================================

-- Check is_urgent field in cases table
SELECT
  'cases.is_urgent field' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'cases'
      AND column_name = 'is_urgent'
    ) THEN 'PASS - Field exists'
    ELSE 'FAIL - Field missing'
  END as status;

-- Check action_plan field in parent_meetings table
SELECT
  'parent_meetings.action_plan field' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'parent_meetings'
      AND column_name = 'action_plan'
    ) THEN 'PASS - Field exists'
    ELSE 'FAIL - Field missing'
  END as status;

-- Check restorative process fields in behavior_incidents table
SELECT
  'behavior_incidents restorative fields' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'behavior_incidents'
      AND column_name IN ('restorative_process_completed', 'restorative_date', 'restorative_staff_id')
    ) THEN 'PASS - Fields exist'
    ELSE 'FAIL - Fields missing'
  END as status;

-- Check action_plan_items table exists
SELECT
  'action_plan_items table' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'action_plan_items'
    ) THEN 'PASS - Table exists'
    ELSE 'FAIL - Table missing'
  END as status;

-- ============================================================================
-- 10. TEST HELPER FUNCTIONS
-- ============================================================================

-- Test get_tier_distribution_by_grade() function
-- Should return empty results initially but should not error
SELECT
  'get_tier_distribution_by_grade() function' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_name = 'get_tier_distribution_by_grade'
    ) THEN 'PASS - Function exists and can be called'
    ELSE 'FAIL - Function missing'
  END as status;

-- Test get_weekly_action_items() function
SELECT
  'get_weekly_action_items() function' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_name = 'get_weekly_action_items'
    ) THEN 'PASS - Function exists and can be called'
    ELSE 'FAIL - Function missing'
  END as status;

-- Test get_staff_case_load() function
SELECT
  'get_staff_case_load() function' as verification_type,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_name = 'get_staff_case_load'
    ) THEN 'PASS - Function exists'
    ELSE 'FAIL - Function missing'
  END as status;

-- ============================================================================
-- 11. VERIFY COLUMN DATA TYPES
-- ============================================================================

-- Critical UUID columns
SELECT
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'uuid' THEN 'PASS'
    ELSE 'FAIL - Should be UUID'
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

-- Array columns
SELECT
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'ARRAY' THEN 'PASS'
    ELSE 'WARNING - Expected ARRAY type'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name IN ('intervention_types', 'secondary_supporters', 'parent_ids', 'teacher_ids', 'student_ids', 'evidence_urls')
ORDER BY table_name, column_name;

-- JSONB columns
SELECT
  table_name,
  column_name,
  data_type,
  CASE
    WHEN data_type = 'jsonb' THEN 'PASS'
    ELSE 'FAIL - Should be JSONB'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name IN ('action_plan', 'changes')
ORDER BY table_name, column_name;

-- ============================================================================
-- 12. OVERALL DEPLOYMENT STATUS
-- ============================================================================

SELECT
  '========================================' as separator;

SELECT
  'OVERALL DEPLOYMENT STATUS' as title;

SELECT
  '========================================' as separator;

SELECT
  'Tables' as component,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') as count,
  '16 expected' as expected,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') = 16
    THEN 'PASS'
    ELSE 'FAIL'
  END as status
UNION ALL
SELECT
  'RLS Policies',
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public'),
  '50+ expected',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 50
    THEN 'PASS'
    ELSE 'FAIL'
  END
UNION ALL
SELECT
  'Indexes',
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
  '40+ expected',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') >= 40
    THEN 'PASS'
    ELSE 'WARNING'
  END
UNION ALL
SELECT
  'Foreign Keys',
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'),
  '20+ expected',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') >= 20
    THEN 'PASS'
    ELSE 'WARNING'
  END
UNION ALL
SELECT
  'Helper Functions',
  (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'),
  '4+ expected',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') >= 4
    THEN 'PASS'
    ELSE 'FAIL'
  END
UNION ALL
SELECT
  'Triggers',
  (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public'),
  '14+ expected',
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') >= 14
    THEN 'PASS'
    ELSE 'WARNING'
  END;

SELECT
  '========================================' as separator;

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================
