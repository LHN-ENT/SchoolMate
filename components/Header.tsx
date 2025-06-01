import { useEffect, useState } from 'react'

export default function Header() {
  const [childName, setChildName] = useState('')

  useEffect(() => {
    const storedChild = localStorage.getItem('childProfile')
    if (storedChild) {
      try {
        const parsed = JSON.parse(storedChild)
        setChildName(parsed.name || '')
      } catch {
        setChildName('')
      }
    }
  }, [])

  return (
    <header className="w-full px-6 py-4 bg-white shadow flex justify-between items-center border-b border-gray-200">
      <h1 className="text-lg font-semibold text-[#004225]">
        {childName ? `Dashboard – ${childName}` : 'Dashboard'}
      </h1>
      <div className="text-sm text-gray-500 italic">
        Ask SchoolMate AI (coming soon)
      </div>
    </header>
  )
}
