import { NextApiRequest, NextApiResponse } from 'next';
import { createReminder, getReminders, deleteReminder } from '../../lib/reminders';

// Improved error handling and logging
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const reminder = await createReminder(req.body);
      return res.status(201).json(reminder);
    }
    if (req.method === 'GET') {
      const reminders = await getReminders();
      return res.status(200).json(reminders);
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) throw new Error('Missing reminder id');
      await deleteReminder(id as string);
      return res.status(204).end();
    }
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Reminder API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
