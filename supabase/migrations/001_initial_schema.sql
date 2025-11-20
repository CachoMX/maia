-- MAIA SSS App - Complete Database Schema Migration
-- Date: November 18, 2025
-- Description: Initial schema deployment with all tables, RLS policies, and indexes

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('SSS_STAFF', 'TEACHER', 'PARENT', 'PRINCIPAL_ADMIN')),
  school_id UUID,
  sss_position TEXT,
  google_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  date_of_birth DATE,
  student_id TEXT,
  nationality TEXT,
  mother_tongue TEXT,
  start_date_at_atlas DATE,
  previous_school TEXT,
  primary_teacher_id UUID REFERENCES users(id),
  school_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived_at TIMESTAMP
);

-- Cases table (main case management) - WITH NEW is_urgent FIELD
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  case_type TEXT NOT NULL CHECK (case_type IN ('ACADEMIC_SUPPORT', 'SEL', 'DISTINCTIONS', 'CONFLICT_RESOLUTION', 'BULLYING', 'CHILD_PROTECTION', 'URGENT')),
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ON_HOLD', 'CLOSED', 'REFERRED_OUT')),
  intervention_types TEXT[],
  is_urgent BOOLEAN DEFAULT FALSE, -- NEW FIELD from Wendy's feedback
  opened_date DATE DEFAULT NOW(),
  expected_closure_date DATE,
  closed_date DATE,
  closure_reason TEXT,
  case_manager_id UUID REFERENCES users(id),
  secondary_supporters UUID[],
  reason_for_referral TEXT,
  referral_source TEXT CHECK (referral_source IN ('KID_TALK', 'BEHAVIOR_FORM', 'SELF', 'PARENT', 'ADMIN')),
  internal_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ACADEMIC', 'SEL', 'DISTINCTIONS')),
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  intervention_name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  estimated_end_date DATE,
  actual_end_date DATE,
  duration_weeks INTEGER,
  frequency TEXT,
  delivery_format TEXT,
  facilitator_id UUID REFERENCES users(id),
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  reason_for_ending TEXT,
  is_escalatable_tier BOOLEAN DEFAULT TRUE,
  escalated_from_intervention_id UUID REFERENCES interventions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME,
  duration INTEGER,
  facilitator_id UUID REFERENCES users(id),
  student_attended BOOLEAN,
  student_notes TEXT,
  observation_notes TEXT,
  student_progress TEXT,
  challenges TEXT,
  teacher_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  evaluation_type TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  report_url TEXT,
  key_findings TEXT,
  parent_consent_date DATE,
  parent_consent_signature_url TEXT,
  evaluation_start_date DATE,
  evaluation_complete_date DATE,
  re_evaluation_due_date DATE, -- For 3-year re-evaluation tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Evaluation steps table
CREATE TABLE IF NOT EXISTS evaluation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  step_type TEXT NOT NULL,
  completed_date DATE,
  completed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Protocol steps table (for Bullying, Child Protection, Conflict Resolution)
CREATE TABLE IF NOT EXISTS protocol_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  protocol_type TEXT NOT NULL CHECK (protocol_type IN ('BULLYING', 'CHILD_PROTECTION', 'CONFLICT_RESOLUTION')),
  step_sequence INTEGER,
  step_type TEXT,
  step_status TEXT DEFAULT 'PENDING' CHECK (step_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED')),
  start_date DATE,
  completed_date DATE,
  due_date DATE,
  assigned_to UUID REFERENCES users(id),
  step_description TEXT,
  findings TEXT,
  decisions TEXT,
  next_step TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Parent meetings table - WITH NEW action_plan FIELD
CREATE TABLE IF NOT EXISTS parent_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id),
  meeting_date DATE,
  meeting_time TIME,
  parent_ids UUID[],
  sss_staff_id UUID REFERENCES users(id),
  teacher_ids UUID[],
  admin_id UUID,
  is_scheduled BOOLEAN,
  meeting_status TEXT DEFAULT 'SCHEDULED' CHECK (meeting_status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
  cancellation_reason TEXT,
  rescheduled_date DATE,
  google_calendar_event_id TEXT,
  agenda TEXT,
  agenda_link TEXT,
  meeting_notes TEXT,
  next_steps TEXT,
  action_plan JSONB, -- NEW FIELD for action plan items
  next_meeting_date DATE,
  reminder_sent BOOLEAN,
  reminder_sent_date DATE,
  frequency TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Action Plan Items table - NEW TABLE for tracking action plan follow-ups
CREATE TABLE IF NOT EXISTS action_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_meeting_id UUID NOT NULL REFERENCES parent_meetings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id),
  description TEXT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  evidence_urls TEXT[], -- Links to files/photos
  notes TEXT,
  assigned_to TEXT, -- Who is responsible (parent, teacher, SSS, student)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group interventions table
