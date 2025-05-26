// trigger redeploy
import { signIn } from 'next-auth/react'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">Welcome to SchoolMate</h1>
        <p className="text-[#5A5A5A]">Your smart assistant for school life. Let’s get sorted in under a minute.</p>
        
        <button
          onClick={() => window.location.href = '/onboarding/step1'}
          className="w-full py-2 rounded text-white bg-[#004225] hover:bg-[#00361b] transition"
        >
          Get Started
        </button>

        <p className="text-sm text-[#5A5A5A]">Already have an account?</p>
        <button
          onClick={() => signIn('google')}
          className="w-full py-2 rounded border border-[#004225] text-[#004225]"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
