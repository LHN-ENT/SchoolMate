console.log('✅ firebaseAdmin.ts LOADED')

import * as admin from 'firebase-admin'

console.log('🔍 ENV CHECK:', {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeySample: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 40),
  privateKeyEndsWith: process.env.FIREBASE_PRIVATE_KEY?.slice(-20)
})

const privateKey = process.env.FIREBASE_PRIVATE_KEY || undefined // ← NO `.replace(...)`

if (!admin.apps.length) {
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error('❌ Firebase Admin SDK credentials are missing. Check environment variables.')
  }

  console.log('🛠️ Initializing Firebase Admin...')
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })
} else {
  console.log('✅ Firebase Admin already initialized')
}

const dbAdmin = admin.firestore()
export { dbAdmin }
