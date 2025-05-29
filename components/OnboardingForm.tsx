import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

export default function OnboardingForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const [children, setChildren] = useState([
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

  const updateChildField = (index, field, value) => {
    const updated = [...children]
    updated[index][field] = value
    setChildren(updated)
  }

  const updateActivity = (index, day, value) => {
    const updated = [...children]
    updated[index].activities[day] = value
    setChildren(updated)
  }

  const toggleArrayField = (index, field, day) => {
    const updated = [...children]
    const arr = updated[index][field]
    updated[index][field] = arr.includes(day)
      ? arr.filter(d => d !== day)
      : [...arr, day]
    setChildren(updated)
  }

  const addChild = () =>
    setChildren([
      ...children,
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

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const childProfile = {
        children,
        transport,
        dailyDigest
      }

      localStorage.setItem('childProfile', JSON.stringify(childProfile))

      if (session?.user?.email) {
        const ref = doc(db, 'users', session.user.email, 'childProfile', 'info')
        await setDoc(ref, childProfile, { merge: true })
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Onboarding error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!session && (
        <button
          type="button"
          onClick={() => signIn('google')}
          className="w-full py-2 bg-red-500 text-white rounded"
        >
          Sign in with Google
        </button>
      )}

      {children.map((child, i) => (
        <div key={i} className="space-y-4 border p-4 rounded bg-gray-50">
          <h2 className="font-bold text-lg">Child {i + 1}</h2>
          <input
            type="text"
            placeholder="Name"
            value={child.name}
            onChange={e => updateChildField(i, 'name', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Year/Grade"
            value={child.year}
            onChange={e => updateChildField(i, 'year', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Teacher"
            value={child.teacher}
            onChange={e => updateChildField(i, 'teacher', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-4">
            <input
              type="time"
              value={child.startTime}
              onChange={e => updateChildField(i, 'startTime', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="time"
              value={child.endTime}
              onChange={e => updateChildField(i, 'endTime', e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">PE Days</label>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <label key={day} className="mr-2">
                <input
                  type="checkbox"
                  checked={child.peDays.includes(day)}
                  onChange={() => toggleArrayField(i, 'peDays', day)}
                />{' '}
                {day}
              </label>
            ))}
          </div>

          <div>
            <label className="block font-medium">Library Days</label>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <label key={day} className="mr-2">
                <input
                  type="checkbox"
                  checked={child.libraryDays.includes(day)}
                  onChange={() => toggleArrayField(i, 'libraryDays', day)}
                />{' '}
                {day}
              </label>
            ))}
          </div>

          <div>
            <label className="block font-medium">House Sport Days</label>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <label key={day} className="mr-2">
                <input
                  type="checkbox"
                  checked={child.houseSportDays.includes(day)}
                  onChange={() => toggleArrayField(i, 'houseSportDays', day)}
                />{' '}
                {day}
              </label>
            ))}
          </div>

          <div>
            <label className="block font-medium">Extra Activities</label>
            {Object.keys(child.activities).map(day => (
              <input
                key={day}
                type="text"
                placeholder={`${day} Activity`}
                value={child.activities[day]}
                onChange={e => updateActivity(i, day, e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={child.aftercare}
              onChange={() =>
                updateChildField(i, 'aftercare', !child.aftercare)
              }
            />
            <label>Requires after school care</label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addChild}
        className="text-blue-600 underline block"
      >
        + Add Another Child
      </button>

      <div>
        <label className="block font-medium">Transport Method</label>
        <select
          value={transport}
          onChange={e => setTransport(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="bus">Bus</option>
          <option value="drive">Drive</option>
          <option value="walk">Walk</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={dailyDigest}
          onChange={() => setDailyDigest(!dailyDigest)}
        />
        <label>Receive Daily Digest</label>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </form>
  )
}
