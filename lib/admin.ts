import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const rawKey = process.env.FIREBASE_PRIVATE_KEY || ''
const privateKey = rawKey.includes('\\n')
  ? rawKey.replace(/\\n/g, '\n')
  : rawKey // Already parsed by Vercel

const adminConfig = {
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
}

const app = getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0]
const db = getFirestore(app)

export { app, db }
