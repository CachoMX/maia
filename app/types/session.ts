/**
 * Session Type Definitions
 *
 * TypeScript types for the Session tracking system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/session
 */

/**
 * Base Session interface - matches database table structure
 */
export interface Session {
  id: string
  intervention_id: string
  session_date: string
  session_time: string | null
  duration: number | null
  facilitator_id: string | null
  student_attended: boolean | null
  student_notes: string | null
  observation_notes: string | null
  student_progress: string | null
  challenges: string | null
  teacher_feedback: string | null
  created_at: string
  updated_at: string
}

/**
 * Facilitator information (subset of user fields)
 */
export interface SessionFacilitator {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  sss_position: string | null
}

/**
 * Session with relationships - used for detailed view
 */
export interface SessionWithRelations extends Session {
  facilitator: SessionFacilitator | null
}

/**
 * Session list item - optimized for list views
 */
export interface SessionListItem {
  id: string
  intervention_id: string
  session_date: string
  session_time: string | null
  duration: number | null
  facilitator_id: string | null
  facilitator_name: string | null
  student_attended: boolean | null
  created_at: string
  updated_at: string
}

/**
 * Input type for creating a new session
 */
export interface CreateSessionInput {
  intervention_id: string
  session_date: string
  session_time?: string | null
  duration?: number | null
  facilitator_id?: string | null
  student_attended?: boolean | null
  student_notes?: string | null
  observation_notes?: string | null
  student_progress?: string | null
  challenges?: string | null
  teacher_feedback?: string | null
}

/**
 * Input type for updating an existing session
 */
export interface UpdateSessionInput {
  session_date?: string
  session_time?: string | null
  duration?: number | null
  facilitator_id?: string | null
  student_attended?: boolean | null
  student_notes?: string | null
  observation_notes?: string | null
  student_progress?: string | null
  challenges?: string | null
  teacher_feedback?: string | null
}

/**
 * Filters for session queries
 */
export interface SessionFilters {
  intervention_id?: string
  facilitator_id?: string
  student_attended?: boolean
  session_date_from?: string
  session_date_to?: string
}

/**
 * API Response wrapper
 */
export interface SessionApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
