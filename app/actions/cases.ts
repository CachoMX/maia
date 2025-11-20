/**
 * Case Management Server Actions
 *
 * Server-side actions for case management operations.
 * These can be called directly from React Server Components and Client Components.
 *
 * @module app/actions/cases
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  CreateCaseInput,
  UpdateCaseInput,
  CloseCaseInput,
  AssignCaseManagerInput,
  CaseFilters,
  CaseWithRelations,
  CaseListItem,
  CaseApiResponse,
  CaseStatistics,
} from '@/app/types/case'

/**
 * Creates a new case
 *
 * @param data - Case creation input data
 * @returns Promise with created case or error
 *
 * @example
 * const result = await createCase({
 *   student_id: "uuid",
 *   case_type: "ACADEMIC_SUPPORT",
 *   tier: 2,
 *   reason_for_referral: "Reading comprehension difficulties"
 * })
 */
export async function createCase(
  data: CreateCaseInput
): Promise<CaseApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can create cases' }
    }

    // Validate required fields
    if (!data.student_id || !data.case_type) {
      return {
        data: null,
        error: 'Missing required fields: student_id and case_type are required',
      }
    }

    // Set default opened_date to today if not provided
    const opened_date = data.opened_date || new Date().toISOString().split('T')[0]

    // Create case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        student_id: data.student_id,
        case_type: data.case_type,
        tier: data.tier || null,
        status: data.status || 'OPEN',
        intervention_types: data.intervention_types || null,
        is_urgent: data.is_urgent || false,
        opened_date,
        expected_closure_date: data.expected_closure_date || null,
        case_manager_id: data.case_manager_id || null,
        secondary_supporters: data.secondary_supporters || null,
        reason_for_referral: data.reason_for_referral || null,
        referral_source: data.referral_source || null,
        internal_notes: data.internal_notes || null,
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
      return { data: null, error: `Database error: ${caseError.message}` }
    }

    // Revalidate cases list
    revalidatePath('/dashboard/cases')

    return { data: caseData, error: null }
  } catch (error) {
    console.error('createCase error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Gets a list of cases with optional filters
 *
 * @param filters - Optional filters for cases
 * @returns Promise with cases array or error
 *
 * @example
 * const result = await getCases({ status: 'OPEN', is_urgent: true })
 */
export async function getCases(
  filters?: CaseFilters
): Promise<CaseApiResponse<CaseListItem[]>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can view cases' }
    }

    // Build query
    let query = supabase.from('cases').select(
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
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status)
      } else {
        query = query.eq('status', filters.status)
      }
    }

    if (filters?.case_type) {
      if (Array.isArray(filters.case_type)) {
        query = query.in('case_type', filters.case_type)
      } else {
        query = query.eq('case_type', filters.case_type)
      }
    }

    if (filters?.tier !== undefined) {
      if (Array.isArray(filters.tier)) {
        query = query.in('tier', filters.tier)
      } else {
        query = query.eq('tier', filters.tier)
      }
    }

    if (filters?.is_urgent !== undefined) {
      query = query.eq('is_urgent', filters.is_urgent)
    }

    if (filters?.case_manager_id) {
      query = query.eq('case_manager_id', filters.case_manager_id)
    }

    if (filters?.student_id) {
      query = query.eq('student_id', filters.student_id)
    }

    if (filters?.grade) {
      query = query.eq('students.grade', filters.grade)
    }

    if (filters?.search) {
      query = query.ilike('students.name', `%${filters.search}%`)
    }

    // Sort by urgent first, then by opened date
    query = query.order('is_urgent', { ascending: false })
    query = query.order('opened_date', { ascending: false })

    // Execute query
    const { data: cases, error: casesError, count } = await query

    if (casesError) {
      console.error('Error fetching cases:', casesError)
      return { data: null, error: `Database error: ${casesError.message}` }
    }

    // Get intervention counts
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

    // Transform to CaseListItem format
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
        ? `${caseItem.case_manager.first_name || ''} ${caseItem.case_manager.last_name || ''}`.trim() ||
          caseItem.case_manager.email
        : null,
      intervention_count: interventionCounts[caseItem.id] || 0,
      created_at: caseItem.created_at,
      updated_at: caseItem.updated_at,
    }))

    return { data: caseListItems, error: null, count: count || 0 }
  } catch (error) {
    console.error('getCases error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Gets a single case with all relationships
 *
 * @param id - Case ID
 * @returns Promise with case details or error
 */
export async function getCase(
  id: string
): Promise<CaseApiResponse<CaseWithRelations>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can view cases' }
    }

    // Fetch case with relationships
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
      .eq('id', id)
      .single()

    if (caseError) {
      if (caseError.code === 'PGRST116') {
        return { data: null, error: 'Case not found' }
      }
      console.error('Error fetching case:', caseError)
      return { data: null, error: `Database error: ${caseError.message}` }
    }

    // Get counts
    const { count: interventionCount } = await supabase
      .from('interventions')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', id)

    const { data: interventions } = await supabase
      .from('interventions')
      .select('id')
      .eq('case_id', id)

    const interventionIds = interventions?.map((i) => i.id) || []
    let sessionCount = 0

    if (interventionIds.length > 0) {
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .in('intervention_id', interventionIds)

      sessionCount = count || 0
    }

    const { count: parentMeetingCount } = await supabase
      .from('parent_meetings')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', id)

    const caseWithRelations: CaseWithRelations = {
      ...caseData,
      intervention_count: interventionCount || 0,
      session_count: sessionCount,
      parent_meeting_count: parentMeetingCount || 0,
    }

    return { data: caseWithRelations, error: null }
  } catch (error) {
    console.error('getCase error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Updates an existing case
 *
 * @param id - Case ID
 * @param data - Update data
 * @returns Promise with updated case or error
 */
export async function updateCase(
  id: string,
  data: UpdateCaseInput
): Promise<CaseApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can update cases' }
    }

    // Update case
    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update(data)
      .eq('id', id)
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
      if (updateError.code === 'PGRST116') {
        return { data: null, error: 'Case not found' }
      }
      console.error('Error updating case:', updateError)
      return { data: null, error: `Database error: ${updateError.message}` }
    }

    // Revalidate paths
    revalidatePath('/dashboard/cases')
    revalidatePath(`/dashboard/cases/${id}`)

    return { data: updatedCase, error: null }
  } catch (error) {
    console.error('updateCase error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Closes a case (soft delete)
 *
 * @param id - Case ID
 * @param input - Closure information
 * @returns Promise with closed case or error
 */
export async function closeCase(
  id: string,
  input: CloseCaseInput
): Promise<CaseApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can close cases' }
    }

    if (!input.closure_reason) {
      return { data: null, error: 'closure_reason is required' }
    }

    const closedDate = input.closed_date || new Date().toISOString().split('T')[0]

    // Close case
    const { data: closedCase, error: closeError } = await supabase
      .from('cases')
      .update({
        status: 'CLOSED',
        closed_date: closedDate,
        closure_reason: input.closure_reason,
      })
      .eq('id', id)
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
      if (closeError.code === 'PGRST116') {
        return { data: null, error: 'Case not found' }
      }
      console.error('Error closing case:', closeError)
      return { data: null, error: `Database error: ${closeError.message}` }
    }

    // Revalidate paths
    revalidatePath('/dashboard/cases')
    revalidatePath(`/dashboard/cases/${id}`)

    return { data: closedCase, error: null }
  } catch (error) {
    console.error('closeCase error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Assigns a case manager to a case
 *
 * @param caseId - Case ID
 * @param input - Assignment data
 * @returns Promise with updated case or error
 */
export async function assignCaseManager(
  caseId: string,
  input: AssignCaseManagerInput
): Promise<CaseApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return {
        data: null,
        error: 'Forbidden - Only SSS staff can assign case managers',
      }
    }

    // Verify case manager exists and is SSS_STAFF
    const { data: managerData, error: managerError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', input.case_manager_id)
      .single()

    if (managerError || !managerData) {
      return { data: null, error: 'Case manager not found' }
    }

    if (managerData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Case manager must be SSS staff' }
    }

    // Assign case manager
    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update({ case_manager_id: input.case_manager_id })
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
      if (updateError.code === 'PGRST116') {
        return { data: null, error: 'Case not found' }
      }
      console.error('Error assigning case manager:', updateError)
      return { data: null, error: `Database error: ${updateError.message}` }
    }

    // Revalidate paths
    revalidatePath('/dashboard/cases')
    revalidatePath(`/dashboard/cases/${caseId}`)

    return { data: updatedCase, error: null }
  } catch (error) {
    console.error('assignCaseManager error:', error)
    return { data: null, error: 'Internal server error' }
  }
}

