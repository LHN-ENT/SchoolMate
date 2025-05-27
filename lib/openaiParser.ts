import { OpenAIApi, Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function getOpenAIResponse(subject: string, body: string) {
  const prompt = `
You are a school email parser. Given a subject and body of a school-related email, return the following fields as JSON:

{
  "child": "Reilly",                // or null if unknown
  "title": "Library Day Reminder",  // summary of what the email is about
  "notes": "Bring library bag",     // parent-facing notes
  "date": "2025-06-10",             // if found
  "tags": ["library", "reminder"],
  "type": "reminder",               // reminder, info, digest_only
  "boosted": true                   // true if time-sensitive or gear required
}

Subject: ${subject}

Body:
${body}
  `

  const res = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  })

  const raw = res.data.choices[0].message?.content || '{}'
  return JSON.parse(raw)
}
