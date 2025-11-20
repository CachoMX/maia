'use client'

import { CaseStatus, CaseType, CaseTier } from '@/lib/types/cases'

interface FilterState {
  status: CaseStatus | 'ALL'
  caseType: CaseType | 'ALL'
  tier: CaseTier | 'ALL'
  urgentOnly: boolean
  caseManagerId: string
}

interface CaseFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  caseManagers: Array<{ id: string; first_name: string; last_name: string }>
}

export default function CaseFilters({ filters, onFilterChange, caseManagers }: CaseFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="CLOSED">Closed</option>
          <option value="REFERRED_OUT">Referred Out</option>
        </select>
      </div>

      {/* Case Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
        <select
          value={filters.caseType}
          onChange={(e) => updateFilter('caseType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="ACADEMIC_SUPPORT">Academic Support</option>
          <option value="SEL">SEL</option>
          <option value="DISTINCTIONS">Distinctions</option>
          <option value="CONFLICT_RESOLUTION">Conflict Resolution</option>
          <option value="BULLYING">Bullying</option>
          <option value="CHILD_PROTECTION">Child Protection</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Tier Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
        <select
          value={filters.tier}
          onChange={(e) => updateFilter('tier', e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as CaseTier)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent text-sm"
        >
          <option value="ALL">All Tiers</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </select>
      </div>

      {/* Case Manager Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Case Manager</label>
        <select
          value={filters.caseManagerId}
          onChange={(e) => updateFilter('caseManagerId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent text-sm"
        >
          <option value="">All Managers</option>
          {caseManagers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.first_name} {manager.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Urgent Only */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="urgentOnly"
          checked={filters.urgentOnly}
          onChange={(e) => updateFilter('urgentOnly', e.target.checked)}
          className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC]"
        />
        <label htmlFor="urgentOnly" className="ml-2 text-sm font-medium text-gray-700">
          Show urgent cases only
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          onFilterChange({
            status: 'ALL',
            caseType: 'ALL',
            tier: 'ALL',
            urgentOnly: false,
            caseManagerId: ''
          })
        }
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}
