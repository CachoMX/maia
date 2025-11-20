'use client'

import { useState } from 'react'
import { Case } from '@/lib/types/cases'

interface CloseCaseModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function CloseCaseModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: CloseCaseModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    closureReason: 'GOALS_MET',
    summary: '',
    outcomes: '',
    recommendations: '',
    followUpRequired: false,
    followUpNotes: '',
    notifyStakeholders: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate
      if (!formData.summary) {
        throw new Error('Please provide a closure summary')
      }

      if (!formData.outcomes) {
        throw new Error('Please document the outcomes')
      }

      if (formData.followUpRequired && !formData.followUpNotes) {
        throw new Error('Please provide follow-up notes')
      }

      // API call would go here
      // await fetch(`/api/cases/${caseData.id}/close`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     ...formData,
      //     closedDate: new Date().toISOString()
      //   })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close case')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      closureReason: 'GOALS_MET',
      summary: '',
      outcomes: '',
      recommendations: '',
      followUpRequired: false,
      followUpNotes: '',
      notifyStakeholders: true
    })
    setError(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  const daysOpen = Math.floor(
    (new Date().getTime() - new Date(caseData.openedDate).getTime()) / (24 * 60 * 60 * 1000)
  )

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
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Close Case</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Finalize and close {caseData.student?.name}'s case
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

            {/* Warning Box */}
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold text-red-900 mb-1">Important: Closing This Case</h4>
                  <p className="text-sm text-red-800">
                    This action will mark the case as closed. You will still be able to view the case and all its data, but you won't be able to add new interventions or sessions. Make sure all documentation is complete before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Case Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Case Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Opened</p>
                  <p className="font-medium text-gray-900">{new Date(caseData.openedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{daysOpen} days</p>
                </div>
                <div>
                  <p className="text-gray-600">Case Type</p>
                  <p className="font-medium text-gray-900">{caseData.caseType.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Closure Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closure Reason *
              </label>
              <select
                value={formData.closureReason}
                onChange={(e) => setFormData({ ...formData, closureReason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="GOALS_MET">Goals Met - Student has achieved intervention goals</option>
                <option value="NO_LONGER_NEEDED">No Longer Needed - Support is no longer required</option>
                <option value="REFERRED_OUT">Referred to External Services</option>
                <option value="STUDENT_MOVED">Student Moved/Transferred</option>
                <option value="PARENT_DECLINED">Parent/Guardian Declined Further Support</option>
                <option value="OTHER">Other Reason</option>
              </select>
            </div>

            {/* Closure Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closure Summary *
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Provide a comprehensive summary of the case, including key events, interventions provided, and overall progress..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Outcomes *
              </label>
              <textarea
                value={formData.outcomes}
                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="What were the final outcomes? What did the student achieve? What improvements were observed?"
                required
                disabled={isLoading}
              />
            </div>

            {/* Recommendations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations for Future (optional)
              </label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Any recommendations for the student's future support, classroom strategies, or monitoring?"
                disabled={isLoading}
              />
            </div>

            {/* Follow-up Required */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                  className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] mt-1"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                    Follow-up monitoring required
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Check if the student should be monitored after case closure
                  </p>
                </div>
              </div>

              {formData.followUpRequired && (
                <div className="ml-7">
                  <textarea
                    value={formData.followUpNotes}
                    onChange={(e) => setFormData({ ...formData, followUpNotes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    placeholder="Describe the follow-up monitoring plan..."
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Notify Stakeholders */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="notifyStakeholders"
                checked={formData.notifyStakeholders}
                onChange={(e) => setFormData({ ...formData, notifyStakeholders: e.target.checked })}
                className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] mt-1"
                disabled={isLoading}
              />
              <div className="ml-3">
                <label htmlFor="notifyStakeholders" className="text-sm font-medium text-gray-700">
                  Notify all stakeholders
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Send closure notification to teachers, parents, and case team members
                </p>
              </div>
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
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Closing Case...
                  </>
                ) : (
                  'Close Case'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
