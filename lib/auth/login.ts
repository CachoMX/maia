/**
 * Login Utilities
 *
 * Functions for handling user authentication, including OAuth login.
 *
 * @module lib/auth/login
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { OAuthProvider, AuthResult, AuthError, AuthErrorType } from './types'

/**
 * Initiates Google OAuth login flow
 *
 * This function should be called from a Server Action or API route.
 * It redirects the user to Google's OAuth consent screen.
 *
 * @param {string} [redirectTo='/dashboard'] - URL to redirect to after successful login
 * @returns {Promise<AuthResult<{ url: string }>>} The OAuth URL or an error
 *
 * @example
 * ```typescript
 * // In a Server Component or Server Action
 * import { loginWithGoogle } from '@/lib/auth/login'
 *
 * export async function handleGoogleLogin() {
 *   'use server'
 *   const result = await loginWithGoogle('/dashboard')
 *
 *   if (result.success) {
 *     redirect(result.data.url)
 *   } else {
 *     console.error(result.error)
 *   }
 * }
 * ```
 */
export async function loginWithGoogle(
  redirectTo: string = '/dashboard'
): Promise<AuthResult<{ url: string }>> {
  try {
    const supabase = await createClient()
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          type: 'oauth_error' as AuthErrorType,
          message: 'Failed to initiate Google login',
          details: error,
        },
      }
    }

    if (!data.url) {
      return {
        success: false,
        error: {
          type: 'oauth_error' as AuthErrorType,
          message: 'No OAuth URL returned',
        },
      }
    }

    return {
      success: true,
      data: { url: data.url },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error' as AuthErrorType,
        message: 'An unexpected error occurred during login',
        details: error,
      },
    }
  }
}

/**
 * Generic OAuth login function
 *
 * Supports multiple OAuth providers (Google, GitHub, Azure, etc.)
 *
 * @param {OAuthProvider} provider - The OAuth provider to use
 * @param {string} [redirectTo='/dashboard'] - URL to redirect to after successful login
 * @returns {Promise<AuthResult<{ url: string }>>} The OAuth URL or an error
 *
 * @example
 * ```typescript
 * import { loginWithOAuth } from '@/lib/auth/login'
 *
 * export async function handleGitHubLogin() {
 *   'use server'
 *   const result = await loginWithOAuth('github', '/dashboard')
 *
 *   if (result.success) {
 *     redirect(result.data.url)
 *   }
 * }
 * ```
 */
export async function loginWithOAuth(
  provider: OAuthProvider,
  redirectTo: string = '/dashboard'
): Promise<AuthResult<{ url: string }>> {
  try {
    const supabase = await createClient()
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          type: 'oauth_error' as AuthErrorType,
          message: `Failed to initiate ${provider} login`,
          details: error,
        },
      }
    }

    if (!data.url) {
      return {
        success: false,
        error: {
          type: 'oauth_error' as AuthErrorType,
          message: 'No OAuth URL returned',
        },
      }
    }

    return {
      success: true,
      data: { url: data.url },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error' as AuthErrorType,
        message: 'An unexpected error occurred during login',
        details: error,
      },
    }
  }
}

/**
 * Email/password login (for future use)
 *
 * This function is currently not enabled but can be used if you want
 * to support email/password authentication in addition to OAuth.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<AuthResult<void>>} Success or error result
 *
 * @example
 * ```typescript
 * import { loginWithEmail } from '@/lib/auth/login'
 *
 * export async function handleEmailLogin(email: string, password: string) {
 *   'use server'
 *   const result = await loginWithEmail(email, password)
 *
 *   if (result.success) {
 *     redirect('/dashboard')
 *   } else {
 *     return result.error
 *   }
 * }
 * ```
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult<void>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: {
          type: 'invalid_credentials' as AuthErrorType,
          message: 'Invalid email or password',
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
        message: 'An unexpected error occurred during login',
        details: error,
      },
    }
  }
}

/**
 * Sign up with email and password (for future use)
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<AuthResult<void>>} Success or error result
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: {
    firstName?: string
    lastName?: string
    role?: string
  }
): Promise<AuthResult<void>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          type: 'oauth_error' as AuthErrorType,
          message: 'Failed to create account',
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
        message: 'An unexpected error occurred during sign up',
        details: error,
      },
    }
  }
}
