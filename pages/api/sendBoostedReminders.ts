// 🔥 FILE: pages/api/sendBoostedReminders.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/firebaseAdmin'
import { getDocs, doc, getDoc, collection } from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))

    for (const userDoc of usersSnapshot.docs) {
      const parentId = userDoc.id

      const prefsRef = doc(db, 'users', parentId, 'preferences', 'settings')
      const prefsSnap = await getDoc(prefsRef)
      const prefs = prefsSnap.exists() ? prefsSnap.data() : {}

      if (!prefs.boostedReminders) continue

      const profileRef = doc(db, 'users', parentId, 'childProfile', 'info')
      const profileSnap = await getDoc(profileRef)
      const profile = profileSnap.exists() ? profileSnap.data() : {}

      if (!profile.children || !Array.isArray(profile.children)) continue

      for (const child of profile.children) {
        const childId = child.id || `${parentId}_${child.name?.toLowerCase() || 'child'}`

        const tasks: string[] = []

        if (child.peDays?.includes(today)) {
          tasks.push('PE today – pack uniform')
        }
        if (child.libraryDays?.includes(today)) {
          tasks.push('Library today – return books')
        }
        if (child.houseSportDays?.includes(today)) {
          tasks.push('House Sport today – sports gear needed')
        }
        const activity = child.activities?.[today]
        if (activity) {
          tasks.push(`${activity} today`)
        }

        for (const task of tasks) {
          await db.collection('reminders').add({
            parentId,
            childId,
            subject: task,
            body: '',
            date: new Date().toISOString().split('T')[0],
            boosted: true,
            confirmed: false,
            source: 'boosted',
            createdAt: new Date().toISOString()
          })
        }
      }
    }

    res.status(200).json({ status: 'Boosted reminders sent' })
  } catch (error) {
    console.error('❌ Boosted reminder error:', error)
    res.status(500).json({ error: 'Failed to send boosted reminders' })
  }
}
