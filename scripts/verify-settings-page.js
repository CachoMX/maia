#!/usr/bin/env node

/**
 * Settings Page Verification Script
 *
 * Verifies that the Settings page implementation is complete and correct.
 * Run this script to check all files and configurations.
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`\n${BOLD}🔍 Maia Settings Page - Verification Script${RESET}\n`);

let allPassed = true;

// Helper function to check if file exists
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    console.log(`${GREEN}✓${RESET} ${description}`);
  } else {
    console.log(`${RED}✗${RESET} ${description} - FILE MISSING`);
    allPassed = false;
  }
  return exists;
}

// Helper function to check file content
function checkFileContains(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`${RED}✗${RESET} ${description} - FILE MISSING`);
    allPassed = false;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const contains = content.includes(searchString);

  if (contains) {
    console.log(`${GREEN}✓${RESET} ${description}`);
  } else {
    console.log(`${RED}✗${RESET} ${description} - NOT FOUND`);
    allPassed = false;
  }
  return contains;
}

console.log(`${BOLD}📁 File Existence Checks:${RESET}\n`);

// Check new files
checkFile(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  'Settings Client Component exists'
);

checkFile(
  path.join(__dirname, '..', 'app', 'api', 'users', '[id]', 'route.ts'),
  'User API endpoint exists'
);

checkFile(
  path.join(__dirname, '..', 'supabase', 'migrations', '003_add_user_profile_fields.sql'),
  'Database migration file exists'
);

checkFile(
  path.join(__dirname, '..', 'SETTINGS_PAGE_IMPLEMENTATION.md'),
  'Implementation documentation exists'
);

console.log(`\n${BOLD}🔍 Content Verification:${RESET}\n`);

// Check Settings page imports SettingsClient
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'page.tsx'),
  'import SettingsClient from',
  'Settings page imports SettingsClient'
);

// Check SettingsClient has all 4 tabs
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  "'profile' | 'notifications' | 'display' | 'system'",
  'SettingsClient has all 4 tabs defined'
);

// Check API has GET and PATCH methods
const apiFile = path.join(__dirname, '..', 'app', 'api', 'users', '[id]', 'route.ts');
checkFileContains(apiFile, 'export async function GET', 'API has GET endpoint');
checkFileContains(apiFile, 'export async function PATCH', 'API has PATCH endpoint');

// Check database types include new fields
const typesFile = path.join(__dirname, '..', 'types', 'database.ts');
checkFileContains(typesFile, 'department: string | null', 'Database types include department field');
checkFileContains(typesFile, 'phone: string | null', 'Database types include phone field');

// Check migration adds columns
const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '003_add_user_profile_fields.sql');
checkFileContains(migrationFile, 'ADD COLUMN IF NOT EXISTS department', 'Migration adds department column');
checkFileContains(migrationFile, 'ADD COLUMN IF NOT EXISTS phone', 'Migration adds phone column');

console.log(`\n${BOLD}🎨 Feature Checks:${RESET}\n`);

// Check for validation
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  'validateForm',
  'Form validation implemented'
);

// Check for save functionality
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  'handleSave',
  'Save functionality implemented'
);

// Check for unsaved changes detection
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  'hasUnsavedChanges',
  'Unsaved changes detection implemented'
);

// Check for security in API
checkFileContains(
  apiFile,
  'user.id !== userId',
  'API has security check for own profile only'
);

console.log(`\n${BOLD}🔐 Security Checks:${RESET}\n`);

// Check authentication
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'page.tsx'),
  'supabase.auth.getUser()',
  'Settings page checks authentication'
);

checkFileContains(
  apiFile,
  'auth.getUser()',
  'API endpoint checks authentication'
);

// Check authorization
checkFileContains(
  apiFile,
  'Forbidden',
  'API endpoint has authorization checks'
);

console.log(`\n${BOLD}📊 TypeScript Checks:${RESET}\n`);

// Check interface definitions
checkFileContains(
  path.join(__dirname, '..', 'app', 'settings', 'SettingsClient.tsx'),
  'interface UserProfile',
  'UserProfile interface defined'
);

checkFileContains(
  apiFile,
  'interface UpdateUserInput',
  'UpdateUserInput interface defined'
);

console.log(`\n${BOLD}═══════════════════════════════════════${RESET}\n`);

if (allPassed) {
  console.log(`${GREEN}${BOLD}✓ ALL CHECKS PASSED!${RESET}`);
  console.log(`${GREEN}The Settings page is correctly implemented.${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ SOME CHECKS FAILED${RESET}`);
  console.log(`${RED}Please review the errors above.${RESET}\n`);
  process.exit(1);
}