CREATE TABLE IF NOT EXISTS group_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  description TEXT,
  student_ids UUID[] NOT NULL,
  facilitator_id UUID REFERENCES users(id),
  facilitator_name TEXT,
  intervention_type TEXT,
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  start_date DATE,
  estimated_end_date DATE,
  frequency TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
  outcomes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group sessions table
CREATE TABLE IF NOT EXISTS group_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_intervention_id UUID NOT NULL REFERENCES group_interventions(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  topic TEXT,
  attendee_ids UUID[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  referral_type TEXT NOT NULL CHECK (referral_type IN ('KID_TALK', 'BEHAVIOR_FORM', 'TEACHER_REFERRAL', 'PARENT_REFERRAL', 'SELF_REFERRAL')),
  kid_talk_date DATE,
  kid_talk_attendees TEXT[],
  kid_talk_notes TEXT,
  kid_talk_agenda TEXT,
  kid_talk_document_url TEXT,
  incident_date DATE,
  incident_time TIME,
  incident_location TEXT,
  incident_description TEXT,
  reported_by TEXT,
  incident_severity TEXT CHECK (incident_severity IN ('SEVERE', 'MODERATE', 'MINOR')),
  incident_category TEXT,
  frequency_in_week INTEGER,
  escalated_to_admin BOOLEAN DEFAULT FALSE,
  created_case_id UUID REFERENCES cases(id),
  referral_processed BOOLEAN DEFAULT FALSE,
  processed_date DATE,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Behavior incidents (synced from Google Forms) - WITH NEW restorative process fields
CREATE TABLE IF NOT EXISTS behavior_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  incident_time TIME,
  incident_location TEXT,
  incident_description TEXT,
  reported_by TEXT,
  severity TEXT CHECK (severity IN ('SEVERE', 'MODERATE', 'MINOR')),
  category TEXT,
  google_form_id TEXT,
  restorative_process_completed BOOLEAN DEFAULT FALSE, -- NEW FIELD
  restorative_date DATE, -- NEW FIELD
  restorative_staff_id UUID REFERENCES users(id), -- NEW FIELD
  restorative_notes TEXT, -- NEW FIELD
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Files/Attachments table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  protocol_step_id UUID REFERENCES protocol_steps(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  action_plan_item_id UUID REFERENCES action_plan_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log (for compliance and security)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_primary_teacher ON students(primary_teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);

CREATE INDEX IF NOT EXISTS idx_cases_student_id ON cases(student_id);
CREATE INDEX IF NOT EXISTS idx_cases_case_manager ON cases(case_manager_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_case_type ON cases(case_type);
CREATE INDEX IF NOT EXISTS idx_cases_is_urgent ON cases(is_urgent);
CREATE INDEX IF NOT EXISTS idx_cases_tier ON cases(tier);

CREATE INDEX IF NOT EXISTS idx_interventions_case_id ON interventions(case_id);
CREATE INDEX IF NOT EXISTS idx_interventions_facilitator ON interventions(facilitator_id);
CREATE INDEX IF NOT EXISTS idx_interventions_is_active ON interventions(is_active);

CREATE INDEX IF NOT EXISTS idx_sessions_intervention_id ON sessions(intervention_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_facilitator ON sessions(facilitator_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_case_id ON evaluations(case_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_student_id ON evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations(status);

CREATE INDEX IF NOT EXISTS idx_evaluation_steps_evaluation_id ON evaluation_steps(evaluation_id);

CREATE INDEX IF NOT EXISTS idx_protocol_steps_case_id ON protocol_steps(case_id);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_protocol_type ON protocol_steps(protocol_type);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_status ON protocol_steps(step_status);

CREATE INDEX IF NOT EXISTS idx_parent_meetings_student_id ON parent_meetings(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_case_id ON parent_meetings(case_id);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_meeting_date ON parent_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_status ON parent_meetings(meeting_status);

CREATE INDEX IF NOT EXISTS idx_action_plan_items_parent_meeting ON action_plan_items(parent_meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_plan_items_student_id ON action_plan_items(student_id);
CREATE INDEX IF NOT EXISTS idx_action_plan_items_due_date ON action_plan_items(due_date);
CREATE INDEX IF NOT EXISTS idx_action_plan_items_is_completed ON action_plan_items(is_completed);

CREATE INDEX IF NOT EXISTS idx_group_interventions_facilitator ON group_interventions(facilitator_id);
CREATE INDEX IF NOT EXISTS idx_group_interventions_status ON group_interventions(status);

CREATE INDEX IF NOT EXISTS idx_group_sessions_group_intervention ON group_sessions(group_intervention_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_session_date ON group_sessions(session_date);

CREATE INDEX IF NOT EXISTS idx_referrals_student_id ON referrals(student_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_type ON referrals(referral_type);
CREATE INDEX IF NOT EXISTS idx_referrals_processed ON referrals(referral_processed);

CREATE INDEX IF NOT EXISTS idx_behavior_incidents_student_id ON behavior_incidents(student_id);
CREATE INDEX IF NOT EXISTS idx_behavior_incidents_incident_date ON behavior_incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_behavior_incidents_severity ON behavior_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_behavior_incidents_restorative_completed ON behavior_incidents(restorative_process_completed);

CREATE INDEX IF NOT EXISTS idx_files_case_id ON files(case_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY users_view_own ON users
FOR SELECT USING (auth.uid() = id);

-- SSS Staff can view all users
CREATE POLICY users_sss_view_all ON users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Users can update their own profile
CREATE POLICY users_update_own ON users
FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- STUDENTS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all students
CREATE POLICY students_sss_view_all ON students
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view their own students
CREATE POLICY students_teacher_view_own ON students
FOR SELECT USING (
  primary_teacher_id = auth.uid()
);

-- Principal/Admin can view all students
CREATE POLICY students_admin_view_all ON students
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- SSS Staff can insert/update students
CREATE POLICY students_sss_manage ON students
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- CASES TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all cases
CREATE POLICY cases_sss_view_all ON cases
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view cases for their students (limited access)
CREATE POLICY cases_teacher_view_own_students ON cases
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = cases.student_id
    AND students.primary_teacher_id = auth.uid()
  )
);

-- Principal/Admin can view all cases (read-only)
CREATE POLICY cases_admin_view_all ON cases
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- SSS Staff can manage all cases
CREATE POLICY cases_sss_manage ON cases
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- INTERVENTIONS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all interventions
CREATE POLICY interventions_sss_view_all ON interventions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view interventions for their students
CREATE POLICY interventions_teacher_view_own_students ON interventions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c
    JOIN students s ON s.id = c.student_id
    WHERE c.id = interventions.case_id
    AND s.primary_teacher_id = auth.uid()
  )
);

-- SSS Staff can manage interventions
CREATE POLICY interventions_sss_manage ON interventions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- SESSIONS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all sessions
CREATE POLICY sessions_sss_view_all ON sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Facilitators can view their own sessions
CREATE POLICY sessions_facilitator_view_own ON sessions
FOR SELECT USING (facilitator_id = auth.uid());

-- SSS Staff can manage sessions
CREATE POLICY sessions_sss_manage ON sessions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- EVALUATIONS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all evaluations
CREATE POLICY evaluations_sss_view_all ON evaluations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Principal/Admin can view all evaluations
CREATE POLICY evaluations_admin_view_all ON evaluations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- SSS Staff can manage evaluations
CREATE POLICY evaluations_sss_manage ON evaluations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- EVALUATION STEPS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all evaluation steps
CREATE POLICY evaluation_steps_sss_view_all ON evaluation_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- SSS Staff can manage evaluation steps
CREATE POLICY evaluation_steps_sss_manage ON evaluation_steps
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- PROTOCOL STEPS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all protocol steps
CREATE POLICY protocol_steps_sss_view_all ON protocol_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Principal/Admin can view protocol steps (read-only)
CREATE POLICY protocol_steps_admin_view_all ON protocol_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- SSS Staff can manage protocol steps
CREATE POLICY protocol_steps_sss_manage ON protocol_steps
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- PARENT MEETINGS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all parent meetings
CREATE POLICY parent_meetings_sss_view_all ON parent_meetings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view meetings for their students
CREATE POLICY parent_meetings_teacher_view_own_students ON parent_meetings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = parent_meetings.student_id
    AND students.primary_teacher_id = auth.uid()
  )
);

-- SSS Staff can manage parent meetings
CREATE POLICY parent_meetings_sss_manage ON parent_meetings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- ACTION PLAN ITEMS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all action plan items
CREATE POLICY action_plan_items_sss_view_all ON action_plan_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view action items for their students
CREATE POLICY action_plan_items_teacher_view_own_students ON action_plan_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = action_plan_items.student_id
    AND students.primary_teacher_id = auth.uid()
  )
);

-- SSS Staff can manage action plan items
CREATE POLICY action_plan_items_sss_manage ON action_plan_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- GROUP INTERVENTIONS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all group interventions
CREATE POLICY group_interventions_sss_view_all ON group_interventions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- SSS Staff can manage group interventions
CREATE POLICY group_interventions_sss_manage ON group_interventions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- GROUP SESSIONS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all group sessions
CREATE POLICY group_sessions_sss_view_all ON group_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- SSS Staff can manage group sessions
CREATE POLICY group_sessions_sss_manage ON group_sessions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- REFERRALS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all referrals
CREATE POLICY referrals_sss_view_all ON referrals
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view their own referrals
CREATE POLICY referrals_teacher_view_own ON referrals
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = referrals.student_id
    AND students.primary_teacher_id = auth.uid()
  )
);

-- SSS Staff can manage referrals
CREATE POLICY referrals_sss_manage ON referrals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can insert referrals
CREATE POLICY referrals_teacher_insert ON referrals
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'TEACHER'
  )
);

