import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'
import Sidebar from '../../components/Sidebar'

type Reminder = {
  id: string
  subject: string
  body: string
  date: string
  childId: string
  source: string
}

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [parentId, setParentId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('parentProfile')
    if (stored) {
      const parsed = JSON.parse(stored)
      setParentId(parsed.parentId || null)
    }
  }, [])

  useEffect(() => {
    const fetchReminders = async () => {
      if (!parentId) return

      try {
        const q = query(collection(db, 'reminders'), where('parentId', '==', parentId))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reminder[]

        setReminders(data)
      } catch (error) {
        console.error('Error fetching reminders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReminders()
  }, [parentId])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Reminders</h1>

        {loading ? (
          <p>Loading...</p>
        ) : reminders.length === 0 ? (
          <p>No reminders found.</p>
        ) : (
          <ul className="space-y-4">
            {reminders.map(reminder => (
              <li key={reminder.id} className="border p-4 rounded shadow">
                <div className="font-semibold">{reminder.subject}</div>
                <div className="text-sm text-gray-600">{reminder.body}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {reminder.date} · {reminder.childId} · {reminder.source}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
