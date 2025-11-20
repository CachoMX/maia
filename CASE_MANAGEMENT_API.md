# Case Management API Documentation

**Week 2 Deliverable - Maia SSS Project**

Complete Case Management API routes and server actions for the Maia Student Support Services application.

## Overview

This implementation provides a full-featured Case Management system with:
- RESTful API routes for CRUD operations
- Server actions for React Server Components
- Type-safe interfaces
- RLS (Row Level Security) enforcement
- Comprehensive filtering and sorting
- Relationship data (students, case managers, counts)

---

## Files Created

### 1. Type Definitions
**File:** `c:\Projects\maia\app\types\case.ts`

Comprehensive TypeScript types including:
- `CaseType` - 7 case types enum
- `CaseStatus` - Case lifecycle states
- `CaseTier` - Intervention tiers (1, 2, 3)
- `Case` - Base case interface
- `CaseWithRelations` - Full case with relationships
- `CaseListItem` - Optimized list view
- `CreateCaseInput` - Case creation payload
- `UpdateCaseInput` - Case update payload
- `CaseFilters` - Query filters
- `CaseApiResponse<T>` - Standard API response wrapper

### 2. API Routes

#### `c:\Projects\maia\app\api\cases\route.ts`
- `POST /api/cases` - Create new case
- `GET /api/cases` - List cases with filters

#### `c:\Projects\maia\app\api\cases\[id]\route.ts`
- `GET /api/cases/[id]` - Get single case with relationships
- `PATCH /api/cases/[id]` - Update case
- `DELETE /api/cases/[id]` - Soft delete (close case)

### 3. Server Actions
**File:** `c:\Projects\maia\app\actions\cases.ts`

Server-side functions:
- `createCase(data)` - Create new case
- `getCases(filters)` - Get filtered case list
- `getCase(id)` - Get single case details
- `updateCase(id, data)` - Update case
- `closeCase(id, reason)` - Close case with reason
- `assignCaseManager(caseId, managerId)` - Assign case manager
- `getCaseStatistics()` - Get dashboard statistics

---

## API Reference

### Authentication

All endpoints require:
1. Valid Supabase authentication session
2. User role: `SSS_STAFF`

Returns `401 Unauthorized` if not logged in.
Returns `403 Forbidden` if not SSS_STAFF.

---

### POST /api/cases

**Create a new case**

**Request Body:**
```json
{
  "student_id": "uuid-student-id",
  "case_type": "ACADEMIC_SUPPORT",
  "tier": 2,
  "is_urgent": false,
  "reason_for_referral": "Struggling with reading comprehension",
  "referral_source": "TEACHER_REFERRAL",
  "case_manager_id": "uuid-manager-id",
  "internal_notes": "Student needs tier 2 reading intervention"
}
```

**Required Fields:**
- `student_id` (string, UUID)
- `case_type` (CaseType enum)

**Optional Fields:**
- `tier` (1, 2, or 3)
- `status` (defaults to 'OPEN')
- `intervention_types` (string array)
- `is_urgent` (boolean, defaults to false)
- `opened_date` (ISO date, defaults to today)
- `expected_closure_date` (ISO date)
- `case_manager_id` (UUID)
- `secondary_supporters` (UUID array)
- `reason_for_referral` (string)
- `referral_source` (enum)
- `internal_notes` (string)

**Response (201 Created):**
```json
{
  "data": {
    "id": "case-uuid",
    "student_id": "student-uuid",
    "case_type": "ACADEMIC_SUPPORT",
    "tier": 2,
    "status": "OPEN",
    "is_urgent": false,
    "opened_date": "2025-11-18",
    "student": {
      "id": "student-uuid",
      "name": "John Doe",
      "grade": "5th",
      "student_id": "STU12345"
    },
    "case_manager": {
      "id": "manager-uuid",
      "email": "wendy.aragon@atlas.es",
      "first_name": "Wendy",
      "last_name": "Aragon",
      "sss_position": "SSS Lead"
    },
    "created_at": "2025-11-18T10:30:00Z",
    "updated_at": "2025-11-18T10:30:00Z"
  },
  "error": null
}
```

