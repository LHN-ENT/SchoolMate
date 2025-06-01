import { getProviders, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [providers, setProviders] = useState({})

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4">
      <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-[#004225]">Sign in to SchoolMate</h1>
        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            className="bg-[#004225] hover:bg-[#00361c] text-white font-semibold py-2 px-4 rounded-xl transition-all"
            onClick={() => signIn(provider.id)}
          >
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </div>
  )
}
