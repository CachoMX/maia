'use client'

import { Navigation } from '../dashboard/components/Navigation'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for charts
const tierDistributionData = [
  { grade: 'K3', tier1: 2, tier2: 1, tier3: 0 },
  { grade: 'G3', tier1: 3, tier2: 0, tier3: 0 },
  { grade: 'G4', tier1: 2, tier2: 0, tier3: 0 },
  { grade: 'G5', tier1: 1, tier2: 2, tier3: 0 },
  { grade: 'G6', tier1: 1, tier2: 0, tier3: 0 },
  { grade: 'MS', tier1: 0, tier2: 2, tier3: 1 },
  { grade: 'HS', tier1: 0, tier2: 2, tier3: 0 }
]

const caseTypeData = [
  { name: 'Academic Support', value: 35, color: '#0066CC' },
  { name: 'SEL', value: 25, color: '#FFD700' },
  { name: 'Conflict Resolution', value: 15, color: '#00AA33' },
  { name: 'Bullying', value: 15, color: '#FF6B6B' },
  { name: 'Child Protection', value: 5, color: '#9B59B6' },
  { name: 'Distinctions', value: 5, color: '#F97316' }
]

const caseLoadData = [
  { name: 'Wendy Aragón', cases: 12, tier1: 4, tier2: 5, tier3: 3 },
  { name: 'Lindsey Barlow', cases: 10, tier1: 5, tier2: 3, tier3: 2 },
  { name: 'Jonica Odom', cases: 8, tier1: 3, tier2: 3, tier3: 2 }
]

const monthlyTrendsData = [
  { month: 'Sep', openCases: 8, closedCases: 3, interventions: 12 },
  { month: 'Oct', openCases: 12, closedCases: 5, interventions: 18 },
  { month: 'Nov', openCases: 15, closedCases: 4, interventions: 22 },
  { month: 'Dec', openCases: 10, closedCases: 7, interventions: 20 },
  { month: 'Jan', openCases: 13, closedCases: 6, interventions: 25 },
  { month: 'Feb', openCases: 11, closedCases: 8, interventions: 23 }
]

const COLORS = ['#0066CC', '#FFD700', '#00AA33', '#FF6B6B', '#9B59B6', '#F97316']

export default function AnalyticsPage() {
  const userName = 'Wendy Aragón'
  const userRole = 'SSS Team Lead'

  const handleExportCSV = () => {
    // Mock CSV export functionality
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Cases', '30'],
      ['Active Cases', '23'],
      ['Tier 1 Students', '15'],
      ['Tier 2 Students', '10'],
      ['Tier 3 Students', '5'],
      ['Interventions Active', '22'],
      ['Meetings This Month', '8']
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maia-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
                <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600 mt-1">
                  Comprehensive insights and reports for SSS program
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00AA33] text-white font-semibold rounded-lg hover:bg-[#008822] transition-colors shadow-sm"
              >
                <span>📥</span>
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">📋</span>
                  <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">Total</span>
                </div>
                <p className="text-3xl font-bold mb-1">30</p>
                <p className="text-blue-100 text-sm">Active Cases</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">📚</span>
                  <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-3xl font-bold mb-1">22</p>
                <p className="text-orange-100 text-sm">Interventions</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">👥</span>
                  <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">Enrolled</span>
                </div>
                <p className="text-3xl font-bold mb-1">45</p>
                <p className="text-purple-100 text-sm">Students in SSS</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">✅</span>
                  <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">Success</span>
                </div>
                <p className="text-3xl font-bold mb-1">73%</p>
                <p className="text-green-100 text-sm">Goal Achievement</p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Tier Distribution by Grade */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tier Distribution by Grade
                  </h3>
                  <p className="text-sm text-gray-600">
                    Number of students in each tier across grade levels
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="grade" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar dataKey="tier1" name="Tier 1" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tier2" name="Tier 2" fill="#F97316" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tier3" name="Tier 3" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Case Types Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Case Types Breakdown
                  </h3>
                  <p className="text-sm text-gray-600">
                    Distribution of cases by type
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={caseTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {caseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Case Load by Staff Member */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Case Load by Staff Member
                  </h3>
                  <p className="text-sm text-gray-600">
                    Distribution of cases across SSS team
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caseLoadData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#6B7280', fontSize: 12 }} width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar dataKey="tier1" name="Tier 1" stackId="a" fill="#3B82F6" />
                      <Bar dataKey="tier2" name="Tier 2" stackId="a" fill="#F97316" />
                      <Bar dataKey="tier3" name="Tier 3" stackId="a" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Monthly Trends
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cases and interventions over time
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Line
                        type="monotone"
                        dataKey="openCases"
                        name="Cases Opened"
                        stroke="#0066CC"
                        strokeWidth={2}
                        dot={{ fill: '#0066CC', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="closedCases"
                        name="Cases Closed"
                        stroke="#00AA33"
                        strokeWidth={2}
                        dot={{ fill: '#00AA33', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="interventions"
                        name="Active Interventions"
                        stroke="#F97316"
                        strokeWidth={2}
                        dot={{ fill: '#F97316', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Summary Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Average Case Duration</p>
                  <p className="text-2xl font-bold text-gray-900">45 days</p>
                  <p className="text-xs text-gray-500 mt-1">Across all tiers</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">73%</p>
                  <p className="text-xs text-gray-500 mt-1">Students meeting goals</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Avg Sessions/Intervention</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Parent Meetings</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-500 mt-1">This semester</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <span className="text-4xl">💡</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Key Insights
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0066CC] font-bold">•</span>
                      <span><strong>Middle School</strong> has the highest concentration of Tier 2 and 3 cases - consider additional resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0066CC] font-bold">•</span>
                      <span><strong>Academic Support</strong> represents 35% of all cases - largest category for intervention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0066CC] font-bold">•</span>
                      <span><strong>Monthly trends</strong> show increasing intervention activity - team capacity should be monitored</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0066CC] font-bold">•</span>
                      <span><strong>Case closure rate</strong> is healthy at 73% goal achievement - continue current strategies</span>
                    </li>
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
