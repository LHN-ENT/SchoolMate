import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' }
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <div className="w-full sm:w-60 bg-white shadow-md h-full p-6 space-y-6 border-r">
      <h2 className="text-2xl font-bold text-[#004225] mb-8">SchoolMate</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`px-5 py-3 rounded-lg transition cursor-pointer text-base ${
                router.pathname === item.href
                  ? 'bg-[#004225] text-white'
                  : 'text-[#1C1C1C] hover:bg-gray-100'
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
