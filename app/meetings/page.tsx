'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '../dashboard/components/Navigation'

interface Meeting {
  id: string
  title: string
  studentName: string
  studentId: string
  caseId?: string
  date: string
  time: string
  duration: number
  type: 'parent_meeting' | 'team_meeting' | 'iep_meeting' | 'other'
  location: string
  organizer: string
  attendees: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

// Mock data
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Parent Conference - Reading Progress',
    studentName: 'Sofia Martinez',
    studentId: 'ATL001',
    caseId: '1',
    date: '2025-11-20',
    time: '10:00',
    duration: 30,
    type: 'parent_meeting',
    location: 'SSS Office',
    organizer: 'Wendy Aragón',
    attendees: ['Parent: Maria Martinez', 'Teacher: Ms. Johnson', 'SSS: Wendy Aragón'],
    status: 'scheduled',
    notes: 'Discuss Tier 2 intervention progress'
  },
  {
    id: '2',
    title: 'Team Review - Math Intervention',
    studentName: 'Lucas Chen',
    studentId: 'ATL002',
    caseId: '2',
    date: '2025-11-18',
    time: '14:00',
    duration: 45,
    type: 'team_meeting',
    location: 'Conference Room B',
    organizer: 'Jonica Odom',
    attendees: ['Wendy Aragón', 'Jonica Odom', 'Lindsey Barlow', 'Math Teacher'],
    status: 'completed',
    notes: 'Student showing improvement. Continue Tier 3 support.'
  },
  {
    id: '3',
    title: 'IEP Planning Meeting',
    studentName: 'Emma Thompson',
    studentId: 'ATL003',
    caseId: '3',
    date: '2025-11-22',
    time: '11:00',
    duration: 60,
    type: 'iep_meeting',
    location: 'SSS Office',
    organizer: 'Lindsey Barlow',
    attendees: ['Parent: John Thompson', 'SSS: Lindsey Barlow', 'Teacher: Mr. Davis', 'Principal'],
    status: 'scheduled'
  },
  {
    id: '4',
    title: 'Parent Check-in',
    studentName: 'Omar Hassan',
    studentId: 'ATL004',
    caseId: '4',
    date: '2025-11-15',
    time: '15:30',
    duration: 30,
    type: 'parent_meeting',
    location: 'Virtual (Zoom)',
    organizer: 'Wendy Aragón',
    attendees: ['Parent: Fatima Hassan', 'SSS: Wendy Aragón'],
    status: 'completed',
    notes: 'Parents requesting more frequent communication. Follow up weekly.'
  },
  {
    id: '5',
    title: 'SSS Team Weekly Sync',
    studentName: 'Multiple Students',
    studentId: 'N/A',
    date: '2025-11-21',
    time: '13:00',
    duration: 60,
    type: 'team_meeting',
    location: 'SSS Office',
    organizer: 'Wendy Aragón',
    attendees: ['Wendy Aragón', 'Lindsey Barlow', 'Jonica Odom'],
    status: 'scheduled',
    notes: 'Review all active cases and upcoming deadlines'
  },
  {
    id: '6',
    title: 'Parent Conference - Behavioral Concerns',
    studentName: 'Diego Fernandez',
    studentId: 'ATL008',
    date: '2025-11-25',
    time: '09:00',
    duration: 45,
    type: 'parent_meeting',
    location: 'SSS Office',
    organizer: 'Lindsey Barlow',
    attendees: ['Parent: Carlos Fernandez', 'Teacher: Ms. Garcia', 'SSS: Lindsey Barlow'],
    status: 'scheduled'
  }
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(mockMeetings)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  useEffect(() => {
    let result = [...meetings]

    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      result = result.filter((m) => m.type === typeFilter)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((m) =>
        m.title.toLowerCase().includes(query) ||
        m.studentName.toLowerCase().includes(query) ||
        m.studentId.toLowerCase().includes(query)
      )
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredMeetings(result)
  }, [meetings, statusFilter, typeFilter, searchQuery])

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    const labels = {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      parent_meeting: 'bg-purple-100 text-purple-700',
      team_meeting: 'bg-orange-100 text-orange-700',
      iep_meeting: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700'
    }
    const labels = {
      parent_meeting: 'Parent Meeting',
      team_meeting: 'Team Meeting',
      iep_meeting: 'IEP Meeting',
      other: 'Other'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    )
  }

  const isUpcoming = (date: string, time: string) => {
    const meetingDate = new Date(`${date} ${time}`)
    return meetingDate > new Date()
  }

  const upcomingMeetings = meetings.filter((m) => m.status === 'scheduled' && isUpcoming(m.date, m.time))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName={userName} userRole={userRole} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Meetings</h2>
                <p className="text-gray-600 mt-1">
                  Schedule and manage parent and team meetings
                </p>
              </div>
              <Link
                href="/meetings/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0052A3] transition-colors shadow-sm"
              >
                <span className="text-xl">+</span>
                <span>Schedule Meeting</span>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Upcoming</p>
                    <p className="text-2xl font-bold text-blue-900">{upcomingMeetings.length}</p>
                  </div>
                  <span className="text-3xl">⏰</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Completed</p>
                    <p className="text-2xl font-bold text-green-900">
                      {meetings.filter((m) => m.status === 'completed').length}
                    </p>
                  </div>
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg shadow-sm p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Parent Meetings</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {meetings.filter((m) => m.type === 'parent_meeting').length}
                    </p>
                  </div>
                  <span className="text-3xl">👨‍👩‍👧</span>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'list'
                        ? 'bg-[#0066CC] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📋 List View
                  </button>
                  <button
                    onClick={() => setView('calendar')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'calendar'
                        ? 'bg-[#0066CC] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📅 Calendar View
                  </button>
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
                      placeholder="Search by title, student name, or student ID..."
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
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="ALL">All Types</option>
                    <option value="parent_meeting">Parent Meeting</option>
                    <option value="team_meeting">Team Meeting</option>
                    <option value="iep_meeting">IEP Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="md:col-span-2 flex items-end">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-[#0066CC]">{filteredMeetings.length}</span> of {meetings.length} meetings
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            {view === 'calendar' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📅</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
                  <p className="text-gray-600 mb-4">
                    Interactive calendar view coming soon. For now, use List View to see all meetings.
                  </p>
                  <button
                    onClick={() => setView('list')}
                    className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition-colors"
                  >
                    Switch to List View
                  </button>
                </div>
              </div>
            )}

            {/* List View */}
            {view === 'list' && (
              <>
                {filteredMeetings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <span className="text-6xl mb-4 block">🔍</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meetings Found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${
                          isUpcoming(meeting.date, meeting.time) && meeting.status === 'scheduled'
                            ? 'border-l-4 border-[#0066CC]'
                            : ''
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Left Section */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {meeting.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  {meeting.studentId !== 'N/A' && (
                                    <>
                                      <Link
                                        href={`/students/${meeting.studentId}`}
                                        className="text-[#0066CC] hover:text-[#0052A3] font-medium"
                                      >
                                        {meeting.studentName}
                                      </Link>
                                      <span>•</span>
                                      <span>{meeting.studentId}</span>
                                    </>
                                  )}
                                  {meeting.studentId === 'N/A' && (
                                    <span className="text-gray-500 italic">{meeting.studentName}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              {getStatusBadge(meeting.status)}
                              {getTypeBadge(meeting.type)}
                              {isUpcoming(meeting.date, meeting.time) && meeting.status === 'scheduled' && (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                                  Upcoming
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-gray-600">Date</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(meeting.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Time</p>
                                <p className="font-medium text-gray-900">{meeting.time}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-medium text-gray-900">{meeting.duration} min</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Location</p>
                                <p className="font-medium text-gray-900">{meeting.location}</p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-1">Organizer:</p>
                              <p className="text-sm font-medium text-gray-900">{meeting.organizer}</p>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-1">Attendees:</p>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {meeting.attendees.map((attendee, idx) => (
                                  <li key={idx}>• {attendee}</li>
                                ))}
                              </ul>
                            </div>

                            {meeting.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Notes:</p>
                                <p className="text-sm text-gray-700">{meeting.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Right Section - Actions */}
                          <div className="flex flex-col gap-2 lg:w-40">
                            {meeting.caseId && (
                              <Link
                                href={`/cases/${meeting.caseId}`}
                                className="text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              >
                                View Case
                              </Link>
                            )}
                            <button className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition-colors text-sm font-medium">
                              Edit Meeting
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
