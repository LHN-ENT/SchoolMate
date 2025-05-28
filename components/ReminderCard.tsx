import { useEffect, useState } from 'react'

interface Reminder {
  title?: string
  details?: string
  date?: string
  text?: string // for legacy
}

export default function ReminderCard({ text }: { text: string | Reminder }) {
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

  if (confirmed) return null

  const reminder = typeof text === 'string' ? { title: text } : text
  const { title, details, date } = reminder

  return (
    <li className="p-3 bg-[#DFF5E3] rounded space-y-1">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-[#1C1C1C]">{title}</p>
          {date && <p className="text-sm text-gray-600">📅 {date}</p>}
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

      {details && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-[#004225] underline"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      )}

      {showDetails && details && (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{details}</p>
      )}
    </li>
  )
}
