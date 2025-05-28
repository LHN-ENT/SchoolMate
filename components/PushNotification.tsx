import { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDNczkrum3lvYZqxwg2lX4FeKT4tTaCF7I",
  authDomain: "schoolmate-caebf.firebaseapp.com",
  projectId: "schoolmate-caebf",
  storageBucket: "schoolmate-caebf.firebasestorage.app",
  messagingSenderId: "1000399188424",
  appId: "1:1000399188424:web:54ecb32632a45e2dd210fd"
}

export default function PushNotification() {
  const [permission, setPermission] = useState(Notification.permission)
  const [token, setToken] = useState('')

  useEffect(() => {
    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        setPermission(perm)
        if (perm === 'granted') {
          getToken(messaging, {
            vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE'
          }).then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken)
              setToken(currentToken)
              // Optional: send to backend
            } else {
              console.warn('No registration token available.')
            }
          }).catch((err) => {
            console.error('An error occurred while retrieving token. ', err)
          })
        }
      })
    }

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
    })
  }, [])

  return (
    <div className="text-sm text-gray-600">
      Notifications: {permission === 'granted' ? 'Enabled' : 'Not granted'}
      {token && <div className="mt-1 break-all">Token: {token}</div>}
    </div>
  )
}
