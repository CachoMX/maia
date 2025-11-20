'use client'

import { useState } from 'react'
import { Case } from '@/lib/types/cases'

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: ScheduleMeetingModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: 'Parent Meeting - ' + caseData.student?.name,
    meetingDate: '',
    meetingTime: '14:00',
    duration: '45',
    location: 'SSS Office',
    meetingType: 'IN_PERSON',
    attendees: '',
    purpose: '',
    agenda: '',
    sendCalendarInvite: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.meetingDate || !formData.purpose || !formData.attendees) {
        throw new Error('Please fill in all required fields')
      }

      // API call would go here
      // await fetch('/api/meetings', { method: 'POST', body: JSON.stringify({ ...formData, caseId: caseData.id }) })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule meeting')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: 'Parent Meeting - ' + caseData.student?.name,
      meetingDate: '',
      meetingTime: '14:00',
      duration: '45',
      location: 'SSS Office',
      meetingType: 'IN_PERSON',
      attendees: '',
      purpose: '',
      agenda: '',
      sendCalendarInvite: true
    })
    setError(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Schedule Meeting</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Arrange a parent/guardian meeting for {caseData.student?.name}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Meeting Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (min) *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
            </div>

            {/* Meeting Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type *
                </label>
                <select
                  value={formData.meetingType}
                  onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                >
                  <option value="IN_PERSON">In-Person</option>
                  <option value="VIRTUAL">Virtual (Zoom/Meet)</option>
                  <option value="PHONE">Phone Call</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location / Link *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  placeholder="Room number or meeting link"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees (Email Addresses) *
              </label>
              <textarea
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="parent@example.com, teacher@example.com (separate by commas)"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-600 mt-1">
                Enter email addresses separated by commas
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Purpose *
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="What is the main purpose of this meeting?"
                required
                disabled={isLoading}
              />
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda (optional)
              </label>
              <textarea
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Meeting agenda items..."
                disabled={isLoading}
              />
            </div>

            {/* Send Calendar Invite */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendCalendarInvite"
                checked={formData.sendCalendarInvite}
                onChange={(e) => setFormData({ ...formData, sendCalendarInvite: e.target.checked })}
                className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC]"
                disabled={isLoading}
              />
              <label htmlFor="sendCalendarInvite" className="ml-2 text-sm text-gray-700">
                Send calendar invites to all attendees
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scheduling...
                  </>
                ) : (
                  'Schedule Meeting'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
