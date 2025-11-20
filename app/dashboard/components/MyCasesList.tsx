'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Case {
  id: string
  case_type: string
  tier: number
  status: string
  is_urgent: boolean
  opened_date: string
  students: {
    id: string
    name: string
    grade: string
  }
}

export function MyCasesList() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyCases = async () => {
      try {
        const response = await fetch('/api/dashboard/my-cases')
        if (response.ok) {
          const data = await response.json()
          setCases(data.myCases || [])
        }
      } catch (error) {
        console.error('Error fetching my cases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyCases()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          My Assigned Cases
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          My Assigned Cases
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
          {cases.length}
        </span>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">📋</span>
          <p className="text-gray-500 text-sm">
            You have no assigned cases at this time
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {caseItem.is_urgent && (
                      <span className="text-red-500 text-sm">🚨</span>
                    )}
                    <h4 className="font-semibold text-gray-900">
                      {caseItem.students.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {caseItem.students.grade}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">
                      {caseItem.case_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={`px-2 py-0.5 text-white text-xs rounded ${
                      caseItem.tier === 1 ? 'bg-blue-500' :
                      caseItem.tier === 2 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      Tier {caseItem.tier}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      caseItem.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                      caseItem.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {caseItem.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                <Link
                  href={`/cases/${caseItem.id}`}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </Link>
                <span className="text-gray-300">•</span>
                <Link
                  href={`/cases/${caseItem.id}/edit`}
                  className="text-xs text-gray-600 hover:text-gray-700"
                >
                  Edit
                </Link>
                <span className="text-gray-300">•</span>
                <button className="text-xs text-gray-600 hover:text-gray-700">
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cases.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/cases"
            className="text-sm text-[#0066CC] hover:text-[#0052A3] font-medium"
          >
            View all cases →
          </Link>
        </div>
      )}
    </div>
  )
}
