interface ChildProfile {
  name: string
  year: string
  teacher: string
  startTime: string
  endTime: string
  aftercare: boolean
  peDays: string[]
  libraryDays: string[]
  houseSportDays: string[]
  activities: {
    Monday: string
    Tuesday: string
    Wednesday: string
    Thursday: string
    Friday: string
  }
}

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'
import { useRouter } from 'next/router'

export default function OnboardingForm() {
  const { data: session, status } = useSession()
  const router = useRouter()

 const [children, setChildren] = useState<ChildProfile[]>([
    {
      name: '',
      year: '',
      teacher: '',
      startTime: '',
      endTime: '',
      aftercare: false,
      peDays: [],
      libraryDays: [],
      houseSportDays: [],
      activities: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: ''
      }
    }
  ])
  const [transport, setTransport] = useState('bus')
  const [dailyDigest, setDailyDigest] = useState(true)
  const [loading, setLoading] = useState(false)

  const updateChildField = (index: number, field: string, value: any) => {
    const updated = [...children]
    updated[index][field] = value
    setChildren(updated)
  }

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      console.error('❌ Session not ready — cannot save onboarding')
      return
    }

    const parentId = session.user.email
    const childId = children[0].name.toLowerCase().replace(/\s+/g, '')

    setLoading(true)
    try {
      await setDoc(doc(db, 'parents', parentId), {
        dailyDigest,
        transport
      })

      await setDoc(doc(db, 'children', childId), {
        ...children[0],
        parentId
      })

      localStorage.setItem('childProfile', JSON.stringify(children[0]))
      localStorage.setItem('userPreferences', JSON.stringify({ dailyDigest }))
      router.push('/dashboard')
    } catch (err) {
      console.error('🔥 Onboarding Firestore error:', err)
      alert('Something went wrong saving your details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return null
  if (!session) return (
    <div className="p-4">
      <p>Please sign in to continue.</p>
      <button onClick={() => signIn('google')} className="bg-green-600 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  )

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Onboarding</h2>
      <label className="block mb-2">Child’s Name</label>
      <input
        className="border p-2 w-full mb-4"
        value={children[0].name}
        onChange={e => updateChildField(0, 'name', e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-[#004225] text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}
