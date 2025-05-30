// 🔥 FILE: pages/api/sendBoostedReminders.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbAdmin as db } from '../../lib/firebaseAdmin'

async function getUserPreferences(parentId: string) {
  const prefsSnap = await db.doc(`users/${parentId}/preferences/settings`).get()
  return prefsSnap.exists ? prefsSnap.data() : {}
}

async function getUserProfile(parentId: string) {
  const profileSnap = await db.doc(`users/${parentId}/childProfile/info`).get()
  return profileSnap.exists ? profileSnap.data() : {}
}

function getTasksForChild(child: any, today: string): string[] {
  const tasks: string[] = []
  if (child.peDays?.includes(today)) {
    tasks.push('PE today – pack uniform')
  }
  if (child.libraryDays?.includes(today)) {
    tasks.push('Library today – return books')
  }
  if (child.houseSportDays?.includes(today)) {
    tasks.push('House Sport today – sports gear needed')
  }
  const activity = child.activities?.[today]
  if (activity) {
    tasks.push(`${activity} today`)
  }
  return tasks
}

async function createRemindersForChild(parentId: string, child: any, today: string) {
  const childId = child.id || `${parentId}_${child.name?.toLowerCase() || 'child'}`
  const tasks = getTasksForChild(child, today)
  const date = new Date().toISOString().split('T')[0]
  const createdAt = new Date().toISOString()

  for (const task of tasks) {
    await db.collection('reminders').add({
      parentId,
      childId,
      subject: task,
      body: '',
      date,
      boosted: true,
      confirmed: false,
      source: 'boosted',
      createdAt
    })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  try {
    const usersSnapshot = await db.collection('users').get()
    const userDocs = usersSnapshot.docs

    for (const userDoc of userDocs) {
      const parentId = userDoc.id
      const prefs = await getUserPreferences(parentId)
      if (!prefs.boostedReminders) continue

      const profile = await getUserProfile(parentId)
      if (!profile.children || !Array.isArray(profile.children)) continue

      for (const child of profile.children) {
        await createRemindersForChild(parentId, child, today)
      }
    }

    res.status(200).json({ status: 'Boosted reminders sent' })
  } catch (error) {
    console.error('❌ Boosted reminder error:', error)
    res.status(500).json({ error: 'Failed to send boosted reminders' })
  }
}