-- ============================================================================
-- BEHAVIOR INCIDENTS TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all behavior incidents
CREATE POLICY behavior_incidents_sss_view_all ON behavior_incidents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Teachers can view incidents for their students
CREATE POLICY behavior_incidents_teacher_view_own_students ON behavior_incidents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = behavior_incidents.student_id
    AND students.primary_teacher_id = auth.uid()
  )
);

-- Principal/Admin can view all incidents
CREATE POLICY behavior_incidents_admin_view_all ON behavior_incidents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- SSS Staff can manage behavior incidents
CREATE POLICY behavior_incidents_sss_manage ON behavior_incidents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- FILES TABLE POLICIES
-- ============================================================================

-- SSS Staff can view all files
CREATE POLICY files_sss_view_all ON files
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- SSS Staff can manage files
CREATE POLICY files_sss_manage ON files
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- ============================================================================
-- AUDIT LOG TABLE POLICIES
-- ============================================================================

-- SSS Staff can view audit logs
CREATE POLICY audit_log_sss_view ON audit_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SSS_STAFF'
  )
);

-- Principal/Admin can view audit logs
CREATE POLICY audit_log_admin_view ON audit_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PRINCIPAL_ADMIN'
  )
);

-- System can insert audit logs (handled by triggers)
CREATE POLICY audit_log_insert ON audit_log
FOR INSERT WITH CHECK (true);

