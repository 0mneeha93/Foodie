import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const isGuest = user?.is_anonymous

  function scrollToSection(id) {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'Home',              action: () => navigate('/') },
    { label: 'YouTube to Recipe', action: () => navigate('/recipe') },
    { label: 'Track Calories',    action: () => navigate('/recipe') },
    { label: 'What to Cook',      action: () => navigate('/recipe') },
    { label: 'About Us',          action: () => scrollToSection('about-section') },
    { label: 'Contact Us',        action: () => scrollToSection('contact-section') },
  ]

  return (
    // Floating navbar — fixed at top, padded so it floats with gap from edges
    <nav className="fixed top-4 left-0 right-0 z-50 px-6">
      <div className="max-w-[1300px] mx-auto">
        <div className="bg-orange/5 backdrop-blur-md rounded-2xl px-6 h-14 flex items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-white/10">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="w-6 h-6 object-contain"
              onError={e => e.target.style.display = 'none'}
            />
            <span className="text-black font-bold text-lg tracking-tight font-outfit">
              Food<span className="text-[#D85A30]">ie</span>
            </span>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-3 py-1.5 rounded-xl text-[13px] font-medium text-black/65 hover:text-white hover:bg-white/10 transition-all duration-150 font-outfit whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#D85A30] flex items-center justify-center">
              <span className="text-black font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-black/60 text-xs font-outfit hidden md:block">
              {isGuest ? 'Guest' : userName}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-full border border-white/15 text-black/50 text-xs font-outfit hover:border-[#D85A30] hover:text-[#D85A30] transition-all duration-150"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}

