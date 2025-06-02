import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const router = useRouter()
  const current = router.pathname

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg ${
      current === path
        ? 'bg-[#004225] text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  return (
    <aside className="w-60 min-h-screen bg-white shadow-lg border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold text-[#004225] mb-4">SchoolMate</h2>

      <nav className="space-y-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/calendar" className={linkClass('/calendar')}>
          Weekly Schedule
        </Link>
        <Link href="/settings" className={linkClass('/settings')}>
          Settings
        </Link>
      </nav>

      <button
        onClick={() => signOut()}
        className="mt-10 text-sm text-red-600 underline"
      >
        Log out
      </button>
    </aside>
  )
}
