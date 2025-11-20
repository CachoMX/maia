# MAIA - MVP Priority Features & Implementation Order
## Based on Wendy's Clarification Responses

**Date:** November 18, 2025
**Version:** 2.0 (Updated after clarifications)
**Target:** January 2026 Pilot Launch

---

## 🎯 REVISED MVP SCOPE (Phase 1 - Weeks 1-4)

### ✅ CORE FEATURES (Must-Have for Pilot)

#### 1. **Case Management** (Week 1-2)
- Create/Edit/View cases
- 7 case types (Academic Support, SEL, Distinctions, Conflict Resolution, Bullying, Child Protection, Urgent)
- 3-tier system (1, 2, 3)
- Case status (Open, On Hold, Closed, Referred Out)
- Case manager assignment (smart + manual)
- Student search/filter by grade
- **NEW:** Urgent case priority flagging ⭐

#### 2. **Interventions & Sessions** (Week 2-3)
- Create interventions (Academic, SEL, Distinctions)
- Track sessions (date, notes, progress, challenges)
- Student attendance tracking
- Session notes documentation
- File attachments (photos, documents, evidence)
- **NEW:** Quick-add for urgent interventions ⭐

#### 3. **Parent Meetings with Action Plans** (Week 3) ⭐ **[CRITICAL NEW FEATURE]**
- Schedule parent meetings
- Google Calendar integration
- Document meeting agenda/notes
- **Action Plan Tracking:**
  - Checklist items with due dates
  - Completion tracking
  - File/photo/link attachments per action item (evidence)
  - Space for notes
- **Weekly Reminder Digest:**
  - Every Monday morning
  - List all families needing follow-up that week
  - Grouped by student/case

#### 4. **Dashboard & Analytics** (Week 3-4)
- SSS Staff Dashboard:
  - Active cases overview
  - Urgent cases (top priority)
  - Cases assigned to me
  - **Case Load Tracking** per team member ⭐
  - **Workload balance indicator** (Green/Yellow/Red)
  - Upcoming parent meetings
  - Action items due this week
- **Analytics Widget:**
  - Total cases by type
  - **% of students per Tier (1, 2, 3) per grade level** ⭐⭐⭐ (HIGHLY VALUABLE)
  - Tier distribution visualization

#### 5. **Authentication & Access Control** (Week 1)
- Google OAuth login
- Role-based access:
  - SSS_STAFF (full access)
  - TEACHER (view own referrals, limited case view)
  - PRINCIPAL_ADMIN (oversight)
  - PARENT (future - not MVP)
- Row Level Security (Supabase RLS)

#### 6. **Behavior Incident Integration** (Week 4)
- Sync from Google Forms (4 grade-level forms)
- Display incidents per student
- **Restorative Process tracking:** ⭐
  - Checklist: Restorative Process completed
  - Date completed
  - Staff member who conducted it
  - Notes field
- Frequency tracking (incidents per week)
- Auto-suggest escalation (if 3+ severe incidents)

---

## 🟡 PHASE 2 FEATURES (Weeks 5-6)

### Protocol Workflows

#### 1. **Bullying Protocol** (Week 5)
- 7-step workflow
- **Single case with multiple students:** ⭐
  - Primary student (victim)
  - Related students (aggressor, bystanders)
  - Role tagging
- Anti-bullying agreement tracking
- Admin escalation tracking
- **Case Closure Checklist:**
  - [ ] Full investigation completed
  - [ ] Analysis and conclusions documented
  - [ ] Both families notified
  - [ ] Monitoring period completed (3-4 weeks default)
  - [ ] Anti-bullying agreement signed
  - [ ] Final report created

#### 2. **Child Protection Protocol** (Week 5)
- 7-step workflow
- **Authority Notification Checklist:** ⭐
  - [ ] Hoja SIMIA submitted (Junta de Andalucía)
  - [ ] Local Police notified
  - [ ] Social Services contacted
  - Date notified for each
- **Family notification control:**
  - "Were parents notified?" (Yes/No)
  - If No → Reasoning field
  - Permission control (only 3 people: Principal, Grade Principal, Wendy)
- Investigation documentation (free-text)
- Team meeting notes
- Action plan

#### 3. **Conflict Resolution Workflow** (Week 6) ⭐ **[NEW WORKFLOW]**
- 7-step process:
  1. Student request or teacher referral
  2. Initial meeting (requesting student)
  3. Tools/strategies provided
  4. Other student meeting (if needed)
  5. Mediation session (both students)
  6. Mutual agreement documented
  7. Teacher notification (+ family if delicate)
- Track agreement text, participants, resolution date

