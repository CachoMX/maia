/**
 * Individual File API Routes
 *
 * Handles operations on a single file metadata record.
 * - DELETE /api/files/[id] - Delete file metadata (and optionally the actual file)
 *
 * @module app/api/files/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { FileApiResponse } from '@/app/types/file'

export const dynamic = 'force-dynamic'

/**
 * DELETE /api/files/[id]
 *
 * Deletes a file metadata record from the database.
 * This is a hard delete of the metadata record.
 *
 * NOTE: This only deletes the metadata record. If you want to delete
 * the actual file from Supabase Storage, you need to do that separately.
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing file ID
 * @returns JSON response confirming deletion or error
 */
export async function DELETE(
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
        { data: null, error: 'Forbidden - Only SSS staff can delete files' },
        { status: 403 }
      )
    }

    const fileId = params.id

    // Verify file exists and get file_url for potential storage deletion
    const { data: existingFile, error: checkError } = await supabase
      .from('files')
      .select('id, file_url')
      .eq('id', fileId)
      .single()

    if (checkError || !existingFile) {
      return NextResponse.json(
        { data: null, error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete file metadata record
    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (deleteError) {
      console.error('Error deleting file metadata:', deleteError)
      return NextResponse.json(
        { data: null, error: `Database error: ${deleteError.message}` },
        { status: 500 }
      )
    }

    // TODO: If needed, implement Supabase Storage file deletion here
    // Example:
    // const filePath = extractPathFromUrl(existingFile.file_url)
    // await supabase.storage.from('bucket-name').remove([filePath])

    const response: FileApiResponse<{ id: string; file_url: string | null }> = {
      data: {
        id: fileId,
        file_url: existingFile.file_url
      },
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/files/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
