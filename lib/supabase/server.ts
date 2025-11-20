/**
 * Supabase Server Client
 *
 * This client is used for server-side operations in Server Components,
 * Route Handlers, and Server Actions. It properly handles cookies
 * for authentication in the Next.js App Router.
 *
 * @module lib/supabase/server
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Creates and returns a Supabase client for server-side use
 *
 * This function creates a server client that can read and write cookies,
 * making it suitable for use in Server Components, API routes, and Server Actions.
 *
 * @returns {Promise<SupabaseClient<Database>>} Configured Supabase server client
 * @throws {Error} If required environment variables are missing
 *
 * @example
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export async function getUserProfile(userId: string) {
 *   const supabase = await createClient()
 *   const { data, error } = await supabase
 *     .from('profiles')
 *     .select('*')
 *     .eq('id', userId)
 *     .single()
 *
 *   return { data, error }
 * }
 * ```
 */
export const createClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        /**
         * Get a cookie value by name
         */
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        /**
         * Set a cookie with options
         */
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        /**
         * Remove a cookie by name
         */
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase admin client with service role privileges
 *
 * WARNING: This client bypasses Row Level Security (RLS) policies.
 * Only use this for trusted server-side operations where you need
 * elevated permissions.
 *
 * @returns {SupabaseClient<Database>} Supabase client with admin privileges
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY is missing
 *
 * @example
 * ```typescript
 * import { createAdminClient } from '@/lib/supabase/server'
 *
 * export async function deleteUserData(userId: string) {
 *   const supabase = createAdminClient()
 *   // This bypasses RLS policies
 *   const { error } = await supabase
 *     .from('profiles')
 *     .delete()
 *     .eq('id', userId)
 *
 *   return { error }
 * }
 * ```
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase admin environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file.'
    )
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
    }
  )
}
