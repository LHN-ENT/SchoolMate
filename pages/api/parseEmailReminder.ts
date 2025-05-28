import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subject, body, childId } = req.body;

  if (!subject || !body || !childId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Attempt to extract a title and date from the body
    const lowerBody = body.toLowerCase();

    // Simple heuristic: look for known formats
    const dateMatch = body.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/) || body.match(/\b(\d{1,2} [A-Za-z]+ \d{4})\b/);
    const date = dateMatch ? dateMatch[0] : null;

    const reminderTitle = subject || 'Untitled Reminder';

    const newReminder = {
      childId,
      title: reminderTitle,
      details: body,
      parsed: true,
      source: 'email',
      createdAt: new Date().toISOString(),
      date, // Optional: extracted from body
    };

    await db.collection('reminders').add(newReminder);
    return res.status(200).json({ message: 'Parsed and saved', reminder: newReminder });
  } catch (error) {
    console.error('Error saving reminder:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
