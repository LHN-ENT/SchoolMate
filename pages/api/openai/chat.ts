import OpenAI from 'openai'
export default async function handler(req, res) {
  const { prompt } = await req.json()
  // stub using environment key
  res.status(200).json({ reply: "This is a stub response to '" + prompt + "'" })
}
