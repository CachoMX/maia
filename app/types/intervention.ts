/**
 * Intervention Type Definitions
 *
 * TypeScript types for the Intervention system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/intervention
 */

/**
 * Intervention Types
 */
export type InterventionType = 'ACADEMIC' | 'SEL' | 'DISTINCTIONS'

/**
 * Tier Levels - Intervention intensity levels
 */
export type InterventionTier = 1 | 2 | 3

/**
 * Base Intervention interface - matches database table structure
 */
export interface Intervention {
  id: string
  case_id: string
  type: InterventionType
  tier: InterventionTier | null
  intervention_name: string
  description: string | null
  start_date: string
  estimated_end_date: string | null
  actual_end_date: string | null
  duration_weeks: number | null
  frequency: string | null
  delivery_format: string | null
  facilitator_id: string | null
  location: string | null
  is_active: boolean
  reason_for_ending: string | null
  is_escalatable_tier: boolean
  escalated_from_intervention_id: string | null
  created_at: string
  updated_at: string
}

/**
 * Facilitator information (subset of user fields)
 */
export interface InterventionFacilitator {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  sss_position: string | null
}

/**
 * Intervention with relationships - used for detailed view
 */
export interface InterventionWithRelations extends Intervention {
  facilitator: InterventionFacilitator | null
  session_count: number
}

/**
 * Intervention list item - optimized for list views
 */
export interface InterventionListItem {
  id: string
  case_id: string
  type: InterventionType
  tier: InterventionTier | null
  intervention_name: string
  start_date: string
  estimated_end_date: string | null
  actual_end_date: string | null
  facilitator_id: string | null
  facilitator_name: string | null
  is_active: boolean
  session_count: number
  created_at: string
  updated_at: string
}

/**
 * Input type for creating a new intervention
 */
export interface CreateInterventionInput {
  case_id: string
  type: InterventionType
  tier?: InterventionTier | null
  intervention_name: string
  description?: string | null
  start_date: string
  estimated_end_date?: string | null
  duration_weeks?: number | null
  frequency?: string | null
  delivery_format?: string | null
  facilitator_id?: string | null
  location?: string | null
  is_escalatable_tier?: boolean
  escalated_from_intervention_id?: string | null
}

/**
 * Input type for updating an existing intervention
 */
export interface UpdateInterventionInput {
  type?: InterventionType
  tier?: InterventionTier | null
  intervention_name?: string
  description?: string | null
  start_date?: string
  estimated_end_date?: string | null
  actual_end_date?: string | null
  duration_weeks?: number | null
  frequency?: string | null
  delivery_format?: string | null
  facilitator_id?: string | null
  location?: string | null
  is_active?: boolean
  reason_for_ending?: string | null
  is_escalatable_tier?: boolean
}

/**
 * Filters for intervention queries
 */
export interface InterventionFilters {
  case_id?: string
  type?: InterventionType | InterventionType[]
  tier?: InterventionTier | InterventionTier[]
  is_active?: boolean
  facilitator_id?: string
}

/**
 * API Response wrapper
 */
export interface InterventionApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
