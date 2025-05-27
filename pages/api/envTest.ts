import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '❌ missing',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '❌ missing',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
      ? '(loaded ✅)'
      : '❌ missing',
  })
}
