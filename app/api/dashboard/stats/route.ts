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

    // Get active cases count (OPEN + ON_HOLD)
    const { count: activeCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .in('status', ['OPEN', 'ON_HOLD'])

    // Get urgent cases count
    const { count: urgentCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('is_urgent', true)
      .in('status', ['OPEN', 'ON_HOLD'])

    // Get active interventions count
    const { count: activeInterventions } = await supabase
      .from('interventions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get upcoming meetings this week
    const startOfWeek = new Date()
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date()
    endOfWeek.setDate(endOfWeek.getDate() + 7)
    endOfWeek.setHours(23, 59, 59, 999)

    const { count: upcomingMeetings } = await supabase
      .from('parent_meetings')
      .select('*', { count: 'exact', head: true })
      .gte('meeting_date', startOfWeek.toISOString().split('T')[0])
      .lte('meeting_date', endOfWeek.toISOString().split('T')[0])
      .in('meeting_status', ['SCHEDULED', 'RESCHEDULED'])

    return NextResponse.json({
      activeCases: activeCases || 0,
      urgentCases: urgentCases || 0,
      activeInterventions: activeInterventions || 0,
      upcomingMeetings: upcomingMeetings || 0,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
