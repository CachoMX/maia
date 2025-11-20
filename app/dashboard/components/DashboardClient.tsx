'use client'

import { useEffect, useState } from 'react'
import { StatCard } from './StatCard'
import { UrgentCasesList } from './UrgentCasesList'
import { MyCasesList } from './MyCasesList'
import { CaseLoadWidget } from './CaseLoadWidget'
import { TierDistributionChart } from './TierDistributionChart'
import { QuickActions } from './QuickActions'

interface DashboardStats {
  activeCases: number
  urgentCases: number
  activeInterventions: number
  upcomingMeetings: number
}

export function DashboardClient({ userName }: { userName: string }) {
  const [stats, setStats] = useState<DashboardStats>({
    activeCases: 0,
    urgentCases: 0,
    activeInterventions: 0,
    upcomingMeetings: 0,
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          subtitle="open cases"
          color="blue"
          icon="📋"
          loading={loading}
        />
        <StatCard
          title="Urgent Cases"
          value={stats.urgentCases}
          subtitle="require attention"
          color="red"
          icon="🚨"
          loading={loading}
        />
        <StatCard
          title="Interventions"
          value={stats.activeInterventions}
          subtitle="in progress"
          color="green"
          icon="📚"
          loading={loading}
        />
        <StatCard
          title="Meetings"
          value={stats.upcomingMeetings}
          subtitle="this week"
          color="yellow"
          icon="👥"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Urgent Cases Alert */}
      <UrgentCasesList />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Cases */}
        <MyCasesList />

        {/* Case Load Widget */}
        <CaseLoadWidget />
      </div>

      {/* Tier Distribution Chart */}
      <TierDistributionChart />
    </div>
  )
}
