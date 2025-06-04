import { useEffect, useState } from 'react';
import ReminderForm from './ReminderForm';

type Reminder = {
  id: string;
  subject: string;
  body?: string;
  date: string;
  // Add any other fields your Firestore reminders include
};

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReminders();
    // eslint-disable-next-line
  }, []);

  async function fetchReminders() {
    setLoading(true);
    setError('');
    try {
      // Feel free to add parentId as a query param if required by your API
      const res = await fetch('/api/reminders?parentId=YOUR_PARENT_ID');
      if (!res.ok) throw new Error('Fetch failed');
      setReminders(await res.json());
    } catch {
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Reminders Dashboard</h1>
      <ReminderForm onSuccess={fetchReminders} />
      {loading && <div>Loading reminders…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && reminders.length === 0 && <div>No reminders set.</div>}
      <ul>
        {reminders.map(r => (
          <li key={r.id}>
            <strong>{r.subject}</strong>
            {r.body && <div>{r.body}</div>}
            <div>
              <small>{r.date}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
