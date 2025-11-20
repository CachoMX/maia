# Maia API Documentation
## Student Support Services Platform - REST API Reference

**Version:** 1.0 (Week 2)
**Base URL:** `https://your-app.vercel.app/api` (Production) | `http://localhost:3000/api` (Development)
**Authentication:** Supabase JWT via cookies
**Last Updated:** November 18, 2025

---

## Table of Contents
1. [Authentication](#authentication)
2. [Cases API](#cases-api)
3. [Interventions API](#interventions-api)
4. [Sessions API](#sessions-api)
5. [Students API](#students-api)
6. [Files API](#files-api)
7. [Dashboard API](#dashboard-api)
8. [Error Handling](#error-handling)
9. [Rate Limits](#rate-limits)
10. [Code Examples](#code-examples)

---

## Authentication

All API endpoints require authentication via Supabase JWT token passed in cookies.

### Authentication Flow
1. User logs in via `/login` page
2. Supabase sets auth cookie automatically
3. Middleware validates cookie on each request
4. RLS policies enforce data access based on user role

### User Roles
- `SSS_STAFF` - Full access to all cases and data
- `TEACHER` - Read-only access to own students' cases
- `PRINCIPAL_ADMIN` - Read-only access to all data
- `PARENT` - Not implemented in MVP

### Authentication Headers
No manual headers required - authentication handled via HTTP-only cookies set by Supabase Auth.

---

## Cases API

### List All Cases
Get a list of cases with optional filtering and pagination.

**Endpoint:** `GET /api/cases`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by status | `?status=Open` |
| `case_type` | string | Filter by type | `?case_type=Academic Support` |
| `tier` | number | Filter by tier | `?tier=2` |
| `is_urgent` | boolean | Filter urgent cases | `?is_urgent=true` |
| `case_manager_id` | uuid | Filter by case manager | `?case_manager_id=uuid` |
| `student_id` | uuid | Filter by student | `?student_id=uuid` |
| `grade` | string | Filter by student grade | `?grade=5` |
| `limit` | number | Results per page (default: 50) | `?limit=25` |
| `offset` | number | Pagination offset | `?offset=50` |
| `sort_by` | string | Sort field | `?sort_by=created_at` |
| `sort_order` | string | Sort direction (asc/desc) | `?sort_order=desc` |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "case_type": "Academic Support",
      "status": "Open",
      "tier": 2,
      "is_urgent": false,
      "case_manager_id": "uuid",
      "opened_date": "2025-11-01T10:00:00Z",
      "closed_date": null,
      "description": "Reading intervention needed",
      "created_at": "2025-11-01T10:00:00Z",
      "updated_at": "2025-11-15T14:30:00Z",
      "student": {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "grade": "5"
      },
      "case_manager": {
        "id": "uuid",
        "full_name": "Wendy Aragón",
        "email": "wendy.aragon@atlas.es"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

**cURL Example:**
```bash
curl -X GET 'http://localhost:3000/api/cases?status=Open&is_urgent=true' \
  --cookie 'your-auth-cookie'
```

**Fetch Example:**
```javascript
const response = await fetch('/api/cases?status=Open&is_urgent=true');
const { data, pagination } = await response.json();
```

**Axios Example:**
```javascript
const { data } = await axios.get('/api/cases', {
  params: {
    status: 'Open',
    is_urgent: true,
    limit: 25
  }
});
```

---

### Get Single Case
Retrieve detailed information about a specific case.

**Endpoint:** `GET /api/cases/[id]`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Case ID |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "student_id": "uuid",
    "case_type": "Academic Support",
    "status": "Open",
    "tier": 2,
    "is_urgent": false,
    "case_manager_id": "uuid",
    "opened_date": "2025-11-01T10:00:00Z",
    "closed_date": null,
    "closure_reason": null,
    "description": "Reading intervention needed. Student struggling with comprehension.",
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-15T14:30:00Z",
    "student": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "grade": "5",
      "date_of_birth": "2015-03-15"
    },
    "case_manager": {
      "id": "uuid",
      "full_name": "Wendy Aragón",
      "email": "wendy.aragon@atlas.es",
      "role": "SSS_STAFF"
    },
    "interventions": [
      {
        "id": "uuid",
        "intervention_type": "Academic",
        "name": "Reading Comprehension Program",
        "status": "Active"
      }
    ],
    "files": [
      {
        "id": "uuid",
        "file_name": "assessment_results.pdf",
        "file_url": "https://storage.url/file.pdf",
        "uploaded_at": "2025-11-05T09:00:00Z"
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X GET 'http://localhost:3000/api/cases/uuid-here' \
  --cookie 'your-auth-cookie'
```

**Fetch Example:**
```javascript
const response = await fetch(`/api/cases/${caseId}`);
const { data } = await response.json();
```

---

### Create New Case
Create a new case for a student.

**Endpoint:** `POST /api/cases`

**Request Body:**
```json
{
  "student_id": "uuid",
  "case_type": "Academic Support",
  "tier": 1,
  "is_urgent": false,
  "case_manager_id": "uuid",
  "description": "Student needs reading support",
  "opened_date": "2025-11-18"
}
```

**Required Fields:**
- `student_id` (uuid)
- `case_type` (enum: 'Academic Support', 'SEL', 'Distinctions', 'Conflict Resolution', 'Bullying', 'Child Protection', 'Urgent')
- `tier` (number: 1, 2, or 3)

**Optional Fields:**
- `is_urgent` (boolean, default: false)
- `case_manager_id` (uuid, can be auto-assigned)
- `description` (text)
- `opened_date` (date, default: today)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "id": "uuid",
    "student_id": "uuid",
    "case_type": "Academic Support",
    "status": "Open",
    "tier": 1,
    "is_urgent": false,
    "case_manager_id": "uuid",
    "opened_date": "2025-11-18T00:00:00Z",
    "created_at": "2025-11-18T10:30:00Z",
    "updated_at": "2025-11-18T10:30:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST 'http://localhost:3000/api/cases' \
  -H 'Content-Type: application/json' \
  --cookie 'your-auth-cookie' \
  -d '{
    "student_id": "uuid",
    "case_type": "Academic Support",
    "tier": 1,
    "description": "Reading intervention needed"
  }'
```

**Fetch Example:**
```javascript
const response = await fetch('/api/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: studentId,
    case_type: 'Academic Support',
    tier: 1,
    description: 'Reading intervention needed'
  })
});
const { data } = await response.json();
```

**Axios Example:**
```javascript
const { data } = await axios.post('/api/cases', {
  student_id: studentId,
  case_type: 'Academic Support',
  tier: 1,
  description: 'Reading intervention needed'
});
```

---

### Update Case
Update an existing case.

**Endpoint:** `PATCH /api/cases/[id]`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Case ID |

**Request Body:** (All fields optional)
```json
{
  "status": "On Hold",
  "tier": 2,
  "is_urgent": true,
  "case_manager_id": "uuid",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Case updated successfully",
  "data": {
    "id": "uuid",
    "status": "On Hold",
    "tier": 2,
    "is_urgent": true,
    "updated_at": "2025-11-18T11:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH 'http://localhost:3000/api/cases/uuid-here' \
  -H 'Content-Type: application/json' \
  --cookie 'your-auth-cookie' \
  -d '{"status": "On Hold", "is_urgent": true}'
```

**Fetch Example:**
```javascript
const response = await fetch(`/api/cases/${caseId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'On Hold',
    is_urgent: true
  })
});
```

---

### Close Case
Close a case with a closure reason.

**Endpoint:** `PATCH /api/cases/[id]`

**Request Body:**
```json
{
  "status": "Closed",
  "closure_reason": "Student has shown significant improvement",
  "closed_date": "2025-11-18"
}
```

**Response:** `200 OK`

---

### Delete Case
Soft delete a case (archives it).

**Endpoint:** `DELETE /api/cases/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Case deleted successfully"
}
```

**Note:** Cases are soft-deleted (archived) not permanently removed.

---

### Get Urgent Cases
Get all cases marked as urgent.

**Endpoint:** `GET /api/cases/urgent`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "case_type": "Child Protection",
      "is_urgent": true,
      "case_manager_id": "uuid",
      "student": {
        "first_name": "Jane",
        "last_name": "Smith",
        "grade": "8"
      }
    }
  ]
}
```

---

### Get My Assigned Cases
Get all cases assigned to the current user.

**Endpoint:** `GET /api/cases/my-cases`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "case_type": "Academic Support",
      "status": "Open",
      "tier": 2,
      "is_urgent": false
    }
  ]
}
```

---

## Interventions API

### List Interventions
Get all interventions, optionally filtered by case.

**Endpoint:** `GET /api/interventions`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `case_id` | uuid | Filter by case |
| `intervention_type` | string | Filter by type |
| `status` | string | Filter by status |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "case_id": "uuid",
      "intervention_type": "Academic",
      "name": "Reading Comprehension Program",
      "description": "Tier 2 reading intervention",
      "start_date": "2025-11-01",
      "end_date": null,
      "frequency": "3x per week",
      "duration_minutes": 30,
      "status": "Active",
      "created_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### Get Single Intervention
Retrieve detailed information about a specific intervention.

**Endpoint:** `GET /api/interventions/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "case_id": "uuid",
    "intervention_type": "Academic",
    "name": "Reading Comprehension Program",
    "description": "Tier 2 reading intervention focusing on comprehension strategies",
    "start_date": "2025-11-01",
    "end_date": null,
    "frequency": "3x per week",
    "duration_minutes": 30,
    "status": "Active",
    "created_at": "2025-11-01T10:00:00Z",
    "sessions": [
      {
        "id": "uuid",
        "session_date": "2025-11-05",
        "attendance": "Present",
        "notes": "Good progress today"
      }
    ]
  }
}
```

---

### Create Intervention
Create a new intervention for a case.

**Endpoint:** `POST /api/interventions`

**Request Body:**
```json
{
  "case_id": "uuid",
  "intervention_type": "Academic",
  "name": "Reading Comprehension Program",
  "description": "Tier 2 reading intervention",
  "start_date": "2025-11-18",
  "frequency": "3x per week",
  "duration_minutes": 30
}
```

**Required Fields:**
- `case_id` (uuid)
- `intervention_type` (enum: 'Academic', 'SEL', 'Distinctions')
- `name` (string)

**Response:** `201 Created`

**cURL Example:**
```bash
curl -X POST 'http://localhost:3000/api/interventions' \
  -H 'Content-Type: application/json' \
  --cookie 'your-auth-cookie' \
  -d '{
    "case_id": "uuid",
    "intervention_type": "Academic",
    "name": "Reading Comprehension Program",
    "start_date": "2025-11-18"
  }'
```

---

### Update Intervention
Update an existing intervention.

**Endpoint:** `PATCH /api/interventions/[id]`

**Request Body:**
```json
{
  "status": "Completed",
  "end_date": "2025-12-15",
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

### Delete Intervention
Delete an intervention.

**Endpoint:** `DELETE /api/interventions/[id]`

**Response:** `200 OK`

---

## Sessions API

### List Sessions
Get all sessions for an intervention.

**Endpoint:** `GET /api/sessions`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `intervention_id` | uuid | Filter by intervention (required) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "intervention_id": "uuid",
      "session_date": "2025-11-05",
      "attendance": "Present",
      "notes": "Student showed good progress with comprehension strategies",
      "progress_rating": 4,
      "challenges": "Still struggling with vocabulary",
      "created_at": "2025-11-05T14:00:00Z"
    }
  ]
}
```

---

### Get Single Session
Retrieve detailed information about a specific session.

**Endpoint:** `GET /api/sessions/[id]`

**Response:** `200 OK`

---

### Create Session
Document a new session for an intervention.

**Endpoint:** `POST /api/sessions`

**Request Body:**
```json
{
  "intervention_id": "uuid",
  "session_date": "2025-11-18",
  "attendance": "Present",
  "notes": "Good session today. Student engaged with material.",
  "progress_rating": 4,
  "challenges": "Still needs support with inference"
}
```

**Required Fields:**
- `intervention_id` (uuid)
- `session_date` (date)
- `attendance` (enum: 'Present', 'Absent', 'Excused')

**Optional Fields:**
- `notes` (text)
- `progress_rating` (number 1-5)
- `challenges` (text)

**Response:** `201 Created`

**Fetch Example:**
```javascript
const response = await fetch('/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intervention_id: interventionId,
    session_date: '2025-11-18',
    attendance: 'Present',
    notes: 'Good progress today',
    progress_rating: 4
  })
});
```

---

### Update Session
Update an existing session.

**Endpoint:** `PATCH /api/sessions/[id]`

**Request Body:**
```json
{
  "notes": "Updated notes",
  "progress_rating": 5
}
```

**Response:** `200 OK`

---

### Delete Session
Delete a session.

**Endpoint:** `DELETE /api/sessions/[id]`

**Response:** `200 OK`

---

## Students API

### List Students
Get all students with search and filtering.

**Endpoint:** `GET /api/students`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name | `?search=john` |
| `grade` | string | Filter by grade | `?grade=5` |
| `has_active_cases` | boolean | Filter students with active cases | `?has_active_cases=true` |
| `limit` | number | Results per page | `?limit=50` |
| `offset` | number | Pagination offset | `?offset=0` |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "grade": "5",
      "date_of_birth": "2015-03-15",
      "active_cases_count": 2,
      "created_at": "2025-09-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0
  }
}
```

