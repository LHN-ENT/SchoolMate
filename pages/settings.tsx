import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useRouter } from 'next/router'

const timezones = [
  { label: 'UTC+8 (SG)', value: 'UTC+8' },
  { label: 'UTC+10 (SYD)', value: 'UTC+10' },
  { label: 'UTC+0 (UK)', value: 'UTC+0' }
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [timezone, setTimezone] = useState('UTC+8')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const userEmail = session?.user?.email

  useEffect(() => {
    if (!userEmail) return
    const loadSettings = async () => {
      const docRef = doc(db, 'parentSettings', userEmail)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.timezone) setTimezone(data.timezone)
      }
    }
    loadSettings()
  }, [userEmail])

  const handleTimezoneChange = async (e) => {
    const newTZ = e.target.value
    setTimezone(newTZ)
    if (!userEmail) return
    await setDoc(doc(db, 'parentSettings', userEmail), { timezone: newTZ }, { merge: true })
  }

  const handleDeleteAccount = async () => {
    if (!userEmail) return
    await deleteDoc(doc(db, 'parentSettings', userEmail))
    await deleteDoc(doc(db, 'children', userEmail))
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] p-6 font-sans">
      <h1 className="text-2xl font-bold text-[#004225] mb-6">⚙️ Settings</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-4 max-w-md">
        <div>
          <label clas
