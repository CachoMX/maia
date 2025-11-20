/**
 * Authentication Types
 *
 * Type definitions for user authentication, roles, and permissions.
 *
 * @module lib/auth/types
 */

/**
 * User roles in the ATLAS/MAIA system
 */
export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

/**
 * User profile from the database
 */
export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Authentication session information
 */
export interface AuthSession {
  user: User
  expiresAt: string
}

/**
 * Login credentials (if using email/password in the future)
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github' | 'azure'

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  SESSION_EXPIRED = 'session_expired',
  UNAUTHORIZED = 'unauthorized',
  OAUTH_ERROR = 'oauth_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Authentication error
 */
export interface AuthError {
  type: AuthErrorType
  message: string
  details?: unknown
}

/**
 * Result type for authentication operations
 */
export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError }
