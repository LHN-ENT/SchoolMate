type Reminder = {
  id: string;
  subject: string;
  body?: string;
  date: string;
  parentId: string;
  // add any other fields you use
};

export function ReminderCard({ reminder }: { reminder: Reminder }) {
  return (
    <div className="border rounded p-3 mb-2">
      <div className="font-bold">{reminder.subject}</div>
      {reminder.body && <div className="text-gray-700">{reminder.body}</div>}
      <div className="text-xs text-gray-400">{reminder.date}</div>
    </div>
  );
}
