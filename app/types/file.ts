/**
 * File/Attachment Type Definitions
 *
 * TypeScript types for the File Management system in Maia SSS.
 * These types align with the database schema and provide type safety
 * for API routes and server actions.
 *
 * @module app/types/file
 */

/**
 * Base File interface - matches database table structure
 */
export interface File {
  id: string
  case_id: string | null
  protocol_step_id: string | null
  session_id: string | null
  evaluation_id: string | null
  action_plan_item_id: string | null
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  uploaded_by: string | null
  created_at: string
}

/**
 * Uploader information (subset of user fields)
 */
export interface FileUploader {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

/**
 * File with relationships - used for detailed view
 */
export interface FileWithRelations extends File {
  uploader: FileUploader | null
}

/**
 * File list item - optimized for list views
 */
export interface FileListItem {
  id: string
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  case_id: string | null
  session_id: string | null
  uploaded_by: string | null
  uploader_name: string | null
  created_at: string
}

/**
 * Input type for creating a new file record
 */
export interface CreateFileInput {
  file_name: string
  file_url: string
  file_type?: string | null
  file_size?: number | null
  case_id?: string | null
  protocol_step_id?: string | null
  session_id?: string | null
  evaluation_id?: string | null
  action_plan_item_id?: string | null
}

/**
 * Filters for file queries
 */
export interface FileFilters {
  case_id?: string
  session_id?: string
  evaluation_id?: string
  protocol_step_id?: string
  action_plan_item_id?: string
  uploaded_by?: string
  file_type?: string
}

/**
 * API Response wrapper
 */
export interface FileApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
