'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '../dashboard/components/Navigation'
import { Grade, gradeLabels } from '@/lib/types/cases'

interface Student {
  id: string
  name: string
  grade: Grade
  studentId: string
  casesCount: number
  currentTier: number | null
  status: 'active' | 'inactive'
}

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Sofia Martinez',
    grade: 'G5',
    studentId: 'ATL001',
    casesCount: 2,
    currentTier: 2,
    status: 'active'
  },
  {
    id: '2',
    name: 'Lucas Chen',
    grade: 'MS',
    studentId: 'ATL002',
    casesCount: 1,
    currentTier: 3,
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    grade: 'G3',
    studentId: 'ATL003',
    casesCount: 1,
    currentTier: 1,
    status: 'active'
  },
  {
    id: '4',
    name: 'Omar Hassan',
    grade: 'HS',
    studentId: 'ATL004',
    casesCount: 3,
    currentTier: 2,
    status: 'active'
  },
  {
    id: '5',
    name: 'Isabella Rodriguez',
    grade: 'K3',
    studentId: 'ATL005',
    casesCount: 0,
    currentTier: null,
    status: 'active'
  },
  {
    id: '6',
    name: 'James Wilson',
    grade: 'G6',
    studentId: 'ATL006',
    casesCount: 1,
    currentTier: 1,
    status: 'active'
  },
  {
    id: '7',
    name: 'Amara Patel',
    grade: 'MS',
    studentId: 'ATL007',
    casesCount: 2,
    currentTier: 2,
    status: 'active'
  },
  {
    id: '8',
    name: 'Diego Fernandez',
    grade: 'G4',
    studentId: 'ATL008',
    casesCount: 1,
    currentTier: 1,
    status: 'active'
  }
]

export default function StudentsPage() {
  const [students] = useState<Student[]>(mockStudents)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('ALL')
  const [tierFilter, setTierFilter] = useState<string>('ALL')

  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  useEffect(() => {
    let result = [...students]

    // Apply grade filter
    if (gradeFilter !== 'ALL') {
      result = result.filter((s) => s.grade === gradeFilter)
    }

    // Apply tier filter
    if (tierFilter !== 'ALL') {
      if (tierFilter === 'NONE') {
        result = result.filter((s) => s.currentTier === null)
      } else {
        result = result.filter((s) => s.currentTier === parseInt(tierFilter))
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((s) =>
        s.name.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query)
      )
    }

    // Sort by name
    result.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredStudents(result)
  }, [students, gradeFilter, tierFilter, searchQuery])

  const getTierBadge = (tier: number | null) => {
    if (tier === null) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
          No Tier
        </span>
      )
    }
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
                <h2 className="text-3xl font-bold text-gray-900">Students</h2>
                <p className="text-gray-600 mt-1">
                  Student directory and case management
                </p>
              </div>
              <Link
                href="/students/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0052A3] transition-colors shadow-sm"
              >
                <span className="text-xl">+</span>
                <span>Add Student</span>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by student name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
                  </div>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Grade
                  </label>
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="ALL">All Grades</option>
                    <option value="PreK">Pre-K</option>
                    <option value="K1">K1</option>
                    <option value="K2">K2</option>
                    <option value="K3">K3</option>
                    <option value="G1">Grade 1</option>
                    <option value="G2">Grade 2</option>
                    <option value="G3">Grade 3</option>
                    <option value="G4">Grade 4</option>
                    <option value="G5">Grade 5</option>
                    <option value="G6">Grade 6</option>
                    <option value="MS">Middle School</option>
                    <option value="HS">High School</option>
                  </select>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Tier
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
                    <option value="NONE">No Tier</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-[#0066CC]">{filteredStudents.length}</span> of {students.length} students
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Tier 1</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {students.filter((s) => s.currentTier === 1).length}
                    </p>
                  </div>
                  <span className="text-3xl">🔵</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg shadow-sm p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700">Tier 2</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {students.filter((s) => s.currentTier === 2).length}
                    </p>
                  </div>
                  <span className="text-3xl">🟠</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Tier 3</p>
                    <p className="text-2xl font-bold text-red-900">
                      {students.filter((s) => s.currentTier === 3).length}
                    </p>
                  </div>
                  <span className="text-3xl">🔴</span>
                </div>
              </div>
            </div>

            {/* Students List */}
            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Tier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active Cases
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{gradeLabels[student.grade]}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{student.studentId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTierBadge(student.currentTier)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.casesCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/students/${student.id}`}
                              className="text-[#0066CC] hover:text-[#0052A3] font-semibold"
                            >
                              View Details →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
