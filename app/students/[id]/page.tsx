'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/app/dashboard/components/Navigation'
import { gradeLabels, caseTypeLabels } from '@/lib/types/cases'
import CaseStatusBadge from '@/app/components/cases/CaseStatusBadge'
import CaseTierBadge from '@/app/components/cases/CaseTierBadge'

interface StudentDetail {
  id: string
  name: string
  grade: string
  studentId: string
  dateOfBirth: string
  email?: string
  phone?: string
  currentTier: number | null
}

interface Case {
  id: string
  caseType: string
  tier: number
  status: string
  openedDate: string
  closedDate?: string
  caseManager: string
}

interface Intervention {
  id: string
  name: string
  type: string
  startDate: string
  endDate?: string
  sessionsCompleted: number
  totalSessions: number
  progress: number
}

interface Meeting {
  id: string
  title: string
  date: string
  type: string
  attendees: string[]
  notes?: string
}

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string

  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'interventions' | 'meetings'>('overview')

  // Mock data
  const student: StudentDetail = {
    id: studentId,
    name: 'Sofia Martinez',
    grade: 'G5',
    studentId: 'ATL001',
    dateOfBirth: '2015-03-15',
    email: 'sofia.martinez@atlas.edu',
    currentTier: 2
  }

  const cases: Case[] = [
    {
      id: '1',
      caseType: 'ACADEMIC_SUPPORT',
      tier: 2,
      status: 'OPEN',
      openedDate: '2025-11-10',
      caseManager: 'Wendy Aragón'
    },
    {
      id: '2',
      caseType: 'SEL',
      tier: 1,
      status: 'CLOSED',
      openedDate: '2025-09-15',
      closedDate: '2025-10-30',
      caseManager: 'Lindsey Barlow'
    }
  ]

  const interventions: Intervention[] = [
    {
      id: '1',
      name: 'Reading Comprehension Support',
      type: 'Academic',
      startDate: '2025-11-10',
      sessionsCompleted: 8,
      totalSessions: 12,
      progress: 67
    },
    {
      id: '2',
      name: 'Social Skills Group',
      type: 'SEL',
      startDate: '2025-09-15',
      endDate: '2025-10-30',
      sessionsCompleted: 12,
      totalSessions: 12,
      progress: 100
    }
  ]

  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Parent-Teacher Conference',
      date: '2025-11-15',
      type: 'parent_meeting',
      attendees: ['Parent: Maria Martinez', 'Teacher: Ms. Johnson', 'SSS: Wendy Aragón'],
      notes: 'Discussed progress in reading intervention. Parents supportive.'
    },
    {
      id: '2',
      title: 'SSS Team Review',
      date: '2025-10-20',
      type: 'team_meeting',
      attendees: ['Wendy Aragón', 'Lindsey Barlow', 'Jonica Odom'],
      notes: 'Reviewed tier placement and intervention effectiveness.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName={userName} userRole={userRole} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link
              href="/students"
              className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3] mb-6 font-medium"
            >
              ← Back to Students
            </Link>

            {/* Student Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0066CC] to-[#0052A3] flex items-center justify-center text-white text-3xl font-bold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ID:</span>
                        <span>{student.studentId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Grade:</span>
                        <span>{gradeLabels[student.grade as keyof typeof gradeLabels]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">DOB:</span>
                        <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {student.email && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {student.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {student.currentTier && (
                    <CaseTierBadge tier={student.currentTier as 1 | 2 | 3} />
                  )}
                  <Link
                    href={`/cases/new?studentId=${student.id}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0052A3] transition-colors text-sm"
                  >
                    + Create New Case
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    <p className="text-sm text-gray-600">Active Cases</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {cases.filter(c => c.status === 'OPEN').length}
                    </p>
                  </div>
                  <span className="text-3xl">📂</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Interventions</p>
                    <p className="text-2xl font-bold text-orange-600">{interventions.length}</p>
                  </div>
                  <span className="text-3xl">📚</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Meetings</p>
                    <p className="text-2xl font-bold text-green-600">{meetings.length}</p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'overview', label: 'Overview', icon: '👁️' },
                    { id: 'cases', label: 'Cases', icon: '📋' },
                    { id: 'interventions', label: 'Interventions', icon: '📚' },
                    { id: 'meetings', label: 'Meetings', icon: '📅' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#0066CC] text-[#0066CC]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                          <p className="text-sm text-gray-600">
                            {student.currentTier ? `Currently receiving Tier ${student.currentTier} support` : 'No active interventions'}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {cases.filter(c => c.status === 'OPEN').length} active case(s)
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                          <p className="text-sm text-gray-600">
                            Last case opened: {new Date(cases[0]?.openedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Last meeting: {new Date(meetings[0]?.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cases Tab */}
                {activeTab === 'cases' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">All Cases</h3>
                      <Link
                        href={`/cases/new?studentId=${student.id}`}
                        className="text-sm text-[#0066CC] hover:text-[#0052A3] font-semibold"
                      >
                        + New Case
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {cases.map((caseItem) => (
                        <Link
                          key={caseItem.id}
                          href={`/cases/${caseItem.id}`}
                          className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {caseTypeLabels[caseItem.caseType as 'ACADEMIC_SUPPORT' | 'SEL' | 'DISTINCTIONS' | 'CONFLICT_RESOLUTION' | 'BULLYING' | 'CHILD_PROTECTION' | 'URGENT']}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Opened: {new Date(caseItem.openedDate).toLocaleDateString()}
                                {caseItem.closedDate && ` • Closed: ${new Date(caseItem.closedDate).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <CaseStatusBadge status={caseItem.status as 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'REFERRED_OUT'} />
                              <CaseTierBadge tier={caseItem.tier as 1 | 2 | 3} />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Case Manager: {caseItem.caseManager}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interventions Tab */}
                {activeTab === 'interventions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Interventions</h3>
                    <div className="space-y-4">
                      {interventions.map((intervention) => (
                        <div key={intervention.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{intervention.name}</h4>
                              <p className="text-sm text-gray-600">{intervention.type}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded ${
                              intervention.progress === 100
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {intervention.progress === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{intervention.sessionsCompleted} / {intervention.totalSessions} sessions</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#0066CC] h-2 rounded-full transition-all"
                                style={{ width: `${intervention.progress}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(intervention.startDate).toLocaleDateString()}
                            {intervention.endDate && ` • Ended: ${new Date(intervention.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meetings Tab */}
                {activeTab === 'meetings' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">All Meetings</h3>
                      <Link
                        href={`/meetings/new?studentId=${student.id}`}
                        className="text-sm text-[#0066CC] hover:text-[#0052A3] font-semibold"
                      >
                        + Schedule Meeting
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {meetings.map((meeting) => (
                        <div key={meeting.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(meeting.date).toLocaleDateString()} at {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                              {meeting.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Attendees:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {meeting.attendees.map((attendee, idx) => (
                                <li key={idx}>• {attendee}</li>
                              ))}
                            </ul>
                          </div>
                          {meeting.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-700">{meeting.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
