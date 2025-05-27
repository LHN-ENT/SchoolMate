import { signIn, signOut, useSession } from 'next-auth/react';

export default function Welcome() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (session) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#004225]">Welcome back, {session.user?.name}</h1>
          <p className="text-[#5A5A5A]">You're signed in as {session.user?.email}</p>

          <button
            onClick={() => window.location.href = '/dashboard'}
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
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">Welcom
