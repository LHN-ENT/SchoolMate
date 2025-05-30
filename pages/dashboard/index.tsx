import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'
import Dashboard from '../../components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (status !== 'authenticated') return

      const uid = session.user.email
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      const userData = userSnap.exists() ? userSnap.data() : null
      const firstChild = userData?.children?.[0] || null

      if (!firstChild) {
        router.push('/onboarding')
      } else {
        setChild(firstChild)
      }

      setLoading(false)
    }

    loadProfile()
  }, [status, session, router])

  if (status === 'loading' || loading) return null

  if (!child) return null

  return <Dashboard child={child} />
}
