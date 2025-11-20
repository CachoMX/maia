'use client'

import { useEffect, useState } from 'react'

interface CaseLoad {
  total_cases: number
  open_cases: number
  on_hold_cases: number
  tier_1_cases: number
  tier_2_cases: number
  tier_3_cases: number
  urgent_cases: number
}

export function CaseLoadWidget() {
  const [caseLoad, setCaseLoad] = useState<CaseLoad>({
    total_cases: 0,
    open_cases: 0,
    on_hold_cases: 0,
    tier_1_cases: 0,
    tier_2_cases: 0,
    tier_3_cases: 0,
    urgent_cases: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCaseLoad = async () => {
      try {
        const response = await fetch('/api/dashboard/case-load')
        if (response.ok) {
          const data = await response.json()
          setCaseLoad(data.caseLoad)
        }
      } catch (error) {
        console.error('Error fetching case load:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCaseLoad()
  }, [])

  // Determine color based on total cases
  const getLoadColor = (total: number) => {
    if (total < 15) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Optimal' }
    if (total <= 20) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Moderate' }
    return { bg: 'bg-red-500', text: 'text-red-700', label: 'High' }
  }

  const loadColor = getLoadColor(caseLoad.total_cases)
  const percentage = Math.min((caseLoad.total_cases / 25) * 100, 100)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          My Case Load
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        My Case Load
      </h3>

      {/* Total Cases with Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Total Cases</span>
          <span className={`text-sm font-semibold ${loadColor.text}`}>
            {loadColor.label}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${loadColor.bg} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 min-w-[60px] text-right">
            {caseLoad.total_cases}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Goal: Less than 15 cases per person
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-700">
            {caseLoad.open_cases}
          </div>
          <div className="text-xs text-green-600 font-medium">Open</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-700">
            {caseLoad.on_hold_cases}
          </div>
          <div className="text-xs text-yellow-600 font-medium">On Hold</div>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Distribution by Tier
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Tier 1</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {caseLoad.tier_1_cases}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Tier 2</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {caseLoad.tier_2_cases}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Tier 3</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {caseLoad.tier_3_cases}
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Cases Alert */}
      {caseLoad.urgent_cases > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚨</span>
            <div>
              <p className="text-sm font-semibold text-red-700">
                {caseLoad.urgent_cases} urgent case{caseLoad.urgent_cases !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-red-600">
                Require{caseLoad.urgent_cases !== 1 ? '' : 's'} immediate attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
