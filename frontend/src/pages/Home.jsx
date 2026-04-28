import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const FEATURES = [
  {
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    title: 'Paste Any YouTube Link',
    desc: 'Drop a cooking video URL and get the full recipe extracted instantly — ingredients, steps, everything.',
    btn: 'YouTube to Recipe',
    path: '/recipe',
  },
  {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    title: 'Know What You Eat',
    desc: 'Every recipe comes with real calorie data — protein, carbs, and fats calculated per serving.',
    btn: 'Track Your Calories',
    path: '/',
  },
  {
    img: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=600&q=80',
    title: 'Not Sure What to Cook?',
    desc: 'Let AI suggest what to make today based on popular dishes and trending recipes around the world.',
    btn: 'What to Cook Today',
    path: '/',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (!input.trim()) return
    navigate(`/recipe/${encodeURIComponent(input.trim())}`)
  }

  return (
    <div className="font-outfit bg-[#FAFAF7] min-h-screen">

      <Navbar />

      <Navbar />

      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .ring   { animation: slowRotate 18s linear infinite; }
        .float1 { animation: floatUp 4s ease-in-out infinite; }
        .float2 { animation: floatUp 5s ease-in-out infinite 1s; }
      `}</style>

      {/* ───── HERO ───── */}
      <section id="hero-section" className="flex flex-col lg:flex-row items-center justify-between gap-16 px-6 lg:px-20 pt-28 pb-20 max-w-[1300px] mx-auto">

        {/* LEFT */}
        <div className="flex-1 max-w-[520px] w-full">
          <h1 className="text-[clamp(36px,5vw,58px)] font-bold text-[#1A1A1A] leading-[1.1] mb-5">
            Delicious Recipes<br />
            <span className="text-[#D85A30]">Waiting For You</span>
          </h1>

          <p className="text-base text-[#6B6B6B] leading-relaxed mb-9">
            Paste a YouTube cooking video or type any dish name. Get a full step-by-step recipe with real calorie data — instantly.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. Biryani, Pasta, YouTube link..."
              className="flex-1 px-5 py-4 rounded-[14px] border-[1.5px] border-[#E8E8E8] bg-white text-[15px] text-[#1A1A1A] outline-none font-outfit shadow-sm focus:border-[#D85A30] transition-colors"
            />
            <button
              type="submit"
              className="px-7 py-4 rounded-[14px] bg-[#D85A30] text-white font-semibold text-[15px] cursor-pointer font-outfit whitespace-nowrap shadow-[0_4px_16px_rgba(216,90,48,0.35)] hover:bg-[#C04E28] transition-colors"
            >
              Get Recipe
            </button>
          </form>
        </div>

        {/* RIGHT — rotating image */}
        <div className="relative hidden lg:block flex-shrink-0 w-[460px] h-[460px]">
          <div className="ring absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: 'rgba(216,90,48,0.25)' }} />
          <div className="absolute top-[30px] left-[30px] right-[30px] bottom-[30px] rounded-full overflow-hidden border-[8px] border-white shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80"
              alt="food"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="float1 absolute top-[10px] -left-[10px] w-[120px] h-[120px] rounded-full overflow-hidden border-[5px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
            <img
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80"
              alt="food"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="float2 absolute bottom-[10px] -right-[10px] w-[110px] h-[110px] rounded-full overflow-hidden border-[4px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80"
              alt="food"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="youtube-section" className="bg-[#FFF8F4] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[clamp(24px,4vw,36px)] font-bold text-[#1A1A1A] mb-3">
              Everything in one place
            </h2>
            <p className="text-[15px] text-[#6B6B6B]">
              Three powerful features to make cooking effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-[#F0EDE8] transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(0,0,0,0.11)] flex flex-col"
              >
                {/* Image — taller */}
                <div className="h-[240px] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover block transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-[19px] font-bold text-[#1A1A1A] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-[14px] text-[#6B6B6B] leading-relaxed flex-1">
                    {f.desc}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(f.path)}
                    className="mt-6 w-full py-3 rounded-[12px] bg-[#FFF0EB] text-[#D85A30] font-semibold text-[14px] border border-[#FFDDD0] hover:bg-[#D85A30] hover:text-white transition-all duration-200 cursor-pointer font-outfit"
                  >
                    {f.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ABOUT US ───── */}
      <section id="about-section" className="relative w-full h-[720px] overflow-hidden">

        {/* Background food image */}
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
          alt="about background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* About Us label — outside card, top center */}
        <div className="absolute top-10 left-0 right-0 flex justify-center">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#FFAD8A] uppercase">
            — About Us —
          </p>
        </div>

        {/* Glassmorphism card */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-[28px] px-14 py-14 w-[580px] h-[580px] text-center shadow-[0_8px_40px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center">

            <h2 className="text-[clamp(28px,4vw,42px)] font-bold text-white leading-tight mb-5">
              Cooking Made Simple,<br />
              <span className="text-[#FFAD8A]">For Everyone.</span>
            </h2>

            <p className="text-white/80 text-[15px] leading-[1.8] mb-5">
              Foodie was built for people who love food but don't always know where to start. Whether you discovered a dish on YouTube or just have a craving — we turn any idea into a full recipe with real nutritional data, powered by AI.
            </p>

            <p className="text-white/50 text-[13px]">
              No subscriptions. No complexity. Just great recipes at your fingertips.
            </p>

          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer id="contact-section" className="bg-[#1A1A1A] py-12 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="logo"
              className="w-7 h-7 object-contain"
              onError={e => e.target.style.display = 'none'}
            />
            <span className="text-white font-bold text-xl">
              Food<span className="text-[#D85A30]">ie</span>
            </span>
          </div>

          {/* Contact */}
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Contact Us</p>
            <a
              href="mailto:hello@foodie.com"
              className="text-white/70 text-sm hover:text-[#D85A30] transition-colors"
            >
              hello@foodie.com
            </a>
          </div>

          {/* Copyright */}
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Foodie. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  )
}