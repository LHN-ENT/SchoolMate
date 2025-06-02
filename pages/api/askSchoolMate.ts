// 🧠 FILE: pages/api/askSchoolMate.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { question, childId } = req.body

  if (typeof question !== 'string' || typeof childId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid question or childId' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are SchoolMate AI — a calm, helpful assistant for busy parents. Answer questions clearly, based only on what a school parent would likely know.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    })

    const answer = completion.choices?.[0]?.message?.content?.trim()

    if (!answer) {
      console.warn('⚠️ OpenAI returned empty content')
      return res.status(502).json({ error: 'Empty response from SchoolMate AI' })
    }

    return res.status(200).json({ answer })
  } catch (err: any) {
    console.error('❌ askSchoolMate error:', err?.message || err)
    return res.status(500).json({
      error: 'SchoolMate AI failed to respond. Try again shortly.',
    })
  }
}
