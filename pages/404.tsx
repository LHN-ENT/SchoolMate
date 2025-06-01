import Link from 'next/link'
import Layout from '@/components/Layout'

export default function Custom404() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <h1 className="text-4xl font-bold text-[#004225]">404 – Page Not Found</h1>
        <p className="text-gray-600 text-sm">
          Oops! That page doesn’t exist. Maybe you followed an old link or typed the wrong URL.
        </p>
        <Link href="/dashboard">
          <span className="mt-4 inline-block text-sm text-blue-600 underline">← Back to Dashboard</span>
        </Link>
      </div>
    </Layout>
  )
}
