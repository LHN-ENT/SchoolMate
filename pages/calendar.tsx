import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function CalendarPage() {
  const { data: session } = useSession()
  const [childProfile, setChildProfile] = useState(null)

  useEffect(() => {
    const fetchChildProfile = async () => {
      if (!session?.user?.email) return

      try {
        const userRef = doc(db, 'users', session.user.id)
        const snap = await getDoc(userRef)
        const data = snap.exists() ? snap.data() : null
        setChildProfile(data?.childProfile || null)
      } catch (error) {
        console.error('Failed to fetch child profile for calendar:', error)
        setChildProfile(null)
      }
    }

    fetchChildProfile()
  }, [session])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-[#F7F7F7] p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#004225]">Weekly Schedule</h1>

        {!childProfile?.children ? (
          <div className="p-4 bg-yellow-100 text-yellow-900 rounded">
            No child profile found. Please complete setup.
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-white rounded-lg shadow p-3 space-y-3">
                <h2 className="text-lg font-semibold text-[#004225]">{day}</h2>

                {childProfile.children.map((child, i) => {
                  const activities = []

                  if (child.peDays?.includes(day)) activities.push('PE')
                  if (child.libraryDays?.includes(day)) activities.push('Library')
                  if (child.houseSportDays?.includes(day)) activities.push('House Sport')
                  if (child.activities?.[day]) activities.push(child.activities[day])
                  if (child.aftercare) activities.push('After School Care')

                  return (
                    <div key={i} className="border border-gray-200 rounded p-2">
                      <p className="font-semibold text-sm text-[#1C1C1C]">
                        {child.name} ({child.year}) — {child.teacher}
                      </p>
                      <p className="text-xs text-gray-500">
                        {child.startTime ?? '--:--'}–{child.endTime ?? '--:--'}
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-700">
                        {activities.length > 0 ? (
                          activities.map((a, idx) => (
                            <li key={idx} className="pl-2 before:content-['\u2022'] before:mr-2">
                              {a}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">No events</li>
                        )}
                      </ul>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
