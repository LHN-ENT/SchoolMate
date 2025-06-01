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
  console.log('📩 Incoming reminder:', req.body)

  if (!subject || !date || !parentId || !childId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const ref = db.collection('users').doc(parentId).collection('reminders')
    await ref.add({
      subject,
      body,
      from,
      date,
      childId,
      origin: 'email',
      confirmed: false,
      createdAt: new Date().toISOString(),
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('❌ Firestore write error:', err)
    res.status(500).json({ error: 'Failed to write reminder' })
  }
}
