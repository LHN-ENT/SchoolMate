export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔥 HANDLER ENTERED: sendReminderPing')

  // ✅ Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let payload
  try {
    const rawBody = await getRawBody(req)
    payload = JSON.parse(rawBody.toString())
  } catch (err) {
    console.error('❌ Invalid JSON body')
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  console.log('👉 Incoming body:', payload)

  const { subject, body: messageBody, date, childId } = payload

  try {
    if (!db?.app?.name) {
      throw new Error('❌ Firebase DB not initialized. Check env vars in Vercel.')
    }

    if (subject && messageBody && childId) {
      await db.collection('reminders').add({
        subject,
        body: messageBody,
        date: date || null,
        childId,
        parsed: true,
        createdAt: new Date().toISOString(),
        source: 'make',
      })

      console.log(`📬 Custom reminder saved for child: ${childId}`)
      return res.status(200).json({ status: 'Custom reminder saved' })
    }

    // ... remainder unchanged ...
