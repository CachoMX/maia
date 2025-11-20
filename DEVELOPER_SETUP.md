# Developer Setup Guide
## Maia - Student Support Services Platform

**For:** Carlos and Future Developers
**Version:** 1.0 (Week 2)
**Last Updated:** November 18, 2025
**Estimated Setup Time:** 30-45 minutes

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Install Dependencies](#install-dependencies)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Development Server](#running-the-development-server)
7. [Verify Installation](#verify-installation)
8. [Common Issues](#common-issues)
9. [Development Workflow](#development-workflow)
10. [Testing](#testing)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

**Node.js (v18 or higher)**
- Download: https://nodejs.org/
- Verify installation:
```bash
node --version
# Should output: v18.x.x or higher
```

**npm (v9 or higher)**
- Comes with Node.js
- Verify installation:
```bash
npm --version
# Should output: 9.x.x or higher
```

**Git**
- Download: https://git-scm.com/
- Verify installation:
```bash
git --version
# Should output: git version 2.x.x
```

**Code Editor**
- Recommended: Visual Studio Code
- Download: https://code.visualstudio.com/

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens
- Thunder Client (for API testing)

### Accounts Required

**Supabase Account**
- Sign up: https://supabase.com
- You'll need access to the project: `bexudrmrspbyhkcqrtse`
- Contact Carlos for access

**Google Cloud Console Access** (for OAuth)
- Access to ATLAS ASM Google Cloud project
- Contact Carlos for credentials

---

## Clone the Repository

### Step 1: Navigate to your projects directory
```bash
cd ~/Projects
# Or wherever you keep your code
```

### Step 2: Clone the repo
```bash
git clone https://github.com/your-org/maia.git
# Replace with actual repo URL
```

### Step 3: Navigate into the project
```bash
cd maia
```

### Step 4: Verify you're on the correct branch
```bash
git branch
# Should show: * main (or current active branch)
```

---

## Install Dependencies

### Step 1: Install npm packages
```bash
npm install
```

This will install all dependencies listed in `package.json`:
- Next.js 14
- React 18
- Supabase client
- TypeScript
- Tailwind CSS
- Radix UI components
- React Query
- And more...

**Expected Output:**
```
added 1247 packages, and audited 1248 packages in 45s

found 0 vulnerabilities
```

### Step 2: Verify installation
```bash
npm list --depth=0
```

You should see all main dependencies listed.

---

## Environment Variables

### Step 1: Copy the example file
```bash
cp .env.example .env.local
```

### Step 2: Edit `.env.local`

Open `.env.local` in your code editor and fill in the values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bexudrmrspbyhkcqrtse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server-side Supabase
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Anthropic Claude API (for AI features - Week 7)
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Step 3: Get Supabase credentials

**Method 1: From Supabase Dashboard**
1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/settings/api
2. Copy "Project URL" → Paste as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy "anon public" key → Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy "service_role" key → Paste as `SUPABASE_SERVICE_ROLE_KEY`

**Method 2: Ask Carlos**
If you don't have access, contact Carlos for the credentials.

### Step 4: Get Google OAuth credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find the OAuth 2.0 Client ID for "Maia SSS App"
3. Copy Client ID → Paste as `GOOGLE_CLIENT_ID`
4. Copy Client Secret → Paste as `GOOGLE_CLIENT_SECRET`

Or contact Carlos for these values.

### Step 5: Verify environment variables

Run this command to check if variables are loaded:
```bash
npm run env-check
# If this script doesn't exist, you can skip this step
```

---

## Database Setup

### Option 1: Database Already Deployed (Most Common)

If the database schema is already deployed (Week 1 complete):

**Step 1: Verify database connection**
```bash
npm run db:check
# If this script exists
```

**Step 2: Check tables exist**
1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor
2. You should see 16 tables:
   - users
   - students
   - cases
   - interventions
   - sessions
   - evaluations
   - protocol_steps
   - parent_meetings
   - action_plan_items
   - group_interventions
   - group_sessions
   - referrals
   - behavior_incidents
   - files
   - audit_log

If you see these tables, you're good to go! Skip to "Running the Development Server."

---

### Option 2: Deploy Database Schema (First Time Setup)

If the database is empty:

**Step 1: Navigate to Supabase SQL Editor**
https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new

**Step 2: Run the initial schema migration**
1. Open `/supabase/migrations/001_initial_schema.sql`
2. Copy the entire file contents
3. Paste into Supabase SQL Editor
4. Click "Run" (or press Ctrl/Cmd + Enter)

**Step 3: Verify deployment**
Run verification queries from:
`/supabase/migrations/002_verification_queries.sql`

All queries should return results indicating tables, policies, and functions were created.

**Step 4: Create test user**

Run the SQL from `/CREATE_TEST_USER.sql` to create a test SSS staff account:

```sql
-- This will be in the file
INSERT INTO public.users (id, email, full_name, role, created_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-test-email@atlas.es' LIMIT 1),
  'your-test-email@atlas.es',
  'Test User',
  'SSS_STAFF',
  NOW()
);
```

Replace `your-test-email@atlas.es` with your actual Google email.

---

## Running the Development Server

### Step 1: Start the dev server
```bash
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 14.2.18
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.3s
```

### Step 2: Open your browser
Navigate to: http://localhost:3000

### Step 3: You should see the Maia login page

If you see the login page with "Sign in with Google" button, success!

---

## Verify Installation

### Test 1: Login Works
1. Click "Sign in with Google"
2. Select your ATLAS email account
3. Authorize the app
4. You should be redirected to the dashboard

### Test 2: Database Connection Works
1. After logging in, open browser console (F12)
2. Check for any errors
3. You should see no red error messages

### Test 3: API Routes Work
Test the API directly:

```bash
# Test cases endpoint (should return 401 if not logged in)
curl http://localhost:3000/api/cases

# Expected output: { "error": "Unauthorized" }
```

### Test 4: TypeScript Compilation
```bash
npm run type-check
```

Should complete with no errors.

### Test 5: Linting
```bash
npm run lint
```

Should complete with no errors (warnings are okay).

---

## Common Issues

### Issue 1: Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

---

### Issue 2: Module Not Found

**Error:**
```
Module not found: Can't resolve '@supabase/supabase-js'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

### Issue 3: Environment Variables Not Loading

**Error:**
```
Supabase URL is undefined
```

**Solution:**
1. Verify `.env.local` file exists in root directory
2. Restart dev server (environment variables only load on start)
3. Check for typos in variable names
4. Ensure no extra spaces around `=` sign

---

### Issue 4: Database Connection Failed

**Error:**
```
Error: Failed to connect to Supabase
```

**Solution:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
3. Verify you have internet connection
4. Check Supabase project status: https://status.supabase.com/

---

### Issue 5: Google OAuth Not Working

**Error:**
```
redirect_uri_mismatch
```

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Add `http://localhost:3000/auth/callback` to "Authorized redirect URIs"
3. Save changes
4. Wait 5 minutes for Google to update
5. Try again

---

### Issue 6: TypeScript Errors

**Error:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Solution:**
1. Check TypeScript version: `npx tsc --version`
2. Should be 5.6.3 or higher
3. If not: `npm install typescript@latest`
4. Restart VS Code/editor

---

### Issue 7: Supabase RLS Policy Errors

**Error:**
```
Row level security policy violation
```

**Solution:**
1. Ensure you're logged in with an account that has SSS_STAFF role
2. Check RLS policies in Supabase dashboard
3. Verify your user exists in the `public.users` table
4. Check that your user's role is set correctly

---

## Development Workflow

### Daily Workflow

**1. Pull latest changes**
```bash
git pull origin main
```

**2. Install any new dependencies**
```bash
npm install
```

**3. Start dev server**
```bash
npm run dev
```

**4. Create a feature branch**
```bash
git checkout -b feature/case-management-ui
```

**5. Make your changes**
Edit files, test locally

**6. Test your changes**
```bash
npm run type-check
npm run lint
# Manual testing in browser
```

**7. Commit your changes**
```bash
git add .
git commit -m "Add case management UI components"
```

**8. Push to remote**
```bash
git push origin feature/case-management-ui
```

**9. Create Pull Request**
On GitHub, create a PR for review

---

### Code Style Guidelines

**TypeScript**
- Use TypeScript for all new files
- Define types/interfaces for all props
- Avoid `any` type

**React Components**
- Use functional components
- Use React hooks (useState, useEffect, etc.)
- One component per file
- Name files with PascalCase: `CaseCard.tsx`

**File Organization**
```
app/
  ├─ api/              # API routes
  ├─ cases/            # Case pages
  ├─ dashboard/        # Dashboard page
  ├─ lib/              # Utility functions
  └─ components/       # Reusable components

components/
  ├─ ui/               # Base UI components (buttons, inputs)
  ├─ cases/            # Case-specific components
  └─ dashboard/        # Dashboard widgets

lib/
  ├─ supabase/         # Supabase client & helpers
  ├─ utils/            # Utility functions
  └─ types/            # TypeScript types
```

**Naming Conventions**
- Components: `PascalCase` (e.g., `CaseCard.tsx`)
- Functions: `camelCase` (e.g., `getCases()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Files/folders: `kebab-case` (e.g., `case-management/`)

---

## Testing

### Manual Testing Checklist

**Before committing code:**
- [ ] Page loads without errors
- [ ] No console errors or warnings
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive (test at 768px, 1024px, 1920px widths)

### Automated Testing (Coming in Week 4)

**Unit Tests (Future):**
```bash
npm run test
```

**E2E Tests (Future):**
```bash
npm run test:e2e
```

---

## Project Structure Overview

```
maia/
├─ .next/                    # Next.js build output (don't commit)
├─ app/                      # Next.js 14 App Router
│   ├─ api/                  # API routes
│   │   ├─ cases/            # Cases endpoints
│   │   ├─ interventions/    # Interventions endpoints
│   │   ├─ sessions/         # Sessions endpoints
│   │   └─ ...
│   ├─ cases/                # Cases pages
│   │   ├─ page.tsx          # /cases (list view)
│   │   ├─ [id]/             # /cases/[id] (detail view)
│   │   └─ new/              # /cases/new (create form)
│   ├─ dashboard/            # Dashboard page
│   ├─ login/                # Login page
│   ├─ layout.tsx            # Root layout
│   └─ page.tsx              # Home page (redirects to dashboard)
├─ components/               # React components
│   ├─ ui/                   # Radix UI components
│   ├─ cases/                # Case components
│   └─ dashboard/            # Dashboard widgets
├─ lib/                      # Utility libraries
│   ├─ supabase/             # Supabase client
│   └─ utils/                # Helper functions
├─ public/                   # Static assets
├─ supabase/                 # Database migrations
│   ├─ migrations/           # SQL migration files
│   └─ queries/              # Useful SQL queries
├─ types/                    # TypeScript types
├─ .env.local                # Environment variables (don't commit)
├─ .gitignore                # Git ignore rules
├─ next.config.mjs           # Next.js configuration
├─ package.json              # Dependencies
├─ tailwind.config.ts        # Tailwind CSS config
├─ tsconfig.json             # TypeScript config
└─ README.md                 # Project documentation
```

---

## Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Database
```bash
# Supabase CLI (if installed)
supabase status              # Check Supabase status
supabase db push             # Push migrations
supabase gen types typescript # Generate TypeScript types
```

### Git
```bash
git status                    # Check changed files
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to remote
git pull                      # Pull latest changes
git checkout -b branch-name   # Create new branch
```

---

## Next Steps

After setup is complete:

1. **Read API_DOCUMENTATION.md** - Understand the API endpoints you'll build
2. **Study IMPLEMENTATION_ROADMAP.md** - See code patterns and architecture
3. **Review WEEK_2_SUMMARY.md** - Know what features to build
4. **Start coding!** - Begin with Cases API (POST /api/cases)

---

## Getting Help

**Technical Issues:**
- Carlos (vixi.agency)
- Check GitHub Issues
- Review documentation in `/docs`

**Supabase Issues:**
- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- Check RLS policies and logs

**Next.js Issues:**
- Next.js Docs: https://nextjs.org/docs
- Check `.next/` build output for errors

---

## Troubleshooting Checklist

If something isn't working, go through this checklist:

- [ ] Node version is 18+
- [ ] npm install completed successfully
- [ ] .env.local file exists and has all variables
- [ ] Supabase project is running (check status page)
- [ ] Database schema is deployed (16 tables exist)
- [ ] Dev server is running on port 3000
- [ ] No console errors in browser
- [ ] TypeScript compiles without errors
- [ ] You're logged in with an ATLAS Google account
- [ ] Your user exists in public.users table with correct role

If all checked and still not working, contact Carlos.

---

**Ready to develop!**

You now have a fully functional development environment for Maia. Start building amazing features for the SSS team!

---

**Document Version:** 1.0
**Last Updated:** November 18, 2025
**Prepared by:** DocumentationAgent
**For:** Carlos and future Maia developers
