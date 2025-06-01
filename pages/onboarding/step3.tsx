import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Step3() {
  const router = useRouter()
  const [prefs, setPrefs] = useState({
    dailyDigest: true,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })

  const handleChange = (key: string) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    localStorage.setItem('userPreferences', JSON.stringify(prefs))
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-[#004225]">Step 3: Preferences</h2>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={prefs.dailyDigest} onChange={() => handleChange('dailyDigest')} />
            <span>Daily Digest</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={prefs.weeklyDigest} onChange={() => handleChange('weeklyDigest')} />
            <span>Weekly Digest</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={prefs.tapToConfirm} onChange={() => handleChange('tapToConfirm')} />
            <span>Tap to Confirm Reminders</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={prefs.assignToBoth} onChange={() => handleChange('assignToBoth')} />
            <span>Assign to Both Parents</span>
          </label>
        </div>

        <button type="submit" className="w-full py-2 bg-[#004225] text-white rounded shadow">Finish Setup</button>
      </div>
    </form>
  )
}
