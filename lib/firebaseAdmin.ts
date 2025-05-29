console.log('✅ firebaseAdmin.ts LOADED')

import * as admin from 'firebase-admin'

// 🧪 Log ENV checks for confirmation
console.log('🔍 ENV FULL CHECK:', {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeyExists: !!process.env.FIREBASE_PRIVATE_KEY,
  privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
})

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined

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
