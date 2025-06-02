import { useEffect, useState } from 'react';
import ReminderForm from './ReminderForm';

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
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
      const res = await fetch('/api/reminders');
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
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </div>
  );
}
