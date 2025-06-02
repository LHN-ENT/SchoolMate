import { useState } from 'react';

export default function ReminderForm({ onSuccess }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to create reminder');
      setText('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Could not create reminder.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={loading}
        placeholder="Enter reminder"
      />
      <button type="submit" disabled={loading || !text}>
        Add Reminder
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
