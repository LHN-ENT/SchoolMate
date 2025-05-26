import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    console.log('✅ Boosted reminder webhook triggered by Make.com')

    // Future: Fetch users from DB, send email/push/SMS here

    res.status(200).json({ status: 'Boosted reminders sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Webhook failed' })
  }
}
