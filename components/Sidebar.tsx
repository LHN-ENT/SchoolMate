// components/Sidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' }
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <div className="w-full sm:w-60 bg-white shadow-md h-full p-4 space-y-4 border-r">
      <h2 className="text-xl font-bold text-[#004225] mb-6">SchoolMate</h2>

      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div
            className={`px-4 py-2 rounded cursor-pointer ${
              router.pathname === item.href
                ? 'bg-[#004225] text-white'
                : 'text-[#1C1C1C] hover:bg-gray-100'
            }`}
          >
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  )
}