**Fetch Example:**
```javascript
const response = await fetch('/api/students?search=john&grade=5');
const { data } = await response.json();
```

---

### Get Single Student
Retrieve detailed student information including all cases.

**Endpoint:** `GET /api/students/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "grade": "5",
    "date_of_birth": "2015-03-15",
    "created_at": "2025-09-01T10:00:00Z",
    "cases": [
      {
        "id": "uuid",
        "case_type": "Academic Support",
        "status": "Open",
        "tier": 2,
        "is_urgent": false,
        "opened_date": "2025-11-01"
      }
    ],
    "behavior_incidents": [
      {
        "id": "uuid",
        "incident_date": "2025-10-15",
        "incident_type": "Minor disruption",
        "restorative_process_completed": true
      }
    ]
  }
}
```

---

### Create Student
Create a new student record.

**Endpoint:** `POST /api/students`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "grade": "5",
  "date_of_birth": "2015-03-15"
}
```

**Required Fields:**
- `first_name` (string)
- `last_name` (string)
- `grade` (string)

**Response:** `201 Created`

---

### Update Student
Update student information.

**Endpoint:** `PATCH /api/students/[id]`

**Request Body:**
```json
{
  "grade": "6"
}
```

**Response:** `200 OK`

---

### Delete Student
Soft delete a student.

**Endpoint:** `DELETE /api/students/[id]`

**Response:** `200 OK`

---

## Files API

### Upload File
Upload a file to Supabase Storage and create a file record.

**Endpoint:** `POST /api/files/upload`

**Request:** Multipart form data

**Form Fields:**
- `file` (file) - The file to upload
- `related_to_type` (string) - Entity type: 'case', 'intervention', 'session'
- `related_to_id` (uuid) - Entity ID

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid",
    "file_name": "assessment_results.pdf",
    "file_url": "https://storage.supabase.co/...",
    "file_type": "application/pdf",
    "file_size": 245678,
    "related_to_type": "case",
    "related_to_id": "uuid",
    "uploaded_at": "2025-11-18T10:30:00Z"
  }
}
```

