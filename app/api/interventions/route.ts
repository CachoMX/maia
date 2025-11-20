/**
 * Intervention API Routes
 *
 * Handles intervention creation and listing with filters.
 * - POST /api/interventions - Create new intervention
 * - GET /api/interventions - List interventions with filters
 *
 * @module app/api/interventions
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateInterventionInput,
  InterventionFilters,
  InterventionApiResponse,
  InterventionListItem,
} from '@/app/types/intervention'

/**
 * POST /api/interventions
 *
 * Creates a new intervention in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * @param request - Next.js request object with intervention data in body
 * @returns JSON response with created intervention or error
 *
 * @example
 * POST /api/interventions
 * {
 *   "case_id": "uuid-here",
 *   "type": "ACADEMIC",
 *   "tier": 2,
 *   "intervention_name": "Reading Comprehension Support",
 *   "start_date": "2025-01-15"
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
        { data: null, error: 'Forbidden - Only SSS staff can create interventions' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateInterventionInput = await request.json()

    // Validate required fields
    if (!body.case_id || !body.type || !body.intervention_name || !body.start_date) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: case_id, type, intervention_name, and start_date are required' },
        { status: 400 }
      )
    }

    // Verify case exists
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

    // Create intervention
    const { data: interventionData, error: interventionError } = await supabase
      .from('interventions')
      .insert({
        case_id: body.case_id,
        type: body.type,
        tier: body.tier || null,
        intervention_name: body.intervention_name,
        description: body.description || null,
        start_date: body.start_date,
        estimated_end_date: body.estimated_end_date || null,
        duration_weeks: body.duration_weeks || null,
        frequency: body.frequency || null,
        delivery_format: body.delivery_format || null,
        facilitator_id: body.facilitator_id || null,
        location: body.location || null,
        is_active: true,
        is_escalatable_tier: body.is_escalatable_tier !== false,
        escalated_from_intervention_id: body.escalated_from_intervention_id || null,
      })
      .select(
        `
        *,
        facilitator:users!interventions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .single()

    if (interventionError) {
      console.error('Error creating intervention:', interventionError)
      return NextResponse.json(
        { data: null, error: `Database error: ${interventionError.message}` },
        { status: 500 }
      )
    }

    const response: InterventionApiResponse<typeof interventionData> = {
      data: interventionData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/interventions error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/interventions
 *
 * Lists interventions with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with interventions array or error
 *
 * @example
 * GET /api/interventions?case_id=uuid&is_active=true
 * GET /api/interventions?type=ACADEMIC&tier=2
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
        { data: null, error: 'Forbidden - Only SSS staff can view interventions' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: InterventionFilters = {
      case_id: searchParams.get('case_id') || undefined,
      type: searchParams.get('type') as any,
      tier: searchParams.get('tier') ? parseInt(searchParams.get('tier')!) as any : undefined,
      is_active: searchParams.get('is_active') === 'true' ? true : searchParams.get('is_active') === 'false' ? false : undefined,
      facilitator_id: searchParams.get('facilitator_id') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('interventions')
      .select(
        `
        id,
        case_id,
        type,
        tier,
        intervention_name,
        start_date,
        estimated_end_date,
        actual_end_date,
        facilitator_id,
        is_active,
        created_at,
        updated_at,
        facilitator:users!interventions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.case_id) {
      query = query.eq('case_id', filters.case_id)
    }

    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query = query.in('type', filters.type)
      } else {
        query = query.eq('type', filters.type)
      }
    }

    if (filters.tier !== undefined) {
      if (Array.isArray(filters.tier)) {
        query = query.in('tier', filters.tier)
      } else {
        query = query.eq('tier', filters.tier)
      }
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters.facilitator_id) {
      query = query.eq('facilitator_id', filters.facilitator_id)
    }

    // Apply sorting
    query = query.order('is_active', { ascending: false })
    query = query.order('start_date', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: interventions, error: interventionsError, count } = await query

    if (interventionsError) {
      console.error('Error fetching interventions:', interventionsError)
      return NextResponse.json(
        { data: null, error: `Database error: ${interventionsError.message}` },
        { status: 500 }
      )
    }

    // Get session counts for each intervention
    const interventionIds = interventions?.map((i) => i.id) || []

    let sessionCounts: Record<string, number> = {}

    if (interventionIds.length > 0) {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('intervention_id')
        .in('intervention_id', interventionIds)

      sessionCounts = (sessions || []).reduce((acc, session) => {
        acc[session.intervention_id] = (acc[session.intervention_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    // Transform data to InterventionListItem format
    const interventionListItems: InterventionListItem[] = (interventions || []).map((intervention: any) => ({
      id: intervention.id,
      case_id: intervention.case_id,
      type: intervention.type,
      tier: intervention.tier,
      intervention_name: intervention.intervention_name,
      start_date: intervention.start_date,
      estimated_end_date: intervention.estimated_end_date,
      actual_end_date: intervention.actual_end_date,
      facilitator_id: intervention.facilitator_id,
      facilitator_name: intervention.facilitator
        ? `${intervention.facilitator.first_name || ''} ${intervention.facilitator.last_name || ''}`.trim() || intervention.facilitator.email
        : null,
      is_active: intervention.is_active,
      session_count: sessionCounts[intervention.id] || 0,
      created_at: intervention.created_at,
      updated_at: intervention.updated_at,
    }))

    const response: InterventionApiResponse<InterventionListItem[]> = {
      data: interventionListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/interventions error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
