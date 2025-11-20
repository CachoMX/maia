/**
 * Authentication Module
 *
 * Centralized exports for all authentication utilities.
 * Import from this file for convenience.
 *
 * @module lib/auth
 */

// Export session management
export {
  getCurrentUser,
  getSession,
  hasRole,
  requireAuth,
  requireRole,
} from './session'

// Export login utilities
export {
  loginWithGoogle,
  loginWithOAuth,
  loginWithEmail,
  signUpWithEmail,
} from './login'

// Export logout utilities
export {
  logout,
  logoutWithoutRedirect,
  logoutAllSessions,
} from './logout'

// Export types
export type {
  User,
  UserRole,
  AuthSession,
  LoginCredentials,
  OAuthProvider,
  AuthError,
  AuthResult,
} from './types'

export { UserRole as Role, AuthErrorType } from './types'
