import { useState } from 'react'

type ReminderFormProps = {
  onSuccess: () => void
}

export default function ReminderForm({ onSuccess }: ReminderFormProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, date }),
      })
      if (!res.ok) throw new Error('Failed to create reminder')
      setSubject('')
      setBody('')
      setDate('')
      onSuccess()
    } catch (err) {
      setError('Failed to create reminder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div>
        <label>
          Subject:
          <input
            className="border rounded px-2 py-1 ml-2"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Body:
          <textarea
            className="border rounded px-2 py-1 ml-2"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={2}
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Date:
          <input
            type="date"
            className="border rounded px-2 py-1 ml-2"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            disabled={loading}
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Adding…' : 'Add Reminder'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  )
}
