'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import ScheduleMeetingForm from '@/app/components/meetings/ScheduleMeetingForm'
import { createClient } from '@/lib/supabase/client'

interface Case {
  id: string
  student_id: string
  student_name: string
  student_grade: string
  case_type: string
}

interface ScheduleMeetingFormData {
  case_id: string
  student_id: string
  student_name: string
  meeting_date: string
  meeting_time: string
  location: string
  attendees: string
  agenda: string
  notes: string
  meeting_status: string
}

interface ScheduleMeetingClientProps {
  cases: Case[]
}

export default function ScheduleMeetingClient({ cases }: ScheduleMeetingClientProps) {
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSubmit = async (data: ScheduleMeetingFormData) => {
    try {
      // Format the data according to the API schema
      const apiPayload = {
        student_id: data.student_id,
        case_id: data.case_id,
        meeting_date: data.meeting_date,
        meeting_time: data.meeting_time,
        is_scheduled: true,
        meeting_status: data.meeting_status,
        agenda: `${data.agenda}\n\nLocation: ${data.location}\n\nExpected Attendees:\n${data.attendees}${data.notes ? `\n\nPre-Meeting Notes:\n${data.notes}` : ''}`,
      }

      // Make API call to create meeting
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to schedule meeting')
      }

      // Show success message
      setShowSuccessMessage(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/meetings')
      }, 2000)
    } catch (error) {
      console.error('Error scheduling meeting:', error)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/meetings')
  }

  if (showSuccessMessage) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Scheduled Successfully!</h3>
            <p className="text-sm text-gray-500 mb-4">Redirecting you to the meetings page...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0066CC]"></div>
              <span className="text-sm text-gray-600">Please wait...</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/meetings" className="hover:text-[#0066CC]">
          Meetings
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Schedule Meeting</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📅</span>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Parent Meeting</h1>
        </div>
        <p className="text-gray-600">
          Schedule a new parent/guardian meeting for a student case. All fields marked with{' '}
          <span className="text-red-500">*</span> are required.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <ScheduleMeetingForm
          cases={cases}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Meeting Scheduling Tips:</p>
            <ul className="text-blue-800 space-y-1 ml-4 list-disc">
              <li>Select an open case to link the meeting to the student&apos;s record</li>
              <li>Provide a clear agenda so all attendees can prepare appropriately</li>
              <li>Include all expected attendees (parents, teachers, SSS staff, admin)</li>
              <li>For virtual meetings, include the Zoom or Google Meet link in the location field</li>
              <li>Use &ldquo;Rescheduled&rdquo; status if this meeting was previously scheduled for a different time</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
