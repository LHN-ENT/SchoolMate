import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ECECEC] px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full space-y-4">
        <h1 className="text-4xl font-bold text-[#004225]">404</h1>
        <p className="text-lg text-gray-700">Oops! The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="mt-4 inline-block px-6 py-2 rounded-xl bg-[#004225] text-white font-semibold hover:bg-[#00331b] transition">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
