import { useEffect, useState } from 'react'
import ReminderCard from '../components/ReminderCard'
import Sidebar from '../components/Sidebar'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firestore'

export default function Dashboard({ hideSetup }) {
  const [childProfile, setChildProfile] = useState(null)
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })
  const [reminders, setReminders] = useState([])
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')

    if (storedChild) setChildProfile(JSON.parse(storedChild))
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs))
  }, [])

  useEffect(() => {
    const fetchReminders = async () => {
      if (!childProfile?.children?.length) return

      try {
        const childIds = childProfile.children.map((c) => c.id || c.name)
        const q = query(collection(db, 'reminders'), where('childId', 'in', childIds))
        const snapshot = await getDocs(q)

        const allReminders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const filtered = allReminders.filter((reminder) => {
          // If digest is off, show everything
          if (!prefs.dailyDigest && !prefs.weeklyDigest) return true

          const today = new Date().toISOString().split('T')[0]
          const reminderDate = reminder.date || reminder.createdAt?.split('T')[0]
          return prefs.dailyDigest ? reminderDate === today : true // Simplified weekly logic
        })

        setReminders(filtered)
      } catch (err) {
        console.error('Failed to load reminders:', err)
      }
    }

    fetchReminders()
  }, [childProfile, prefs])

  const handleAsk = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/askSchoolMate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, child: childProfile })
      })
      const data = await res.json()
      setResponse(data.answer || 'No answer returned.')
    } catch (err) {
      console.error(err)
      setResponse('There was an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          Welcome{childProfile?.children?.length === 1 ? `, ${childProfile.children[0].name}` : ''}
        </h1>

        {childProfile?.children?.map((child, i) => (
          <section key={i} className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold text-[#1C1C1C]">
              {child.name} ({child.year}) — {child.teacher}
            </h2>

            <p className="text-sm text-gray-600">
              School: {child.startTime || '??'} to {child.endTime || '??'}{' '}
              {child.aftercare && '(Aftercare enabled)'}
            </p>

            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>PE:</strong> {child.peDays?.join(', ') || 'None'}</p>
              <p><strong>Library:</strong> {child.libraryDays?.join(', ') || 'None'}</p>
              <p><strong>House Sport:</strong> {child.houseSportDays?.join(', ') || 'None'}</p>
              <p><strong>Activities:</strong></p>
              <ul className="pl-4 list-disc">
                {Object.entries(child.activities || {}).map(([day, activity]) =>
                  activity ? <li key={day}>{day}: {activity}</li> : null
                )}
              </ul>
            </div>
          </section>
        ))}

        {prefs.tapToConfirm && (
          <section className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold text-[#1C1C1C]">Reminders</h2>
            <ul className="space-y-2">
              {reminders.length > 0 ? (
                reminders.map((r, i) => (
  <li key={i}>
    <ReminderCard text={r?.title || r?.subject || 'Untitled reminder'} />
  </li>
))

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
