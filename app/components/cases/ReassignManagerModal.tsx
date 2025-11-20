'use client'

import { useState } from 'react'
import { Case } from '@/lib/types/cases'

interface ReassignManagerModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

// Mock SSS team members - in real app, fetch from API
const sssTeamMembers = [
  { id: '1', first_name: 'Wendy', last_name: 'Aragón', role: 'SSS Team Lead', email: 'wendy@atlas.school' },
  { id: '2', first_name: 'Maria', last_name: 'Garcia', role: 'School Counselor', email: 'maria@atlas.school' },
  { id: '3', first_name: 'David', last_name: 'Martinez', role: 'School Psychologist', email: 'david@atlas.school' },
  { id: '4', first_name: 'Laura', last_name: 'Rodriguez', role: 'Social Worker', email: 'laura@atlas.school' },
  { id: '5', first_name: 'Carlos', last_name: 'Fernandez', role: 'Intervention Specialist', email: 'carlos@atlas.school' }
]

export default function ReassignManagerModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: ReassignManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    newManagerId: '',
    reason: '',
    notifyPrevious: true,
    notifyNew: true,
    effectiveDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate
      if (!formData.newManagerId) {
        throw new Error('Please select a new case manager')
      }

      if (formData.newManagerId === caseData.caseManagerId) {
        throw new Error('Please select a different case manager')
      }

      if (!formData.reason) {
        throw new Error('Please provide a reason for reassignment')
      }

      // API call would go here
      // await fetch(`/api/cases/${caseData.id}/reassign`, {
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
      setError(err instanceof Error ? err.message : 'Failed to reassign case manager')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      newManagerId: '',
      reason: '',
      notifyPrevious: true,
      notifyNew: true,
      effectiveDate: new Date().toISOString().split('T')[0]
    })
    setError(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  const selectedManager = sssTeamMembers.find(m => m.id === formData.newManagerId)

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
                <h2 className="text-2xl font-bold text-gray-900">Reassign Case Manager</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Change case manager for {caseData.student?.name}
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

            {/* Current Case Manager */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Current Case Manager</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-semibold">
                  {caseData.caseManager?.first_name.charAt(0)}{caseData.caseManager?.last_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {caseData.caseManager?.first_name} {caseData.caseManager?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">Managing since {new Date(caseData.openedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Select New Case Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select New Case Manager *
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {sssTeamMembers.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      formData.newManagerId === member.id
                        ? 'bg-blue-50 border-2 border-[#0066CC]'
                        : 'bg-white border-2 border-transparent hover:bg-gray-50'
                    } ${
                      member.id === caseData.caseManagerId
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      value={member.id}
                      checked={formData.newManagerId === member.id}
                      onChange={(e) => setFormData({ ...formData, newManagerId: e.target.value })}
                      className="w-4 h-4 text-[#0066CC] border-gray-300 focus:ring-[#0066CC]"
                      disabled={isLoading || member.id === caseData.caseManagerId}
                    />
                    <div className="ml-3 flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-[#FFD700] text-gray-900 flex items-center justify-center font-semibold text-sm">
                        {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                          {member.id === caseData.caseManagerId && (
                            <span className="ml-2 text-xs text-gray-500">(Current)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Date *
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Reason for Reassignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reassignment *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Explain why the case is being reassigned..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Notification Options */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="notifyPrevious"
                  checked={formData.notifyPrevious}
                  onChange={(e) => setFormData({ ...formData, notifyPrevious: e.target.checked })}
                  className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] mt-1"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <label htmlFor="notifyPrevious" className="text-sm font-medium text-gray-700">
                    Notify previous case manager
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Send email notification to {caseData.caseManager?.first_name} {caseData.caseManager?.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="notifyNew"
                  checked={formData.notifyNew}
                  onChange={(e) => setFormData({ ...formData, notifyNew: e.target.checked })}
                  className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] mt-1"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <label htmlFor="notifyNew" className="text-sm font-medium text-gray-700">
                    Notify new case manager
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedManager
                      ? `Send email notification to ${selectedManager.first_name} ${selectedManager.last_name}`
                      : 'Send email notification to the newly assigned case manager'}
                  </p>
                </div>
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
                className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Reassigning...
                  </>
                ) : (
                  'Reassign Case'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
