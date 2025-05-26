import { useEffect, useState } from 'react'

export default function Dashboard({ hideSetup }) {
  const [child, setChild] = useState({ name: 'your child' })
  const [prefs, setPrefs] = useState({
    dailyDigest: false,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true
  })

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    const storedPrefs = localStorage.getItem('userPreferences')

    if (storedChild) setChild(JSON.parse(storedChild))
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs))
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4 space-y-4">
      {!hideSetup && (
        <div className="mb-4 p-4 bg-[#FFD966] text-[#1C1C1C] rounded shadow">
          Complete your setup to see your dashboard.
        </div>
      )}

      <h1 className="text-xl font-bold text-[#004225]">
        Today for {child.name || 'your child'}
      </h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-md font-semibold text-[#1C1C1C]">Reminders</h2>
        <ul className="mt-2 space-y-2">
          <li className="p-3 bg-[#DFF5E3] rounded flex justify-between items-center">
            Library Day – pack books
            {prefs.tapToConfirm && (
              <button className="text-sm bg-[#004225] text-white px-2 py-1 rounded">Confirm</button>
            )}
          </li>
          <li className="p-3 bg-white border rounded flex justify-between items-center">
            Swimming – bring towel
            {prefs.tapToConfirm && (
              <button className="text-sm border border-[#004225] text-[#004225] px-2 py-1 rounded">Confirm</button>
            )}
          </li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-md font-semibold text-[#1C1C1C]">Ask SchoolMate</h2>
        <input
          type="text"
          placeholder="What do I need to pack for tomorrow?"
          className="w-full p-2 border rounded mt-2"
        />
      </div>
    </div>
  )
}
