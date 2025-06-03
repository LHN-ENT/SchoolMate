import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

// Sidebar nav items
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <FaChalkboardTeacher />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <FaCalendarAlt />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <FaCog />,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
        <div>
          <div className="mb-8">
            <span className="font-extrabold text-2xl text-blue-700">
              SchoolMate
            </span>
          </div>
          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-50 text-gray-800 text-lg font-medium mb-2 transition">
                    <span className="text-blue-600">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* User/Sign Out */}
        <div className="flex items-center gap-3 mt-8">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-10 h-10 rounded-full border"
            />
          )}
          <div className="flex-1">
            <div className="font-medium text-gray-900">{session?.user?.name || "Account"}</div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-sm text-red-600 hover:underline"
            >
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-white shadow px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>
        </header>
        <section className="flex-1 p-8">{children}</section>
      </main>
    </div>
  );
}
