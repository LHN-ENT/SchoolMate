import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    const result: Record<string, string[]> = {}

    for (const userDoc of usersSnapshot.docs) {
      const email = userDoc.id

      // Check user preferences
      const prefsRef = doc(db, 'users', email, 'preferences', 'settings')
      const prefsSnap = await getDoc(prefsRef)
      const prefs = prefsSnap.exists() ? prefsSnap.data() : {}

      if (!prefs.boostedReminders) {
        console.log(`⏸️ Skipping ${email} — opted out of boosted reminders`)
        continue
      }

      // Check child profile
      const profileRef = doc(db, 'users', email, 'childProfile', 'info')
      const profileSnap = await getDoc(profileRef)
      const profile = profileSnap.exists() ? profileSnap.data() : null

      if (!profile?.children || profile.children.length === 0) {
        console.log(`⚠️ No children for ${email}`)
        continue
      }

      const reminders: string[] = []

      profile.children.forEach(child => {
        if (child.peDays?.includes(today)) {
          reminders.push(`${child.name} has PE today – pack uniform`)
        }
        if (child.libraryDays?.includes(today)) {
          reminders.push(`${child.name} has Library today – return books`)
        }
        if (child.houseSportDays?.includes(today)) {
          reminders.push(`${child.name} has House Sport today – sports gear needed`)
        }
        const activity = child.activities?.[today]
        if (activity) {
          reminders.push(`${child.name} has ${activity} today`)
        }
      })

      result[email] = reminders
      console.log(`✅ ${email} reminders:`, reminders)
    }

    res.status(200).json({ status: 'Reminders generated', result })
  } catch (err) {
    console.error('🔥 sendReminderPing failed:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
