'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Case {
  id: string
  student_name: string
  student_grade: string
  case_type: string
  tier: number | null
}

interface Intervention {
  id: string
  intervention_name: string
  type: string
  tier: number | null
}

interface SessionFormData {
  caseId: string
  interventionId: string
  sessionDate: string
  sessionTime: string
  duration: number | string
  notes: string
  facilitatorId: string
  status: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
}

interface DocumentSessionFormProps {
  currentUserId: string
  currentUserName: string
}

export default function DocumentSessionForm({ currentUserId, currentUserName }: DocumentSessionFormProps) {
  const router = useRouter()
  const supabase = createClient()

  // State
  const [cases, setCases] = useState<Case[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([])
  const [isLoadingCases, setIsLoadingCases] = useState(true)
  const [isLoadingInterventions, setIsLoadingInterventions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState<SessionFormData>({
    caseId: '',
    interventionId: '',
    sessionDate: new Date().toISOString().split('T')[0], // Today's date
    sessionTime: '',
    duration: '',
    notes: '',
    facilitatorId: currentUserId,
    status: 'COMPLETED',
  })

  // Load cases on mount
  useEffect(() => {
    loadCases()
  }, [])

  // Load interventions when case is selected
  useEffect(() => {
    if (formData.caseId) {
      loadInterventionsForCase(formData.caseId)
    } else {
      setFilteredInterventions([])
      setFormData(prev => ({ ...prev, interventionId: '' }))
    }
  }, [formData.caseId])

  const loadCases = async () => {
    setIsLoadingCases(true)
    try {
      const response = await fetch('/api/cases?status=OPEN&limit=1000')
      const result = await response.json()

      if (result.error) {
        console.error('Error loading cases:', result.error)
        setApiError('Failed to load cases. Please refresh the page.')
        return
      }

      setCases(result.data || [])
    } catch (error) {
      console.error('Error fetching cases:', error)
      setApiError('Failed to load cases. Please check your connection.')
    } finally {
      setIsLoadingCases(false)
    }
  }

  const loadInterventionsForCase = async (caseId: string) => {
    setIsLoadingInterventions(true)
    try {
      const response = await fetch(`/api/interventions?case_id=${caseId}&is_active=true`)
      const result = await response.json()

      if (result.error) {
        console.error('Error loading interventions:', result.error)
        setApiError('Failed to load interventions for this case.')
        setFilteredInterventions([])
        return
      }

      setInterventions(result.data || [])
      setFilteredInterventions(result.data || [])
    } catch (error) {
      console.error('Error fetching interventions:', error)
      setApiError('Failed to load interventions. Please try again.')
      setFilteredInterventions([])
    } finally {
      setIsLoadingInterventions(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SessionFormData, string>> = {}

    if (!formData.caseId) newErrors.caseId = 'Please select a case'
    if (!formData.interventionId) newErrors.interventionId = 'Please select an intervention'
    if (!formData.sessionDate) newErrors.sessionDate = 'Please select a session date'
    if (!formData.notes.trim()) newErrors.notes = 'Please provide session notes'
    if (formData.duration && isNaN(Number(formData.duration))) {
      newErrors.duration = 'Duration must be a number'
    }
    if (formData.duration && Number(formData.duration) < 0) {
      newErrors.duration = 'Duration must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Prepare session data for API
      const sessionData = {
        intervention_id: formData.interventionId,
        session_date: formData.sessionDate,
        session_time: formData.sessionTime || null,
        duration: formData.duration ? Number(formData.duration) : null,
        facilitator_id: formData.facilitatorId,
        student_attended: formData.status === 'COMPLETED',
        observation_notes: formData.notes,
        student_progress: formData.status === 'COMPLETED' ? 'Session completed' :
                         formData.status === 'CANCELLED' ? 'Session cancelled' :
                         'Student did not attend',
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setApiError(result.error || 'Failed to create session. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Success!
      setSubmitSuccess(true)

      // Show success message briefly, then redirect
      setTimeout(() => {
        router.push('/interventions')
      }, 1500)

    } catch (error) {
      console.error('Error submitting session:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof SessionFormData>(field: K, value: SessionFormData[K]) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const handleCancel = () => {
    router.push('/interventions')
  }

  // Get selected case details for display
  const selectedCase = cases.find(c => c.id === formData.caseId)

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Documented Successfully!</h3>
        <p className="text-gray-600">Redirecting to interventions page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Error Message */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Case Selection */}
      <div>
        <label htmlFor="caseId" className="block text-sm font-medium text-gray-700 mb-2">
          Case <span className="text-red-500">*</span>
        </label>
        <select
          id="caseId"
          value={formData.caseId}
          onChange={(e) => updateField('caseId', e.target.value)}
          disabled={isLoadingCases}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.caseId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">
            {isLoadingCases ? 'Loading cases...' : 'Select a case...'}
          </option>
          {cases.map((caseItem) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.student_name} ({caseItem.student_grade}) - {caseItem.case_type}
              {caseItem.tier ? ` - Tier ${caseItem.tier}` : ''}
            </option>
          ))}
        </select>
        {errors.caseId && <p className="mt-1 text-sm text-red-600">{errors.caseId}</p>}
      </div>

      {/* Intervention Selection */}
      <div>
        <label htmlFor="interventionId" className="block text-sm font-medium text-gray-700 mb-2">
          Intervention <span className="text-red-500">*</span>
        </label>
        <select
          id="interventionId"
          value={formData.interventionId}
          onChange={(e) => updateField('interventionId', e.target.value)}
          disabled={!formData.caseId || isLoadingInterventions}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.interventionId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">
            {!formData.caseId
              ? 'Select a case first...'
              : isLoadingInterventions
                ? 'Loading interventions...'
                : filteredInterventions.length === 0
                  ? 'No active interventions for this case'
                  : 'Select an intervention...'}
          </option>
          {filteredInterventions.map((intervention) => (
            <option key={intervention.id} value={intervention.id}>
              {intervention.intervention_name} ({intervention.type}
              {intervention.tier ? ` - Tier ${intervention.tier}` : ''})
            </option>
          ))}
        </select>
        {errors.interventionId && <p className="mt-1 text-sm text-red-600">{errors.interventionId}</p>}
        {formData.caseId && filteredInterventions.length === 0 && !isLoadingInterventions && (
          <p className="mt-1 text-sm text-amber-600">
            No active interventions found for this case. Please create an intervention first.
          </p>
        )}
      </div>

      {/* Session Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-2">
            Session Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="sessionDate"
            value={formData.sessionDate}
            onChange={(e) => updateField('sessionDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Can't be in the future
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
              errors.sessionDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sessionDate && <p className="mt-1 text-sm text-red-600">{errors.sessionDate}</p>}
        </div>

        <div>
          <label htmlFor="sessionTime" className="block text-sm font-medium text-gray-700 mb-2">
            Session Time <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="time"
            id="sessionTime"
            value={formData.sessionTime}
            onChange={(e) => updateField('sessionTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
          />
        </div>
      </div>

      {/* Duration and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes) <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            min="0"
            step="5"
            placeholder="e.g., 30"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Session Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as SessionFormData['status'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
          >
            <option value="COMPLETED">✓ Completed</option>
            <option value="CANCELLED">✗ Cancelled</option>
            <option value="NO_SHOW">⊘ No Show</option>
          </select>
        </div>
      </div>

      {/* Facilitator (Read-only) */}
      <div>
        <label htmlFor="facilitator" className="block text-sm font-medium text-gray-700 mb-2">
          Facilitator <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="facilitator"
          value={currentUserName}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">Sessions are automatically assigned to you (current user)</p>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Session Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={6}
          placeholder="Document what happened during the session, student progress, observations, challenges, or next steps..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Include student progress, challenges faced, and any relevant observations
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoadingCases || (!!formData.caseId && isLoadingInterventions)}
          className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Document Session'
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Documentation Tips:</p>
            <ul className="text-blue-800 space-y-1 ml-4 list-disc">
              <li>Be specific about student progress and engagement during the session</li>
              <li>Note any challenges or concerns that arose</li>
              <li>Include observations that might inform future sessions</li>
              <li>Mark status as &quot;No Show&quot; if student didn&apos;t attend, &quot;Cancelled&quot; if session was cancelled</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  )
}