**Fetch Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('related_to_type', 'case');
formData.append('related_to_id', caseId);

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
});
const { data } = await response.json();
```

**Allowed File Types:**
- Documents: PDF, DOCX, DOC
- Images: JPG, JPEG, PNG
- Max file size: 10MB

---

### Get File Metadata
Get file information.

**Endpoint:** `GET /api/files/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "file_name": "assessment_results.pdf",
    "file_url": "https://storage.supabase.co/...",
    "file_type": "application/pdf",
    "file_size": 245678,
    "uploaded_at": "2025-11-18T10:30:00Z"
  }
}
```

---

### Delete File
Delete a file from storage and database.

**Endpoint:** `DELETE /api/files/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Dashboard API

### Get Dashboard Statistics
Get overview statistics for the dashboard.

**Endpoint:** `GET /api/dashboard/stats`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_cases": 150,
    "open_cases": 120,
    "urgent_cases": 5,
    "my_assigned_cases": 15,
    "cases_by_type": {
      "Academic Support": 80,
      "SEL": 35,
      "Bullying": 3,
      "Child Protection": 2,
      "Conflict Resolution": 20,
      "Distinctions": 5,
      "Urgent": 5
    },
    "cases_by_tier": {
      "tier_1": 90,
      "tier_2": 45,
      "tier_3": 15
    },
    "upcoming_parent_meetings": 8,
    "action_items_due_this_week": 12
  }
}
```

**Fetch Example:**
```javascript
const response = await fetch('/api/dashboard/stats');
const { data } = await response.json();
```

---

### Get Case Load
Get case load for all staff members or a specific staff member.

**Endpoint:** `GET /api/dashboard/case-load`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `staff_id` | uuid | Get case load for specific staff member (optional) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "staff_id": "uuid",
      "staff_name": "Wendy Aragón",
      "total_cases": 35,
      "open_cases": 28,
      "on_hold_cases": 5,
      "tier_1_cases": 15,
      "tier_2_cases": 12,
      "tier_3_cases": 8,
      "urgent_cases": 2,
      "workload_status": "yellow"
    }
  ]
}
```

