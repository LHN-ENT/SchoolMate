// 💬 FILE: components/AskSchoolMate.tsx
import { useState } from 'react'
import { db } from '../lib/firebaseClient'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'

export default function AskSchoolMate({ childId }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/askSchoolMate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, childId }),
      })

      const data = await res.json()
      if (data.answer) {
        setAnswer(data.answer)

        // Save to Firestore
        await addDoc(collection(db, 'aiResponses'), {
          childId,
          question,
          answer: data.answer,
          timestamp: new Date().toISOString(),
        })
      } else {
        setAnswer('Sorry, I couldn’t answer that.')
      }
    } catch (err) {
      console.error('❌ AI error', err)
      setAnswer('Error reaching SchoolMate AI.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow p-4 rounded-xl space-y-3">
      <h2 className="text-lg font-semibold text-[#004225]">Ask SchoolMate AI</h2>
      <input
        type="text"
        className="w-full border rounded-md px-3 py-2"
        placeholder="e.g. What day is PE?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-[#004225] text-white px-4 py-2 rounded-md w-full"
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div className="bg-gray-100 text-sm rounded-md p-3">{answer}</div>
      )}
    </div>
  )
}
