import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = process.env.FIREBASE_PRIVATE_KEY
  const length = key?.length ?? 0
  const firstChunk = key?.slice(0, 40)
  const lastChunk = key?.slice(-40)

  res.status(200).json({
    detected: key ? true : false,
    length,
    firstChunk,
    lastChunk
  })
}
