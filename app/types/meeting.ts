/**
 * Parent Meeting Type Definitions
 *
 * TypeScript types for the Parent Meeting system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/meeting
 */

/**
 * Meeting Status
 */
export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

/**
 * Base Parent Meeting interface - matches database table structure
 */
export interface ParentMeeting {
  id: string
  student_id: string
  case_id: string | null
  meeting_date: string | null
  meeting_time: string | null
  parent_ids: string[] | null
  sss_staff_id: string | null
  teacher_ids: string[] | null
  admin_id: string | null
  is_scheduled: boolean | null
  meeting_status: MeetingStatus
  cancellation_reason: string | null
  rescheduled_date: string | null
  google_calendar_event_id: string | null
  agenda: string | null
  agenda_link: string | null
  meeting_notes: string | null
  next_steps: string | null
  action_plan: any | null
  next_meeting_date: string | null
  reminder_sent: boolean | null
  reminder_sent_date: string | null
  frequency: string | null
  created_at: string
  updated_at: string
}

/**
 * Student information (subset of fields)
 */
export interface MeetingStudent {
  id: string
  name: string
  grade: string
  student_id: string | null
}

/**
 * SSS Staff information
 */
export interface MeetingStaff {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  sss_position: string | null
}

/**
 * Parent Meeting with relationships - used for detailed view
 */
export interface ParentMeetingWithRelations extends ParentMeeting {
  student: MeetingStudent
  sss_staff: MeetingStaff | null
}

/**
 * Parent Meeting list item - optimized for list views
 */
export interface ParentMeetingListItem {
  id: string
  student_id: string
  student_name: string
  student_grade: string
  case_id: string | null
  meeting_date: string | null
  meeting_time: string | null
  meeting_status: MeetingStatus
  sss_staff_id: string | null
  sss_staff_name: string | null
  is_scheduled: boolean | null
  created_at: string
  updated_at: string
}

/**
 * Input type for creating a new parent meeting
 */
export interface CreateParentMeetingInput {
  student_id: string
  case_id?: string | null
  meeting_date?: string | null
  meeting_time?: string | null
  parent_ids?: string[] | null
  sss_staff_id?: string | null
  teacher_ids?: string[] | null
  admin_id?: string | null
  is_scheduled?: boolean | null
  meeting_status?: MeetingStatus
  agenda?: string | null
  agenda_link?: string | null
  frequency?: string | null
}

/**
 * Input type for updating an existing parent meeting
 */
export interface UpdateParentMeetingInput {
  meeting_date?: string | null
  meeting_time?: string | null
  parent_ids?: string[] | null
  sss_staff_id?: string | null
  teacher_ids?: string[] | null
  admin_id?: string | null
  is_scheduled?: boolean | null
  meeting_status?: MeetingStatus
  cancellation_reason?: string | null
  rescheduled_date?: string | null
  google_calendar_event_id?: string | null
  agenda?: string | null
  agenda_link?: string | null
  meeting_notes?: string | null
  next_steps?: string | null
  action_plan?: any | null
  next_meeting_date?: string | null
  reminder_sent?: boolean | null
  reminder_sent_date?: string | null
  frequency?: string | null
}

/**
 * Filters for parent meeting queries
 */
export interface ParentMeetingFilters {
  student_id?: string
  case_id?: string
  sss_staff_id?: string
  meeting_status?: MeetingStatus | MeetingStatus[]
  is_scheduled?: boolean
  meeting_date_from?: string
  meeting_date_to?: string
}

/**
 * API Response wrapper
 */
export interface ParentMeetingApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
