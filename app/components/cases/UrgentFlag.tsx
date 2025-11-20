export default function UrgentFlag({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 border border-red-300 text-red-700 text-xs font-semibold ${className}`}>
      <span className="text-sm">🚨</span>
      <span>URGENT</span>
    </div>
  )
}
