// pages/api/testBoosted.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const pingRes = await fetch(`${process.env.NEXTAUTH_URL}/api/sendReminderPing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boostedReminders: true })
    })

    const data = await pingRes.json()
    return res.status(200).json({ triggered: true, result: data })
  } catch (err) {
    console.error('❌ Test Boosted Failed', err)
    return res.status(500).json({ error: 'Test trigger failed' })
  }
}
