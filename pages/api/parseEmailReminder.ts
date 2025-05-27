import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from '@/lib/firestore'
import { Reminder } from '@/types/reminder'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, date, child } = req.body

  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing subject or body in request' })
  }

  // Simulated reminder (same as before)
  const reminder: Reminder = {
    childId: child || 'unknown',
    title: subject,
    notes: body,
    type: 'info',
    date: date || null,
    tags: [],
    boosted: false,
    confirmed: false,
    createdAt: new Date().toISOString(),
  }

  try {
    const db = getFirestore()
    const childPath = `users/lachlan.hart@gmail.com/children/${reminder.childId}/reminders`
    await db.collection(childPath).add(reminder)

    return res.status(200).json({ success: true, reminder })
  } catch (err: any) {
    console.error('Firestore write failed:', err)
    return res.status(500).json({ error: 'Failed to save reminder' })
  }
}
