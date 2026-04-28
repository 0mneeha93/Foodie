import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
      <div className="text-center">
        <p className="font-outfit text-8xl font-bold text-[#E0E0E0]">404</p>
        <p className="font-outfit text-2xl font-bold text-[#1A1A1A] mt-4">Page not found</p>
        <p className="font-outfit text-[#6B6B6B] mt-2">Looks like this recipe doesn't exist</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-[#D85A30] text-white font-outfit font-medium rounded-xl hover:bg-[#C04E28] transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}