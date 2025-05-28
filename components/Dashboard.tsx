import { useEffect, useState } from 'react'
import ReminderCard from '../components/ReminderCard'
import Sidebar from '../components/Sidebar'

export default function Dashboard({ hideSetup }) {
  const [child, setChild] = useState({ name: 'your child' })
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })

  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')

    if (storedChild) setChild(JSON.parse(storedChild))
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs))
  }, [])

  const handleAsk = async () => {
    if (!input) return
    setLoading(true)
    setResponse('')
    try {
      const res = await fetch('/api/askSchoolMate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      setResponse(data.reply || 'No response received.')
    } catch (err) {
      setResponse('Error contacting SchoolMate AI.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#F7F7F7] p-4 space-y-4">
        {!hideSetup && (
          <div className="mb-4 p-4 bg-[#FFD966] text-[#1C1C1C] rounded shadow">
            Complete your setup to see your dashboard.
          </div>
        )}

        <h1 className="text-xl font-bold text-[#004225]">
          Today for {child.name || 'your child'}
        </h1>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold text-[#1C1C1C]">Reminders</h2>
          <ul className="mt-2 space-y-2">
            {prefs.tapToConfirm && (
              <>
                <ReminderCard text="Library Day – pack books" />
                <ReminderCard text="Swimming – bring towel" />
              </>
            )}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <h2 className="text-md font-semibold text-[#1C1C1C]">Ask SchoolMate</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do I need to pack for tomorrow?"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="w-full py-2 bg-[#004225] text-white rounded disabled:opacity-50"
          >
            {loading ? 'Asking...' : 'Ask'}
          </button>
          {response && (
            <div className="p-3 mt-2 bg-[#ECECEC] rounded text-[#1C1C1C] whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
