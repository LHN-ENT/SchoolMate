import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is already initialized
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('[Firebase] Missing config. Check environment variables.');
  }
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const db = getFirestore(firebaseApp);

export { firebaseApp, db };