**Workload Status:**
- `green` - Under capacity (< 15 active cases)
- `yellow` - At capacity (15-40 active cases)
- `red` - Over capacity (> 40 active cases)

---

### Get Urgent Items
Get all urgent cases and action items.

**Endpoint:** `GET /api/dashboard/urgent`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "urgent_cases": [
      {
        "id": "uuid",
        "student_name": "Jane Smith",
        "case_type": "Child Protection",
        "opened_date": "2025-11-15"
      }
    ],
    "overdue_action_items": [
      {
        "id": "uuid",
        "description": "Follow up with family",
        "due_date": "2025-11-10",
        "days_overdue": 8
      }
    ]
  }
}
```

---

## Error Handling

### Error Response Format
All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional context (optional)"
  }
}
```

### HTTP Status Codes
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Codes
| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | User must be logged in |
| `INSUFFICIENT_PERMISSIONS` | User doesn't have required role |
| `VALIDATION_ERROR` | Request data failed validation |
| `NOT_FOUND` | Resource doesn't exist |
| `DUPLICATE_ENTRY` | Resource already exists |
| `FILE_TOO_LARGE` | File exceeds 10MB limit |
| `INVALID_FILE_TYPE` | File type not allowed |
| `DATABASE_ERROR` | Database query failed |

