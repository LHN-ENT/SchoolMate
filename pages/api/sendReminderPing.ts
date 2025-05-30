import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔥 HANDLER ENTERED: sendReminderPing')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, date, childId } = req.body
  console.log('👉 Incoming body:', req.body)

  if (!subject || !date || !childId) {
    console.error('❌ Missing required fields')
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await db.collection('reminders').add({
      subject,
      body,
      date,
      childId,
      createdAt: new Date().toISOString()
    })

    console.log('✅ Reminder saved successfully')
    return res.status(200).json({ message: 'Reminder saved' })
  } catch (error) {
    console.error('🔥 sendReminderPing failed:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
