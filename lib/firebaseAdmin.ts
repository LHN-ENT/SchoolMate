console.log('✅ firebaseAdmin.ts LOADED')

import * as admin from 'firebase-admin'

console.log('✅ firebaseAdmin.ts STARTED')
console.log('🔍 ENV CHECK:', {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeyStartsWith: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30)
})

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined

if (!admin.apps.length) {
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error('❌ Firebase Admin SDK credentials are missing. Check environment variables.')
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })
}

const dbAdmin = admin.firestore()
export { dbAdmin }
