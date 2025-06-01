import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#ECECEC] flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-4">
        {children}
      </main>
    </div>
  )
}
