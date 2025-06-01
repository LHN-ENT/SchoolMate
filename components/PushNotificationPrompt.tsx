import { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { app } from '@/lib/firebaseClient'

export default function PushNotificationPrompt() {
  const [permission, setPermission] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    setPermission(Notification.permission)

    const messaging = getMessaging(app)

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    })
      .then((currentToken) => {
        if (currentToken) {
          setToken(currentToken)
        }
      })
      .catch((err) => {
        console.error('Failed to get FCM token:', err)
      })

    onMessage(messaging, (payload) => {
      setMessage(payload?.notification?.title || 'New notification received')
    })
  }, [])

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
    } catch (err) {
      console.error('Permission request failed:', err)
    }
  }

  const sendTestNotification = async () => {
    await fetch('/api/sendTestNotification', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (permission === 'granted') return null

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded p-4 mb-4">
      <p className="text-sm text-yellow-800 mb-2">
        🔔 Enable push notifications to get daily reminders.
      </p>
      <button
        onClick={requestPermission}
        className="bg-[#004225] text-white px-3 py-1 rounded text-sm"
      >
        Enable Notifications
      </button>

      {token && (
        <button
          onClick={sendTestNotification}
          className="ml-3 border border-[#004225] text-[#004225] px-3 py-1 rounded text-sm"
        >
          Send Test
        </button>
      )}

      {message && (
        <p className="mt-2 text-sm text-green-700">
          ✅ {message}
        </p>
      )}
    </div>
  )
}
