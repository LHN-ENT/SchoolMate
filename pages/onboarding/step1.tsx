import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

export default function Step1() {
  const router = useRouter()
  const { data: session } = useSession()
  const [child, setChild] = useState({ name: '', year: '', class: '', color: '#004225' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session?.user?.email) {
      alert('User not authenticated')
      return
    }

    const uid = session.user.email // or session.user.id if you're using custom ID
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    const existingData = userSnap.exists() ? userSnap.data() : {}

    const updatedChildren = [...(existingData.children || []), child]

    await setDoc(userRef, { ...existingData, children: updatedChildren }, { merge: true })
    router.push('/onboarding/step2')
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center bg-[#ECECEC] px-4">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-[#004225]">Step 1: Add Your Child</h2>

        <input
          type="text"
          placeholder="Child's Name"
          value={child.name}
          onChange={(e) => setChild({ ...child, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Year Level"
          value={child.year}
          onChange={(e) => setChild({ ...child, year: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Class (e.g. 3B)"
          value={child.class}
          onChange={(e) => setChild({ ...child, class: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <label className="block text-sm text-[#5A5A5A]">Choose a tag color</label>
        <input
          type="color"
          value={child.color}
          onChange={(e) => setChild({ ...child, color: e.target.value })}
          className="w-full h-10 rounded"
        />

        <button type="submit" className="w-full py-2 bg-[#004225] text-white rounded">
          Save & Next
        </button>
      </div>
    </form>
  )
}
