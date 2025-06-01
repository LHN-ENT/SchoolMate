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
      const response = await fetch('/api/askSchoolMate', {
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
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="What's coming up next week?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border px-3 py-2 rounded border-slate-300"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-[#004225] text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      {answer && (
        <div className="bg-slate-100 p-3 rounded text-sm text-slate-700 whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  )
}
