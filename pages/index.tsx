import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') return null

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