### Example Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required. Please log in."
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to access this resource.",
    "details": "Required role: SSS_STAFF. Your role: TEACHER"
  }
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "case_type": "Must be one of: Academic Support, SEL, Distinctions, Conflict Resolution, Bullying, Child Protection, Urgent",
      "tier": "Must be 1, 2, or 3"
    }
  }
}
```

---

## Rate Limits

### Current Limits
- **Not implemented in Week 2**
- Future implementation: 100 requests per minute per user

### Rate Limit Headers (Future)
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637089200
```

---

## Code Examples

### React Hook for Fetching Cases
```javascript
import { useQuery } from '@tanstack/react-query';

function useCases(filters = {}) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/cases?${params}`);
      if (!response.ok) throw new Error('Failed to fetch cases');
      return response.json();
    }
  });
}

// Usage
function CasesList() {
  const { data, isLoading, error } = useCases({ status: 'Open', is_urgent: true });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.map(case => (
        <CaseCard key={case.id} case={case} />
      ))}
    </div>
  );
}
```

### Create Case with Error Handling
```javascript
async function createCase(caseData) {
  try {
    const response = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create case');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
}

// Usage
try {
  const newCase = await createCase({
    student_id: 'uuid',
    case_type: 'Academic Support',
    tier: 1,
    description: 'Reading intervention needed'
  });
  console.log('Case created:', newCase);
} catch (error) {
  alert(`Error: ${error.message}`);
}
```

### File Upload Component
```javascript
function FileUploadForm({ caseId }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('related_to_type', 'case');
      formData.append('related_to_id', caseId);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Upload failed');
      }

      alert('File uploaded successfully!');
    } catch (error) {
      alert(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        accept=".pdf,.docx,.jpg,.jpeg,.png"
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### Axios Interceptor for Error Handling
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      alert('You do not have permission to perform this action');
    } else if (error.response?.data?.error) {
      console.error('API Error:', error.response.data.error);
    }
    return Promise.reject(error);
  }
);

export default api;

// Usage
import api from './api';

const { data } = await api.get('/cases', { params: { status: 'Open' } });
const newCase = await api.post('/cases', caseData);
```

---

## Testing the API

### Using cURL
```bash
# Get all open cases
curl -X GET 'http://localhost:3000/api/cases?status=Open'

# Create a case
curl -X POST 'http://localhost:3000/api/cases' \
  -H 'Content-Type: application/json' \
  -d '{
    "student_id": "uuid",
    "case_type": "Academic Support",
    "tier": 1
  }'

# Upload a file
curl -X POST 'http://localhost:3000/api/files/upload' \
  -F 'file=@./document.pdf' \
  -F 'related_to_type=case' \
  -F 'related_to_id=uuid'
```

### Using Postman
1. Import collection (future: provide Postman collection JSON)
2. Set base URL to `http://localhost:3000/api`
3. Authentication handled automatically via cookies

### Using Thunder Client (VS Code)
Create `.thunder-client/collections.json` with API endpoints for testing.

---

## Version History

### Version 1.0 (Week 2 - November 2025)
- Initial API release
- Cases, Interventions, Sessions, Students, Files endpoints
- Dashboard statistics
- Authentication via Supabase
- RLS policy enforcement

### Planned for Version 1.1 (Week 3)
- Parent Meetings API
- Action Plan Items API
- Weekly reminder digest endpoint
- Google Calendar integration endpoints

### Planned for Version 1.2 (Week 4)
- Behavior Incidents API
- Restorative Process tracking
- Google Forms sync endpoints

---

## Support & Contact

**Technical Issues:** Carlos (vixi.agency)
**API Questions:** Check this documentation first
**Feature Requests:** Submit via project management tool

**Last Updated:** November 18, 2025
**Documentation Version:** 1.0
**API Version:** 1.0 (Week 2)
