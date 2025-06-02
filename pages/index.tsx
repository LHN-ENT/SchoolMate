import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkProfile = async () => {
      if (status === 'loading') return

      if (!session?.user?.email) {
        router.replace('/auth/signin')
        return
      }

      try {
        const userRef = doc(db, 'users', session.user.id)
        const snap = await getDoc(userRef)

        const data = snap.exists() ? snap.data() : null

        if (!data?.childProfile) {
          router.replace('/onboarding/step1')
        } else {
          router.replace('/dashboard')
        }
      } catch (err) {
        console.error('Index redirect failed:', err)
        router.replace('/onboarding/step1')
      } finally {
        setChecking(false)
      }
    }

    checkProfile()
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
      <p className="text-gray-600">Checking profile...</p>
    </div>
  )
}
