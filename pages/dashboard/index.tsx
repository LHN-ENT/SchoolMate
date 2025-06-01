import { useEffect, useState } from 'react'
import { ReminderCard } from '@/components/ReminderCard'
import { PreferencesToggle } from '@/components/PreferencesToggle'
import { AskSchoolMate } from '@/components/AskSchoolMate'
import { useSession } from 'next-auth/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function Dashboard() {
  const { data: session } = useSession()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReminders = async () => {
      if (!session?.user?.email) return
      const q = query(collection(db, 'reminders'), where('parentId', '==', session.user.email))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setReminders(data)
      setLoading(false)
    }
    fetchReminders()
  }, [session])

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#004225]">📚 SchoolMate</h1>
        <PreferencesToggle />
      </header>

      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <PushNotificationPrompt />

        <section>
          <h2 className="text-xl font-bold text-[#004225]">Today’s Reminders</h2>
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : reminders.length === 0 ? (
            <p className="text-sm text-slate-600">No reminders yet. Check back soon!</p>
          ) : (
            <div className="grid gap-4">
              {reminders.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <AskSchoolMate />
        </section>
      </main>
    </div>
  )
}
