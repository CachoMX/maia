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

    // Get urgent cases with student info
    const { data: urgentCases, error } = await supabase
      .from('cases')
      .select(`
        id,
        case_type,
        opened_date,
        tier,
        status,
        students (
          id,
          name,
          grade
        )
      `)
      .eq('is_urgent', true)
      .in('status', ['OPEN', 'ON_HOLD'])
      .order('opened_date', { ascending: true })

    if (error) {
      console.error('Error fetching urgent cases:', error)
      return NextResponse.json({ error: 'Failed to fetch urgent cases' }, { status: 500 })
    }

    // Calculate days open for each case
    const casesWithDaysOpen = urgentCases?.map(caseItem => {
      const openedDate = new Date(caseItem.opened_date || new Date())
      const today = new Date()
      const daysOpen = Math.floor((today.getTime() - openedDate.getTime()) / (1000 * 60 * 60 * 24))

      return {
        ...caseItem,
        daysOpen
      }
    }) || []

    return NextResponse.json({ urgentCases: casesWithDaysOpen })
  } catch (error) {
    console.error('Error fetching urgent cases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
