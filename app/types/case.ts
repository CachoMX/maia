/**
 * Case Management Type Definitions
 *
 * TypeScript types for the Case Management system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/case
 */

/**
 * Case Types - 7 different types of student support cases
 */
export type CaseType =
  | 'ACADEMIC_SUPPORT'
  | 'SEL'
  | 'DISTINCTIONS'
  | 'CONFLICT_RESOLUTION'
  | 'BULLYING'
  | 'CHILD_PROTECTION'
  | 'URGENT'

/**
 * Case Status - Current state of the case
 */
export type CaseStatus = 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'

/**
 * Tier Levels - Intervention intensity levels
 */
export type CaseTier = 1 | 2 | 3

/**
 * Referral Source - How the case was initiated
 */
export type ReferralSource = 'KID_TALK' | 'BEHAVIOR_FORM' | 'SELF' | 'PARENT' | 'ADMIN'

/**
 * Base Case interface - matches database table structure
 */
export interface Case {
  id: string
  student_id: string
  case_type: CaseType
  tier: CaseTier | null
  status: CaseStatus
  intervention_types: string[] | null
  is_urgent: boolean
  opened_date: string | null
  expected_closure_date: string | null
  closed_date: string | null
  closure_reason: string | null
  case_manager_id: string | null
  secondary_supporters: string[] | null
  reason_for_referral: string | null
  referral_source: ReferralSource | null
  internal_notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

/**
 * Student information (subset of fields needed for case display)
 */
export interface CaseStudent {
  id: string
  name: string
  grade: string
  student_id: string | null
}

/**
 * Case Manager information (subset of user fields)
 */
export interface CaseManager {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  sss_position: string | null
}

/**
 * Case with all relationships - used for detailed case view
 */
export interface CaseWithRelations extends Case {
  student: CaseStudent
  case_manager: CaseManager | null
  intervention_count: number
  session_count: number
  parent_meeting_count: number
}

/**
 * Case list item - optimized for list views with key relationships
 */
export interface CaseListItem {
  id: string
  student_id: string
  student_name: string
  student_grade: string
  case_type: CaseType
  tier: CaseTier | null
  status: CaseStatus
  is_urgent: boolean
  opened_date: string | null
  case_manager_id: string | null
  case_manager_name: string | null
  intervention_count: number
  created_at: string
  updated_at: string
}

/**
 * Input type for creating a new case
 */
export interface CreateCaseInput {
  student_id: string
  case_type: CaseType
  tier?: CaseTier | null
  status?: CaseStatus
  intervention_types?: string[] | null
  is_urgent?: boolean
  opened_date?: string | null
  expected_closure_date?: string | null
  case_manager_id?: string | null
  secondary_supporters?: string[] | null
  reason_for_referral?: string | null
  referral_source?: ReferralSource | null
  internal_notes?: string | null
}

/**
 * Input type for updating an existing case
 */
export interface UpdateCaseInput {
  case_type?: CaseType
  tier?: CaseTier | null
  status?: CaseStatus
  intervention_types?: string[] | null
  is_urgent?: boolean
  opened_date?: string | null
  expected_closure_date?: string | null
  closed_date?: string | null
  closure_reason?: string | null
  case_manager_id?: string | null
  secondary_supporters?: string[] | null
  reason_for_referral?: string | null
  referral_source?: ReferralSource | null
  internal_notes?: string | null
}

/**
 * Filters for case queries
 */
export interface CaseFilters {
  status?: CaseStatus | CaseStatus[]
  case_type?: CaseType | CaseType[]
  tier?: CaseTier | CaseTier[]
  is_urgent?: boolean
  case_manager_id?: string
  student_id?: string
  grade?: string
  search?: string // Search by student name or case ID
  opened_after?: string // Date filter
  opened_before?: string // Date filter
}

/**
 * Sort options for case queries
 */
export interface CaseSortOptions {
  field: 'is_urgent' | 'opened_date' | 'created_at' | 'updated_at' | 'student_name'
  direction: 'asc' | 'desc'
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number
  limit?: number
}

/**
 * API Response wrapper
 */
export interface CaseApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

/**
 * Close case input
 */
export interface CloseCaseInput {
  closure_reason: string
  closed_date?: string
}

/**
 * Assign case manager input
 */
export interface AssignCaseManagerInput {
  case_manager_id: string
}

/**
 * Case statistics for dashboard
 */
export interface CaseStatistics {
  total_cases: number
  open_cases: number
  on_hold_cases: number
  closed_cases: number
  urgent_cases: number
  tier_1_cases: number
  tier_2_cases: number
  tier_3_cases: number
  cases_by_type: Record<CaseType, number>
}
