export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003D7A]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFD700]"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Maia...</h2>
        <p className="text-blue-200">Please wait</p>
      </div>
    </div>
  )
}
