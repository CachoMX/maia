/**
 * Environment Variable Validation
 *
 * Validates and provides type-safe access to environment variables.
 * Throws errors at build time if required variables are missing.
 *
 * @module lib/env
 */

/**
 * Required environment variables for the application
 */
const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const

/**
 * Optional environment variables with defaults
 */
const optionalEnvVars = {
  // Claude/Anthropic API (optional for now)
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

  // Google OAuth (optional, can be configured later)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

/**
 * Validates that all required environment variables are present
 *
 * @throws {Error} If any required environment variable is missing
 */
function validateEnv() {
  const missing: string[] = []

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env.local file.`
    )
  }
}

/**
 * Type-safe environment variable access
 */
export const env = {
  // Supabase
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    serviceRoleKey: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY as string,
  },

  // App
  app: {
    url: requiredEnvVars.NEXT_PUBLIC_APP_URL as string,
    nodeEnv: optionalEnvVars.NODE_ENV,
    isDevelopment: optionalEnvVars.NODE_ENV === 'development',
    isProduction: optionalEnvVars.NODE_ENV === 'production',
    isTest: optionalEnvVars.NODE_ENV === 'test',
  },

  // Claude/Anthropic
  anthropic: {
    apiKey: optionalEnvVars.ANTHROPIC_API_KEY,
    isConfigured: !!optionalEnvVars.ANTHROPIC_API_KEY,
  },

  // Google OAuth
  google: {
    clientId: optionalEnvVars.GOOGLE_CLIENT_ID,
    clientSecret: optionalEnvVars.GOOGLE_CLIENT_SECRET,
    redirectUri: optionalEnvVars.GOOGLE_REDIRECT_URI,
    isConfigured:
      !!optionalEnvVars.GOOGLE_CLIENT_ID &&
      !!optionalEnvVars.GOOGLE_CLIENT_SECRET,
  },
} as const

/**
 * Validates environment variables on module load
 * This ensures errors are caught early in development
 */
if (typeof window === 'undefined') {
  // Only validate on server-side
  validateEnv()
}

/**
 * Helper function to check if all OAuth providers are configured
 */
export function areOAuthProvidersConfigured(): boolean {
  return env.google.isConfigured
}

/**
 * Helper function to check if Claude API is configured
 */
export function isClaudeConfigured(): boolean {
  return env.anthropic.isConfigured
}

/**
 * Helper to get the full callback URL for OAuth
 */
export function getOAuthCallbackUrl(provider: string): string {
  return `${env.app.url}/auth/callback?provider=${provider}`
}

/**
 * Export individual env vars for backward compatibility
 */
export const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_URL,
} = requiredEnvVars

export const {
  ANTHROPIC_API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  NODE_ENV,
} = optionalEnvVars
