import { useState, useEffect } from 'react'

export function PreferencesToggle() {
  const [prefs, setPrefs] = useState({
    tapToConfirm: true,
    dailyDigest: true,
    weeklyDigest: false
  })

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) setPrefs(JSON.parse(stored))
  }, [])

  const handleChange = (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    localStorage.setItem('userPreferences', JSON.stringify(updated))
  }

  return (
    <div className="text-sm text-slate-600 space-y-2">
      {Object.keys(prefs).map((key) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs[key]}
            onChange={() => handleChange(key)}
          />
          {key.replace(/([A-Z])/g, ' $1')}
        </label>
      ))}
    </div>
  )
}
