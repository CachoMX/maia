/**
 * Student Type Definitions
 *
 * TypeScript types for the Student Management system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/student
 */

/**
 * Base Student interface - matches database table structure
 */
export interface Student {
  id: string
  name: string
  grade: string
  date_of_birth: string | null
  student_id: string | null
  nationality: string | null
  mother_tongue: string | null
  start_date_at_atlas: string | null
  previous_school: string | null
  primary_teacher_id: string | null
  school_id: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

/**
 * Primary Teacher information (subset of user fields)
 */
export interface PrimaryTeacher {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

/**
 * Student with relationships - used for detailed view
 */
export interface StudentWithRelations extends Student {
  primary_teacher: PrimaryTeacher | null
  case_count: number
  active_case_count: number
}

/**
 * Student with all cases - used for comprehensive student view
 */
export interface StudentWithCases extends StudentWithRelations {
  cases: any[] // Will be Case[] from case types
}

/**
 * Student list item - optimized for list views
 */
export interface StudentListItem {
  id: string
  name: string
  grade: string
  student_id: string | null
  primary_teacher_id: string | null
  primary_teacher_name: string | null
  case_count: number
  active_case_count: number
  created_at: string
  updated_at: string
  archived_at: string | null
}

/**
 * Input type for creating a new student
 */
export interface CreateStudentInput {
  name: string
  grade: string
  date_of_birth?: string | null
  student_id?: string | null
  nationality?: string | null
  mother_tongue?: string | null
  start_date_at_atlas?: string | null
  previous_school?: string | null
  primary_teacher_id?: string | null
  school_id?: string | null
}

/**
 * Input type for updating an existing student
 */
export interface UpdateStudentInput {
  name?: string
  grade?: string
  date_of_birth?: string | null
  student_id?: string | null
  nationality?: string | null
  mother_tongue?: string | null
  start_date_at_atlas?: string | null
  previous_school?: string | null
  primary_teacher_id?: string | null
  school_id?: string | null
  archived_at?: string | null
}

/**
 * Filters for student queries
 */
export interface StudentFilters {
  grade?: string | string[]
  primary_teacher_id?: string
  school_id?: string
  archived?: boolean // false = not archived, true = archived, undefined = all
  search?: string // Search by name or student_id
}

/**
 * API Response wrapper
 */
export interface StudentApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
