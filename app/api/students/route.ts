/**
 * Student API Routes
 *
 * Handles student creation and listing with filters.
 * - POST /api/students - Create new student
 * - GET /api/students - List students with filters
 *
 * @module app/api/students
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateStudentInput,
  StudentFilters,
  StudentApiResponse,
  StudentListItem,
} from '@/app/types/student'

/**
 * POST /api/students
 *
 * Creates a new student in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * @param request - Next.js request object with student data in body
 * @returns JSON response with created student or error
 *
 * @example
 * POST /api/students
 * {
 *   "name": "John Doe",
 *   "grade": "5th",
 *   "student_id": "ATL-12345",
 *   "primary_teacher_id": "uuid-here"
 * }
 */
export async function POST(request: NextRequest) {
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
        { data: null, error: 'Forbidden - Only SSS staff can create students' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateStudentInput = await request.json()

    // Validate required fields
    if (!body.name || !body.grade) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: name and grade are required' },
        { status: 400 }
      )
    }

    // Create student
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        name: body.name,
        grade: body.grade,
        date_of_birth: body.date_of_birth || null,
        student_id: body.student_id || null,
        nationality: body.nationality || null,
        mother_tongue: body.mother_tongue || null,
        start_date_at_atlas: body.start_date_at_atlas || null,
        previous_school: body.previous_school || null,
        primary_teacher_id: body.primary_teacher_id || null,
        school_id: body.school_id || null,
      })
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

    if (studentError) {
      console.error('Error creating student:', studentError)
      return NextResponse.json(
        { data: null, error: `Database error: ${studentError.message}` },
        { status: 500 }
      )
    }

    const response: StudentApiResponse<typeof studentData> = {
      data: studentData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/students
 *
 * Lists students with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with students array or error
 *
 * @example
 * GET /api/students?grade=5th
 * GET /api/students?search=John&archived=false
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: StudentFilters = {
      grade: searchParams.get('grade') || undefined,
      primary_teacher_id: searchParams.get('primary_teacher_id') || undefined,
      school_id: searchParams.get('school_id') || undefined,
      archived: searchParams.get('archived') === 'true' ? true : searchParams.get('archived') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('students')
      .select(
        `
        id,
        name,
        grade,
        student_id,
        primary_teacher_id,
        created_at,
        updated_at,
        archived_at,
        primary_teacher:users!students_primary_teacher_id_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.grade) {
      if (Array.isArray(filters.grade)) {
        query = query.in('grade', filters.grade)
      } else {
        query = query.eq('grade', filters.grade)
      }
    }

    if (filters.primary_teacher_id) {
      query = query.eq('primary_teacher_id', filters.primary_teacher_id)
    }

    if (filters.school_id) {
      query = query.eq('school_id', filters.school_id)
    }

    if (filters.archived === true) {
      query = query.not('archived_at', 'is', null)
    } else if (filters.archived === false) {
      query = query.is('archived_at', null)
    }

    if (filters.search) {
      // Search by student name or student_id
      query = query.or(`name.ilike.%${filters.search}%,student_id.ilike.%${filters.search}%`)
    }

    // Apply sorting
    query = query.order('name', { ascending: true })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: students, error: studentsError, count } = await query

    if (studentsError) {
      console.error('Error fetching students:', studentsError)
      return NextResponse.json(
        { data: null, error: `Database error: ${studentsError.message}` },
        { status: 500 }
      )
    }

    // Get case counts for each student
    const studentIds = students?.map((s) => s.id) || []

    let caseCounts: Record<string, { total: number; active: number }> = {}

    if (studentIds.length > 0) {
      const { data: cases } = await supabase
        .from('cases')
        .select('student_id, status')
        .in('student_id', studentIds)

      caseCounts = (cases || []).reduce((acc, caseItem) => {
        if (!acc[caseItem.student_id]) {
          acc[caseItem.student_id] = { total: 0, active: 0 }
        }
        acc[caseItem.student_id].total += 1
        if (caseItem.status === 'OPEN' || caseItem.status === 'ON_HOLD') {
          acc[caseItem.student_id].active += 1
        }
        return acc
      }, {} as Record<string, { total: number; active: number }>)
    }

    // Transform data to StudentListItem format
    const studentListItems: StudentListItem[] = (students || []).map((student: any) => ({
      id: student.id,
      name: student.name,
      grade: student.grade,
      student_id: student.student_id,
      primary_teacher_id: student.primary_teacher_id,
      primary_teacher_name: student.primary_teacher
        ? `${student.primary_teacher.first_name || ''} ${student.primary_teacher.last_name || ''}`.trim() || student.primary_teacher.email
        : null,
      case_count: caseCounts[student.id]?.total || 0,
      active_case_count: caseCounts[student.id]?.active || 0,
      created_at: student.created_at,
      updated_at: student.updated_at,
      archived_at: student.archived_at,
    }))

    const response: StudentApiResponse<StudentListItem[]> = {
      data: studentListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/students error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
