import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (status === 'loading') return
      if (status !== 'authenticated' || !session?.user?.email) {
        console.warn('⚠️ No valid session — sending to sign in')
        router.replace('/auth/signin')
        return
      }

      try {
        const docRef = doc(db, 'users', session.user.email, 'childProfile', 'info')
        const snap = await getDoc(docRef)

        if (snap.exists()) {
          console.log('✅ Found child profile — to dashboard')
          router.replace('/dashboard')
        } else {
          console.log('🔁 No child — to onboarding')
          router.replace('/onboarding')
        }
      } catch (err) {
        console.error('❌ Firestore error:', err)
        router.replace('/onboarding') // fallback
      } finally {
        setLoading(false)
      }
    }

    checkAndRedirect()
  }, [status, session, router])

  return <p className="p-6">{loading ? 'Loading...' : 'Redirecting...'}</p>
}
