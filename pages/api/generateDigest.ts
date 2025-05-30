import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { child, prefs } = req.body

  if (!child || !child.name) {
    return res.status(400).json({ error: 'Missing child data' })
  }

  const today = new Date().toLocaleDateString('en-SG', { weekday: 'long' })
  const lines = [`📅 Hi ${(child.name ?? 'your child')}'s Parent! Here's what’s on today (${today}):`, '']

  if (child.schedule?.[today]?.includes('PE')) {
    lines.push('🟢 PE — Pack sports uniform')
  }
  if (child.schedule?.[today]?.includes('Library')) {
    lines.push('📚 Library — Bring library books')
  }
  if (child.schedule?.[today]?.includes('House Sport')) {
    lines.push('🏅 House Sport — Sports uniform needed')
  }
  if (child.schedule?.[today]?.includes('Music')) {
    lines.push('🎵 Music Class today')
  }
  if (child.schedule?.[today]?.includes('Art')) {
    lines.push('🎨 Art Class today')
  }

  if (child.aftercare) {
    lines.push('🕓 After School Care today — pick up later')
  }

  if (child.transport === 'bus') {
    lines.push('🚌 Going home by bus')
  } else if (child.transport === 'walk') {
    lines.push('🚶 Walking home')
  } else {
    lines.push('🚗 You’re doing school pickup')
  }

  if (lines.length === 2) {
    lines.push('✅ Nothing special today. Normal schedule.')
  }

  const digest = lines.join('\n')
  return res.status(200).json({ digest })
}
