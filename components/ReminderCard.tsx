import { format } from 'date-fns'

export function ReminderCard({ reminder }) {
  const { subject, body, date, origin } = reminder

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2 border border-slate-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#004225]">
          {subject || 'Untitled Reminder'}
        </h3>
        {origin === 'gmail' && (
          <span className="text-sm text-slate-500 flex items-center gap-1">
            ✉️ <span className="hidden sm:inline">via Gmail</span>
          </span>
        )}
      </div>

      <p className="text-sm text-slate-700">
        {body?.trim() ? body : <em className="text-slate-400">No details provided.</em>}
      </p>

      <p className="text-xs text-slate-500">
        {date ? format(new Date(date), 'eee d MMM, yyyy') : 'No date'}
      </p>
    </div>
  )
}
