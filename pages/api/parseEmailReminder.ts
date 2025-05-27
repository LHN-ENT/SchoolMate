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
    await db.collection('reminders').add({
      subject,
      body,
      childId,
      createdAt: new Date().toISOString(),
      parsed: true,
    });
    return res.status(200).json({ message: 'Reminder parsed and saved' });
  } catch (error) {
    console.error('Error saving reminder:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
