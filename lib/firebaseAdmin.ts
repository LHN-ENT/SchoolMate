console.log('✅ firebaseAdmin.ts LOADED')

import * as admin from 'firebase-admin'

// 🔍 TEMP DIAGNOSTIC LOG
console.log('🔍 ENV RAW CHECK:', {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeySample: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 40),
  privateKeyEndsWith: process.env.FIREBASE_PRIVATE_KEY?.slice(-20)
})

// 🚫 DISABLE INIT FOR NOW — JUST LOGGING
const dbAdmin = {} as any // Temp dummy export to avoid crashing
export { dbAdmin }
