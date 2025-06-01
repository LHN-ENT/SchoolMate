import * as admin from 'firebase-admin'

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined

if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Firebase Admin ENV vars missing. Skipping admin init.')
  } else {
    throw new Error('❌ Firebase Admin SDK credentials are missing. Check environment variables.')
  }
} else if (!admin.apps.length) {
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
