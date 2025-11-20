/**
 * Parent Meeting API Routes
 *
 * Handles parent meeting scheduling and listing with filters.
 * - POST /api/meetings - Schedule new parent meeting
 * - GET /api/meetings - List meetings with filters
 *
 * @module app/api/meetings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateParentMeetingInput,
  ParentMeetingFilters,
  ParentMeetingApiResponse,
  ParentMeetingListItem,
} from '@/app/types/meeting'

/**
 * POST /api/meetings
 *
 * Schedules a new parent meeting in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * @param request - Next.js request object with meeting data in body
 * @returns JSON response with created meeting or error
 *
 * @example
 * POST /api/meetings
 * {
 *   "student_id": "uuid-here",
 *   "case_id": "uuid-here",
 *   "meeting_date": "2025-02-01",
 *   "meeting_time": "14:00:00",
 *   "agenda": "Discuss student progress"
 * }
 */
export async function POST(request: NextRequest) {
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
        { data: null, error: 'Forbidden - Only SSS staff can schedule meetings' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateParentMeetingInput = await request.json()

    // Validate required fields
    if (!body.student_id) {
      return NextResponse.json(
        { data: null, error: 'Missing required field: student_id is required' },
        { status: 400 }
      )
    }

    // Verify student exists
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('id', body.student_id)
      .single()

    if (studentError || !studentData) {
      return NextResponse.json(
        { data: null, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Verify case exists if provided
    if (body.case_id) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('id', body.case_id)
        .single()

      if (caseError || !caseData) {
        return NextResponse.json(
          { data: null, error: 'Case not found' },
          { status: 404 }
        )
      }
    }

    // Create meeting
    const { data: meetingData, error: meetingError } = await supabase
      .from('parent_meetings')
      .insert({
        student_id: body.student_id,
        case_id: body.case_id || null,
        meeting_date: body.meeting_date || null,
        meeting_time: body.meeting_time || null,
        parent_ids: body.parent_ids || null,
        sss_staff_id: body.sss_staff_id || null,
        teacher_ids: body.teacher_ids || null,
        admin_id: body.admin_id || null,
        is_scheduled: body.is_scheduled ?? null,
        meeting_status: body.meeting_status || 'SCHEDULED',
        agenda: body.agenda || null,
        agenda_link: body.agenda_link || null,
        frequency: body.frequency || null,
      })
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

    if (meetingError) {
      console.error('Error creating meeting:', meetingError)
      return NextResponse.json(
        { data: null, error: `Database error: ${meetingError.message}` },
        { status: 500 }
      )
    }

    const response: ParentMeetingApiResponse<typeof meetingData> = {
      data: meetingData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/meetings error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/meetings
 *
 * Lists parent meetings with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with meetings array or error
 *
 * @example
 * GET /api/meetings?student_id=uuid
 * GET /api/meetings?meeting_status=SCHEDULED&sss_staff_id=uuid
 */
export async function GET(request: NextRequest) {
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
        { data: null, error: 'Forbidden - Only SSS staff can view meetings' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: ParentMeetingFilters = {
      student_id: searchParams.get('student_id') || undefined,
      case_id: searchParams.get('case_id') || undefined,
      sss_staff_id: searchParams.get('sss_staff_id') || undefined,
      meeting_status: searchParams.get('meeting_status') as any,
      is_scheduled: searchParams.get('is_scheduled') === 'true' ? true : searchParams.get('is_scheduled') === 'false' ? false : undefined,
      meeting_date_from: searchParams.get('meeting_date_from') || undefined,
      meeting_date_to: searchParams.get('meeting_date_to') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('parent_meetings')
      .select(
        `
        id,
        student_id,
        case_id,
        meeting_date,
        meeting_time,
        meeting_status,
        sss_staff_id,
        is_scheduled,
        created_at,
        updated_at,
        student:students!inner (
          id,
          name,
          grade,
          student_id
        ),
        sss_staff:users!parent_meetings_sss_staff_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.student_id) {
      query = query.eq('student_id', filters.student_id)
    }

    if (filters.case_id) {
      query = query.eq('case_id', filters.case_id)
    }

    if (filters.sss_staff_id) {
      query = query.eq('sss_staff_id', filters.sss_staff_id)
    }

    if (filters.meeting_status) {
      if (Array.isArray(filters.meeting_status)) {
        query = query.in('meeting_status', filters.meeting_status)
      } else {
        query = query.eq('meeting_status', filters.meeting_status)
      }
    }

    if (filters.is_scheduled !== undefined) {
      query = query.eq('is_scheduled', filters.is_scheduled)
    }

    if (filters.meeting_date_from) {
      query = query.gte('meeting_date', filters.meeting_date_from)
    }

    if (filters.meeting_date_to) {
      query = query.lte('meeting_date', filters.meeting_date_to)
    }

    // Apply sorting - upcoming meetings first
    query = query.order('meeting_date', { ascending: true, nullsFirst: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: meetings, error: meetingsError, count } = await query

    if (meetingsError) {
      console.error('Error fetching meetings:', meetingsError)
      return NextResponse.json(
        { data: null, error: `Database error: ${meetingsError.message}` },
        { status: 500 }
      )
    }

    // Transform data to ParentMeetingListItem format
    const meetingListItems: ParentMeetingListItem[] = (meetings || []).map((meeting: any) => ({
      id: meeting.id,
      student_id: meeting.student_id,
      student_name: meeting.student?.name || 'Unknown',
      student_grade: meeting.student?.grade || 'Unknown',
      case_id: meeting.case_id,
      meeting_date: meeting.meeting_date,
      meeting_time: meeting.meeting_time,
      meeting_status: meeting.meeting_status,
      sss_staff_id: meeting.sss_staff_id,
      sss_staff_name: meeting.sss_staff
        ? `${meeting.sss_staff.first_name || ''} ${meeting.sss_staff.last_name || ''}`.trim() || meeting.sss_staff.email
        : null,
      is_scheduled: meeting.is_scheduled,
      created_at: meeting.created_at,
      updated_at: meeting.updated_at,
    }))

    const response: ParentMeetingApiResponse<ParentMeetingListItem[]> = {
      data: meetingListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/meetings error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
