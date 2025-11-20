/**
 * OAuth Callback Route Handler
 *
 * This route handles the OAuth callback from authentication providers (Google, etc.).
 * It exchanges the authorization code for a session and redirects the user.
 *
 * @module app/auth/callback
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Handles GET requests for OAuth callbacks
 *
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. User authenticates with Google
 * 3. Google redirects back to this route with an authorization code
 * 4. We exchange the code for a Supabase session
 * 5. We redirect the user to their intended destination
 *
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Redirect response
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || 'Authentication failed')}`,
        requestUrl.origin
      )
    )
  }

  // If no code is present, redirect to login
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', requestUrl.origin)
    )
  }

  try {
    const supabase = await createClient()

    // Exchange the authorization code for a session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        new URL(
          `/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`,
          requestUrl.origin
        )
      )
    }

    if (!data.session) {
      console.error('No session returned after code exchange')
      return NextResponse.redirect(
        new URL('/login?error=no_session', requestUrl.origin)
      )
    }

    // Check if user profile exists, if not create one
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // If profile doesn't exist, this is a new user - redirect to onboarding
    if (profileError || !profile) {
      console.log('New user detected, redirecting to onboarding')
      return NextResponse.redirect(
        new URL('/onboarding', requestUrl.origin)
      )
    }

    // Existing user - redirect to intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(
      new URL(
        `/login?error=unexpected&error_description=${encodeURIComponent('An unexpected error occurred')}`,
        requestUrl.origin
      )
    )
  }
}
