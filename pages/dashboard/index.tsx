import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Dashboard from '../../components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [child, setChild] = useState<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('childProfile')
    if (stored) {
      setChild(JSON.parse(stored))
    } else {
      router.replace('/onboarding')
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return <Dashboard />
}
