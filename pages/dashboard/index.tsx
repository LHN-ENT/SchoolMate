import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebaseClient'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session?.user?.email) return

      try {
        // Check if childProfile exists
        const userRef = doc(db, 'users', session.user.email)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        if (!userData?.childProfile) {
          router.push('/onboarding/step1')
          return
        }

        // Fetch reminders
        const ref = collection(db, 'users', session.user.email, 'reminders')
        const snapshot = await getDocs(ref)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, parentId: session.user.email, ...doc.data() }))
        setReminders(data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, status, router])

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div className="p-4 space-y-4">
      <PreferencesToggle />
      <PushNotificationPrompt />
      <AskSchoolMate />
      <div>
        <h2 className="text-xl font-semibold text-[#004225]">Reminders</h2>
        <div className="space-y-4 mt-2">
          {reminders.length > 0 ? (
            reminders.map((r) => <ReminderCard key={r.id} reminder={r} />)
          ) : (
            <p className="text-gray-600">No reminders found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
