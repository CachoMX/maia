/**
 * Individual Parent Meeting API Routes
 *
 * Handles operations on a single parent meeting.
 * - PATCH /api/meetings/[id] - Update meeting
 *
 * @module app/api/meetings/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  UpdateParentMeetingInput,
  ParentMeetingApiResponse,
} from '@/app/types/meeting'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/meetings/[id]
 *
 * Updates an existing parent meeting. Only SSS_STAFF can update meetings.
 * Validates that the meeting exists before updating.
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing meeting ID
 * @returns JSON response with updated meeting or error
 *
 * @example
 * PATCH /api/meetings/uuid-here
 * {
 *   "meeting_status": "COMPLETED",
 *   "meeting_notes": "Productive meeting with parents",
 *   "next_steps": "Follow up in 2 weeks"
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
        { data: null, error: 'Forbidden - Only SSS staff can update meetings' },
        { status: 403 }
      )
    }

    const meetingId = params.id

    // Verify meeting exists
    const { data: existingMeeting, error: checkError } = await supabase
      .from('parent_meetings')
      .select('id')
      .eq('id', meetingId)
      .single()

    if (checkError || !existingMeeting) {
      return NextResponse.json(
        { data: null, error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateParentMeetingInput = await request.json()

    // Update meeting
    const { data: updatedMeeting, error: updateError } = await supabase
      .from('parent_meetings')
      .update(body)
      .eq('id', meetingId)
      .select(
        `
        *,
        student:students (
          id,
          name,
          grade,
          student_id
        ),
        sss_staff:users!parent_meetings_sss_staff_id_fkey (
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
      console.error('Error updating meeting:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: ParentMeetingApiResponse<typeof updatedMeeting> = {
      data: updatedMeeting,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/meetings/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
