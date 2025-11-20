import { CaseStatus } from '@/lib/types/cases'

const statusStyles: Record<CaseStatus, { bg: string; text: string; border: string }> = {
  OPEN: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300'
  },
  ON_HOLD: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300'
  },
  CLOSED: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300'
  },
  REFERRED_OUT: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300'
  }
}

const statusLabels: Record<CaseStatus, string> = {
  OPEN: 'Open',
  ON_HOLD: 'On Hold',
  CLOSED: 'Closed',
  REFERRED_OUT: 'Referred Out'
}

export default function CaseStatusBadge({ status, className = '' }: { status: CaseStatus; className?: string }) {
  const styles = statusStyles[status]
  const label = statusLabels[status]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border} ${className}`}>
      {label}
    </span>
  )
}
