import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ReminderCard from './ReminderCard'
import Sidebar from './Sidebar'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

interface Reminder {
  id: string
  subject: string
  body: string
  date: string
  createdAt?: string
  childId: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [child, setChild] = useState<any>(null)
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')
    if (storedChild) setChild(JSON.parse(storedChild))
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs))
  }, [])

  useEffect(() => {
    const fetchReminders = async () => {
      if (!session?.user?.email || !child?.id) return
      const parentId = session.user.email
      const childId = child.id

      const path = `reminders/${parentId}/${childId}`
      const snapshot = await getDocs(collection(db, path))

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reminder[]

      setReminders(data)
    }

    fetchReminders()
  }, [session, child])

  const handleConfirm = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const handleAskSchoolMate = async () => {
    setLoading(true)
    const res = await fetch('/api/askSchoolMate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    })
    const data = await res.json()
    setResponse(data.reply)
    setLoading(false)
  }

  return (
    <>
      <Sidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Reminders for {child?.name ?? 'your child'}</h1>
        {reminders.map(r => (
          <ReminderCard key={r.id} reminder={r} onConfirm={handleConfirm} />
        ))}

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Ask SchoolMate</h2>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="What does my child need to bring on Friday?"
          />
          <button onClick={handleAskSchoolMate} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? 'Thinking...' : 'Ask'}
          </button>
          {response && <p className="mt-2 text-gray-700">{response}</p>}
        </div>
      </div>
    </>
  )
}
