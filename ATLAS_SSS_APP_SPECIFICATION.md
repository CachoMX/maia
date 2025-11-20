# ATLAS ASM Student Support Services Tracking Application
## Complete Technical Specification Document

**Project:** SSS Case & Intervention Management System  
**Organization:** ATLAS American School of Malaga  
**Developer:** Carlos (vixi.agency)  
**Timeline:** MVP by Q1 2026  
**Tech Stack:** Claude Agent SDK, Supabase, React/Next.js, Google Auth, Google Calendar API  
**Current Workflow Owner:** Wendy Aragón (SSS Team Lead)

---

## 1. PROJECT OVERVIEW

### 1.1 Problem Statement
The current SSS (Student Support Services) department at ATLAS ASM manages ~200 students with complex multi-tiered interventions, specialized case protocols (bullying, child protection, conflict resolution), and numerous tracking touchpoints across different systems (Excel, Google Forms, Word docs, Google Drive). This fragmentation creates data silos, reduces real-time visibility, and makes it difficult to track intervention effectiveness.

### 1.2 Solution Scope
Single unified application that consolidates all SSS operations:
- Student case management with multi-tiered support tracking
- Intervention documentation (Academic Support, SEL, Distinctions Programs)
- Protocol-driven workflows (Bullying, Child Protection, Conflict Resolution)
- Referral management (KID Talk meetings, Behavior Incident Reports via Google Forms)
- Parent meeting scheduling & reminders with Google Calendar integration
- Group intervention tracking
- Offline-first capability with sync when online
- Google Drive OAuth authentication

### 1.3 Scale & Users
- **School**: ATLAS ASM (Malaga) — expandable to 2 other schools (different cities)
- **Students**: ~200 active cases (out of 500 total students)
- **SSS Team**: 3 staff members (Wendy Aragón, Lindsey Barlow, Jonica Odom)
- **Users**: SSS Staff, Teachers (referrers), Parents (view-only), Principals/Admin (oversight)
- **School Year**: Continuous (25-26, then annually)

---

## 2. CORE DATA MODEL & ENTITIES

### 2.1 Students
```
Student {
  id: UUID
  name: String
  grade: Enum [PreK, K1, K2, K3, G1, G2, G3, G4, G5, G6, MS, HS]
  dateOfBirth: Date
  studentId: String (school system ID)
  nationality: String
  motherTongue: String
  startDateAtATLAS: Date
  previousSchool: String (optional)
  
  // Relationships
  primaryTeacher: Teacher FK
  parents: Parent[] FK
  
  // Tracking
  createdAt: Timestamp
  updatedAt: Timestamp
  archivedAt: Timestamp (null if active)
}
```

### 2.2 Cases (Main Tracking Entity)
```
Case {
  id: UUID
  studentId: UUID FK
  caseType: Enum [
    ACADEMIC_SUPPORT,     // Tier 1, 2, 3 academic
    SEL,                  // Socio-emotional learning
    DISTINCTIONS,         // Special programs/curricula
    CONFLICT_RESOLUTION,  // Multi-party conflict
    BULLYING,            // Bullying protocol
    CHILD_PROTECTION,    // Child safeguarding
    URGENT              // Crisis/immediate danger
  ]
  
  // Tier system (can be 1, 2, or 3)
  tier: Enum [1, 2, 3]
  canEscalateTier: Boolean (default true)
  
  // Status
  status: Enum [
    OPEN,               // Active case
    ON_HOLD,           // Paused
    CLOSED,            // Completed/resolved
    REFERRED_OUT       // Escalated to external professional
  ]
  
  // Intervention types within this case
  interventionTypes: Enum[] [
    LS,                // Learning Support
    SEL,               // Socio-emotional learning
    COGNITIVE_EST,     // Cognitive estimation/evaluation
    DISTINCTIONS       // Special program
  ]
  
  // Dates
  openedDate: Date
  expectedClosureDate: Date (nullable)
  closedDate: Date (nullable)
  closureReason: String (why was case closed/why referred out)
  
  // Assignment
  caseManagerId: UUID FK (SSS staff)
  secondarySupporters: UUID[] FK (other staff involved)
  
  // Context
  reasonForReferral: Text
  referralSource: Enum [KID_TALK, BEHAVIOR_FORM, SELF, PARENT, ADMIN]
  internalNotes: Text
  
  // Relationships
  interventions: Intervention[] (one case can have many)
  parentMeetings: ParentMeeting[] 
  protocolSteps: ProtocolStep[] (for bullying/safeguarding)
  evaluations: Evaluation[]
  
  // Timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: UUID FK (SSS staff who opened)
}
```

