import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import OnboardingForm from '@/components/OnboardingForm'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      if (status === 'loading') return

      if (!session?.user?.email) {
        router.replace('/auth/signin')
        return
      }

      try {
        const userRef = doc(db, 'users', session.user.id)
        const snap = await getDoc(userRef)
        const data = snap.exists() ? snap.data() : null

        if (data?.childProfile) {
          router.replace('/dashboard')
        }
      } catch (err) {
        console.error('Onboarding redirect failed:', err)
      } finally {
        setChecking(false)
      }
    }

    checkIfAlreadyOnboarded()
  }, [session, status, router])

  if (checking || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
        <p className="text-gray-600">Loading onboarding...</p>
      </div>
    )
  }

  return <OnboardingForm />
}
