import { useEffect, useState } from 'react'

interface Reminder {
  subject: string
  body: string
  date: string
  createdAt?: string
  childId: string
}

type ReminderCardProps = {
  reminder: Reminder
  onConfirm: (id: string) => void
}

export default function ReminderCard({ reminder, onConfirm }: ReminderCardProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [tapToConfirm, setTapToConfirm] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) {
      const prefs = JSON.parse(stored)
      setTapToConfirm(prefs.tapToConfirm !== false)
    }
  }, [])

  if (confirmed) {
    onConfirm(reminder.id)
    return null
  }

  return (
    <li className="p-3 bg-[#DFF5E3] rounded space-y-1">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-[#1C1C1C]">{reminder.subject}</p>
          {reminder.date && <p className="text-sm text-gray-600">📅 {reminder.date}</p>}
        </div>
        {tapToConfirm && (
          <button
            onClick={() => setConfirmed(true)}
            className="text-sm bg-[#004225] text-white px-2 py-1 rounded"
          >
            Confirm
          </button>
        )}
      </div>

      {reminder.body && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-[#004225] underline"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      )}

      {showDetails && (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{reminder.body}</p>
      )}
    </li>
  )
}
