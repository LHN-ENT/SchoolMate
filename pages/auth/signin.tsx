import { signIn } from 'next-auth/react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to SchoolMate</h1>
        <p className="mb-6 text-sm text-gray-500">
          Use your Google account to continue
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
