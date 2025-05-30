import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function parseEmailContent(prompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  })

  return res.choices[0].message.content?.trim() || ''
}
