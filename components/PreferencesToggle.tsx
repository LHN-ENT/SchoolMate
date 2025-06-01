import { useState, useEffect } from 'react'

export function PreferencesToggle() {
  const [prefs, setPrefs] = useState({
    tapToConfirm: true
  })

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) setPrefs(JSON.parse(stored))
  }, [])

  const handleToggle = () => {
    const updated = { ...prefs, tapToConfirm: !prefs.tapToConfirm }
    setPrefs(updated)
    localStorage.setItem('userPreferences', JSON.stringify(updated))
  }

  return (
    <div className="flex items-center text-sm text-slate-600 gap-2">
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={prefs.tapToConfirm}
          onChange={handleToggle}
        />
        Tap to Confirm
      </label>
    </div>
  )
}
