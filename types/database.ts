/**
 * Database Type Definitions for Maia SSS
 *
 * Generated types for Supabase database tables.
 * Based on the SSS (Student Support Services) schema.
 *
 * @module types/database
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'SSS_STAFF' | 'TEACHER' | 'PARENT' | 'PRINCIPAL_ADMIN' | null
          school_id: string | null
          sss_position: string | null
          google_id: string | null
          department: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'SSS_STAFF' | 'TEACHER' | 'PARENT' | 'PRINCIPAL_ADMIN' | null
          school_id?: string | null
          sss_position?: string | null
          google_id?: string | null
          department?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'SSS_STAFF' | 'TEACHER' | 'PARENT' | 'PRINCIPAL_ADMIN' | null
          school_id?: string | null
          sss_position?: string | null
          google_id?: string | null
          department?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
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
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          id?: string
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
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'students_primary_teacher_id_fkey'
            columns: ['primary_teacher_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      cases: {
        Row: {
          id: string
          student_id: string
          case_type: 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT'
          tier: 1 | 2 | 3 | null
          status: 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'
          intervention_types: string[] | null
          is_urgent: boolean
          opened_date: string | null
          expected_closure_date: string | null
          closed_date: string | null
          closure_reason: string | null
          case_manager_id: string | null
          secondary_supporters: string[] | null
          reason_for_referral: string | null
          referral_source: 'KID_TALK' | 'BEHAVIOR_FORM' | 'SELF' | 'PARENT' | 'ADMIN' | null
          internal_notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          case_type: 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT'
          tier?: 1 | 2 | 3 | null
          status?: 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'
          intervention_types?: string[] | null
          is_urgent?: boolean
          opened_date?: string | null
          expected_closure_date?: string | null
          closed_date?: string | null
          closure_reason?: string | null
          case_manager_id?: string | null
          secondary_supporters?: string[] | null
          reason_for_referral?: string | null
          referral_source?: 'KID_TALK' | 'BEHAVIOR_FORM' | 'SELF' | 'PARENT' | 'ADMIN' | null
          internal_notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          case_type?: 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT'
          tier?: 1 | 2 | 3 | null
          status?: 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'
          intervention_types?: string[] | null
          is_urgent?: boolean
          opened_date?: string | null
          expected_closure_date?: string | null
          closed_date?: string | null
          closure_reason?: string | null
          case_manager_id?: string | null
          secondary_supporters?: string[] | null
          reason_for_referral?: string | null
          referral_source?: 'KID_TALK' | 'BEHAVIOR_FORM' | 'SELF' | 'PARENT' | 'ADMIN' | null
          internal_notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cases_student_id_fkey'
            columns: ['student_id']
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cases_case_manager_id_fkey'
            columns: ['case_manager_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cases_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      interventions: {
        Row: {
          id: string
          case_id: string
          type: 'ACADEMIC' | 'SEL' | 'DISTINCTIONS'
          tier: 1 | 2 | 3 | null
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
        Insert: {
          id?: string
          case_id: string
          type: 'ACADEMIC' | 'SEL' | 'DISTINCTIONS'
          tier?: 1 | 2 | 3 | null
          intervention_name: string
          description?: string | null
          start_date: string
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
          escalated_from_intervention_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          type?: 'ACADEMIC' | 'SEL' | 'DISTINCTIONS'
          tier?: 1 | 2 | 3 | null
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
          escalated_from_intervention_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'interventions_case_id_fkey'
            columns: ['case_id']
            referencedRelation: 'cases'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interventions_facilitator_id_fkey'
            columns: ['facilitator_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      sessions: {
        Row: {
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
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          intervention_id?: string
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
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sessions_intervention_id_fkey'
            columns: ['intervention_id']
            referencedRelation: 'interventions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessions_facilitator_id_fkey'
            columns: ['facilitator_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      files: {
        Row: {
          id: string
          case_id: string
          uploaded_by: string | null
          file_name: string
          file_type: string | null
          file_size: number | null
          file_url: string | null
          storage_path: string | null
          description: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_id: string
          uploaded_by?: string | null
          file_name: string
          file_type?: string | null
          file_size?: number | null
          file_url?: string | null
          storage_path?: string | null
          description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          uploaded_by?: string | null
          file_name?: string
          file_type?: string | null
          file_size?: number | null
          file_url?: string | null
          storage_path?: string | null
          description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'files_case_id_fkey'
            columns: ['case_id']
            referencedRelation: 'cases'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'files_uploaded_by_fkey'
            columns: ['uploaded_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      parent_meetings: {
        Row: {
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
          meeting_status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
          cancellation_reason: string | null
          rescheduled_date: string | null
          google_calendar_event_id: string | null
          agenda: string | null
          agenda_link: string | null
          meeting_notes: string | null
          next_steps: string | null
          action_plan: Json | null
          next_meeting_date: string | null
          reminder_sent: boolean | null
          reminder_sent_date: string | null
          frequency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          case_id?: string | null
          meeting_date?: string | null
          meeting_time?: string | null
          parent_ids?: string[] | null
          sss_staff_id?: string | null
          teacher_ids?: string[] | null
          admin_id?: string | null
          is_scheduled?: boolean | null
          meeting_status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
          cancellation_reason?: string | null
          rescheduled_date?: string | null
          google_calendar_event_id?: string | null
          agenda?: string | null
          agenda_link?: string | null
          meeting_notes?: string | null
          next_steps?: string | null
          action_plan?: Json | null
          next_meeting_date?: string | null
          reminder_sent?: boolean | null
          reminder_sent_date?: string | null
          frequency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          case_id?: string | null
          meeting_date?: string | null
          meeting_time?: string | null
          parent_ids?: string[] | null
          sss_staff_id?: string | null
          teacher_ids?: string[] | null
          admin_id?: string | null
          is_scheduled?: boolean | null
          meeting_status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
          cancellation_reason?: string | null
          rescheduled_date?: string | null
          google_calendar_event_id?: string | null
          agenda?: string | null
          agenda_link?: string | null
          meeting_notes?: string | null
          next_steps?: string | null
          action_plan?: Json | null
          next_meeting_date?: string | null
          reminder_sent?: boolean | null
          reminder_sent_date?: string | null
          frequency?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'parent_meetings_student_id_fkey'
            columns: ['student_id']
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'parent_meetings_case_id_fkey'
            columns: ['case_id']
            referencedRelation: 'cases'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'parent_meetings_sss_staff_id_fkey'
            columns: ['sss_staff_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'SSS_STAFF' | 'TEACHER' | 'PARENT' | 'PRINCIPAL_ADMIN'
      case_type: 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT'
      case_status: 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'
      intervention_type: 'ACADEMIC' | 'SEL' | 'DISTINCTIONS'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
