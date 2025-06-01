// pages/dashboard/index.tsx
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [reminders, setReminders] = useState([])
  const [childId, setChildId] = useState('')
  const [children, setChildren] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('childProfile')
    if (stored) {
      const parsed = JSON.parse(stored)
      setChildren([parsed])
      setChildId(parsed.id || parsed.name?.toLowerCase() || '')
    }
  }, [])

  useEffect(() => {
    if (!childId) return

    const fetchReminders = async () => {
      const q = query(
        collection(db, 'reminders'),
        where('childId', '==', childId)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setReminders(data)
    }

    fetchReminders()
  }, [childId])

  if (!session) {
    return <p className="p-4">Please log in to view your dashboard.</p>
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#004225]">Dashboard</h1>

      {children.length > 1 && (
        <div className="flex space-x-2">
          {children.map((c) => (
            <button
              key={c.id || c.name}
              onClick={() => setChildId(c.id || c.name?.toLowerCase())}
              className={`px-4 py-2 rounded ${
                (c.id || c.name?.toLowerCase()) === childId
                  ? 'bg-[#004225] text-white'
                  : 'bg-white text-[#004225]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {reminders.length === 0 ? (
        <p>No reminders yet for this child.</p>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}

      <PreferencesToggle />
      <AskSchoolMate />
      <PushNotificationPrompt />
    </div>
  )
}
