# ATLAS ASM SSS App - Final Clarification Questions

After reviewing all documents, I have identified some final questions that will help refine the specification further. These are optional but will improve the implementation.

---

## 1. EVALUATION & ASSESSMENT WORKFLOW

**Q: When a SNAP evaluation is completed and generates recommendations:**
- Do you always follow the recommended interventions, or do you frequently modify them?
- If you modify them, what's the decision-making criteria?
- Should the app track "Recommended Intervention" vs "Actual Intervention Implemented"?

**Q: For the SNAP evaluation report:**
- Currently it only works on Windows (Mac download issue). For the app:
  - Should we store the report link/URL in the app?
  - Or should we allow Mac users to upload/attach the PDF manually?
  - Timeline: Can this be solved after MVP or does it need to be solved upfront?

**Q: Evaluation re-evaluation timing:**
- You mentioned "3-year re-evaluation" for Tier 3. Is this:
  - Automatic reminder at 3-year mark?
  - Or manual decision based on case review?
  - Should the app track when re-evaluation is DUE?

---

## 2. BULLYING PROTOCOL SPECIFICS

**Q: Multiple students involved in bullying situation:**
- If Bullying incident involves Student A (victim), Student B (aggressor), Student C (bystander):
  - Do they share ONE case or THREE separate cases?
  - How do you track relationships between cases?

**Q: Bullying case closure:**
- What constitutes successful closure of a bullying case?
- Is there a minimum monitoring period before closure?
- Should the app have a "Case Closure Checklist" for bullying?

**Q: Corrective procedure:**
- The form mentions "Common Corrective Procedure" - is this something:
  - Tracked within the bullying case?
  - Or escalated to administration separately?

---

## 3. CHILD PROTECTION PROTOCOL SPECIFICS

**Q: Authority notification:**
- Which authorities do you typically notify?
  - Local police, Guardia Civil, Social Services?
  - Is there a priority order or do all get notified simultaneously?
  - Should the app have an "Authority Notification Checklist"?

**Q: Family notification in child protection cases:**
- You mentioned "sometimes do not inform parents if it's a safety risk"
  - Should the app allow marking "Do NOT notify parents" with reasoning?
  - Who has permission to mark this?

**Q: Legal documentation:**
- Are there specific templates/forms for internal investigation?
- Or is everything documented in free-text notes?
- Should the app auto-generate a formal report for external authorities?

---

## 4. CONFLICT RESOLUTION PROTOCOL

**Q: Conflict Resolution workflow:**
- I see you have "Conflict Resolution" as a case type, but I don't have the detailed protocol.
- Can you provide the step-by-step process similar to Bullying/Child Protection?
- Is this different from Bullying or a separate type entirely?

---

## 5. KID TALK MEETINGS

**Q: KID Talk documentation:**
- Currently stored in the Referral Template doc. For the app:
  - Should we create a structured form for KID Talk (like a case intake form)?
  - Or keep it as free-text notes linked to the case?

**Q: Follow-up KID Talks:**
- When you have follow-up KID Talks after the first one:
  - Do you update the same case record or create sub-meetings?
  - What info is captured in these follow-ups?

---

## 6. PARENT MEETINGS & COMMUNICATION

**Q: Parent meeting frequency tracking:**
- You want to track "frequency of meetings"
  - Should the app:
    - Auto-calculate (weekly, bi-weekly, monthly)?
    - Or do you manually select the expected frequency?
    - Both?

**Q: Cancelled/rescheduled meetings:**
- If a parent meeting is cancelled:
  - Should it be tracked as "Cancelled" or deleted?
  - Should there be a reason field?

**Q: Parent signatures/consent:**
- For certain decisions (like starting Tier 3), do you get parent signatures?
  - Should the app have a signature capture field?
  - Or just document "verbal consent" / "written consent via email"?

---

## 7. GROUP INTERVENTIONS

**Q: Group composition changes:**
- Can students be added/removed from groups mid-intervention?
  - Should the app track attendance or membership?
  - Both?

**Q: Group outcomes:**
- How do you measure group intervention outcomes?
  - Individual progress within the group?
  - Or overall group cohesion/learning?

