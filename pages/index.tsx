// force build
import { useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Welcome() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const hasChild = localStorage.getItem('childProfile')
    const hasApps = localStorage.getItem('connectedApps')

    if (session && hasChild && hasApps) {
      router.replace('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (session) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#004225]">Welcome back, {session.user?.name}</h1>
          <p className="text-[#5A5A5A]">You're signed in as {session.user?.email}</p>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-2 rounded text-white bg-[#004225] hover:bg-[#00361b] transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => signOut()}
            className="w-full py-2 rounded border border-[#004225] text-[#004225]"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">Welcome to SchoolMate</h1>
        <p className="text-[#5A5A5A]">Sign in with your Google account to get started.</p>

        <button
          onClick={() => signIn('google')}
          className="w-full py-2 rounded text-white bg-[#004225] hover:bg-[#00361b] transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
