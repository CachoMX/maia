# Authentication Setup Documentation

## Overview

This document describes the Supabase authentication setup for the MAIA/ATLAS SSS application. The authentication system uses Supabase Auth with Google OAuth as the primary authentication method.

## Architecture

### Directory Structure

```
c:\Projects\maia\
├── app/
│   └── auth/
│       └── callback/
│           └── route.ts          # OAuth callback handler
├── lib/
│   ├── auth/
│   │   ├── index.ts              # Centralized exports
│   │   ├── login.ts              # Login utilities
│   │   ├── logout.ts             # Logout utilities
│   │   ├── session.ts            # Session management
│   │   └── types.ts              # Auth type definitions
│   ├── supabase/
│   │   ├── index.ts              # Centralized exports
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Middleware client
│   └── env.ts                    # Environment validation
├── types/
│   ├── auth.ts                   # Authentication types
│   └── database.ts               # Database schema types
└── middleware.ts                 # Next.js middleware
```

## Files Created

### 1. Supabase Client Utilities

#### `c:\Projects\maia\lib\supabase\client.ts`
- Browser client for client-side operations
- Used in React components
- Handles authentication state automatically

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.from('profiles').select('*')
```

#### `c:\Projects\maia\lib\supabase\server.ts`
- Server client for server-side operations
- Used in Server Components, Route Handlers, and Server Actions
- Properly handles cookies for authentication
- Includes admin client for elevated privileges

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return data
}
```

#### `c:\Projects\maia\lib\supabase\middleware.ts`
- Middleware client for Next.js middleware
- Handles session refresh and cookie management
- Essential for maintaining auth state across requests

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()
  return response
}
```

### 2. Authentication Utilities

#### `c:\Projects\maia\lib\auth\login.ts`
Functions for handling user authentication:
- `loginWithGoogle()` - Google OAuth login
- `loginWithOAuth()` - Generic OAuth login
- `loginWithEmail()` - Email/password login (for future use)
- `signUpWithEmail()` - Email/password signup (for future use)

**Usage:**
```typescript
import { loginWithGoogle } from '@/lib/auth/login'

export async function handleLogin() {
  'use server'
  const result = await loginWithGoogle('/dashboard')
  if (result.success) {
    redirect(result.data.url)
  }
}
```

#### `c:\Projects\maia\lib\auth\logout.ts`
Functions for handling user logout:
- `logout()` - Logout with redirect
- `logoutWithoutRedirect()` - Logout without redirect
- `logoutAllSessions()` - Logout from all devices

**Usage:**
```typescript
import { logout } from '@/lib/auth/logout'

export async function handleLogout() {
  'use server'
  await logout('/login')
}
```

#### `c:\Projects\maia\lib\auth\session.ts`
Functions for managing user sessions:
- `getCurrentUser()` - Get current authenticated user
- `getSession()` - Get current session
- `hasRole()` - Check if user has specific role
- `requireAuth()` - Require authentication (throws error if not authenticated)
- `requireRole()` - Require specific role (throws error if not authorized)

**Usage:**
```typescript
import { getCurrentUser, requireRole } from '@/lib/auth/session'

export default async function AdminPage() {
  const admin = await requireRole('admin')
  return <div>Welcome, {admin.firstName}!</div>
}
```

#### `c:\Projects\maia\lib\auth\types.ts`
Type definitions for authentication:
- `UserRole` enum (student, parent, teacher, admin)
- `User` interface
- `AuthSession` interface
- `OAuthProvider` type
- `AuthError` interface
- `AuthResult<T>` type

### 3. TypeScript Types

#### `c:\Projects\maia\types\database.ts`
Complete database schema types for all Supabase tables:
- profiles
- students
- teachers
- parents
- parent_student_relationships
- learning_paths
- activities
- activity_completions
- chat_conversations
- chat_messages

**Regenerate types when schema changes:**
```bash
npx supabase gen types typescript --project-id bexudrmrspbyhkcqrtse > types/database.ts
```

#### `c:\Projects\maia\types\auth.ts`
Authentication-specific type definitions:
- `AppUser` - Extended user type
- `AuthState` - Authentication state
- `OAuthCallbackParams` - OAuth callback parameters
- `LoginFormData` - Login form data
- `SignUpFormData` - Sign up form data

### 4. Route Handlers

#### `c:\Projects\maia\app\auth\callback\route.ts`
OAuth callback route handler that:
1. Receives authorization code from OAuth provider
2. Exchanges code for Supabase session
3. Checks if user profile exists
4. Redirects new users to onboarding
5. Redirects existing users to their destination

### 5. Middleware

#### `c:\Projects\maia\middleware.ts`
Next.js middleware that:
- Refreshes user sessions on every request
- Protects routes based on authentication status
- Implements role-based access control
- Redirects authenticated users away from auth pages
- Redirects unauthenticated users to login

**Protected Routes:**
- Student: `/dashboard`, `/learn`, `/chat`, `/progress`, `/profile`
- Parent: `/dashboard`, `/children`, `/reports`, `/profile`
- Teacher: `/dashboard`, `/students`, `/assignments`, `/analytics`, `/profile`
- Admin: `/dashboard`, `/admin`, `/users`, `/analytics`, `/settings`, `/profile`

### 6. Environment Validation

#### `c:\Projects\maia\lib\env.ts`
Type-safe environment variable validation:
- Validates required variables at build time
- Provides typed access to env vars
- Helper functions for configuration checks

**Usage:**
```typescript
import { env, isClaudeConfigured } from '@/lib/env'

