/**
 * Supabase Module
 *
 * Centralized exports for all Supabase client utilities.
 * Import from this file for convenience.
 *
 * @module lib/supabase
 */

// Export client utilities
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient, createAdminClient } from './server'
export { createClient as createMiddlewareClient } from './middleware'

// Re-export types from Supabase
export type { SupabaseClient } from '@supabase/supabase-js'
export type { Database } from '@/types/database'
