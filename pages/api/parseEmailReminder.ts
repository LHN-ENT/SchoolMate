import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from '@/lib/firestore' // just imported, not used

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  return res.status(200).json({ message: '✅ Firestore import successful' })
}
