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
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow space-y-2">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-[#004225]">{reminder.subject}</h2>
        <span className="text-xs text-gray-500">{reminder.date}</span>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-line">{reminder.body}</p>
      {prefs.tapToConfirm && (
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className="text-sm px-4 py-1.5 bg-[#004225] hover:bg-[#00331a] text-white rounded shadow transition-all"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  )
}
