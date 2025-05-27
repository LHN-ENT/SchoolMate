import type { NextApiRequest, NextApiResponse } from 'next'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }

    const db = getFirestore()
    const snapshot = await db.collection('users').limit(1).get()

    res.status(200).json({ message: '✅ Firestore live', count: snapshot.size })
  } catch (err: any) {
    console.error('⚠️ Firestore direct ping failed:', err)
    res.status(500).json({ error: 'Firestore test failed', details: err.message })
  }
}
