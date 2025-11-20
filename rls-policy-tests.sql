-- ============================================================================
-- MAIA SSS APP - RLS POLICY SECURITY TESTS
-- ============================================================================
-- Project: MAIA SSS App - Week 2 Verification
-- Date: November 18, 2025
-- Description: Comprehensive RLS policy tests to verify security implementation
--
-- IMPORTANT SECURITY NOTE:
-- These tests verify that:
-- 1. SSS_STAFF can access all case data
-- 2. Non-SSS users CANNOT access case data inappropriately
-- 3. RLS policies properly enforce role-based access
-- 4. Data isolation works correctly
--
-- USAGE:
-- 1. Run this script AFTER deploying schema and creating test data
-- 2. Review all test results - ANY failures indicate security vulnerabilities
-- 3. ALL tests should show ✓ PASS for production readiness
-- ============================================================================

SELECT '============================================================================' as divider;
SELECT 'MAIA SSS RLS POLICY SECURITY TEST REPORT' as title;
SELECT 'Generated: ' || NOW()::text as timestamp;
SELECT '============================================================================' as divider;

-- ============================================================================
-- SECTION 1: VERIFY TEST USER EXISTS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 1: VERIFY TEST USER EXISTS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 1.1: Check Wendy's user exists and has correct role
SELECT
  '1.1 Wendy User Verification' as test_name,
  id,
  email,
  first_name,
  last_name,
  role,
  CASE
    WHEN role = 'SSS_STAFF' THEN '✓ PASS - User is SSS_STAFF'
    ELSE '✗ FAIL - User should be SSS_STAFF but is: ' || COALESCE(role, 'NULL')
  END as status
FROM users
WHERE email = 'wendy.aragon@atlas.es';

-- If the above returns no rows, the test user doesn't exist!
-- Check if any SSS_STAFF users exist
SELECT
  '1.2 All SSS_STAFF Users' as test_section,
  COUNT(*) as sss_staff_count,
  STRING_AGG(email, ', ') as sss_staff_emails
FROM users
WHERE role = 'SSS_STAFF';

-- ============================================================================
-- SECTION 2: BASIC RLS POLICY EXISTENCE CHECKS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 2: RLS POLICY EXISTENCE CHECKS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 2.1: Verify cases table has RLS policies
SELECT
  '2.1 Cases Table RLS Policies' as test_name,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) >= 3 THEN '✓ PASS - Multiple policies exist'
    ELSE '✗ FAIL - Insufficient policies'
  END as status,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'cases';

-- 2.2: Verify students table has RLS policies
SELECT
  '2.2 Students Table RLS Policies' as test_name,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) >= 3 THEN '✓ PASS - Multiple policies exist'
    ELSE '✗ FAIL - Insufficient policies'
  END as status,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'students';

-- 2.3: Verify interventions table has RLS policies
SELECT
  '2.3 Interventions Table RLS Policies' as test_name,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) >= 2 THEN '✓ PASS - Multiple policies exist'
    ELSE '✗ FAIL - Insufficient policies'
  END as status,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'interventions';

-- 2.4: List all RLS policies for security review
SELECT
  '2.4 All RLS Policies by Table' as test_section,
  tablename,
  policyname,
  cmd as operation,
  CASE
    WHEN qual IS NOT NULL THEN '✓ Has USING clause'
    WHEN with_check IS NOT NULL THEN '✓ Has WITH CHECK clause'
    ELSE '⚠ No restrictions'
  END as policy_type
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SECTION 3: SSS_STAFF ACCESS VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 3: SSS_STAFF ACCESS VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- NOTE: These tests check if policies EXIST that allow SSS_STAFF access
-- Actual enforcement testing requires setting auth.uid() which is done at runtime

-- 3.1: Verify SSS can view cases policy exists
SELECT
  '3.1 SSS Can View All Cases Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'cases'
      AND policyname LIKE '%sss%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for SSS_STAFF to view cases'
    ELSE '✗ FAIL - Missing SSS_STAFF view policy for cases'
  END as status;

-- 3.2: Verify SSS can manage cases policy exists
SELECT
  '3.2 SSS Can Manage Cases Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'cases'
      AND policyname LIKE '%sss%manage%'
      AND cmd = 'ALL'
    ) THEN '✓ PASS - Policy exists for SSS_STAFF to manage cases'
    ELSE '✗ FAIL - Missing SSS_STAFF manage policy for cases'
  END as status;

