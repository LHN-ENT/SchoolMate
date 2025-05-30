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
    const checkProfile = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const uid = session.user.email // or session.user.id if custom ID
        const userRef = doc(db, 'users', uid)
        const userSnap = await getDoc(userRef)

        const userData = userSnap.data()
        const hasChildren = userData?.children?.length > 0

        router.push(hasChildren ? '/dashboard' : '/onboarding/step1')
      }
    }

    if (status === 'authenticated') checkProfile()
    else if (status === 'unauthenticated') setLoading(false)
  }, [status, session, router])

  if (status === 'loading' || loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to SchoolMate</h1>
        <p className="mb-6 text-center">Log in with Google to get started</p>
        <button
          onClick={() => signIn('google')}
          className="bg-[#004225] text-white w-full py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
