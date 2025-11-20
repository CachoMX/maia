import Link from 'next/link'
import { Case } from '@/lib/types/cases'
import CaseStatusBadge from './CaseStatusBadge'
import CaseTierBadge from './CaseTierBadge'
import CaseTypeIcon from './CaseTypeIcon'
import UrgentFlag from './UrgentFlag'

export default function CaseCard({ caseData }: { caseData: Case }) {
  const openedDate = new Date(caseData.openedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link
      href={`/cases/${caseData.id}`}
      className={`block bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md hover:border-[#0066CC] ${
        caseData.isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <CaseTypeIcon caseType={caseData.caseType} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {caseData.student?.name || 'Unknown Student'}
              </h3>
              <p className="text-sm text-gray-500">
                {caseData.student?.grade || 'Unknown Grade'} • Opened {openedDate}
              </p>
            </div>
          </div>
          {caseData.isUrgent && <UrgentFlag />}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <CaseStatusBadge status={caseData.status} />
          <CaseTierBadge tier={caseData.tier} />
        </div>

        {/* Case Manager */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Case Manager:</span>
          <span>
            {caseData.caseManager
              ? `${caseData.caseManager.first_name} ${caseData.caseManager.last_name}`
              : 'Unassigned'}
          </span>
        </div>

        {/* Reason Preview */}
        {caseData.reasonForReferral && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {caseData.reasonForReferral}
          </p>
        )}
      </div>
    </Link>
  )
}
