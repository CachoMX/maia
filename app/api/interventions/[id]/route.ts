/**
 * Individual Intervention API Routes
 *
 * Handles operations on a single intervention.
 * - GET /api/interventions/[id] - Get intervention with relationships
 * - PATCH /api/interventions/[id] - Update intervention
 * - DELETE /api/interventions/[id] - Delete intervention
 *
 * @module app/api/interventions/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  UpdateInterventionInput,
  InterventionWithRelations,
  InterventionApiResponse,
} from '@/app/types/intervention'

export const dynamic = 'force-dynamic'

/**
 * GET /api/interventions/[id]
 *
 * Retrieves a single intervention with all relationships including:
 * - Facilitator details
 * - Session count
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing intervention ID
 * @returns JSON response with intervention details or error
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
        { data: null, error: 'Forbidden - Only SSS staff can view interventions' },
        { status: 403 }
      )
    }

    const interventionId = params.id

    // Fetch intervention with facilitator
    const { data: interventionData, error: interventionError } = await supabase
      .from('interventions')
      .select(
        `
        *,
        facilitator:users!interventions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .eq('id', interventionId)
      .single()

    if (interventionError) {
      if (interventionError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Intervention not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching intervention:', interventionError)
      return NextResponse.json(
        { data: null, error: `Database error: ${interventionError.message}` },
        { status: 500 }
      )
    }

    // Get session count
    const { count: sessionCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('intervention_id', interventionId)

    // Build InterventionWithRelations response
    const interventionWithRelations: InterventionWithRelations = {
      ...interventionData,
      session_count: sessionCount || 0,
    }

    const response: InterventionApiResponse<InterventionWithRelations> = {
      data: interventionWithRelations,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/interventions/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/interventions/[id]
 *
 * Updates an existing intervention. Only SSS_STAFF can update interventions.
 * Validates that the intervention exists before updating.
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing intervention ID
 * @returns JSON response with updated intervention or error
 *
 * @example
 * PATCH /api/interventions/uuid-here
 * {
 *   "is_active": false,
 *   "actual_end_date": "2025-03-15",
 *   "reason_for_ending": "Student goals achieved"
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
        { data: null, error: 'Forbidden - Only SSS staff can update interventions' },
        { status: 403 }
      )
    }

    const interventionId = params.id

    // Verify intervention exists
    const { data: existingIntervention, error: checkError } = await supabase
      .from('interventions')
      .select('id')
      .eq('id', interventionId)
      .single()

    if (checkError || !existingIntervention) {
      return NextResponse.json(
        { data: null, error: 'Intervention not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateInterventionInput = await request.json()

    // Update intervention
    const { data: updatedIntervention, error: updateError } = await supabase
      .from('interventions')
      .update(body)
      .eq('id', interventionId)
      .select(
        `
        *,
        facilitator:users!interventions_facilitator_id_fkey (
          id,
          email,
          first_name,
          last_name,
          sss_position
        )
      `
      )
      .single()

    if (updateError) {
      console.error('Error updating intervention:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: InterventionApiResponse<typeof updatedIntervention> = {
      data: updatedIntervention,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/interventions/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/interventions/[id]
 *
 * Deletes an intervention from the database.
 * This is a hard delete - use PATCH to deactivate instead if needed.
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing intervention ID
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
        { data: null, error: 'Forbidden - Only SSS staff can delete interventions' },
        { status: 403 }
      )
    }

    const interventionId = params.id

    // Verify intervention exists
    const { data: existingIntervention, error: checkError } = await supabase
      .from('interventions')
      .select('id')
      .eq('id', interventionId)
      .single()

    if (checkError || !existingIntervention) {
      return NextResponse.json(
        { data: null, error: 'Intervention not found' },
        { status: 404 }
      )
    }

    // Delete intervention (cascade will handle sessions)
    const { error: deleteError } = await supabase
      .from('interventions')
      .delete()
      .eq('id', interventionId)

    if (deleteError) {
      console.error('Error deleting intervention:', deleteError)
      return NextResponse.json(
        { data: null, error: `Database error: ${deleteError.message}` },
        { status: 500 }
      )
    }

    const response: InterventionApiResponse<{ id: string }> = {
      data: { id: interventionId },
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/interventions/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
