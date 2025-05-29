import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase-admin/firestore'
import { dbAdmin as db } from '../../lib/firebaseAdmin'
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

  // 🔁 TEMP: Replace with real parentId from session later
  const parentId = 'demoParent123'

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const snapshot = await db.collection('reminders')
          .where('parentId', '==', parentId)
          .get()

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
  }, [])

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
