import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState([])
  const [childId, setChildId] = useState('')
  const [children, setChildren] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('childProfile')
      if (stored) {
        const parsed = JSON.parse(stored)
        setChildren([parsed])
        setChildId(parsed.id || parsed.name?.toLowerCase() || '')
      } else {
        router.push('/onboarding')
      }
    }
  }, [router])

  useEffect(() => {
    if (!childId) return
    const fetchReminders = async () => {
      const q = query(collection(db, 'reminders'), where('childId', '==', childId))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReminders(data)
    }

    fetchReminders()
  }, [childId])

  return (
    <div className="min-h-screen bg-[#ECECEC] px-4 py-8 space-y-6">
      <PreferencesToggle />
      <PushNotificationPrompt />
      <AskSchoolMate />

      <h2 className="text-xl font-semibold text-[#004225]">Reminders</h2>
      <div className="space-y-4">
        {reminders.length > 0 ? (
          reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        ) : (
          <p className="text-gray-600">No reminders found.</p>
        )}
      </div>
    </div>
  )
}
