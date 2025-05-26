import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Step3() {
  const router = useRouter()
  const [prefs, setPrefs] = useState({
    dailyDigest: true,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true,
  })

  const handleChange = (key: string) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('userPreferences', JSON.stringify(prefs))
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-[#004225]">Step 3: Preferences</h2>

        <label className="flex items-center justify-between">
          <span>Daily Digest</span>
          <input type="checkbox" checked={prefs.dailyDigest} onChange={() => handleChange('dailyDigest')} className="accent-[#004225]" />
        </label>

        <label className="flex items-center justify-between">
          <span>Weekly Digest</span>
          <input type="checkbox" checked={prefs.weeklyDigest} onChange={() => handleChange('weeklyDigest')} className="accent-[#004225]" />
        </label>

        <label className="flex items-center justify-between">
          <span>Tap to Confirm Reminders</span>
          <input type="checkbox" checked={prefs.tapToConfirm} onChange={() => handleChange('tapToConfirm')} className="accent-[#004225]" />
        </label>

        <label className="flex items-center justify-between">
          <span>Assign to Both Parents</span>
          <input type="checkbox" checked={prefs.assignToBoth} onChange={() => handleChange('assignToBoth')} className="accent-[#004225]" />
        </label>

        <button type="submit" className="w-full py-2 bg-[#004225] text-white rounded">
          Finish Setup
        </button>
      </div>
    </form>
  )
}
