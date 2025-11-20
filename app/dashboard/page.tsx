import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from './components/Navigation'
import { DashboardClient } from './components/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
  const userRole = profile?.role || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation userName={userName} userRole={userRole} />

      {/* Main Content - with padding for desktop sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top padding for fixed header */}
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] rounded-2xl p-8 mb-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {profile?.first_name}!
              </h2>
              <p className="text-blue-100">
                Student Support Services Tracking System - ATLAS ASM
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Now with real-time data and advanced analytics
              </p>
            </div>

            {/* Dashboard Components */}
            <DashboardClient userName={userName} />
          </main>
        </div>
      </div>
    </div>
  )
}
