// 🔔 FILE: pages/_app.tsx

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { requestNotificationPermission } from '@/lib/firebaseMessaging'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
