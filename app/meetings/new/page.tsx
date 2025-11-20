import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from '../../dashboard/components/Navigation'
import ScheduleMeetingClient from './ScheduleMeetingClient'

export default async function NewMeetingPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
  const userRole = profile?.role || 'User'

  // Fetch open cases for the dropdown
  const { data: casesData } = await supabase
    .from('cases')
    .select(`
      id,
      student_id,
      case_type,
      status,
      student:students!inner (
        id,
        name,
        grade
      )
    `)
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false })

  // Transform cases data to match the expected format
  const cases = (casesData || []).map((caseItem: any) => ({
    id: caseItem.id,
    student_id: caseItem.student?.id || caseItem.student_id,
    student_name: caseItem.student?.name || 'Unknown',
    student_grade: caseItem.student?.grade || 'Unknown',
    case_type: caseItem.case_type,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName={userName} userRole={userRole} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <ScheduleMeetingClient cases={cases} />
        </div>
      </div>
    </div>
  )
}
