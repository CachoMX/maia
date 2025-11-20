'use client'

import { useState } from 'react'
import { CaseFormData, CaseType, CaseTier, ReferralSource, Student } from '@/lib/types/cases'

interface CaseFormProps {
  initialData?: Partial<CaseFormData>
  students: Student[]
  caseManagers: Array<{ id: string; first_name: string; last_name: string }>
  onSubmit: (data: CaseFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function CaseForm({
  initialData,
  students,
  caseManagers,
  onSubmit,
  onCancel,
  submitLabel = 'Create Case'
}: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    studentId: initialData?.studentId || '',
    caseType: initialData?.caseType || 'ACADEMIC_SUPPORT',
    tier: initialData?.tier || 1,
    isUrgent: initialData?.isUrgent || false,
    caseManagerId: initialData?.caseManagerId || '',
    reasonForReferral: initialData?.reasonForReferral || '',
    referralSource: initialData?.referralSource || 'TEACHER'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CaseFormData, string>> = {}

    if (!formData.studentId) newErrors.studentId = 'Please select a student'
    if (!formData.caseManagerId) newErrors.caseManagerId = 'Please select a case manager'
    if (!formData.reasonForReferral.trim()) newErrors.reasonForReferral = 'Please provide a reason for referral'

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof CaseFormData>(field: K, value: CaseFormData[K]) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
          Student <span className="text-red-500">*</span>
        </label>
        <select
          id="studentId"
          value={formData.studentId}
          onChange={(e) => updateField('studentId', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.studentId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a student...</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.grade})
            </option>
          ))}
        </select>
        {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
      </div>

      {/* Case Type */}
      <div>
        <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-2">
          Case Type <span className="text-red-500">*</span>
        </label>
        <select
          id="caseType"
          value={formData.caseType}
          onChange={(e) => updateField('caseType', e.target.value as CaseType)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
        >
          <option value="ACADEMIC_SUPPORT">📚 Academic Support</option>
          <option value="SEL">💙 SEL (Social-Emotional Learning)</option>
          <option value="DISTINCTIONS">⭐ Distinctions</option>
          <option value="CONFLICT_RESOLUTION">🤝 Conflict Resolution</option>
          <option value="BULLYING">🛡️ Bullying</option>
          <option value="CHILD_PROTECTION">🔒 Child Protection</option>
          <option value="URGENT">🚨 Urgent</option>
        </select>
      </div>

      {/* Tier and Urgent Row */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
            Tier <span className="text-red-500">*</span>
          </label>
          <select
            id="tier"
            value={formData.tier}
            onChange={(e) => updateField('tier', Number(e.target.value) as CaseTier)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
          >
            <option value="1">Tier 1 - Universal Support</option>
            <option value="2">Tier 2 - Targeted Support</option>
            <option value="3">Tier 3 - Intensive Support</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgent Case?</label>
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              id="isUrgent"
              checked={formData.isUrgent}
              onChange={(e) => updateField('isUrgent', e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="isUrgent" className="ml-3 text-sm text-gray-700">
              Mark as urgent (requires immediate attention)
            </label>
          </div>
        </div>
      </div>

      {/* Case Manager */}
      <div>
        <label htmlFor="caseManagerId" className="block text-sm font-medium text-gray-700 mb-2">
          Case Manager <span className="text-red-500">*</span>
        </label>
        <select
          id="caseManagerId"
          value={formData.caseManagerId}
          onChange={(e) => updateField('caseManagerId', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.caseManagerId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a case manager...</option>
          {caseManagers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.first_name} {manager.last_name}
            </option>
          ))}
        </select>
        {errors.caseManagerId && <p className="mt-1 text-sm text-red-600">{errors.caseManagerId}</p>}
      </div>

      {/* Referral Source */}
      <div>
        <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
          Referral Source <span className="text-red-500">*</span>
        </label>
        <select
          id="referralSource"
          value={formData.referralSource}
          onChange={(e) => updateField('referralSource', e.target.value as ReferralSource)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
        >
          <option value="TEACHER">Teacher Referral</option>
          <option value="KID_TALK">KID Talk Meeting</option>
          <option value="BEHAVIOR_FORM">Behavior Form</option>
          <option value="SELF">Student Self-Referral</option>
          <option value="PARENT">Parent Request</option>
          <option value="ADMIN">Admin Referral</option>
        </select>
      </div>

      {/* Reason for Referral */}
      <div>
        <label htmlFor="reasonForReferral" className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Referral <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reasonForReferral"
          value={formData.reasonForReferral}
          onChange={(e) => updateField('reasonForReferral', e.target.value)}
          rows={5}
          placeholder="Describe the situation and reason for creating this case..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
            errors.reasonForReferral ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.reasonForReferral && <p className="mt-1 text-sm text-red-600">{errors.reasonForReferral}</p>}
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
          className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
