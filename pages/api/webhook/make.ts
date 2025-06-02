import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebaseAdmin'
import { collection, addDoc } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { parentEmail, subject, body, date } = req.body

  if (!parentEmail || !subject || !body) {
    console.warn('Invalid webhook payload:', req.body)
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const ref = collection(db, 'users', parentEmail, 'reminders')

    await addDoc(ref, {
      subject,
      body,
      createdAt: new Date().toISOString(),
      ...(date && { date })
    })

    return res.status(200).json({ success: true, message: 'Reminder added via webhook' })
  } catch (err) {
    console.error('Webhook processing failed:', err)
    return res.status(500).json({ error: 'Failed to handle webhook' })
  }
}
