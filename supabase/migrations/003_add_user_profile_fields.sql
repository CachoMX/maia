-- Migration: Add department and phone fields to users table
-- Date: November 19, 2025
-- Description: Add profile fields for Settings page functionality

-- Add department column
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;

-- Add phone column
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create index on department for potential filtering
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Update the updated_at trigger to work with these new fields
-- (Already exists from previous migration, just noting for completeness)

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'Migration 003_add_user_profile_fields.sql completed successfully';
  RAISE NOTICE 'Added columns: department, phone';
  RAISE NOTICE 'Added index: idx_users_department';
END $$;
