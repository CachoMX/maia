/**
 * Individual Student API Routes
 *
 * Handles operations on a single student.
 * - GET /api/students/[id] - Get student with all cases
 * - PATCH /api/students/[id] - Update student
 *
 * @module app/api/students/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  UpdateStudentInput,
  StudentWithCases,
  StudentApiResponse,
} from '@/app/types/student'

/**
 * GET /api/students/[id]
 *
 * Retrieves a single student with all relationships including:
 * - Primary teacher details
 * - All cases (with full details)
 * - Case counts
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing student ID
 * @returns JSON response with student details or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.role !== 'SSS_STAFF') {
      return NextResponse.json(
        { data: null, error: 'Forbidden - Only SSS staff can view students' },
        { status: 403 }
      )
    }

    const studentId = params.id

    // Fetch student with primary teacher
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select(
        `
        *,
        primary_teacher:users!students_primary_teacher_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `
      )
      .eq('id', studentId)
      .single()

    if (studentError) {
      if (studentError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Student not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching student:', studentError)
      return NextResponse.json(
        { data: null, error: `Database error: ${studentError.message}` },
        { status: 500 }
      )
    }

    // Fetch all cases for this student
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select(
        `
        *,
        case_manager:users!cases_case_manager_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (casesError) {
      console.error('Error fetching cases:', casesError)
      return NextResponse.json(
        { data: null, error: `Database error: ${casesError.message}` },
        { status: 500 }
      )
    }

    // Calculate case counts
    const caseCount = cases?.length || 0
    const activeCaseCount = cases?.filter((c) => c.status === 'OPEN' || c.status === 'ON_HOLD').length || 0

    // Build StudentWithCases response
    const studentWithCases: StudentWithCases = {
      ...studentData,
      case_count: caseCount,
      active_case_count: activeCaseCount,
      cases: cases || [],
    }

    const response: StudentApiResponse<StudentWithCases> = {
      data: studentWithCases,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/students/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/students/[id]
 *
 * Updates an existing student. Only SSS_STAFF can update students.
 * Validates that the student exists before updating.
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing student ID
 * @returns JSON response with updated student or error
 *
 * @example
 * PATCH /api/students/uuid-here
 * {
 *   "grade": "6th",
 *   "primary_teacher_id": "new-teacher-uuid"
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Verify user is SSS_STAFF
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.role !== 'SSS_STAFF') {
      return NextResponse.json(
        { data: null, error: 'Forbidden - Only SSS staff can update students' },
        { status: 403 }
      )
    }

    const studentId = params.id

    // Verify student exists
    const { data: existingStudent, error: checkError } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .single()

    if (checkError || !existingStudent) {
      return NextResponse.json(
        { data: null, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateStudentInput = await request.json()

    // Update student
    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update(body)
      .eq('id', studentId)
      .select(
        `
        *,
        primary_teacher:users!students_primary_teacher_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `
      )
      .single()

    if (updateError) {
      console.error('Error updating student:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: StudentApiResponse<typeof updatedStudent> = {
      data: updatedStudent,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/students/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
