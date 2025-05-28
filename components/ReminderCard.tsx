import { useEffect, useState } from 'react'

export default function ReminderCard({ text }: { text: string }) {
  const [confirmed, setConfirmed] = useState(false)
  const [tapToConfirm, setTapToConfirm] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) {
      const prefs = JSON.parse(stored)
      setTapToConfirm(prefs.tapToConfirm !== false) // default true
    }
  }, [])

  if (confirmed) return null

  return (
    <li className="p-3 bg-[#DFF5E3] rounded flex justify-between items-center">
      {text}
      {tapToConfirm && (
        <button
          onClick={() => setConfirmed(true)}
          className="text-sm bg-[#004225] text-white px-2 py-1 rounded"
        >
          Confirm
        </button>
      )}
    </li>
  )
}
