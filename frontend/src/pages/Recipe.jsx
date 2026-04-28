import { useState } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MEALDB = 'https://www.themealdb.com/api/json/v1/1'

function formatMeal(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        amount: measure ? measure.trim() : '',
        name: ingredient.trim()
      })
    }
  }
  const steps = meal.strInstructions
    ? meal.strInstructions.split(/\r\n|\n|\r/).map(s => s.trim()).filter(s => s.length > 10)
    : []
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || 'General',
    area: meal.strArea || 'International',
    time: '30-45 minutes',
    servings: '4 servings',
    difficulty: 'Medium',
    ingredients,
    steps,
    youtube: meal.strYoutube,
    source: 'mealdb'
  }
}

export default function Recipe() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [usingAI, setUsingAI] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setSelected(null)
    setSaved(false)
    setUsingAI(false)

    try {
      // Step 1 — Try MealDB first
      const res = await fetch(`${MEALDB}/search.php?s=${encodeURIComponent(input.trim())}`)
      const data = await res.json()

      if (data.meals && data.meals.length > 0) {
        // MealDB found results
        setResults(data.meals.slice(0, 6).map(formatMeal))
      } else {
        // Step 2 — MealDB found nothing, use AI fallback
        setUsingAI(true)
        await generateWithAI(input.trim())
      }
    } catch (err) {
      setError('Could not connect. Check your internet connection.')
    }
    setLoading(false)
  }

  async function generateWithAI(query) {
    try {
      const res = await fetch('http://localhost:5000/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // AI returns a single recipe — show it directly
      setSelected({
        ...data,
        image: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)},food`,
        category: 'AI Generated',
        area: 'Custom',
        youtube: null,
        source: 'ai'
      })
    } catch (err) {
      setError('Recipe not found in our database and AI is currently unavailable. Try a different dish name.')
    }
    setUsingAI(false)
  }

  async function loadRecipe(meal) {
    setLoading(true)
    setSelected(null)
    setSaved(false)
    try {
      const res = await fetch(`${MEALDB}/lookup.php?i=${meal.id}`)
      const data = await res.json()
      setSelected(formatMeal(data.meals[0]))
    } catch (err) {
      setError('Could not load recipe.')
    }
    setLoading(false)
  }

  async function saveRecipe() {
    if (!selected || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('saved_recipes').insert({
        user_id: user.id,
        title: selected.title,
        image: selected.image,
        category: selected.category,
        area: selected.area,
        time: selected.time,
        servings: selected.servings,
        difficulty: selected.difficulty,
        ingredients: selected.ingredients,
        steps: selected.steps,
      })
      if (error) throw error
      setSaved(true)
    } catch (err) {
      console.error('Save error:', err.message)
    }
    setSaving(false)
  }

  return (
    <div className="font-outfit min-h-screen relative">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
        alt="bg"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed inset-0 bg-black/60 -z-10" />
      <Navbar />

      <div className="flex flex-col items-center px-6 pt-32 pb-20">
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#FFAD8A] uppercase mb-4">
          — Find a Recipe —
        </p>
        <h1 className="text-[clamp(28px,4vw,42px)] font-bold text-white text-center leading-tight mb-10">
          Search Any Dish,<br />
          <span className="text-[#FFAD8A]">Get the Full Recipe.</span>
        </h1>

        {/* Glass Card */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-[28px] p-8 w-full max-w-[860px] shadow-[0_8px_40px_rgba(0,0,0,0.25)]">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. Biryani, Nihari, Karahi, Pasta..."
              className="flex-1 px-5 py-4 rounded-[14px] border border-white/20 bg-white/10 text-white placeholder-white/40 text-[15px] outline-none font-outfit focus:border-[#D85A30] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-4 rounded-[14px] bg-[#D85A30] text-white font-semibold text-[15px] cursor-pointer whitespace-nowrap shadow-[0_4px_16px_rgba(216,90,48,0.4)] hover:bg-[#C04E28] transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-2 border-white/20 border-t-[#D85A30] rounded-full animate-spin mb-4" />
              <p className="text-white/60 text-sm">
                {usingAI ? 'Not found in database — generating with AI...' : 'Searching recipes...'}
              </p>
            </div>
          )}

          {/* Search Results Grid */}
          {!loading && results.length > 0 && !selected && (
            <div>
              <p className="text-white/50 text-xs mb-4 text-center">
                {results.length} recipes found — click to view full recipe
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => loadRecipe(meal)}
                    className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden hover:border-[#D85A30] hover:-translate-y-1 transition-all text-left"
                  >
                    <img src={meal.image} alt={meal.title} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm leading-tight">{meal.title}</p>
                      <p className="text-white/50 text-xs mt-1">{meal.category} · {meal.area}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full Recipe */}
          {!loading && selected && (
            <div>
              {/* Back button */}
              {results.length > 0 && (
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/60 text-sm mb-5 hover:text-white transition-colors flex items-center gap-1"
                >
                  ← Back to results
                </button>
              )}

              {/* Header */}
              <div className="flex gap-5 mb-6 flex-col sm:flex-row">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full sm:w-36 h-36 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">{selected.title}</h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[selected.category, selected.area, selected.time, selected.servings, selected.difficulty].map((m, i) => (
                          <span key={i} className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-white/70 text-xs">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Save button */}
                    <button
                      onClick={saveRecipe}
                      disabled={saving || saved}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                        saved
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-[#D85A30] text-white hover:bg-[#C04E28]'
                      }`}
                    >
                      {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Recipe'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Ingredients */}
                <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D85A30] inline-block" />
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selected.ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-3 text-sm border-b border-white/10 pb-2 last:border-0">
                        <span className="text-[#FFAD8A] font-medium min-w-[80px]">{ing.amount}</span>
                        <span className="text-white/80">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D85A30] inline-block" />
                    Steps
                  </h3>
                  <ol className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {selected.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D85A30]/80 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* YouTube link */}
              {selected.youtube && (
                <a
                  href={selected.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-600/30 transition-all"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}