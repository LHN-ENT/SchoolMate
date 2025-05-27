import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from '@/lib/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const db = getFirestore()
    const snapshot = await db.collection('users').limit(1).get()

    return res.status(200).json({ message: '✅ Firestore read successful', count: snapshot.size })
  } catch (err: any) {
    console.error('Firestore read failed:', err)
    return res.status(500).json({ error: 'Firestore read error' })
  }
}
