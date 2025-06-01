// 💬 FILE: components/AskSchoolMateHistory.tsx

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

export default function AskSchoolMateHistory({ childId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, 'aiResponses'), where('childId', '==', childId))
        const snapshot = await getDocs(q)
        const sorted = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        setHistory(sorted)
      } catch (err) {
        console.error('❌ Failed to load AI history:', err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [childId])

  return (
    <div className="bg-white mt-6 p-4 rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold text-[#004225]">Previous Questions</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-sm">No questions asked yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map(({ id, question, answer, timestamp }) => (
            <li key={id} className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm text-gray-600 mb-1 font-medium">Q: {question}</p>
              <p className="text-sm text-gray-800">A: {answer}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
