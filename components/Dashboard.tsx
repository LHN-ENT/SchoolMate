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
  const [reminders, setReminders] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')
    const storedReminders = localStorage.getItem('reminders')

    if (storedChild) setChild(JSON.parse(storedChild))
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs))
    if (storedReminders) setReminders(JSON.parse(storedReminders))
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#F7F7F7] p-6 space-y-6">
        {!hideSetup && (
          <div className="p-4 bg-[#FFD966] text-[#1C1C1C] rounded shadow">
            Complete your setup to see your dashboard.
          </div>
        )}

        <h1 className="text-xl font-bold text-[#004225]">
          Today for {child?.name || 'your child'}
        </h1>

        {prefs.tapToConfirm && (
          <section className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold text-[#1C1C1C]">Reminders</h2>
            <ul className="space-y-2">
              {reminders.length > 0 ? (
                reminders.map((r, i) => <ReminderCard key={i} text={r} />)
              ) : (
                <li className="text-sm text-gray-500">No reminders today.</li>
              )}
            </ul>
          </section>
        )}

        <section className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">Ask SchoolMate</h2>
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
            <div className="p-3 bg-[#ECECEC] rounded text-[#1C1C1C] whitespace-pre-wrap">
              {response}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
