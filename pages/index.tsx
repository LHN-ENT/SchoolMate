import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (status !== 'authenticated') return

      try {
        const ref = doc(db, 'users', session.user.email)
        const snap = await getDoc(ref)
        const data = snap.data()

        if (data?.childProfile) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding/step1')
        }
      } catch (err) {
        console.error('Profile check failed:', err)
        router.push('/onboarding/step1')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      checkUserProfile()
    }
  }, [session, status, router])

  if (loading || status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
      <button
        onClick={() => signIn('google')}
        className="px-6 py-3 bg-[#004225] text-white rounded-xl shadow"
      >
        Sign In with Google
      </button>
    </div>
  )
}
