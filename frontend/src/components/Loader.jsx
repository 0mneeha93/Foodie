export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#D85A30] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-outfit text-[#6B6B6B] text-sm">{message}</p>
      </div>
    </div>
  )
}