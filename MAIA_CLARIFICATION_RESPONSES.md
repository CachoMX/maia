# MAIA - Clarification Questions & Responses from Wendy Aragón
## Final Requirements Document

**Date:** November 18, 2025
**Responded by:** Wendy Aragón (SSS Team Lead)
**For:** Carlos (vixi.agency) - Implementation Guidance

---

## 1. EVALUATION & ASSESSMENT WORKFLOW ✅

**Q: When a SNAP evaluation is completed and generates recommendations:**

**A:** Wendy always keeps the original recommendations to share with families and teachers, but creates tailored interventions based on:
- Student's actual needs
- Available resources at ATLAS
- Programs the school can provide (some recommendations require paid subscriptions that aren't always available)
- This is a transparent process with families

**Decision criteria:** Intervene on what the student needs, in one way or another, but always intervene.

**Implementation:**
- ✅ Track ONLY "Actual Intervention Implemented" (Wendy designs these)
- ❌ Don't track "Recommended vs Actual" separately
- Store original SNAP report for reference

---

**Q: For the SNAP evaluation report (Windows/Mac issue):**

**A:**
- Store report link/URL in the app (with confidentiality protections)
- This can be solved AFTER MVP (not urgent)

**Implementation:**
- Store secure URL to evaluation report
- Ensure confidentiality/access controls
- Defer Mac upload solution to Phase 2

---

**Q: Evaluation re-evaluation timing (3-year re-evaluation for Tier 3):**

**A:**
- **BOTH options needed:**
  1. Automatic reminder at 3-year mark (so Wendy doesn't forget)
  2. Manual override option to change based on case review
- App should track when re-evaluation is DUE ✅

**Implementation:**
- Auto-calculate re-evaluation due date (3 years from last evaluation)
- Show dashboard reminder when approaching due date
- Allow manual adjustment of re-evaluation date
- Flag overdue re-evaluations

---

## 2. BULLYING PROTOCOL SPECIFICS ✅

**Q: Multiple students involved in bullying (Student A victim, B aggressor, C bystander):**

**A:**
- Keep it all in ONE case/document and share the case
- Track relationships between students in the case ✅

**Implementation:**
- Single case with multiple student roles:
  - Primary student (victim)
  - Related students (aggressor, bystanders, witnesses)
  - Role tagging for each student
- Ability to link/relate cases to each other

---

**Q: Bullying case closure criteria:**

**A:**
- Successful closure = Full investigation completed + deliberation
- **Minimum monitoring period:** 3-4 weeks (typical)
- Need "Case Closure Checklist" for bullying ✅

**Sample criteria:** Analysis and Conclusions documented

**Implementation:**
- Bullying Case Closure Checklist:
  - [ ] Full investigation completed
  - [ ] Analysis and conclusions documented
  - [ ] Both families notified
  - [ ] Monitoring period completed (default 3-4 weeks)
  - [ ] Anti-bullying agreement signed (aggressor family)
  - [ ] Final report created

---

**Q: Corrective procedure (Common Corrective Procedure):**

**A:**
- **BOTH tracked:**
  1. Within the bullying case: Anti-bullying agreement with parents and student (aggressor)
  2. Escalated separately to Administration

**Implementation:**
- Track anti-bullying agreement in case (date signed, parties involved)
- Track admin escalation separately (who, when, outcome)
- Link both to the same case

---

## 3. CHILD PROTECTION PROTOCOL SPECIFICS ✅

**Q: Authority notification:**

**A:** Wendy notifies:
- **Hoja SIMIA** (digital document for Junta de Andalucía - required)
- **Local Police**
- **Social Services**
- **Priority:** No fixed order - depends on each case
- Need "Authority Notification Checklist" ✅ to see:
  - Which authorities have been notified
  - Which cases are documented internally only

**Implementation:**
- Authority Notification Checklist:
  - [ ] Hoja SIMIA submitted (Junta de Andalucía)
  - [ ] Local Police notified
  - [ ] Social Services contacted
  - Date notified for each
  - Case-by-case selection (not all required every time)

---

**Q: Family notification in child protection cases:**

**A:**
- "Do NOT notify parents" is rare but happens when:
  - Student disclosure could put them in MORE danger
  - Immediate escalation to: SIMIA + Child Protection + Local Police

**Implementation:**
- Checkbox: "Were parents notified?" (Yes/No)
- If No → Reasoning field (required)
- **Permission to mark "No":** Only 3 people
  1. Principal of the school
  2. Principal of the grade level
  3. Wendy (SSS Lead)

---

**Q: Legal documentation:**

**A:**
- **YES** - Specific templates for:
  - Child concern documentation
  - Team meeting notes
  - Action plan
  - All consolidated into ONE single document per investigation
- Everything documented in **free-text notes**
- **NO** auto-generated formal report for authorities (Wendy creates manually)

**Implementation:**
- Free-text editor for investigation notes
- Template sections:
  - Initial concern
  - Team meeting notes
  - Action plan decided
  - Timeline of events
- No auto-report generation

---

## 4. CONFLICT RESOLUTION PROTOCOL ✅

**Q: Conflict Resolution workflow:**

**A:** This is a **lighter process** than Bullying - conflicts in kids are very common.

**Process flow:**
1. **Student asks for support** (voluntary) OR **Teacher referral**
2. **Meet with requesting student** → Give tools/strategies/scripts to solve themselves
3. **If conflict continues** → Meet with other student involved
4. **Mediation session** → Both students together
5. **Mutual agreement** → Students decide what they agree on / need from each other
6. **Process ends** → Communicate to teachers only
7. **If delicate** → Also communicate with families

**This is COMPLETELY DIFFERENT from Bullying.**

**Implementation:**
- Conflict Resolution case type workflow:
  - Step 1: Initial meeting (requesting student)
  - Step 2: Tools/strategies provided
  - Step 3: Other student meeting (if needed)
  - Step 4: Mediation session
  - Step 5: Mutual agreement documented
  - Step 6: Teacher notification
  - Step 7: Family communication (if delicate)
- Track: Agreement text, participants, date resolved

---

## 5. KID TALK MEETINGS ✅

**Q: KID Talk documentation:**

**A:** Keep the link to external document for now.

**Q: Follow-up KID Talks:**

**A:** Each student has a folder with:
- All team meeting notes about them
- All parent meeting notes about them
- Captured in ONE document per student

**Implementation:**
- Link to external KID Talk document
- Track follow-up meetings in parent meetings section
- Consolidate all notes in student's case folder

---

## 5B. PARENT MEETINGS & ACTION PLANS ✅ **[NEW CRITICAL INFO]**

**From Wendy's WhatsApp message:**

**After each parent meeting (90% of the time), Wendy creates:**
- Document with:
  - Date
  - Who attended
  - Agenda
  - Post-meeting notes
  - **Action plan agreed upon**

**CRITICAL NEED:** Track follow-up on action plans established

**What Wendy needs:**
1. **Action plan per student** with:
   - Agreed-upon items
   - **Checklist with dates** for things agreed/done
   - Space to add links or upload photos/files as evidence (especially for interventions)
   - **Weekly reminders** at start of week for all families needing follow-up that week

**Current problem:** Wendy adds manually and often misses follow-ups

**Implementation:**
- Add "Action Plan" section to Parent Meetings:
  - Action items (checklist format)
  - Due dates per item
  - Checkbox completion tracking
  - File/photo/link attachment per item (evidence)
- **Weekly Digest Reminder:**
  - Every Monday morning
  - List all families needing follow-up that week
  - Grouped by student/case
  - Link to action plan

---

## 5C. URGENT CASES DEFINITION ✅ **[CRITICAL CLARIFICATION]**

**From Wendy's WhatsApp message:**

**Urgent cases are:**

1. **Safeguarding concerns** (child protection)
2. **Highly dysregulated students:**
   - Aggressive episodes requiring removal from class
   - Extreme anxiety
   - Inconsolable crying
   - Very altered emotional states
   - Things teachers cannot control in their classroom

**Priority:** These come to Wendy immediately

**Documentation required:**
- Document the episode
- Communicate to families (email or phone)

**Implementation:**
- "Urgent" case type = HIGHEST PRIORITY
- Auto-flag for immediate attention
- Quick-add session for urgent interventions
- Communication log (email/phone) to families
- Episode documentation template:
  - Trigger/context
  - Behavior observed
  - Intervention taken
  - Resolution
  - Family communication method & date

---

## 6. PARENT MEETINGS & COMMUNICATION ✅

**Q: Parent meeting frequency tracking:**

**A:** **BOTH** options:
- Auto-calculate (weekly, bi-weekly, monthly)
- Manual selection of expected frequency

---

**Q: Cancelled/rescheduled meetings:**

**A:**
- Track as "Cancelled" ✅
- Reason field ✅
- Ask for new meeting date ✅

**Implementation:**
- Meeting status: Scheduled, Completed, Cancelled, Rescheduled
- If Cancelled → Reason + New proposed date

---

**Q: Parent signatures/consent:**

**A:**
- Get parent signatures for Tier 3 decisions ✅
- **NO** signature capture field in app
- Document as: "Verbal consent" or "Written consent via email"

**Implementation:**
- Consent type dropdown: Verbal / Email / Written
- Date of consent
- No digital signature capture

---

## 7. GROUP INTERVENTIONS ✅

**Q: Group composition changes:**

**A:**
- Students can be added/removed mid-intervention ✅
- Track **BOTH** attendance AND membership

**Implementation:**
- Track membership changes (who joined/left, when)
- Track attendance per session

---

**Q: Group outcomes:**

**A:** Measure by:
- Individual progress within group
- Observations
- Teacher comments
- Lower behavior incidents
- Academic growth
- Social growth
- Overall group cohesion/learning

**Implementation:**
- Outcome tracking fields:
  - Individual progress notes
  - Teacher feedback
  - Behavior incident reduction (auto-calculate)
  - Academic growth indicators
  - Social growth indicators
  - Group cohesion assessment

---

## 8. BEHAVIOR INCIDENT FORMS ✅

**Q: Current Google Form links:**

**A:** (Links provided - Carlos to review)
- Preschool
- 1st and 2nd Grade
- 3rd and 4th Grade
- 5th and 6th Grade

---

**CRITICAL: Restorative Process Field ✅**

**A:** After every incident, there is a **RESTORATIVE PROCESS** - very important for learning.

**Track:**
- Checklist for Restorative Process
- Date completed
- Staff who conducted it
- Space for notes

**Implementation:**
- Add to Behavior Incident entity:
  - [ ] Restorative Process completed
  - Date
  - Staff member
  - Notes field

---

**Q: Map to database or keep separate Excel?**

**A:** If other people who receive Google Forms responses can still open normal Excel spreadsheet → YES, map to database

**Implementation:**
- Map Google Forms to Maia database
- Keep Forms responses in Google Sheets (for other staff)
- Sync to Maia for SSS team analysis

---

**Q: Incident severity & escalation:**

**A:**
- **SEVERE:** Physical incidents (fights, punching, pushing, hurting others)
- **MODERATE/MINOR:** Other behaviors
- **Escalation:** Admin judgment (manual)
- **Auto-suggest escalation:** YES ✅ (based on severity + frequency)

**Implementation:**
- Auto-flag for escalation if:
  - SEVERE incident
  - High frequency (3+ incidents in 1 week)
  - Pattern detected
- Admin reviews and decides

---

## 9. SSS TEAM OPERATIONS ✅

**Q: Case manager assignment:**

**A:**
- By specialization (Wendy = behavioral, Lindsey = academic, etc.)
- **BOTH** auto-suggest AND manual override

**Implementation:**
- Smart assignment based on case type
- Manual override option
- Track specializations per staff member

---

**Q: Case load capacity:** **[CRITICAL FEATURE]**

**A:**
- **Currently NO tracking - but VERY MUCH NEEDED!** ✅
- Show workload balance across team ✅
- Recommended max cases:
  - **Weekly:** 5-15 active cases
  - **Monthly:** 20-40 active cases
  - **NaBITA recommendation:** 1 case manager per 35-50 active complex cases

**Implementation:**
- Dashboard widget: Case load per team member
- Visual indicator: Green (under capacity), Yellow (at capacity), Red (over capacity)
- Recommended limits (configurable):
  - Weekly active: 5-15
  - Monthly active: 20-40
  - Complex cases: max 35-50

---

**Q: Team meetings:**

**A:**
- Would love to track in app ✅
- **Concern:** Access control - many people have access to current documents
- If access can be restricted → Wendy will input data
- Cases discussed, decisions made, etc.

**Implementation:**
- SSS Team Meetings (restricted to SSS staff only)
- Track:
  - Date
  - Attendees
  - Cases discussed
  - Decisions made
  - Action items

---

## 10. REPORTING & ANALYTICS ✅

**Q: Monthly/Admin reports - what metrics?**

**A:** ALL of these:
- Total cases by type ✅
- Outcomes (improved, referred out, escalated) ✅
- Tier distribution ✅
- Intervention effectiveness ✅

---

**Q: Student outcomes tracking - how to define "improvement"?**

**A:**
- **Academic:** Grade improvement ✅
- **SEL:** Behavior reduction, teacher observation ✅
- **Specialization:** Program completion ✅
- **ALSO:** Leave space to add more metrics as needed

**Implementation:**
- Flexible outcome fields
- Custom metrics per case type
- Free-text notes for qualitative improvements

---

**Q: Multi-year trends:**

**A:**
- Track same metrics year-over-year ✅
- Historical comparison support ✅

**Implementation:**
- Year-over-year comparison reports
- Trend graphs
- Export historical data

---

## 11. DISTINCTIONS PROGRAMS/CURRICULA ✅

**Q: What are Distinctions Programs?**

**A:**
- ATLAS uses many programs
- Just give space to add whatever program/curricula they're using
- Track same way as other interventions (sessions, progress)

**Implementation:**
- Free-text field for program name
- Track like other interventions
- Session-based progress tracking

---

## 12. WORKFLOW AUTOMATION & CLAUDE AGENT ✅ **[PRIORITY FEATURES]**

**Q: Smart features most valuable:**

**A:** **ALL OF THE ABOVE:**
- Auto-summarizing session notes ✅
- Suggesting intervention modifications ✅
- Flagging escalation candidates ✅
- Generating monthly case summaries ✅
- **HIGHLY VALUABLE:** Percentages of students (%) per Tier 1, 2, 3 / per grade level ✅✅✅

**Implementation:**
- Claude Agent features:
  1. Session summary generation
  2. Intervention modification suggestions
  3. Escalation candidate detection
  4. Monthly case summaries
  5. **Tier distribution by grade level** (dashboard widget)

---

**Q: Tone of AI suggestions:**

**A:**
- **Balanced** ✅
- **Data-driven** ✅
- **Both:** Balanced but MOST data-driven

**Implementation:**
- Claude Agent system prompt:
  - Primary: Data-driven analysis
  - Secondary: Balanced recommendations
  - Avoid over-cautious escalation
  - Ground in metrics and patterns

---

## 13. MOBILE & OFFLINE USAGE ✅

**Q: Mobile needs:**

**A:**
- Viewing cases (read-only) → YES ✅
- Adding quick session notes → YES ✅
- Full case management → **Use computer instead**

**Implementation:**
- Mobile: Read cases + quick session notes
- Desktop: Full case management

---

**Q: Offline frequency:**

**A:**
- Internet goes down **occasionally**
- **Online-first with offline fallback** ✅

**Implementation:**
- Primary: Online mode
- Fallback: Offline mode with sync when online
- PWA with service workers

---

## 14. MULTI-SCHOOL EXPANSION ✅

**Q: Future schools (2 other Spanish cities):**

**A:** **ADD LATER** (not in MVP)

**Implementation:**
- Build single-tenant for now
- Multi-tenant architecture in Phase 3

---

## 15. TIMELINE & GO-LIVE ✅

**Q: MVP deadline (January 2026):**

**A:**
- **Flexible** (not hard deadline) ✅
- **Pilot first** with core team (not 50+ users yet)

---

**Q: Training & rollout - who needs training?**

**A:**
- SSS team ✅
- Teachers ✅
- Principals ✅
- NOT parents (at this stage)

---

**Q: MINIMUM feature set for go-live:**

**A:** **Case management + interventions + sessions** ✅✅✅

**Implementation:**
- MVP Phase 1:
  - Case management (create, edit, view)
  - Interventions (track sessions)
  - Session documentation
  - Basic dashboard
  - Google OAuth login
- Phase 2:
  - Protocols (Bullying, Child Protection, Conflict Resolution)
  - Evaluations
  - Advanced features

---

## 16. SECURITY & CONFIDENTIALITY ✅ **[CRITICAL QUESTION]**

**Q from Wendy:** "Is this app going to be blockchained? Just wondering about the confidentiality, how does this normally work?"

**Answer for Carlos to provide:**

**Recommended approach:**
- **NOT blockchain** (overkill for this use case)
- **Supabase Row Level Security (RLS):**
  - Each user only sees their authorized cases
  - Multi-level access control (SSS staff, teachers, parents, admin)
  - Encrypted data at rest
  - HTTPS encrypted data in transit
  - Audit logs (who accessed what, when)

**Compliance:**
- GDPR compliant (EU data protection)
- Spanish education law compliance
- Child safeguarding data protection
- Regular backups
- Access logs for legal requirements

**Better than blockchain because:**
- Faster performance
- Standard security practices for healthcare/education data
- Easier to comply with "right to be forgotten" (GDPR)
- Industry-standard approach

---

## SUMMARY OF CRITICAL NEW FEATURES DISCOVERED

### 🔴 MUST-HAVE for MVP:
1. **Action Plan Tracking** (per parent meeting)
   - Checklist with dates
   - File/photo attachments as evidence
   - Weekly reminder digest

2. **Urgent Case Handling**
   - Quick-add for dysregulated student episodes
   - Family communication log
   - Priority flagging

3. **Restorative Process** (behavior incidents)
   - Checklist field
   - Staff & date tracking

4. **Case Load Tracking** (SSS team)
   - Active cases per team member
   - Workload balance indicator
   - Capacity warnings

5. **Tier Distribution Analytics**
   - % of students per tier per grade level
   - Dashboard widget

### 🟡 IMPORTANT for Phase 2:
1. Multi-student bullying cases (relationship tracking)
2. Authority notification checklist (Child Protection)
3. Conflict Resolution workflow (7 steps)
4. Re-evaluation reminders (auto + manual)
5. Historical trend comparisons

### 🟢 NICE-TO-HAVE for Phase 3:
1. Claude Agent auto-summaries
2. Mobile quick-notes
3. Multi-school expansion

---

**Status:** ✅ **ALL CLARIFICATIONS RECEIVED**
**Next Step:** Update specification & implementation roadmap
**Ready to Build:** YES

---

*Responses collected from: Wendy Aragón*
*Date: November 18, 2025*
*Prepared for: Carlos (vixi.agency)*
