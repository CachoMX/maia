'use client'

import { useState } from 'react'
import { Case, CaseStatus, caseStatusLabels } from '@/lib/types/cases'

interface ChangeStatusModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function ChangeStatusModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: ChangeStatusModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    newStatus: caseData.status,
    reason: '',
    notifyStakeholders: true
  })

  const statusOptions: Array<{ value: CaseStatus; label: string; description: string; color: string }> = [
    {
      value: 'OPEN',
      label: 'Open',
      description: 'Case is actively being worked on',
      color: 'text-green-700 bg-green-50 border-green-200'
    },
    {
      value: 'ON_HOLD',
      label: 'On Hold',
      description: 'Case is temporarily paused',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200'
    },
    {
      value: 'REFERRED_OUT',
      label: 'Referred Out',
      description: 'Case has been referred to external services',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      value: 'CLOSED',
      label: 'Closed',
      description: 'Case has been completed and closed',
      color: 'text-gray-700 bg-gray-50 border-gray-200'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate
      if (formData.newStatus === caseData.status) {
        throw new Error('Please select a different status')
      }

      if (!formData.reason) {
        throw new Error('Please provide a reason for the status change')
      }

      // API call would go here
      // await fetch(`/api/cases/${caseData.id}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(formData)
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change status')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      newStatus: caseData.status,
      reason: '',
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
                <h2 className="text-2xl font-bold text-gray-900">Change Case Status</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update the status for {caseData.student?.name}'s case
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

            {/* Current Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  {caseStatusLabels[caseData.status]}
                </span>
              </div>
            </div>

            {/* New Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select New Status *
              </label>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.newStatus === option.value
                        ? 'border-[#0066CC] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.newStatus === option.value}
                      onChange={(e) => setFormData({ ...formData, newStatus: e.target.value as CaseStatus })}
                      className="mt-1 w-4 h-4 text-[#0066CC] border-gray-300 focus:ring-[#0066CC]"
                      disabled={isLoading}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${option.color}`}>
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Status Change *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Explain why the status is being changed..."
                required
                disabled={isLoading}
              />
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
                  Notify stakeholders
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Send notifications to case manager, teachers, and parents about this status change
                </p>
              </div>
            </div>

            {/* Warning for certain status changes */}
            {formData.newStatus === 'CLOSED' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900 mb-1">Note about closing cases</h4>
                    <p className="text-xs text-yellow-800">
                      Consider using the "Close Case" button instead, which includes additional closure documentation and summary options.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
