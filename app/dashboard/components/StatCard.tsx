'use client'

interface StatCardProps {
  title: string
  value: number
  subtitle: string
  color: 'blue' | 'red' | 'green' | 'yellow'
  icon: string
  loading?: boolean
}

export function StatCard({ title, value, subtitle, color, icon, loading }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
  }

  const bgColorClasses = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
      color === 'blue' ? 'border-blue-500' :
      color === 'red' ? 'border-red-500' :
      color === 'green' ? 'border-green-500' :
      'border-yellow-500'
    } transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-full ${bgColorClasses[color]} flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
          {loading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            value
          )}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}
