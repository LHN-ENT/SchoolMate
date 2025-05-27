import { initializeApp, getApps } from 'firebase/app'
import { getFirestore as getFS, getFirestore as getAdminFS } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
}

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

export function getFirestore() {
  return getFS()
}
