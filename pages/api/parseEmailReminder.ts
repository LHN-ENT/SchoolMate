// 🔥 FILE: pages/api/parseEmailReminder.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, from, date, parentId, childId } = req.body

  if (!subject || !date || !parentId || !childId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await db.collection('reminders').add({
      parentId,
      childId,
      subject,
      body: body || '',
      date,
      boosted: false,
      confirmed: false,
      source: 'gmail',
      createdAt: new Date().toISOString()
    })

    console.log('📥 Gmail reminder saved:', subject)
    res.status(200).json({ status: 'Reminder saved' })
  } catch (err) {
    console.error('❌ Failed to save gmail reminder:', err)
    res.status(500).json({ error: 'Failed to save reminder' })
  }
}
