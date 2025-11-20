'use client'

import { useState } from 'react'
import { Case } from '@/lib/types/cases'

interface UploadFileModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case
  onSuccess: () => void
}

export default function UploadFileModal({
  isOpen,
  onClose,
  caseData,
  onSuccess
}: UploadFileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fileCategory: 'ASSESSMENT',
    description: '',
    isConfidential: false,
    tags: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate
      if (!selectedFile) {
        throw new Error('Please select a file to upload')
      }

      if (!formData.description) {
        throw new Error('Please provide a description')
      }

      // API call would go here
      // const formDataToSend = new FormData()
      // formDataToSend.append('file', selectedFile)
      // formDataToSend.append('caseId', caseData.id)
      // formDataToSend.append('category', formData.fileCategory)
      // formDataToSend.append('description', formData.description)
      // formDataToSend.append('isConfidential', formData.isConfidential.toString())
      // formDataToSend.append('tags', formData.tags)
      // await fetch('/api/files', { method: 'POST', body: formDataToSend })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Success
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setFormData({
      fileCategory: 'ASSESSMENT',
      description: '',
      isConfidential: false,
      tags: ''
    })
    setError(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
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
                <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add documents and files to {caseData.student?.name}&apos;s case
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

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  disabled={isLoading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                />
                <label
                  htmlFor="fileInput"
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    selectedFile
                      ? 'border-[#0066CC] bg-blue-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center text-center">
                      <svg className="w-12 h-12 text-[#0066CC] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{formatFileSize(selectedFile.size)}</p>
                      <p className="text-xs text-[#0066CC] mt-2">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, Word, Excel, Images (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* File Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Category *
              </label>
              <select
                value={formData.fileCategory}
                onChange={(e) => setFormData({ ...formData, fileCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="ASSESSMENT">Assessment / Evaluation</option>
                <option value="REPORT">Progress Report</option>
                <option value="IEP">IEP / 504 Plan</option>
                <option value="MEDICAL">Medical Documentation</option>
                <option value="CONSENT">Consent Form</option>
                <option value="COMMUNICATION">Communication / Correspondence</option>
                <option value="INTERVENTION">Intervention Plan</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="Describe the contents of this file..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                placeholder="e.g., reading, math, behavior (comma separated)"
                disabled={isLoading}
              />
            </div>

            {/* Confidential Flag */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="isConfidential"
                checked={formData.isConfidential}
                onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] mt-1"
                disabled={isLoading}
              />
              <div className="ml-3">
                <label htmlFor="isConfidential" className="text-sm font-medium text-gray-700">
                  Mark as confidential
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Confidential files require special permissions to access
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
                disabled={isLoading || !selectedFile}
                className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload File'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
