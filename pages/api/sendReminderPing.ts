import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firestore'

export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  console.log('👉 Incoming body:', req.body)

  const { subject, body, date, childId } = req.body

  try {
    if (subject && body && childId) {
      await db.collection('reminders').add({
        subject,
        body,
        date: date || null,
        childId,
        parsed: true,
        createdAt: new Date().toISOString(),
        source: 'make',
      })

      console.log(`📬 Custom reminder saved for child: ${childId}`)
      return res.status(200).json({ status: 'Custom reminder saved' })
    }

    // fallback — not used in this Make trigger
    res.status(200).json({ status: 'Skipped auto mode — no custom payload received' })
  } catch (err) {
    console.error('🔥 sendReminderPing failed:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
