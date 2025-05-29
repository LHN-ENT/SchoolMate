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

type ChildProfile = {
  children: {
    name: string
    year: string
    teacher: string
  }[]
}

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [childId, setChildId] = useState<string | null>(null)
  const [parentId, setParentId] = useState<string | null>(null)
  const [childName, setChildName] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('childProfile')
    const storedParent = localStorage.getItem('parentProfile')

    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.children && parsed.children[0]) {
        setChildName(parsed.children[0].name || '')
        setChildId('reilly123') // TODO: Replace with real child ID logic
      }
    }

    if (storedParent) {
      const parsed = JSON.parse(storedParent)
      setParentId(parsed.parentId || null)
    }
  }, [])

  useEffect(() => {
    const fetchReminders = async () => {
      if (!parentId || !childId) return

      try {
        const q = query(
          collection(db, 'reminders'),
          where('parentId', '==', parentId),
          where('childId', '==', childId)
        )
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
  }, [parentId, childId])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Reminders for {childName || 'your child'}</h1>

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
