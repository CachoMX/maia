/**
 * Logout Utilities
 *
 * Functions for handling user logout and session termination.
 *
 * @module lib/auth/logout
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { AuthResult, AuthErrorType } from './types'

/**
 * Logs out the current user and clears their session
 *
 * This function should be called from a Server Action.
 * It signs the user out and redirects them to the login page.
 *
 * @param {string} [redirectTo='/login'] - URL to redirect to after logout
 * @returns {Promise<AuthResult<void>>} Success or error result
 *
 * @example
 * ```typescript
 * // In a Server Action or form action
 * import { logout } from '@/lib/auth/logout'
 *
 * export async function handleLogout() {
 *   'use server'
 *   await logout('/login')
 * }
 * ```
 */
export async function logout(
  redirectTo: string = '/login'
): Promise<AuthResult<void>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: {
          type: 'unknown_error' as AuthErrorType,
          message: 'Failed to sign out',
          details: error,
        },
      }
    }

    // Redirect after successful logout
    redirect(redirectTo)
  } catch (error) {
    // If the error is from redirect, re-throw it
    // (redirect throws a special error to halt execution)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    return {
      success: false,
      error: {
        type: 'unknown_error' as AuthErrorType,
        message: 'An unexpected error occurred during logout',
        details: error,
      },
    }
  }
}

/**
 * Logs out the current user without redirecting
 *
 * Useful when you want to handle the redirect logic yourself
 * or perform additional cleanup after logout.
 *
 * @returns {Promise<AuthResult<void>>} Success or error result
 *
 * @example
 * ```typescript
 * import { logoutWithoutRedirect } from '@/lib/auth/logout'
 * import { redirect } from 'next/navigation'
 *
 * export async function handleLogout() {
 *   'use server'
 *
 *   const result = await logoutWithoutRedirect()
 *
 *   if (result.success) {
 *     // Perform additional cleanup
 *     await clearUserCache()
 *     redirect('/goodbye')
 *   } else {
 *     console.error('Logout failed:', result.error)
 *   }
 * }
 * ```
 */
export async function logoutWithoutRedirect(): Promise<AuthResult<void>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: {
          type: 'unknown_error' as AuthErrorType,
          message: 'Failed to sign out',
          details: error,
        },
      }
    }

    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error' as AuthErrorType,
        message: 'An unexpected error occurred during logout',
        details: error,
      },
    }
  }
}

/**
 * Clears all sessions for the current user across all devices
 *
 * This is a more aggressive logout that signs the user out everywhere,
 * not just the current device.
 *
 * @returns {Promise<AuthResult<void>>} Success or error result
 *
 * @example
 * ```typescript
 * import { logoutAllSessions } from '@/lib/auth/logout'
 *
 * export async function handleSecurityLogout() {
 *   'use server'
 *
 *   // Sign out from all devices
 *   const result = await logoutAllSessions()
 *
 *   if (result.success) {
 *     redirect('/login?message=signed-out-all-devices')
 *   }
 * }
 * ```
 */
export async function logoutAllSessions(): Promise<AuthResult<void>> {
  try {
    const supabase = await createClient()

    // Sign out with scope: 'global' signs out all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (error) {
      return {
        success: false,
        error: {
          type: 'unknown_error' as AuthErrorType,
          message: 'Failed to sign out from all sessions',
          details: error,
        },
      }
    }

    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error' as AuthErrorType,
        message: 'An unexpected error occurred during global logout',
        details: error,
      },
    }
  }
}
