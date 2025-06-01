// 🔔 FILE: public/firebase-messaging-sw.js

/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Received background message: ', payload)

  const { title, body } = payload.notification

  self.registration.showNotification(title, {
    body,
    icon: '/logo192.png',
  })
})
