import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { query, child } = req.body
  if (!query || !child) return res.status(400).json({ error: 'Missing query or child context' })

  try {
    const { OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `You are a helpful school assistant for a parent. 
Here is their question: "${query}"

Child details:
- Name(s): ${child?.children?.map(c => c.name).join(', ') || 'Unknown'}
- Teacher(s): ${child?.children?.map(c => c.teacher).join(', ') || 'Unknown'}
- Year(s): ${child?.children?.map(c => c.year).join(', ') || 'Unknown'}
- PE Days: ${child?.children?.map(c => c.peDays?.join(', ') || 'None').join(' | ')}
- Library Days: ${child?.children?.map(c => c.libraryDays?.join(', ') || 'None').join(' | ')}
- House Sport Days: ${child?.children?.map(c => c.houseSportDays?.join(', ') || 'None').join(' | ')}
- Extra Activities: ${JSON.stringify(child?.children?.map(c => c.activities || {}))}`

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are SchoolMate, an assistant for school reminders and parent Q&A.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })

    const answer = chat.choices[0]?.message?.content ?? 'No response generated.'
    res.status(200).json({ answer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
}
