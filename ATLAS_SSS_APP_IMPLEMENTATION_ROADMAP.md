# ATLAS ASM SSS App - Claude Agent SDK Implementation Roadmap

---

## PHASE 1: PROJECT SETUP (Week 1)

### Step 1.1: Initialize Next.js Project
```bash
# Create project
npx create-next-app@latest atlas-sss --typescript --tailwind

# Install dependencies
cd atlas-sss
npm install @anthropic-ai/sdk supabase @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install react-query zustand date-fns react-big-calendar
npm install google-auth-library googleapis
npm install workbox-build workbox-window

# Set up environment variables
# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# ANTHROPIC_API_KEY=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

### Step 1.2: Supabase Schema Setup

**Create tables in Supabase:**

```sql
-- Users table (extends Supabase auth)
CREATE TABLE users (
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
CREATE TABLE students (
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

-- Cases table (main case management)
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  case_type TEXT NOT NULL CHECK (case_type IN ('ACADEMIC_SUPPORT', 'SEL', 'DISTINCTIONS', 'CONFLICT_RESOLUTION', 'BULLYING', 'CHILD_PROTECTION', 'URGENT')),
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ON_HOLD', 'CLOSED', 'REFERRED_OUT')),
  intervention_types TEXT[],
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
CREATE TABLE interventions (
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
CREATE TABLE sessions (
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
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  evaluation_type TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  report_url TEXT,
  key_findings TEXT,
  parent_consent_date DATE,
  parent_consent_signature URL,
  evaluation_start_date DATE,
  evaluation_complete_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Evaluation steps table
CREATE TABLE evaluation_steps (
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
CREATE TABLE protocol_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  protocol_type TEXT NOT NULL,
  step_sequence INTEGER,
  step_type TEXT,
  step_status TEXT DEFAULT 'PENDING',
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

-- Parent meetings table
CREATE TABLE parent_meetings (
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
  google_calendar_event_id TEXT,
  agenda TEXT,
  agenda_link TEXT,
  next_steps TEXT,
  next_meeting_date DATE,
  reminder_sent BOOLEAN,
  reminder_sent_date DATE,
  frequency TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group interventions table
CREATE TABLE group_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  description TEXT,
  student_ids UUID[] NOT NULL,
  facilitator_id UUID REFERENCES users(id),
  facilitator_name TEXT,
  intervention_type TEXT,
  tier INTEGER,
  start_date DATE,
  estimated_end_date DATE,
  frequency TEXT,
  status TEXT DEFAULT 'ACTIVE',
  outcomes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group sessions table
CREATE TABLE group_sessions (
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
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  referral_type TEXT NOT NULL,
  kid_talk_date DATE,
  kid_talk_attendees TEXT[],
  kid_talk_notes TEXT,
  kid_talk_agenda TEXT,
  incident_date DATE,
  incident_time TIME,
  incident_location TEXT,
  incident_description TEXT,
  reported_by TEXT,
  incident_severity TEXT,
  incident_category TEXT,
  frequency_in_week INTEGER,
  escalated_to_admin BOOLEAN,
  created_case_id UUID REFERENCES cases(id),
  created_at TIMESTAMP DEFAULT NOW(),
  referral_processed BOOLEAN DEFAULT FALSE
);

-- Behavior incidents (synced from Google Forms)
CREATE TABLE behavior_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  incident_time TIME,
  incident_location TEXT,
  incident_description TEXT,
  reported_by TEXT,
  severity TEXT,
  category TEXT,
  google_form_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Files/Attachments table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  protocol_step_id UUID REFERENCES protocol_steps(id),
  session_id UUID REFERENCES sessions(id),
  evaluation_id UUID REFERENCES evaluations(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log (for compliance)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_cases_student_id ON cases(student_id);
CREATE INDEX idx_cases_case_manager ON cases(case_manager_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_case_type ON cases(case_type);
CREATE INDEX idx_interventions_case_id ON interventions(case_id);
CREATE INDEX idx_sessions_intervention_id ON sessions(intervention_id);
CREATE INDEX idx_evaluations_case_id ON evaluations(case_id);
CREATE INDEX idx_protocol_steps_case_id ON protocol_steps(case_id);
CREATE INDEX idx_parent_meetings_student_id ON parent_meetings(student_id);
CREATE INDEX idx_behavior_incidents_student_id ON behavior_incidents(student_id);

-- Enable RLS (Row Level Security) for multi-tenant safety
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_incidents ENABLE ROW LEVEL SECURITY;
```

### Step 1.3: Row Level Security (RLS) Policies

```sql
-- SSS Staff can see all cases for their school
CREATE POLICY sss_staff_view_all_cases ON cases
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM users 
    WHERE role = 'SSS_STAFF' AND school_id = cases.school_id
  )
);

-- Teachers can only see their own students' cases
CREATE POLICY teacher_view_own_students_cases ON cases
FOR SELECT USING (
  auth.uid() IN (
    SELECT primary_teacher_id FROM students 
    WHERE id = cases.student_id
  )
);

-- Case managers can edit their own cases
CREATE POLICY case_manager_edit_own_cases ON cases
FOR UPDATE USING (
  auth.uid() = case_manager_id
);

-- Parents can only see own child's non-sensitive info
CREATE POLICY parent_view_own_child ON cases
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM parent_meetings 
    WHERE cases.student_id = parent_meetings.student_id
  )
);
```

---

## PHASE 2: CLAUDE AGENT SDK SETUP (Week 1-2)

### Step 2.1: Agent Architecture

```typescript
// lib/agents/types.ts

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CaseContext {
  caseId: string;
  studentId: string;
  studentName: string;
  caseType: string;
  tier: number;
  status: string;
  interventions: any[];
  sessions: any[];
  protocolSteps?: any[];
}

export interface EvaluationContext {
  evaluationId: string;
  evaluationType: string;
  completedSteps: string[];
  remainingSteps: string[];
}

export interface ProtocolContext {
  protocolType: string;
  completedSteps: ProtocolStep[];
  nextStep?: ProtocolStep;
  caseDetails: CaseContext;
}
```

### Step 2.2: Case Management Agent

```typescript
// lib/agents/caseAgent.ts

import Anthropic from "@anthropic-ai/sdk";
import { CaseContext } from "./types";

const client = new Anthropic();

export class CaseManagementAgent {
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  private systemPrompt = `You are an expert Student Support Services (SSS) case manager assistant for ATLAS American School of Malaga. Your role is to help manage student cases with the following responsibilities:

1. **Case Analysis**: Analyze student case data and provide insights about progress
2. **Intervention Recommendations**: Suggest intervention modifications based on session data
3. **Escalation Detection**: Flag cases that need escalation to next tier or external referral
4. **Progress Summarization**: Create concise summaries of case progress
5. **Protocol Guidance**: Ensure protocol steps are followed correctly for bullying and child protection cases

Guidelines:
- Always prioritize student safety and wellbeing
- Consider data from multiple sources (teacher feedback, student self-assessment, observations)
- Provide actionable recommendations
- Flag any safety concerns immediately
- Be respectful of school policies and legal requirements
- For Child Protection cases, ensure ALL safety protocols are followed

When analyzing cases, consider:
- Frequency of sessions and attendance
- Quality of progress notes
- Teacher feedback patterns
- Time since last intervention adjustment
- Tier appropriateness
- Signs of escalation or de-escalation

Respond in JSON format when requested with structured data.`;

  async analyzeCaseProgress(caseContext: CaseContext): Promise<string> {
    const userMessage = `
    Analyze the following case and provide a progress assessment:
    
    Student: ${caseContext.studentName}
    Grade: ${caseContext.studentId}
    Case Type: ${caseContext.caseType}
    Tier: ${caseContext.tier}
    Status: ${caseContext.status}
    
    Recent Sessions: ${JSON.stringify(caseContext.sessions.slice(-3))}
    Active Interventions: ${JSON.stringify(caseContext.interventions)}
    
    Please provide:
    1. Overall progress assessment
    2. Key positive indicators
    3. Areas of concern
    4. Recommended next steps
    5. Whether tier escalation should be considered
    `;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  async suggestInterventionModification(
    caseContext: CaseContext,
    recentSessions: any[]
  ): Promise<string> {
    const userMessage = `
    Based on the following recent session data, suggest modifications to current interventions:
    
    Case: ${caseContext.studentName} - ${caseContext.caseType}
    Current Interventions: ${JSON.stringify(caseContext.interventions)}
    
    Recent Sessions (last 4 weeks):
    ${JSON.stringify(recentSessions)}
    
    Consider:
    - Session attendance patterns
    - Progress notes sentiment and specificity
    - Frequency effectiveness
    - Student engagement indicators
    - Whether to continue, modify, or escalate interventions
    
    Provide specific, actionable recommendations.
    `;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  async flagEscalationRisks(caseContext: CaseContext): Promise<{
    shouldEscalate: boolean;
    riskLevel: "low" | "medium" | "high" | "critical";
    reasons: string[];
    recommendations: string[];
  }> {
    const userMessage = `
    Analyze this case for potential escalation risks. Respond in JSON format.
    
    Case: ${caseContext.studentName}
    Case Type: ${caseContext.caseType}
    Tier: ${caseContext.tier}
    
    Data: ${JSON.stringify(caseContext)}
    
    Respond with JSON:
    {
      "shouldEscalate": boolean,
      "riskLevel": "low" | "medium" | "high" | "critical",
      "reasons": string[],
      "recommendations": string[]
    }
    `;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Parse JSON response
    try {
      return JSON.parse(assistantMessage);
    } catch {
      return {
        shouldEscalate: false,
        riskLevel: "low",
        reasons: ["Unable to parse response"],
        recommendations: ["Review case manually"],
      };
    }
  }
}
```

### Step 2.3: Protocol Agent

```typescript
// lib/agents/protocolAgent.ts

import Anthropic from "@anthropic-ai/sdk";
import { ProtocolContext } from "./types";

const client = new Anthropic();

export class ProtocolAgent {
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  private systemPrompt = `You are a specialized assistant for managing complex protocols at ATLAS American School of Malaga. You handle three critical protocols:

1. **Anti-Bullying Protocol** (ATLAS ASM Anti-Bullying Action Guide)
2. **Child Safeguarding Protocol** (ATLAS ASM Child Protection Framework)
3. **Conflict Resolution Protocol**

Your responsibilities:
- Ensure all protocol steps are completed in correct order
- Generate documentation requirements for each step
- Flag missing information or incomplete steps
- Provide guidance on who should be responsible for each step
- Ensure compliance with legal requirements (Junta de Andalucía, GDPR)
- Provide templates or checklists for documentation

For Bullying Protocol steps:
1. Communication & immediate action
2. Investigation (interviews, observation notes)
3. Assessment (characteristics, vulnerability assessment)
4. Conclusions (determine if bullying is confirmed)
5. Actions taken (support victim, discipline aggressor, awareness)
6. Follow-up planning
7. Closure & notification

For Child Safeguarding Protocol steps:
1. Initial concern reporting
2. CSRT initial assessment
3. Investigation & information gathering
4. CSRT full team meeting
5. Family & authority notification
6. Ongoing monitoring
7. Case closure or continued monitoring

Always prioritize child safety. Flag any concerns about incomplete documentation or protocol violations.`;

  async guideNextStep(
    protocolContext: ProtocolContext
  ): Promise<{
    nextStepName: string;
    description: string;
    requiredDocumentation: string[];
    responsibleParty: string;
    estimatedTimeline: string;
    checklist: string[];
  }> {
    const userMessage = `
    Guide the next step for this ${protocolContext.protocolType} case:
    
    Case: ${protocolContext.caseDetails.studentName}
    Completed Steps: ${protocolContext.completedSteps.map((s) => s.step_type).join(", ")}
    
    Current Protocol Details:
    ${JSON.stringify(protocolContext, null, 2)}
    
    Respond in JSON format with:
    {
      "nextStepName": string,
      "description": string,
      "requiredDocumentation": string[],
      "responsibleParty": string,
      "estimatedTimeline": string,
      "checklist": string[]
    }
    `;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: this.systemPrompt,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    try {
      return JSON.parse(assistantMessage);
    } catch {
      return {
        nextStepName: "Error parsing response",
        description: assistantMessage,
        requiredDocumentation: [],
        responsibleParty: "Manual review required",
        estimatedTimeline: "TBD",
        checklist: [],
      };
    }
  }

  async validateProtocolCompletion(
    protocolContext: ProtocolContext
  ): Promise<{
    isComplete: boolean;
    completionPercentage: number;
    missingSteps: string[];
    missingDocumentation: string[];
    recommendations: string[];
  }> {
    const userMessage = `
    Validate if this ${protocolContext.protocolType} protocol is complete:
    
    ${JSON.stringify(protocolContext, null, 2)}
    
    Respond in JSON format with:
    {
      "isComplete": boolean,
      "completionPercentage": number,
      "missingSteps": string[],
      "missingDocumentation": string[],
      "recommendations": string[]
    }
    `;

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: this.conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    this.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    try {
      return JSON.parse(assistantMessage);
    } catch {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingSteps: ["Unable to validate"],
        missingDocumentation: [],
        recommendations: ["Manual review required"],
      };
    }
  }
}
```

---

## PHASE 3: CORE APP STRUCTURE (Week 2-3)

### Step 3.1: App Layout

```typescript
// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATLAS SSS - Student Support Services",
  description: "Case management and intervention tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <QueryClientProvider client={queryClient}>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
```

### Step 3.2: Dashboard Component

```typescript
// app/dashboard/page.tsx

import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Calendar } from "lucide-react";

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Fetch priority cases
  const { data: urgentCases } = await supabase
    .from("cases")
    .select("*, students(*)")
    .in("case_type", ["CHILD_PROTECTION", "BULLYING", "URGENT"])
    .eq("status", "OPEN");

  // Fetch today's meetings
  const { data: todaysMeetings } = await supabase
    .from("parent_meetings")
    .select("*, students(*)")
    .eq("meeting_date", new Date().toISOString().split("T")[0]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Priority Alerts */}
      {urgentCases && urgentCases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Urgent Cases</h2>
          <div className="grid grid-cols-1 gap-4">
            {urgentCases.map((caseItem) => (
              <Alert key={caseItem.id} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{caseItem.students.name}</AlertTitle>
                <AlertDescription>
                  {caseItem.case_type} - {caseItem.status}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Today's Meetings */}
      {todaysMeetings && todaysMeetings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Today's Meetings</h2>
          <div className="grid grid-cols-1 gap-4">
            {todaysMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white p-4 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {meeting.students.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {meeting.meeting_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## NEXT STEPS

**Week 1:**
- [ ] Initialize Next.js project
- [ ] Set up Supabase schema
- [ ] Configure authentication
- [ ] Set up environment variables

**Week 2:**
- [ ] Implement Claude Agent SDK
- [ ] Create CaseManagementAgent
- [ ] Create ProtocolAgent
- [ ] Set up database queries

**Week 3:**
- [ ] Build dashboard
- [ ] Create case detail views
- [ ] Implement filtering
- [ ] Add basic forms

**Week 4:**
- [ ] Google Calendar integration
- [ ] Parent meeting scheduling
- [ ] Offline support (PWA)
- [ ] Testing & iteration

---

## DEPLOYMENT CHECKLIST

Before going to production:

- [ ] All RLS policies tested
- [ ] Google OAuth configured properly
- [ ] All environment variables set in production
- [ ] Database backups configured
- [ ] Error logging set up (Sentry)
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] User training materials prepared
- [ ] Data migration from old systems (if needed)
- [ ] Go-live plan with rollback strategy

---

**Questions?** Reach out to Wendy Aragón (Wendy.Aragon@atlas.es) or Carlos (vixi.agency)

---

**Document Version:** 1.0  
**Last Updated:** November 18, 2025
