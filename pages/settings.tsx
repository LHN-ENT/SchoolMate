import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useRouter } from 'next/router'

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
    await deleteDoc(doc(db, 'parentSettings', userEmail))
    await signOut()
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
          <p>Are you sure? This will remove your data permanently.</p>
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
