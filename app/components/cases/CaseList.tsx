import { Case } from '@/lib/types/cases'
import CaseCard from './CaseCard'

export default function CaseList({ cases }: { cases: Case[] }) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No cases found</h3>
        <p className="text-gray-600 mb-6">
          No cases match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cases.map((caseData) => (
        <CaseCard key={caseData.id} caseData={caseData} />
      ))}
    </div>
  )
}
