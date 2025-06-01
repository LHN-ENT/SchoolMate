import { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { app } from '@/lib/firebaseClient'

export default function PushNotificationPrompt() {
  const [permission, setPermission] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) return

    setPermission(Notification.permission)

    const messaging = getMessaging(app)

    navigator.serviceWorker.ready
      .then(() =>
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })
      )
      .then((currentToken) => {
        if (currentToken) {
          setToken(currentToken)
        } else {
          console.warn('No registration token available.')
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token.', err)
      })

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload)
      setMessage(JSON.stringify(payload))
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="text-sm text-gray-500 p-4">
      <p>🔔 Notifications: {permission || 'N/A'}</p>
      {token && <p className="break-all">Token: {token}</p>}
      {message && <p className="text-green-600">Message: {message}</p>}
    </div>
  )
}
