import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { db } from '../lib/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const checkOnboarding = async () => {
      if (status !== 'authenticated') return

      const email = session?.user?.email
      const docRef = doc(db, 'users', email || '', 'childProfile', 'info')
      const snap = await getDoc(docRef)

      if (!snap.exists()) {
        router.replace('/onboarding')
      } else {
        router.replace('/dashboard')
      }
    }

    checkOnboarding()
  }, [session, status])

  return <p className="p-6">Loading...</p>
}