/**
 * Gets case statistics for the dashboard
 *
 * @returns Promise with case statistics or error
 */
export async function getCaseStatistics(): Promise<
  CaseApiResponse<CaseStatistics>
> {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Unauthorized - Please log in' }
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return { data: null, error: 'User not found' }
    }

    if (userData.role !== 'SSS_STAFF') {
      return { data: null, error: 'Forbidden - Only SSS staff can view statistics' }
    }

    // Get all cases
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, status, case_type, tier, is_urgent')

    if (casesError) {
      console.error('Error fetching cases:', casesError)
      return { data: null, error: `Database error: ${casesError.message}` }
    }

    // Calculate statistics
    const stats: CaseStatistics = {
      total_cases: cases?.length || 0,
      open_cases: cases?.filter((c) => c.status === 'OPEN').length || 0,
      on_hold_cases: cases?.filter((c) => c.status === 'ON_HOLD').length || 0,
      closed_cases: cases?.filter((c) => c.status === 'CLOSED').length || 0,
      urgent_cases: cases?.filter((c) => c.is_urgent).length || 0,
      tier_1_cases: cases?.filter((c) => c.tier === 1).length || 0,
      tier_2_cases: cases?.filter((c) => c.tier === 2).length || 0,
      tier_3_cases: cases?.filter((c) => c.tier === 3).length || 0,
      cases_by_type: {
        ACADEMIC_SUPPORT:
          cases?.filter((c) => c.case_type === 'ACADEMIC_SUPPORT').length || 0,
        SEL: cases?.filter((c) => c.case_type === 'SEL').length || 0,
        DISTINCTIONS: cases?.filter((c) => c.case_type === 'DISTINCTIONS').length || 0,
        CONFLICT_RESOLUTION:
          cases?.filter((c) => c.case_type === 'CONFLICT_RESOLUTION').length || 0,
        BULLYING: cases?.filter((c) => c.case_type === 'BULLYING').length || 0,
        CHILD_PROTECTION:
          cases?.filter((c) => c.case_type === 'CHILD_PROTECTION').length || 0,
        URGENT: cases?.filter((c) => c.case_type === 'URGENT').length || 0,
      },
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('getCaseStatistics error:', error)
    return { data: null, error: 'Internal server error' }
  }
}
