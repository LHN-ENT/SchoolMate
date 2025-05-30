import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔥 FILE LOADED: parseEmailReminder.ts')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, from, date, parentId, childId } = req.body
  console.log('👉 Incoming body:', req.body)

  if (!subject || !date || !parentId || !childId) {
    console.error('❌ Missing required fields')
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const reminderRef = db
      .collection('reminders')
      .doc(parentId)
      .collection(childId)
      .doc()

    await reminderRef.set({
      subject,
      body: body || '',
      from: from || '',
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString()
    })

    console.log('✅ Reminder saved successfully to nested path')
    return res.status(200).json({ message: 'Reminder saved' })
  } catch (error) {
    console.error('🔥 parseEmailReminder failed:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