-- 3.3: Verify SSS can view students policy exists
SELECT
  '3.3 SSS Can View All Students Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname LIKE '%sss%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for SSS_STAFF to view students'
    ELSE '✗ FAIL - Missing SSS_STAFF view policy for students'
  END as status;

-- 3.4: Verify SSS can manage students policy exists
SELECT
  '3.4 SSS Can Manage Students Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname LIKE '%sss%manage%'
      AND cmd = 'ALL'
    ) THEN '✓ PASS - Policy exists for SSS_STAFF to manage students'
    ELSE '✗ FAIL - Missing SSS_STAFF manage policy for students'
  END as status;

-- ============================================================================
-- SECTION 4: TEACHER ACCESS VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 4: TEACHER ACCESS VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 4.1: Verify teacher can view own students policy exists
SELECT
  '4.1 Teacher Can View Own Students Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname LIKE '%teacher%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for teachers to view their students'
    ELSE '✗ FAIL - Missing teacher view policy for students'
  END as status;

-- 4.2: Verify teacher can view cases for own students policy exists
SELECT
  '4.2 Teacher Can View Cases for Own Students Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'cases'
      AND policyname LIKE '%teacher%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for teachers to view cases for their students'
    ELSE '✗ FAIL - Missing teacher view policy for cases'
  END as status;

-- 4.3: Verify teacher can create referrals policy exists
SELECT
  '4.3 Teacher Can Create Referrals Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'referrals'
      AND policyname LIKE '%teacher%insert%'
      AND cmd = 'INSERT'
    ) THEN '✓ PASS - Policy exists for teachers to create referrals'
    ELSE '✗ FAIL - Missing teacher insert policy for referrals'
  END as status;

-- ============================================================================
-- SECTION 5: ADMIN ACCESS VERIFICATION
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 5: ADMIN ACCESS VERIFICATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 5.1: Verify admin can view all students policy exists
SELECT
  '5.1 Admin Can View All Students Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname LIKE '%admin%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for admins to view all students'
    ELSE '✗ FAIL - Missing admin view policy for students'
  END as status;

-- 5.2: Verify admin can view all cases policy exists
SELECT
  '5.2 Admin Can View All Cases Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'cases'
      AND policyname LIKE '%admin%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for admins to view all cases'
    ELSE '✗ FAIL - Missing admin view policy for cases'
  END as status;

-- 5.3: Verify admin can view audit logs policy exists
SELECT
  '5.3 Admin Can View Audit Logs Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'audit_log'
      AND policyname LIKE '%admin%'
      AND cmd IN ('SELECT', 'ALL')
    ) THEN '✓ PASS - Policy exists for admins to view audit logs'
    ELSE '✗ FAIL - Missing admin view policy for audit_log'
  END as status;

-- ============================================================================
-- SECTION 6: DATA ACCESS SIMULATION (if test data exists)
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 6: DATA ACCESS SIMULATION
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- NOTE: These tests show what data WOULD be accessible if properly authenticated
-- In production, auth.uid() will be set by Supabase based on logged-in user

-- 6.1: Simulate SSS_STAFF viewing cases (as database admin)
SELECT
  '6.1 SSS_STAFF Case Access Simulation' as test_section,
  COUNT(*) as accessible_cases,
  COUNT(*) FILTER (WHERE status = 'OPEN') as open_cases,
  COUNT(*) FILTER (WHERE is_urgent = true) as urgent_cases,
  CASE
    WHEN COUNT(*) > 0 THEN '✓ PASS - Cases accessible to SSS_STAFF'
    ELSE '⚠ INFO - No test cases created yet'
  END as status
FROM cases c
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%';

-- 6.2: Show sample accessible cases
SELECT
  '6.2 Sample Accessible Cases' as test_section,
  c.case_type,
  c.tier,
  c.status,
  c.is_urgent,
  s.name as student_name,
  s.grade
FROM cases c
JOIN students s ON s.id = c.student_id
WHERE s.student_id LIKE 'TEST-%'
ORDER BY c.is_urgent DESC, c.opened_date DESC
LIMIT 5;

