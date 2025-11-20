import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call the database function to get case load
    const { data, error } = await (supabase as any)
      .rpc('get_staff_case_load', { staff_id: user.id })

    if (error) {
      console.error('Error fetching case load:', error)
      return NextResponse.json({ error: 'Failed to fetch case load' }, { status: 500 })
    }

    // The function returns a single row, so get the first element
    const caseLoad = data && data.length > 0 ? data[0] : {
      total_cases: 0,
      open_cases: 0,
      on_hold_cases: 0,
      tier_1_cases: 0,
      tier_2_cases: 0,
      tier_3_cases: 0,
      urgent_cases: 0
    }

    return NextResponse.json({ caseLoad })
  } catch (error) {
    console.error('Error fetching case load:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
