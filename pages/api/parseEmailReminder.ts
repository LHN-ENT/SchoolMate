import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, from, date, parentId, childId } = req.body

  if (!subject || !date || !parentId || !childId) {
    console.warn('❌ Missing required fields:', { subject, date, parentId, childId })
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const reminderRef = db.collection('reminders').doc()
    await reminderRef.set({
      subject,
      body: body || '',
      from: from || '',
      date,
      parentId,
      childId,
      createdAt: new Date().toISOString()
    })

    console.log('✅ Parsed email saved:', reminderRef.id)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('❌ Failed to save parsed email:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
