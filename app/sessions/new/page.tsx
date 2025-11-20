import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from '../../dashboard/components/Navigation'
import DocumentSessionForm from '@/app/components/sessions/DocumentSessionForm'

export const dynamic = 'force-dynamic'

export default async function NewSessionPage() {
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

  const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || profile?.email || 'User'
  const userRole = profile?.role || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName={userName} userRole={userRole} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/interventions" className="hover:text-[#0066CC]">
                Interventions
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Document Session</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Intervention Session</h1>
              <p className="text-gray-600">
                Record the details of an intervention session that was held.
                All fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <DocumentSessionForm
                currentUserId={user.id}
                currentUserName={userName}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
