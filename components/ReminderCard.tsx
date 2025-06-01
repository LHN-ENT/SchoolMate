import { format } from 'date-fns'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useState, useEffect } from 'react'

export function ReminderCard({ reminder }) {
  const { subject, body, date, origin, id, confirmed } = reminder
  const [tapEnabled, setTapEnabled] = useState(false)
  const [wasConfirmed, setWasConfirmed] = useState(confirmed)

  useEffect(() => {
    const prefs = localStorage.getItem('userPreferences')
    if (prefs) {
      const parsed = JSON.parse(prefs)
      if (parsed.tapToConfirm) setTapEnabled(true)
    }
  }, [])

  const handleConfirm = async () => {
    if (!tapEnabled || wasConfirmed) return
    try {
      await updateDoc(doc(db, 'reminders', id), { confirmed: true })
      setWasConfirmed(true)
    } catch (err) {
      console.error('Failed to confirm reminder:', err)
    }
  }

  return (
    <div
      onClick={handleConfirm}
      className={`bg-white rounded-xl p-4 shadow space-y-2 border ${
        wasConfirmed ? 'border-green-500 opacity-70' : 'border-slate-200'
      } cursor-pointer transition duration-300`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#004225]">
          {subject || 'Untitled Reminder'}
        </h3>
        {origin === 'gmail' && (
          <span className="text-sm text-slate-500 flex items-center gap-1">
            ✉️ <span className="hidden sm:inline">via Gmail</span>
          </span>
        )}
      </div>
      <p className="text-sm text-slate-700">
        {body?.trim() ? body : <em className="text-slate-400">No details provided.</em>}
      </p>
      <p className="text-xs text-slate-500">
        {date ? format(new Date(date), 'eee d MMM, yyyy') : 'No date'}
      </p>
    </div>
  )
}
