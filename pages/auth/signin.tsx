import { getProviders, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [providers, setProviders] = useState({})

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC] p-6">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to SchoolMate</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="bg-[#004225] text-white px-6 py-2 rounded hover:opacity-90"
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
