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

  const handleTimezoneChange = async (e) => {
    const newTZ = e.target.value
    setTimezone(newTZ)
    if (!userEmail) return
    await setDoc(doc(db, 'parentSettings', userEmail), { timezone: newTZ }, { merge: true })
  }

  const handleDeleteAccount = async () => {
    if (!userEmail) return
    await deleteDoc(doc(db, 'parentSettings', userEmail))
    await deleteDoc(doc(db, 'children', userEmail))
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] p-6 font-sans">
      <h1 className="text-2xl font-bold text-[#004225] mb-6">⚙️ Settings</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium text-sm">Timezone</label>
          <select
            value={timezone}
            onChange={handleTimezoneChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={() => setConfirmingDelete(true)}
            className="text-sm text-red-600 underline"
          >
            Delete Account
          </button>
        </div>

        {confirmingDelete && (
          <div className="border border-red-300 bg-red-50 p-3 rounded">
            <p className="text-sm text-red-700 mb-2">Are you sure? This can’t be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded mr-2"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-sm text-slate-600 underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div> // ✅ ✅ ✅ This closing div was previously missing
  )
}