#### 4. **Evaluations & Re-evaluation Tracking** (Week 6)
- SNAP evaluations (SpLD, Behavior, Math)
- Store evaluation report URL (secure)
- **Re-evaluation reminders:** ⭐
  - Auto-calculate due date (3 years from last evaluation)
  - Dashboard reminder when approaching
  - Manual override option
  - Flag overdue re-evaluations

---

## 🟢 PHASE 3 FEATURES (Weeks 7-8)

### Advanced Features

#### 1. **Claude Agent Integration** (Week 7)
- **CaseManagementAgent:**
  - Auto-summarize session notes
  - Suggest intervention modifications
  - Flag escalation candidates
  - Generate monthly case summaries
- **ProtocolAgent:**
  - Guide next protocol steps
  - Validate protocol completion
  - Suggest authority notifications (Child Protection)
- **Tone:** Balanced but MOST data-driven ⭐

#### 2. **Group Interventions** (Week 7)
- Create group interventions (SEL, Academic, Distinctions)
- Track membership changes (students added/removed)
- Session attendance tracking
- **Outcome tracking:** ⭐
  - Individual progress notes
  - Teacher feedback
  - Behavior incident reduction (auto-calculate)
  - Academic growth indicators
  - Social growth indicators
  - Group cohesion assessment

#### 3. **Reporting & Trends** (Week 8)
- Monthly admin reports:
  - Total cases by type
  - Outcomes (improved, referred out, escalated)
  - Tier distribution
  - Intervention effectiveness
- **Historical trends:** ⭐
  - Year-over-year comparison
  - Multi-year trend graphs
  - Export historical data

#### 4. **Mobile & Offline Support** (Week 8)
- **Mobile (read-only + quick notes):**
  - View cases
  - Add quick session notes
- **Offline mode:**
  - Online-first with offline fallback
  - PWA with service workers
  - Sync when connection restored

#### 5. **SSS Team Operations** (Week 8)
- **Team meetings tracking:** ⭐ (SSS staff only)
  - Date, attendees
  - Cases discussed
  - Decisions made
  - Action items
- Smart case assignment by specialization
- **Workload recommendations:**
  - Weekly active: 5-15 cases
  - Monthly active: 20-40 cases
  - Complex cases: max 35-50

---

## 🔴 CRITICAL SECURITY REQUIREMENTS (Week 1)

### Confidentiality & Data Protection

**Wendy's Question:** "Is this app going to be blockchained?"

**Answer: NO - Better approach:**

