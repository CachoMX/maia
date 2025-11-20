'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CaseFormData, Student } from '@/lib/types/cases'
import CaseForm from '@/app/components/cases/CaseForm'
import { Navigation } from '@/app/dashboard/components/Navigation'

// Mock data for initial development
const mockStudents: Student[] = [
  { id: '1', name: 'Sofia Martinez', grade: 'G5', dateOfBirth: '2015-03-15', studentId: 'ATL001', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '2', name: 'Lucas Chen', grade: 'MS', dateOfBirth: '2012-07-22', studentId: 'ATL002', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '3', name: 'Emma Thompson', grade: 'G3', dateOfBirth: '2017-01-10', studentId: 'ATL003', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '4', name: 'Omar Hassan', grade: 'HS', dateOfBirth: '2010-09-05', studentId: 'ATL004', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '5', name: 'Isabella Rodriguez', grade: 'K3', dateOfBirth: '2020-04-18', studentId: 'ATL005', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '6', name: 'Noah Williams', grade: 'G2', dateOfBirth: '2018-06-12', studentId: 'ATL006', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '7', name: 'Mia Garcia', grade: 'G4', dateOfBirth: '2016-11-30', studentId: 'ATL007', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '8', name: 'Ethan Kim', grade: 'G1', dateOfBirth: '2019-02-25', studentId: 'ATL008', createdAt: '2025-01-01', updatedAt: '2025-01-01' }
]

const mockCaseManagers = [
  { id: '1', first_name: 'Wendy', last_name: 'Aragón' },
  { id: '2', first_name: 'Lindsey', last_name: 'Barlow' },
  { id: '3', first_name: 'Jonica', last_name: 'Odom' }
]

export default function NewCasePage() {
  const router = useRouter()

  // Mock user data - in real app, get from auth
  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  const handleSubmit = async (data: CaseFormData) => {
    // TODO: Replace with actual API call
    console.log('Creating case:', data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message (you can add toast notification here)
    alert('Case created successfully!')

    // Redirect to cases list
    router.push('/cases')
  }

  const handleCancel = () => {
    router.push('/cases')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation userName={userName} userRole={userRole} />

      {/* Main Content - with padding for desktop sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top padding for fixed header */}
        <div className="pt-16 lg:pt-0">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/cases" className="hover:text-[#0066CC]">
            Cases
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Case</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Case</h2>
          <p className="text-gray-600">
            Create a new student support case. All fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <CaseForm
            students={mockStudents}
            caseManagers={mockCaseManagers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Case"
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Case Creation Tips:</p>
              <ul className="text-blue-800 space-y-1 ml-4 list-disc">
                <li>Choose the most appropriate case type for the student&apos;s primary need</li>
                <li>Start with Tier 1 unless there&apos;s clear evidence for Tier 2 or 3</li>
                <li>Mark as urgent only for cases requiring immediate intervention</li>
                <li>Provide detailed information in the reason for referral to help the case manager</li>
              </ul>
            </div>
          </div>
        </div>
          </main>
        </div>
      </div>
    </div>
  )
}
