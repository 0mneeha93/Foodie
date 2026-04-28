const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// ─── Call Gemini ─────────────────────────────────────────────
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  })
  return response.data.candidates[0].content.parts[0].text
}

// ─── Test route ───────────────────────────────────────────────
app.get('/api/test', async (req, res) => {
  try {
    const text = await callGemini('Say hello in one word')
    res.json({ success: true, response: text })
  } catch (err) {
    res.status(500).json({
      success: false,
      status: err.response?.status,
      error: err.response?.data?.error?.message || err.message
    })
  }
})

// ─── Recipe route (AI fallback for desi dishes) ───────────────
app.post('/api/recipe', async (req, res) => {
  const { input } = req.body
  if (!input || !input.trim()) {
    return res.status(400).json({ error: 'Please provide a dish name.' })
  }

  const prompt = `You are a professional Pakistani/South Asian recipe expert and nutritionist.
Generate a complete authentic recipe for: "${input}"

Return ONLY a valid JSON object — no markdown, no backticks, no extra text:
{
  "title": "dish name",
  "time": "cooking time e.g. 45 minutes",
  "servings": "e.g. 4 servings",
  "difficulty": "Easy or Medium or Hard",
  "ingredients": [
    {"amount": "200g", "name": "ingredient name"}
  ],
  "steps": [
    "Detailed step one",
    "Detailed step two"
  ],
  "calories": {
    "total": 450,
    "protein": "24g",
    "carbs": "60g",
    "fats": "18g"
  }
}`

  try {
    const text = await callGemini(prompt)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Could not parse recipe')
    const parsed = JSON.parse(jsonMatch[0])
    res.json(parsed)
  } catch (err) {
    console.error('Recipe error:', err.response?.status, err.response?.data?.error?.message || err.message)

    if (err.response?.status === 429) {
      return res.status(429).json({
        error: 'AI is busy right now. Please wait a moment and try again.'
      })
    }

    res.status(500).json({ error: 'Could not generate recipe. Please try again.' })
  }
})

// ─── Calories route ───────────────────────────────────────────
app.get('/api/calories', async (req, res) => {
  const { query } = req.query
  if (!query) return res.status(400).json({ error: 'Query required' })

  try {
    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
      { headers: { 'X-Api-Key': process.env.CALORIE_NINJA_KEY } }
    )
    res.json(response.data)
  } catch (err) {
    console.error('Calorie error:', err.message)
    res.status(500).json({ error: 'Could not fetch calorie data' })
  }
})

// ─── Start server ─────────────────────────────────────────────
app.listen(5000, () => console.log('Server running on port 5000'))