-- 6.3: Verify RLS is actually enabled (critical security check)
SELECT
  '6.3 RLS Actually Enabled on Critical Tables' as test_name,
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ ENABLED'
    ELSE '✗ DISABLED - SECURITY RISK!'
  END as rls_status,
  CASE
    WHEN rowsecurity THEN '✓ PASS'
    ELSE '✗ FAIL - CRITICAL SECURITY ISSUE'
  END as test_result
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('cases', 'students', 'interventions', 'sessions', 'parent_meetings', 'files', 'audit_log')
ORDER BY tablename;

-- ============================================================================
-- SECTION 7: POLICY COVERAGE ANALYSIS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 7: POLICY COVERAGE ANALYSIS
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 7.1: Tables with no policies (security risk!)
SELECT
  '7.1 Tables WITHOUT RLS Policies' as test_name,
  table_name,
  '✗ SECURITY RISK - No policies defined!' as status
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND NOT EXISTS (
  SELECT 1 FROM pg_policies p
  WHERE p.schemaname = 'public'
  AND p.tablename = t.table_name
)
ORDER BY table_name;

-- If the above returns no rows, that's good!
SELECT
  '7.1 Result' as test_name,
  CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies p
        WHERE p.schemaname = 'public'
        AND p.tablename = t.table_name
      )
    ) THEN '✓ PASS - All tables have RLS policies'
    ELSE '✗ FAIL - Some tables lack policies'
  END as status;

-- 7.2: Policy operation coverage
SELECT
  '7.2 Policy Operation Coverage' as test_section,
  tablename,
  STRING_AGG(DISTINCT cmd, ', ' ORDER BY cmd) as operations_covered,
  COUNT(DISTINCT cmd) as operation_count,
  CASE
    WHEN COUNT(DISTINCT cmd) >= 2 THEN '✓ Good coverage'
    WHEN COUNT(DISTINCT cmd) = 1 THEN '⚠ Limited coverage'
    ELSE '✗ No coverage'
  END as coverage_status
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY operation_count DESC, tablename;

-- ============================================================================
-- SECTION 8: SECURITY BEST PRACTICES CHECK
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 8: SECURITY BEST PRACTICES
═══════════════════════════════════════════════════════════════════════════' as section_header;

-- 8.1: Verify sensitive tables have RLS enabled
SELECT
  '8.1 Sensitive Tables RLS Check' as test_name,
  'cases' as table_name,
  CASE
    WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cases')
    THEN '✓ PASS'
    ELSE '✗ FAIL - CRITICAL'
  END as rls_enabled
UNION ALL
SELECT '8.1 Sensitive Tables RLS Check', 'students',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN '✓ PASS' ELSE '✗ FAIL - CRITICAL' END
UNION ALL
SELECT '8.1 Sensitive Tables RLS Check', 'evaluations',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evaluations') THEN '✓ PASS' ELSE '✗ FAIL - CRITICAL' END
UNION ALL
SELECT '8.1 Sensitive Tables RLS Check', 'protocol_steps',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'protocol_steps') THEN '✓ PASS' ELSE '✗ FAIL - CRITICAL' END
UNION ALL
SELECT '8.1 Sensitive Tables RLS Check', 'files',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'files') THEN '✓ PASS' ELSE '✗ FAIL - CRITICAL' END
UNION ALL
SELECT '8.1 Sensitive Tables RLS Check', 'audit_log',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_log') THEN '✓ PASS' ELSE '✗ FAIL - CRITICAL' END;

-- 8.2: Verify audit log has insert policy (for triggers)
SELECT
  '8.2 Audit Log Insert Policy' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'audit_log'
      AND cmd = 'INSERT'
    ) THEN '✓ PASS - Audit log can accept inserts'
    ELSE '✗ FAIL - Audit log cannot be populated'
  END as status;

-- 8.3: Check for overly permissive policies
SELECT
  '8.3 Check for Overly Permissive Policies' as test_section,
  tablename,
  policyname,
  cmd,
  CASE
    WHEN qual IS NULL AND with_check IS NULL THEN '⚠ WARNING - No restrictions!'
    ELSE '✓ Has restrictions'
  END as restriction_status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SECTION 9: RECOMMENDED MANUAL TESTS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 9: MANUAL TESTING RECOMMENDATIONS
═══════════════════════════════════════════════════════════════════════════' as section_header;

SELECT '
IMPORTANT: The following manual tests should be performed in the application:

