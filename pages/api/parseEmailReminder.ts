// 📬 FILE: pages/api/parseEmailReminder.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, from, date, parentId, childId } = req.body

  console.log('📩 Incoming parsed email:', req.body)

  if (!subject || !date || !childId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const reminderData = {
    subject: subject || 'Email reminder',
    description: body || '',
    from: from || 'unknown',
    date,
    childId,
    parentId: parentId || 'fallback-parent',
    type: 'email',
    source: 'gmail',
    createdAt: new Date().toISOString(),
  }

  try {
    await db.collection('reminders').add(reminderData)
    console.log('✅ Reminder saved from email:', reminderData)
    return res.status(200).json({ message: 'Reminder saved', data: reminderData })
  } catch (error) {
    console.error('❌ Error saving email reminder:', error)
    return res.status(500).json({ error: 'Failed to save reminder' })
  }
}
