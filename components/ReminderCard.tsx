import { useState } from 'react'

export default function ReminderCard({ reminder, prefs }) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = async () => {
    setConfirmed(true)

    if (prefs.tapToConfirm) {
      try {
        await fetch('/api/confirmReminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: reminder.id })
        })
      } catch (err) {
        console.error('Confirmation failed:', err)
      }
    }
  }

  if (confirmed) return null

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2 border border-gray-200">
      <h2 className="text-lg font-medium text-[#004225]">{reminder.subject}</h2>
      <p className="text-sm text-gray-700">{reminder.body}</p>
      <p className="text-xs text-gray-500">{reminder.date}</p>
      {prefs.tapToConfirm && (
        <button
          onClick={handleConfirm}
          className="mt-2 text-sm px-3 py-1 bg-[#004225] text-white rounded shadow"
        >
          Confirm
        </button>
      )}
    </div>
  )
}
