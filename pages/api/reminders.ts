import type { NextApiRequest, NextApiResponse } from 'next'
import { createReminder, getReminders, deleteReminder } from '../../lib/firestoreReminders'

// You can add authentication here later if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // The Firestore version needs subject, date, and (optionally) body, childId, etc.
      const { subject, body, date, childId, boosted, confirmed, source, parentId } = req.body
      if (!subject || !date || !parentId) {
        return res.status(400).json({ error: 'Missing required fields: subject, date, and parentId' })
      }
      const reminder = await createReminder({
        parentId,
        childId,
        subject,
        body: body || '',
        date,
        boosted: boosted || false,
        confirmed: confirmed || false,
        source: source || 'manual',
      })
      return res.status(201).json(reminder)
    }

    if (req.method === 'GET') {
      const { parentId } = req.query
      if (!parentId || typeof parentId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid parentId' })
      }
      const reminders = await getReminders(parentId)
      return res.status(200).json(reminders)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing reminder id' })
      }
      await deleteReminder(id)
      return res.status(204).end()
    }

    res.setHeader('Allow', ['POST', 'GET', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Reminder API error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
