import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { subject, body, date, child } = req.body

  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing subject or body in request' })
  }

  // Simulate parsed reminder (no OpenAI or Firestore yet)
  const reminder = {
    childId: child || 'unknown',
    title: subject,
    notes: body,
    type: 'info',
    date: date || null,
    tags: [],
    boosted: false,
    confirmed: false,
    createdAt: new Date().toISOString(),
  }

  return res.status(200).json({ success: true, reminder })
}
