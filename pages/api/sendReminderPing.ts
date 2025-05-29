import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import { getDocs, collection, doc, getDoc } from 'firebase-admin/firestore'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: false,
  },
}

function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    const readable = req as unknown as Readable
    readable.on('data', chunk => chunks.push(chunk))
    readable.on('end', () => resolve(Buffer.concat(chunks)))
    readable.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let payload
  try {
    const rawBody = await getRawBody(req)
    payload = JSON.parse(rawBody.toString())
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const { subject, body: messageBody, date, childId } = payload

  if (!db) {
    return res.status(500).json({ error: 'Firestore not initialized' })
  }

  try {
    if (subject && messageBody && childId) {
      await db.collection('reminders').add({
        subject,
        body: messageBody,
        date: date || null,
        childId,
        parsed: true,
        createdAt: new Date().toISOString(),
        source: 'make',
      })

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
    }

    res.status(200).json({ status: 'Auto reminders generated', result })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
