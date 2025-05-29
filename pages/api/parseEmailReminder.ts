// 🔥 FILE: /pages/api/parseEmailReminder.ts
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'
import { getSession } from 'next-auth/react'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    // 🔐 Auth: get session token from user
    const session = await getSession({ req })
    if (!session?.accessToken) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // 🧠 Init Gmail API with token
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: session.accessToken })
    const gmail = google.gmail({ version: 'v1', auth })

    // 📨 Fetch recent emails from inbox (past 24h)
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      q: 'newer_than:1d',
      maxResults: 10,
    })

    if (!data.messages || data.messages.length === 0) {
      return res.status(200).json({ status: 'No new emails' })
    }

    const batch = db.batch()

    for (const msg of data.messages) {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id || '',
        format: 'full',
      })

      const payload = full.data.payload
      const headers = payload?.headers || []
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject'
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown'
      const snippet = full.data.snippet || ''
      const date = new Date(parseInt(full.data.internalDate || '0'))

      // 🧠 Simple match on child name
      let childId = 'unknown'
      if (/reilly/i.test(subject + snippet)) childId = 'reilly123'
      if (/flynn/i.test(subject + snippet)) childId = 'flynn123'

      const reminder = {
        subject,
        body: snippet,
        date: date.toISOString().split('T')[0],
        from,
        childId,
      }

      const ref = db.collection('reminders').doc()
      batch.set(ref, reminder)
    }

    await batch.commit()

    res.status(200).json({ status: 'Emails parsed and saved' })
  } catch (err) {
    console.error('❌ Error parsing Gmail:', err)
    res.status(500).json({ error: 'Failed to parse Gmail' })
  }
}