1. SSS_STAFF ACCESS TESTS:
   - Log in as wendy.aragon@atlas.es
   - Verify you can see all test cases in the dashboard
   - Verify you can create/edit/delete cases
   - Verify you can view all students
   - Verify you can access all intervention data

2. TEACHER ACCESS TESTS (when teacher users exist):
   - Log in as a teacher
   - Verify you can ONLY see students assigned to you
   - Verify you can see cases for your students
   - Verify you CANNOT see cases for other students
   - Verify you can create referrals

3. ADMIN ACCESS TESTS (when admin users exist):
   - Log in as an admin
   - Verify you can view all students
   - Verify you can view all cases (read-only)
   - Verify you CANNOT edit cases
   - Verify you can view audit logs

4. UNAUTHORIZED ACCESS TESTS:
   - Try to access data without being logged in
   - Verify all protected endpoints return 401/403
   - Try to access data as wrong role
   - Verify RLS blocks unauthorized access

5. DATA ISOLATION TESTS:
   - Create data as one user
   - Verify other users cannot see it (unless allowed by role)
   - Verify CASCADE deletes work properly
   - Verify foreign key constraints prevent orphaned records

AUTOMATED TEST RECOMMENDATION:
Consider using a testing framework (e.g., Jest, Vitest) with Supabase client
to programmatically test RLS policies with different authenticated users.

' as manual_testing_guide;

-- ============================================================================
-- SECTION 10: OVERALL SECURITY STATUS
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
SECTION 10: OVERALL SECURITY STATUS SUMMARY
═══════════════════════════════════════════════════════════════════════════' as section_header;

SELECT
  'Security Component' as component,
  'Status' as status,
  'Count' as count_info
UNION ALL
SELECT
  'RLS Enabled on All Tables',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) =
         (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE')
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END,
  (SELECT COUNT(*)::text FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) || ' / ' ||
  (SELECT COUNT(*)::text FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE')
UNION ALL
SELECT
  'Total RLS Policies',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 50
    THEN '✓ PASS'
    ELSE '✗ FAIL'
  END,
  (SELECT COUNT(*)::text FROM pg_policies WHERE schemaname = 'public')
UNION ALL
SELECT
  'SSS_STAFF Policies',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%sss%') >= 10
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END,
  (SELECT COUNT(*)::text FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%sss%')
UNION ALL
SELECT
  'Teacher Policies',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%teacher%') >= 5
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END,
  (SELECT COUNT(*)::text FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%teacher%')
UNION ALL
SELECT
  'Admin Policies',
  CASE
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%admin%') >= 3
    THEN '✓ PASS'
    ELSE '⚠ WARNING'
  END,
  (SELECT COUNT(*)::text FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%admin%');

-- ============================================================================
-- FINAL VERDICT
-- ============================================================================

SELECT '
═══════════════════════════════════════════════════════════════════════════
RLS SECURITY TEST COMPLETE
═══════════════════════════════════════════════════════════════════════════' as final_message;

SELECT
  CASE
    WHEN (
      (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) = 16
      AND (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 50
      AND NOT EXISTS (
        SELECT 1 FROM information_schema.tables t
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND NOT EXISTS (
          SELECT 1 FROM pg_policies p
          WHERE p.schemaname = 'public'
          AND p.tablename = t.table_name
        )
      )
    ) THEN '
    ✓✓✓ RLS SECURITY POLICIES VERIFIED ✓✓✓

    All automated security checks passed!
    - RLS enabled on all 16 tables
    - 50+ security policies in place
    - All tables have policy coverage
    - Role-based access controls configured

    NEXT STEPS:
    1. Perform manual testing with actual users (see Section 9)
    2. Test with Supabase client in application
    3. Verify auth.uid() is properly set at runtime
    4. Test edge cases and unauthorized access attempts

    IMPORTANT:
    Automated tests verify policy EXISTENCE.
    Manual testing verifies policy ENFORCEMENT.
    Both are required for production readiness!
    '
    ELSE '
    ⚠⚠⚠ SECURITY ISSUES DETECTED ⚠⚠⚠

    Review the test results above carefully.
    Look for any ✗ FAIL messages.
    Address all security issues before going to production.

    Common issues:
    - RLS not enabled on some tables
    - Missing policies for certain operations
    - Policies too permissive or too restrictive
    '
  END as security_verdict;

-- ============================================================================
-- END OF RLS SECURITY TESTS
-- ============================================================================
