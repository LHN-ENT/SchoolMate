import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [childProfile, setChildProfile] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
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
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        parentId: session.user.email,
      }))

      setReminders(results)
      setLoading(false)
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [session, status, router])

  if (loading || status === 'loading') {
    return <p className="text-center mt-10">Loading dashboard...</p>
  }

  return (
    <div className="p-4 space-y-4">
      <PreferencesToggle />
      <PushNotificationPrompt />
      <AskSchoolMate />
      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500">No reminders yet.</p>
      ) : (
        reminders.map((r) => <ReminderCard key={r.id} reminder={r} />)
      )}
    </div>
  )
}
