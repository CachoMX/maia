/**
 * File/Attachment API Routes
 *
 * Handles file metadata creation and listing with filters.
 * Note: This handles file metadata only. Actual file uploads should use
 * Supabase Storage separately.
 *
 * - POST /api/files - Create file metadata record
 * - GET /api/files - List files with filters
 *
 * @module app/api/files
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  CreateFileInput,
  FileFilters,
  FileApiResponse,
  FileListItem,
} from '@/app/types/file'

export const dynamic = 'force-dynamic'

/**
 * POST /api/files
 *
 * Creates a new file metadata record in the system.
 * Verifies user is SSS_STAFF before creating.
 *
 * NOTE: This endpoint only creates the metadata record.
 * Actual file upload should be done via Supabase Storage separately.
 *
 * @param request - Next.js request object with file metadata in body
 * @returns JSON response with created file metadata or error
 *
 * @example
 * POST /api/files
 * {
 *   "file_name": "student_report.pdf",
 *   "file_url": "https://storage.supabase.co/...",
 *   "file_type": "application/pdf",
 *   "file_size": 245678,
 *   "case_id": "uuid-here"
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
        { data: null, error: 'Forbidden - Only SSS staff can upload files' },
        { status: 403 }
      )
    }

    // Parse request body
    const body: CreateFileInput = await request.json()

    // Validate required fields
    if (!body.file_name || !body.file_url) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: file_name and file_url are required' },
        { status: 400 }
      )
    }

    // Create file metadata record
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert({
        file_name: body.file_name,
        file_url: body.file_url,
        file_type: body.file_type ?? null,
        file_size: body.file_size ?? null,
        case_id: body.case_id ?? null,
        protocol_step_id: body.protocol_step_id ?? null,
        session_id: body.session_id ?? null,
        evaluation_id: body.evaluation_id ?? null,
        action_plan_item_id: body.action_plan_item_id ?? null,
        uploaded_by: user.id,
      } as any)
      .select(
        `
        *,
        uploader:users!files_uploaded_by_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `
      )
      .single()

    if (fileError) {
      console.error('Error creating file metadata:', fileError)
      return NextResponse.json(
        { data: null, error: `Database error: ${fileError.message}` },
        { status: 500 }
      )
    }

    const response: FileApiResponse<typeof fileData> = {
      data: fileData,
      error: null,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('POST /api/files error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/files
 *
 * Lists file metadata records with optional filters, sorting, and pagination.
 * Only SSS_STAFF can access this endpoint.
 *
 * @param request - Next.js request object with query parameters
 * @returns JSON response with file metadata array or error
 *
 * @example
 * GET /api/files?case_id=uuid
 * GET /api/files?session_id=uuid&file_type=application/pdf
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
        { data: null, error: 'Forbidden - Only SSS staff can view files' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const filters: FileFilters = {
      case_id: searchParams.get('case_id') || undefined,
      session_id: searchParams.get('session_id') || undefined,
      evaluation_id: searchParams.get('evaluation_id') || undefined,
      protocol_step_id: searchParams.get('protocol_step_id') || undefined,
      action_plan_item_id: searchParams.get('action_plan_item_id') || undefined,
      uploaded_by: searchParams.get('uploaded_by') || undefined,
      file_type: searchParams.get('file_type') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('files')
      .select(
        `
        id,
        file_name,
        file_url,
        file_type,
        file_size,
        case_id,
        session_id,
        uploaded_by,
        created_at,
        uploader:users!files_uploaded_by_fkey (
          id,
          email,
          first_name,
          last_name
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.case_id) {
      query = query.eq('case_id', filters.case_id)
    }

    if (filters.session_id) {
      query = query.eq('session_id', filters.session_id)
    }

    if (filters.evaluation_id) {
      query = query.eq('evaluation_id', filters.evaluation_id)
    }

    if (filters.protocol_step_id) {
      query = query.eq('protocol_step_id', filters.protocol_step_id)
    }

    if (filters.action_plan_item_id) {
      query = query.eq('action_plan_item_id', filters.action_plan_item_id)
    }

    if (filters.uploaded_by) {
      query = query.eq('uploaded_by', filters.uploaded_by)
    }

    if (filters.file_type) {
      query = query.eq('file_type', filters.file_type)
    }

    // Apply sorting - newest first
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: files, error: filesError, count } = await query

    if (filesError) {
      console.error('Error fetching files:', filesError)
      return NextResponse.json(
        { data: null, error: `Database error: ${filesError.message}` },
        { status: 500 }
      )
    }

    // Transform data to FileListItem format
    const fileListItems: FileListItem[] = (files || []).map((file: any) => ({
      id: file.id,
      file_name: file.file_name,
      file_url: file.file_url,
      file_type: file.file_type,
      file_size: file.file_size,
      case_id: file.case_id,
      session_id: file.session_id,
      uploaded_by: file.uploaded_by,
      uploader_name: file.uploader
        ? `${file.uploader.first_name || ''} ${file.uploader.last_name || ''}`.trim() || file.uploader.email
        : null,
      created_at: file.created_at,
    }))

    const response: FileApiResponse<FileListItem[]> = {
      data: fileListItems,
      error: null,
      count: count || 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/files error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
