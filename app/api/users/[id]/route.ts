/**
 * Individual User API Routes
 *
 * Handles operations on a single user profile.
 * - GET /api/users/[id] - Get user profile
 * - PATCH /api/users/[id] - Update user profile
 *
 * @module app/api/users/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Response format for user API endpoints
 */
interface UserApiResponse<T> {
  data: T | null
  error: string | null
}

/**
 * Input type for updating user profile
 */
interface UpdateUserInput {
  first_name?: string
  last_name?: string
  department?: string
  phone?: string
}

/**
 * GET /api/users/[id]
 *
 * Retrieves a single user profile.
 * Users can only view their own profile.
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns JSON response with user details or error
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

    const userId = params.id

    // Users can only view their own profile
    if (user.id !== userId) {
      return NextResponse.json(
        { data: null, error: 'Forbidden - You can only view your own profile' },
        { status: 403 }
      )
    }

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'User not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { data: null, error: `Database error: ${userError.message}` },
        { status: 500 }
      )
    }

    const response: UserApiResponse<typeof userData> = {
      data: userData,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/users/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/[id]
 *
 * Updates a user profile. Users can only update their own profile.
 * Allowed fields: first_name, last_name, department, phone
 *
 * @param request - Next.js request object with update data in body
 * @param params - Route parameters containing user ID
 * @returns JSON response with updated user or error
 *
 * @example
 * PATCH /api/users/uuid-here
 * {
 *   "first_name": "John",
 *   "last_name": "Doe",
 *   "department": "Student Support Services",
 *   "phone": "+34 123 456 789"
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

    const userId = params.id

    // Users can only update their own profile
    if (user.id !== userId) {
      return NextResponse.json(
        { data: null, error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      )
    }

    // Verify user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body: UpdateUserInput = await request.json()

    // Validate that only allowed fields are being updated
    const allowedFields = ['first_name', 'last_name', 'department', 'phone']
    const updateData: Partial<UpdateUserInput> = {}

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updateData[key as keyof UpdateUserInput] = value
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json(
        { data: null, error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    const response: UserApiResponse<typeof updatedUser> = {
      data: updatedUser,
      error: null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/users/[id] error:', error)
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
