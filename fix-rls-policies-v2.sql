-- ============================================================================
-- FIX RLS POLICIES - REMOVE INFINITE RECURSION (V2)
-- ============================================================================
-- This script fixes the infinite recursion error in the users table RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Drop ALL existing policies on users table (old and new)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "SSS staff can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;

-- STEP 2: Create simple, non-recursive policies
-- These policies don't reference the users table in their USING clause,
-- which prevents the infinite recursion error

-- Allow all authenticated users to read all user records
-- This is safe because the users table only contains staff info
CREATE POLICY "users_select_policy"
ON users FOR SELECT
TO authenticated
USING (true);

-- Allow users to update only their own record
CREATE POLICY "users_update_own"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own record (for user registration)
CREATE POLICY "users_insert_own"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- STEP 3: Verify RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- STEP 4: Test the policies work
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- STEP 5: Test a simple query to verify no recursion
-- This should return results without error
SELECT id, email, first_name, last_name, role
FROM users
LIMIT 5;

-- SUCCESS MESSAGE
SELECT 'RLS policies fixed successfully! Dashboard should work now.' as status;