### 2.3 Interventions (Core Tracking for Support)
```
Intervention {
  id: UUID
  caseId: UUID FK
  
  // Type & Tier
  type: Enum [ACADEMIC, SEL, DISTINCTIONS]
  tier: Enum [1, 2, 3]
  
  // Specifics
  interventionName: String (e.g., "1:1 Reading Support", "Assertiveness Group")
  description: Text
  
  // Duration (flexible, not predetermined)
  startDate: Date
  estimatedEndDate: Date (nullable, can be modified)
  actualEndDate: Date (nullable)
  durationWeeks: Number (calculated or manually set)
  
  // Frequency
  frequency: Enum [
    DAILY,
    THREE_TIMES_WEEK,
    TWICE_WEEK,
    ONCE_WEEK,
    TWICE_MONTH,
    MONTHLY,
    AS_NEEDED
  ]
  
  // Delivery
  deliveryFormat: Enum [ONE_ON_ONE, SMALL_GROUP, WHOLE_CLASS]
  facilitator: UUID FK (SSS staff member)
  location: String (optional)
  
  // Sessions Tracking
  sessions: Session[] (one intervention has many sessions)
  
  // Status
  isActive: Boolean
  reasonForEnding: Enum [
    COMPLETED_SUCCESSFULLY,
    INEFFECTIVE_CHANGING_STRATEGY,
    ESCALATED_TO_EVALUATION,
    STUDENT_REFERRED_OUT,
    BEHAVIOR_ESCALATION,
    TIME_ENDED,
    OTHER
  ]
  
  // Progress
  isEscalatableTier: Boolean (can move from T1→T2, etc)
  escalatedFromIntervention: UUID FK (optional, links to previous T1/T2)
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.4 Sessions (Daily/Regular Contact Points)
```
Session {
  id: UUID
  interventionId: UUID FK
  
  // Occurrence
  sessionDate: Date
  sessionTime: Time (optional)
  duration: Integer (minutes)
  
  // Who was there
  facilitatorId: UUID FK (SSS staff)
  studentAttended: Boolean
  studentNotes: Text (student self-assessment/perception)
  
  // Documentation
  observationNotes: Text (what facilitator observed)
  studentProgress: Text (specific progress made)
  challenges: Text (what didn't work)
  teacherFeedback: Text (from classroom teacher)
  
  // Attachments
  attachments: File[] (documents, videos, photos)
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.5 Evaluations/Screenings
```
Evaluation {
  id: UUID
  caseId: UUID FK
  studentId: UUID FK
  
  // Type
  evaluationType: Enum [
    OBSERVATION,        // Informal observation
    SNAP_SpLD,         // Learning difficulties screening
    SNAP_B,            // Behavior screening
    SNAP_MATH,         // Math screening
    LEARNING_PROFILE   // General learning profile
  ]
  
  // Workflow Steps
  steps: EvaluationStep[] {
    stepType: Enum [
      PARENT_CONSENT,           // Step 1: Get parent signature
      FAMILY_QUESTIONNAIRE,     // Step 2: Send to families
      TEACHER_QUESTIONNAIRE,    // Step 2b: Send to teachers
      STUDENT_TESTING,          // Step 3: Administer tests
      DATA_TRIANGULATION,       // Step 4: Synthesize findings
      GENERATE_REPORT,          // Step 5: Create report
      REVIEW_WITH_STAKEHOLDERS  // Step 5b: Meet with team
    ]
    completedDate: Date (nullable)
    completedBy: UUID FK
    notes: Text
  }
  
  // Results
  status: Enum [PENDING, IN_PROGRESS, COMPLETED, AWAITING_REVIEW]
  reportUrl: String (link to downloadable report - may be Windows-only for now)
  keyFindings: Text
  recommendedInterventions: Intervention[] (auto-generated but can be modified)
  
  // Consent & Dates
  parentConsentDate: Date (nullable)
  parentConsentSignature: URL (image)
  evaluationStartDate: Date
  evaluationCompleteDate: Date (nullable)
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.6 Protocol Steps (for Bullying, Child Protection, Conflict Resolution)
```
ProtocolStep {
  id: UUID
  caseId: UUID FK
  
  // Which protocol
  protocolType: Enum [BULLYING, CHILD_PROTECTION, CONFLICT_RESOLUTION]
  
  // Steps (different per protocol)
  stepSequence: Integer (1, 2, 3, etc.)
  stepType: String (e.g., "Investigation", "Parent Notification", "Action Plan")
  
  // Tracking
  stepStatus: Enum [PENDING, IN_PROGRESS, COMPLETED, BLOCKED]
  startDate: Date
  completedDate: Date (nullable)
  dueDate: Date
  
  // Responsibility
  assignedTo: UUID FK (SSS staff or admin)
  
  // Documentation
  stepDescription: Text
  findings: Text
  decisions: Text
  nextStep: String
  
  // Attachments
  attachments: File[] (documents, forms, evidence)
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.7 Parent Meetings
```
ParentMeeting {
  id: UUID
  studentId: UUID FK
  caseId: UUID FK (nullable, can be general or case-specific)
  
  // Meeting Details
  meetingDate: Date
  meetingTime: Time
  
  // Attendees
  parentIds: UUID[] FK
  sssStaffId: UUID FK (who from SSS attended)
  teacherIds: UUID[] FK (optional)
  adminId: UUID FK (optional)
  
  // Organization
  isScheduled: Boolean
  googleCalendarEventId: String (to sync with Google Calendar)
  
  // Documentation
  agenda: Text (brief, detailed notes stored in external Word doc)
  agendaLink: URL (link to external document where detailed notes live)
  
  // Follow-up
  nextSteps: Text
  nextMeetingDate: Date (nullable)
  reminderSent: Boolean
  reminderSentDate: Date (nullable)
  
  // Frequencies
  frequency: String (e.g., "weekly", "bi-weekly", "as-needed")
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.8 Group Interventions
```
GroupIntervention {
  id: UUID
  
  // Details
  groupName: String
  description: Text
  
  // Composition
  students: Student[] FK
  facilitatorId: UUID FK (SSS staff member)
  facilitatorName: String (denormalized for quick display)
  
  // Scope
  interventionType: Enum [ACADEMIC, SEL, DISTINCTIONS]
  tier: Enum [1, 2, 3]
  
  // Scheduling
  startDate: Date
  estimatedEndDate: Date (nullable)
  frequency: Enum [DAILY, TWICE_WEEK, ONCE_WEEK, etc.]
  
  // Sessions
  sessions: GroupSession[] {
    sessionDate: Date
    topic: String
    attendees: Student[] (which students attended)
    notes: Text
    attachments: File[]
  }
  
  // Overall outcome
  status: Enum [ACTIVE, COMPLETED, ON_HOLD]
  outcomes: Text
  
  timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.9 Referrals (KID Talk & Behavior Forms)
```
Referral {
  id: UUID
  studentId: UUID FK
  
  // Type of referral
  referralType: Enum [KID_TALK, BEHAVIOR_INCIDENT_FORM]
  
  // For KID TALK
  // This creates a Case with all initial data
  kidTalkDate: Date
  kidTalkAttendees: String[] (teacher names)
  kidTalkNotes: Text
  kidTalkAgenda: Text
  
  // For BEHAVIOR INCIDENT FORM
  // Submitted via Google Form, auto-populated
  incidentDate: Date
  incidentTime: Time
  incidentLocation: String
  incidentDescription: Text
  reportedBy: String (teacher)
  incidentSeverity: Enum [MINOR, MODERATE, SEVERE]
  incidentCategory: Enum [BEHAVIOR, SAFETY, ACADEMIC, SOCIAL, OTHER]
  
  // Frequency tracking (for behavior forms)
  frequencyInWeek: Integer (auto-calculated from Google Forms submissions)
  escalatedToAdmin: Boolean
  
  // Connection to SSS
  createdCase: UUID FK (case generated from referral, nullable)
  
  timestamps
  createdAt: Timestamp
  referredToSSS: Boolean
  referralProcessed: Boolean
}
```

### 2.10 Users & Roles
```
User {
  id: UUID
  email: String (unique)
  googleId: String (for OAuth)
  
  // Profile
  firstName: String
  lastName: String
  role: Enum [SSS_STAFF, TEACHER, PARENT, PRINCIPAL_ADMIN]
  
  // School affiliation
  schoolId: UUID FK
  
  // For SSS Staff
  sssPosition: Enum [LEAD, COUNSELOR, SUPPORT_SPECIALIST] (nullable if not SSS)
  
  // Permissions (role-based)
  canCreateCase: Boolean
  canEditCase: Boolean
  canViewAllCases: Boolean (SSS staff only)
  canViewOwnCases: Boolean (case manager)
  canScheduleMeetings: Boolean
  canDocumentInterventions: Boolean
  
  timestamps
  createdAt: Timestamp
  lastLogin: Timestamp
}
```

---

## 3. WORKFLOW SPECIFICATIONS

### 3.1 Learning Support Process (Tier 1 → Tier 3)

```
PHASE 1: CLASSROOM STRATEGIES (Tier 1)
├─ Recognition: Teacher/Parent/Student identifies concern
├─ Data Gathering: Surveys, learner profile assessment
├─ SST (Student Support Team) Meeting:
│  ├─ Data sharing
│  ├─ Identify classroom interventions
│  ├─ Trial & Review plan
│  └─ [EFFECTIVE] → Document & Continue
│  └─ [INEFFECTIVE] → Move to Phase 2

PHASE 2: INTERVENTIONS (Tier 2)
├─ Intervention Implementation
├─ Notify Parents
├─ Trial & Review
├─ [EFFECTIVE] → Document & Continue OR Move to Phase 1
└─ [INEFFECTIVE] → Move to Phase 3

PHASE 3: DIAGNOSTIC PHASE (Moving to Tier 3)
├─ Parent Permission (signed consent)
├─ Assessment (internal or external evaluation)
├─ Review assessment results with stakeholders
├─ [INEFFECTIVE] → Interventions needed + Parent meeting
└─ [EFFECTIVE] → ILP or Accommodation Plan created + Parent meeting

PHASE 4: INDIVIDUAL LEARNING PLAN or ACCOMMODATION PLAN (Tier 3)
├─ ILP - Active Support or Accommodation Plan - Monitoring
├─ Yearly Review: ILP, Accommodations Plan
├─ 3-year Re-evaluation
└─ Continue active support or exit

PHASE 5: TRACKING
├─ Track for continued need for Classroom Strategies
├─ One year post-dismissal to ensure maintains success
└─ EXIT (case closed)
```

### 3.2 Bullying Protocol Workflow

**ATLAS ASM Anti-Bullying Action Guide Steps:**

```
STEP 1: COMMUNICATION & IMMEDIATE ACTION
├─ Date of communication to school management
├─ Agreement to apply protocol and adopt immediate measures
└─ Constitution of Assessment & Action Planning Team

STEP 2: INVESTIGATION
├─ Origin of claim documented
├─ Description of situation
├─ Documentation collected:
│  ├─ Injury reports
│  ├─ Psychological reports
│  ├─ Previous incidents
│  ├─ Complaints
│  └─ Guardian's reports
└─ Actions carried out:
   ├─ Interviews with students involved
   ├─ Recording of observations
   └─ Communication with relevant parties

STEP 3: ASSESSMENT OF BULLYING CHARACTERISTICS
├─ Type of harassment classification:
│  ├─ VERBAL (insults, disqualifications, threats, teasing, etc.)
│  ├─ PHYSICAL (assaults, damage, theft)
│  ├─ SOCIAL/RELATIONAL (exclusion, gossip, betrayal)
│  ├─ SEXUAL (sexual comments, unwanted behaviors)
│  └─ CYBERBULLYING (digital forms)
│
├─ Information sources:
│  ├─ Student victim
│  ├─ Families
│  ├─ Other students
│  ├─ Professionals
│  └─ Documented facts
│
├─ Defining characteristics assessment:
│  ├─ Inequality (imbalance of power)
│  ├─ Recurrence (repetition of behaviors)
│  ├─ Intentionality (intent to harm)
│  └─ Vulnerability of victim (lack of defenses)
│
├─ Special considerations:
│  ├─ Previous harassment situations
│  ├─ Suicidal ideation references
│  ├─ Self-injury history
│  ├─ Medical assistance required/injury report
│  ├─ Police/Guardia Civil complaint
│  ├─ Family assistance requests
│  ├─ Victim association involvement
│  ├─ Family willingness to cooperate
│  └─ Other schools involvement
│
└─ Other students involved: YES / NO

STEP 4: CONCLUSIONS (Three possible outcomes)
├─ OUTCOME 1: Situation NOT compatible with bullying characteristics
│  └─ → Initiate Behavior Contract per Behavior Policy
│
├─ OUTCOME 2: Behaviors contrary to coexistence (but not bullying)
│  └─ → Behavior Correction Procedure initiated
│
└─ OUTCOME 3: Situation IS compatible with bullying
   └─ → Initiate CORRECTIVE PROCEDURE

STEP 5: ACTIONS TAKEN (6 action categories)
├─ ☐ Investigation (thorough, interviews with students)
├─ ☐ Support for the Victim:
│  ├─ Counseling & emotional support
│  ├─ Peer support & inclusion
│  ├─ Restorative justice
│  ├─ Safety planning
│  ├─ Assertiveness training
│  └─ Coping skills
├─ ☐ Disciplinary Measures (per Behavior Policy)
├─ ☐ Support for the Aggressor:
│  ├─ Counseling & emotional support
│  ├─ Social skills teaching
│  ├─ Empathy development
│  ├─ Restorative justice
│  ├─ Clear consequences
│  └─ Positive peer relationships
├─ ☐ Awareness & Prevention:
│  ├─ Classroom discussions
│  └─ Workshops
└─ ☐ Communication with Parents/Guardians:
   ├─ Victim parents (date: __)
   └─ Aggressor parents (date: __)

STEP 6: CASE FOLLOW-UP PLANNING
├─ Persons responsible for follow-up:
│  ├─ [Name] - [Position]
│  ├─ [Name] - [Position]
│  └─ [Name] - [Position]
├─ Observations from victim's parents
└─ Common Corrective Procedure initiated (YES/NO)
    └─ If YES, date: __

STEP 7: CLOSURE & NOTIFICATION
├─ Document confirms protocol compliance
├─ Legal framework compliance (Junta de Andalucía)
├─ Action plan prevents future occurrences
└─ Continue monitoring as needed
```

### 3.3 Child Safeguarding Protocol Workflow

```
STEP 1: INITIAL CONCERN REPORTING
├─ FIRST ADULT reports concern
├─ Form: Child Safeguarding Cause for Concern Form
├─ Fields captured:
│  ├─ Student name & grade
│  ├─ Date & time of concern
│  ├─ Account of concern (what was observed/reported)
│  ├─ Additional information (context, opinion)
│  ├─ Reporter name, signature, position
│  └─ Date & time of recording
└─ [AUTOMATICALLY ESCALATES to CSRT member/Headteacher]

STEP 2: CSRT (Child Safeguarding Response Team) INITIAL ASSESSMENT
├─ CSRT member reviews concern form
├─ Action & response documented
├─ Feedback given to reporting staff member
├─ Information sharing decision made:
│  ├─ What information was shared?
│  └─ Rationale for sharing?
└─ Decision: [PROCEED TO INVESTIGATION] or [MONITOR ONLY] or [NO ACTION]

STEP 3: INVESTIGATION & INFORMATION GATHERING
├─ Gather additional documentation:
│  ├─ Previous reports on student
│  ├─ Family history
│  ├─ School records
│  ├─ Interviews with relevant staff
│  └─ Student observation/interview (if appropriate)
│
└─ Information recorded in case file

STEP 4: CSRT FULL TEAM MEETING
├─ All information reviewed
├─ Risk assessment conducted
├─ Decision made:
│  ├─ OPTION A: Internal support plan only
│  ├─ OPTION B: Family meeting + internal support plan
│  ├─ OPTION C: Notification to external authorities (mandatory)
│  └─ OPTION D: Immediate escalation (immediate danger)
│
└─ Action plan established

STEP 5: FAMILY & AUTHORITY NOTIFICATION (if needed)
├─ [If OPTION B] Family meeting scheduled & held
│  └─ Document what was shared, date, signatures
│
├─ [If OPTION C] Notification to external authorities:
│  ├─ Policia Local
│  ├─ Guardia Civil
│  ├─ Junta de Andalucía
│  ├─ Social Services
│  └─ Notify parents (unless contraindicated for safety)
│
└─ All notifications documented with date, person contacted, details shared

STEP 6: ONGOING MONITORING & SUPPORT
├─ Daily check-ins (if needed)
├─ Safety measures implemented for student
├─ Regular CSRT check-ins (weekly/bi-weekly)
├─ Documentation of all observations
└─ Case review date scheduled

STEP 7: CASE CLOSURE OR CONTINUED MONITORING
├─ [If resolved internally] → Case closure documented
├─ [If external authorities involved] → Follow investigation outcomes
└─ One-year follow-up post-closure to ensure safety maintained
```

### 3.4 Referral Process (KID Talk)

```
TEACHER/ADMIN INITIATES KID TALK MEETING
│
├─ Meeting scheduled with SSS team
├─ Attendees: Teacher, SSS staff (usually Wendy Aragón)
├─ Meeting type: First meeting (opens case) or Follow-up (monitoring)
│
└─ IF FIRST MEETING:
   │
   ├─ Data discussed:
   │  ├─ Student strengths
   │  ├─ Student challenges
   │  ├─ Classroom strategies already tried
   │  ├─ Communication with parents/specialists
   │  ├─ Academic levels, language proficiency
   │  └─ History of support (EAL, Behavioral, Academic)
   │
   ├─ SSS Team decides:
   │  ├─ Tier level (1, 2, or 3)
   │  ├─ Intervention type(s) (LS, SEL, Distinctions)
   │  ├─ Action plan & next steps
   │  ├─ Case manager assigned
   │  └─ Follow-up timeline
   │
   ├─ CASE CREATED in app with:
   │  ├─ Student info
   │  ├─ Referral source: KID_TALK
   │  ├─ Case manager assigned
   │  ├─ Reason for referral documented
   │  └─ Initial intervention plan drafted
   │
   └─ IF FOLLOW-UP MEETING:
      │
      ├─ Progress reviewed:
      │  ├─ Student observations
      │  ├─ Teacher feedback
      │  ├─ Intervention effectiveness
      │  └─ Any challenges
      │
      └─ Next steps:
         ├─ Continue current intervention
         ├─ Modify intervention
         ├─ Escalate to next tier
         └─ Close case
```

### 3.5 Behavior Incident Report Process

```
TEACHER submits BEHAVIOR INCIDENT FORM (Google Form)
│
├─ Form auto-populated with:
│  ├─ Date & time of incident
│  ├─ Student name
│  ├─ Location
│  ├─ Incident description
│  ├─ Reported by (teacher)
│  ├─ Severity (minor/moderate/severe)
│  └─ Category (behavior/safety/academic/social/other)
│
├─ WENDY ARAGÓN reviews form
├─ Frequency tracking: COUNT incidents per student per week
│
└─ IF frequency ≥ multiple per week:
   │
   ├─ ESCALATE to Principal/Director
   ├─ [POSSIBLY] Behavior Plan initiated
   └─ [POSSIBLY] Create SSS Case (if not already open)
      │
      └─ Linked to Behavior Incident Reports showing pattern
```

---

## 4. USER INTERFACE & DASHBOARD REQUIREMENTS

### 4.1 Main Dashboard (SSS Staff View)

```
PRIORITY VIEW (Top Section)
├─ URGENT CASES (red badge):
│  ├─ Child Protection cases
│  ├─ Conflict Resolution (active)
│  ├─ Bullying cases
│  └─ Cases with pending protocol steps due today
│
├─ OVERDUE ITEMS (orange badge):
│  ├─ Overdue parent meetings
│  ├─ Pending follow-ups
│  └─ Evaluation steps not completed
│
└─ TODAY'S SCHEDULE:
   ├─ Scheduled sessions
   ├─ Parent meetings (with reminders)
   └─ Protocol step due dates

MAIN GRID VIEW
├─ Filterable student list:
│  ├─ Grade filter
│  ├─ Status filter (OPEN, ON_HOLD, CLOSED)
│  ├─ Case type filter (ACADEMIC, SEL, BULLYING, etc.)
│  ├─ Assigned to filter (case manager)
│  └─ Search by student name
│
└─ Column headers:
   ├─ Student name
   ├─ Grade
   ├─ Case type(s)
   ├─ Tier level
   ├─ Status
   ├─ Case manager
   ├─ Opened date
   ├─ Expected close date
   ├─ Last session date
   └─ Days since last documentation
```

### 4.2 Student Case Detail View

```
LEFT PANEL: Case Overview
├─ Student photo (optional)
├─ Student name, grade, age
├─ Teachers
├─ Active case types
├─ Case status
├─ Case manager
├─ Opened date / Expected close date
└─ Quick actions (edit, close, escalate)

TABS:
├─ CASE INFO
│  ├─ Reason for referral
│  ├─ Referral source (KID_TALK, BEHAVIOR_FORM, etc.)
│  ├─ Case history/timeline
│  ├─ Internal notes
│  └─ Case documents/attachments
│
├─ INTERVENTIONS
│  ├─ List of all current/past interventions
│  ├─ For each intervention:
│  │  ├─ Type (LS, SEL, Distinctions)
│  │  ├─ Tier
│  │  ├─ Frequency
│  │  ├─ Facilitator
│  │  ├─ Start date / End date
│  │  ├─ Status
│  │  ├─ Sessions count
│  │  └─ [VIEW SESSIONS] link
│  │
│  └─ [+ NEW INTERVENTION] button
│
├─ SESSIONS
│  ├─ All sessions for all active interventions
│  ├─ Filter by intervention
│  ├─ Session date, facilitator, notes preview
│  └─ [+ NEW SESSION] button
│
├─ EVALUATIONS
│  ├─ List of all evaluations/screenings
│  ├─ For each evaluation:
│  │  ├─ Type (SNAP, observation, etc.)
│  │  ├─ Status (pending, in progress, completed)
│  │  ├─ Steps completed (visual checklist)
│  │  ├─ Report link (if available)
│  │  └─ Key findings summary
│  │
│  └─ [+ NEW EVALUATION] button
│
├─ PARENT MEETINGS
│  ├─ Calendar view or list view
│  ├─ For each meeting:
│  │  ├─ Date / Attendees
│  │  ├─ Agenda link (external doc)
│  │  ├─ Next meeting scheduled
│  │  └─ [SEND REMINDER] button
│  │
│  └─ [+ SCHEDULE MEETING] button (Google Calendar integration)
│
├─ PROTOCOLS (if applicable)
│  ├─ Show protocol type (Bullying, Child Protection, etc.)
│  ├─ Visual timeline of protocol steps
│  ├─ For each step:
│  │  ├─ Step name
│  │  ├─ Status (pending, in progress, completed)
│  │  ├─ Assigned to
│  │  ├─ Due date
│  │  ├─ Documentation notes
│  │  └─ Attachments
│  │
│  └─ [ADVANCE STEP] button (when completed)
│
├─ BEHAVIOR INCIDENTS (if applicable)
│  ├─ Link to Google Forms data
│  ├─ Incidents list with frequency
│  ├─ Date, reported by, severity
│  └─ Escalation notes (if escalated to admin)
│
└─ GROUP INTERVENTIONS
   ├─ List of groups student is in
   ├─ Group name, facilitator, frequency
   └─ Link to group details
```

### 4.3 Group Intervention Management

```
GROUP LISTING VIEW
├─ Filter by grade, type, facilitator
├─ Card view showing:
│  ├─ Group name
│  ├─ Facilitator
│  ├─ Members count
│  ├─ Type (Academic, SEL, etc.)
│  ├─ Frequency
│  ├─ Status
│  └─ [VIEW DETAILS]

GROUP DETAIL VIEW
├─ Group overview
├─ Members list (student names, grades)
├─ Session schedule
├─ SESSIONS TAB:
│  ├─ All sessions with dates, topics
│  ├─ Attendance by session
│  ├─ Session notes & outcomes
│  └─ [+ NEW SESSION] button
│
└─ OUTCOMES
   └─ Overall group outcomes/learning
```

### 4.4 Behavior Incident Dashboard

```
BEHAVIOR INCIDENT TRACKER
├─ Real-time sync from Google Forms
├─ Student frequency view:
│  ├─ Incidents this week
│  ├─ Incidents this month
│  ├─ Trend (↑ increasing, → stable, ↓ improving)
│  └─ Alert threshold (≥2/week = escalate to admin)
│
├─ Incident list with:
│  ├─ Date, student, teacher
│  ├─ Severity badge
│  ├─ Brief description
│  └─ Escalation status
│
└─ [SEND TO PRINCIPAL] button (auto-populate escalation doc)
```

### 4.5 Parent/Guardian View

```
LIMITED DASHBOARD
├─ Children's overview (basic info only)
├─ Upcoming parent meetings
├─ General progress notes (non-confidential)
└─ [CONTACT SSS TEAM] button (email)

NOT VISIBLE:
├─ Other students' data
├─ Detailed case information
├─ Internal SSS notes
├─ Protocol steps/documentation
└─ Assessment results (unless explicitly shared)
```

### 4.6 Teacher View

```
MY STUDENTS DASHBOARD
├─ Filter to own class roster
├─ Quick status of each student in SSS:
│  ├─ If case open, show:
│  │  ├─ Case manager
│  │  ├─ Intervention types
│  │  ├─ Session frequency
│  │  └─ Last session date
│  │
│  └─ If no case, show: "No active SSS support"
│
├─ [SUBMIT BEHAVIOR INCIDENT FORM] (links to Google Form)
├─ [REQUEST KID TALK] (sends message to Wendy Aragón)
└─ [VIEW FEEDBACK] (SSS progress notes, not case details)
```

### 4.7 Principal/Admin View

```
SCHOOL-WIDE OVERVIEW
├─ Case statistics:
│  ├─ Total active cases
│  ├─ By grade
│  ├─ By case type
│  ├─ By tier distribution
│  └─ Cases closed this month
│
├─ URGENT CASES tab (same priority alerts)
├─ Referral patterns (KID_TALK vs BEHAVIOR_FORM trends)
├─ Incident escalation log
├─ Parent meeting schedule (to coordinate)
│
└─ REPORTS:
   ├─ Monthly SSS report
   ├─ Cases by intervention type
   └─ Student outcome report (aggregated)
```

---

## 5. SPECIFIC FEATURES & INTEGRATIONS

### 5.1 Google Calendar Integration (Parent Meetings)

```
FUNCTIONALITY:
├─ When parent meeting created:
│  ├─ Automatically create Google Calendar event
│  ├─ Add all attendees (parents, SSS staff, teachers)
│  ├─ Include Zoom/location link (optional)
│  ├─ Set reminder (1 day before)
│  └─ Update Wendy Aragón's calendar
│
├─ When date changed:
│  └─ Auto-update Google Calendar event
│
├─ Reminder emails sent:
│  ├─ To parents: 1 day before + 1 hour before
│  └─ To SSS staff: morning of
│
└─ Post-meeting:
   └─ Link to external notes document (Word) stored in Google Drive
```

### 5.2 Google Forms Integration (Behavior Incident Reports)

```
FUNCTIONALITY:
├─ Form responses auto-sync to app daily
├─ Parse fields:
│  ├─ Student name (match to database)
│  ├─ Date & time
│  ├─ Incident description
│  ├─ Reported by (teacher)
│  ├─ Severity
│  └─ Category
│
├─ Create Referral record in app
├─ Track frequency per student
├─ Frequency ≥ 2/week = Auto-escalation flag
│
└─ SSS staff view:
   ├─ Dashboard of incidents
   ├─ Filter by student
   ├─ View frequency trend
   └─ Mark as "escalated to admin"
```

### 5.3 Google Drive OAuth & File Linking

```
FUNCTIONALITY:
├─ Login via Google Drive OAuth
├─ File attachment capability:
│  ├─ For case documents
│  ├─ For session notes (optional)
│  ├─ For protocol documentation
│  ├─ For evaluation reports
│  └─ Files auto-stored in ATLAS SSS folder structure
│
├─ Links to external docs:
│  ├─ Parent meeting notes (Word doc)
│  ├─ Detailed case history (Google Docs)
│  └─ Evaluation reports (PDFs)
│
└─ Access control:
   └─ Only SSS staff + assigned case manager can view files
```

### 5.4 Offline-First Capability

```
TECHNOLOGY:
├─ Use Service Workers (PWA)
├─ Local IndexedDB storage
├─ Sync when connectivity restored
│
FUNCTIONALITY:
├─ Work completely offline:
│  ├─ View all previously loaded data
│  ├─ Create/edit new sessions
│  ├─ Add notes to cases
│  ├─ Update intervention status
│  └─ (Minimal form-filling work)
│
├─ When online:
│  ├─ Auto-sync all local changes
│  ├─ Download updated data
│  ├─ Alert user if conflicts
│  └─ Re-enable Google integrations
│
└─ Data persistence:
   └─ All changes saved locally, queued for upload
```

### 5.5 Claude Agent SDK Integration Points

```
AI-POWERED FEATURES:
├─ Session note auto-summarization:
│  ├─ Transcribe voice notes → text
│  ├─ Extract key points
│  ├─ Suggest intervention adjustments
│  └─ Flag concerns for escalation
│
├─ Referral analysis:
│  ├─ When behavior form submitted, Claude analyzes pattern
│  ├─ Suggests tier level for new case
│  ├─ Identifies if escalation needed
│  └─ Recommends intervention types
│
├─ Protocol guidance:
│  ├─ When step marked complete, Claude suggests next step
│  ├─ Ensures nothing is missed
│  └─ Prompts for required documentation
│
├─ Parent meeting notes synthesis:
│  ├─ Extract action items from external notes doc
│  ├─ Generate next steps summary
│  └─ Auto-populate follow-up tasks
│
├─ Report generation:
│  ├─ Monthly student progress summaries
│  ├─ Intervention effectiveness analysis
│  ├─ Case closure documentation
│  └─ Admin reports with trends
│
└─ Smart alerts:
   ├─ Escalate based on session notes patterns
   ├─ Flag overdue documentation
   ├─ Suggest case closure when appropriate
   └─ Warn of protocol step delays
```

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Tech Stack

```
FRONTEND:
├─ React 18 + Next.js 14
├─ TypeScript
├─ Tailwind CSS + shadcn/ui
├─ React Query (data fetching)
├─ Zustand (state management)
├─ date-fns (date handling)
├─ react-big-calendar (calendar views)
└─ Workbox (PWA/offline support)

BACKEND:
├─ Supabase (PostgreSQL + Auth + Real-time)
├─ Edge Functions (for Google API integrations)
├─ Claude API (via Agent SDK)
└─ Node.js helpers

INTEGRATIONS:
├─ Google OAuth 2.0 (authentication)
├─ Google Calendar API
├─ Google Forms API (via Zapier alternative or custom)
├─ Google Drive API (file storage)
└─ Claude API for Agent SDK

DEPLOYMENT:
├─ Vercel (frontend)
├─ Supabase (backend/database)
└─ Service Workers (offline)
```

### 6.2 Database Schema (Supabase)

```
TABLES:
├─ users
├─ students
├─ cases
├─ interventions
├─ sessions
├─ evaluations
├─ evaluation_steps
├─ protocol_steps
├─ parent_meetings
├─ group_interventions
├─ group_intervention_students
├─ group_sessions
├─ referrals
├─ behavior_incidents (synced from Google Forms)
├─ files (attachments)
└─ audit_log (for compliance/tracking who changed what)

INDEXES:
├─ student_id (on cases, interventions, evaluations)
├─ case_id (on sessions, protocol_steps)
├─ user_id (on cases as case_manager)
├─ case_type (for filtering)
├─ status (for filtering)
└─ created_at (for chronological views)
```

### 6.3 API Endpoints (Claude Agent SDK)

```
AGENTS TO BUILD:
├─ CaseManagementAgent
│  ├─ Create/update/close cases
│  ├─ Analyze referral data
│  └─ Generate recommendations
│
├─ InterventionAgent
│  ├─ Track session effectiveness
│  ├─ Suggest modifications
│  └─ Recommend escalation
│
├─ ProtocolAgent
│  ├─ Guide protocol steps
│  ├─ Ensure completeness
│  └─ Generate documentation
│
├─ ReportingAgent
│  ├─ Generate summaries
│  ├─ Trend analysis
│  └─ Admin reports
│
└─ AlertAgent
   ├─ Flag escalations
   ├─ Identify overdue items
   └─ Suggest interventions
```

---

## 7. PRIORITY FEATURE ROADMAP

### Phase 1 (MVP - December 2025 - January 2026)
```
MUST HAVE:
├─ Student profiles
├─ Case creation & management
├─ Intervention tracking (basic)
├─ Session documentation
├─ Status dashboard
├─ Google OAuth login
└─ Basic role-based access

NICE TO HAVE:
├─ Google Calendar sync (basic)
└─ Behavior incident form (manual entry)
```

### Phase 2 (Core Features - February 2026)
```
MUST HAVE:
├─ Full protocol step tracking (Bullying, Child Protection)
├─ Parent meeting scheduling + Google Calendar
├─ Evaluation management with step tracking
├─ Behavior incident sync from Google Forms
├─ Group intervention management
└─ Offline capability (PWA)

NICE TO HAVE:
├─ Claude Agent summary generation
└─ Basic reporting
```

### Phase 3 (Advanced - March+ 2026)
```
├─ Full Claude Agent SDK integration
├─ Smart alerts & escalation
├─ Advanced reporting & analytics
├─ Parent portal (limited view)
├─ Multi-school support
└─ Mobile app (React Native)
```

---

## 8. SECURITY & COMPLIANCE

### 8.1 Data Protection
```
├─ GDPR compliance (EU data protection)
├─ Spain education data laws
├─ Child safeguarding protocols (enhanced access controls)
├─ Two-factor authentication (admin/SSS staff)
├─ End-to-end encryption for sensitive fields
├─ Audit logging of all case access
└─ Automatic data anonymization for exports
```

### 8.2 Access Control
```
├─ Role-based permissions (SSS, Teacher, Parent, Admin)
├─ Case-level access (case manager + assigned supporters only)
├─ Protocol cases (Child Protection) = restricted access
├─ Parent access = only own child's non-sensitive info
└─ Admin access = full visibility + delete permissions
```

---

## 9. QUESTIONS CLARIFICATION (Answers from Wendy)

1. **Tier escalation**: Cases CAN escalate (Tier 1→2→3) ✓
2. **Intervention flexibility**: Flexible duration (not predetermined) ✓
3. **Evaluation types**: SNAP_SpLD, SNAP_B, SNAP_Math, Observations ✓
4. **Evaluation auto-generates recommendations**: YES, but can be modified ✓
5. **KID Talk frequency**: Ad-hoc, opens case on first meeting ✓
6. **Behavior Form usage**: Track frequency, multiple per week = escalate ✓
7. **Protocol steps**: Each has date, responsible person, observations ✓
8. **Parent meeting docs**: External Word docs with links in app ✓
9. **Case closure reasons**: Multiple (time ended, improved, escalated to external, expelled, etc.) ✓
10. **Offline access**: YES, needed due to internet instability ✓
11. **Google Drive login**: YES, via OAuth ✓
12. **Language**: English (American) ✓

---

## 10. NEXT STEPS FOR DEVELOPMENT

```
1. ✓ GET CLARIFICATION (this document)
2. → CREATE SUPABASE SCHEMA (tables, relationships, RLS policies)
3. → SET UP NEXT.JS PROJECT with TypeScript
4. → BUILD DATA MODELS (TypeScript types from schema)
5. → CREATE FORM COMPONENTS (case creation, intervention, etc.)
6. → INTEGRATE GOOGLE OAUTH
7. → BUILD DASHBOARD & FILTERING
8. → ADD GOOGLE CALENDAR SYNC
9. → IMPLEMENT OFFLINE SUPPORT (Service Worker)
10. → INTEGRATE CLAUDE AGENT SDK (starting with one agent)
11. → BUILD BEHAVIOR INCIDENT FORM SYNC
12. → TESTING & ITERATION
13. → DEPLOY TO VERCEL
14. → TRAIN WENDY & TEAM
15. → GATHER FEEDBACK & ITERATE
```

---

**Document prepared for:** Carlos (vixi.agency)  
**For:** Wendy Aragón, ATLAS ASM SSS Department  
**Last updated:** November 18, 2025
