/**
 * Session API Routes
 *
 * Handles session creation and listing with filters.
 * - POST /api/sessions - Create new session
 * - GET /api/sessions - List sessions with filters
 *
 * @module app/api/sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateSessionInput,
  SessionFilters,
  SessionApiResponse,
  SessionListItem,
} from '@/app/types/session'

/**
 * POST /api/sessions
 *
 * Creates a new session in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * @param request - Next.js request object with session data in body
 * @returns JSON response with created session or error
 *
 * @example
 * POST /api/sessions
 * {
 *   "intervention_id": "uuid-here",
 *   "session_date": "2025-01-20",
 *   "student_attended": true,
 *   "observation_notes": "Student showed improvement"
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
        { data: null, error: 'Forbidden - Only SSS staff can create sessions' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateSessionInput = await request.json()

    // Validate required fields
    if (!body.intervention_id || !body.session_date) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: intervention_id and session_date are required' },
        { status: 400 }
      )
    }

    // Verify intervention exists
    const { data: interventionData, error: interventionError } = await supabase
      .from('interventions')
      .select('id')
      .eq('id', body.intervention_id)
      .single()

    if (interventionError || !interventionData) {
      return NextResponse.json(
        { data: null, error: 'Intervention not found' },
        { status: 404 }
      )
    }

    // Create session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        intervention_id: body.intervention_id,
        session_date: body.session_date,
        session_time: body.session_time || null,
        duration: body.duration || null,
        facilitator_id: body.facilitator_id || null,
        student_attended: body.student_attended ?? null,
        student_notes: body.student_notes || null,
        observation_notes: body.observation_notes || null,
        student_progress: body.student_progress || null,
        challenges: body.challenges || null,
        teacher_feedback: body.teacher_feedback || null,
      })
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

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return NextResponse.json(
        { data: null, error: `Database error: ${sessionError.message}` },
        { status: 500 }
      )
    }

    const response: SessionApiResponse<typeof sessionData> = {
      data: sessionData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/sessions error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sessions
 *
 * Lists sessions with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with sessions array or error
 *
 * @example
 * GET /api/sessions?intervention_id=uuid
 * GET /api/sessions?facilitator_id=uuid&student_attended=true
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
        { data: null, error: 'Forbidden - Only SSS staff can view sessions' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: SessionFilters = {
      intervention_id: searchParams.get('intervention_id') || undefined,
      facilitator_id: searchParams.get('facilitator_id') || undefined,
      student_attended: searchParams.get('student_attended') === 'true' ? true : searchParams.get('student_attended') === 'false' ? false : undefined,
      session_date_from: searchParams.get('session_date_from') || undefined,
      session_date_to: searchParams.get('session_date_to') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('sessions')
      .select(
        `
        id,
        intervention_id,
        session_date,
        session_time,
        duration,
        facilitator_id,
        student_attended,
        created_at,
        updated_at,
        facilitator:users!sessions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.intervention_id) {
      query = query.eq('intervention_id', filters.intervention_id)
    }

    if (filters.facilitator_id) {
      query = query.eq('facilitator_id', filters.facilitator_id)
    }

    if (filters.student_attended !== undefined) {
      query = query.eq('student_attended', filters.student_attended)
    }

    if (filters.session_date_from) {
      query = query.gte('session_date', filters.session_date_from)
    }

    if (filters.session_date_to) {
      query = query.lte('session_date', filters.session_date_to)
    }

    // Apply sorting
    query = query.order('session_date', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: sessions, error: sessionsError, count } = await query

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      return NextResponse.json(
        { data: null, error: `Database error: ${sessionsError.message}` },
        { status: 500 }
      )
    }

    // Transform data to SessionListItem format
    const sessionListItems: SessionListItem[] = (sessions || []).map((session: any) => ({
      id: session.id,
      intervention_id: session.intervention_id,
      session_date: session.session_date,
      session_time: session.session_time,
      duration: session.duration,
      facilitator_id: session.facilitator_id,
      facilitator_name: session.facilitator
        ? `${session.facilitator.first_name || ''} ${session.facilitator.last_name || ''}`.trim() || session.facilitator.email
        : null,
      student_attended: session.student_attended,
      created_at: session.created_at,
      updated_at: session.updated_at,
    }))

    const response: SessionApiResponse<SessionListItem[]> = {
      data: sessionListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/sessions error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
