import { CaseTier } from '@/lib/types/cases'

const tierStyles: Record<CaseTier, { bg: string; text: string; border: string }> = {
  1: {
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-300'
  },
  2: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300'
  },
  3: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300'
  }
}

export default function CaseTierBadge({ tier, className = '' }: { tier: CaseTier; className?: string }) {
  const styles = tierStyles[tier]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border} ${className}`}>
      Tier {tier}
    </span>
  )
}
