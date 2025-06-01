import { useEffect, useState } from 'react'
import ReminderCard from '../../components/ReminderCard'
import Sidebar from '../../components/Sidebar'

export default function Dashboard() {
  const [child, setChild] = useState(null)
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')

    if (!storedChild) {
      window.location.href = '/onboarding/step1'
      return
    }

    setChild(JSON.parse(storedChild))

    if (storedPrefs) {
      setPrefs(JSON.parse(storedPrefs))
    }

    const fetchReminders = async () => {
      try {
        const res = await fetch('/api/getReminders')
        const data = await res.json()
        if (Array.isArray(data)) {
          setReminders(data)
        } else {
          setReminders([])
        }
      } catch (err) {
        console.error('Failed to load reminders:', err)
        setReminders([])
      } finally {
        setLoading(false)
      }
    }

    fetchReminders()
  }, [])

  return (
    <div className="min-h-screen bg-[#ECECEC] flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-4">
        {child && (
          <h1 className="text-2xl font-semibold text-[#004225]">
            Welcome, {child.name}
          </h1>
        )}
        {loading ? (
          <p className="text-gray-500">Loading reminders...</p>
        ) : reminders.length > 0 ? (
          reminders.map((reminder, i) => (
            <ReminderCard key={i} reminder={reminder} prefs={prefs} />
          ))
        ) : (
          <p className="text-gray-500">No reminders found.</p>
        )}
      </main>
    </div>
  )
}
