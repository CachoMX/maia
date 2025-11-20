'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case } from '@/lib/types/cases'
import CaseList from '@/app/components/cases/CaseList'
import CaseFilters from '@/app/components/cases/CaseFilters'
import { Navigation } from '@/app/dashboard/components/Navigation'

// Mock data for initial development
const mockCases: Case[] = [
  {
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
    reasonForReferral: 'Student struggling with reading comprehension. Needs Tier 2 intervention support.',
    referralSource: 'TEACHER',
    openedDate: '2025-11-10',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-10'
  },
  {
    id: '2',
    studentId: '2',
    student: {
      id: '2',
      name: 'Lucas Chen',
      grade: 'MS',
      dateOfBirth: '2012-07-22',
      studentId: 'ATL002',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    caseType: 'BULLYING',
    tier: 3,
    status: 'OPEN',
    isUrgent: true,
    caseManagerId: '2',
    caseManager: {
      id: '2',
      first_name: 'Lindsey',
      last_name: 'Barlow'
    },
    reasonForReferral: 'Reports of ongoing bullying behavior. Following ATLAS bullying protocol.',
    referralSource: 'ADMIN',
    openedDate: '2025-11-15',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-15'
  },
  {
    id: '3',
    studentId: '3',
    student: {
      id: '3',
      name: 'Emma Thompson',
      grade: 'G3',
      dateOfBirth: '2017-01-10',
      studentId: 'ATL003',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    caseType: 'SEL',
    tier: 1,
    status: 'OPEN',
    isUrgent: false,
    caseManagerId: '1',
    caseManager: {
      id: '1',
      first_name: 'Wendy',
      last_name: 'Aragón'
    },
    reasonForReferral: 'Social-emotional support for anxiety during transitions.',
    referralSource: 'KID_TALK',
    openedDate: '2025-11-12',
    createdAt: '2025-11-12',
    updatedAt: '2025-11-12'
  },
  {
    id: '4',
    studentId: '4',
    student: {
      id: '4',
      name: 'Omar Hassan',
      grade: 'HS',
      dateOfBirth: '2010-09-05',
      studentId: 'ATL004',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    caseType: 'CONFLICT_RESOLUTION',
    tier: 2,
    status: 'ON_HOLD',
    isUrgent: false,
    caseManagerId: '3',
    caseManager: {
      id: '3',
      first_name: 'Jonica',
      last_name: 'Odom'
    },
    reasonForReferral: 'Mediation needed between student and peer group. Temporarily on hold pending parent meeting.',
    referralSource: 'BEHAVIOR_FORM',
    openedDate: '2025-11-08',
    createdAt: '2025-11-08',
    updatedAt: '2025-11-16'
  },
  {
    id: '5',
    studentId: '5',
    student: {
      id: '5',
      name: 'Isabella Rodriguez',
      grade: 'K3',
      dateOfBirth: '2020-04-18',
      studentId: 'ATL005',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    caseType: 'ACADEMIC_SUPPORT',
    tier: 1,
    status: 'CLOSED',
    isUrgent: false,
    caseManagerId: '2',
    caseManager: {
      id: '2',
      first_name: 'Lindsey',
      last_name: 'Barlow'
    },
    reasonForReferral: 'Early literacy support. Successfully completed Tier 1 intervention program.',
    referralSource: 'TEACHER',
    openedDate: '2025-10-01',
    closedDate: '2025-11-15',
    createdAt: '2025-10-01',
    updatedAt: '2025-11-15'
  }
]

const mockCaseManagers = [
  { id: '1', first_name: 'Wendy', last_name: 'Aragón' },
  { id: '2', first_name: 'Lindsey', last_name: 'Barlow' },
  { id: '3', first_name: 'Jonica', last_name: 'Odom' }
]

export default function CasesPage() {
  type FilterState = {
    status: 'ALL' | 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'
    caseType: 'ALL' | 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT'
    tier: 'ALL' | 1 | 2 | 3
    urgentOnly: boolean
    caseManagerId: string
  }

  const [cases, setCases] = useState<Case[]>(mockCases)
  const [filteredCases, setFilteredCases] = useState<Case[]>(mockCases)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    caseType: 'ALL',
    tier: 'ALL',
    urgentOnly: false,
    caseManagerId: ''
  })

  // Mock user data - in real app, get from auth
  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  useEffect(() => {
    let result = [...cases]

    // Apply filters
    if (filters.status !== 'ALL') {
      result = result.filter((c) => c.status === (filters.status as any))
    }
    if (filters.caseType !== 'ALL') {
      result = result.filter((c) => c.caseType === (filters.caseType as any))
    }
    if (filters.tier !== 'ALL') {
      result = result.filter((c) => c.tier === (filters.tier as any))
    }
    if (filters.urgentOnly) {
      result = result.filter((c) => c.isUrgent)
    }
    if (filters.caseManagerId) {
      result = result.filter((c) => c.caseManagerId === filters.caseManagerId)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((c) =>
        c.student?.name.toLowerCase().includes(query)
      )
    }

    // Sort: Urgent first, then by date (newest first)
    result.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1
      if (!a.isUrgent && b.isUrgent) return 1
      return new Date(b.openedDate).getTime() - new Date(a.openedDate).getTime()
    })

    setFilteredCases(result)
  }, [cases, filters, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation userName={userName} userRole={userRole} />

      {/* Main Content - with padding for desktop sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top padding for fixed header */}
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cases</h2>
            <p className="text-gray-600 mt-1">
              Manage student support cases and interventions
            </p>
          </div>
          <Link
            href="/cases/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0052A3] transition-colors shadow-sm"
          >
            <span className="text-xl">+</span>
            <span>Create New Case</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
            />
            <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Cases</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cases.filter((c) => c.status === 'OPEN').length}
                </p>
              </div>
              <span className="text-3xl">📂</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Urgent Cases</p>
                <p className="text-2xl font-bold text-red-600">
                  {cases.filter((c) => c.isUrgent && c.status === 'OPEN').length}
                </p>
              </div>
              <span className="text-3xl">🚨</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCases.length}</p>
              </div>
              <span className="text-3xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CaseFilters
              filters={filters}
              onFilterChange={setFilters}
              caseManagers={mockCaseManagers}
            />
          </div>

          {/* Cases List */}
          <div className="lg:col-span-3">
            <CaseList cases={filteredCases} />
          </div>
        </div>
          </main>
        </div>
      </div>
    </div>
  )
}
