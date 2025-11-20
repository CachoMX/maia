'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Case } from '@/lib/types/cases'
import CaseStatusBadge from '@/app/components/cases/CaseStatusBadge'
import CaseTierBadge from '@/app/components/cases/CaseTierBadge'
import CaseTypeIcon from '@/app/components/cases/CaseTypeIcon'
import UrgentFlag from '@/app/components/cases/UrgentFlag'
import { Navigation } from '@/app/dashboard/components/Navigation'
import AddInterventionModal from '@/app/components/cases/AddInterventionModal'
import AddSessionModal from '@/app/components/cases/AddSessionModal'
import ScheduleMeetingModal from '@/app/components/cases/ScheduleMeetingModal'
import UploadFileModal from '@/app/components/cases/UploadFileModal'
import ChangeStatusModal from '@/app/components/cases/ChangeStatusModal'
import EditCaseModal from '@/app/components/cases/EditCaseModal'
import ReassignManagerModal from '@/app/components/cases/ReassignManagerModal'
import CloseCaseModal from '@/app/components/cases/CloseCaseModal'

// Mock data for development
const mockCase: Case = {
  id: '1',
  studentId: '1',
  student: {
    id: '1',
    name: 'Sofia Martinez',
    grade: 'G5',
    dateOfBirth: '2015-03-15',
    studentId: 'ATL001',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  caseType: 'ACADEMIC_SUPPORT',
  tier: 2,
  status: 'OPEN',
  isUrgent: false,
  caseManagerId: '1',
  caseManager: {
    id: '1',
    first_name: 'Wendy',
    last_name: 'Aragón'
  },
  reasonForReferral: 'Student struggling with reading comprehension and needs Tier 2 intervention support. Teacher reports difficulty with understanding complex texts and answering inference questions. Parent is supportive and willing to participate in intervention planning.',
  referralSource: 'TEACHER',
  openedDate: '2025-11-10',
  createdAt: '2025-11-10',
  updatedAt: '2025-11-10'
}

type TabType = 'overview' | 'interventions' | 'sessions' | 'meetings' | 'files'

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [caseData] = useState<Case>(mockCase) // In real app, fetch based on params.id

  // Modal states
  const [isAddInterventionOpen, setIsAddInterventionOpen] = useState(false)
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false)
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false)
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false)
  const [isEditCaseOpen, setIsEditCaseOpen] = useState(false)
  const [isReassignManagerOpen, setIsReassignManagerOpen] = useState(false)
  const [isCloseCaseOpen, setIsCloseCaseOpen] = useState(false)

  // Success toast state
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Mock user data - in real app, get from auth
  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  // Success handler for all modals
  const handleSuccess = (message: string) => {
    setSuccessMessage(message)
    // Auto-hide success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const openedDate = new Date(caseData.openedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const studentAge = Math.floor(
    (new Date().getTime() - new Date(caseData.student!.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  )

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'interventions', label: 'Interventions', icon: '📚' },
    { id: 'sessions', label: 'Sessions', icon: '📝' },
    { id: 'meetings', label: 'Parent Meetings', icon: '👥' },
    { id: 'files', label: 'Files', icon: '📎' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation userName={userName} userRole={userRole} />

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto hover:bg-green-700 rounded p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content - with padding for desktop sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top padding for fixed header */}
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/cases" className="hover:text-[#0066CC]">
            Cases
          </Link>
          <span>/</span>
              <span className="text-gray-900 font-medium">{caseData.student?.name}</span>
            </nav>

            {/* Case Header Card */}
            <div className={`bg-white rounded-xl shadow-sm border-2 p-8 mb-8 ${caseData.isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <CaseTypeIcon caseType={caseData.caseType} className="text-4xl" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {caseData.student?.name}
                    </h2>
                    <p className="text-gray-600">
                      {caseData.student?.grade} • Age {studentAge} • Student ID: {caseData.student?.studentId}
                    </p>
                  </div>
                </div>
                {caseData.isUrgent && <UrgentFlag />}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <CaseStatusBadge status={caseData.status} />
                <CaseTierBadge tier={caseData.tier} />
                <CaseTypeIcon caseType={caseData.caseType} showLabel />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Case Manager</p>
                  <p className="font-semibold text-gray-900">
                    {caseData.caseManager?.first_name} {caseData.caseManager?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Opened Date</p>
                  <p className="font-semibold text-gray-900">{openedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Referral Source</p>
                  <p className="font-semibold text-gray-900">
                    {caseData.referralSource.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditCaseOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors"
                >
                  Edit Case
                </button>
                <button
                  onClick={() => setIsChangeStatusOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Status
                </button>
                <button
                  onClick={() => setIsReassignManagerOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reassign Case Manager
                </button>
                <button
                  onClick={() => setIsCloseCaseOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors ml-auto"
                >
                  Close Case
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#0066CC] text-[#0066CC]'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Reason for Referral
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700">{caseData.reasonForReferral}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Case Information
                        </h3>
                        <dl className="space-y-3">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Case Type:</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {caseData.caseType.replace('_', ' ')}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Tier Level:</dt>
                            <dd className="text-sm font-medium text-gray-900">Tier {caseData.tier}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Status:</dt>
                            <dd className="text-sm font-medium text-gray-900">{caseData.status}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Urgent:</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {caseData.isUrgent ? 'Yes' : 'No'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Timeline
                        </h3>
                        <dl className="space-y-3">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Created:</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {new Date(caseData.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Last Updated:</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {new Date(caseData.updatedAt).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Days Open:</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {Math.floor(
                                (new Date().getTime() - new Date(caseData.openedDate).getTime()) /
                                  (24 * 60 * 60 * 1000)
                              )}{' '}
                              days
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'interventions' && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No interventions yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create the first intervention plan for this case
                    </p>
                    <button
                      onClick={() => setIsAddInterventionOpen(true)}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors"
                    >
                      Add Intervention
                    </button>
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions documented</h3>
                    <p className="text-gray-600 mb-6">
                      Document intervention sessions and progress notes
                    </p>
                    <button
                      onClick={() => setIsAddSessionOpen(true)}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors"
                    >
                      Add Session
                    </button>
                  </div>
                )}

                {activeTab === 'meetings' && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <span className="text-4xl">👥</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No parent meetings scheduled</h3>
                    <p className="text-gray-600 mb-6">
                      Schedule meetings with parents and guardians
                    </p>
                    <button
                      onClick={() => setIsScheduleMeetingOpen(true)}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors"
                    >
                      Schedule Meeting
                    </button>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <span className="text-4xl">📎</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No files attached</h3>
                    <p className="text-gray-600 mb-6">
                      Upload documents, reports, and other files related to this case
                    </p>
                    <button
                      onClick={() => setIsUploadFileOpen(true)}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052A3] transition-colors"
                    >
                      Upload File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* All Modals */}
      <AddInterventionModal
        isOpen={isAddInterventionOpen}
        onClose={() => setIsAddInterventionOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Intervention created successfully!')}
      />

      <AddSessionModal
        isOpen={isAddSessionOpen}
        onClose={() => setIsAddSessionOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Session documented successfully!')}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Meeting scheduled successfully!')}
      />

      <UploadFileModal
        isOpen={isUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('File uploaded successfully!')}
      />

      <ChangeStatusModal
        isOpen={isChangeStatusOpen}
        onClose={() => setIsChangeStatusOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Case status updated successfully!')}
      />

      <EditCaseModal
        isOpen={isEditCaseOpen}
        onClose={() => setIsEditCaseOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Case updated successfully!')}
      />

      <ReassignManagerModal
        isOpen={isReassignManagerOpen}
        onClose={() => setIsReassignManagerOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Case manager reassigned successfully!')}
      />

      <CloseCaseModal
        isOpen={isCloseCaseOpen}
        onClose={() => setIsCloseCaseOpen(false)}
        caseData={caseData}
        onSuccess={() => handleSuccess('Case closed successfully!')}
      />
    </div>
  )
}
