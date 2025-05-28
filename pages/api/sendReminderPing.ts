import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firestore'

export const config = {
  api: {
    bodyParser: true, // Explicitly tell Vercel we want body parsing
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Ensure we’re reading the body even if edge case fails
  const { subject, body, date, childId, type } = req.body || {}

  console.log('👉 Incoming body:', req.body)

  try {
    if (subject && body && childId) {
      await db.collection('reminders').add({
        subject,
        body,
        date: date || null,
        childId,
        parsed: true,
        createdAt: new Date().toISOString(),
        source: 'make',
      })

      console.log(`📬 Custom reminder saved for child: ${childId}`)
      return res.status(200).json({ status: 'Custom reminder saved' })
    }

    const usersSnapshot = await getDocs(collection(db, 'users'))
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    const result: Record<string, string[]> = {}

    for (const userDoc of usersSnapshot.docs) {
      const email = userDoc.id
      const prefsRef = doc(db, 'users', email, 'preferences', 'settings')
      const prefsSnap = await getDoc(prefsRef)
      const prefs = prefsSnap.exists() ? prefsSnap.data() : {}

      if (!prefs.boostedReminders) continue

      const profileRef = doc(db, 'users', email, 'childProfile', 'info')
      const profileSnap = await getDoc(profileRef)
      const profile = profileSnap.exists() ? profileSnap.data() : null

      if (!profile?.children?.length) continue

      const reminders: string[] = []

      profile.children.forEach(child => {
        if (child.peDays?.includes(today)) reminders.push(`${child.name} has PE today – pack uniform`)
        if (child.libraryDays?.includes(today)) reminders.push(`${child.name} has Library today – return books`)
        if (child.houseSportDays?.includes(today)) reminders.push(`${child.name} has House Sport today – sports gear needed`)
        const activity = child.activities?.[today]
        if (activity) reminders.push(`${child.name} has ${activity} today`)
      })

      result[email] = reminders
      console.log(`✅ ${email} reminders:`, reminders)
    }

    res.status(200).json({ status: 'Auto reminders generated', result })
  } catch (err) {
    console.error('🔥 sendReminderPing failed:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