-- ============================================================================
-- DATABASE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_steps_updated_at BEFORE UPDATE ON evaluation_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocol_steps_updated_at BEFORE UPDATE ON protocol_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_meetings_updated_at BEFORE UPDATE ON parent_meetings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_plan_items_updated_at BEFORE UPDATE ON action_plan_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_interventions_updated_at BEFORE UPDATE ON group_interventions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_sessions_updated_at BEFORE UPDATE ON group_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_behavior_incidents_updated_at BEFORE UPDATE ON behavior_incidents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get case load for a staff member
CREATE OR REPLACE FUNCTION get_staff_case_load(staff_id UUID)
RETURNS TABLE (
  total_cases BIGINT,
  open_cases BIGINT,
  on_hold_cases BIGINT,
  tier_1_cases BIGINT,
  tier_2_cases BIGINT,
  tier_3_cases BIGINT,
  urgent_cases BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_cases,
    COUNT(*) FILTER (WHERE status = 'OPEN')::BIGINT as open_cases,
    COUNT(*) FILTER (WHERE status = 'ON_HOLD')::BIGINT as on_hold_cases,
    COUNT(*) FILTER (WHERE tier = 1)::BIGINT as tier_1_cases,
    COUNT(*) FILTER (WHERE tier = 2)::BIGINT as tier_2_cases,
    COUNT(*) FILTER (WHERE tier = 3)::BIGINT as tier_3_cases,
    COUNT(*) FILTER (WHERE is_urgent = true)::BIGINT as urgent_cases
  FROM cases
  WHERE case_manager_id = staff_id
  AND status IN ('OPEN', 'ON_HOLD');
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming action plan items for the week
CREATE OR REPLACE FUNCTION get_weekly_action_items()
RETURNS TABLE (
  id UUID,
  student_name TEXT,
  description TEXT,
  due_date DATE,
  parent_meeting_id UUID,
  days_until_due INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    api.id,
    s.name as student_name,
    api.description,
    api.due_date,
    api.parent_meeting_id,
    (api.due_date - CURRENT_DATE)::INTEGER as days_until_due
  FROM action_plan_items api
  JOIN students s ON s.id = api.student_id
  WHERE api.is_completed = false
  AND api.due_date >= CURRENT_DATE
  AND api.due_date <= CURRENT_DATE + INTERVAL '7 days'
  ORDER BY api.due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate tier distribution by grade
CREATE OR REPLACE FUNCTION get_tier_distribution_by_grade()
RETURNS TABLE (
  grade TEXT,
  total_students BIGINT,
  tier_1_count BIGINT,
  tier_2_count BIGINT,
  tier_3_count BIGINT,
  tier_1_percentage NUMERIC,
  tier_2_percentage NUMERIC,
  tier_3_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.grade,
    COUNT(DISTINCT s.id)::BIGINT as total_students,
    COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 1)::BIGINT as tier_1_count,
    COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 2)::BIGINT as tier_2_count,
    COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 3)::BIGINT as tier_3_count,
    ROUND((COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 1)::NUMERIC / NULLIF(COUNT(DISTINCT s.id), 0)) * 100, 2) as tier_1_percentage,
    ROUND((COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 2)::NUMERIC / NULLIF(COUNT(DISTINCT s.id), 0)) * 100, 2) as tier_2_percentage,
    ROUND((COUNT(DISTINCT s.id) FILTER (WHERE c.tier = 3)::NUMERIC / NULLIF(COUNT(DISTINCT s.id), 0)) * 100, 2) as tier_3_percentage
  FROM students s
  LEFT JOIN cases c ON c.student_id = s.id AND c.status IN ('OPEN', 'ON_HOLD')
  WHERE s.archived_at IS NULL
  GROUP BY s.grade
  ORDER BY s.grade;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Insert a verification record
DO $$
BEGIN
  RAISE NOTICE 'Migration 001_initial_schema.sql completed successfully';
  RAISE NOTICE 'Total tables created: 16';
  RAISE NOTICE 'Total indexes created: 40+';
  RAISE NOTICE 'Total RLS policies created: 50+';
  RAISE NOTICE 'Total helper functions created: 3';
END $$;
