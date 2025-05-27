// lib/firestore.ts

import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore'

let app: App

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

// 🔒 Log and hard-fail if config is missing
if (!projectId || !clientEmail || !privateKey) {
  console.warn('❌ Firebase config missing — Firestore will not initialize')
  throw new Error('Missing Firebase credentials in environment variables')
}

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
} else {
  app = getApps()[0]
}

export function getFirestore() {
  return getAdminFirestore(app)
}
