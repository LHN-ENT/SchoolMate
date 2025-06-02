let reminders: { id: string; text: string }[] = [];

export async function createReminder({ text }: { text: string }) {
  if (!text) throw new Error('Reminder text required');
  const reminder = { id: Date.now().toString(), text };
  reminders.push(reminder);
  return reminder;
}

export async function getReminders() {
  return reminders;
}

export async function deleteReminder(id: string) {
  const idx = reminders.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Reminder not found');
  reminders.splice(idx, 1);
}
