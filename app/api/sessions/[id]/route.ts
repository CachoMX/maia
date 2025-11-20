/**
 * Individual Session API Routes
 *
 * Handles operations on a single session.
 * - PATCH /api/sessions/[id] - Update session
 *
 * @module app/api/sessions/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  UpdateSessionInput,
  SessionApiResponse,
} from '@/app/types/session'

/**
 * PATCH /api/sessions/[id]
 *
 * Updates an existing session. Only SSS_STAFF can update sessions.
 * Validates that the session exists before updating.
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing session ID
 * @returns JSON response with updated session or error
 *
 * @example
 * PATCH /api/sessions/uuid-here
 * {
 *   "student_attended": true,
 *   "observation_notes": "Student showed significant improvement",
 *   "student_progress": "Met all session goals"
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.role !== 'SSS_STAFF') {
      return NextResponse.json(
        { data: null, error: 'Forbidden - Only SSS staff can update sessions' },
        { status: 403 }
      )
    }

    const sessionId = params.id

    // Verify session exists
    const { data: existingSession, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .single()

    if (checkError || !existingSession) {
      return NextResponse.json(
        { data: null, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateSessionInput = await request.json()

    // Update session
    const { data: updatedSession, error: updateError } = await supabase
      .from('sessions')
      .update(body)
      .eq('id', sessionId)
      .select(
        `
        *,
        facilitator:users!sessions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .single()

    if (updateError) {
      console.error('Error updating session:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: SessionApiResponse<typeof updatedSession> = {
      data: updatedSession,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/sessions/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
