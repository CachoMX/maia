'use client'

import { useState } from 'react'
import { Case, CaseTier } from '@/lib/types/cases'

interface AddInterventionModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function AddInterventionModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: AddInterventionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tier: caseData.tier as CaseTier,
    frequency: 'WEEKLY',
    duration: '30',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    goals: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.goals) {
        throw new Error('Please fill in all required fields')
      }

      // API call would go here
      // await fetch('/api/interventions', { method: 'POST', body: JSON.stringify({ ...formData, caseId: caseData.id }) })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create intervention')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tier: caseData.tier as CaseTier,
      frequency: 'WEEKLY',
      duration: '30',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      goals: ''
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
                <h2 className="text-2xl font-bold text-gray-900">Add Intervention</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create a new intervention plan for {caseData.student?.name}
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

            {/* Intervention Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervention Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="e.g., Reading Comprehension Support"
                required
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Describe the intervention approach, strategies, and methods..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Tier Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier Level *
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: parseInt(e.target.value) as CaseTier })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value={1}>Tier 1 - Universal Support</option>
                <option value={2}>Tier 2 - Targeted Intervention</option>
                <option value={3}>Tier 3 - Intensive Intervention</option>
              </select>
            </div>

            {/* Frequency and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Bi-weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration (minutes) *
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

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  min={formData.startDate}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervention Goals *
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="What are the specific, measurable goals for this intervention?"
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
                    Creating...
                  </>
                ) : (
                  'Create Intervention'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
