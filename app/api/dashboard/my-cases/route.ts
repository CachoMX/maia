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

    // Get cases assigned to current user
    const { data: myCases, error } = await supabase
      .from('cases')
      .select(`
        id,
        case_type,
        tier,
        status,
        is_urgent,
        opened_date,
        students (
          id,
          name,
          grade
        )
      `)
      .eq('case_manager_id', user.id)
      .in('status', ['OPEN', 'ON_HOLD'])
      .order('is_urgent', { ascending: false })
      .order('opened_date', { ascending: true })

    if (error) {
      console.error('Error fetching my cases:', error)
      return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
    }

    return NextResponse.json({ myCases: myCases || [] })
  } catch (error) {
    console.error('Error fetching my cases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
