import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

export function PreferencesToggle() {
  const { data: session } = useSession()
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: false,
    assignToBoth: false,
  })

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!session?.user?.email) return
      try {
        const ref = doc(db, 'users', session.user.id)
        const snap = await getDoc(ref)
        const data = snap.data()
        if (data?.preferences) {
          setPrefs(data.preferences)
        }
      } catch (err) {
        console.warn('Failed to load preferences:', err)
      }
    }

    fetchPrefs()
  }, [session])

  const togglePref = async (key: string) => {
    if (!session?.user?.email) return

    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)

    try {
      const ref = doc(db, 'users', session.user.id)
      await updateDoc(ref, { preferences: updated })
    } catch (err) {
      console.error('Failed to update preference:', err)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h3 className="text-md font-semibold text-[#004225]">Preferences</h3>
      {Object.keys(prefs).map((key) => (
        <label key={key} className="block text-sm">
          <input
            type="checkbox"
            checked={prefs[key]}
            onChange={() => togglePref(key)}
            className="mr-2"
          />
          {key}
        </label>
      ))}
    </div>
  )
}
