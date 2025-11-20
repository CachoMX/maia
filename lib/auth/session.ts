/**
 * Session Management
 *
 * Utilities for managing user sessions and retrieving current user information.
 *
 * @module lib/auth/session
 */

import { createClient } from '@/lib/supabase/server'
import type { User } from './types'
import { UserRole } from './types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Gets the current authenticated user from the session
 *
 * This function should be used in Server Components, Route Handlers,
 * and Server Actions to get the currently authenticated user.
 *
 * @returns {Promise<User | null>} The current user or null if not authenticated
 *
 * @example
 * ```typescript
 * import { getCurrentUser } from '@/lib/auth/session'
 *
 * export default async function DashboardPage() {
 *   const user = await getCurrentUser()
 *
 *   if (!user) {
 *     redirect('/login')
 *   }
 *
 *   return <div>Welcome, {user.firstName}!</div>
 * }
 * ```
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return null
    }

    // Fetch the full user profile from the users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatarUrl: null,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Gets the current session
 *
 * Returns the full Supabase session object, which includes the user
 * and access token information.
 *
 * @returns {Promise<Session | null>} The current session or null if not authenticated
 *
 * @example
 * ```typescript
 * import { getSession } from '@/lib/auth/session'
 *
 * export async function GET() {
 *   const session = await getSession()
 *
 *   if (!session) {
 *     return new Response('Unauthorized', { status: 401 })
 *   }
 *
 *   return Response.json({ userId: session.user.id })
 * }
 * ```
 */
export async function getSession() {
  try {
    const supabase = await createClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Checks if a user has a specific role
 *
 * @param {string} userId - The user ID to check
 * @param {string | string[]} requiredRole - The required role(s)
 * @returns {Promise<boolean>} True if the user has the required role
 *
 * @example
 * ```typescript
 * import { hasRole } from '@/lib/auth/session'
 *
 * export async function DELETE(request: Request) {
 *   const user = await getCurrentUser()
 *
 *   if (!user || !await hasRole(user.id, ['admin', 'teacher'])) {
 *     return new Response('Forbidden', { status: 403 })
 *   }
 *
 *   // Proceed with deletion
 * }
 * ```
 */
export async function hasRole(
  userId: string,
  requiredRole: string | string[]
): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (!profile) {
      return false
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return profile.role ? roles.includes(profile.role) : false
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Requires authentication, throwing an error if not authenticated
 *
 * Useful for Server Actions and API routes where you want to fail fast
 * if the user is not authenticated.
 *
 * @returns {Promise<User>} The authenticated user
 * @throws {Error} If user is not authenticated
 *
 * @example
 * ```typescript
 * import { requireAuth } from '@/lib/auth/session'
 *
 * export async function createPost(formData: FormData) {
 *   'use server'
 *
 *   const user = await requireAuth()
 *   // User is guaranteed to be authenticated here
 *
 *   // Create post...
 * }
 * ```
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

/**
 * Requires a specific role, throwing an error if not authorized
 *
 * @param {string | string[]} requiredRole - The required role(s)
 * @returns {Promise<User>} The authenticated and authorized user
 * @throws {Error} If user is not authenticated or doesn't have the required role
 *
 * @example
 * ```typescript
 * import { requireRole } from '@/lib/auth/session'
 *
 * export async function deleteUser(userId: string) {
 *   'use server'
 *
 *   const admin = await requireRole('admin')
 *   // User is guaranteed to be an admin here
 *
 *   // Delete user...
 * }
 * ```
 */
export async function requireRole(requiredRole: string | string[]): Promise<User> {
  const user = await requireAuth()

  const authorized = await hasRole(user.id, requiredRole)

  if (!authorized) {
    throw new Error(
      `Insufficient permissions. Required role: ${
        Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole
      }`
    )
  }

  return user
}
