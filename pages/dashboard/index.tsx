import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import ReminderCard from '../../components/ReminderCard'

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
    <Layout>
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
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">🎉 You're all caught up!</p>
          <p className="text-sm mt-2">No pending school reminders.</p>
        </div>
      )}
    </Layout>
  )
}
