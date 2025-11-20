'use client'

import { useState } from 'react'
import { Case } from '@/lib/types/cases'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function AddSessionModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: AddSessionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    sessionTime: '09:00',
    duration: '30',
    attendees: caseData.student?.name || '',
    notes: '',
    progressRating: '3',
    nextSteps: '',
    interventionId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.notes || !formData.nextSteps) {
        throw new Error('Please fill in all required fields')
      }

      // API call would go here
      // await fetch('/api/sessions', { method: 'POST', body: JSON.stringify({ ...formData, caseId: caseData.id }) })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      sessionDate: new Date().toISOString().split('T')[0],
      sessionTime: '09:00',
      duration: '30',
      attendees: caseData.student?.name || '',
      notes: '',
      progressRating: '3',
      nextSteps: '',
      interventionId: ''
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
                <h2 className="text-2xl font-bold text-gray-900">Document Session</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Record intervention session for {caseData.student?.name}
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

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Date *
                </label>
                <input
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.sessionTime}
                  onChange={(e) => setFormData({ ...formData, sessionTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (min) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  min="15"
                  max="120"
                  step="15"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Intervention Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Intervention (optional)
              </label>
              <select
                value={formData.interventionId}
                onChange={(e) => setFormData({ ...formData, interventionId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select an intervention...</option>
                <option value="1">Reading Comprehension Support - Tier 2</option>
                <option value="2">Math Problem Solving - Tier 2</option>
              </select>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees *
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Student name, staff members present..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Session Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Notes *
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="What happened during the session? What strategies were used? How did the student respond?"
                required
                disabled={isLoading}
              />
            </div>

            {/* Progress Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Rating *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.progressRating}
                  onChange={(e) => setFormData({ ...formData, progressRating: e.target.value })}
                  min="1"
                  max="5"
                  step="1"
                  className="flex-1"
                  disabled={isLoading}
                />
                <div className="w-20 text-center">
                  <span className="text-2xl font-bold text-[#0066CC]">{formData.progressRating}</span>
                  <span className="text-sm text-gray-600"> / 5</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>No Progress</span>
                <span>Some Progress</span>
                <span>Great Progress</span>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Steps *
              </label>
              <textarea
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="What will happen next? Any follow-up actions needed?"
                required
                disabled={isLoading}
              />
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
                    Saving...
                  </>
                ) : (
                  'Save Session'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
