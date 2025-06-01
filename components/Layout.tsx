import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#ECECEC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-4">
          {children}
        </main>
      </div>
    </div>
  )
}
