import { dbAdmin as db } from './firebaseAdmin'; // Adjust if your Firestore admin import is different

export interface FirestoreReminder {
  id?: string;                // Firestore doc id (optional on create)
  parentId: string;
  childId?: string;
  subject: string;
  body?: string;
  date: string;
  boosted?: boolean;
  confirmed?: boolean;
  source?: string;
  createdAt?: string;
}

const COLLECTION = 'reminders';

export async function createReminder(reminder: Omit<FirestoreReminder, 'id'>): Promise<FirestoreReminder> {
  const createdAt = new Date().toISOString();
  const docRef = await db.collection(COLLECTION).add({ ...reminder, createdAt });
  return { id: docRef.id, ...reminder, createdAt };
}

export async function getReminders(parentId: string): Promise<FirestoreReminder[]> {
  const snap = await db.collection(COLLECTION).where('parentId', '==', parentId).get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreReminder));
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await db.collection(COLLECTION).doc(reminderId).delete();
}
