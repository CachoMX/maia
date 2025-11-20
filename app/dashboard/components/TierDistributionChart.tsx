'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface TierData {
  grade: string
  total_students: number
  tier_1_count: number
  tier_2_count: number
  tier_3_count: number
  tier_1_percentage: number
  tier_2_percentage: number
  tier_3_percentage: number
}

export function TierDistributionChart() {
  const [data, setData] = useState<TierData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTierDistribution = async () => {
      try {
        const response = await fetch('/api/dashboard/tier-distribution')
        if (response.ok) {
          const result = await response.json()
          setData(result.tierDistribution || [])
        }
      } catch (error) {
        console.error('Error fetching tier distribution:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTierDistribution()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribution by Tier and Grade
        </h3>
        <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribution by Tier and Grade
        </h3>
        <div className="text-center py-12">
          <span className="text-4xl mb-2 block">📊</span>
          <p className="text-gray-500 text-sm">
            No data available to display
          </p>
        </div>
      </div>
    )
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    grade: item.grade,
    'Tier 1': item.tier_1_percentage || 0,
    'Tier 2': item.tier_2_percentage || 0,
    'Tier 3': item.tier_3_percentage || 0,
    total: item.total_students
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const gradeData = data.find(d => d.grade === label)
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-xs text-gray-600 mb-2">
            Total: {gradeData?.total_students} students
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-gray-700">{entry.name}:</span>
              </div>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Distribution by Tier and Grade
        </h3>
        <p className="text-sm text-gray-600">
          Percentage of students at each intervention level by grade
        </p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">Key Insight:</span> This metric is highly valuable
            for identifying grades that require more support and planning resources.
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="grade"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#D1D5DB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#D1D5DB' }}
              label={{ value: '% Students', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 12 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar dataKey="Tier 1" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Tier 2" fill="#F97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Tier 3" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.tier_1_count, 0)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total Tier 1</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((sum, item) => sum + item.tier_2_count, 0)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total Tier 2</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {data.reduce((sum, item) => sum + item.tier_3_count, 0)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total Tier 3</div>
        </div>
      </div>
    </div>
  )
}
