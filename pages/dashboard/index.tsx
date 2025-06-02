import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

type Reminder = {
  id: string
  subject: string
  body?: string
  date: string
  parentId: string
  // Add any other fields your reminders use
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [childProfile, setChildProfile] = useState<any>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        if (!session?.user?.email) return

        const userRef = doc(db, 'users', session.user.email)
        const snap = await getDoc(userRef)

        const data = snap.exists() ? snap.data() : null

        if (!data?.childProfile) {
          router.replace('/onboarding/step1')
          return
        }

        setChildProfile(data.childProfile)

        const remindersRef = collection(db, 'users', session.user.email, 'reminders')
        const snapshot = await getDocs(remindersRef)
        const results: Reminder[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Reminder, 'id'>),
          parentId: session.user.email,
        }))

        setReminders(results)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        setError('Failed to load dashboard data.')
        router.replace('/onboarding/step1')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [session, status, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <div className="text-4xl mb-2 animate-pulse">📚</div>
        <p className="text-lg font-medium">Loading your dashboard...</p>
        <p className="text-sm text-gray-400">This won’t take long.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <PreferencesToggle />
      <PushNotificationPrompt />
      <AskSchoolMate />
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      {reminders.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-base">🎉 You're all caught up!</p>
          <p className="text-sm">No reminders pending for now. We'll keep you posted.</p>
        </div>
      ) : (
        reminders.map((r) => <ReminderCard key={r.id} reminder={r} />)
      )}
    </div>
  )
}
