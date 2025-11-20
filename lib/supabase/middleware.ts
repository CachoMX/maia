/**
 * Supabase Middleware Client
 *
 * This client is specifically designed for use in Next.js middleware.
 * It handles session refresh and cookie management for protected routes.
 *
 * @module lib/supabase/middleware
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for use in Next.js middleware
 *
 * This client properly handles cookie reading and writing in the middleware context,
 * which is essential for maintaining authentication state across requests.
 *
 * @param {NextRequest} request - The incoming Next.js request
 * @returns {Object} An object containing the Supabase client and response
 * @returns {SupabaseClient<Database>} supabase - The configured Supabase client
 * @returns {NextResponse} response - The response object with updated cookies
 *
 * @example
 * ```typescript
 * import { createClient } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   const { supabase, response } = createClient(request)
 *
 *   const { data: { session } } = await supabase.auth.getSession()
 *
 *   if (!session) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 *
 *   return response
 * }
 * ```
 */
export const createClient = (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  // Create a response object to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        /**
         * Get a cookie value from the request
         */
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        /**
         * Set a cookie in the response
         */
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        /**
         * Remove a cookie from the response
         */
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, response }
}
