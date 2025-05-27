// pages/api/parseEmailReminder.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from '@/lib/firestore'
import { getOpenAIResponse } from '@/lib/openaiParser'
// import { verifyMakeWebhook } from '@/lib/auth' // ⛔ Temporarily disabled
import { Reminder } from '@/types/reminder'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // ⛔ TEMP BYPASS: Skip webhook signature verification
  const isValid = true
  if (!isValid) return res.status(401).json({ error: 'Unauthorized Make webhook' })

  const { subject, body, date, child } = req.body

  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing subject or body in request' })
  }

  try {
    const parsed = await getOpenAIResponse(subject, body)

    const reminder: Reminder = {
      childId: parsed.child || child || 'unknown',
      title: parsed.title || subject,
      notes: parsed.notes || '',
      type: parsed.type || 'info',
      date: parsed.date || date || null,
      tags: parsed.tags || [],
      boosted: parsed.boosted || false,
      confirmed: false,
      createdAt: new Date().toISOString(),
    }

    const db = getFirestore()
    const childPath = `users/lachlan.hart@gmail.com/children/${reminder.childId}/reminders`
    await db.collection(childPath).add(reminder)

    return res.status(200).json({ success: true, reminder })
  } catch (err: any) {
    console.error('Reminder parse failed:', err)
    return res.status(500).json({ error: 'Failed to parse reminder' })
  }
}
