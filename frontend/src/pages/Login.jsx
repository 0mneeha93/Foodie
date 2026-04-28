import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const imgs = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80',
]

export default function Login() {
  const [mode, setMode] = useState('welcome')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgIndex] = useState(Math.floor(Math.random() * imgs.length))
  const navigate = useNavigate()
  
  async function handleSignup(e) {
    e.preventDefault()
    if (!name || !email || !password) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleGuest() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInAnonymously()
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ maxHeight: '100vh' }}>
        <img
          src={imgs[imgIndex]}
          alt="Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" onError={e => e.target.style.display = 'none'} />
            <span className="text-white font-outfit font-bold text-2xl tracking-tight">Foodie</span>
          </div>
          <p className="text-white/70 text-sm mt-1 font-outfit">Your AI-powered kitchen companion</p>
        </div>
        <div className="absolute bottom-10 left-8 right-8">
          <p className="text-white font-outfit text-xl font-light leading-snug">
            "Cooking is an art, but all art requires knowing something about the techniques."
          </p>
          <p className="text-white/60 text-sm mt-3 font-outfit">— Nathan Myhrvold</p>
        </div>
      </div>

      {/* Right Side — Auth */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAFAF7] px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" onError={e => e.target.style.display = 'none'} />
            <span className="font-outfit font-bold text-2xl text-[#1A1A1A]">Foodie</span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-outfit">{error}</p>
            </div>
          )}

          {/* Welcome */}
          {mode === 'welcome' && (
            <div>
              <h1 className="font-outfit text-4xl font-bold text-[#1A1A1A] leading-tight">
                What are we<br />cooking today?
              </h1>
              <p className="text-[#6B6B6B] font-outfit mt-3 text-base">
                Get a perfect meal
              </p>
              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={() => setMode('signup')}
                  className="w-full bg-[#D85A30] text-white font-outfit font-medium py-3.5 rounded-xl hover:bg-[#C04E28] transition-all duration-200 text-base"
                >
                  Create an Account
                </button>
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-white text-[#1A1A1A] font-outfit font-medium py-3.5 rounded-xl border border-[#E0E0E0] hover:border-[#D85A30] transition-all duration-200 text-base"
                >
                  Log In
                </button>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-[#E0E0E0]" />
                  <span className="text-[#9B9B9B] text-sm font-outfit">or</span>
                  <div className="flex-1 h-px bg-[#E0E0E0]" />
                </div>
                <button
                  onClick={handleGuest}
                  disabled={loading}
                  className="w-full bg-[#F5F0EB] text-[#6B6B6B] font-outfit font-medium py-3.5 rounded-xl hover:bg-[#EDE8E3] transition-all duration-200 text-base disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : 'Continue as Guest'}
                </button>
              </div>
            </div>
          )}

          {/* Login */}
          {mode === 'login' && (
            <div>
              <button
                onClick={() => { setMode('welcome'); setError('') }}
                className="text-[#6B6B6B] font-outfit text-sm mb-6 hover:text-[#D85A30] transition-colors"
              >
                Back
              </button>
              <h1 className="font-outfit text-3xl font-bold text-[#1A1A1A]">Welcome back</h1>
              <p className="text-[#6B6B6B] font-outfit mt-2 text-sm">Log in to access your saved recipes</p>
              <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-outfit font-medium text-[#6B6B6B] uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-[#E0E0E0] bg-white font-outfit text-[#1A1A1A] text-sm outline-none focus:border-[#D85A30] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-outfit font-medium text-[#6B6B6B] uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-[#E0E0E0] bg-white font-outfit text-[#1A1A1A] text-sm outline-none focus:border-[#D85A30] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D85A30] text-white font-outfit font-medium py-3.5 rounded-xl hover:bg-[#C04E28] transition-all duration-200 mt-2 disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
              <p className="text-center text-sm font-outfit text-[#6B6B6B] mt-6">
                Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError('') }} className="text-[#D85A30] font-medium hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* Signup */}
          {mode === 'signup' && (
            <div>
              <button
                onClick={() => { setMode('welcome'); setError('') }}
                className="text-[#6B6B6B] font-outfit text-sm mb-6 hover:text-[#D85A30] transition-colors"
              >
                Back
              </button>
              <h1 className="font-outfit text-3xl font-bold text-[#1A1A1A]">Create account</h1>
              <p className="text-[#6B6B6B] font-outfit mt-2 text-sm">Start building your recipe collection</p>
              <form onSubmit={handleSignup} className="mt-8 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-outfit font-medium text-[#6B6B6B] uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Gordon Ramsay"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-[#E0E0E0] bg-white font-outfit text-[#1A1A1A] text-sm outline-none focus:border-[#D85A30] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-outfit font-medium text-[#6B6B6B] uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-[#E0E0E0] bg-white font-outfit text-[#1A1A1A] text-sm outline-none focus:border-[#D85A30] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-outfit font-medium text-[#6B6B6B] uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-[#E0E0E0] bg-white font-outfit text-[#1A1A1A] text-sm outline-none focus:border-[#D85A30] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D85A30] text-white font-outfit font-medium py-3.5 rounded-xl hover:bg-[#C04E28] transition-all duration-200 mt-2 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center text-sm font-outfit text-[#6B6B6B] mt-6">
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError('') }} className="text-[#D85A30] font-medium hover:underline">
                  Log in
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}