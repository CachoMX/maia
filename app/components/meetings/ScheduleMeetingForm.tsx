'use client'

import { useState, useEffect } from 'react'
import { MeetingStatus } from '@/app/types/meeting'

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
  meeting_status: MeetingStatus
}

interface ScheduleMeetingFormProps {
  cases: Case[]
  onSubmit: (data: ScheduleMeetingFormData) => Promise<void>
  onCancel: () => void
}

export default function ScheduleMeetingForm({
  cases,
  onSubmit,
  onCancel,
}: ScheduleMeetingFormProps) {
  const [formData, setFormData] = useState<ScheduleMeetingFormData>({
    case_id: '',
    student_id: '',
    student_name: '',
    meeting_date: '',
    meeting_time: '',
    location: '',
    attendees: '',
    agenda: '',
    notes: '',
    meeting_status: 'SCHEDULED',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleMeetingFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-populate student info when case is selected
  useEffect(() => {
    if (formData.case_id) {
      const selectedCase = cases.find((c) => c.id === formData.case_id)
      if (selectedCase) {
        setFormData((prev) => ({
          ...prev,
          student_id: selectedCase.student_id,
          student_name: selectedCase.student_name,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        student_id: '',
        student_name: '',
      }))
    }
  }, [formData.case_id, cases])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ScheduleMeetingFormData, string>> = {}

    if (!formData.case_id) newErrors.case_id = 'Please select a case'
    if (!formData.meeting_date) newErrors.meeting_date = 'Please select a meeting date'
    if (!formData.meeting_time) newErrors.meeting_time = 'Please select a meeting time'
    if (!formData.location.trim()) newErrors.location = 'Please provide a location'
    if (!formData.attendees.trim()) newErrors.attendees = 'Please list expected attendees'
    if (!formData.agenda.trim()) newErrors.agenda = 'Please provide a meeting agenda'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to schedule meeting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof ScheduleMeetingFormData>(
    field: K,
    value: ScheduleMeetingFormData[K]
  ) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Case Selection */}
      <div>
        <label htmlFor="case_id" className="block text-sm font-medium text-gray-700 mb-2">
          Case <span className="text-red-500">*</span>
        </label>
        <select
          id="case_id"
          value={formData.case_id}
          onChange={(e) => updateField('case_id', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.case_id ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a case...</option>
          {cases.map((caseItem) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.student_name} ({caseItem.student_grade}) - {caseItem.case_type}
            </option>
          ))}
        </select>
        {errors.case_id && <p className="mt-1 text-sm text-red-600">{errors.case_id}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Select the case to link this meeting to
        </p>
      </div>

      {/* Student Name (Read-only) */}
      {formData.student_name && (
        <div>
          <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            id="student_name"
            value={formData.student_name}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Auto-populated from selected case
          </p>
        </div>
      )}

      {/* Meeting Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="meeting_date"
            value={formData.meeting_date}
            onChange={(e) => updateField('meeting_date', e.target.value)}
            min={today}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
              errors.meeting_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.meeting_date && <p className="mt-1 text-sm text-red-600">{errors.meeting_date}</p>}
        </div>

        <div>
          <label htmlFor="meeting_time" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="meeting_time"
            value={formData.meeting_time}
            onChange={(e) => updateField('meeting_time', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
              errors.meeting_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.meeting_time && <p className="mt-1 text-sm text-red-600">{errors.meeting_time}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="e.g., Room 101, Zoom Link, Google Meet"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Meeting Status */}
      <div>
        <label htmlFor="meeting_status" className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Status <span className="text-red-500">*</span>
        </label>
        <select
          id="meeting_status"
          value={formData.meeting_status}
          onChange={(e) => updateField('meeting_status', e.target.value as MeetingStatus)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
        >
          <option value="SCHEDULED">Scheduled</option>
          <option value="RESCHEDULED">Rescheduled</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select &ldquo;Rescheduled&rdquo; if this meeting was previously scheduled for a different time
        </p>
      </div>

      {/* Attendees */}
      <div>
        <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
          Expected Attendees <span className="text-red-500">*</span>
        </label>
        <textarea
          id="attendees"
          value={formData.attendees}
          onChange={(e) => updateField('attendees', e.target.value)}
          rows={4}
          placeholder="List expected attendees (e.g., Parent/Guardian, SSS Staff, Teachers, Admin)"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.attendees ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.attendees && <p className="mt-1 text-sm text-red-600">{errors.attendees}</p>}
      </div>

      {/* Agenda */}
      <div>
        <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Agenda <span className="text-red-500">*</span>
        </label>
        <textarea
          id="agenda"
          value={formData.agenda}
          onChange={(e) => updateField('agenda', e.target.value)}
          rows={5}
          placeholder="Describe the purpose and topics to be discussed in the meeting..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.agenda ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.agenda && <p className="mt-1 text-sm text-red-600">{errors.agenda}</p>}
      </div>

      {/* Notes (Optional) */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Pre-Meeting Notes <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
          placeholder="Any additional notes or preparation items..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Scheduling...
            </>
          ) : (
            <>
              <span>Schedule Meeting</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
