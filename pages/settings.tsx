import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

const timezones = [
  { label: 'UTC+8 (SG)', value: 'UTC+8' },
  { label: 'UTC+10 (SYD)', value: 'UTC+10' },
  { label: 'UTC+0 (UK)', value: 'UTC+0' }
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [timezone, setTimezone] = useState('UTC+8')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const userEmail = session?.user?.email

  useEffect(() => {
    if (!userEmail) return
    const loadSettings = async () => {
      const docRef = doc(db, 'parentSettings', userEmail)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.timezone) setTimezone(data.timezone)
      }
    }
    loadSettings()
  }, [userEmail])

  const handleSave = async () => {
    if (!userEmail) return
    await setDoc(doc(db, 'parentSettings', userEmail), { timezone }, { merge: true })
  }

  const handleDelete = async () => {
    if (!userEmail) return

    try {
      // Delete settings
      await deleteDoc(doc(db, 'parentSettings', userEmail))

      // Delete user profile
      await deleteDoc(doc(db, 'users', userEmail))

      // Delete all reminders
      const remindersRef = collection(db, 'users', userEmail, 'reminders')
      const reminderDocs = await getDocs(remindersRef)

      if (!reminderDocs.empty) {
        const batch = writeBatch(db)
        reminderDocs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
      }

      await signOut()
    } catch (err) {
      console.error('Account deletion failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] p-6 space-y-4">
      <h1 className="text-2xl font-bold text-[#004225]">Settings</h1>

      <label className="block text-slate-700">
        Timezone:
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="block mt-1 border border-slate-300 rounded px-3 py-2"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handleSave}
        className="bg-[#004225] text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>

      <hr />

      <button
        onClick={() => setConfirmingDelete(true)}
        className="text-red-600 underline"
      >
        Delete Account
      </button>

      {confirmingDelete && (
        <div className="space-y-2 text-sm text-slate-700">
          <p>Are you sure? This will remove all your data permanently.</p>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes, delete
          </button>
        </div>
      )}

      <button
        onClick={() => {
          signOut()
          router.push('/auth/signin')
        }}
        className="text-slate-600 underline mt-4"
      >
        Log out
      </button>
    </div>
  )
}
