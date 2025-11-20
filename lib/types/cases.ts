// Case Management Types for Maia SSS Application

export type CaseType =
  | 'ACADEMIC_SUPPORT'
  | 'SEL'
  | 'DISTINCTIONS'
  | 'CONFLICT_RESOLUTION'
  | 'BULLYING'
  | 'CHILD_PROTECTION'
  | 'URGENT'

export type CaseTier = 1 | 2 | 3

export type CaseStatus =
  | 'OPEN'
  | 'ON_HOLD'
  | 'CLOSED'
  | 'REFERRED_OUT'

export type ReferralSource =
  | 'KID_TALK'
  | 'BEHAVIOR_FORM'
  | 'SELF'
  | 'PARENT'
  | 'ADMIN'
  | 'TEACHER'

export type Grade =
  | 'PreK'
  | 'K1'
  | 'K2'
  | 'K3'
  | 'G1'
  | 'G2'
  | 'G3'
  | 'G4'
  | 'G5'
  | 'G6'
  | 'MS'
  | 'HS'

export interface Student {
  id: string
  name: string
  grade: Grade
  dateOfBirth: string
  studentId: string
  createdAt: string
  updatedAt: string
}

export interface Case {
  id: string
  studentId: string
  student?: Student
  caseType: CaseType
  tier: CaseTier
  status: CaseStatus
  isUrgent: boolean
  caseManagerId: string
  caseManager?: {
    id: string
    first_name: string
    last_name: string
  }
  reasonForReferral: string
  referralSource: ReferralSource
  openedDate: string
  closedDate?: string
  createdAt: string
  updatedAt: string
}

export interface CaseFormData {
  studentId: string
  caseType: CaseType
  tier: CaseTier
  isUrgent: boolean
  caseManagerId: string
  reasonForReferral: string
  referralSource: ReferralSource
}

// Helper functions for display
export const caseTypeLabels: Record<CaseType, string> = {
  ACADEMIC_SUPPORT: 'Academic Support',
  SEL: 'SEL',
  DISTINCTIONS: 'Distinctions',
  CONFLICT_RESOLUTION: 'Conflict Resolution',
  BULLYING: 'Bullying',
  CHILD_PROTECTION: 'Child Protection',
  URGENT: 'Urgent'
}

export const caseStatusLabels: Record<CaseStatus, string> = {
  OPEN: 'Open',
  ON_HOLD: 'On Hold',
  CLOSED: 'Closed',
  REFERRED_OUT: 'Referred Out'
}

export const referralSourceLabels: Record<ReferralSource, string> = {
  KID_TALK: 'KID Talk Meeting',
  BEHAVIOR_FORM: 'Behavior Form',
  SELF: 'Student Self-Referral',
  PARENT: 'Parent Request',
  ADMIN: 'Admin Referral',
  TEACHER: 'Teacher Referral'
}

export const gradeLabels: Record<Grade, string> = {
  PreK: 'Pre-K',
  K1: 'K1',
  K2: 'K2',
  K3: 'K3',
  G1: 'Grade 1',
  G2: 'Grade 2',
  G3: 'Grade 3',
  G4: 'Grade 4',
  G5: 'Grade 5',
  G6: 'Grade 6',
  MS: 'Middle School',
  HS: 'High School'
}
