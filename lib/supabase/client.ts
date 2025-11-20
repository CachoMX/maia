/**
 * Supabase Browser Client
 *
 * This client is used for client-side operations in React components.
 * It handles authentication state and sessions automatically in the browser.
 *
 * @module lib/supabase/client
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Creates and returns a Supabase client for browser/client-side use
 *
 * @returns {SupabaseClient<Database>} Configured Supabase browser client
 * @throws {Error} If required environment variables are missing
 *
 * @example
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data, error } = await supabase.from('profiles').select('*')
 * ```
 */
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}
