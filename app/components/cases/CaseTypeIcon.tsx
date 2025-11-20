import { CaseType } from '@/lib/types/cases'

const caseTypeIcons: Record<CaseType, { icon: string; color: string }> = {
  ACADEMIC_SUPPORT: { icon: '📚', color: 'text-blue-600' },
  SEL: { icon: '💙', color: 'text-pink-600' },
  DISTINCTIONS: { icon: '⭐', color: 'text-yellow-600' },
  CONFLICT_RESOLUTION: { icon: '🤝', color: 'text-green-600' },
  BULLYING: { icon: '🛡️', color: 'text-purple-600' },
  CHILD_PROTECTION: { icon: '🔒', color: 'text-red-600' },
  URGENT: { icon: '🚨', color: 'text-red-700' }
}

const caseTypeLabels: Record<CaseType, string> = {
  ACADEMIC_SUPPORT: 'Academic Support',
  SEL: 'SEL',
  DISTINCTIONS: 'Distinctions',
  CONFLICT_RESOLUTION: 'Conflict Resolution',
  BULLYING: 'Bullying',
  CHILD_PROTECTION: 'Child Protection',
  URGENT: 'Urgent'
}

export default function CaseTypeIcon({
  caseType,
  showLabel = false,
  className = ''
}: {
  caseType: CaseType
  showLabel?: boolean
  className?: string
}) {
  const { icon, color } = caseTypeIcons[caseType]
  const label = caseTypeLabels[caseType]

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-xl">{icon}</span>
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>
    )
  }

  return (
    <span className={`text-xl ${className}`} title={label}>
      {icon}
    </span>
  )
}