console.log(env.supabase.url)
console.log(env.app.isDevelopment)
console.log(isClaudeConfigured())
```

## Configuration Required

### 1. Environment Variables (Already Set)
The following variables are already configured in `c:\Projects\maia\.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓
- `NEXT_PUBLIC_APP_URL` ✓

### 2. Google OAuth Setup (To Do)
To enable Google OAuth, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://bexudrmrspbyhkcqrtse.supabase.co/auth/v1/callback`
6. Update `.env.local` with:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

7. Configure in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add Google Client ID and Secret

### 3. Database Tables (To Do)
You need to create the following tables in Supabase:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies (users can read their own profile)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Authentication Flow

### 1. Login Flow
```
User clicks "Sign in with Google"
    ↓
loginWithGoogle() called
    ↓
Redirect to Google OAuth consent screen
    ↓
User authenticates with Google
    ↓
Google redirects to /auth/callback with code
    ↓
Callback handler exchanges code for session
    ↓
Check if profile exists
    ↓
New user → /onboarding
Existing user → /dashboard (or requested page)
```

### 2. Session Management
```
User visits protected route
    ↓
Middleware intercepts request
    ↓
Check authentication status
    ↓
Authenticated → Check role-based access → Allow/Redirect
Not authenticated → Redirect to /login
```

### 3. Logout Flow
```
User clicks logout
    ↓
logout() function called
    ↓
Supabase session cleared
    ↓
Cookies removed
    ↓
Redirect to /login
```

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install @supabase/ssr @supabase/supabase-js
   ```

2. **Configure Google OAuth**
   - Set up Google Cloud Console
   - Configure Supabase Auth provider
   - Update `.env.local`

3. **Create Database Tables**
   - Run migration scripts
   - Set up Row Level Security policies
   - Create indexes for performance

4. **Create UI Components**
   - Login page with Google OAuth button
   - Logout button component
   - Protected route layouts
   - User profile components

5. **Create Onboarding Flow**
   - Role selection page
   - Profile completion form
   - Initial setup wizard

6. **Test Authentication**
   - Test Google OAuth login
   - Test protected routes
   - Test role-based access
   - Test logout functionality

## Security Considerations

1. **Row Level Security (RLS)**
   - All tables should have RLS enabled
   - Users should only access their own data
   - Admin role can bypass certain RLS policies

2. **Environment Variables**
   - Never commit `.env.local` to git
   - Keep service role key secure (server-side only)
   - Use anon key for client-side operations

3. **Session Management**
   - Sessions are automatically refreshed by middleware
   - Sessions expire based on Supabase configuration
   - Use `requireAuth()` and `requireRole()` for critical operations

4. **OAuth Security**
   - PKCE (Proof Key for Code Exchange) is enabled
   - Callback URLs are validated
   - State parameter prevents CSRF attacks

## Troubleshooting

### Session not persisting
- Check middleware configuration
- Verify cookie settings in Supabase clients
- Ensure middleware matcher is correct

### OAuth errors
- Verify redirect URLs match exactly
- Check Google OAuth credentials
- Review Supabase Auth provider settings

### Type errors
- Regenerate database types if schema changed
- Check import paths use `@/` alias
- Verify TypeScript configuration

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase SSR Package](https://github.com/supabase/ssr)
