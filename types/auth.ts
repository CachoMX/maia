/**
 * Authentication Type Definitions
 *
 * Centralized type definitions for authentication-related data structures.
 *
 * @module types/auth
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

/**
 * Re-export Supabase auth types for convenience
 */
export type { SupabaseUser, SupabaseSession }

/**
 * Extended user type with application-specific fields
 */
export interface AppUser {
  id: string
  email: string
  emailVerified: boolean
  role: 'student' | 'parent' | 'teacher' | 'admin'
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Authentication state
 */
export interface AuthState {
  user: AppUser | null
  session: SupabaseSession | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * OAuth callback parameters
 */
export interface OAuthCallbackParams {
  code?: string
  error?: string
  error_description?: string
  next?: string
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Sign up form data
 */
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: 'student' | 'parent' | 'teacher'
  agreeToTerms: boolean
}
