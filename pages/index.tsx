import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkOnboarding = async () => {
      if (status !== 'authenticated') return

      const email = session?.user?.email
      if (!email) {
        console.warn('⚠️ No email in session.user')
        return
      }

      try {
        const docRef = doc(db, 'users', email, 'childProfile', 'info')
        const snap = await getDoc(docRef)

        if (!snap.exists()) {
          console.log('🔁 Redirecting to onboarding')
          router.replace('/onboarding')
        } else {
          console.log('✅ Redirecting to dashboard')
          router.replace('/dashboard')
        }
      } catch (err) {
        console.error('❌ Firestore error during onboarding check:', err)
      } finally {
        setChecked(true)
      }
    }

    checkOnboarding()
  }, [session, status])

  return <p className="p-6">{checked ? 'Redirecting...' : 'Loading...'}</p>
}
