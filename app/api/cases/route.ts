/**
 * Case Management API Routes
 *
 * Handles case creation and listing with filters.
 * - POST /api/cases - Create new case
 * - GET /api/cases - List cases with filters
 *
 * @module app/api/cases
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateCaseInput,
  CaseFilters,
  CaseSortOptions,
  PaginationOptions,
  CaseApiResponse,
  CaseListItem,
} from '@/app/types/case'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cases
 *
 * Creates a new case in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * @param request - Next.js request object with case data in body
 * @returns JSON response with created case or error
 *
 * @example
 * POST /api/cases
 * {
 *   "student_id": "uuid-here",
 *   "case_type": "ACADEMIC_SUPPORT",
 *   "tier": 2,
 *   "is_urgent": false,
 *   "reason_for_referral": "Struggling with reading comprehension"
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
        { data: null, error: 'Forbidden - Only SSS staff can create cases' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateCaseInput = await request.json()

    // Validate required fields
    if (!body.student_id || !body.case_type) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: student_id and case_type are required' },
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

    // Set default opened_date to today if not provided
    const opened_date = body.opened_date || new Date().toISOString().split('T')[0]

    // Create case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        student_id: body.student_id,
        case_type: body.case_type,
        tier: body.tier || null,
        status: body.status || 'OPEN',
        intervention_types: body.intervention_types || null,
        is_urgent: body.is_urgent || false,
        opened_date,
        expected_closure_date: body.expected_closure_date || null,
        case_manager_id: body.case_manager_id || null,
        secondary_supporters: body.secondary_supporters || null,
        reason_for_referral: body.reason_for_referral || null,
        referral_source: body.referral_source || null,
        internal_notes: body.internal_notes || null,
        created_by: user.id,
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

    if (caseError) {
      console.error('Error creating case:', caseError)
      return NextResponse.json(
        { data: null, error: `Database error: ${caseError.message}` },
        { status: 500 }
      )
    }

    const response: CaseApiResponse<typeof caseData> = {
      data: caseData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/cases error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cases
 *
 * Lists cases with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with cases array or error
 *
 * @example
 * GET /api/cases?status=OPEN&is_urgent=true&tier=2
 * GET /api/cases?case_manager_id=uuid&limit=20&page=1
 * GET /api/cases?search=John&grade=5th
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
        { data: null, error: 'Forbidden - Only SSS staff can view cases' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: CaseFilters = {
      status: searchParams.get('status') as any,
      case_type: searchParams.get('case_type') as any,
      tier: searchParams.get('tier') ? parseInt(searchParams.get('tier')!) as any : undefined,
      is_urgent: searchParams.get('is_urgent') === 'true' ? true : searchParams.get('is_urgent') === 'false' ? false : undefined,
      case_manager_id: searchParams.get('case_manager_id') || undefined,
      student_id: searchParams.get('student_id') || undefined,
      grade: searchParams.get('grade') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const sortField = searchParams.get('sort_by') || 'is_urgent'
    const sortDirection = searchParams.get('sort_direction') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query - start with base query joining student and case manager
    let query = supabase
      .from('cases')
      .select(
        `
        id,
        student_id,
        case_type,
        tier,
        status,
        is_urgent,
        opened_date,
        case_manager_id,
        created_at,
        updated_at,
        student:students!inner (
          id,
          name,
          grade,
          student_id
        ),
        case_manager:users!cases_case_manager_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status)
      } else {
        query = query.eq('status', filters.status)
      }
    }

    if (filters.case_type) {
      if (Array.isArray(filters.case_type)) {
        query = query.in('case_type', filters.case_type)
      } else {
        query = query.eq('case_type', filters.case_type)
      }
    }

    if (filters.tier !== undefined) {
      if (Array.isArray(filters.tier)) {
        query = query.in('tier', filters.tier)
      } else {
        query = query.eq('tier', filters.tier)
      }
    }

    if (filters.is_urgent !== undefined) {
      query = query.eq('is_urgent', filters.is_urgent)
    }

    if (filters.case_manager_id) {
      query = query.eq('case_manager_id', filters.case_manager_id)
    }

    if (filters.student_id) {
      query = query.eq('student_id', filters.student_id)
    }

    if (filters.grade) {
      query = query.eq('students.grade', filters.grade)
    }

    if (filters.search) {
      // Search by student name (using ilike for case-insensitive search)
      query = query.ilike('students.name', `%${filters.search}%`)
    }

    // Apply sorting - urgent cases first by default
    if (sortField === 'is_urgent') {
      query = query.order('is_urgent', { ascending: sortDirection === 'asc' })
      query = query.order('opened_date', { ascending: false }) // Then by opened date
    } else if (sortField === 'student_name') {
      query = query.order('students.name', { ascending: sortDirection === 'asc' })
    } else {
      query = query.order(sortField, { ascending: sortDirection === 'asc' })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: cases, error: casesError, count } = await query

    if (casesError) {
      console.error('Error fetching cases:', casesError)
      return NextResponse.json(
        { data: null, error: `Database error: ${casesError.message}` },
        { status: 500 }
      )
    }

    // Get intervention counts for each case
    const caseIds = cases?.map((c) => c.id) || []

    let interventionCounts: Record<string, number> = {}

    if (caseIds.length > 0) {
      const { data: interventions } = await supabase
        .from('interventions')
        .select('case_id')
        .in('case_id', caseIds)

      interventionCounts = (interventions || []).reduce((acc, intervention) => {
        acc[intervention.case_id] = (acc[intervention.case_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    // Transform data to CaseListItem format
    const caseListItems: CaseListItem[] = (cases || []).map((caseItem: any) => ({
      id: caseItem.id,
      student_id: caseItem.student_id,
      student_name: caseItem.student?.name || 'Unknown',
      student_grade: caseItem.student?.grade || 'Unknown',
      case_type: caseItem.case_type,
      tier: caseItem.tier,
      status: caseItem.status,
      is_urgent: caseItem.is_urgent,
      opened_date: caseItem.opened_date,
      case_manager_id: caseItem.case_manager_id,
      case_manager_name: caseItem.case_manager
        ? `${caseItem.case_manager.first_name || ''} ${caseItem.case_manager.last_name || ''}`.trim() || caseItem.case_manager.email
        : null,
      intervention_count: interventionCounts[caseItem.id] || 0,
      created_at: caseItem.created_at,
      updated_at: caseItem.updated_at,
    }))

    const response: CaseApiResponse<CaseListItem[]> = {
      data: caseListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/cases error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
