import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    console.log(`🚀 Boosted reminder ping triggered at ${new Date().toISOString()}`)

    const usersRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersRef)

    const optedInEmails: string[] = []

    for (const userDoc of usersSnapshot.docs) {
      const email = userDoc.id
      const settingsRef = doc(db, 'users', email, 'preferences', 'settings')
      const settingsSnap = await getDoc(settingsRef)

      if (settingsSnap.exists()) {
        const prefs = settingsSnap.data()
        if (prefs.boostedReminders) {
          optedInEmails.push(email)
          console.log(`📬 Would send boosted reminder to: ${email}`)
        } else {
          console.log(`⏸️ Skipping ${email} — opted out`)
        }
      } else {
        console.log(`⚠️ No settings found for ${email}`)
      }
    }

    res.status(200).json({
      status: 'Processed',
      totalUsers: usersSnapshot.size,
      optedIn: optedInEmails.length,
      recipients: optedInEmails
    })
  } catch (err) {
    console.error('🔥 Error in boosted reminder handler:', err)
    res.status(500).json({ error: 'Webhook failed' })
  }
}
