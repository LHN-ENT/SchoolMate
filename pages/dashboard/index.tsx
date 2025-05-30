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
    }
    setReady(true)
  }, [])

  if (!ready) return null

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-xl font-semibold mb-4">Setup Incomplete</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t find a saved child profile. Let’s complete your setup.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Finish Setup
          </button>
        </div>
      </div>
    )
  }

  return <Dashboard />
}