#### Supabase Row Level Security (RLS)
- Each user only sees authorized cases
- Multi-level access control:
  - SSS staff: Full access to all cases
  - Teachers: View own referrals only
  - Principals: Oversight (read-only)
  - Parents: Future (view own child's progress only)

#### Encryption
- Data at rest: Encrypted in Supabase PostgreSQL
- Data in transit: HTTPS/TLS encryption
- Sensitive fields: Additional encryption layer (evaluation reports, child protection notes)

#### Audit Logs
- Who accessed what case, when
- Changes tracked (who edited, what changed)
- Compliance with GDPR & Spanish education laws
- Legal requirements for child safeguarding

#### Access Controls
- **Child Protection "Do NOT notify parents":** Only 3 people can mark
  1. Principal of the school
  2. Principal of the grade level
  3. Wendy Aragón (SSS Lead)
- **SSS Team Meetings:** Only SSS staff can access
- **Student files:** Role-based permissions

#### Compliance
- ✅ GDPR compliant (EU data protection)
- ✅ Spanish education law compliance
- ✅ Child safeguarding protocols
- ✅ Right to be forgotten (data deletion)
- ✅ Regular automated backups
- ✅ Access logs for legal audits

**Why NOT blockchain:**
- Blockchain is immutable (can't comply with GDPR "right to be forgotten")
- Slower performance
- Overkill for this use case
- Standard RLS + encryption is industry-standard for healthcare/education data

---

## 📊 MVP SUCCESS METRICS

**Pilot Launch (January 2026) - Success Criteria:**

### Functional Requirements ✅
- [ ] SSS staff can create/edit/close cases
- [ ] Interventions tracked with session notes
- [ ] Parent meetings scheduled with action plan checklists
- [ ] Weekly reminder digest sent every Monday
- [ ] Urgent cases flagged and prioritized
- [ ] Behavior incidents synced from Google Forms
- [ ] Restorative process tracked per incident
- [ ] Dashboard shows case load per team member
- [ ] Analytics show % students per tier per grade
- [ ] Google OAuth login works
- [ ] File attachments supported (evidence)

### Performance Requirements ✅
- [ ] Page load < 2 seconds
- [ ] Case search returns results < 1 second
- [ ] Can handle 200 active cases
- [ ] Google Forms sync < 5 minutes

### Usability Requirements ✅
- [ ] SSS team trained (3 people: Wendy, Lindsey, Jonica)
- [ ] Teachers trained (referral process)
- [ ] Principals trained (oversight dashboard)
- [ ] 90% of daily tasks faster than current Excel/Google Docs system
- [ ] Wendy doesn't miss action plan follow-ups (weekly reminders work)

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1: Foundation
- Supabase setup (database, auth, RLS)
- Next.js project initialization
- Google OAuth integration
- Basic case model (CRUD)
- Security & encryption setup

### Week 2: Core Features
- Interventions & sessions
- Student management
- File upload/storage
- Dashboard layout
- Case load tracking widget

### Week 3: Parent Meetings & Analytics
- Parent meeting scheduler
- Google Calendar integration
- **Action plan checklist** ⭐
- **Weekly reminder digest** ⭐
- Tier distribution analytics widget

### Week 4: Behavior & Polish
- Google Forms sync (4 forms)
- Restorative process tracking
- Urgent case handling
- Testing & bug fixes
- **PILOT LAUNCH** 🚀

### Week 5-6: Protocols (Phase 2)
- Bullying protocol
- Child Protection protocol
- Conflict Resolution workflow
- Evaluation re-evaluation reminders

### Week 7-8: Advanced (Phase 3)
- Claude Agent integration
- Group interventions
- Historical reporting
- Mobile/offline support

---

## 🎓 TRAINING PLAN

### SSS Team (Wendy, Lindsey, Jonica)
- **Day 1 (2 hours):** Full system walkthrough
  - Case creation
  - Intervention tracking
  - Session documentation
  - Action plans
  - Weekly reminders
- **Day 2 (1 hour):** Practice session
  - Import existing cases
  - Test workflows
- **Ongoing:** Support during first 2 weeks

### Teachers
- **30-minute session:** How to view cases, submit referrals
- Quick reference guide (PDF)

### Principals
- **30-minute session:** Dashboard overview, analytics, oversight

---

## 🔄 ROLLOUT STRATEGY

### Pilot Phase (January 2026)
- **Week 1-2:** SSS team only (3 people)
  - Import 10-20 test cases
  - Daily feedback sessions
  - Bug fixes in real-time

- **Week 3-4:** Add teachers (referral process)
  - Limited to 1-2 grade levels
  - Collect feedback

- **Week 5-6:** Add principals (oversight)
  - Full analytics access
  - Reporting feedback

### Full Launch (February 2026)
- All grades
- All teachers
- Behavior incident sync live
- All 200 active cases imported

---

## 📝 OPEN QUESTIONS FOR CARLOS

1. **Google Forms Sync:**
   - Can we keep responses in Google Sheets (for other staff) AND sync to Maia?
   - Zapier integration or custom Google Apps Script?

2. **Evidence File Storage:**
   - Supabase Storage or Google Drive links?
   - Max file size limits?

3. **Weekly Reminder Digest:**
   - Email notifications or in-app only?
   - What time Monday morning (8 AM Spain time)?

4. **Re-evaluation Reminders:**
   - How far in advance to remind? (30 days? 60 days?)
   - Email notification or dashboard only?

5. **Case Load Thresholds:**
   - Confirm max cases per team member:
     - Weekly: 5-15 active
     - Monthly: 20-40 active
     - Complex: 35-50 max
   - Should app block assignment if over capacity?

6. **Multi-School (Future):**
   - Build multi-tenant from start or refactor later?
   - Same database, separate schemas?

---

## ✅ NEXT IMMEDIATE ACTIONS

### For Carlos:
1. [ ] Review this MVP priority list with Wendy
2. [ ] Confirm Google Forms sync approach
3. [ ] Set up Supabase project (database + auth + storage)
4. [ ] Initialize Next.js project with dependencies
5. [ ] Create database schema (updated with new fields)
6. [ ] Build authentication & RLS policies
7. [ ] **Week 1 Goal:** Case CRUD + basic dashboard working

### For Wendy:
1. [ ] Review MVP feature priority
2. [ ] Confirm timeline (4 weeks realistic for pilot?)
3. [ ] Identify 10-20 test cases for pilot import
4. [ ] Share Google Forms links with Carlos (4 forms)
5. [ ] Confirm weekly reminder timing (Monday 8 AM?)
6. [ ] Confirm case load thresholds (5-15 weekly, 20-40 monthly)

---

**Status:** ✅ **READY TO BUILD**
**Timeline:** 4 weeks to MVP pilot, 8 weeks to full launch
**Risk Level:** LOW (clear requirements, proven tech stack)

---

*Prepared by: Claude (Anthropic)*
*For: Carlos (vixi.agency)*
*Reviewed by: Wendy Aragón*
*Last Updated: November 18, 2025*
