import { useState } from 'react'

export function AskSchoolMate() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ question }),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      setAnswer(data.answer || 'Sorry, I didn’t catch that.')
    } catch (err) {
      console.error('Ask error:', err)
      setAnswer('Something went wrong while asking SchoolMate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="text-lg font-semibold text-[#004225]">🤖 Ask SchoolMate</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything school-related..."
          className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAsk}
          className="bg-[#004225] text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>

      {answer && (
        <p className="text-sm text-slate-700 border-t border-slate-200 pt-2">{answer}</p>
      )}
    </div>
  )
}
