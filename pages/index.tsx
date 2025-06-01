import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const childProfile = localStorage.getItem('childProfile')
    if (!childProfile) {
      router.push('/onboarding/step1')
      return
    }

    const checkProfile = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const docRef = doc(db, 'users', session.user.email)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
          router.push('/onboarding/step1')
        } else {
          router.push('/dashboard')
        }
      }
    }

    checkProfile().finally(() => setLoading(false))
  }, [session, status, router])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  return null
}
