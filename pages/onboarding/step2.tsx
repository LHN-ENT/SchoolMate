import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Step2() {
  const router = useRouter()
  const [apps, setApps] = useState<string[]>([])

  const handleToggle = (app: string) => {
    setApps(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('connectedApps', JSON.stringify(apps))
    router.push('/onboarding/step3')
  }

  const availableApps = ['Gmail', 'Compass', 'Toddle', 'Seesaw', 'ClassDojo', 'EdSmart']

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-[#004225]">Step 2: Connect Apps</h2>
        <p className="text-[#5A5A5A] text-sm">Which school platforms do you use?</p>

        {availableApps.map(app => (
          <label key={app} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={apps.includes(app)}
              onChange={() => handleToggle(app)}
              className="accent-[#004225]"
            />
            <span>{app}</span>
          </label>
        ))}

        <button type="submit" className="w-full py-2 bg-[#004225] text-white rounded">
          Next
        </button>
      </div>
    </form>
  )
}
