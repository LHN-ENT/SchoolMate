import { useEffect, useState } from 'react'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const [showSetup, setShowSetup] = useState(true)

  useEffect(() => {
    const storedProfile = localStorage.getItem('childProfile')
    const parsed = storedProfile ? JSON.parse(storedProfile) : null

    if (!parsed?.children || parsed.children.length === 0) {
      setShowSetup(true)
      return
    }

    // Generate today's reminders
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    const reminders: string[] = []

    parsed.children.forEach(child => {
      if (child.peDays?.includes(today)) {
        reminders.push(`${child.name} has PE today – pack uniform`)
      }
      if (child.libraryDays?.includes(today)) {
        reminders.push(`${child.name} has Library today – return books`)
      }
      if (child.houseSportDays?.includes(today)) {
        reminders.push(`${child.name} has House Sport today – sports gear needed`)
      }
      const activity = child.activities?.[today]
      if (activity) {
        reminders.push(`${child.name} has ${activity} today`)
      }
    })

    localStorage.setItem('reminders', JSON.stringify(reminders))
    setShowSetup(false)
  }, [])

  return <Dashboard hideSetup={!showSetup} />
}