---

## 8. BEHAVIOR INCIDENT FORMS

**Q: Current Google Form:**
- Do you have a link to the current behavior incident form?
- Are there fields beyond what I identified?
- Can I map it to the database directly or does it need restructuring?

**Q: Incident severity & escalation:**
- What makes an incident "SEVERE" vs "MODERATE"?
- Are there automatic rules for escalation or manual admin judgment?
- Should the app suggest escalation based on severity + frequency?

---

## 9. SSS TEAM OPERATIONS

**Q: Case manager assignment:**
- How do you assign cases to team members?
  - By availability?
  - By specialization (Wendy = behavioral, Lindsey = academic, etc.)?
  - Should the app suggest assignment or manual?

**Q: Case load capacity:**
- Do you track active cases per team member?
- Should the app show "workload balance" across the team?
- Is there a recommended max cases per person?

**Q: Team meetings:**
- I see "SSS Weekly Team Meetings" mentioned
  - Should this be tracked in the app?
  - Cases discussed, decisions made, etc.?

---

## 10. REPORTING & ANALYTICS

**Q: Monthly/Admin reports:**
- What specific metrics do principals/leadership ask for?
  - Total cases by type?
  - Outcomes (improved, referred out, escalated)?
  - Tier distribution?
  - Intervention effectiveness?

**Q: Student outcomes tracking:**
- How do you define "improvement" in a case?
  - For academic: Grade improvement?
  - For SEL: Behavior reduction? Teacher observation?
  - For specialization: Program completion?

**Q: Multi-year trends:**
- Do you track the same metrics year-over-year?
- Should the app support historical comparison?

---

## 11. DISTINCTIONS PROGRAMS/CURRICULA

**Q: What are "Distinctions Programs"?**
- Are these:
  - Acceleration/gifted programs?
  - Alternative curricula tracks?
  - Remedial programs?
  - Something else?

**Q: How do you track "Distinctions" interventions?**
- Same way as other interventions (sessions, progress)?
- Or different format?

---

## 12. WORKFLOW AUTOMATION & CLAUDE AGENT

**Q: Smart features you'd find most valuable:**
- Auto-summarizing session notes?
- Suggesting intervention modifications?
- Flagging escalation candidates?
- Generating monthly case summaries?
- All of the above?
- Something else?

**Q: Tone of AI suggestions:**
- Should Claude be:
  - Very cautious (always suggest escalation)?
  - Balanced?
  - Data-driven (only flag based on metrics)?

---

## 13. MOBILE & OFFLINE USAGE

**Q: Mobile needs:**
- Will SSS staff use mobile phones for:
  - Viewing cases (read-only)?
  - Adding quick session notes?
  - Full case management?

**Q: Offline frequency:**
- How often does internet go down at school?
  - Daily?
  - Weekly?
  - Occasionally?
  - Should app be "offline-first" or "online-first with offline fallback"?

---

## 14. MULTI-SCHOOL EXPANSION

**Q: Future schools:**
- Other 2 schools in different Spanish cities
  - Same SSS structure and protocols?
  - Or different processes?
  - Same team or separate teams?
  - Should app be built multi-tenant from the start or add later?

---

## 15. TIMELINE & GO-LIVE

**Q: MVP deadline:**
- January 2026 - is this:
  - Hard deadline or flexible?
  - Does it need to be production-ready for 50+ users?
  - Or small pilot with core team first?

**Q: Training & rollout:**
- Who needs training?
  - Just SSS team + teachers?
  - Also parents?
  - Also principals?

**Q: What's the MINIMUM feature set for go-live?**
- Case management + interventions + sessions?
- Or also need protocols + evaluations?
- Or all features functional before launch?

---

## ANSWERS (Fill in)

Please provide answers to the questions above (or just the critical ones). This will help me:
1. Prioritize features for MVP
2. Design the correct data structures
3. Create accurate Claude Agent prompts
4. Build forms and dashboards that match your actual workflow

---

**Note to Carlos:** Once you have Wendy's answers to these, we can refine the specification and start writing the actual code. Some of these answers will determine the complexity of the data model and which features are in MVP vs. Phase 2.
