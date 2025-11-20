'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '../dashboard/components/Navigation'

interface Intervention {
  id: string
  name: string
  studentName: string
  studentId: string
  caseId: string
  caseType: string
  tier: number
  type: 'Academic' | 'SEL' | 'Behavioral' | 'Other'
  startDate: string
  endDate?: string
  frequency: string
  sessionsCompleted: number
  totalSessions: number
  provider: string
  status: 'active' | 'completed' | 'on_hold'
  progress: number
}

// Mock data
const mockInterventions: Intervention[] = [
  {
    id: '1',
    name: 'Reading Comprehension Support',
    studentName: 'Sofia Martinez',
    studentId: 'ATL001',
    caseId: '1',
    caseType: 'ACADEMIC_SUPPORT',
    tier: 2,
    type: 'Academic',
    startDate: '2025-11-10',
    frequency: '3x per week',
    sessionsCompleted: 8,
    totalSessions: 12,
    provider: 'Wendy Aragón',
    status: 'active',
    progress: 67
  },
  {
    id: '2',
    name: 'Social Skills Group',
    studentName: 'Emma Thompson',
    studentId: 'ATL003',
    caseId: '3',
    caseType: 'SEL',
    tier: 1,
    type: 'SEL',
    startDate: '2025-09-15',
    endDate: '2025-10-30',
    frequency: '2x per week',
    sessionsCompleted: 12,
    totalSessions: 12,
    provider: 'Lindsey Barlow',
    status: 'completed',
    progress: 100
  },
  {
    id: '3',
    name: 'Math Intervention',
    studentName: 'Lucas Chen',
    studentId: 'ATL002',
    caseId: '2',
    caseType: 'ACADEMIC_SUPPORT',
    tier: 3,
    type: 'Academic',
    startDate: '2025-11-01',
    frequency: 'Daily',
    sessionsCompleted: 15,
    totalSessions: 20,
    provider: 'Jonica Odom',
    status: 'active',
    progress: 75
  },
  {
    id: '4',
    name: 'Behavior Management',
    studentName: 'Omar Hassan',
    studentId: 'ATL004',
    caseId: '4',
    caseType: 'CONFLICT_RESOLUTION',
    tier: 2,
    type: 'Behavioral',
    startDate: '2025-10-15',
    frequency: '2x per week',
    sessionsCompleted: 6,
    totalSessions: 10,
    provider: 'Wendy Aragón',
    status: 'on_hold',
    progress: 60
  },
  {
    id: '5',
    name: 'Writing Support',
    studentName: 'Diego Fernandez',
    studentId: 'ATL008',
    caseId: '8',
    caseType: 'ACADEMIC_SUPPORT',
    tier: 1,
    type: 'Academic',
    startDate: '2025-11-05',
    frequency: '2x per week',
    sessionsCompleted: 4,
    totalSessions: 12,
    provider: 'Lindsey Barlow',
    status: 'active',
    progress: 33
  },
  {
    id: '6',
    name: 'Anxiety Management',
    studentName: 'Amara Patel',
    studentId: 'ATL007',
    caseId: '7',
    caseType: 'SEL',
    tier: 2,
    type: 'SEL',
    startDate: '2025-10-20',
    frequency: '1x per week',
    sessionsCompleted: 5,
    totalSessions: 8,
    provider: 'Jonica Odom',
    status: 'active',
    progress: 63
  }
]

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions)
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>(mockInterventions)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [tierFilter, setTierFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  useEffect(() => {
    let result = [...interventions]

    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((i) => i.status === statusFilter)
    }

    // Apply tier filter
    if (tierFilter !== 'ALL') {
      result = result.filter((i) => i.tier === parseInt(tierFilter))
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      result = result.filter((i) => i.type === typeFilter)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((i) =>
        i.name.toLowerCase().includes(query) ||
        i.studentName.toLowerCase().includes(query) ||
        i.studentId.toLowerCase().includes(query)
      )
    }

    // Sort: Active first, then by start date (newest first)
    result.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    setFilteredInterventions(result)
  }, [interventions, statusFilter, tierFilter, typeFilter, searchQuery])

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      on_hold: 'bg-yellow-100 text-yellow-700'
    }
    const labels = {
      active: 'Active',
      completed: 'Completed',
      on_hold: 'On Hold'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getTierBadge = (tier: number) => {
    const colors = {
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-orange-100 text-orange-700',
      3: 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[tier as keyof typeof colors]}`}>
        Tier {tier}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName={userName} userRole={userRole} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Interventions</h2>
                <p className="text-gray-600 mt-1">
                  Track and manage student interventions across all tiers
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interventions</p>
                    <p className="text-2xl font-bold text-gray-900">{interventions.length}</p>
                  </div>
                  <span className="text-3xl">📚</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {interventions.filter((i) => i.status === 'active').length}
                    </p>
                  </div>
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Completed</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {interventions.filter((i) => i.status === 'completed').length}
                    </p>
                  </div>
                  <span className="text-3xl">🎉</span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">On Hold</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {interventions.filter((i) => i.status === 'on_hold').length}
                    </p>
                  </div>
                  <span className="text-3xl">⏸️</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by intervention name, student name, or student ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier
                  </label>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="ALL">All Tiers</option>
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="ALL">All Types</option>
                    <option value="Academic">Academic</option>
                    <option value="SEL">SEL</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-[#0066CC]">{filteredInterventions.length}</span> of {interventions.length} interventions
                  </div>
                </div>
              </div>
            </div>

            {/* Interventions List */}
            {filteredInterventions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Interventions Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterventions.map((intervention) => (
                  <div key={intervention.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {intervention.name}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Link
                                href={`/students/${intervention.studentId}`}
                                className="text-[#0066CC] hover:text-[#0052A3] font-medium"
                              >
                                {intervention.studentName}
                              </Link>
                              <span>•</span>
                              <span>{intervention.studentId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {getStatusBadge(intervention.status)}
                          {getTierBadge(intervention.tier)}
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            {intervention.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Provider</p>
                            <p className="font-medium text-gray-900">{intervention.provider}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium text-gray-900">{intervention.frequency}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Started</p>
                            <p className="font-medium text-gray-900">
                              {new Date(intervention.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Sessions</p>
                            <p className="font-medium text-gray-900">
                              {intervention.sessionsCompleted} / {intervention.totalSessions}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Progress */}
                      <div className="lg:w-64">
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span className="font-semibold text-gray-900">{intervention.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                intervention.progress === 100
                                  ? 'bg-green-500'
                                  : intervention.progress >= 50
                                  ? 'bg-[#0066CC]'
                                  : 'bg-orange-500'
                              }`}
                              style={{ width: `${intervention.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/cases/${intervention.caseId}`}
                          className="inline-flex items-center gap-1 text-sm text-[#0066CC] hover:text-[#0052A3] font-semibold mt-2"
                        >
                          View Case →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
