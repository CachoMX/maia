# Authentication Quick Reference

## Common Usage Patterns

### 1. Get Current User in Server Component

```typescript
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Welcome, {user.firstName}!</div>
}
```

### 2. Require Specific Role

```typescript
import { requireRole } from '@/lib/auth'

export default async function AdminPage() {
  const admin = await requireRole('admin')

  // User is guaranteed to be an admin here
  return <div>Admin Dashboard</div>
}
```

### 3. Login with Google (Server Action)

```typescript
'use server'

import { loginWithGoogle } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function handleGoogleLogin() {
  const result = await loginWithGoogle('/dashboard')

  if (result.success) {
    redirect(result.data.url)
  } else {
    console.error('Login failed:', result.error)
  }
}
```

### 4. Logout (Server Action)

```typescript
'use server'

import { logout } from '@/lib/auth'

export async function handleLogout() {
  await logout('/login')
}
```

### 5. Use Supabase in Client Component

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const [profile, setProfile] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from('profiles').select('*').single()
      setProfile(data)
    }
    loadProfile()
  }, [])

  return <div>{profile?.firstName}</div>
}
```

### 6. Use Supabase in API Route

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ data, error })
}
```

### 7. Check User Role

```typescript
import { hasRole } from '@/lib/auth'

export async function DELETE(request: Request) {
  const user = await getCurrentUser()

  if (!user || !await hasRole(user.id, ['admin', 'teacher'])) {
    return new Response('Forbidden', { status: 403 })
  }

  // Proceed with deletion
}
```

### 8. Use Admin Client (Bypass RLS)

```typescript
import { createAdminClient } from '@/lib/supabase/server'

export async function deleteUserData(userId: string) {
  const supabase = createAdminClient()

  // This bypasses Row Level Security
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  return { error }
}
```

## Import Shortcuts

All auth utilities can be imported from a single module:

```typescript
import {
  getCurrentUser,
  getSession,
  hasRole,
  requireAuth,
  requireRole,
  loginWithGoogle,
  logout,
  UserRole,
  type User,
  type AuthResult,
} from '@/lib/auth'
```

All Supabase clients can be imported from a single module:

```typescript
import {
  createBrowserClient,
  createServerClient,
  createAdminClient,
  createMiddlewareClient,
} from '@/lib/supabase'
```

## Environment Variables

Access environment variables type-safely:

```typescript
import { env } from '@/lib/env'

console.log(env.supabase.url)
console.log(env.app.isDevelopment)
console.log(env.google.isConfigured)
```

## Type Definitions

### User Type

```typescript
interface User {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}
```

### UserRole Enum

```typescript
enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}
```

### AuthResult Type

```typescript
type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError }
```

## Protected Routes

Routes are automatically protected by middleware:

- **Public**: `/login`, `/signup`, `/auth/callback`, `/about`, etc.
- **Student**: `/dashboard`, `/learn`, `/chat`, `/progress`, `/profile`
- **Parent**: `/dashboard`, `/children`, `/reports`, `/profile`
- **Teacher**: `/dashboard`, `/students`, `/assignments`, `/analytics`, `/profile`
- **Admin**: All routes

## Error Handling

```typescript
const result = await loginWithGoogle()

if (!result.success) {
  switch (result.error.type) {
    case 'oauth_error':
      console.error('OAuth failed:', result.error.message)
      break
    case 'network_error':
      console.error('Network error:', result.error.message)
      break
    default:
      console.error('Unknown error:', result.error.message)
  }
}
```
