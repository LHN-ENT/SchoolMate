// 🔥 FILE: pages/api/sendReminderPing.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { parentId, childId, subject, body, date } = req.body

  if (!parentId || !childId || !subject || !date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const reminder = {
      parentId,
      childId,
      subject,
      body: body || '',
      date,
      boosted: false,
      confirmed: false,
      source: 'manual',
      createdAt: new Date().toISOString(),
    }

    const docRef = await db.collection('reminders').add(reminder)

    console.log('✅ Reminder saved:', reminder)

    res.status(200).json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('❌ Error saving reminder:', error)
    res.status(500).json({ error: 'Failed to save reminder' })
  }
}
