import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

export default function Header() {
  const { data: session } = useSession()
  const [childName, setChildName] = useState('')

  useEffect(() => {
    const fetchChildName = async () => {
      if (!session?.user?.email) return

      try {
        const userRef = doc(db, 'users', session.user.id)
        const snap = await getDoc(userRef)
        const data = snap.exists() ? snap.data() : null
        setChildName(data?.childProfile?.name || '')
      } catch (err) {
        console.error('Failed to load child name for header:', err)
        setChildName('')
      }
    }

    fetchChildName()
  }, [session])

  return (
    <header className="w-full px-6 py-4 bg-white shadow flex justify-between items-center border-b border-gray-200">
      <h1 className="text-lg font-semibold text-[#004225]">
        {childName ? `Dashboard – ${childName}` : 'Dashboard'}
      </h1>
      <div className="text-sm text-gray-500 italic">
        Ask SchoolMate AI (coming soon)
      </div>
    </header>
  )
}
