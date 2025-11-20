'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UrgentCase {
  id: string
  case_type: string
  opened_date: string
  tier: number
  status: string
  daysOpen: number
  students: {
    id: string
    name: string
    grade: string
  }
}

export function UrgentCasesList() {
  const [urgentCases, setUrgentCases] = useState<UrgentCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUrgentCases = async () => {
      try {
        const response = await fetch('/api/dashboard/urgent-cases')
        if (response.ok) {
          const data = await response.json()
          setUrgentCases(data.urgentCases || [])
        }
      } catch (error) {
        console.error('Error fetching urgent cases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUrgentCases()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">🚨</span>
          Urgent Cases
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (urgentCases.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border-l-4 border-green-500">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Everything Under Control
            </h3>
            <p className="text-sm text-green-700">
              No urgent cases at this time. Excellent work!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-sm p-6 border-l-4 border-red-500">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">🚨</span>
        Urgent Cases
        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
          {urgentCases.length}
        </span>
      </h3>
      <div className="space-y-3">
        {urgentCases.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/cases/${caseItem.id}`}
            className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-red-200 hover:border-red-400"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">
                    {caseItem.students.name}
                  </h4>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {caseItem.students.grade}
                  </span>
                  <span className={`px-2 py-0.5 text-white text-xs rounded ${
                    caseItem.tier === 1 ? 'bg-blue-500' :
                    caseItem.tier === 2 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}>
                    Tier {caseItem.tier}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-600">
                    {caseItem.case_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-red-600 font-medium">
                    {caseItem.daysOpen} days open
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 hover:text-[#0066CC]">
                  View details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
