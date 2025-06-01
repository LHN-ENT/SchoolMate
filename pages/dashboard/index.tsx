import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const childProfile = localStorage.getItem('childProfile')
    if (!childProfile) {
      router.push('/onboarding/step1')
      return
    }

    const fetchReminders = async () => {
      if (session?.user?.email) {
        const ref = collection(db, 'users', session.user.email, 'reminders')
        const snapshot = await getDocs(ref)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setReminders(data)
      }
    }

    fetchReminders()
  }, [session, router])

  return (
    <div className="p-4 space-y-4">
      <PreferencesToggle />
      <PushNotificationPrompt />
      <AskSchoolMate />
      {reminders.map((r) => (
        <ReminderCard key={r.id} {...r} />
      ))}
    </div>
  )
}
