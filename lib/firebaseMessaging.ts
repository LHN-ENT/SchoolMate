// 🚑 FILE: lib/firebaseMessaging.ts

import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

let messaging: ReturnType<typeof getMessaging> | null = null

if (typeof window !== 'undefined') {
  const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  }

  const app = initializeApp(firebaseConfig)
  messaging = getMessaging(app)
}

export const requestNotificationPermission = async () => {
  if (!messaging) return null

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('❌ Notification permission denied')
      return null
    }

    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY',
    })

    console.log('📲 FCM Token:', token)
    return token
  } catch (err) {
    console.error('❌ Error getting push token:', err)
    return null
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return
    onMessage(messaging, (payload) => {
      console.log('📩 Foreground message:', payload)
      resolve(payload)
    })
  })