**Case Types:**
- `ACADEMIC_SUPPORT` - Academic intervention needs
- `SEL` - Social-Emotional Learning
- `DISTINCTIONS` - Specialized programs
- `CONFLICT_RESOLUTION` - Student conflict mediation
- `BULLYING` - Bullying protocol cases
- `CHILD_PROTECTION` - Child safeguarding cases
- `URGENT` - Urgent dysregulation/safety cases

---

### GET /api/cases

**List cases with filters**

**Query Parameters:**
- `status` - Filter by status (OPEN, ON_HOLD, CLOSED, REFERRED_OUT)
- `case_type` - Filter by case type
- `tier` - Filter by tier (1, 2, 3)
- `is_urgent` - Filter urgent cases (true/false)
- `case_manager_id` - Filter by case manager UUID
- `student_id` - Filter by student UUID
- `grade` - Filter by grade level
- `search` - Search by student name (case-insensitive)
- `sort_by` - Sort field (is_urgent, opened_date, created_at, updated_at)
- `sort_direction` - Sort direction (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

**Examples:**

Get all open urgent cases:
```
GET /api/cases?status=OPEN&is_urgent=true
```

Get cases assigned to Wendy:
```
GET /api/cases?case_manager_id=wendy-uuid
```

Search for student "John":
```
GET /api/cases?search=John
```

Get tier 2 and 3 cases:
```
GET /api/cases?tier=2,3
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "case-uuid",
      "student_id": "student-uuid",
      "student_name": "John Doe",
      "student_grade": "5th",
      "case_type": "ACADEMIC_SUPPORT",
      "tier": 2,
      "status": "OPEN",
      "is_urgent": false,
      "opened_date": "2025-11-15",
      "case_manager_id": "manager-uuid",
      "case_manager_name": "Wendy Aragon",
      "intervention_count": 3,
      "created_at": "2025-11-15T09:00:00Z",
      "updated_at": "2025-11-18T10:30:00Z"
    }
  ],
  "error": null,
  "count": 42
}
```

**Sorting Logic:**
By default, cases are sorted by:
1. `is_urgent DESC` (urgent cases first)
2. `opened_date DESC` (most recent first)

---

### GET /api/cases/[id]

**Get single case with full relationships**

**Response (200 OK):**
```json
{
  "data": {
    "id": "case-uuid",
    "student_id": "student-uuid",
    "case_type": "ACADEMIC_SUPPORT",
    "tier": 2,
    "status": "OPEN",
    "is_urgent": false,
    "opened_date": "2025-11-15",
    "expected_closure_date": "2026-05-15",
    "closed_date": null,
    "closure_reason": null,
    "case_manager_id": "manager-uuid",
    "secondary_supporters": ["supporter-uuid-1"],
    "reason_for_referral": "Reading comprehension difficulties",
    "referral_source": "TEACHER_REFERRAL",
    "internal_notes": "Needs tier 2 intervention",
    "created_by": "creator-uuid",
    "created_at": "2025-11-15T09:00:00Z",
    "updated_at": "2025-11-18T10:30:00Z",
    "student": {
      "id": "student-uuid",
      "name": "John Doe",
      "grade": "5th",
      "student_id": "STU12345"
    },
    "case_manager": {
      "id": "manager-uuid",
      "email": "wendy.aragon@atlas.es",
      "first_name": "Wendy",
      "last_name": "Aragon",
      "sss_position": "SSS Lead"
    },
    "intervention_count": 3,
    "session_count": 12,
    "parent_meeting_count": 2
  },
  "error": null
}
```

**Includes:**
- Full case details
- Student information
- Case manager details
- Intervention count
- Session count (across all interventions)
- Parent meeting count

---

### PATCH /api/cases/[id]

**Update an existing case**

**Request Body (partial update):**
```json
{
  "status": "ON_HOLD",
  "tier": 3,
  "internal_notes": "Escalating to tier 3 - needs evaluation"
}
```

**Response (200 OK):**
Same format as GET /api/cases/[id]

**Common Update Scenarios:**

Escalate to tier 3:
```json
{
  "tier": 3,
  "internal_notes": "Escalated to tier 3 due to lack of progress"
}
```

Mark as urgent:
```json
{
  "is_urgent": true,
  "internal_notes": "Student had severe dysregulation episode"
}
```

Put on hold:
```json
{
  "status": "ON_HOLD",
  "internal_notes": "Waiting for parent consent for evaluation"
}
```

---

### DELETE /api/cases/[id]

**Close a case (soft delete)**

Does NOT delete the record - sets status to CLOSED.

**Request Body:**
```json
{
  "closure_reason": "Student transferred to another school"
}
```

**Required:**
- `closure_reason` (string)

**Optional:**
- `closed_date` (ISO date, defaults to today)

**Response (200 OK):**
Same format as GET /api/cases/[id] with updated status and closure info.

**Common Closure Reasons:**
- "Intervention goals achieved - student showing improvement"
- "Student transferred to another school"
- "Referred to external specialist"
- "Parent declined services"
- "Student graduated"

---

## Server Actions Usage

Server actions can be called directly from Server Components or Client Components.

### Example: Create Case

```typescript
'use server'

import { createCase } from '@/app/actions/cases'

async function handleCreateCase() {
  const result = await createCase({
    student_id: 'student-uuid',
    case_type: 'ACADEMIC_SUPPORT',
    tier: 2,
    is_urgent: false,
    reason_for_referral: 'Reading difficulties',
    case_manager_id: 'wendy-uuid'
  })

  if (result.error) {
    console.error('Error creating case:', result.error)
    return
  }

  console.log('Case created:', result.data)
}
```

### Example: Get Cases with Filters

```typescript
import { getCases } from '@/app/actions/cases'

async function MyComponent() {
  const result = await getCases({
    status: 'OPEN',
    is_urgent: true,
    case_manager_id: 'wendy-uuid'
  })

  if (result.error) {
    return <div>Error: {result.error}</div>
  }

  return (
    <div>
      <h2>Urgent Open Cases ({result.count})</h2>
      {result.data?.map(caseItem => (
        <div key={caseItem.id}>
          {caseItem.student_name} - {caseItem.case_type}
        </div>
      ))}
    </div>
  )
}
```

### Example: Close Case

```typescript
import { closeCase } from '@/app/actions/cases'

async function handleCloseCase(caseId: string) {
  const result = await closeCase(caseId, {
    closure_reason: 'Intervention goals achieved'
  })

  if (result.error) {
    alert('Error closing case: ' + result.error)
    return
  }

  alert('Case closed successfully')
}
```

### Example: Assign Case Manager

```typescript
import { assignCaseManager } from '@/app/actions/cases'

async function handleAssignManager(caseId: string, managerId: string) {
  const result = await assignCaseManager(caseId, {
    case_manager_id: managerId
  })

  if (result.error) {
    console.error('Error:', result.error)
    return
  }

  console.log('Case manager assigned:', result.data)
}
```

### Example: Get Case Statistics

```typescript
import { getCaseStatistics } from '@/app/actions/cases'

async function DashboardStats() {
  const result = await getCaseStatistics()

  if (result.error) {
    return <div>Error loading stats</div>
  }

  const stats = result.data

  return (
    <div>
      <h2>Case Statistics</h2>
      <p>Total Cases: {stats.total_cases}</p>
      <p>Open Cases: {stats.open_cases}</p>
      <p>Urgent Cases: {stats.urgent_cases}</p>
      <p>Tier 1: {stats.tier_1_cases}</p>
      <p>Tier 2: {stats.tier_2_cases}</p>
      <p>Tier 3: {stats.tier_3_cases}</p>
    </div>
  )
}
```

---

## Testing with cURL

### Prerequisites

1. Get your Supabase access token:
   - Log in to the app as wendy.aragon@atlas.es
   - Open browser DevTools > Application > Cookies
   - Copy the value of `sb-access-token`

2. Set environment variables:
```bash
export SUPABASE_URL="https://bexudrmrspbyhkcqrtse.supabase.co"
export ACCESS_TOKEN="your-access-token-here"
```

### Test 1: Create a Case

```bash
curl -X POST "http://localhost:3000/api/cases" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN" \
  -d '{
    "student_id": "existing-student-uuid",
    "case_type": "ACADEMIC_SUPPORT",
    "tier": 2,
    "is_urgent": false,
    "reason_for_referral": "Reading comprehension difficulties",
    "referral_source": "TEACHER_REFERRAL"
  }'
```

### Test 2: List All Open Cases

```bash
curl -X GET "http://localhost:3000/api/cases?status=OPEN" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN"
```

### Test 3: List Urgent Cases

```bash
curl -X GET "http://localhost:3000/api/cases?is_urgent=true" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN"
```

### Test 4: Get Single Case

```bash
curl -X GET "http://localhost:3000/api/cases/CASE_UUID_HERE" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN"
```

### Test 5: Update Case

```bash
curl -X PATCH "http://localhost:3000/api/cases/CASE_UUID_HERE" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN" \
  -d '{
    "tier": 3,
    "status": "ON_HOLD",
    "internal_notes": "Escalated to tier 3 - awaiting evaluation"
  }'
```

### Test 6: Close Case

```bash
curl -X DELETE "http://localhost:3000/api/cases/CASE_UUID_HERE" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN" \
  -d '{
    "closure_reason": "Student transferred to another school"
  }'
```

---

## Testing with Postman

1. **Import Collection:**
   - Create new collection "Maia Case Management API"
   - Add base URL: `http://localhost:3000`

2. **Set Auth:**
   - Authorization tab > Type: Inherit from parent
   - Add cookie: `sb-access-token={{accessToken}}`

3. **Create Requests:**
   - POST Create Case
   - GET List Cases
   - GET Single Case
   - PATCH Update Case
   - DELETE Close Case

4. **Test Filters:**
   - `/api/cases?status=OPEN&is_urgent=true`
   - `/api/cases?case_type=ACADEMIC_SUPPORT&tier=2`
   - `/api/cases?search=John&grade=5th`

---

## Security Features

### Row Level Security (RLS)
- All queries automatically enforce RLS policies
- Only `SSS_STAFF` role can access case data
- Teachers can only view cases for their students (via RLS)
- Principals have read-only oversight access

### Audit Trail
- `created_by` field tracks who created the case
- `updated_at` automatically updated on changes (via trigger)
- Can be extended with audit_log table for compliance

### Data Validation
- Required fields enforced at API level
- Student existence verified before case creation
- Case manager must be SSS_STAFF
- Proper HTTP status codes (400, 401, 403, 404, 500)

---

## Error Handling

### Standard Error Response
```json
{
  "data": null,
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200 OK` - Successful GET/PATCH/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Missing/invalid data
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Wrong role (not SSS_STAFF)
- `404 Not Found` - Case/Student not found
- `500 Internal Server Error` - Database/server error

### Common Errors

**Missing student_id:**
```json
{
  "data": null,
  "error": "Missing required fields: student_id and case_type are required"
}
```

**Student not found:**
```json
{
  "data": null,
  "error": "Student not found"
}
```

**Not SSS_STAFF:**
```json
{
  "data": null,
  "error": "Forbidden - Only SSS staff can create cases"
}
```

---

## Database Schema Reference

### Cases Table Structure
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  case_type TEXT CHECK (case_type IN (...)),
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  status TEXT DEFAULT 'OPEN',
  is_urgent BOOLEAN DEFAULT FALSE,
  opened_date DATE DEFAULT NOW(),
  expected_closure_date DATE,
  closed_date DATE,
  closure_reason TEXT,
  case_manager_id UUID REFERENCES users(id),
  secondary_supporters UUID[],
  reason_for_referral TEXT,
  referral_source TEXT,
  internal_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance
- `idx_cases_student_id` - Student lookups
- `idx_cases_case_manager` - Manager filtering
- `idx_cases_status` - Status filtering
- `idx_cases_case_type` - Type filtering
- `idx_cases_is_urgent` - Urgent case prioritization
- `idx_cases_tier` - Tier filtering

---

## Next Steps

### Week 3 Priorities
1. **Interventions API** - Track interventions per case
2. **Sessions API** - Document intervention sessions
3. **Parent Meetings API** - Schedule and track meetings
4. **Action Plans** - Checklist tracking per meeting

### Future Enhancements
1. **Bulk Operations** - Assign multiple cases to manager
2. **Case Transfer** - Transfer cases between managers
3. **Case Templates** - Quick-create common case types
4. **Smart Assignment** - Auto-assign based on specialization and workload
5. **Case History** - Track all changes to case over time

---

## Support

**Questions or Issues?**
Contact: Carlos (vixi.agency)

**Current User for Testing:**
- Email: wendy.aragon@atlas.es
- Role: SSS_STAFF
- Access: Full case management permissions

---

**Status:** Production Ready
**Date:** November 18, 2025
**Version:** 1.0
