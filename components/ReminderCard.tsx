import { format } from 'date-fns'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useState, useEffect } from 'react'

export function ReminderCard({ reminder }) {
  const { subject = 'No Subject', body = '', date, origin, id, confirmed } = reminder
  const [tapEnabled, setTapEnabled] = useState(false)
  const [wasConfirmed, setWasConfirmed] = useState(confirmed)

  useEffect(() => {
    const prefs = localStorage.getItem('userPreferences')
    if (prefs) {
      const parsed = JSON.parse(prefs)
      setTapEnabled(parsed.tapToConfirm)
    }
  }, [])

  const handleConfirm = async () => {
    if (!wasConfirmed) {
      const ref = doc(db, 'users', reminder.parentId, 'reminders', id)
      await updateDoc(ref, { confirmed: true })
      setWasConfirmed(true)
    }
  }

  return (
    <div className={`rounded-xl p-4 shadow bg-white space-y-2 ${wasConfirmed ? 'opacity-60' : ''}`}>
      <p className="text-sm text-gray-500">{format(new Date(date), 'EEE d MMM, h:mm a')}</p>
      <h3 className="text-md font-semibold text-[#004225]">{subject}</h3>
      <p className="text-gray-700 text-sm">{body}</p>
      {tapEnabled && !wasConfirmed && (
        <button onClick={handleConfirm} className="text-xs mt-2 text-blue-600 underline">
          Tap to Confirm
        </button>
      )}
    </div>
  )
}
