import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from '@/lib/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const db = getFirestore()
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
    }

    await db.collection('test_write_check').add(testDoc)

    return res.status(200).json({ message: '✅ Firestore write successful' })
  } catch (err: any) {
    console.error('Firestore write failed:', err)
    return res.status(500).json({ error: 'Firestore write error' })
  }
}
