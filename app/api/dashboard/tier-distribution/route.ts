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

    // Call the database function to get tier distribution by grade
    const { data, error } = await (supabase as any)
      .rpc('get_tier_distribution_by_grade')

    if (error) {
      console.error('Error fetching tier distribution:', error)
      return NextResponse.json({ error: 'Failed to fetch tier distribution' }, { status: 500 })
    }

    return NextResponse.json({ tierDistribution: data || [] })
  } catch (error) {
    console.error('Error fetching tier distribution:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
