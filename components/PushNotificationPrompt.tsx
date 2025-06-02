import { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { db, app } from '@/lib/firebaseClient'
import { useSession } from 'next-auth/react'
import { doc, setDoc } from 'firebase/firestore'

export default function PushNotificationPrompt() {
  const { data: session } = useSession()
  const [permission, setPermission] = useState(Notification?.permission || 'default')
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'error'>('idle')

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const setupPushNotifications = async () => {
      try {
        const result = await Notification.requestPermission()
        setPermission(result)

        if (result === 'granted') {
          const messaging = getMessaging(app)
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          })

          if (fcmToken && session?.user?.email) {
            await setDoc(
              doc(db, 'parentSettings', session.user.email),
              { fcmToken },
              { merge: true }
            )
            setToken(fcmToken)
            setStatus('subscribed')
          }
        } else {
          setStatus('denied')
        }
      } catch (err) {
        console.error('Notification setup failed:', err)
        setStatus('error')
      }
    }

    setupPushNotifications()

    const messaging = getMessaging(app)
    onMessage(messaging, (payload) => {
      console.log('Push message received:', payload)
    })
  }, [session])

  if (status === 'subscribed' || permission === 'denied') return null

  return (
    <div className="text-sm text-gray-600 italic">
      {status === 'idle' && 'Enabling push notifications...'}
      {status === 'error' && 'Push notification setup failed.'}
    </div>
  )
}
