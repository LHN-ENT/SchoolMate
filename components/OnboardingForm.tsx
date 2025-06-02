import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

export default function OnboardingForm() {
  const router = useRouter()
  const { data: session } = useSession()

  const [step, setStep] = useState(1)
  const [child, setChild] = useState({
    name: '',
    year: '',
    class: '',
    color: '#004225',
  })

  const [prefs, setPrefs] = useState({
    dailyDigest: true,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: true,
  })

  const handleNextStep = () => setStep(step + 1)

  const handleChildSubmit = async (e) => {
    e.preventDefault()
    if (!session?.user?.email) return

    await setDoc(doc(db, 'users', session.user.email), {
      childProfile: child,
    }, { merge: true })

    handleNextStep()
  }

  const handlePrefsSubmit = async (e) => {
    e.preventDefault()
    if (!session?.user?.email) return

    await setDoc(doc(db, 'users', session.user.email), {
      preferences: prefs,
    }, { merge: true })

    router.push('/dashboard')
  }

  const updateChild = (field, value) => setChild({ ...child, [field]: value })
  const togglePref = (field) => setPrefs((prev) => ({ ...prev, [field]: !prev[field] }))

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#ECECEC] px-4 py-10">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full space-y-6">
        {step === 1 && (
          <form onSubmit={handleChildSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-[#004225]">Step 1: Add Your Child</h2>
            <input
              type="text"
              placeholder="Child's Name"
              value={child.name}
              onChange={(e) => updateChild('name', e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Year"
              value={child.year}
              onChange={(e) => updateChild('year', e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Class"
              value={child.class}
              onChange={(e) => updateChild('class', e.target.value)}
              className="input"
              required
            />
            <input
              type="color"
              value={child.color}
              onChange={(e) => updateChild('color', e.target.value)}
              className="w-full h-10 border rounded"
            />
            <button type="submit" className="btn-primary">Next</button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#004225]">Step 2: Link School Apps</h2>
            <p className="text-sm text-gray-600">App linking coming soon — no action needed.</p>
            <button onClick={handleNextStep} className="btn-primary">Next</button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handlePrefsSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-[#004225]">Step 3: Preferences</h2>
            {Object.keys(prefs).map((key) => (
              <label key={key} className="block text-sm">
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => togglePref(key)}
                  className="mr-2"
                />
                {key}
              </label>
            ))}
            <button type="submit" className="btn-primary">Finish</button>
          </form>
        )}
      </div>
    </div>
  )
}
