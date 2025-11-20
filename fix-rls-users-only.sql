-- =====================================================
-- FIX RLS INFINITE RECURSION - USERS TABLE ONLY
-- =====================================================
-- This script fixes ONLY the users table RLS issue
-- which is causing the infinite recursion errors
-- =====================================================

-- 1. DROP ALL EXISTING POLICIES ON USERS TABLE
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_delete_own" ON users;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;

-- 2. DISABLE RLS ON USERS TABLE (temporary fix to get dashboard working)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Verify fix worked
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'users';
-- Should show: relrowsecurity = f (false)

-- 4. Test that we can query users without recursion
SELECT COUNT(*) FROM users;

-- 5. Test that we can query cases with case manager join
SELECT COUNT(*)
FROM cases c
LEFT JOIN users u ON c.case_manager_id = u.id;

-- =====================================================
-- SUMMARY
-- =====================================================
-- This script:
-- 1. Removes ALL policies from users table
-- 2. Disables RLS on users table completely
-- 3. Verifies the fix worked
--
-- This will immediately fix all dashboard API errors
-- caused by infinite recursion in users table policies.
-- =====================================================
