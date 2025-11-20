/**
 * Individual Case API Routes
 *
 * Handles operations on a single case.
 * - GET /api/cases/[id] - Get case with all relationships
 * - PATCH /api/cases/[id] - Update case
 * - DELETE /api/cases/[id] - Soft delete (close case)
 *
 * @module app/api/cases/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  UpdateCaseInput,
  CaseWithRelations,
  CaseApiResponse,
} from '@/app/types/case'

/**
 * GET /api/cases/[id]
 *
 * Retrieves a single case with all relationships including:
 * - Student information
 * - Case manager details
 * - Intervention count
 * - Session count
 * - Parent meeting count
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing case ID
 * @returns JSON response with case details or error
 */
export async function GET(
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
        { data: null, error: 'Forbidden - Only SSS staff can view cases' },
        { status: 403 }
      )
    }

    const caseId = params.id

    // Fetch case with student and case manager
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select(
        `
        *,
        student:students (
          id,
          name,
          grade,
          student_id
        ),
        case_manager:users!cases_case_manager_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .eq('id', caseId)
      .single()

    if (caseError) {
      if (caseError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Case not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching case:', caseError)
      return NextResponse.json(
        { data: null, error: `Database error: ${caseError.message}` },
        { status: 500 }
      )
    }

    // Get intervention count
    const { count: interventionCount } = await supabase
      .from('interventions')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', caseId)

    // Get session count (via interventions)
    const { data: interventions } = await supabase
      .from('interventions')
      .select('id')
      .eq('case_id', caseId)

    const interventionIds = interventions?.map((i) => i.id) || []
    let sessionCount = 0

    if (interventionIds.length > 0) {
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .in('intervention_id', interventionIds)

      sessionCount = count || 0
    }

    // Get parent meeting count
    const { count: parentMeetingCount } = await supabase
      .from('parent_meetings')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', caseId)

    // Build CaseWithRelations response
    const caseWithRelations: CaseWithRelations = {
      ...caseData,
      intervention_count: interventionCount || 0,
      session_count: sessionCount,
      parent_meeting_count: parentMeetingCount || 0,
    }

    const response: CaseApiResponse<CaseWithRelations> = {
      data: caseWithRelations,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/cases/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/cases/[id]
 *
 * Updates an existing case. Only SSS_STAFF can update cases.
 * Validates that the case exists before updating.
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing case ID
 * @returns JSON response with updated case or error
 *
 * @example
 * PATCH /api/cases/uuid-here
 * {
 *   "status": "ON_HOLD",
 *   "internal_notes": "Waiting for parent response"
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
        { data: null, error: 'Forbidden - Only SSS staff can update cases' },
        { status: 403 }
      )
    }

    const caseId = params.id

    // Verify case exists
    const { data: existingCase, error: checkError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .single()

    if (checkError || !existingCase) {
      return NextResponse.json(
        { data: null, error: 'Case not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateCaseInput = await request.json()

    // Update case
    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update(body)
      .eq('id', caseId)
      .select(
        `
        *,
        student:students (
          id,
          name,
          grade,
          student_id
        ),
        case_manager:users!cases_case_manager_id_fkey (
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
      console.error('Error updating case:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: CaseApiResponse<typeof updatedCase> = {
      data: updatedCase,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/cases/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cases/[id]
 *
 * Soft deletes a case by setting status to CLOSED.
 * Does not actually delete the record from the database.
 * Requires closure_reason in request body.
 *
 * @param request - Next.js request object with closure_reason in body
 * @param params - Route parameters containing case ID
 * @returns JSON response with closed case or error
 *
 * @example
 * DELETE /api/cases/uuid-here
 * {
 *   "closure_reason": "Student transferred to another school"
 * }
 */
export async function DELETE(
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
        { data: null, error: 'Forbidden - Only SSS staff can close cases' },
        { status: 403 }
      )
    }

    const caseId = params.id

    // Parse request body
    const body = await request.json()
    const closureReason = body.closure_reason

    if (!closureReason) {
      return NextResponse.json(
        { data: null, error: 'closure_reason is required' },
        { status: 400 }
      )
    }

    // Verify case exists
    const { data: existingCase, error: checkError } = await supabase
      .from('cases')
      .select('id, status')
      .eq('id', caseId)
      .single()

    if (checkError || !existingCase) {
      return NextResponse.json(
        { data: null, error: 'Case not found' },
        { status: 404 }
      )
    }

    if (existingCase.status === 'CLOSED') {
      return NextResponse.json(
        { data: null, error: 'Case is already closed' },
        { status: 400 }
      )
    }

    // Close case (soft delete)
    const closedDate = new Date().toISOString().split('T')[0]

    const { data: closedCase, error: closeError } = await supabase
      .from('cases')
      .update({
        status: 'CLOSED',
        closed_date: closedDate,
        closure_reason: closureReason,
      })
      .eq('id', caseId)
      .select(
        `
        *,
        student:students (
          id,
          name,
          grade,
          student_id
        ),
        case_manager:users!cases_case_manager_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .single()

    if (closeError) {
      console.error('Error closing case:', closeError)
      return NextResponse.json(
        { data: null, error: `Database error: ${closeError.message}` },
        { status: 500 }
      )
    }

    const response: CaseApiResponse<typeof closedCase> = {
      data: closedCase,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/cases/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
